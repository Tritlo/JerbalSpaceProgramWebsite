Template.browseShips.rendered = function (){
	var id = Session.get('currentShip');
	shipViewer = start("Viewer",{
	    instanceOptions: {
		grid: {
		    "dims" : [64,64],
		    "width" : 640,
		    "height" : 640,
		    "location": [10,10]
		    }
		},
	    canvasID: "shipViewer",
	    clear: true
	});
	if(id){
	    InstanceManager.getInstance(shipViewer).viewer.loadShip(Ships.findOne(id));
	    }
};

Template.browseShips.helpers({
    ships: function(){
	return Ships.find();
	}
    });

Template.browseShips.events({
    "click .browse": function(event){
	var id = event.toElement.name;
	InstanceManager.getInstance(shipViewer).viewer.loadShip(Ships.findOne(id));
	}
});

