Template.game.created = function() {
    var gameFiles = [
	    "game/data.js","game/csscolorparser.js" , "game/globals.js" , "game/consts.js"
	  , "game/util.js" , "game/keys.js" , "game/spatialManager.js"
	  , "game/Stars.js" , "game/entityManager.js" 
	  , "game/Entity.js" , "game/Terrain.js" , "game/Ship.js" 
	  , "game/update.js" , "game/render.js" , "game/HUD.js"
	  , "game/main.js" , "game/State.js", "game/settings.js"
	  , "game/Grid.js" , "game/Part.js" , "game/Menu.js", "game/MainMenu.js"
	  , "game/PartsDesigner.js" , "game/ShipDesigner.js" , "game/Simulation.js"
	  , "game/Viewer.js" , "game/stateManager.js" , "game/handleMouse.js"
	  ,"game/JerbalSpaceProgram.js", "game/start.js"
	];
    gameFiles = gameFiles.map(function(s){
	return Meteor.absoluteUrl(s);
    });
   webUtil.getScriptsInOrder(gameFiles,function() {start("JSP");});
};
