Template.designShipPartListPart.events({
    "click": function(event){
	//var id = this._id;
	//var page =Session.get('currentPage');
	event.preventDefault();
	var mainInst = Session.get("mainInstance");
	InstanceManager.getInstance(mainInst).shipDesigner.addPart(Parts.findOne(this._id));
	}
});

Template.designShipPartListPart.rendered = function(){
         var partId = this.data._id;
	 var partViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 100,
		    "height" : 100,
		    "location": [10,10]
		}
	    },
	    canvasID : "part-"+partId,
	    clear: false
	    });
        
	var inst = InstanceManager.getInstance(partViewer).viewer.loadPart(this.data);
};

Template.designShipPartListPart.destroyed = function(){
    var instID = "part-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
