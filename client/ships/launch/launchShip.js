Template.launchShip.rendered = function (){
	var id = Session.get('currentShip');
        var ship = Ships.findOne(id);

        if(ship){
	    shipLauncher = start("ShipLauncher",{
		instanceOptions: {ship: ship},
		canvasID: "shipLauncher",
		clear: true
	    });
	}
    
};
