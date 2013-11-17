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
          "spriteExplosion": false,
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
    //ship : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/ship.png",
    //ship2 : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/ship_2.png",
    //shipOld : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/ship_old.png",
    //rock : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/rock.png",
    explosion : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/explosion.png",
    //lunarLander : "https://raw.github.com/Tritlo/JerbalSpaceProgram/master/game/sprites/lunarLander.png"
    
        };

    imagesPreload(requiredImages, g_images, preloadDone);
}

g_defaultParts = [
                     '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Cockpit","mass":0.2,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[4,0],[0,8],[12,8],[8,0]],"attachmentPoints":[[6,0],[6,8]],"height":8,"width":12,"center":[6,4],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[0,0],[12,8]]}'
                    ,'{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Fuel Tank","mass":0.2,"fuel":500,"efficiency":0,"thrust":0,"type":"Fuel Tank","outline":[[0,0],[12,0],[12,4],[0,4]],"height":4,"width":12,"center":[6,2],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[0,0],[12,4]],"attachmentPoints":[[6,0],[6,4]]}'
                    ,'{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Engine","mass":0.3,"fuel":0,"efficiency":0.4,"thrust":0.2,"type":"Engine","outline":[[12,0],[0,0],[4,4],[5,4],[2,8],[10,8],[7,4],[8,4]],"flame":{"points":[[3,8],[9,8],[6,26]],"center":[6,8],"direction":[0,1],"length":18},"height":8,"width":12,"center":[6,4],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[0,0],[12,8]]}'
                    , '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Leg Left","mass":0,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[3,10],[5,11],[5,12],[0,12],[0,11],[2,10],[2,4],[7,0],[8,0],[8,1],[3,5]],"attachmentPoints":[[8,1]],"height":12,"width":8,"center":[3.909090909090909,6.909090909090909],"gridCenterOffset":[-0.9090909090909092,-0.9090909090909092],"currentFuel":0,"radius":12,"hitBox":[[-0.09090909090909083,0.9090909090909092],[7.909090909090909,12.90909090909091]]}'
                    , '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Leg Right","mass":0,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[3,12],[3,11],[5,10],[5,5],[0,1],[0,0],[1,0],[6,4],[6,10],[8,11],[8,12]],"attachmentPoints":[[0,1]],"height":12,"width":8,"center":[4.090909090909091,6.909090909090909],"gridCenterOffset":[-0.09090909090909083,-0.9090909090909092],"currentFuel":0,"radius":12,"hitBox":[[0.09090909090909083,0.9090909090909092],[8.09090909090909,12.90909090909091]]} '

                 ];

g_defaultShips = [
                  '{"parts":[{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Cockpit","mass":0.2,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[-3.9999999999999964,-25.77777777777777],[-11.999999999999996,-9.777777777777771],[12.000000000000002,-9.777777777777771],[4.000000000000002,-25.77777777777777]],"attachmentPoints":[[3.552713678800501e-15,-25.77777777777777],[3.552713678800501e-15,-9.777777777777771]],"height":8,"width":12,"center":[-13.999999999999996,-21.77777777777777],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[-11.999999999999996,-25.77777777777777],[12.000000000000002,-9.777777777777771]],"centerOfRot":[-13.999999999999998,-12.888888888888886],"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Leg Left","mass":0,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[-21.999999999999996,24.22222222222223],[-17.999999999999996,26.22222222222223],[-17.999999999999996,28.22222222222223],[-27.999999999999996,28.22222222222223],[-27.999999999999996,26.22222222222223],[-23.999999999999996,24.22222222222223],[-23.999999999999996,12.222222222222229],[-13.999999999999996,4.2222222222222285],[-11.999999999999996,4.2222222222222285],[-11.999999999999996,6.2222222222222285],[-21.999999999999996,14.222222222222229]],"attachmentPoints":[[-11.999999999999996,6.2222222222222285]],"height":12,"width":8,"center":[-24.090909090909086,-3.8686868686868614],"gridCenterOffset":[-0.9090909090909092,-0.9090909090909101],"currentFuel":0,"radius":12,"hitBox":[[-28.18181818181818,6.040404040404049],[-12.181818181818178,30.04040404040405]],"centerOfRot":[-13.999999999999998,-12.888888888888886],"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Fuel Tank","mass":0.2,"fuel":500,"efficiency":0,"thrust":0,"type":"Fuel Tank","outline":[[-11.999999999999996,-9.777777777777771],[12.000000000000002,-9.777777777777771],[12.000000000000002,-1.7777777777777715],[-11.999999999999996,-1.7777777777777715]],"height":4,"width":12,"center":[-13.999999999999996,-15.777777777777771],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[-11.999999999999996,-9.777777777777771],[12.000000000000002,-1.7777777777777715]],"attachmentPoints":[[3.552713678800501e-15,-9.777777777777771],[3.552713678800501e-15,-1.7777777777777715]],"centerOfRot":[-13.999999999999998,-12.888888888888886],"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Fuel Tank","mass":0.2,"fuel":500,"efficiency":0,"thrust":0,"type":"Fuel Tank","outline":[[-11.999999999999996,-1.7777777777777715],[12.000000000000002,-1.7777777777777715],[12.000000000000002,6.2222222222222285],[-11.999999999999996,6.2222222222222285]],"height":4,"width":12,"center":[-13.999999999999996,-11.777777777777771],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[-11.999999999999996,-1.7777777777777715],[12.000000000000002,6.2222222222222285]],"attachmentPoints":[[3.552713678800501e-15,-1.7777777777777715],[3.552713678800501e-15,6.2222222222222285]],"centerOfRot":[-13.999999999999998,-12.888888888888886],"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Leg Right","mass":0,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[18,28.22222222222223],[18,26.22222222222223],[22,24.22222222222223],[22,14.222222222222229],[12.000000000000002,6.2222222222222285],[12.000000000000002,4.2222222222222285],[14.000000000000002,4.2222222222222285],[24,12.222222222222229],[24,24.22222222222223],[28,26.22222222222223],[28,28.22222222222223]],"attachmentPoints":[[12.000000000000002,6.2222222222222285]],"height":12,"width":8,"center":[-3.9090909090909065,-3.8686868686868614],"gridCenterOffset":[-0.09090909090908994,-0.9090909090909101],"currentFuel":0,"radius":12,"hitBox":[[12.181818181818182,6.040404040404049],[28.18181818181818,30.04040404040405]],"centerOfRot":[-13.999999999999998,-12.888888888888886],"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Engine","mass":0.3,"fuel":0,"efficiency":0.4,"thrust":0.2,"type":"Engine","outline":[[12.000000000000002,6.2222222222222285],[-11.999999999999996,6.2222222222222285],[-3.9999999999999964,14.222222222222229],[-1.9999999999999964,14.222222222222229],[-7.9999999999999964,22.22222222222223],[8.000000000000002,22.22222222222223],[2.0000000000000018,14.222222222222229],[4.000000000000002,14.222222222222229]],"flame":{"points":[[-5.9999999999999964,22.22222222222223],[6.000000000000002,22.22222222222223],[3.552713678800501e-15,36.22222222222223]],"center":[2.6645352591003757e-15,22.22222222222223],"direction":[6.344131569286608e-17,1],"length":14},"height":8,"width":12,"center":[-13.999999999999996,-5.7777777777777715],"gridCenterOffset":[0,0],"currentFuel":0,"radius":12,"hitBox":[[-11.999999999999996,6.2222222222222285],[12.000000000000002,22.22222222222223]],"centerOfRot":[-13.999999999999998,-12.888888888888886],"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0}],"name":"Jerbal I","_spatialID":5,"_isDeadNow":false,"reset_cx":200,"reset_cy":200,"reset_rotation":0,"_scale":1,"_isWarping":false,"mass":2.8000000000000003,"fuel":2000,"maxThrust":0.6000000000000001,"height":55.81818181818182,"width":24.36363636363636,"cx":13.999999999999998,"cy":12.888888888888886,"center":[13.999999999999998,12.888888888888886],"radius":55.81818181818182} '
                    ]

//Load default ships
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
function createInitialShips() {
    entityManager.generateShip(ships[0]);
}

var g_sprites = {};

function preloadDone() {

    /*
    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.shipOld = new Sprite(g_images.shipOld);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.lunarLander  = new Sprite(g_images.lunarLander);

    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;
    */
    g_sprites.explosion = new Sprite(g_images.explosion, [5,5],[64,64], 50);

    entityManager.init();
    createInitialShips();

    main.init();
}

//Disable right click on canvas.
$('body').on('contextmenu','#myCanvas', function(e) {return false;})
// Kick it off
requestPreloads();
