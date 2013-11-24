Template.game.created = function() {
    var gameFiles = [
	"game/01-csscolorparser.js" , "game/02-data.js" , "game/03-globals.js"
       , "game/04-consts.js" , "game/05-keys.js" , "game/06-settings.js"
       , "game/07-util.js" , "game/08-update.js" , "game/09-render.js"
       , "game/10-handleMouse.js" , "game/11-main.js" , "game/12-State.js"
       , "game/13-stateManager.js" , "game/14-spatialManager.js" , "game/15-Stars.js"
       , "game/16-Entity.js" , "game/17-entityManager.js" , "game/18-Terrain.js"
       , "game/19-Ship.js" , "game/20-HUD.js" , "game/21-Grid.js"
       , "game/22-Part.js" , "game/23-Menu.js" , "game/24-MainMenu.js"
       , "game/25-PartsDesigner.js" , "game/26-ShipDesigner.js" , "game/27-Viewer.js"
       , "game/28-Simulation.js" , "game/29-JerbalSpaceProgram.js" , "game/30-start.js"
	];
    gameFiles = gameFiles.map(function(s){
	return Meteor.absoluteUrl(s);
    });
   webUtil.clearScripts();
   webUtil.getScriptsInOrder(gameFiles,function() {start("JSP");});
};
