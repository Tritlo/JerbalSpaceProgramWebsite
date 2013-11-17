"use strict";


function Terrain(descr) {
    this.setup(descr);
    this.points = this.genTerrain();
    //Add landing platform
//    this.spliceByXCoords(100,300,[[100,250],[150,232],[250,232],[300,250]]);
};

Terrain.prototype = new Entity();
Terrain.prototype.center = [0,0];
Terrain.prototype.spliceByIndex = function (indFrom, indTo, yValues) {
    for(var i = 0; i < yValues.length; i++){
	this.points[indFrom+i][1] = yValues[i];
	}
    }

Terrain.prototype.spliceByXCoords = function (xFrom, xTo, values) {
    var sliceStart = util.findIndexesOfClosestPoints(xFrom,this.points)[1];
    var sliceEnd = util.findIndexesOfClosestPoints(xTo,this.points)[0];
    //this.points.splice(spliceStart,spliceEnd-spliceStart,values);
    var head = this.points.slice(0,sliceStart);
    var tail = this.points.slice(sliceEnd+1,this.points.length);
    this.points = head.concat(values,tail);
    }

Terrain.prototype.heightAtX = function (x) {
    var ps = util.findClosestPoints(x,0,this.points);
    var lEq = util.getEqOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1]);
    return (lEq[0]*x + lEq[2])/(-1*lEq[1]);
}

Terrain.prototype.addCrater = function (x,y, radius,explRadius,speed) {
    var values = [];
    var steps = Math.max(Math.ceil(explRadius/20),5);
    console.log(steps,speed);
    for(var i = 0; i <= steps; i++){
	var deg = Math.PI * i/steps;
	values.push([x-Math.cos(deg)*explRadius, y + Math.sin(deg)*explRadius + radius]);
    }
    //Don't raise terrain:
    var terr = this;
    values = values.map(function(p) {
        var hAtP = terr.heightAtX(p[0]);
        if (hAtP > p[1]){
            p[1] = hAtP;
        }
        return [p[0],p[1]];
    });
    this.spliceByXCoords(x-explRadius, x+explRadius,values);
    }

Terrain.prototype.hit = function (prevX,prevY,nextX,nextY,radius,width,height,rotation){
    if (g_settings.hitBox){
        return this.hitWBox(prevX,prevY,nextX,nextY,radius,width,height,rotation);
    } else {
        return this.hitWCircle(prevX,prevY,nextX,nextY,radius);
    }
}

Terrain.prototype.isInside = function (point) {
	return false;
    var ps = util.findSurfaceBelow(point,this.points,this.center);
    return (util.sideOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1],point[0],point[1])===util.sideOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1],this.center[0],this.center[1]));
}

Terrain.prototype.hitWBox = function (prevX,prevY,nextX,nextY, radius,width,height,rotation){
    var hitBox = util.paramsToRectangle(nextX,nextY,width,height,rotation);
    var hits  = [];
    for(var i = 0; i < hitBox.length; i++){
        if (this.isInside(hitBox[i])){
            hits.push(hitBox[i]);
        }
    }
    var circ = this.hitWCircle(prevX,prevY,nextX,nextY,radius); 
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
	var collisionAngle = util.angleBetweenVectors([0,-1],lN)
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
	var collisionAngle = util.angleBetweenVectors([0,-1],lN)
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



Terrain.prototype.render = function (ctx) {
    var terr = this.points
    ctx.save()
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.beginPath()
    ctx.moveTo(terr[0][0],terr[0][1]);
	ctx.font="10px Arial";
    for(var i = 1; i < terr.length;i++){
		ctx.lineTo(terr[i][0],terr[i][1]);
		ctx.strokeText(i,terr[i][0],terr[i][1]);
	}
	ctx.closePath();
	ctx.stroke();
   // ctx.fill();
    ctx.restore();
};
