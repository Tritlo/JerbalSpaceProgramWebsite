Template.browseShips.rendered = function (){
        var id = Session.get('currentShip');
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
	if(id){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadShip(Ships.findOne(id));
	}
};

Template.browseShips.destroyed = function(){
    InstanceManager.clear();
};

