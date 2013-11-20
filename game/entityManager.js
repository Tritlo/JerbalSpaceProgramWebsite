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

    _ships   : [],

    _terrain : [],

    cameraOffset: [0,0],
    trueOffset: [100,100],
    mouseOffset: [0,0],
    cameraRotation: 0,
    cameraZoom: 1,
    lockCamera: false,

    // "PRIVATE" METHODS

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
	"minAngle": minangl,
	"maxAngle": maxangl,
	"center" : [0,3600],
	"seaLevel": 3350,
	"mass" : 5.0e15,
    "color": "green",
    "oceanColor": "rgba(0,100,255,0.3)",
    //"waterColor": "blue",
    //"numOceans" : 3,
    //"hasOceans" : true
	});
    var joon = new Terrain({
	"minX":-5000,
	"maxX": 5000,
	"minY": 1600,
	"maxY": 1750,
	"minLength": 16,
	"maxLength": 128,
	"minAngle": minangl,
	"maxAngle": maxangl,
	"center" : [0,-10000],
	"mass" : 1.0e15,
    "color": "#282828",
    //"waterColor": "#101010",
    //"hasOceans" : true,
    //"numOceans" : 3
	});
    this._terrain.push(terr);
    this._terrain.push(joon);
},

getTerrain : function (x,y) {
    var max = Number.MIN_VALUE;
    var maxTerr;
    for(var i = 0; i < this._terrain.length; i++){
        var terr = this._terrain[i];
	    var g = this.gravityFrom(terr,x,y);
        if(g>max){
            max = g;
            maxTerr = terr;
        }
    }
    return maxTerr;
},

gravityFrom : function (terr,x,y){
    return util.lengthOfVector(this.gravityAt(x,y,terr));
},

gravityAt : function (x,y,terr) {
    if (terr === undefined) var terr=this.getTerrain(x,y);
    var distance=Math.sqrt(util.distSq(x,y,terr.center[0],terr.center[1]));
    var force=consts.G*terr.mass/(distance*distance);
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
    this._categories = [this._ships,this._terrain];
},

init: function() {
    this._generateTerrain();
    //this._generateShip();
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
	if(aCategory === this._terrain) continue;
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

