Template.launchShip.rendered = function (){
	var id = Session.get('currentItem');
        var ship = Ships.findOne(id);

        if(ship){
	    shipLauncher = start("ShipLauncher",{
            instanceOptions: {ship: ship, multi: true},
            canvasID: "shipLauncher",
            clear: true
	    });
	}
    
};
