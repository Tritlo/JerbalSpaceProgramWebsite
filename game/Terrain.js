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

Terrain.prototype.heightAtX = function (x) {
    var ps = util.findClosestPoints(x,0,this.points);
    if(!ps || !ps[0] || !ps[1]){
        debugger;
    }
    var lEq = util.getEqOfLine(ps[0][0],ps[0][1],ps[1][0],ps[1][1]);
    return (lEq[0]*x + lEq[2])/(-1*lEq[1]);
}

Terrain.prototype.addCrater = function (x,y, radius,explRadius,speed) {
    var values = [];
    var steps = Math.max(Math.ceil(explRadius/20),5);
    //console.log(steps,speed);
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

Terrain.prototype.hit = function (prevX,prevY,nextX,nextY,radius,width,height,rotation,cRot){
    if (g_settings.hitBox){
        return this.hitWBox(prevX,prevY,nextX,nextY,radius,width,height,rotation,cRot);
    } else {
        return this.hitWCircle(prevX,prevY,nextX,nextY,radius);
    }
}

Terrain.prototype.hitWBox = function (prevX,prevY,nextX,nextY, radius,width,height,rotation,cRot){
    var hitBox = util.paramsToRectangle(nextX,nextY,width,height,rotation,cRot);
    var prevHitBox = util.paramsToRectangle(prevX,prevY,width,height,rotation,cRot);
    var prevAvg = util.avgOfPoints(prevHitBox);
    var hbAvg = util.avgOfPoints(hitBox);
    var hits  = [];
    for(var i = 0; i < hitBox.length; i++){
        if (this.heightAtX(hitBox[i][0]) < hitBox[i][1]){
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
    var points = util.lineBelow(this.points,pointOfHit[0],pointOfHit[1]);
    var x0 = points[0][0]; var y0 = points[0][1];
    var x1 = points[1][0]; var y1 = points[1][1];
    var nextDist = util.distFromLine(x0,y0,x1,y1,nextX,nextY);
    var prevSign = util.sign(util.sideOfLine(x0,y0,x1,y1,prevX,prevY));
    var nextSign = util.sign(util.sideOfLine(x0,y0,x1,y1,nextX,nextY));
	var prevDist = util.distFromLine(x0,y0,x1,y1,prevX,prevY);
	var collisionSpeed = Math.abs(prevSign* prevDist- nextSign*nextDist);
	var lN = util.lineNormal(x0,y0,x1,y1);
	var collisionAngle = util.angleBetweenVectors([0,-1],lN)
    if(isNaN(collisionAngle) || isNaN(collisionSpeed)){
        debugger; 
    }
	return [true,collisionSpeed,collisionAngle,pointOfHit];
    }
}


Terrain.prototype.hitWCircle = function (prevX,prevY, nextX,nextY, radius) {
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
	return points;
}



Terrain.prototype.render = function (ctx) {
    var terr = this.points
    ctx.save()
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.beginPath()
    ctx.moveTo(terr[0][0],this.maxY +g_canvas.height)
    ctx.lineTo(terr[0][0],terr[0][1]);
    for(var i = 1; i < terr.length;i++){
		ctx.lineTo(terr[i][0],terr[i][1]);
	}
    ctx.lineTo(terr[terr.length-1][0],this.maxY + g_canvas.height)
	ctx.closePath();
	ctx.stroke();
    ctx.fill();
    ctx.restore();
};
