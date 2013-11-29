Template.myShips.rendered = function (){
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
	if(id && Ships.findOne(id)){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadShip(Ships.findOne(id));
	}
};

Template.myShips.listData = {scope: function(){return {author:Meteor.user().username}}};

Template.myShips.events({
    "click .launch": function(evt){
	evt.preventDefault();
	var id = Session.get('currentItem');
	if(id){Router.go('launchShip',{_id:id});}
    },
    "click .edit": function(evt){
	evt.preventDefault();
	var id = Session.get('currentItem');
	console.log(id);
	if(id){Router.go('designShip',{_id:id});}
    },
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

Template.myShips.destroyed = function(){
    InstanceManager.clear();
};
