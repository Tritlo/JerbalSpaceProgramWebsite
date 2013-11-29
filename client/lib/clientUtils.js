setShip = function(id,instance){
    if(id){
	var ship = Ships.findOne(id);
	if(ship){
	    $("#info").html(ship.name + " by " + ship.author);
	    InstanceManager.getInstance(instance).viewer.loadShip(ship);
	}
    }
};

setPart = function(id,instance){
    if(id){
	var part = Parts.findOne(id);
	if(part){
	    $("#info").html(part.name + " by " + part.author);
	    InstanceManager.getInstance(instance).viewer.loadPart(part);
	}
    }
};
