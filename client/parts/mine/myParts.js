//Display the part on the big screen
Template.myParts.rendered = function (){
        var id = Session.get('currentItem');
	bigViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 490,
		    "height" : 490,
		    "location": [10,10]
		}
	    },
	    canvasID : "bigViewer",
	    clear: false
	    });
        Session.set("mainInstance",bigViewer);
	if(id && Parts.findOne(id)){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
	}
};

//Only real difference from browseParts is this guy,
//which sets the scope as only the parts having the current user as the author
//This page isn't displayed when the user is not logged in
Template.myParts.listData = {
    scope: function() { return { author:Meteor.user().username}},
    partEvents: defaultPartEvents
};


//Here we enable editing as in browse parts, but we 
//also allow the user to delete the parts, as they are his own
Template.myParts.events({
    "click .edit": function(evt){
	var id = Session.get('currentItem');
	console.log(id);
	evt.preventDefault();
	if(id){Router.go('designPart',{_id:id});}
    },
    "click .delete": function(evt){
	evt.preventDefault();

	var id = Session.get('currentItem');
    clearItem(bigViewer);
	console.log("removing part: " + id);
	Session.set('currentItem', undefined);
	Parts.remove(id);
    }
});

Template.myParts.destroyed = function(){
    InstanceManager.clear();
};

