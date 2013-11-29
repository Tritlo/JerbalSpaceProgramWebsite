// current user can browse through the ships they
// have designed.
Template.myShips.rendered = function (){
    var id = Session.get('currentItem'); 
	// start instance of game which is a canvas to 
	// display ships
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
	// Viewer displays currently selected ship
	if(id && Ships.findOne(id)){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadShip(Ships.findOne(id));
	}
};

// scope defines which ships to display -  we only want ships with
// current user as author
Template.myShips.listData = {scope: function(){return {author:Meteor.user().username}}};

Template.myShips.events({
	// user can click 'launch' to go into gameplay mode with 
	// currently selected ship
    "click .launch": function(evt){
		evt.preventDefault();
		var id = Session.get('currentItem');
		if(id){Router.go('launchShip',{_id:id});}
    },
	// user can click 'edit' to go into designer mode to alter 
	// currently selected ship
    "click .edit": function(evt){
		evt.preventDefault();
		var id = Session.get('currentItem');
		console.log(id);
		if(id){Router.go('designShip',{_id:id});}
    },
	// user can delete ship, ships is then removed from database
    "click .delete": function(evt){
		evt.preventDefault();
		var id = Session.get('currentItem');
		var inst = Session.get("mainInstance");
		clearItem(inst);
		console.log("removing: " + id);
		Session.set('currentItem', undefined);
		$("#info").val("Nothing selected");
		Ships.remove(id);
    }
    
});

// delete viewer game-instance
Template.myShips.destroyed = function(){
    InstanceManager.clear();
};

