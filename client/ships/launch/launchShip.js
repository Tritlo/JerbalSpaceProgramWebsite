// 'launch' link transports player to game mode
// with the currently selected ship
Template.launchShip.rendered = function (){
	// check if currently selected item is a ship
	var id = Session.get('currentItem');
	var ship = Ships.findOne(id);

	if(ship){
	// start new instance of game in gameplay mode
	shipLauncher = start("ShipLauncher",{
		instanceOptions: {ship: ship, multi: true},
		canvasID: "shipLauncher",
		clear: true
	});
	}
    
};
