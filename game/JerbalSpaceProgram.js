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
          "timeMultiplier": 1,
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
            "KEY_CAMERA_LOCK" : keyCode('Y'),
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

    '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Cockpit","mass":0.5,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[8,0],[0,16],[24,16],[16,0]],"attachmentPoints":[[12,0],[12,16]],"height":16,"width":24,"center":[12,8],"gridCenterOffset":[0,0],"currentFuel":0,"radius":24,"hitBox":[[0,0],[24,16]],"origOutline":[[8,0],[0,16],[24,16],[16,0]]} '

    , '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Fuel Tank","mass":0.2,"fuel":500,"efficiency":0,"thrust":0,"type":"Fuel Tank","outline":[[0,0],[0,8],[24,8],[24,0]],"attachmentPoints":[[12,0],[12,8]],"height":8,"width":24,"center":[12,4],"gridCenterOffset":[0,0],"currentFuel":0,"radius":24,"hitBox":[[0,0],[24,8]],"origOutline":[[0,0],[0,8],[24,8],[24,0]]} '
    , '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Right Leg","mass":0.1,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[0,2],[0,0],[8,0],[8,24],[10,24],[10,26],[6,26],[6,24],[8,24],[8,2]],"attachmentPoints":[[0,1]],"height":26,"width":10,"center":[6.4,15.2],"gridCenterOffset":[-0.40000000000000036,-0.1999999999999993],"currentFuel":0,"hitBox":[[0,0],[10,26]],"centerOfRot":[6.4,15.2],"origOutline":[[0,2],[0,0],[8,0],[8,24],[10,24],[10,26],[6,26],[6,24],[8,24],[8,2]],"radius":5}'
    , '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Left Leg","mass":0.1,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[4,24],[2,24],[2,0],[10,0],[10,2],[2,2],[2,24],[0,24],[0,26],[4,26]],"attachmentPoints":[[10,1]],"height":26,"width":10,"center":[3.6,15.2],"gridCenterOffset":[-0.6000000000000001,-0.1999999999999993],"currentFuel":0,"hitBox":[[0,0],[10,26]],"centerOfRot":[3.6,15.2],"origOutline":[[4,24],[2,24],[2,0],[10,0],[10,2],[2,2],[2,24],[0,24],[0,26],[4,26]],"radius":5}'
    , '{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Engine","mass":0.3,"fuel":0,"efficiency":0.5,"thrust":0.2,"type":"Other","outline":[[0,0],[0,1],[0,1],[8,9],[4,15],[20,15],[16,9],[24,1],[24,0]],"attachmentPoints":[[24,0],[0,0],[12,0]],"flame":{"points":[[4,15],[20,15],[12,41]],"center":[12,15],"direction":[0,1],"length":26},"height":15,"width":24,"center":[10.666666666666666,5.666666666666667],"gridCenterOffset":[-0.6666666666666661,-0.666666666666667],"currentFuel":0,"hitBox":[[0,0],[24,15]],"centerOfRot":[10.666666666666666,5.666666666666667],"origOutline":[[0,0],[0,1],[0,1],[8,9],[4,15],[20,15],[16,9],[24,1],[24,0]],"radius":7.5} '
                 ];

g_defaultShips = [ '{"parts":[{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Cockpit","mass":0.5,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[24,0],[16,16],[40,16],[32,0]],"attachmentPoints":[[28,0],[28,16]],"height":16,"width":24,"center":[28,8],"gridCenterOffset":[0,0],"currentFuel":0,"radius":8,"hitBox":[[16,0],[40,16]],"origOutline":[[24,0],[16,16],[40,16],[32,0]],"centerOfRot":[27.714285714285715,24.385714285714286],"attached":false,"renderHb":false,"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Fuel Tank","mass":0.2,"fuel":500,"efficiency":0,"thrust":0,"type":"Fuel Tank","outline":[[16,16],[16,24],[40,24],[40,16]],"attachmentPoints":[[28,16],[28,24]],"height":8,"width":24,"center":[28,20],"gridCenterOffset":[0,0],"currentFuel":0,"radius":4,"hitBox":[[16,16],[40,24]],"origOutline":[[16,16],[16,24],[40,24],[40,16]],"centerOfRot":[27.714285714285715,24.385714285714286],"attached":true,"renderHb":false,"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Fuel Tank","mass":0.2,"fuel":500,"efficiency":0,"thrust":0,"type":"Fuel Tank","outline":[[16,24],[16,32],[40,32],[40,24]],"attachmentPoints":[[28,24],[28,32]],"height":8,"width":24,"center":[28,28],"gridCenterOffset":[0,0],"currentFuel":0,"radius":4,"hitBox":[[16,24],[40,32]],"origOutline":[[16,24],[16,32],[40,32],[40,24]],"centerOfRot":[27.714285714285715,24.385714285714286],"attached":true,"renderHb":false,"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Engine","mass":0.3,"fuel":0,"efficiency":0.5,"thrust":0.2,"type":"Other","outline":[[16,32],[16,33],[16,33],[24,41],[20,47],[36,47],[32,41],[40,33],[40,32]],"attachmentPoints":[[40,32],[16,32],[28,32]],"flame":{"points":[[20,47],[36,47],[28,63]],"center":[28,47],"direction":[0,1],"length":16},"height":15,"width":24,"center":[26.666666666666668,37.666666666666664],"gridCenterOffset":[-0.6666666666666679,-0.6666666666666643],"currentFuel":0,"hitBox":[[16,32],[40,47]],"centerOfRot":[27.714285714285715,24.385714285714286],"origOutline":[[16,32],[16,33],[16,33],[24,41],[20,47],[36,47],[32,41],[40,33],[40,32]],"radius":7.5,"attached":true,"renderHb":false,"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Right Leg","mass":0.1,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[40,33],[40,31],[48,31],[48,55],[50,55],[50,57],[46,57],[46,55],[48,55],[48,33]],"attachmentPoints":[[40,32]],"height":26,"width":10,"center":[46.4,46.2],"gridCenterOffset":[-0.3999999999999986,-0.20000000000000284],"currentFuel":0,"hitBox":[[40,31],[50,57]],"centerOfRot":[27.714285714285715,24.385714285714286],"origOutline":[[40,33],[40,31],[48,31],[48,55],[50,55],[50,57],[46,57],[46,55],[48,55],[48,33]],"radius":5,"attached":true,"renderHb":false,"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0},{"stroke":"#00ff00","lineWidth":1,"currentThrust":0,"name":"Left Leg","mass":0.1,"fuel":0,"efficiency":0,"thrust":0,"type":"Other","outline":[[10,55],[8,55],[8,31],[16,31],[16,33],[8,33],[8,55],[6,55],[6,57],[10,57]],"attachmentPoints":[[16,32]],"height":26,"width":10,"center":[9.6,46.2],"gridCenterOffset":[-0.5999999999999996,-0.20000000000000284],"currentFuel":0,"hitBox":[[6,31],[16,57]],"centerOfRot":[27.714285714285715,24.385714285714286],"origOutline":[[10,55],[8,55],[8,31],[16,31],[16,33],[8,33],[8,55],[6,55],[6,57],[10,57]],"radius":5,"attached":true,"renderHb":false,"currentMass":0.1,"fuelDensity":0.01,"types":["Other","Fuel Tank","Engine"],"rotation":0}],"name":"Jerbal I","_spatialID":5,"_isDeadNow":false,"reset_cx":0,"reset_cy":-1000,"reset_rotation":0,"_scale":1,"_isWarping":false,"mass":5.2,"fuel":3000,"maxThrust":0.8,"height":57,"width":24,"xMassCenter":27.714285714285715,"yMassCenter":24.385714285714286,"center":[27.714285714285715,24.385714285714286],"origCenter":[27.714285714285715,24.385714285714286],"radius":57,"cx":0,"cy":-1000} ' ]

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
