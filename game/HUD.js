

function renderHUD(ctx) {
    ctx.save()
    var ship = entityManager.getMainShip();
    var vX = ship.velX;
    var vY = ship.velY;
    var speed = Math.sqrt(vX*vX + vY*vY);
    var dirV = [vX/speed, vY/speed];
    var hs = g_settings.hudSize;
    var cRad = 40;
    var cPos = [0,0];
    var distFromC = speed > 5 ? cRad : cRad*speed/5;
    var indicPos = [cPos[0]+dirV[0]*distFromC,cPos[1]+dirV[1]*distFromC];
    var translation = [g_canvas.width/2, g_canvas.height - cRad - 25*g_settings.hudSize];
    ctx.translate(translation[0],translation[1]);
    ctx.scale(g_settings.hudSize, g_settings.hudSize);
    ctx.strokeStyle = "white";
    ctx.textAlign ="center";
    util.strokeCircle(ctx, cPos[0],cPos[1], cRad);
    util.fillCircle(ctx,indicPos[0],indicPos[1],1);
    util.strokeCircle(ctx,indicPos[0],indicPos[1],3);
    if (speed ==0){
	util.fillCircle(ctx,cPos[0],cPos[1],1);
	util.strokeCircle(ctx,cPos[0],cPos[1],3);
	}
    ctx.fillText("Speed: " + (g_settings.speedToMPSConstant*speed).toFixed(2), cPos[0], cPos[1] - cRad - 10);
    
    drawCross(ctx,cPos, cRad,0,0,0,false);
    
    drawCross(ctx,indicPos,3,5,ship.rotation,true);
    ctx.stroke();
    
    ctx.restore();
    
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
