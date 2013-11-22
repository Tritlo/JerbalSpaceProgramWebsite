Template.game.created = function() {
    var gameFiles = [
	    "game/csscolorparser.js" , "game/globals.js" , "game/consts.js"
	  , "game/util.js" , "game/keys.js" , "game/spatialManager.js"
	  , "game/Stars.js" , "game/entityManager.js" , "game/Sprite.js"
	  , "game/Entity.js" , "game/Terrain.js" , "game/Ship.js" 
	  , "game/update.js" , "game/render.js" , "game/HUD.js"
	  , "game/imagesPreload.js" , "game/main.js" , "game/State.js"
	  , "game/Grid.js" , "game/Part.js" , "game/Menu.js"
	  , "game/PartsDesigner.js" , "game/ShipDesigner.js" , "game/Simulation.js"
	  , "game/stateManager.js" , "game/handleMouse.js" , "game/JerbalSpaceProgram.js"
	];
   webUtil.getScriptsInOrder(gameFiles);
};
