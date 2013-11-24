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
		"viewer" : viewer
			});
	stateManager.switchState("viewer");
	main.init();
    }
};

function start(which,options,canvasId){
    if(canvasId){
        g_canvas = document.getElementById(canvasId);
    } else {
        g_canvas = document.getElementById("myCanvas");
    }
    g_ctx = g_canvas.getContext("2d");
    g_ctx.font = "VT323";
    g_ctx.setTransform(1, 0, 0, 1, 0, 0);
    $('body').on('contextmenu','#myCanvas', function(e) {return false;});
    starts[which](options);
}

