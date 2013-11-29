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
        if(!(view.ID)){ view = InstanceManager.getInstance(options.canvasID);}
	if(view.stateManager.currentState !== "Viewer")
	   view.stateManager.switchState("viewer");
        view.start();
        return view.ID;
    },
    "PartDesigner": function(options,canvas) {
	options.enableQuit = false;
	//options.canvasID = canvas;
	var view = new Instance(options);
        if(!(view.ID)){ view = InstanceManager.getInstance(options.canvasID);}
	view.ctx.font = view.settings.font;
	if(view.stateManager.currentState !== "PartsDesigner")
	   view.stateManager.switchState("partsDesigner");
	view.start();
	return view.ID;
    },
    "ShipDesigner": function(options,canvas) {
        options.enableQuit = false;
        //options.canvasID = canvas;
        var view = new Instance(options);
        if(!(view.ID)){ view = InstanceManager.getInstance(options.canvasID);}
        view.ctx.font = view.settings.font;
	console.log(view.stateManager.currentState);
	if(view.stateManager.currentState !== "shipDesigner")
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
