Template.ships.rendered = function (){
    var id = Session.get('currentShip');
	start("Viewer",{
	    grid: {
		"dims" : [64,64],
		"width" : 640,
		"height" : 640,
		"location": [10,10]
		}
	});
	if(id){viewer.loadShip(Ships.findOne(id));}
};

Template.ships.helpers({
    ships: function(){
	return Ships.find();
	}
    });

Template.ships.events({
    "click a": function(event){
	var id = event.toElement.name;
	viewer.loadShip(Ships.findOne(id));
	}
});

