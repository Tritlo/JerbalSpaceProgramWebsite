// A template to view images of ships and select
// them with the mouse
Template.ship.events({
    "mouseenter" : function(event){
        var id = this._id;
        setShip(id);
    },
    
    "mouseleave" : function(event){
        var id = Session.get("currentItem");
        setShip(id);
    },
    "click": function(event){
		var id = this._id;
		var page =Session.get('currentPage');
		event.preventDefault();
		Router.go(Router.current().route.name,{page: page,_id:id});
	}
});

Template.ship.rendered = function(){
	var shipId = this.data._id;
	// We start an intance of the game which is 
	// a canvas to view the ship on
	 var shipViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 180,
		    "height" : 180,
		    "location": [10,10]
		},
		force: true
	    },
	    canvasID : "ship-"+shipId,
	    clear: false
	    });

        setShip(shipId,shipViewer);
};

// checks if ship's author is current user
Template.ship.isMine = function(){
    return this.authorID === Meteor.userId();
};

Template.ship.destroyed = function(){
    var instID = "ship-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
