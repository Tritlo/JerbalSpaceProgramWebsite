/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
	this._entities[spatialID]=entity;
    // TODO: YOU[R STUFF HERE!
	

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
	this._entities[spatialID]=undefined;
    // TODO: YOUR STUFF HERE!

},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
	for (var ID in this._entities)
	{
		var e=this._entities[ID];
		if (!e)
			continue;
		var pos=e.getPos();
		var dist= Math.sqrt(util.wrappedDistSq(posX,posY,pos.posX,pos.posY,g_canvas.width,g_canvas.height))
		if(dist < radius+e.getRadius())
		return e;
	}		

},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
	if (!e)
		continue;
	var pos=e.getPos();
        util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius());
    }
    ctx.strokeStyle = oldStyle;
}

}
