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

_inBox : function (entity, topLeftCorner, bottomRightCorner) {
    if (!(entity)) return;
    var ePos = entity.getPos()
    return util.circInBox(ePos["posX"],ePos["posY"],entity.getRadius(), topLeftCorner,bottomRightCorner);
    },


// PUBLIC METHODS

getNewSpatialID : function() {

    return this._nextSpatialID++;


},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    this._entities[spatialID] = entity;

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    this._entities[spatialID] = undefined;

},

findEntityInRange: function(posX, posY, radius) {
    for ( var ID in this._entities) {
        var e = this._entities[ID];
        if(e) {
            var pos = e.getPos();
            if (util.wrappedDistSq(pos.posX, pos.posY, posX, posY)
            <= util.square(e.getRadius() + radius))
            return e;
            }
	}
},

render: function(ctx) {
    ctx.save();
    ctx.strokeStyle = "red";
    entityManager.setUpCamera(ctx);
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
	if (e) {
	    var pos = e.getPos()
        if (g_settings.hitBox){
            ctx.save();
	        e.renderHitBox(ctx);
            ctx.stroke();
            ctx.restore();
        } else {
            util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius()*entityManager.cameraZoom);
        }
	    }
    }
    ctx.restore();
}

};
