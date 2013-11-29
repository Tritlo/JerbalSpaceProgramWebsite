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
        Session.set("shoulNotPaginate",true);
        var id = Session.get('currentItem');
        var currID = InstanceManager.getInstance(shipDesigner).shipDesigner.currentShip._id;
	if(id && Ships.findOne(id) && id !== currID){
	   InstanceManager.getInstance(shipDesigner).shipDesigner.loadShip(Ships.findOne(id));
	}
};

Template.designShip.listData = {
    scope:function() {return {}},
    partEvents: {
	"click": function(event,part){
	    var id = part._id;
	    event.preventDefault();
	    var mainInst = Session.get("mainInstance");
	    InstanceManager.getInstance(mainInst).shipDesigner.addPart(Parts.findOne(id));
	}
    }
};
				     

Template.designShip.destroyed = function(){
    InstanceManager.clear();
    Session.set("shoulNotPaginate",false);
    Session.set("currentPage",1);
};
