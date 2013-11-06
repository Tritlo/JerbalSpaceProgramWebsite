var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// búum til punkt (x,y) -hæð og fjarlægð
function genTerrain(x,y,length,angles) {
	var points = [],
	xMin=x[0],
	xMax=x[1],
	yMin=y[0],
	yMax=y[1],
	minlen=length[0],
	maxlen = length[1],
	minAng = angles[0],
	maxAng = angles[1];
		console.log(minAng,maxAng);
	var yDiff = yMax-yMin,
	lenDiff = maxlen-minlen;
	var y_init = Math.random()*yDiff+yMin;
	points[0]=[xMin,y_init];
	var currX = xMin,
		currY = y_init;
	console.log(currX,currY);
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
		console.log(up_down);
		var len = null;
		var angle = up_down*(minAng+Math.random()*(maxAng-minAng));
		console.log(angle);
		if(up_down) {
			var maxDY = null;
			if(up_down>0) {
				maxDY=yMax-currY; 
			}
			else {
				maxDY = currY - yMin;
			}
			console.log(maxDY);
			var maxL = Math.pow((maxDY)/(Math.sin(angle)),2);
			console.log(maxL);

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
		console.log(minlen);	
		var rootlen = Math.sqrt(len);
		var nextX = Math.min(xMax,currX+rootlen*Math.cos(angle));
		var nextY = currY+rootlen*Math.sin(angle);	
		points.push([nextX,nextY]);
		currX = nextX;
		currY = nextY;
		console.log(currY,currX);
	}
	return points;
}

function renderTerrain(ctx,x,y,length,angles) {
	var terrPoints = genTerrain(x,y,length,angles);
	ctx.beginPath();
    ctx.moveTo(terrPoints[0][0],terrPoints[0][1]);
	for(var i = 1; i<=terrPoints.length; i++) {
		ctx.lineTo(terrPoints[i][0],terrPoints[i][1]);
     	ctx.stroke();
	}
	ctx.endPath();
}
var minangl = Math.PI/30,
maxangl = Math.PI/2.2;
console.log(minangl,maxangl);
renderTerrain(g_ctx,[0,600],[0,600],[5,20],[minangl,maxangl]);
