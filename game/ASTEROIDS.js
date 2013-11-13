// =========
// ASTEROIDS
// =========
/*
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        cx : 200,
        cy : 200
    });
    
}


// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`




// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
//var g_useGravity = false;
var g_useGravity = true;
var g_useAveVel = true;





var g_settings = {
          "useGravity": true,
          "useAveVel": true,
          "renderSpatialDebug":false,
          "hitBox": true,
          "spriteExplosion": true,
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
              "KEY_TOGGLE_RENDER"   : keyCode('R')

            },
          "seaLevel": g_canvas.height*2
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




// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
    ship : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/ship.png",
    ship2 : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/ship_2.png",
    shipOld : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/ship_old.png",
    rock : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/rock.png",
    explosion : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/explosion.png",
    lunarLander : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/lunarLander.png"
    
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

g_defaultParts = [
                     '{"stroke":"#00ff00","lineWidth":4,"currentThrust":0,"name":"Cockpit","mass":0.3,"fuel":null,"efficiency":null,"thrust":null,"type":"Other","outline":[[0,3],[4,0],[4,8],[0,5]],"attachmentPoints":[[0,4],[4,4]],"height":8,"width":4,"center":[2,4],"currentFuel":0,"radius":8}'
                    ,'{"stroke":"#00ff00","lineWidth":4,"currentThrust":0,"name":"Fuel tank","mass":0.1,"fuel":150,"efficiency":null,"thrust":null,"type":"Fuel Tank","outline":[[0,8],[0,0],[4,0],[4,8]],"attachmentPoints":[[0,4],[4,4]],"height":8,"width":4,"center":[2,4],"currentFuel":0,"radius":8}'
                    ,'{"stroke":"#00ff00","lineWidth":4,"currentThrust":0,"name":"Engine","mass":0.3,"fuel":null,"efficiency":0.9,"thrust":0.4,"type":"Other","outline":[[4,0],[2,2],[2,1],[0,0],[0,6],[2,5],[2,4],[4,6]],"flame":{"points":[[4,0],[4,6],[8,3]],"center":[4,3],"direction":[1,0],"length":4},"attachmentPoints":[[0,3]],"height":6,"width":4,"center":[2,3],"currentFuel":0,"radius":6} '

                 ]


//Load default parts;
g_defaultParts = g_defaultParts.map(function (str) {
    return new Part($.parseJSON(str));
});

if(util.storageLoad('parts') === undefined){
    util.storageSave('parts',g_defaultParts);
}


var g_sprites = {};

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.shipOld = new Sprite(g_images.shipOld);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.lunarLander  = new Sprite(g_images.lunarLander);

    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;
    g_sprites.explosion = new Sprite(g_images.explosion, [5,5],[64,64], 50);

    entityManager.init();
    createInitialShips();

    main.init();
}

//Disable right click on canvas.
$('body').on('contextmenu','#myCanvas', function(e) {return false;})
// Kick it off
requestPreloads();
