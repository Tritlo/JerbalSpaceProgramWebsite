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


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(g_settings.keys.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
//var g_useGravity = false;
var g_useGravity = true;
var g_useAveVel = true;

var g_settings = {
          "useGravity": true,
		  "useAveVel": true,
		  "renderSpatialDebug":false,
          "enableDebug" : false,
		  "allowMixedActions": true,
		  "enableRocks": false,
		  "minLandingSpeed": 1.4,
		  "minFrictSpeed": 0.1,
		  "maxSafeSpeed" : 3,
		  "maxSafeAngle" 	: 1,
		  "hudSize": 1.5,
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
              "KEY_FIRE" : keyCode(' '),
              "KEY_TOGGLE_DEBUG": keyCode('B'),
              "KEY_QUIT" : keyCode('Q'),
              "KEY_PAUSE" :  keyCode('P'),
              "KEY_STEP" :  keyCode('O')
		      },
	  "seaLevel": 500
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
              "KEY_TOGGLE_BOX"      : keyCode('B'),
              "KEY_TOGGLE_UNDO_BOX" : keyCode('U'),
              "KEY_TOGGLE_FLIPFLOP" : keyCode('F'),
              "KEY_TOGGLE_RENDER"   : keyCode('R')

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

        if (eatKey(g_settings.debugKeys.KEY_1)) entityManager.generateShip({
            cx : g_mouseX,
            cy : g_mouseY,
            
            sprite : g_sprites.ship});

        if (eatKey(g_settings.debugKeys.KEY_2)) entityManager.generateShip({
            cx : g_mouseX,
            cy : g_mouseY,
            
            sprite : g_sprites.ship2
            });

        if (eatKey(g_settings.debugKeys.KEY_K)) entityManager.killNearestShip(
            g_mouseX, g_mouseY);
    }
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
	ctx.save();
	var s=entityManager.getMainShip();
	ctx.translate(-s.cx + g_canvas.width/2,-s.cy + g_canvas.height/2);
	/// hér þurfa allir hlutir háðir sýninni að vera
    	 entityManager.render(ctx);
	 if (g_renderSpatialDebug) spatialManager.render(ctx);
	ctx.restore();
	/// hér koma hlutir óháðir sýn
    	renderHUD(ctx);

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

// Kick it off
requestPreloads();
