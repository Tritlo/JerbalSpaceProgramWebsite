Template.myPart.events({
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
	Router.go('myParts',{page: page,_id:id});
	}
});

Template.myPart.rendered = function(){
         var myPartId = this.data._id;
	 var myPartViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 100,
		    "height" : 100,
		    "location": [10,10]
		},
		force: true
	    },
	    canvasID : "myPart-"+myPartId,
	    clear: false
	    });

        console.log(myPartViewer);
	if(myPartId){
	    var inst = InstanceManager.getInstance(myPartViewer).viewer.loadPart(this.data);
	}
};

Template.myPart.destroyed = function(){
    var instID = "myPart-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
