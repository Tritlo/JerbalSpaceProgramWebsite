// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},


strokeTriangle: function (ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry) {
    util.drawTriangle(ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry,true);
    },

drawTriangle: function (ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry,strokeNotFill) {
    // x0,y0,... are the corner-points of the triangle
    // rot is the rotation in radians, rx and ry denote
    // the center of rotation.
    rot = rot || 0;
    rx = rx || (x0 + x1 + x2)/3;
    ry = ry || (y0 + y1 + y2)/3;
    
    ctx.save();
    
    ctx.translate(rx,ry);
    x0 = x0 - rx;
    x1 = x1 - rx;
    x2 = x2 - rx;
    y0 = y0 - ry;
    y1 = y1 - ry;
    y2 = y2 - ry;
    ctx.rotate(rot);
    
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x0,y0);
    if (strokeNotFill) {
	ctx.stroke();
    }
    else {
	ctx.fill();
    }
    ctx.restore();
    },
    
fillTriangle: function (ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry) {
    util.drawTriangle(ctx,x0,y0,x1,y1,rot,rx,ry,false);
    },
    
fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

};
