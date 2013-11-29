Template.browseShips.rendered = function (){
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
        setShip(id,bigViewer);
};

Template.browseShips.events({
    "click .launch": function(evt){
	evt.preventDefault();
	var id = Session.get('currentShip');
	if(id){Router.go('launchShip',{_id:id});}
    },
    "click .edit": function(evt){
	evt.preventDefault();
	var id = Session.get('currentShip');
	if(id){Router.go('designShip',{_id:id});}
    }
    
});

Template.browseShips.destroyed = function(){
    InstanceManager.clear();
};

