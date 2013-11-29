Template.part.events({
    "mouseenter" : function(event){
    	var id = this._id;
        var mainInstance = Session.get("mainInstance");
	setPart(id,mainInstance);
    },
    
    "mouseleave" : function(event){
	var id = Session.get("currentPart");
        var mainInstance = Session.get("mainInstance");
	setPart(id,mainInstance);
    },
    "click": function(event){
	var id = this._id;
	var page =Session.get('currentPage');
	event.preventDefault();
	Router.go(Router.current().route.name,{page: page,_id:id});
	}
});

Template.part.rendered = function(){
         var partId = this.data._id;
	 var partViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 100,
		    "height" : 100,
		    "location": [10,10]
		},
		force: true
	    },
	    canvasID : "part-"+partId,
	    clear: false
	    });

        setPart(partId,partViewer);
};

Template.part.isMine = function(){
    return this.authorID === Meteor.userId();
};

Template.part.destroyed = function(){
    var instID = "part-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
