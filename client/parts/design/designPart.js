Template.designPart.rendered = function(){
	partsDesigner = start("PartDesigner",{
	    /*instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 490,
		    "height" : 490,
		    "location": [10,10]
		}
	    },*/
	    canvasID : "PartDesigner",
	    clear: true
	    });
        var id = Session.get('currentPart');
        Session.set("mainInstance",partsDesigner);
	if(id && Parts.findOne(id)){
	   InstanceManager.getInstance(partsDesigner).partsDesigner.loadPart(Parts.findOne(id));
	}
};

Template.designPart.destroyed = function(){
    InstanceManager.clear();
};
