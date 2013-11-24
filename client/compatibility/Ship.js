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
function Ship(descr,instance) {
    // Common inherited setup logic from Entity
    this.setup(descr,instance);
    var inst = this.instance;
    this.parts = this.parts.map(function(x){
        var p =  new Part(inst,x);
        return p;
    });
    this.rememberResets();
    
    // Default sprite, if not otherwise specified
	/*
    this.sprite = this.sprite || g_sprites.lunarLander;
    this.width = this.sprite.width;
    this.height = this.sprite.height;
	*/
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
    if(this.parts.length > 0){
        if(this.origCenter){
            this.attributesFromParts();
        }
    }
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
Ship.prototype.cx = 0;
Ship.prototype.cy = -1000;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;
Ship.prototype._explosionFrame = 0;
Ship.prototype._explosionDuration = 0;
Ship.prototype._timeFromExplosion = 0;
Ship.prototype._explosionRadius = 0;
Ship.prototype._explosionSpeed = 0;
Ship.prototype._explCraterAdded = false;
Ship.prototype._isExploding = false;
Ship.prototype.throttle = 0;
Ship.prototype.thrust = 0;
Ship.prototype.fuel = 0;
Ship.prototype.efficiency = 1;
Ship.prototype.maxThrust = 0.2;
Ship.prototype.mass = 1;
Ship.prototype.angularVel = 0;
Ship.prototype.torque = 0;
Ship.prototype.parts = [];
Ship.prototype.sizeGrid;
Ship.prototype.isMain = true;
Ship.prototype.timeAlive = 0;
Ship.prototype.immuneTime = 100;


Ship.prototype.attributesFromParts = function () {
    if(this.parts.length === 1){
        var p = this.parts[0];
        this.height  = p.height;
        this.width  = p.width;
        this.center = p.center;
        this.origCenter = this.origCenter || p.center;
        this.radius = Math.min(this.height,this.width)/2;
        this.setCenter(this.center);
    } else {
        var numParts = this.parts.length;
        var totalMass = 0;
        this.fuel = 0;
        this.maxThrust = 0;
        this.mass = 0;
        for(var i = 0; i<numParts; i++) {
            this.mass+=this.parts[i].mass;
            totalMass+=this.parts[i].mass;
            this.fuel+=this.parts[i].fuel;
            this.maxThrust+=this.parts[i].thrust;
        }
        var maxx = Math.max.apply(null, this.parts.map(function (p){ return p.hitBox[0][0];}));
        var minx = Math.min.apply(null, this.parts.map(function (p){ return p.hitBox[1][0]}));
        var maxy = Math.max.apply(null, this.parts.map(function (p){return p.hitBox[1][1]}));
        var miny = Math.min.apply(null, this.parts.map(function (p){return p.hitBox[0][1]}));
        var weightedXCenters = this.parts.map(function (x){return (x.mass/totalMass)*x.center[0]});
        var weightedYCenters = this.parts.map(function (x){return (x.mass/totalMass)*x.center[1]});
        this.height = Math.abs(maxy-miny);
        this.width = Math.abs(maxx-minx);
        this.xMassCenter = weightedXCenters.reduce(function (x,y) {return x+y});
        this.yMassCenter = weightedYCenters.reduce(function (x,y){return x+y});
        this.center = [this.xMassCenter,this.yMassCenter];
        this.origCenter = this.origCenter || this.center; 
    }

    this.radius = Math.min(this.height,this.width)/2;
    this.setCenter([this.cx,this.cy]);
}

Ship.prototype.setCenter = function(newCenter) {
    if(this.center === undefined){
        this.center = [this.reset_cx,this.reset_cy];
    }
    if(newCenter === undefined){
        newCenter = [0,0];
    }
    var diff = util.vecMinus(newCenter,this.center);
    this.parts.map(function (p) { p.updateCenter(util.vecPlus(diff,p.center));});
    this.center = newCenter;
    this.cx = newCenter[0];
    this.cy = newCenter[1];
};

Ship.prototype.assemble = function(grid) {
    //Assembles the ship from its parts
    this.parts.map(function(x) { x.finalize(grid,false);});
    this.parts.map(function(x) { x.lineWidth = 1;});

    this.attributesFromParts();
    var cen = this.center;
    this.parts.map(function(x) { x.centerOfRot = cen;});
};

Ship.prototype.disassemble = function(grid) {
    //Disassembles the ship and puts the parts back into normal form
    var cen = this.center;
    if(this.origCenter){
        this.setCenter(this.origCenter);
    }
    this.parts.map(function(x) { x.lineWidth = 4;});
    this.parts.map(function(x) { x.toDesigner(grid);});
    return this;
};


Ship.prototype.getAltitude = function () {
	var terr= this.instance.entityManager.getTerrain(this.cx,this.cy);
	var centerDist=Math.sqrt(util.distSq(this.cx,this.cy,terr.center[0],terr.center[1]));
    return (centerDist - terr.minY + this.height/2);
    };


Ship.prototype._updateVectorExplosion = function (du){
    if(this._timeFromExplosion < this._explosionDuration/2){
	    //entityManager.getTerrain().addCrater(this._explosionX,this._explosionY,this.getRadius(),this._explosionRadius, this._explosionSpeed);
	    this.instance.entityManager.getTerrain(this._explosionX,this._explosionY).addCrater(this._explosionX,this._explosionY,this.getRadius(),this.currentExplosionRadius, this._explosionSpeed);
    }
    if (this._timeFromExplosion > this._explosionDuration){
	this._explCraterAdded = false;
	this._explosionRadius = 0;
    }

    if(this._timeFromExplosion > this._explosionDuration + 200){
	this._isExploding = false;
	this._explosionDuration = 0;
	this._timeFromExplosion = 0;
	if(this.isMain){
	    this.instance.entityManager.createInitialShips();
	    }
	return this.instance.entityManager.KILL_ME_NOW;
	}
    
}

Ship.prototype._updateExplosion = function (du) {
    this._timeFromExplosion += du;
    if (this.instance.settings.spriteExplosion){
	return this._updateSpriteExplosion(du);
    }
    else {
	return this._updateVectorExplosion(du);
    }
}
    
    
Ship.prototype.update = function (du) {

    this.timeAlive += du;
    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    if (this._isExploding) {
	return this._updateExplosion(du);
	}
    
    this.unregister(this);
    if (this._isDeadNow)
	return this.instance.entityManager.KILL_ME_NOW;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }
    

    var hitEnt = this.isColliding();
    if (hitEnt){
        this.explode(this.cx,this.cy,this.getSpeed());
        if (hitEnt.getSpeed){
            hitEnt.explode(hitEnt.cx,hitEnt.cy,hitEnt.getSpeed());
        }
        
    }    
    if ( !(hitEnt) && !(this._isExploding) && this.timeAlive >= this.immuneTime) this.register(this);
    

    //Orbit only changes when the orbiting body changes
    //or thrust is applied.
    var tN = this.instance.entityManager.getTerrain(this.cx,this.cy).name;
    if(this.thrust > 0 || (this.primaryBodyName && !(tN.localeCompare(this.primaryBodyName)))  ){
          this.updateOrbit();
    }
    this.primaryBodyName = tN;
};

Ship.prototype.getSpeed = function () {
    var speed = Math.sqrt(this.velX*this.velX + this.velY*this.velY);
    return speed;
}

Ship.prototype.computeSubStep = function (du) {

    var accel = this.computeForces(du);
    this.applyAccel(accel, du);
};

Ship.prototype.computeForces = function (du) {
    this.computeThrustMag(du);
    this.computeTorqueMag(du);
    
    // Apply thrust directionally, based on our rotation
    //TODO: use intervalRot;
    var accelX = +Math.sin(this.rotation) * this.thrust;
    var accelY = -Math.cos(this.rotation) * this.thrust;
    var GForce= this.computeGravity();
	accelX += GForce[0];
	accelY += GForce[1];
    var accelRot = this.torque/this.mass;
    
    return [accelX,accelY,accelRot];
};

Ship.prototype.applyRotation = function(angularAccel,du) {
    var oldAngVel = this.angularVel;
    this.angularVel += angularAccel*du;
    var newAngVel = this.angularVel;
    var intervalAngularVel = (oldAngVel + newAngVel)/2;
    var newRot = (this.rotation + intervalAngularVel*du)%(2*Math.PI);
    var terrainHit;
    for(var i = 0; i < this.parts.length; i++){
        var p = this.parts[i];
        var d = p.getHitBoxDimensions();
        var r = p.getRadius();
        var x = p.hitBox[0][0];
        var y = p.hitBox[0][1];
        var nx = x;
        var ny = y;
        terrainHit = this.instance.entityManager.getTerrain(this.cx,this.cy).hit(x,y,nx,ny,r,d[0],d[1],newRot,p.centerOfRot);
    if(terrainHit[0]) break;
    }
    if (!(terrainHit[0])){
        this.rotation = newRot;
	    this.parts.map(function (x){ x.updateRot(newRot)});
    }
};

var NOMINAL_GRAVITY = 0.02;

Ship.prototype.computeGravity = function () {
	if(!this.instance.settings.useGravity) return 0;
	var gravAccel=this.instance.entityManager.gravityAt(this.cx,this.cy);
	return gravAccel;
};


Ship.prototype.computeThrustMag = function (du) {


    if (this.instance.entityManager.getMainShip() === this){

	if (keys[this.instance.settings.keys.KEY_THRUST]) {
	    this.throttle += this.throttle < 100 ? 1 : 0;
	}
	if (keys[this.instance.settings.keys.KEY_RETRO]) {
	    this.throttle -= this.throttle > 0 ? 1 : 0;
	}
	if (eatKey(this.instance.settings.keys.KEY_KILLTHROTTLE)) {
	    this.throttle = 0;
	    }
	}
    
    this.thrust = this.maxThrust*this.throttle/100;
    this.fuel -= du*this.thrust/this.efficiency;
    if (this.fuel <= 0){
	this.fuel = 0;
	this.thrust = 0;
	}
    var t = this.thrust;
    var mt = this.maxThrust;
    this.parts.map(function (p) { p.currentThrust = t*p.thrust/mt});
    return this.thrust;
};

Ship.prototype.applyAccel = function (accel,du) {
    var accelX = accel[0];
    var accelY = accel[1];
    var accelRot = accel[2];

    this.applyRotation(accelRot,du);
    
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
    var intervalVelX = this.instance.settings.useAveVel ? aveVelX : this.velX;
    var intervalVelY = this.instance.settings.useAveVel ? aveVelY : this.velY;
    
    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;

    // bounce
    if (this.instance.settings.useGravity) {
        if (this.instance.settings.hitBox){
            var terrainHit;
            for(var i = 0; i < this.parts.length; i++){
                var p = this.parts[i];
                var d = p.getHitBoxDimensions();
                var r = p.getRadius();
                var x = p.hitBox[0][0];
                var y = p.hitBox[0][1];
                var nx = x + (nextX - this.cx);
                var ny = y + (nextY - this.cy);
                terrainHit = this.instance.entityManager.getTerrain(this.cx,this.cy).hit(x,y,nx,ny,r,d[0],d[1],p.rotation,p.centerOfRot);
                if(terrainHit[0]) break;
            }
        } else {
            var terrainHit = this.instance.entityManager.getTerrain(this.cx,this.cy).hit(this.cx,this.cy,nextX,nextY,
                    this.getRadius());
        }
	if (terrainHit[0]) {
	    var collisionSpeed = terrainHit[1];
	    var collisionAngle = terrainHit[2];
	    this.velX = oldVelX*-0.9*Math.sin(collisionAngle);
	    this.velY = oldVelY * -0.9*Math.cos(collisionAngle);
        intervalVelY = this.velY;
        intervalVelX = this.velX;
	    if (collisionSpeed <= this.instance.settings.minLandingSpeed && Math.abs(this.rotation - collisionAngle)<=this.instance.settings.maxSafeAngle){
		this.land(this.cx,this.cy);
		intervalVelY = this.velY;
		intervalVelX = this.velX;
		}
	    if (collisionSpeed > this.instance.settings.maxSafeSpeed || Math.abs(this.rotation-collisionAngle)>this.instance.settings.maxSafeAngle)
		{
		    this.explode(this.cx,this.cy,collisionSpeed);
		    
		    }
        }
    }
    
    // s = s + v_ave * t
    if(! this._isExploding){
        if(isNaN(du) || isNaN(intervalVelX)){
            debugger; 
        }
        this.cx += du * intervalVelX;
        this.cy += du * intervalVelY;
        this.setCenter([this.cx,this.cy]);
    }
};




Ship.prototype.explode = function(x,y,speed){
    this.unregister(this);
    this._isExploding = true;
    this.velX = 0;
    this.velY = 0;
    var radius = this.getRadius();
    this._explosionSpeed = speed;
    var explRadius = radius*2 + radius*speed/15 + (this.fuel/750)*radius;
    this._explosionRadius = explRadius;
    this._explosionX = x;
    this._explosionY = y;
    this._explosionDuration = 36;
    if(this.parts.length >= 2){
	for(var i = 0; i < this.parts.length; i++){
	    var part = this.parts[i];
	    var c = part.center;
	    var vecFromExpl = util.vecMinus(c,[x,y]);
	    var disFExpl = util.lengthOfVector(vecFromExpl);
	    var vel = util.mulVecByScalar(0.03*explRadius/disFExpl + 0.005*disFExpl,vecFromExpl);
            this.parts.map(function (p) {p.reset();});
	    var ship = new Ship(this.instance, {"parts": [this.parts[i]], "cx": c[0], "cy": c[1], "isMain": false, "rotation": this.rotation, "velX": vel[0], "velY": vel[1], "thrust": this.thrust, "throttle":this.throttle });
	    ship.attributesFromParts();
	    this.instance.entityManager.generateShip(ship);
	    }
    this.parts = [];
    }
    
};
    

Ship.prototype.land = function(prevX,prevY) {
    this.cx = prevX;
    this.cy = prevY;
    this.velY = 0;
    this.velX = 0;
    this.angularVel = 0;
    //this.applyFriction();
    }

Ship.prototype.applyFriction = function (){
    this.velX *= 0.98;
    if (Math.abs(this.velX) <= this.instance.settings.minFrictSpeed){
	this.velX = 0;
	}
};
    

Ship.prototype.getRadius = function () {
    
    return (Math.max(this.width,this.height) / 2) * 0.9;
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
var NOMINAL_TORQUE_RATE = 0.001;

Ship.prototype.computeTorqueMag = function (du) {
    this.torque = 0;
    if(this.instance.entityManager.getMainShip() === this){
	if (keys[this.instance.settings.keys.KEY_LEFT]) {
	    this.torque -= NOMINAL_TORQUE_RATE;
	}
	if (keys[this.instance.settings.keys.KEY_RIGHT]) {
	    this.torque += NOMINAL_TORQUE_RATE;
	}
	}

};

Ship.prototype._renderExplosion = function (ctx) {
	this._renderVectorExplosion(ctx);
};

Ship.prototype._renderVectorExplosion = function (ctx) {
    ctx.save();
    ctx.fillStyle = "white";
    var radRatio = 1-Math.abs(2*this._timeFromExplosion/this._explosionDuration - 1);
    this.currentExplosionRadius =  radRatio* this._explosionRadius;
    util.fillCircle(ctx,this.cx,this.cy+this.getRadius(),this.currentExplosionRadius);
    ctx.restore();
    
};


Ship.prototype.renderCenter = function(ctx){
ctx.strokeStyle = "white";
util.strokeCircle(ctx,this.cx,this.cy,5);
}

Ship.prototype.renderParts = function(ctx){
    ctx.save();
    this.parts.map(function (x) {x.render(ctx)});
    ctx.restore();
}

Ship.prototype.renderHitBox = function(ctx){
    ctx.save();
    this.parts.map(function(x){x.renderHitBox(ctx)});
    ctx.restore();
};

Ship.prototype.updateOrbit = function() {
    //Calculate orbit from orbital state vectors
    //See wikipedia for details
    var terr = this.instance.entityManager.getTerrain(this.cx,this.cy);
    var f = terr.center;
    var M = terr.mass;
    var mu = consts.G*(M+this.mass);

    var r = util.vecMinus(this.center,terr.center);
    var v = [this.velX,this.velY];

    var speed = this.getSpeed(); 
    var eng = (speed*speed)/2 - (mu/util.lengthOfVector(r));
    var a = -mu/(2*eng);

    var tripleprod = util.tripleProduct(v,r,v);
    var vtimeshovermu = util.mulVecByScalar(1/mu,tripleprod); 
    var unitr = util.normalizeVector(r);
    var eccVec = util.vecMinus(vtimeshovermu,unitr);
    var ecc = util.lengthOfVector(eccVec);
    var ae = a*ecc;
    var b = a*Math.sqrt(1-ecc*ecc);
    var cen = [f[0]-ae,f[1]];

    var angl = util.angleOfVector(eccVec);
    cen = util.rotatePointAroundPoint(cen,angl,f[0],f[1]);
    this.orbit = [cen[0], cen[1],a,b,angl,f[0],f[1]];
}


Ship.prototype.renderOrbit = function(ctx) {
    //Render the orbit
    if(this.orbit){
        var p = this.orbit;
        var cx     = p[0];
        var cy     = p[1];
        var majAx  = p[2];
        var minAx  = p[3];
        var angl   = p[4];
        var fx = p[5];
        var fy = p[6];
        ctx.save();
        ctx.lineWidth = 1/this.instance.entityManager.cameraZoom;
        if(this.instance.settings.enbleDebug){
            ctx.strokeStyle = "yellow"; 
            util.strokeCircle(ctx,fx,fy,200);
            ctx.strokeStyle = "red"; 
            util.strokeCircle(ctx,cx,cy,200);
        }
        ctx.strokeStyle = "dodgerblue"; 
        var angl = util.cartesianToPolar([cx,cy],[fx,fy])[1];
        util.strokeEllipseByCenter(ctx,cx,cy,majAx*2,minAx*2,angl,[cx,cy]);
        ctx.restore();
    }
};

Ship.prototype.render = function (ctx) {
    if (this._isExploding){
    if(this._timeFromExplosion < this._explosionDuration/2){
        this.renderParts(ctx);
    }
	this._renderExplosion(ctx);
    } else {
        //Only render orbit when zoomed out enough
        if(this.instance.entityManager.cameraZoom < 0.3){
            this.renderOrbit(ctx); 
        }
        this.renderParts(ctx);
    }
	
    
};
