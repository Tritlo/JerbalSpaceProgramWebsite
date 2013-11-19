    /*

    entityManager.js

    A module which handles arbitrary entity-management for "Asteroids"


    We create this module as a single global object, and initialise it
    with suitable 'data' and 'methods'.

    "Private" properties are denoted by an underscore prefix convention.

    */


    "use strict";


    // Tell jslint not to complain about my use of underscore prefixes (nomen),
    // my flattening of some indentation (white), or my use of incr/decr ops 
    // (plusplus).
    //
    /*jslint nomen: true, white: true, plusplus: true*/


    var entityManager = {

    // "PRIVATE" DATA

    _rocks   : [],
    _bullets : [],
    _ships   : [],

    _terrain : [],

    _bShowRocks : true,


    cameraOffset: [0,0],
    trueOffset: [100,100],
    mouseOffset: [0,0],
    cameraRotation: 0,
    cameraZoom: 1,
    lockCamera: false,

    // "PRIVATE" METHODS
    _generateRocks : function() {
        var i,
            NUM_ROCKS = 4;

        for (i = 0; i < NUM_ROCKS; ++i) {
            this.generateRock();
        }
    },

_generateTerrain : function() {
    
    var sL = g_settings.seaLevel;
    var minangl = Math.PI/30;
    var maxangl = Math.PI/2.2;
    var terr = new Terrain({
	"minX":-10000,
	"maxX": 10000,
	"minY": 3200,
	"maxY": 3500,
	"minLength": 32,
	"maxLength": 256,
	"minAngle": Math.PI/30,
	"maxAngle": Math.PI/2.2,
	"center" : [0,3600],
	"mass" : 100000
	});
    this._terrain = terr;
},

getTerrain : function () {
    return this._terrain;
},

gravityAt : function (x,y) {
	var terr=this._terrain
	var distance=Math.sqrt(util.distSq(x,y,terr.center[0],terr.center[1]));
var force=terr.mass/(distance*distance);
	return util.mulVecByScalar(force/distance ,util.vecMinus(terr.center,[x,y]));
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships,this._terrain];
},

init: function() {
    if (g_settings.enableRocks){
	console.log("generating rocks");
	this._generateRocks();
	}
    this._generateTerrain();
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},

generateRock : function(descr) {
    this._rocks.push(new Rock(descr));
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},

clearShips: function() {
    this._ships.map(function(x){ if(x){ x.kill()}});
},

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},


updateCamera: function () {
    
    if (eatKey(g_settings.keys.KEY_CAMERA_LOCK)) {
        this.lockCamera = !this.lockCamera;
    }
    if (keys[g_settings.keys.KEY_CAMERA_ZOOMIN]) {
	this.cameraZoom *= g_settings.cameraZoomRate;
    }
    if (keys[g_settings.keys.KEY_CAMERA_ZOOMOUT]) {
	this.cameraZoom /= g_settings.cameraZoomRate;
    }
    if (keys[g_settings.keys.KEY_CAMERA_ROTATE_CLOCKWISE]) {
	this.cameraRotation += g_settings.cameraRotateRate;
    }
    if (keys[g_settings.keys.KEY_CAMERA_ROTATE_COUNTERCLOCKWISE]) {
	this.cameraRotation -= g_settings.cameraRotateRate;
    }
    if (keys[g_settings.keys.KEY_CAMERA_UP]) {
	this.cameraOffset = util.vecPlus(this.cameraOffset,util.mulVecByScalar(g_settings.cameraMoveRate/this.cameraZoom,util.rotateVector([0,1], -this.cameraRotation)));
    }										     
    if (keys[g_settings.keys.KEY_CAMERA_DOWN]) {				     
	this.cameraOffset = util.vecPlus(this.cameraOffset,util.mulVecByScalar(g_settings.cameraMoveRate/this.cameraZoom,util.rotateVector([0,-1], -this.cameraRotation)));
    }										     
    if (keys[g_settings.keys.KEY_CAMERA_LEFT]) {				     
	this.cameraOffset = util.vecPlus(this.cameraOffset,util.mulVecByScalar(g_settings.cameraMoveRate/this.cameraZoom,util.rotateVector([1,0], -this.cameraRotation)));
    }										     
    if (keys[g_settings.keys.KEY_CAMERA_RIGHT]) {				     
	this.cameraOffset = util.vecPlus(this.cameraOffset,util.mulVecByScalar(g_settings.cameraMoveRate/this.cameraZoom,util.rotateVector([-1,0], -this.cameraRotation)));
    }
    if (keys[g_settings.keys.KEY_CAMERA_RESET]) {
	this.cameraOffset = [0,0]
	this.cameraRotation = 0;
	this.cameraZoom = 1;
    this.lockCamera = false;
	}

    if(this._ships.length > 0){
        var s = this.getMainShip();
    if(!this.lockCamera){    
        this.offset = [-s.cx + g_canvas.width/2,-s.cy + g_canvas.height/2];
    }
	this.trueOffset = util.vecPlus(this.offset,this.cameraOffset);
	this.trueOffset = util.vecPlus(this.trueOffset,util.rotateVector(util.mulVecByScalar(1/this.cameraZoom,this.mouseOffset),-this.cameraRotation));
    }
    
},

update: function(du) {


    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
		spatialManager.unregister(aCategory[i]);
                aCategory.splice(i,1);
		
            }
            else {
                ++i;
            }
        }
    }
    
    if (g_settings.enableRocks && this._rocks.length === 0) this._generateRocks();

},

getMainShip: function() {
    for(var i = 0; i < this._ships.length; i++){
	if (this._ships[i].isMain){
	    return this._ships[i];
	    }
	}
    return this._ships[0];
    },
    
setUpCamera: function (ctx){
    // NOTE: ALWAYS save and restore when using this function
    if(this._ships[0]){
        var s = this._ships[0];
        //ctx.translate(-this.trueOffset[0],-this.trueOffset[1]);
	ctx.translate(g_canvas.width/2,g_canvas.height/2);
	ctx.rotate(this.cameraRotation);
	ctx.scale(this.cameraZoom,this.cameraZoom);
	ctx.translate(-g_canvas.width/2,-g_canvas.height/2);
    ctx.translate(this.trueOffset[0],this.trueOffset[1]);
	//console.log((s.cx) + " "  + (s.cy));
    }
},


render: function(ctx) {
    var debugX = 10, debugY = 100;
    ctx.save();
    this.setUpCamera(ctx);
    Stars.render(ctx);
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
	this._terrain.renderOcean(ctx);
    this._terrain.render(ctx);
    ctx.restore();
},


}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

