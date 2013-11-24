Template.parts.rendered = function (){
    var id = Session.get('currentPart');
	start("Viewer",{
	    grid: {
		"dims" : [32,32],
		"width" : 290,
		"height" : 290,
		"location": [10,10]
		}
	});
	if(id){viewer.loadPart(Parts.findOne(id));}
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

