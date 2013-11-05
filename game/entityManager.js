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

_bShowRocks : true,

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
        NUM_ROCKS = 4;

    for (i = 0; i < NUM_ROCKS; ++i) {
        this.generateRock();
    }
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
    this._categories = [this._rocks, this._bullets, this._ships];
},

init: function() {
    if (g_settings.enableRocks){
	console.log("generating rocks");
	this._generateRocks();
	}
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
    return this._ships[0];
    },

render: function(ctx) {

    var debugX = 10, debugY = 100;
    ctx.save();
    if(this._ships[0]){
        var s = this._ships[0];
	//virkar ekki, reyndu t.d. ad kveikja a collsiion,
	//sem a ad teikna hring a skipinu, en gerir thad ekki.
	this.offset = [-s.cx - g_canvas.width/2,-s.cy - g_canvas.height/2]
        ctx.translate(-s.cx - g_canvas.width/2,-s.cy - g_canvas.height/2); 
	//console.log((s.cx) + " "  + (s.cy));
    }
    
    ctx.strokeStyle="white";
    ctx.beginPath();
    //ctx.rect(g_canvas.width,g_canvas.height,g_canvas.width,g_canvas.height);
    ctx.moveTo(s.cx - g_canvas.width/2, g_settings.seaLevel);
    ctx.lineTo(s.cy + 5*g_canvas.width/2, g_settings.seaLevel);
    ctx.stroke();
    ctx.closePath();
    
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
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

