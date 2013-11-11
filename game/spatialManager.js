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
    
    // TODO: YOUR STUFF HERE!

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    this._entities[spatialID] = undefined;

    

    // TODO: YOUR STUFF HERE!

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
    ctx.save();
    ctx.strokeStyle = "red";
    if(entityManager.getMainShip()){
        var s = entityManager.getMainShip();
        ctx.translate(entityManager.trueOffset[0],entityManager.trueOffset[1]); 
	//console.log((s.cx) + " "  + (s.cy));
    }

    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        //util.strokeCircle(ctx, e.posX, e.posY, e.radius);
	if (e) {
	    var pos = e.getPos()
        if (g_settings.hitBox){
            ctx.save();
            ctx.translate(pos.posX-entityManager.cameraOffset[0],pos.posY-entityManager.cameraOffset[1]);
            ctx.rotate(e.rotation);
            ctx.rotate(entityManager.cameraRotation);
            ctx.translate(-pos.posX+entityManager.cameraOffset[0],-pos.posY+entityManager.cameraOffset[1]);
            //ctx.translate(-pos.posX,-pos.posY);
            var w = e.width*entityManager.cameraZoom;
            var h = e.height*entityManager.cameraZoom;
            util.strokeBox(ctx, pos.posX-w/2, pos.posY-h/2, w, h);
            ctx.restore();
            ctx.stroke();
        } else {
            util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius()*entityManager.cameraZoom);
        }
	    }
    }
    ctx.restore();
}

};
