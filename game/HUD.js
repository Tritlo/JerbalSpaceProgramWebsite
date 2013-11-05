

function renderHUD(ctx,ship) {
    ctx.save();
    ctx.strokeStyle = g_settings.hudColor;
    ctx.fillStyle = g_settings.hudColor;
    ctx.textAlign ="center";
    var ship = entityManager.getMainShip();
    renderLowerHud(ctx,ship);
    renderUpperHud(ctx,ship);
    ctx.restore();
    }

function renderLowerHud(ctx,ship){
    ctx.save()
    var vX = ship.velX;
    var vY = ship.velY;
    var speed = Math.sqrt(vX*vX + vY*vY);
    var dirV = [vX/speed, vY/speed];
    var cRad = 40;
    var cHeight = 50*g_settings.hudSize;
    var translation = [g_canvas.width/2, g_canvas.height - cHeight];
    //Below
    ctx.translate(translation[0],translation[1]);
    ctx.scale(g_settings.hudSize, g_settings.hudSize);
    renderGyroscope(ctx,cRad,speed,dirV,ship.rotation);
    renderSpeed(ctx,cRad,speed);
    renderThrottle(ctx,cRad,ship.throttle);
    ctx.restore();
    }

function renderUpperHud(ctx,ship){
    ctx.save()
    var uHeight = 10*g_settings.hudSize;
    ctx.translate(g_canvas.width/2,uHeight);
    ctx.scale(g_settings.hudSize, g_settings.hudSize);
    renderAltitude(ctx,ship);
    ctx.restore();
    }

function renderAltitude(ctx,ship) {
    //TODO: Make altitude accurate according to speed 
    ctx.fillText("Alt: " + (g_settings.pixelToMeterConstant*ship.getAltitude()).toFixed(0) + " m", 0,0);
    ctx.stroke();
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
    //TODO: Make speed accurate according to altitude change
    ctx.fillText("Speed: " + (g_settings.pixelToMeterConstant*speed*60).toFixed(2) + " m/s" , 0, - cRad - 10);
    }

function renderThrottle(ctx,cRad,throttle) {
    var throttleOffset = 15;
    var tO = throttleOffset;
    ctx.moveTo(-cRad-tO,-cRad);
    ctx.lineTo(-cRad-tO, cRad);
    var y = -2*cRad*throttle/100 +cRad;
    ctx.moveTo(-cRad-(tO+5),y);
    ctx.lineTo(-cRad-(tO-5),y);
    ctx.moveTo(-cRad-(tO+7),0);
    ctx.lineTo(-cRad-(tO-7),0);
    ctx.moveTo(-cRad-(tO+7),-cRad);
    ctx.lineTo(-cRad-(tO-7),-cRad);
    ctx.moveTo(-cRad-(tO+7),cRad);
    ctx.lineTo(-cRad-(tO-7),cRad);
    for(var i = 0; i < 10; i++){
	var y = -2*cRad*i/10 +cRad
	ctx.moveTo(-cRad-(tO+3), y);
	ctx.lineTo(-cRad-(tO-3),y);
	
	}
    ctx.fillText(throttle+"%",-cRad - tO, -cRad -10);
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
