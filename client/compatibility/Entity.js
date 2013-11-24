// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Entity.prototype.setup = function (instance,descr) {

    // Apply all setup properies from the (optional) descriptor
    
    this.instance = instance;
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    if(typeof(this.instance.spatialManager) !== 'undefined'){
	// Get my (unique) spatial ID
	this._spatialID = this.instance.spatialManager.getNewSpatialID();
    }
    
    // I am not dead yet!
    this._isDeadNow = false;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.register = function(){
    this.instance.spatialManager.register(this);
};

Entity.prototype.unregister = function(){
    this.instance.spatialManager.unregister(this);
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return this.instance.spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

Entity.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, this.instance.canvas.width);
    //this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Entity.prototype.renderHitBox = function(ctx){
    console.log("hitBox rendering for this Entity has not been implemented");
};
