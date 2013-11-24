Template.ships.created = function (){
    var shipFiles = [
	 "game/globals.js"
	,"game/main.js"
	,"game/update.js"
	,"game/render.js"
	,"game/util.js"
	,"game/start.js"
	,"game/keys.js"
	,"game/settings.js"
	,"game/Grid.js"
	,"game/Part.js"
	,"game/State.js"
	,"game/Viewer.js"
	,"game/stateManager.js"
	];
    shipFiles = shipFiles.map(function(s){
	return Meteor.absoluteUrl(s);
    });
    
    var id = Session.get('currentShip');
    webUtil.getScriptsInOrder(shipFiles, function() {
	start("Viewer",{


	});
	if(id){viewer.loadShip(Ships.findOne(id));}
    });
};

Template.ships.helpers({
    parts: function(){
	return Ships.find();
	}
    });

Template.ships.events({
    "click a": function(event){
	var id = event.toElement.name;
	viewer.loadShip(Ships.findOne(id));
	}
});

