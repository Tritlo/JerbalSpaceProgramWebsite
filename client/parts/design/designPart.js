//Here we only start the partsdesigner.
//The share button is available when it's not local.
//
Template.designPart.rendered = function(){
	partsDesigner = start("PartDesigner",{
	    canvasID : "PartDesigner",
	    clear: true
	    });
        var id = Session.get('currentItem');
        Session.set("mainInstance",partsDesigner);
        //Load the current part if it is defined
        if(id && Parts.findOne(id)){
           InstanceManager.getInstance(partsDesigner).partsDesigner.loadPart(Parts.findOne(id));
        }
};


//Remove all instances of the game when we leave
Template.designPart.destroyed = function(){
    InstanceManager.clear();
};
