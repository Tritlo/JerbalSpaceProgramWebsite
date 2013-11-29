Template.browseParts.rendered = function (){
        var id = Session.get('currentPart');
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
        setPart(id,bigViewer);
};

Template.browseParts.events({
    "click .edit": function(evt){
	evt.preventDefault();
	var id = Session.get('currentPart');
	if(id){Router.go('designPart',{_id:id});}
    }
    
});

Template.browseParts.destroyed = function(){
    InstanceManager.clear();
};

