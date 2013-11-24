starts = {
    "JSP":  function(options,canvas){
	var jsp = new Instance({canvas: canvas});
	jsp.ctx.font = jsp.settings.font;
	jsp.init();
	jsp.start();
    },
    "Viewer": function(options,canvas) {
	if(options){
	    viewer = new Viewer(options);
	    stateManager.addState("viewer",viewer);
	}
	view.ctx.font = view.settings.font;
	view.init();
	viewer = view.viewer;
	view.start();
    }
};

function start(which,options,canvasId){
    //Make sure last one is stopped:
    main.gameOver();
    if(!canvasId){
	var canvasId = "myCanvas";
    }
    $('body').on('contextmenu','#'+canvasId, function(e) {return false;});
    var canvas = document.getElementById(canvasId);
    starts[which](options,canvas);
    if(!main.initialized) main.init();
    else {
        main.initialized = true;
        main.init();
    }
}
