starts = {
    "JSP":  function(){
	g_ctx.font = g_settings.font;
    stateManager.init();
	stateManager.switchState("menu");
    },
    "Viewer": function(options) {
	if(options){
	    viewer = new Viewer(options);
	    stateManager.addState("viewer",viewer);
	}
    stateManager.init();
	stateManager.switchState("viewer");
    }
};

function start(which,options,canvasId){
    //Make sure last one is stopped:
    main.gameOver();
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
    if(!main.initialized) main.init();
    else {
        main.initialized;
        main.init()
    }
}
