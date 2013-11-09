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
mouseOffset: [0,0],

// "PRIVATE" METHODS
cameraRotation: 0,
cameraZoom: 1,

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
	"minY": 300,
	"maxY": sL/2,
	"minLength": 1000,
	"maxLength": 2000,
	"minAngle": Math.PI/30,
	"maxAngle": Math.PI/2.2
	});
    this._terrain = terr;
},

getTerrain : function () {
    return this._terrain;
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

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},


updateCamera: function () {
    

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
	//this.cameraOffset = util.vecPlus(this.cameraOffset,util.rotateVector([0,-10/this.cameraZoom],-this.cameraRotation));
    }										     
    if (keys[g_settings.keys.KEY_CAMERA_LEFT]) {				     
	this.cameraOffset = util.vecPlus(this.cameraOffset,util.mulVecByScalar(g_settings.cameraMoveRate/this.cameraZoom,util.rotateVector([1,0], -this.cameraRotation)));
	//this.cameraOffset = util.vecPlus(this.cameraOffset,util.rotateVector([-10/this.cameraZoom,0],-this.cameraRotation));
    }										     
    if (keys[g_settings.keys.KEY_CAMERA_RIGHT]) {				     
	this.cameraOffset = util.vecPlus(this.cameraOffset,util.mulVecByScalar(g_settings.cameraMoveRate/this.cameraZoom,util.rotateVector([-1,0], -this.cameraRotation)));
	//this.cameraOffset = util.vecPlus(this.cameraOffset,util.rotateVector([10/this.cameraZoom,0], -this.cameraRotation));
    }
    if (keys[g_settings.keys.KEY_CAMERA_RESET]) {
	this.cameraOffset = [0,0]
	this.cameraRotation = 0;
	this.cameraZoom = 1;
	}
    
},

update: function(du) {

    this.updateCamera();

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
    Stars.update(du);

},

getMainShip: function() {
    return this._ships[0];
    },


render: function(ctx) {


    var debugX = 10, debugY = 100;
    ctx.save();
    if(this._ships[0]){
        var s = this._ships[0];
	this.offset = [-s.cx + g_canvas.width/2,-s.cy + g_canvas.height/2]
	this.trueOffset = util.vecPlus(this.offset,this.cameraOffset);
	this.trueOffset = util.vecPlus(this.trueOffset,util.rotateVector(util.mulVecByScalar(1/this.cameraZoom,this.mouseOffset),-this.cameraRotation));
        //ctx.translate(-this.trueOffset[0],-this.trueOffset[1]);
	ctx.translate(g_canvas.width/2,g_canvas.height/2);
	ctx.rotate(this.cameraRotation);
	ctx.scale(this.cameraZoom,this.cameraZoom);
	ctx.translate(-g_canvas.width/2,-g_canvas.height/2);
        ctx.translate(this.trueOffset[0],this.trueOffset[1]);
	//console.log((s.cx) + " "  + (s.cy));
    }
    Stars.render(ctx);
    this._terrain.render(ctx);
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
    ctx.restore();
},


}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

