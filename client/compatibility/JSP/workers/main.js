    // ========
// MAINLOOP
// ========
/*

The mainloop is one big object with a fairly small public interface
(e.g. init, iter, gameOver), and a bunch of private internal helper methods.

The "private" members are identified as such purely by the naming convention
of having them begin with a leading underscore. A more robust form of privacy,
with genuine name-hiding *is* possible in JavaScript (via closures), but I 
haven't adopted it here.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//These do nothing, but should be overwritten.
function gatherInputs() {}
function processDiagnostics() {}


var main = {
    
    // "Frame Time" is a (potentially high-precision) frame-clock for animations
    _frameTime_ms : null,
    _frameTimeDelta_ms : null,

};

// Perform one iteration of the mainloop
main.iter = function (frameTime) {
    
    // Use the given frameTime to update all of our game-clocks
    this._updateClocks(frameTime);
    
    // Perform the iteration core to do all the "real" work
    this._iterCore(this._frameTimeDelta_ms);
    
    // Diagnostics, such as showing current timer values etc.
    this._debugRender();
    
    // Request the next iteration if needed
    if (!this._isGameOver) this._requestNextIteration();
};

main._updateClocks = function (frameTime) {
    
    // First-time initialisation
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;
    
    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

main._iterCore = function (dt) {
    
    // Handle QUIT
    main.quit();
    
    gatherInputs();
    update(dt);
    render();
};

main.quit = function(){
    InstanceManager.quit()
};

main._isGameOver = false;

main.gameOver = function () {
    this._isGameOver = true;
    console.log("gameOver: quitting...");
};

// Annoying shim for Firefox and Safari
window.requestAnimationFrame = 
    window.requestAnimationFrame ||        // Chrome
    window.mozRequestAnimationFrame ||     // Firefox
    window.webkitRequestAnimationFrame;    // Safari

// This needs to be a "global" function, for the "window" APIs to callback to
function mainIterFrame(frameTime) {
    main.iter(frameTime);
}

main._requestNextIteration = function () {
    window.requestAnimationFrame(mainIterFrame);
};

// Mainloop-level debug-rendering


main._doTimerShow = false;

main._debugRender = function () {
    InstanceManager.processDiagnostics(this._frameTime_ms,this._frameTimeDelta_ms,g_prevUpdateDu);

};

main.initialized = false;

main.init = function () {
    
    // Grabbing focus is good, but it sometimes screws up jsfiddle,
    // so it's a risky option during "development"
    //
    window.focus(true);

    // We'll be working on a black background here,
    // so let's use a fillStyle which works against that...
    //
    //g_ctx.fillStyle = "white";
    this._isGameOver = false;
    this.initialized = true;
    this._requestNextIteration();
};
