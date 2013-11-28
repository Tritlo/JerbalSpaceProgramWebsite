Template.browseParts.created = function() {
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("partsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",3);
    Session.set("paginationOf","Part");
    /*
    Deps.autorun(function() {
	var page = parseInt(Session.get('currentPage'));
	if(page >= 1){
	   Meteor.subscribe('parts', (page-1)*3, 3);
	}
    });
     */
};


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

        console.log(id);
	if(id){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
	}
};

Template.browseParts.destroyed = function(){
    InstanceManager.clear();
};

Template.browseParts.helpers({
    parts: function(){
	var page = parseInt(Session.get('currentPage'));
	var limit = parseInt(Session.get('paginationLimit'));
	return Parts.find({},{skip: (page-1)*limit, limit: limit});
	}
    });



Template.part.events({
    "mouseenter" : function(event){
	var id = this._id;
	if(id){
	    InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
	}
    },
    
    "mouseleave" : function(event){
	var id = Session.get("currentPart");
	if(id){
	    InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
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
		}
	    },
	    canvasID : "part-"+partId,
	    clear: false
	    });

        console.log(partViewer);
	if(partId){
	    var inst = InstanceManager.getInstance(partViewer).viewer.loadPart(this.data);
	}
};
