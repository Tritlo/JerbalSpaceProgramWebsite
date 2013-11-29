Template.designShip.rendered = function(){
	shipDesigner = start("ShipDesigner",{
	    /*instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 490,
		    "height" : 490,
		    "location": [10,10]
		}
	    },*/
	    canvasID : "ShipDesigner",
	    clear: false
	    });
        Session.set("mainInstance",shipDesigner);
        var id = Session.get('currentShip');
	if(id && Ships.findOne(id)){
	   InstanceManager.getInstance(shipDesigner).shipDesigner.loadShip(Ships.findOne(id));
	}
};

Template.designShip.destroyed = function(){
    InstanceManager.clear();
};
