starts = {
    "JSP":  function(options,canvas){
        var jsp = new Instance({canvas: canvas});
        jsp.ctx.font = jsp.settings.font;
        jsp.init();
        jsp.start();
        jsp.stateManager.switchState("menu");
        return jsp.id;
    },
    "Viewer": function(options,canvas) {
	options.canvas = canvas;
	var view = new Instance(options);
	view.ctx.font = view.settings.font;
	view.init();
	viewer = view.viewer;
	view.stateManager.switchState("viewer");
	view.start();
	return view.id;
    }
};

function start(which,options,canvasId){
    //Make sure last one is stopped:
    if(!canvasId){
        var canvasId = "myCanvas";
    }
    $('body').on('contextmenu','#'+canvasId, function(e) {return false;});
    var canvas = document.getElementById(canvasId);
    InstanceManager.clear();
    var instanceID = starts[which](options,canvas);
    if(!main.initialized){
	main.init();
    }
    return instanceID;
}
