Template.designShip.rendered = function(){
	// creates an instance of the game which is in ship
	// designer mode
	shipDesigner = start("ShipDesigner",{
	    canvasID : "ShipDesigner",
	    clear: false
	    });
        Session.set("mainInstance",shipDesigner);
        Session.set("shouldNotPaginate",true);
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
    Session.set("shouldNotPaginate",false);
    Session.set("currentPage",1);
};
