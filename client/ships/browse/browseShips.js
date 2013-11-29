Template.browseShips.rendered = function (){
    var id = Session.get('currentItem');
	// We create an instance of the game which is 
	// canvas to view ships on
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
		// The big canvas is the main instance of the game
		// on the screen at the time
        Session.set("mainInstance",bigViewer);
		// The ship displayed on the viewer is the current
		// selected ship
        setShip(id,bigViewer);
};

// scope defines what parts we wants to see 
// (i.e. only parts with current user as author)
// empty brackets means all parts
Template.browseShips.listData = {
    scope: function() {return {}}
};

Template.browseShips.events({
	// when launch button is clicked the player goes 
	// into gameplay mode with the selected ship
    "click .launch": function(evt){
	evt.preventDefault();
	var id = Session.get('currentItem');
	if(id){Router.go('launchShip',{_id:id});}
    },
	// when edit is clicked the player goes to the 
	// ship designer and can modify selected ship
    "click .edit": function(evt){
	evt.preventDefault();
	var id = Session.get('currentItem');
	if(id){Router.go('designShip',{_id:id});}
    }
    
});

Template.browseShips.destroyed = function(){
    InstanceManager.clear();
};

