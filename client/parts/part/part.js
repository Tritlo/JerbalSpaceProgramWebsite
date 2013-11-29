Template.part.events({
    "mouseenter" : function(event){
    	var id = this._id;
        var mainInstance = Session.get("mainInstance");
        if(id){
            InstanceManager.getInstance(mainInstance).viewer.loadPart(Parts.findOne(id));
        }
    },
    
    "mouseleave" : function(event){
	var id = Session.get("currentPart");
        var mainInstance = Session.get("mainInstance");
        if(id && Parts.findOne(id)){
            InstanceManager.getInstance(mainInstance).viewer.loadPart(Parts.findOne(id));
        }
    },
    "click": function(event){
	var id = this._id;
	var page =Session.get('currentPage');
	event.preventDefault();
	Router.go('browseParts',{page: page,_id:id});
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

        console.log(partViewer);
	if(partId){
	    var inst = InstanceManager.getInstance(partViewer).viewer.loadPart(this.data);
	}
};

Template.part.destroyed = function(){
    var instID = "part-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
