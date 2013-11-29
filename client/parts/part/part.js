Template.part.events({
    "mouseenter" : function(event){
	var f = this.events["mouseenter"];
	if(f) {f(event,this);}
    },
    
    "mouseleave" : function(event){
	var f = this.events["mouseleave"];
	if(f) {f(event,this);}
    },
    "click": function(event){
	var f = this.events["click"];
	if(f) {f(event,this);}
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
