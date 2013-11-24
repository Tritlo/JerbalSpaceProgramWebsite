Template.parts.created = function (){
    var partFiles = [
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
    partFiles = partFiles.map(function(s){
	return Meteor.absoluteUrl(s);
    });
    var id = Session.get('currentPart');
    webUtil.clearScripts();
    webUtil.getScriptsInOrder(partFiles, function() {
	start("Viewer",{
	    grid: {
		"dims" : [32,32],
		"width" : 290,
		"height" : 290,
		"location": [10,10]
		}
	}, "viewerCanvas");
	if(id){viewer.loadPart(Parts.findOne(id));}
    });
};

Template.parts.helpers({
    parts: function(){
	return Parts.find();
	}
    });

Template.parts.events({
    "click a": function(event){
	var id = event.toElement.name;
	viewer.loadPart(Parts.findOne(id));
	}
});

