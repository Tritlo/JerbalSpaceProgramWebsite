//The events here simply call the events dictionary defined for the
//part. This allows dynamic definition of the events.
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

//Display the part on a small canvas, with the id of the part.
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

//says whether the part is the users or not,
//allowing us to not display "by author" on the part 
//if it is the users.
Template.part.isMine = function(){
    return this.authorID === Meteor.userId();
};

//Remove the running instance the part was running on
//when the template is destroyed, to avoid filling the
//memory
Template.part.destroyed = function(){
    var instID = "part-" + this.data._id;
    InstanceManager.removeInstance(instID);
};
