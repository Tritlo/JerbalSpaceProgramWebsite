Template.parts.created = function (){
    var partFiles = [
	 "game/globals.js"
	,"game/main.js"
	,"game/update.js"
	,"game/render.js"
	,"game/util.js"
	,"game/start.js"
	,"game/keys.js"
	,"game/settings.js"
	,"game/Grid.js"
	,"game/Part.js"
	,"game/State.js"
	,"game/Viewer.js"
	,"game/stateManager.js"
	];
		    
    webUtil.getScriptsInOrder(partFiles, function() {
	start("Viewer");
    });
};

