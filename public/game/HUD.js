
function renderHUD(ctx,ship) {
    ctx.save();
    ctx.strokeStyle = g_settings.hudColor;
    ctx.fillStyle = g_settings.hudColor;
    ctx.textAlign ="center";
    ctx.font = "10pt " +g_settings.font;
    console.log(g_settings.font);
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
    var orb = ship.orbit;
    var dirOfOrbVel;
    if(orb){
        var shipToOrbc = util.vecMinus(ship.center,[orb[0],orb[1]]);
        var dirOfOrbVel = util.angleOfVector(shipToOrbc) + Math.PI;
    }
    ctx.translate(translation[0],translation[1]);
    ctx.scale(g_settings.hudSize, g_settings.hudSize);
    renderGyroscope(ctx,cRad,speed,dirV,ship.rotation,ship.angularVel,dirOfOrbVel);
    renderSpeed(ctx,cRad,speed);
    renderThrottle(ctx,cRad,ship.throttle);
    ctx.restore();
    }

function renderUpperHud(ctx,ship){
    ctx.save()
    var uHeight = 10*g_settings.hudSize;
    ctx.translate(g_canvas.width/2,uHeight);
    ctx.scale(g_settings.hudSize, g_settings.hudSize);
    renderAltitude(ctx,ship,0);
    renderFuel(ctx,ship,10);
    if (g_settings.hudExtra.length > 0) {
	renderExtra(ctx,20);
	}
    ctx.restore();
    }

function renderFuel(ctx,ship,yoffset) {
    var fuel = ship.fuel;
    ctx.fillText("Fuel: " + fuel.toFixed(0), 0,yoffset);
    ctx.stroke();
    }

function renderExtra(ctx,yoffset){
    ctx.fillText("Extra: " + g_settings.hudExtra, 0,yoffset);
    ctx.stroke();
    }
    
    

function renderAltitude(ctx,ship,yoffset) {
    ctx.fillText("Alt: " + (g_settings.pixelToMeterConstant*ship.getAltitude()).toFixed(0) + " m", 0,yoffset);
    ctx.stroke();
    }

function renderGyroscope(ctx,cRad,speed,dirV,rotation,rotVel,dirOfOrbVel){
    var distFromC = speed > 5 ? cRad : cRad*speed/5;
    var indicPos = [dirV[0]*distFromC,dirV[1]*distFromC];
    ctx.beginPath();
    util.strokeCircle(ctx, 0,0, cRad);
    util.fillCircle(ctx,indicPos[0],indicPos[1],1);
    util.strokeCircle(ctx,indicPos[0],indicPos[1],3);
    if (speed === 0){
	util.fillCircle(ctx,0,0,1);
	util.strokeCircle(ctx,0,0,3);
	}
    drawCross(ctx,[0,0], cRad,0,0,0,false);
    drawCross(ctx,indicPos,3,5,rotation,true);
    var angleORotInd = Math.abs(rotVel) > 0.05 ? util.sign(rotVel)*Math.PI/2 : (2*Math.PI*rotVel/0.2);
    var rotCrossPos = util.rotateVector([0,-cRad-3],angleORotInd);
    drawCross(ctx,
	      rotCrossPos,
	      cRad*0.2,3,angleORotInd+Math.PI,true,true);
    if(dirOfOrbVel !== undefined){
        var orbDirPos = util.rotateVector([0,-cRad],dirOfOrbVel);
        util.strokeCircle(ctx,orbDirPos[0],orbDirPos[1],3);
        ctx.stroke();
    }
    ctx.closePath();
    ctx.stroke();
    }

function renderSpeed(ctx,cRad,speed){
    //TODO: Make speed accurate according to altitude change
    ctx.fillText("Speed: " + (g_settings.pixelToMeterConstant*speed*60).toFixed(2) + " m/s" , 0, - cRad - 10);
    }

function renderThrottle(ctx,cRad,throttle) {
    var throttleOffset = 15;
    var tO = throttleOffset;
    ctx.closePath();
    ctx.beginPath();
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
    ctx.closePath();
    }

function drawCross(ctx,cPos,cRad,extra,rotation, skipBottom,onlyLine){
    ctx.save()
    ctx.translate(cPos[0],cPos[1]);
    ctx.rotate(rotation);
    var cE = cRad + extra;
    ctx.beginPath();
    if(!onlyLine) {
    ctx.moveTo(-cE,0);
    ctx.lineTo(cE, 0);
	}
    ctx.moveTo(0,-cE);
    if (skipBottom) {
	ctx.lineTo(0,0);
	}
    else {
	ctx.lineTo(0 , cE);
	}
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    
    
}