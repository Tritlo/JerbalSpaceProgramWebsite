"use strict";


function Terrain(descr) {
    this.setup(descr);
    this.points = this.genTerrain();
    //Add landing platform
    this.spliceByXCoords(100,300,[[100,250],[150,232],[250,232],[300,250]]);
};

Terrain.prototype = new Entity();

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

Terrain.prototype.addCrater = function (x,y, radius,speed) {
    //TODO: add effects of speed
    var y = y+radius;
    this.spliceByXCoords(x-radius, x+radius,[[x-radius,y],[x-radius/2,y+10],[x,y+15],[x+radius/2,y+10],[x+radius,y]]);
    }

Terrain.prototype.hit = function (prevX,prevY, nextX,nextY, radius) {
    var points = util.lineBelow(this.points,nextX,nextY);
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
	var yDiff = yMax-yMin,
	lenDiff = maxlen-minlen;
	var y_init = Math.random()*yDiff+yMin;
	points[0]=[xMin,y_init];
	var currX = xMin,
		currY = y_init;
	//console.log(currX,currY);
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
		}
		else {
			up_down = Math.floor(Math.random()*3-1);
		}
		//console.log(up_down);
		var len = null;
		var angle = up_down*(minAng+Math.random()*(maxAng-minAng));
		//console.log(angle);
		if(up_down) {
			var maxDY = null;
			if(up_down>0) {
				maxDY=yMax-currY; 
			}
			else {
				maxDY = currY - yMin;
			}
			//console.log(maxDY);
			var maxL = Math.pow((maxDY)/(Math.sin(angle)),2);
			//console.log(maxL);
			if (maxL<minlen) {
				len = maxL;
			}
			else {
				len = minlen+Math.random()*(Math.min(maxlen,maxL)-minlen);
			}
		}
		else {
			len = minlen+Math.random()*(maxlen-minlen);
		}
		//console.log(minlen);	
		var rootlen = Math.sqrt(len);
		var nextX = Math.min(xMax,currX+rootlen*Math.cos(angle));
		var nextY = currY+rootlen*Math.sin(angle);	
		points.push([nextX,nextY]);
		currX = nextX;
		currY = nextY;
		//console.log(currY,currX);
	}
	return points;
}



Terrain.prototype.render = function (ctx) {
    var terr = this.points
    ctx.save()
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.beginPath()
    ctx.moveTo(terr[0][0],this.minY +g_canvas.height)
    ctx.lineTo(terr[0][0],terr[0][1]);
    for(var i = 1; i < terr.length;i++){
	ctx.lineTo(terr[i][0],terr[i][1]);
	}
    ctx.lineTo(terr[terr.length-1][0],this.minY + g_canvas.height)
	ctx.closePath();
	ctx.stroke();
    ctx.fill();
    ctx.restore();
};
