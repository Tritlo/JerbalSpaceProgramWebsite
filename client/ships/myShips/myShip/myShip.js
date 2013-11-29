Template.myShip.events({
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
	Router.go('myShips',{page: page,_id:id});
	}
});

Template.myShip.rendered = function(){
         var myShipId = this.data._id;
	 var myShipViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 180,
		    "height" : 180,
		    "location": [10,10]
		},
		force: true
	    },
	    canvasID : "myShip-"+myShipId,
	    clear: false
	    });

	if(myShipId){
	    var inst = InstanceManager.getInstance(myShipViewer).viewer.loadShip(this.data);
	}
};

Template.myShip.destroyed = function(){
    var instID = "myShip-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
