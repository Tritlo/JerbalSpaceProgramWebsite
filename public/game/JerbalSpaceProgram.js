// =========
// ASTEROIDS
// =========
/*
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
//var g_useGravity = false;
var g_useGravity = true;
var g_useAveVel = true;





var g_settings = {
          "font": "VT323",
          "useGravity": true,
          "useAveVel": true,
          "renderSpatialDebug":false,
          "hitBox": true,
          "cameraMoveRate": 10,
          "cameraZoomRate": 1.1,
          "cameraRotateRate" : Math.PI/50,
          "enableDebug" : false,
          "allowMixedActions": true,
          "enableRocks": false,
          "minLandingSpeed": 1.4,
          "minFrictSpeed": 0.1,
          "maxSafeSpeed" : 3,
          "maxSafeAngle"    : 1,
          "hudSize": 1.5,
          "hudExtra": "",
          "hudColor": "lime",
          "pixelToMeterConstant": 0.08125,
          "doClear" : true,
          "doBox" : false,
          "undoBox" : false,
          "doFlipFlop" : false,
          "doRender" : true,
          "timeMultiplier": 1,
          "renderPlanetCenter" : false,
          "graphicsLevel": 2,
          "keys": {
              "KEY_THRUST": keyCode('W'),
              "KEY_RETRO": keyCode('S'),
              "KEY_KILLTHROTTLE": keyCode('E'),
              "KEY_LEFT": keyCode('A'),
              "KEY_RIGHT": keyCode('D'),
                "KEY_TOGGLE_DEBUG": keyCode('B'),
                "KEY_QUIT" : keyCode('Q'),
                "KEY_PAUSE" :  keyCode('P'),
                "KEY_STEP" :  keyCode('O'),
                "KEY_CAMERA_RESET" : keyCode('N'),
                "KEY_CAMERA_UP" : keyCode('K'),
                "KEY_CAMERA_DOWN" : keyCode('J'),
                "KEY_CAMERA_LEFT" : keyCode('H'),
                "KEY_CAMERA_RIGHT" : keyCode('L'),
                "KEY_CAMERA_ROTATE_CLOCKWISE" : keyCode('U'),
                "KEY_CAMERA_ROTATE_COUNTERCLOCKWISE" : keyCode('I'),
                "KEY_CAMERA_ZOOMIN" : keyCode('9'),
                "KEY_CAMERA_ZOOMOUT" : keyCode('8'),
                "KEY_CAMERA_LOCK" : keyCode('Y')
              },
          "debugKeys" : {
              "KEY_GRAVITY" : keyCode('G'),
              "KEY_AVE_VEL": keyCode('V'),
              "KEY_SPATIAL": keyCode('X'),
              "KEY_MIXED": keyCode('M'),
              "KEY_HALT " : keyCode('H'),
              "KEY_RESET" : keyCode('R'),
              "KEY_0" : keyCode('0'),
              "KEY_1" : keyCode('1'),
              "KEY_2" : keyCode('2'),
              "KEY_K" : keyCode('K'),
              "KEY_TOGGLE_CLEAR"    : keyCode('C'),
              //"KEY_TOGGLE_BOX"      : keyCode('B'),
              "KEY_TOGGLE_UNDO_BOX" : keyCode('U'),
              "KEY_TOGGLE_FLIPFLOP" : keyCode('F'),
              "KEY_TOGGLE_RENDER"   : keyCode('R'),
              "KEY_SPEEDUP" : keyCode('4'),
              "KEY_SLOWDOWN" : keyCode('3')

            },
         };


function processDiagnostics() {

    if (eatKey(g_settings.keys.KEY_TOGGLE_DEBUG))
        g_settings.enableDebug = ! g_settings.enableDebug;
    
    if(g_settings.enableDebug) {
        if (eatKey(g_settings.debugKeys.KEY_MIXED))
            g_allowMixedActions = !g_allowMixedActions;

        if (eatKey(g_settings.debugKeys.KEY_GRAVITY)) g_settings.useGravity = !g_settings.useGravity;

        if (eatKey(g_settings.debugKeys.KEY_AVE_VEL)) g_settings.useAveVel = !g_settings.useAveVel;

        if (eatKey(g_settings.debugKeys.KEY_SPATIAL)) g_settings.renderSpatialDebug = !g_settings.renderSpatialDebug;

        if (eatKey(g_settings.debugKeys.KEY_HALT)) entityManager.haltShips();

        if (eatKey(g_settings.debugKeys.KEY_RESET)) entityManager.resetShips();

        if (eatKey(g_settings.debugKeys.KEY_0)) entityManager.toggleRocks();

        if (eatKey(g_settings.debugKeys.KEY_SPEEDUP)){
            g_settings.timeMultiplier/=2;
        }
        if (eatKey(g_settings.debugKeys.KEY_SLOWDOWN)) {
            if (g_settings.timeMultiplier < 1){
                g_settings.timeMultiplier*=2;
            }
                console.log(g_settings.timeMultiplier);
        }

        if (eatKey(g_settings.debugKeys.KEY_1)) entityManager.generateShip({
            cx : g_mouseX,
            cy : g_mouseY,
            
            sprite : g_sprites.ship});

        if (eatKey(g_settings.debugKeys.KEY_2)) entityManager.generateShip({
            cx : g_mouseX,
            cy : g_mouseY,
            
            sprite : g_sprites.ship2
            });

        //if (eatKey(g_settings.debugKeys.KEY_K)) entityManager.killNearestShip(
        //    g_mouseX, g_mouseY);
    }
}


// =========
// LOAD DEFAULTS
// =========

g_defaultShips = g_defaultShips.map(function (str) {
    return new Ship($.parseJSON(str));
});

//Load default parts;
g_defaultParts = g_defaultParts.map(function (str) {
    return new Part($.parseJSON(str));
});

if(util.storageLoad('parts') === undefined){
    util.storageSave('parts',g_defaultParts);
}

if(util.storageLoad('ships') === undefined){
    util.storageSave('ships',g_defaultShips);
}

var ships = util.storageLoad('ships') || [{}];
var g_sprites = {};

//Disable right click menu on canvas.

// Kick it off
g_ctx.font = g_settings.font;
//requestPreloads();
main.init();
