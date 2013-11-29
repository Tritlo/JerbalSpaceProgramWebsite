Template.myShips.rendered = function (){
        var id = Session.get('currentShip');
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
	if(id && Ships.findOne(id)){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadShip(Ships.findOne(id));
	}
};

Template.myShips.events({
    "click .launch a": function(evt){
	evt.preventDefault();
	var id = Session.get('currentShip');
	if(id){Router.go('launchShip',{_id:id});}
    },
    "click .edit a": function(evt){
	evt.preventDefault();
	var id = Session.get('currentShip');
	console.log(id);
	if(id){Router.go('designShip',{_id:id});}
    },
    "click .delete": function(evt){
	evt.preventDefault();
	var id = Session.get('currentShip');
	InstanceManager.getInstance(bigViewer).viewer.clear();
	console.log("removing: " + id);
	Ships.remove(id);
    }
    
});

Template.myShips.destroyed = function(){
    InstanceManager.clear();
};

