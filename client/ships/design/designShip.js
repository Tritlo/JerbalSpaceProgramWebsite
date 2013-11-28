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
	    clear: true
	    });
        Session.set("mainInstance",shipDesigner);
        var id = Session.get('currentShip');
         console.log(Session);
        console.log(id);
	if(id && Ships.findOne(id)){
	   InstanceManager.getInstance(shipDesigner).shipDesigner.loadShip(Ships.findOne(id));
	}
};
