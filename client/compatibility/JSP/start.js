starts = {
    "JSP":  function(options,canvas){
        var jsp = new Instance({canvas: canvas});
        jsp.ctx.font = jsp.settings.font;
        jsp.start();
        jsp.stateManager.switchState("menu");
        return jsp.ID;
    },
    "Viewer": function(options,canvas) {
	options.canvas = canvas;
	var view = new Instance(options);
	view.ctx.font = view.settings.font;
	view.stateManager.switchState("viewer");
	view.start();
	return view.ID;
    },
    "ShipLauncher": function(options,canvas){
	options.enableQuit = false;
	options.canvas = canvas;
	var  launch = new Instance(options);
	launch.ctx.font = launch.settings.font;
	launch.stateManager.switchState("simulation");
	launch.start();
	return launch.ID;


    }
};

function start(which,options){
    //Make sure last one is stopped:
    var canvasId = options.canvasID;
    var clear = options.clear;
    console.log(which,clear);
    $('body').on('contextmenu','#'+canvasId, function(e) {return false;});
    var canvas = document.getElementById(canvasId);
    
    if(clear) {InstanceManager.clear();}
    if(!options.instanceOptions) options.instanceOptions = {};
    var instanceID = starts[which](options.instanceOptions,canvas);
    if(!main.initialized){
	main.init();
    }
    return instanceID;
}
