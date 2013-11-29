Template.ship.events({
    "mouseenter" : function(event){
    	var id = this._id;
        var mainInstance = Session.get("mainInstance");
        if(id){
            InstanceManager.getInstance(mainInstance).viewer.loadShip(Ships.findOne(id));
        }
    },
    
    "mouseleave" : function(event){
	var id = Session.get("currentShip");
        var mainInstance = Session.get("mainInstance");
        if(id){
            InstanceManager.getInstance(mainInstance).viewer.loadShip(Ships.findOne(id));
        }
    },
    "click": function(event){
	var id = this._id;
	var page =Session.get('currentPage');
	event.preventDefault();
	Router.go('browseShips',{page: page,_id:id});
	}
});

Template.ship.rendered = function(){
         var shipId = this.data._id;
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

        console.log(shipViewer);
	if(shipId){
	    var inst = InstanceManager.getInstance(shipViewer).viewer.loadShip(this.data);
	}
};
Template.ship.destroyed = function(){
    var instID = "ship-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
