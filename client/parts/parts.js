Template.parts.created = function (){
    var partFiles = [
	 "game/globals.js"
	,"game/Grid.js"
	,"game/Part.js"
	,"game/State.js"
	,"game/init.js"
	,"game/main.js"
	,"game/update.js"
	,"game/render.js"
	,"game/PartViewer.js"
	, "game/util.js"
	];
		    
    webUtil.getScriptsInOrder(partFiles);
    main.init();
};

