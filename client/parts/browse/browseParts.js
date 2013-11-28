Template.browseParts.rendered = function (){
        var id = Session.get('currentPart');
	bigViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 490,
		    "height" : 490,
		    "location": [10,10]
		}
	    },
	    canvasID : "bigViewer",
	    clear: false
	    });
        Session.set("mainInstance",bigViewer);
	if(id && Parts.findOne(id)){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
	}
};

Template.browseParts.destroyed = function(){
    InstanceManager.clear();
};

