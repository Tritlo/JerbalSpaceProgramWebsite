

function renderHUD(ctx) {
    ctx.save()
    var ship = entityManager.getMainShip();
    var vX = ship.velX;
    var vY = ship.velY;
    var speed = Math.sqrt(vX*vX + vY*vY);
    var dirV = [vX/speed, vY/speed];
    var cRad = 40;
    var cHeight = 50*g_settings.hudSize;
    var translation = [g_canvas.width/2, g_canvas.height - cHeight];
    
    ctx.translate(translation[0],translation[1]);
    ctx.scale(g_settings.hudSize, g_settings.hudSize);
    ctx.strokeStyle = "white";
    ctx.textAlign ="center";
    renderGyroscope(ctx,cRad,speed,dirV,ship.rotation);
    renderSpeed(ctx,cRad,speed);
    renderThrottle(ctx,cRad,ship.throttle);
    ctx.restore();
    
    }

function renderGyroscope(ctx,cRad,speed,dirV,rotation){
    var distFromC = speed > 5 ? cRad : cRad*speed/5;
    var indicPos = [dirV[0]*distFromC,dirV[1]*distFromC];
    util.strokeCircle(ctx, 0,0, cRad);
    util.fillCircle(ctx,indicPos[0],indicPos[1],1);
    util.strokeCircle(ctx,indicPos[0],indicPos[1],3);
    if (speed ==0){
	util.fillCircle(ctx,0,0,1);
	util.strokeCircle(ctx,0,0,3);
	}
    drawCross(ctx,[0,0], cRad,0,0,0,false);
    
    drawCross(ctx,indicPos,3,5,rotation,true);
    ctx.stroke();
    }

function renderSpeed(ctx,cRad,speed){
    ctx.fillText("Speed: " + (g_settings.speedToMPSConstant*speed).toFixed(2), 0, - cRad - 10);
    }

function renderThrottle(ctx,cRad,throttle) {
    ctx.moveTo(-cRad-10,-cRad);
    ctx.lineTo(-cRad-10, cRad);
    var y = -2*cRad*throttle/100 +cRad;
    ctx.moveTo(-cRad-15,y);
    ctx.lineTo(-cRad-5,y);
    ctx.moveTo(-cRad-17,0);
    ctx.lineTo(-cRad-3,0);
    ctx.moveTo(-cRad-17,-cRad);
    ctx.lineTo(-cRad-3,-cRad);
    ctx.moveTo(-cRad-17,cRad);
    ctx.lineTo(-cRad-3,cRad);
    for(var i = 0; i < 10; i++){
	var y = -2*cRad*i/10 +cRad
	ctx.moveTo(-cRad-13, y);
	ctx.lineTo(-cRad-7,y);
	
	}
    ctx.fillText(throttle+"%",-cRad - 10, -cRad -10);
    ctx.stroke();
    }

function drawCross(ctx,cPos,cRad,extra,rotation, skipBottom){
    ctx.save()
    ctx.translate(cPos[0],cPos[1]);
    ctx.rotate(rotation);
    var cE = cRad + extra;
    ctx.moveTo(-cE,0);
    ctx.lineTo(cE, 0);
    ctx.moveTo(0,-cE);
    if (skipBottom) {
	ctx.lineTo(0,0);
	}
    else {
	ctx.lineTo(0 , cE);
	}
    ctx.restore();
    
    
}
