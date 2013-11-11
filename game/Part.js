function Part(descr) {
    this.setup(descr);
}

Part.prototype.setup = function (descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

}

Part.prototype.name = "NO NAME";
Part.prototype.baseMass = 0.1;
Part.prototype.mass = this.baseMass;
Part.prototype.thrust = 0;
Part.prototype.fuel = 0;

//Rotates the outline,
//so that ind becomes the
//last point.
Part.prototype.rotate = function(ind){
    this.outline = util.rotateList(this.outline,this.outline.lastIndexOf(ind));
    console.log(this.outline);
}


Part.prototype.addPoint = function(pt){
    if (this.outline) {
        this.outline.push(pt);
    } else {
        this.outline = [pt];
    }
    //maybe add to baseMass
}

Part.prototype.setFuel = function (fl){
    var fuelMass = 0.01;
    this.fuel = fl;
    this.mass = this.baseMass + this.fuel*fuelMass;
}

Part.prototype.setLastPoint = function (pt) {
    if (this.outline) {
        this.outline[this.outline.length-1] = pt;
    } else {
        this.outline = [pt];
    }

}

Part.prototype.finalize = function(){
    var l = this.outline.length;
    if(l === 0) return; //maybe some error-handling? I dunno.
    var x = 0;
    var y = 0;
    for(var i = 0; i < l; i++){
        x += this.outline[i][0];
	y += this.outline[i][1];
    }
    this.centerOfMass = {x: x/l, y: y/l};
}

Part.prototype.render = function (ctx) {
    if(this.outline){
        ctx.save();
        if(this.fill){
            ctx.fillStyle = this.fill;
        }
        if(this.stroke){
            ctx.strokeStyle = this.stroke
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
}
