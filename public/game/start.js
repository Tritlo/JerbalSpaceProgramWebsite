starts = {
    "JSP":  function(){
	g_ctx.font = g_settings.font;
	stateManager.setStates({
		"menu" : mainMenu,
		"simulation" : simulation,
		"partsDesigner" : partsDesigner,
		"shipDesigner" : shipDesigner
			});
	stateManager.switchState("menu");
	main.init();
    },
    "Viewer": function(options) {
	if(options){
	    viewer = new Viewer(options);
	}
	stateManager.setStates({
		"viewer" : Viewer
			});
	stateManager.switchState("viewer");
	main.init();
    }
};

function start(which,options){
    g_ctx.font = "VT323";
    $('body').on('contextmenu','#myCanvas', function(e) {return false;});
    starts[which](options);
}

