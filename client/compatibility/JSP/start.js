starts = {
    "JSP":  function(options,canvas){
        var jsp = new Instance(options);
        jsp.ctx.font = jsp.settings.font;
        jsp.start();
        jsp.stateManager.switchState("menu");
        return jsp.ID;
    },
    "Viewer": function(options,canvas) {
	//options.canvasID = canvas;
	var view = new Instance(options);
	view.ctx.font = view.settings.font;
	view.stateManager.switchState("viewer");
	view.start();
	return view.ID;
    },
    "PartsDesigner": function(options,canvas) {
	options.enableQuit = false;
	//options.canvasID = canvas;
	var view = new Instance(options);
	view.ctx.font = view.settings.font;
	view.stateManager.switchState("partsDesigner");
	view.start();
	return view.ID;
    },
    "ShipDesigner": function(options,canvas) {
	options.enableQuit = false;
	//options.canvasID = canvas;
	var view = new Instance(options);
	view.ctx.font = view.settings.font;
	view.stateManager.switchState("shipDesigner");
	view.start();
	return view.ID;
    },
    "ShipLauncher": function(options,canvas){
	options.enableQuit = false;
	//options.canvas = canvas;
	var  launch = new Instance(options);
	launch.ctx.font = launch.settings.font;
	launch.stateManager.switchState("simulation");
	launch.start();
	return launch.ID;
    }
};

function start(which,options){
    $('body').on('contextmenu','#'+ options.canvasID, function(e) {return false;});
    //Make sure last one is stopped:
    if(options.clear) {InstanceManager.clear();}
    if(!options.instanceOptions) options.instanceOptions = {};
    options.instanceOptions.canvasID = options.canvasID;
    var instanceID = starts[which](options.instanceOptions);
    if(!main.initialized){
	main.init();
    }
    return instanceID;
}
