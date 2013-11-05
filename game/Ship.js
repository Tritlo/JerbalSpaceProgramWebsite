// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.lunarLander;
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;
Ship.prototype._explosionFrame = 0;
Ship.prototype._explosionDuration = 0;
Ship.prototype._isExploding = false;
Ship.prototype.throttle = 0;
Ship.prototype.thrust = 0;
Ship.prototype.fuel = 500;
Ship.prototype.efficiency = 1;
Ship.prototype.maxThrust = 0.2;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");

Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    this.warpSound.play();
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.2) {
    
        this._moveToASafePlace();
        this.halt();
        this._scaleDirn = 1;
        
    } else if (this._scale > 1) {
    
        this._scale = 1;
        this._isWarping = false;
        
        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
        
    }
};

Ship.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {
    
        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);
        
        this.wrapPosition();
        
        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;
        
    }
};

Ship.prototype.getAltitude = function () {
    return -(this.cy - g_settings.seaLevel/2 + this.height/2);
    }

Ship.prototype._updateExplosion = function (du) {
    this._explosionDuration += du;
    var explSpr = g_sprites.explosion;
    var numframes = explSpr.dim[0]*explSpr.dim[1];
    var frame = Math.floor(numframes * this._explosionDuration/explSpr.duration);
    if (frame <= numframes){
	this._explosionFrame = frame;
        return 0;
	}
    else {
	this._isExploding = false;
	this._explosionDuration = 0;
	createInitialShips();
	return entityManager.KILL_ME_NOW;
	}
    }
    
    
Ship.prototype.update = function (du) {

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    if (this._isExploding) {
	return this._updateExplosion(du);
	}
    
    spatialManager.unregister(this);
    if (this._isDeadNow)
	return entityManager.KILL_ME_NOW;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    
    this.maybeFireBullet();

    if (this.isColliding())    this.warp();
    if ( !(this.isColliding()) && !(this._isExploding)) spatialManager.register(this);

};

Ship.prototype.computeSubStep = function (du) {
    
    this.computeThrustMag();
    this.fuel -= du*this.thrust/this.efficiency;
    if (this.fuel <= 0){
	this.fuel = 0;
	this.thrust = 0;
	}
	

    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * this.thrust;
    var accelY = -Math.cos(this.rotation) * this.thrust;
    
    accelY += this.computeGravity();

    this.applyAccel(accelX, accelY, du);
    
    this.wrapPosition();
    
    if (this.thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};

var NOMINAL_GRAVITY = 0.02;

Ship.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};


Ship.prototype.computeThrustMag = function () {
    
    if (keys[g_settings.keys.KEY_THRUST]) {
	this.throttle += this.throttle < 100 ? 1 : 0;
    }
    if (keys[g_settings.keys.KEY_RETRO]) {
	this.throttle -= this.throttle > 0 ? 1 : 0;
    }
    if (eatKey(g_settings.keys.KEY_KILLTHROTTLE)) {
	this.throttle = 0;
	}
    
    this.thrust = this.maxThrust*this.throttle/100;
    return this.thrust;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {
    
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;
    
    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du; 

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    
    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;
    
    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;
    
    // bounce
    if (g_useGravity) {

	var minY = this.height / 2;
	var maxY = g_canvas.height - minY;

	// Ignore the bounce if the ship is already in
	// the "border zone" (to avoid trapping them there)
	if (this.cy > maxY /*|| this.cy < minY*/) {
	    // do nothing
	} else if (nextY > maxY /*|| nextY < minY*/) {
            this.velY = oldVelY * -0.9;
            intervalVelY = this.velY;
	    if (Math.abs(intervalVelY) <= g_settings.minLandingSpeed && Math.abs(this.rotation)<=g_settings.maxSafeAngle){
		this.land(maxY);
		intervalVelY = this.velY;
		intervalVelX = this.velX;
		}
	    if (Math.abs(intervalVelY) > g_settings.maxSafeSpeed || Math.abs(this.rotation)>g_settings.maxSafeAngle)
		{
		    this._isExploding = true;
		    }
	    
        }
    }
    
    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Ship.prototype.land = function(maxY) {
    this.cy = maxY;
    this.velY = 0;
    this.applyFriction();
    }

Ship.prototype.applyFriction = function (){
    this.velX *= 0.98;
    if (Math.abs(this.velX) <= g_settings.minFrictSpeed){
	this.velX = 0;
	}
    }
    

Ship.prototype.maybeFireBullet = function () {

    if (keys[g_settings.keys.KEY_FIRE]) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);
           
    }
    
};

Ship.prototype.getRadius = function () {
    
    return (Math.max(this.width,this.height) / 2) * 0.9;
};

Ship.prototype.takeBulletHit = function () {
    this.warp();
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.1;

Ship.prototype.updateRotation = function (du) {
    if (keys[g_settings.keys.KEY_LEFT]) {
        this.rotation = (this.rotation - NOMINAL_ROTATE_RATE * du)%(2*Math.PI);
    }
    if (keys[g_settings.keys.KEY_RIGHT]) {
        this.rotation = (this.rotation + NOMINAL_ROTATE_RATE * du)%(2*Math.PI);
    }
};

Ship.prototype.render = function (ctx) {
    if (this._isExploding){
	var origSprite = this.sprite
	this.sprite = g_sprites.explosion;
	var origScale = this.sprite.scale;
	// pass my scale into the sprite, for drawing
	this.sprite.scale = this._scale;
	this.sprite.drawWrappedCentredAt(
	    ctx, this.cx, this.cy, this.rotation, this._explosionFrame
	);
	this.sprite.scale = origScale;
	this.sprite = origSprite;
    } else {
	var origScale = this.sprite.scale;
	// pass my scale into the sprite, for drawing
	ctx.save()
	ctx.strokeStyle = "yellow";
	var x = this.cx;
	var y = this.cy;
	var w = this.width;
	var h = this.height;
	var t = this.thrust/this.maxThrust;
	var rot = this.rotation;
	util.strokeTriangle(ctx,x-w*0.2,y+h*0.3,x+w*0.2,y+h*0.3,x,y+h*t +h*0.3,rot,x,y);
	ctx.strokeStyle = "red";
	util.strokeTriangle(ctx,x-w*0.2,y+h*0.3,x+w*0.2,y+h*0.3,x,y+h*0.6*t +h*0.3,rot,x,y);
	ctx.restore()
	this.sprite.scale = this._scale;
	this.sprite.drawWrappedCentredAt(
	    ctx, this.cx, this.cy, this.rotation
	);
	this.sprite.scale = origScale;
	}
	
    
};
