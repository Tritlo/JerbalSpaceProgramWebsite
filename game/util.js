// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


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
    return [pointList[is[0]],pointList[is[1]]];
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
    var coeffs = util.getEqOfLine(x0,y0,x1,y1);
    return [coeffs[0],coeffs[1]];
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
    return Math.abs(a*p0 +b*p1 + c)/Math.sqrt(a*a + b*b);
},

signOfCrossProduct : function(a,b) {
   return a[0]*b[1] - a[1]*b[0]; 
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

paramsToRectangle: function(x,y,w,h,rot) {
    if (rot === undefined) rot = 0;
    var w2 = w/2;
    var h2 = h/2;
    var ps = [[x+w2,y+h2],[x-w2,y+h2],[x-w2,y-w2],[x+w2,y-w2]];
    ps = ps.map(function(p) {
        p = util.translatePoint(p[0],p[1],x,y);
        p = util.rotatePoint(p[0],p[1],rot);
        p = util.translatePoint(p[0],p[1],-x,-y);
        return p;
    });
    return ps;
},
translatePoint: function(x,y,tX,tY){
    return [x-tX,y-tY];
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
    console.log(a,b);
    var vec = [a[0]-b[0],a[1]-b[1]]
    return vec
},
    

cartesianToPolar: function(vector) {
    var ampl = util.lengthOfVector(vector);
    var angle = util.angleOfVector(vector);
    return [ampl,angle];
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

inList: function(li,item) {
    return (li && (li.indexOf(item) > -1));
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
    //ctx.closePath();
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
    ctx.strokeRect(x, y, w, h);
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
    return $.parseJSON(localStorage[util._storageName] || {});
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

