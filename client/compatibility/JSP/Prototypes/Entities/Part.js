function Part(instance,descr) {
    this.setup(instance,descr);
}

Part.prototype.setup = function (instance,descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.instance = instance;
    if(this.flame){this.setFlame(this.flame);}
    this.updateAttributes();
};

Part.prototype.renderHb = false;
Part.prototype.name = "NO NAME";
Part.prototype.mass = 0.1;
Part.prototype.currentMass = 0.1;
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
Part.prototype.centerOfRot = [0,0];
Part.prototype.attached = false;

//Rotates the outline,
//so that ind becomes the
//last point.

Part.prototype.setFlame = function (ps) {
    this.flame = ps;
    var center = util.mulVecByScalar(0.5,util.vecPlus(ps[0],ps[1]));
    var cToTip = util.vecMinus(ps[2],center);
    var dir = util.normalizeVector(cToTip);
    var len = util.lengthOfVector(cToTip);
    this.flameProperties = { "points" : ps,
		   "center" : center,
		   "direction" : dir,
		   "length" : len
		   };
};

Part.prototype.rotate = function(ind){
    this.outline = util.rotateList(this.outline,util.lastIndexOfObj(this.outline,ind));
};

Part.prototype.reset = function(){
    var l = this.outline.length;
    if(l === 0) return; //Nothing to do with a part with not points;
    var nx = this.outline[0][0];
    var ny = this.outline[0][1];
    var minx = nx;
    var maxx = nx;
    var miny = ny;
    var maxy = ny;
    for(var i = 1; i < l; i++){
        var nx = this.outline[i][0];
        var ny = this.outline[i][1];
        if(nx > maxx) maxx = nx;
        if(nx < minx) minx = nx;
        if(ny > maxy) maxy = ny;
        if(ny < miny) miny = ny;
    }
    this.hitBox = [[minx,miny],[maxx,maxy]];
    /*this.hitBox = [
                   [this.center[0] - this.width/2, this.center[1]-this.height/2],
                   [this.center[0] + this.width/2, this.center[1]+this.height/2]
                    ];
                    */
    this.centerOfRot = this.center;

}

Part.prototype.addPoint = function(pt){
    if (this.outline) {
        this.outline.push(pt);
    } else {
        this.outline = [pt];
    }
}

Part.prototype.addAttachmentPoint = function (point){
    if(this.attachmentPoints){
        this.attachmentPoints.push(point);
    }
    else{
        this.attachmentPoints = [point];
    }
}

Part.prototype.isAttachedTo = function(otherPart){
	// could be better, but overhead would probably not be
	// worth it as 1-4 attachment points is the norm.
	if(!this.attachmentPoints || !otherPart.attachmentPoints){
		return false;	
	}
	for(var i=0; i<this.attachmentPoints.length;i++) {
		for(var j=0; j<otherPart.attachmentPoints.length;j++) {
			if(util.compEq(this.attachmentPoints[i],otherPart.attachmentPoints[j],[0,1],[0,1])) {
				return true;
			}
		}
	}
	return false;
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
        this.setFlame(grid.fromGridCoords(this.flame));  
    }
    this.center = grid.fromGridCoord(this.center);
    this.gridCenterOffset[0] *= grid.cellDim[0];
    this.gridCenterOffset[1] *= grid.cellDim[0];
    this.hitBox = grid.fromGridCoords(this.hitBox);    
    this.lineWidth = 4;
    this.updateAttributes();
    return this;
}

Part.prototype.scale = function(scale){
    this.mapFuncOverAll(function(x) { return util.mulVecByScalar(scale,x);}, true);
}

Part.prototype.mapFuncOverAll = function (f,alsoHitbox) {
    this.outline = this.outline.map(f);
    if (this.attachmentPoints){
        this.attachmentPoints = this.attachmentPoints.map(f);
    }
    if(this.flame){
        this.setFlame(this.flame.map(f));  
    }
    if(alsoHitbox){
        this.hitBox = this.hitBox.map(f);
    }
}

Part.prototype.finalize = function(grid,translate){
    if(translate === undefined){
        translate = true;
    }
    this.outline = grid.toGridCoords(this.outline);
    if (this.attachmentPoints){
        this.attachmentPoints = grid.toGridCoords(this.attachmentPoints);
    }
    if(this.flame){
        this.setFlame(grid.toGridCoords(this.flame));  
    }
    // so they make sense when drawn
    // (otherwise dims become crazy);
    var l = this.outline.length;
    if(l === 0) return; //maybe some error-handling? I dunno.
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
    }
    this.height = Math.abs(maxy - miny);
    this.width =  Math.abs(maxx - minx);
    //Translate
    if(translate){
        var trans = function (x) { return util.vecMinus(x,[minx,miny]); }
        this.mapFuncOverAll(trans);
    }
    var x = 0;
    var y = 0;
    for(var i = 0; i < l; i++){
        var nx = this.outline[i][0];
	    var ny = this.outline[i][1];
        x += nx;
        y += ny;
    }
    
    this.center = [ x/l, y/l];
    this.gridCenterOffset = util.vecMinus(
                            [Math.floor(this.center[0]), 
                            Math.floor(this.center[1])],
			    this.center
			    );
			    
    this.currentThrust = 0;
    this.currentFuel = 0;
    this.finalizeNumbers();
    this.reset();
    this.lineWidth = 1;
    this.origOutline = this.outline;
    this.updateAttributes();
}

Part.prototype.getRadius = function() {
    return this.radius;
}

Part.prototype.updateRot = function(newRot){
    this.center = util.rotatePointAroundPoint(this.center,newRot-this.rotation,this.centerOfRot[0],this.centerOfRot[1]);
    var oldRot = this.rotation
    var cRot = this.centerOfRot
    this.outline = this.outline.map(function(p) { return util.rotatePointAroundPoint(p,newRot-oldRot,cRot[0],cRot[1])});
    //this.hitBox = this.hitBox.map(function(p) { return util.rotatePointAroundPoint(p,newRot-oldRot,cRot[0],cRot[1])});
    this.rotation = newRot;
    }

Part.prototype.updateCenter = function(newCenter)
{
    var translation = util.vecMinus(newCenter,this.center);
    var tx = translation[0];
    var ty = translation[1];
    var trans =  function(point){
        return util.translatePoint(point[0],point[1],tx,ty);
	};
    this.center = trans(this.center);
    this.centerOfRot = trans(this.centerOfRot);
    this.mapFuncOverAll(trans,true);
    //this.hitBox = this.hitBox.map(trans);
    //this.updateAttributes();
};

Part.prototype.finalizeNumbers = function(){
    if(isNaN(this.mass)){
        this.mass = 0;
    }
    if(isNaN(this.fuel)){
        this.fuel = 0;
    }
    if(isNaN(this.thrust)){
        this.thrust = 0;
    }
    if(isNaN(this.efficiency)){
        this.efficiency = 0;
    }
};

Part.prototype._renderFlame = function (ctx) {
    if (this.flame && this.thrust != 0) {
	var t = this.currentThrust/this.thrust;
    if(t > 0){
        var rot = this.rotation;
        ctx.save();
        ctx.lineWidth = 1;
        var ps = this.flame;
        var c = this.flameProperties.center;
        var l = this.flameProperties.length;
        var dir = this.flameProperties.direction;
        var cRot = this.centerOfRot;
        ctx.strokeStyle = "blue";
        var tip = util.vecPlus(c,util.mulVecByScalar(0.2*l*t,dir));
        util.strokeTriangle(ctx,ps[0][0],ps[0][1],ps[1][0],ps[1][1],tip[0],tip[1],rot,cRot[0],cRot[1]);
        ctx.strokeStyle = "yellow";
        var tip = util.vecPlus(c,util.mulVecByScalar(0.6*l*t,dir));
        util.strokeTriangle(ctx,ps[0][0],ps[0][1],ps[1][0],ps[1][1],tip[0],tip[1],rot,cRot[0],cRot[1]);
        ctx.strokeStyle = "red";
        var tip = util.vecPlus(c,util.mulVecByScalar(1.0*l*t,dir));
        util.strokeTriangle(ctx,ps[0][0],ps[0][1],ps[1][0],ps[1][1],tip[0],tip[1],rot,cRot[0],cRot[1]);
	    ctx.restore();
    }
	}
    
    }
    
Part.prototype.renderHitBox = function(ctx){
    this._renderHitbox(ctx);
}

Part.prototype.getHitBoxDimensions = function(){
    return [this.width,this.height];
}

Part.prototype.updateAttributes = function (){
    if(this.hitBox){
        var w = Math.abs(this.hitBox[1][0]-this.hitBox[0][0]);
        var h = Math.abs(this.hitBox[1][1] - this.hitBox[0][1]);
        var r = Math.min(w,h)/2;
        this.width = w;
        this.height = h;
        this.radius = r;
    }
}


Part.prototype._renderHitbox = function (ctx,inGame){
            ctx.save();
            ctx.strokeStyle = "yellow";
            var hB = util.paramsToRectangle(this.hitBox[0][0],this.hitBox[0][1],this.width,this.height,this.rotation, this.centerOfRot)
            var avg = util.avgOfPoints(hB)
            util.strokeCircle(ctx, avg[0], avg[1], this.getRadius());
            ctx.stroke();
            ctx.strokeStyle = "lime";
            util.strokeCircle(ctx, this.center[0], this.center[1], 2);
            ctx.stroke();
            ctx.strokeStyle = "red";
            var hB = util.paramsToRectangle(this.hitBox[0][0],this.hitBox[0][1],this.width,this.height,this.rotation, this.centerOfRot)
            ctx.beginPath();
            ctx.moveTo(hB[0][0],hB[0][1]);
            for(var i = 0; i < hB.length; i++){
                var loc = hB[i];
                ctx.lineTo(loc[0],loc[1]);
                //util.strokeCircle(ctx, loc[0], loc[1], 2);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
}
    
Part.prototype._renderAttachmentPoints = function (ctx){
    var points = this.attachmentPoints;
    if(points) {
	    ctx.save();
	    ctx.strokeStyle = "red";
	    for(var i = 0; i < points.length; i++){
		var x = points[i][0];
		var y = points[i][1];
		util.strokeCircle(ctx,x,y,7);
	    }
	    ctx.restore();
	    }
    
}

Part.prototype._renderCenter = function(ctx){
	ctx.save()
	ctx.strokeStyle = "yellow";
	util.strokeCircle(ctx,this.center[0],this.center[1],2);
	ctx.restore();
    };

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

	if(typeof(this.instance.entityManager) !== 'undefined'){
	    if(this.instance.entityManager.cameraZoom < 0.5){
		ctx.lineWidth = 1/this.instance.entityManager.cameraZoom;
	    }
	}
	var cRot = this.centerOfRot;
	var rot = this.rotation;
	//var outline = this.outline.map(function(p) { return util.rotatePointAroundPoint(p,rot, cRot[0],cRot[1])});
	var outline = this.outline;//.map(function(p) { return util.rotatePointAroundPoint(p,rot, cRot[0],cRot[1])});
        ctx.beginPath();
        ctx.moveTo(outline[0][0],outline[0][1]);
        for(var i = 0; i < outline.length; i++){
            var loc = outline[i];
            ctx.lineTo(loc[0],loc[1]);
        }
        ctx.closePath();
        ctx.stroke();
        if(this.fill) {
            ctx.fill();
            }
        ctx.restore();
    }
};
