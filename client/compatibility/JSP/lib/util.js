// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
    value = lowBound;
    } else if (value > highBound) {
    value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
    value += (highBound - lowBound);
    }
    while (value > highBound) {
    value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},

circInBox: function (x,y,radius,topLeftCorner,bottomRightCorner){
    var TLC = topLeftCorner;
    var BRC = bottomRightCorner;
    var eTLC = [x-radius, y-radius];
    var eBRC = [x+radius, y+radius];
    return ( !(eBRC[1] < TLC[1]) && !(eTLC[1] > BRC[1]) &&
         !(eBRC[0] < TLC[0]) && !(eTLC[0] > BRC[0]));
},

findPos : function(obj) {
    var rect = obj.getBoundingClientRect();
    return {x: rect.left, y: rect.top};
},

findPosOnPage: function(obj){
   var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},

findIndexOfClosest: function (x0,pointList) {
    var xs = [];
    var ys = [];
    pointList.map(function (x) {
        xs.push(x[0]);
        ys.push(x[1]);
    });
    var i = util.binarySearch(x0,xs);
    return i;
    },

findIndexesOfClosestPoints: function(x0,pointList){
    var i = util.findIndexOfClosest(x0,pointList);
    if (pointList[i][0] <= x0)
    return [i,i+1];
    else
    return [i-1,i];
    },
    

findClosestPoints: function (x0,y0, pointList) {
    var is = util.findIndexesOfClosestPoints(x0,pointList);
    return [pointList[(pointList.length+is[0])%pointList.length],pointList[is[1]%pointList.length]];
},

findSurfaceBelow: function(body,points,center)
{	
	var angle=util.angleOfVector(util.vecMinus(body,center));
	var angles=[];
	points.map(function (x) 
	{
		angles.push(util.angleOfVector(util.vecMinus(x,center)));
	});
	//angles.reverse();
	var i = util.binarySearch(angle,angles);
	if(angles[i]<=angle)
		return [points[i],points[(i+1)%points.length]];
	else
	{	
		if (i===0)
		return [points[0],points[points.length-1]]
		else
		return [points[(points.length+i-1)%points.length],points[i]];
	}
},

//Wraps a list of points around center;
wrapListAround: function(points,center)
{
	var distance=points[0][0]-points[points.length-1][0];
	var returnList=[];
	points.map(function(x){ returnList.push(util.vecPlus(util.polarToCartesian([x[1],2*x[0]/distance*Math.PI]),center))});
	returnList.pop();
	returnList.reverse();
	return returnList;
},	



binarySearch: function(val,list) {
    var low = 0;
    var high = list.length -1;
    while(high > low){
        var mid = Math.floor(low + (high-low)/2);
        if ( val > list[mid]){
            low = mid+1; 
        }
        else {
            high = mid;
        }
    }
    return low;
},

// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return util.square(x2-x1) + util.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},

getEqOfLine: function (x0,y0,x1,y1) {
    var m = (y1 -y0)/(x1-x0);
    var c = (y0 - m*x0);
    return [(y1-y0),(x0-x1),c*(x1-x0)];
},

lineNormal: function(x0,y0,x1,y1){
    if(x0 !== x1){
        var coeffs = util.getEqOfLine(x0,y0,x1,y1);
        return util.normalizeVector([coeffs[0],coeffs[1]]);
    } else {
        return [1,0]
    }
},

sideOfLine: function(a0,a1,b0,b1,p0,p1) {
    return util.sign( (b0-a0)*(p1-a1) - (b1-a1)*(p0-a0));
},

projectionOfPointOnLine: function(x0,y0,x1,y1,p0,p1) {
    var lN = util.lineNormal(x0,y0,x1,y1);
    var lineV = util.normalOfVector(lN);
    var projOfPOnLRatio = util.dotProd([p0,p1],lineV)/util.dotProd(lineV,lineV);
    var projOfPOnL = [projOfPOnLRatio*lineV[0], projOfPOnLRatio*lineV[1]];
    return projOfPOnL;
},


normalOfVector: function(a) {
    return [a[1],-1*a[0]];
},

normalizeVector: function(a) {
    var len = util.lengthOfVector(a);
    return util.mulVecByScalar(1/len,a);
},

dotProd: function(a,b) {
    return a[0]*b[0] + a[1]*b[1];
},

lengthOfVector: function(a) {
    return Math.sqrt(util.dotProd(a,a));
},

angleOfVector: function(a) {
    return Math.atan2(a[1],a[0]);
}, 
angleBetweenVectors: function(a,b) {
    var dPScaled = util.dotProd(a,b)/(util.lengthOfVector(a)*util.lengthOfVector(b));
    return Math.acos(dPScaled);
},

distFromLine: function(x0,y0,x1,y1,p0,p1) {
    var coeffs = util.getEqOfLine(x0,y0,x1,y1);
    var a = coeffs[0];
    var b = coeffs[1];
    var c = coeffs[2];
    if(b === 0){
        console.log("warning, vertical line!") 
        return Math.abs(p0-x0);
    } else {
        return Math.abs(a*p0 +b*p1 + c)/Math.sqrt(a*a + b*b);
    }
},

signOfCrossProduct : function(a,b) {
   return a[0]*b[1] - a[1]*b[0]; 
},

crossProdMagn: function(r,v){
    return util.lengthOfVector(r)*util.lengthOfVector(v)*util.angleBetweenVectors(r,v);
},

tripleProduct : function (a,b,c){
    return util.vecMinus(util.mulVecByScalar(util.dotProd(a,c),b),util.mulVecByScalar(util.dotProd(a,b),c));
},

sign: function(x) {
    if (x > 0) return 1;
    if(x < 0) return -1;
    return 0;
},

    
lineBelow : function(terrain,x,y) {
    var points = util.findClosestPoints(x,y,terrain);
    return points;
},


paramsToRectangle: function(x,y,w,h,rot,cRot) {
    if (rot === undefined) rot = 0;
    var w2 = w/2;
    var h2 = h/2;
    var ps = [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
    if(cRot === undefined) var cRot = util.avgOfPoints(ps);
    ps = ps.map(function(p) {
        return util.rotatePointAroundPoint(p,rot,cRot[0],cRot[1]);
    });
    return ps;
},

avgOfPoints: function(points) {
    var ps = [0,0];
    for(var i = 0; i < points.length; i++){
        ps = util.vecPlus(points[i],ps) 
    }

    return util.mulVecByScalar(1/points.length,ps)
},

translatePoint: function(x,y,tX,tY){
    return [x+tX,y+tY];
},

rotatePointAroundPoint: function (p,rot,x,y){
        p = util.translatePoint(p[0],p[1],-x,-y);
        p = util.rotatePoint(p[0],p[1],rot);
        p = util.translatePoint(p[0],p[1],x,y);
        return p;
},

rotatePoint: function (x,y,rot) {
    return [x*Math.cos(rot)-y*Math.sin(rot), x*Math.sin(rot)+y*Math.cos(rot)];
},

polarToCartesian: function(vector) {
	return [vector[0]*Math.cos(vector[1]), vector[0]*Math.sin(vector[1])];
},

mulVecByScalar: function(scalar,vector){
    return [scalar*vector[0],scalar*vector[1]];
},

vecPlus: function(a,b) {
    return [a[0]+b[0], a[1]+b[1]]
},

rotateVector: function(a,rot){
    var pol = util.cartesianToPolar(a);
    return util.polarToCartesian([pol[0],pol[1]+rot]);
},
    
vecMinus: function(a,b) {
    if(b===undefined){
        debugger;
    }
    var vec = [a[0]-b[0],a[1]-b[1]]
    return vec
},
    

cartesianToPolar: function(vector,refCenter) {
    if(refCenter === undefined) var refCenter = [0,0];
    var vector = util.vecMinus(vector,refCenter);
    var ampl = util.lengthOfVector(vector);
    var angle = util.angleOfVector(vector);
    return [ampl,angle];
},

solveQuadratic: function(coeffs){
    var a = coeffs[0];
    var b = coeffs[1];
    var c = coeffs[2];
    var d = b*b - 4*a*c
    if(d > 0){
        var sqD = Math.sqrt(d);
        return [(-b-sqD)/(2*a), (-b+sqD)/(2*a)]
    } else {
        //No complex numbers
        return undefined;
    }
},

//rotates a list so that element at ind
//becomes the last element
rotateList: function(li,ind) {
    if(li && ind >= 0 && ind < li.length) {
        var s = li.slice(0,ind+1);
        var e = li.slice(ind+1,li.length);
        li = e.concat(s);
    }
    return li;
},

//Compare objects based on their properties.
//DO NOT USE ON OBJECTS WHICH CONTAIN THEM SELVES!
compEq: function(a,b,akeys,bkeys){
    if( typeof a === "object" && typeof b === "object"){
        var akeys = akeys || Object.keys(a);
        var bkeys = bkeys || Object.keys(b);
        if( akeys.length !== bkeys.length){ 
            return false;
        }
        for (var i = 0; i < akeys.length; i++)
        {
            if (!(util.compEq(a[akeys[i]],b[akeys[i]]))){
                return false;
            }
        }
        return true;
    } else
        return a === b

},

indexOfObj: function(li,item) {
    if(li){
        if(typeof item === "object"){
            var ikeys = Object.keys(item);
            for(var i = 0; i < li.length; i++)
            {
                if (util.compEq(item,li[i],ikeys))
                {
                    return i;
                }
            }
            return -1;
        } else {
            return (li.indexOf(item));
        }
    } else {
        return -1;
    }
},

lastIndexOfObj: function(li,item) {
    if(li){
        if(typeof item === "object"){
            var ikeys = Object.keys(item);
            var ind = -1;
            for(var i = 0; i < li.length; i++)
            {
                if (util.compEq(item,li[i],ikeys))
                {
                    ind = i;
                }
            }
            return ind;
        } else {
            return (li.indexOf(item));
        }
    } else {
        return -1;
    }
},

// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

strokeEllipseByCenter: function(ctx, cx, cy, w, h,angl,cRot) {
  ctx.save();
  ctx.translate(cRot[0],cRot[1]);
  ctx.rotate(angl);
  ctx.translate(-cRot[0],-cRot[1]);
  util.strokeEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
  ctx.restore()
},


strokeEllipse: function(ctx, x, y, w, h) {
  if(angl === undefined) var angl = 0;
  if(cRot === undefined) var cRot = [x,y];
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle
  
  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
},


fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
},


strokeTriangle: function (ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry) {
    util.drawTriangle(ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry,true);
    },

drawTriangle: function (ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry,strokeNotFill) {
    // x0,y0,... are the corner-points of the triangle
    // rot is the rotation in radians, rx and ry denote
    // the center of rotation.
    rot = rot || 0;
    rx = rx || (x0 + x1 + x2)/3;
    ry = ry || (y0 + y1 + y2)/3;
    
    ctx.save();
    
    ctx.translate(rx,ry);
    x0 = x0 - rx;
    x1 = x1 - rx;
    x2 = x2 - rx;
    y0 = y0 - ry;
    y1 = y1 - ry;
    y2 = y2 - ry;
    ctx.rotate(rot);
    
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    if (strokeNotFill) {
	ctx.stroke();
    }
    else {
	ctx.fill();
    }
    ctx.restore();
    },
    
fillTriangle: function (ctx,x0,y0,x1,y1,x2,y2,rot,rx,ry) {
    util.drawTriangle(ctx,x0,y0,x1,y1,rot,rx,ry,false);
    },
    
fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

strokeBox: function (ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.strokeRect(x, y, w, h);
    ctx.closePath();
},

drawDot: function (ctx,x,y,color){
    color = color || ctx.fillStyle;
    this.fillBox(ctx,x,y,1,1,color);
},

drawLine: function(ctx,x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
},

// =======
// Storage
// =======

_storageName: "JerbalSpaceProgramStorage",

fetchStorage: function(){
	if (localStorage[util._storageName]){
    	return $.parseJSON(localStorage[util._storageName]);
	}
	return {};
},

setStorage: function(obj){
    localStorage[util._storageName] = JSON.stringify(obj);
},


storageSave: function(key,value){
    if(typeof Storage === "undefined") return;
    var sto = util.fetchStorage();
    sto[key] = value;
    util.setStorage(sto);
},

echoJSON: function(value){
    console.log(JSON.stringify(value));
},

storageLoad: function(key){
    if(typeof Storage === "undefined") return null;
    var sto = util.fetchStorage();
    return sto[key];
},

storageReset: function(){
    if(typeof Storage === "undefined") return;
    util.setStorage({});
},

//Inputs
hideAllInputs: function () {
    $('input').hide();
    },
};
