



setShip = function(id,instance){
    id = id || Session.get("currentItem");
    instance = instance || Session.get("mainInstance");
    var ship = Ships.findOne(id);
    if(id && ship){
        $("#info").html(ship.name + " by " + ship.author);
        InstanceManager.getInstance(instance).viewer.loadShip(ship);
    } else {
        clearItem(instance);
    }
};

setPart = function(id,instance){
    id = id || Session.get("currentItem");
    instance = instance || Session.get("mainInstance");
	var part = Parts.findOne(id);
    if(id && part){
        $("#info").html(part.name + " by " + part.author);
        InstanceManager.getInstance(instance).viewer.loadPart(part);
    } else {
        clearItem(instance);
    }
};

clearItem = function(instance){
    InstanceManager.getInstance(instance).viewer.clear();
    $("#info").html("Nothing selected");
};

defaultPartEvents = {
	"mouseenter" : function(event, part){
	    var id = part._id;
	    setPart(id);
	},

	"mouseleave" : function(event,part){
	    var id = Session.get("currentItem");
	    setPart(id);
	},
	"click": function(event,part){
	    var id = part._id;
	    var page =Session.get('currentPage');
	    event.preventDefault();
	    Router.go(Router.current().route.name,{page: page,_id:id});
	}
    };

