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
    var TLC = topLeftCorner;
    var BRC = bottomRightCorner;
    var ePos = entity.getPos()
    var eTLC = [ePos["posX"]-entity.getRadius(), ePos["posY"]-entity.getRadius()];
    var eBRC = [ePos["posX"]+entity.getRadius(), ePos["posY"]+entity.getRadius()];
    var hey = ( !(eBRC[1] < TLC[1]) && !(eTLC[1] > BRC[1]) &&
	     !(eBRC[0] < TLC[0]) && !(eTLC[0] > BRC[0]));

    return hey;
	
    

    
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
    //var topLeftCorner = [posX-radius, posY-radius];
    //var bottomRightCorner = [posX+radius, posY+radius];
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
    ctx.strokeStyle = "red";

    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        //util.strokeCircle(ctx, e.posX, e.posY, e.radius);
	if (e) {
	    var pos = e.getPos()
            util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius());
	    }
    }
}

};
