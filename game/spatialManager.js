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
        ctx.translate(entityManager.offset[0],entityManager.offset[1]); 
	//console.log((s.cx) + " "  + (s.cy));
    }

    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        //util.strokeCircle(ctx, e.posX, e.posY, e.radius);
	if (e) {
	    var pos = e.getPos()
        if (g_settings.hitBox){
            ctx.save();
            ctx.translate(pos.posX,pos.posY);
            ctx.rotate(e.rotation);
            ctx.translate(-pos.posX,-pos.posY);
            util.strokeBox(ctx, pos.posX-e.width/2, pos.posY-e.height/2, e.width, e.height);
            ctx.restore();
            ctx.strokeStyle = "blue";
            var hitBox = util.paramsToRectangle(pos.posX,pos.posY,e.width,e.height,e.rotation);
            ctx.beginPath();
            ctx.moveTo(hitBox[0][0],hitBox[0][1]);
            for(var i = 1; i < hitBox.length;i++){
                ctx.lineTo(hitBox[i][0],hitBox[i][1])
            }
            ctx.closePath();
            ctx.stroke();
        } else {
            util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius());
        }
	    }
    }
    ctx.restore();
}

};
