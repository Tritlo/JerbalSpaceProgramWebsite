// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0,
    g_mouseDown = false,
    g_mouseClick = [0,0],
    g_mouse = [0,0];

function handleMouseDown(evt){ handleMouse(evt,"down"); }
function handleMouseMove(evt) { handleMouse(evt,"move"); }
function handleMouseUp(evt) { handleMouse(evt,"up"); }

//Just pass to state;
function handleMouse(evt,type) {
    if(typeof(Instances) !== "undefined"){
	var g_mouse = [evt.clientX,evt.clientY];
	for(var i =0; i < Instances.length; ++i){
	    var inst = Instances[i];
	    var pos = util.findPos(inst.canvas);
	    var w = inst.canvas.width;
	    var h = inst.canvas.height;
	    if (util.isBetween(g_mouse[0],pos.x, pos.x+w) && util.isBetween(g_mouse[1],pos.y,pos.y+h)){
		inst.stateManager.handleMouse(evt,type);
		return true;
		}
	    }
	return false;
    }
    return false;
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mouseup", handleMouseUp);
