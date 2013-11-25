"use strict";

function Terrain(instance,descr) {
    this.setup(instance,descr);
    this.points = this.genTerrain();
    if(this.color){
        var c = parseCSSColor(this.color);
        var c = [Math.floor(c[0]*0.5),Math.floor(c[1]*0.5),Math.floor(c[2]*0.5),c[3]];
        console.log(this.color);
        this.edgeColor = this.edgeColor || "rgba("+c[0]+","+c[1]+","+c[2]+","+c[3]+")" ;
    }

    if(this.hasOceans){
        this.generateOceans();
    }
};

Terrain.prototype = new Entity();
Terrain.prototype.center = [0,0];
Terrain.prototype.spliceByIndex = function (indFrom, indTo, yValues) {
    for(var i = 0; i < yValues.length; i++){
	this.points[indFrom+i][1] = yValues[i];
	}
};
Terrain.prototype.addLaunchpad = function (ship){
	this.spliceByAngle([[-100,50],[-50,ship.height/2+5],[50,ship.height/2+5],[100,50]]);
};

Terrain.prototype.spliceByAngle = function (values) {
    var	C=this.center;
    var	angles=this.points.map(function(x){return util.angleOfVector(util.vecMinus(x,C))});
    var first = util.angleOfVector(util.vecMinus(values[0],this.center));
    var last = util.angleOfVector(util.vecMinus(values[values.length-1],this.center));
    var sliceStart = util.binarySearch(first,angles);
    var sliceEnd = util.binarySearch(last,angles)-1;
    //this.points.splice(spliceStart,spliceEnd-spliceStart,values);
    var head = this.points.slice(0,sliceStart);
    var tail = this.points.slice(sliceEnd+1,this.points.length);
    this.points = head.concat(values,tail);
    };
Terrain.prototype.spliceByXCoords = function (xFrom, xTo, values) {
    var sliceStart = util.findIndexesOfClosestPoints(xFrom,this.points)[1];
    var sliceEnd = util.findIndexesOfClosestPoints(xTo,this.points)[0];
    //this.points.splice(spliceStart,spliceEnd-spliceStart,values);
    var head = this.points.slice(0,sliceStart);
    var tail = this.points.slice(sliceEnd+1,this.points.length);
    this.points = head.concat(values,tail);
    };

Terrain.prototype.heightAtX = function (x) {
    var ps = util.findClosestPoints(x,0,this.points);
    if(!ps || !ps[0] || !ps[1]){
        debugger;
    }
    var lEq = util.getEqOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1]);
    var y = (lEq[0]*x + lEq[2])/(-1*lEq[1]);
    return util.cartesianToPolar(x,y,this.center[0],this.center[1])[0]
}

Terrain.prototype.addCrater = function (x,y, radius,explRadius,speed) {
    var values = [];
    var steps = Math.max(Math.ceil(explRadius/20),5);
    var	C = this.center;
    var angle=util.angleOfVector(util.vecMinus([x,y],C));
    for(var i = 0; i <= steps; i++){
	var deg = -Math.PI * (i/steps +1/2) + angle;
	values.push([x+Math.cos(deg)*explRadius, y + Math.sin(deg)*explRadius + radius]);
    }
    //Don't raise terrain:
    	var i=0;
	while (i<values.length)
	{
		if(!this.isInside(values[i]))
			values.splice(i,1);
		else
			i++;
	}
	if(values.length>0)
	this.spliceByAngle(values);
    }

Terrain.prototype.hit = function (prevX,prevY,nextX,nextY,radius,width,height,rotation,cRot){
    if (this.getInstance().settings.hitBox){
        return this.hitWBox(prevX,prevY,nextX,nextY,radius,width,height,rotation,cRot);
    } else {
        return this.hitWCircle(prevX,prevY,nextX,nextY,radius);
    }
}

Terrain.prototype.isInside = function (point) {
    var ps = util.findSurfaceBelow(point,this.points,this.center);
    return (util.sideOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1],point[0],point[1])===util.sideOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1],this.center[0],this.center[1]));
}

Terrain.prototype.hitWBox = function (prevX,prevY,nextX,nextY, radius,width,height,rotation,cRot){
    var hitBox = util.paramsToRectangle(nextX,nextY,width,height,rotation,cRot);
    var prevHitBox = util.paramsToRectangle(prevX,prevY,width,height,rotation,cRot);
    var prevAvg = util.avgOfPoints(prevHitBox);
    var hbAvg = util.avgOfPoints(hitBox);
    var hits  = [];
    for(var i = 0; i < hitBox.length; i++){
        if (this.isInside(hitBox[i])){
            hits.push(hitBox[i]);
        }
    }

    var circ = this.hitWCircle(prevAvg[0],prevAvg[1],hbAvg[0],hbAvg[1],radius); 
    circ[3] = [nextX,this.heightAtX(nextX)];
    if (hits.length === 0){
            return circ;
    }
    var meanHitX = 0, meanHitY = 0;
    for(var i = 0; i<hits.length; i++)
    {
        meanHitX += hits[i][0];
        meanHitY += hits[i][1];
    }
    meanHitX = meanHitX/hits.length;
    meanHitY = meanHitY/hits.length;
    var pointOfHit = [meanHitX,meanHitY];
    if (circ[0]){
	    return [true,circ[1],circ[2],pointOfHit];
    } else {
    var points = util.findSurfaceBelow(pointOfHit,this.points,this.center);
    var x0 = points[0][0]; var y0 = points[0][1];
    var x1 = points[1][0]; var y1 = points[1][1];
    var nextDist = util.distFromLine(x0,y0,x1,y1,nextX,nextY);
    var prevSign = util.sign(util.sideOfLine(x0,y0,x1,y1,prevX,prevY));
    var nextSign = util.sign(util.sideOfLine(x0,y0,x1,y1,nextX,nextY));
	var prevDist = util.distFromLine(x0,y0,x1,y1,prevX,prevY);
	var collisionSpeed = Math.abs(prevSign* prevDist- nextSign*nextDist);
	var lN = util.lineNormal(x0,y0,x1,y1);
	var collisionAngle = util.angleBetweenVectors([0,-1],lN);
    if(isNaN(collisionAngle) || isNaN(collisionSpeed)){
        debugger; 
    }
	return [true,collisionSpeed,collisionAngle,pointOfHit];
    }
}


Terrain.prototype.hitWCircle = function (prevX,prevY, nextX,nextY, radius) {
    var points = util.findSurfaceBelow([nextX,nextY],this.points,this.center);
    var x0 = points[0][0]; var y0 = points[0][1];
    var x1 = points[1][0]; var y1 = points[1][1];
    //If I'm not between the lines height points, don't consider it.
    if (! (util.isBetween(nextY,Math.min(y0,y1)-radius,Math.max(y0,y1)+radius))){
	    return [false];
	}
    var nextDist = util.distFromLine(x0,y0,x1,y1,nextX,nextY);
    var prevSign = util.sign(util.sideOfLine(x0,y0,x1,y1,prevX,prevY));
    var nextSign = util.sign(util.sideOfLine(x0,y0,x1,y1,nextX,nextY));
    if ((nextDist <= radius) ||  (prevSign != nextSign)){
        var prevDist = util.distFromLine(x0,y0,x1,y1,prevX,prevY);
        var collisionSpeed = Math.abs(prevSign* prevDist- nextSign*nextDist);
        var lN = util.lineNormal(x0,y0,x1,y1);
        var collisionAngle = util.angleBetweenVectors([0,-1],lN);
        if(isNaN(collisionAngle) || isNaN(collisionSpeed)){
            debugger; 
        }
        return [true,collisionSpeed,collisionAngle];
	}
    else {
	return [false];
	}
}


Terrain.prototype.genTerrain = function () {
	var points = [],
	xMin   = this.minX,
	xMax   = this.maxX,
	yMin   = this.minY,
	yMax   = this.maxY,
	minlen = this.minLength,
	maxlen =this.maxLength,
	minAng =this.minAngle,
	maxAng =this.maxAngle;
	var y_init = util.randRange(yMin,yMax);
	var currX = xMin,
	    currY = y_init;
	points[0]=[currX,currY];
	var sameY = Math.floor(Math.random()*2),
	up_down = 0;
	while(currX < xMax) {
		if(sameY) {
		// if past 2 y values are the same we set up_down
		// to 1 or -1 to move up or down
			up_down = Math.floor(Math.random()*2);
			if(!up_down) {
				up_down = -1;
			}
			sameY = false;
		}
		else {
			up_down = Math.floor(Math.random()*3-1);
			if(up_down === 0) {
				sameY = true;
			}
		}
		if(currY > yMax || currY < yMin) {
			up_down = util.sign(yMax - currY);
		}
		var len = null;
		var angle = util.randRange(minAng,maxAng);
		if(up_down) {
			var maxDY = null;
			if(up_down>0) {
				maxDY= yMax - currY; 
			}
			else {
				maxDY = currY - yMin;
			}
			var maxL = maxDY/Math.sin(angle);
			if (maxL<minlen) {
				len = minlen;
			}
			else {
				len = util.randRange(minlen,Math.min(maxlen,maxL));
			}
		}
		else {
			len = util.randRange(minlen,maxlen);
		}
		angle = up_down*angle;
		var nextX = Math.min(xMax,currX+len*Math.cos(angle));
		var nextY = currY+len*Math.sin(angle);	
		points.push([nextX,nextY]);
		currX = nextX;
		currY = nextY;
	}
	points.reverse();
	return util.wrapListAround(points,this.center);
}

Terrain.prototype.renderOcean = function (ctx) {
	ctx.save();
    ctx.fillStyle= this.oceanColor || "rgba(0,100,255,0.3)";
    if(this.seaLevel){
        util.fillCircle(ctx,this.center[0],this.center[1], this.seaLevel);
    }
	ctx.fill();
	ctx.restore();
}

Terrain.prototype.generateOceans = function(ctx) {
    var maxRad = this.maxY*0.2;
    var minRad = this.minY*0.2;
    var offset = 100;
    var edge = this.minY - maxRad - offset;
    this._Oceans = [];
    for(var i = 0; i < this.numOceans; i++){
        var c = [util.randRange(-edge,edge),util.randRange(-edge,edge)];
        var r = util.randRange(minRad,maxRad);
        var center = util.vecPlus(this.center,c);
        this._Oceans.push([center,r]);
    }
    console.log(this._Oceans);
}


Terrain.prototype.render = function (ctx) {
    if(this.oceanColor) this.renderOcean(ctx);
    var terr = this.points;
    ctx.save();
    ctx.strokeStyle = this.edgeColor || "white";
    ctx.fillStyle = this.color || "black";
    if(this.getInstance().entityManager.cameraZoom < 0.5){
        ctx.lineWidth = 1/this.getInstance().entityManager.cameraZoom;
    }
    ctx.beginPath();
    ctx.moveTo(terr[0][0],terr[0][1]);
	//ctx.font="10px Arial";
    for(var i = 1; i < terr.length;i++){
		ctx.lineTo(terr[i][0],terr[i][1]);
//		ctx.strokeText(i,terr[i][0],terr[i][1]);
	}
	ctx.closePath();
	ctx.stroke();
    ctx.fill();
    if(this.getInstance().settings.renderPlanetCenter)
        util.strokeCircle(ctx,this.center[0],this.center[1],100)
	//ctx.strokeText("C",this.center[0],this.center[1]);
    if(this._Oceans){
        ctx.fillStyle = this.waterColor;
        this._Oceans.map(function(x) {
            util.fillCircle(ctx,x[0][0],x[0][1],x[1]);
            ;});
    }
    ctx.restore();
};
