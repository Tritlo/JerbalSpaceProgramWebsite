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
Part.prototype.fuelDensity = 0.01;
Part.prototype.types = ["other","fuelTank","engine"];
Part.prototype.type = this.types[0]; 

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

Part.prototype.setType = function(tp){
    if(!tp) return;
    var valid = false;
    if(typeof tp === "Number"){
        valid = p < this.types.length && tp >= 0;
        if(valid){
            this.type = this.types[tp];
	}
	return valid;
    }
    
    for(var i = 0; i < this.types.length && !valid; i++){
        if(tp === this.types[i]) valid = true;
    }
    if(!valid) return valid;
    this.type = tp;
    return valid;
}

Part.prototype.setFuel = function (fl){
    if(this.type !== "fuelTank") return; //perhaps keep the fuel, but handle this elsewhere
    fl = fl || this.fuel;
    this.fuel = fl;
    this.mass = this.baseMass + this.fuel*this.fuelDensity;
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
    var minx = Number.MAX_VALUE;
    var maxx = Number.MIN_VALUE;
    var miny = Number.MAX_VALUE;
    var maxy = Number.MIN_VALUE;
    for(var i = 0; i < l; i++){
        var nx = this.outline[i][0];
	var ny = this.outline[i][1];
	if(nx > maxx) maxx = nx;
	if(nx < minx) minx = nx;
	if(ny > maxy) maxy = ny;
	if(ny < miny) miny = ny;
        x += nx;
        y += ny;
    }
    this.height = maxy - miny;
    this.width = maxx - minx;
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
	// If thruster, render flame
    }
}
