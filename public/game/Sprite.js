// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image, dim, celldim, duration) {
    this.image = image;
    this.dim = dim;
    this.celldim = celldim;
    this.width = image.width;
    this.height = image.height;
    this.duration = duration;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image, 
                  x, y);
};

Sprite.prototype.drawCell = function(ctx, frame){
    var w = this.width,
        h = this.height;
    var row = Math.floor(frame/this.dim[1]);
    var col= frame % this.dim[1];
    var cellw = this.celldim[0];
    var cellh = this.celldim[1];
    var sx = col*cellw;
    var sy = row*cellh;
    ctx.drawImage(this.image, sx,sy,
		  cellw,
		  cellh,
                  -cellw/2,-cellw/2, cellw, cellh);
    }

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation,frame) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    if (frame === undefined){
	ctx.drawImage(this.image, 
                      -w/2, -h/2);
    } else {
	this.drawCell(ctx,frame);
    }
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation,frame) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation,frame);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation,frame);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation,frame);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation,frame) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation,frame);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation,frame);
    this.drawCentredAt(ctx, cx, cy + sh, rotation,frame);
};
