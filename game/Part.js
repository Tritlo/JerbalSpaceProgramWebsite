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
Part.prototype.currentMass = 0.1
Part.prototype.thrust = 0;
Part.prototype.currentThrust = 0;
Part.prototype.fuel = 0;
Part.prototype.currentFuel = 0;
Part.prototype.fuelDensity = 0.01;
Part.prototype.efficiency = 0;
Part.prototype.types = ["Other","Fuel Tank","Engine"];
Part.prototype.type = "Other";
Part.prototype.rotation = 0;
Part.prototype.width = 0;
Part.prototype.height = 0;
Part.prototype.radius = 0;
Part.prototype.fill = undefined;
Part.prototype.stroke = undefined;

//Rotates the outline,
//so that ind becomes the
//last point.

Part.prototype.setFlame = function (ps) {
    var center = util.mulVecByScalar(0.5,util.vecPlus(ps[0],ps[1]));
    var cToTip = util.vecMinus(ps[2],center);
    var dir = util.normalizeVector(cToTip);
    var len = util.lengthOfVector(cToTip);
    this.flame = { "points" : ps,
		   "center" : center,
		   "direction" : dir,
		   "length" : len
		   }
    
    }
Part.prototype.rotate = function(ind){
    this.outline = util.rotateList(this.outline,util.lastIndexOfObj(this.outline,ind));
}


Part.prototype.addPoint = function(pt){
    if (this.outline) {
        this.outline.push(pt);
    } else {
        this.outline = [pt];
    }
    //maybe add to baseMass
}

Part.prototype.addAttachmentPoint = function (point){
    if(this.attachmentPoints){
        this.attachmentPoints.push(point);
    }
    else{
        this.attachmentPoints = [point];
    }
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
    if(this.type !== "Fuel Tank") return; //perhaps keep the fuel, but handle this elsewhere
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

Part.prototype.toDesigner = function(grid){
    this.outline = grid.fromGridCoords(this.outline);    
    if(this.attachmentPoints){
        this.attachmentPoints = grid.fromGridCoords(this.attachmentPoints);    
    }
    if(this.flame){
        this.setFlame(grid.fromGridCoords(this.flame.points));  
    }
   return this;
}



Part.prototype.finalize = function(grid){
    this.outline = grid.toGridCoords(this.outline);
    if (this.attachmentPoints){
        this.attachmentPoints = grid.toGridCoords(this.attachmentPoints);
    }
    if(this.flame){
        this.setFlame(grid.toGridCoords(this.flame.points));  
    }
    // so they make sense when drawn
    // (otherwise dims become crazy);
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

    //Translate
    this.outline = this.outline.map(function (x) {
        return util.vecMinus(x,[minx,miny]);
    });
    if(this.attachmentPoints){
        this.attachmentPoints = this.attachmentPoints.map(
                function (x) {
            return util.vecMinus(x,[minx,miny]);
        });
    }
    if(this.flame){
        this.setFlame(this.flame.points.map( function (x) { return util.vecMinus(x,[minx,miny]); }));
    }
    this.centerOfMass = {x: x/l, y: y/l};
    this.currentThrust = 0;
    this.currentFuel = 0;
    this.radius = Math.max(this.height,this.width);
    this.finalizeNumbers();
}

Part.prototype.finalizeNumbers = function(){
    if(isNan(this.mass)){
        this.mass = 0;
    }
    if(isNan(this.fuel)){
        this.fuel = 0;
    }
    if(isNan(this.thrust)){
        this.thrust = 0;
    }
    if(isNan(this.efficiency)){
        this.efficiency = 0;
    }
}

Part.prototype._renderFlame = function (ctx) {
    if (this.flame && this.thrust != 0) {
	var t = this.currentThrust/this.thrust;
	var rot = this.rotation;
	ctx.save();
	ctx.lineWidth = 2;
	var ps = this.flame.points;
	var c = this.flame.center;
	var l = this.flame.length;
	var dir = this.flame.direction;
	ctx.strokeStyle = "blue";
	var tip = util.vecPlus(c,util.mulVecByScalar(0.2*l*t,dir));
	util.strokeTriangle(ctx,ps[0][0],ps[0][1],ps[1][0],ps[1][1],tip[0],tip[1],rot,c[0],c[1]);
	ctx.strokeStyle = "yellow";
	var tip = util.vecPlus(c,util.mulVecByScalar(0.6*l*t,dir));
	util.strokeTriangle(ctx,ps[0][0],ps[0][1],ps[1][0],ps[1][1],tip[0],tip[1],rot,c[0],c[1]);
	ctx.strokeStyle = "red";
	var tip = util.vecPlus(c,util.mulVecByScalar(1.0*l*t,dir));
	util.strokeTriangle(ctx,ps[0][0],ps[0][1],ps[1][0],ps[1][1],tip[0],tip[1],rot,c[0],c[1]);
	ctx.restore();
	}
    
    }

Part.prototype.render = function (ctx) {
    if(this.outline){
        ctx.save();
	this._renderFlame(ctx);
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
	if(this.fill) {
	    ctx.fill()
	    }
        ctx.restore();
    }
}
