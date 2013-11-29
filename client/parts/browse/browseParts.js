//When we have renderd the whole template,
//we start the big part viewer, and display the current part on it.
Template.browseParts.rendered = function (){
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
        setPart(id,bigViewer);
};

//This is the data that the partslist get.
//The scope in browse parts is all available parts.
Template.browseParts.listData = {scope: function() {return {}},
				partEvents: defaultPartEvents};

//The only events here is the edit button, which opens the currentItem
//if any selected in the designer
Template.browseParts.events({
    "click .edit": function(evt){
	evt.preventDefault();
	var id = Session.get('currentItem');
	if(id){Router.go('designPart',{_id:id});}
    }
    
});

Template.browseParts.destroyed = function(){
    InstanceManager.clear();
};

