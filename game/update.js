// GENERIC UPDATE LOGIC

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Dt means "delta time" and is in units of the timer-system (i.e. milliseconds)
//
var g_prevUpdateDt = null;

// Du means "delta u", where u represents time in multiples of our nominal interval
//
var g_prevUpdateDu = null;

// Track odds and evens for diagnostic / illustrative purposes
//
var g_isUpdateOdd = false;


function update(dt) {
    

    // Remember this for later
    //
    var original_dt = dt;
    
    // Warn about very large dt values -- they may lead to error
    //
    if (dt > 200) {
        console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
        dt = NOMINAL_UPDATE_INTERVAL;
    }
    
    // If using variable time, divide the actual delta by the "nominal" rate,
    // giving us a conveniently scaled "du" to work with.
    //
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
    if(!(shouldSkipUpdate())){
        stateManager.update(du);
        g_prevUpdateDt = original_dt;
        g_prevUpdateDu = du;
        g_isUpdateOdd = !g_isUpdateOdd;
    }
    stateManager.cameraUpdate(du);
    
}

// Togglable Pause Mode
//

var g_isUpdatePaused = false;

function shouldSkipUpdate() {
    if (eatKey(g_settings.keys.KEY_PAUSE)) {
        g_isUpdatePaused = !g_isUpdatePaused;
    }
    return g_isUpdatePaused && !eatKey(g_settings.keys.KEY_STEP);    
}
