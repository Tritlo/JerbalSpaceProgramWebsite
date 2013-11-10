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

function handleMouseDown(evt){
	g_mouseClick = [evt.clientX - g_canvas.offsetLeft,evt.clientY - g_canvas.offsetTop];
	g_mouseDown = true;
        g_settings.hudExtra = g_mouseClick;
    
}

function handleMouseMove(evt) {
    if (g_mouseDown) {
	g_mouse = [evt.clientX - g_canvas.offsetLeft,evt.clientY - g_canvas.offsetTop];
	entityManager.mouseOffset = util.vecMinus(g_mouse,g_mouseClick);

	
	}
    
}

function handleMouseUp(evt) {
	g_mouseDown = false;
        //entityManager.cameraOffset = util.vecPlus(entityManager.cameraOffset,entityManager.mouseOffset);
	entityManager.cameraOffset = util.vecPlus(entityManager.cameraOffset,util.rotateVector(util.mulVecByScalar(1/entityManager.cameraZoom,entityManager.mouseOffset),-entityManager.cameraRotation));
        entityManager.mouseOffset = [0,0];
    }
function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
    
    //entityManager.handleMouse(g_mouseX,g_mouseY);//yoinkNearestShip(g_mouseX, g_mouseY);
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mouseup", handleMouseUp);
window.addEventListener("scroll", handleMouseWheel);
