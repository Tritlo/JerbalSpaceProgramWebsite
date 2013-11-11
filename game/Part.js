function Part(descr) {
    this.setup(descr);
}

Part.prototype.setup = function (descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Part.prototype.name = "NO NAME";
Part.prototype.mass = 0.1;

//List of points
Part.prototype.outline = [];


Part.prototype.render = function (ctx) {
    ctx.save();
    if(this.fill){
        ctx.fillstyle = this.fill;
    }
    if(this.stroke){
        ctx.fillstyle = this.stroke
    }
    if(this.lineWidth){
        ctx.lineWidth = this.lineWidth;
    }
    ctx.beginPath();
    ctx.moveTo(this.outline[0][0],this.outline[0][1]);
    for(var i = 0; i < this.outline.length; i++){
        var loc = this.outline[i];
        ctx.lineTo(loc[0],loc[1]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}
