/* 
// Fae thetta ekki til ad virka..
    (function($){
        $(window).load(function(){
            $("#partsList").mCustomScrollbar();
        });
    })(jQuery);
*/
Template.browseParts.rendered = function (){
        var id = Session.get('currentPart');
	smallViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 290,
		    "height" : 290,
		    "location": [10,10]
		}
	    },
	    canvasID : "viewerRight",
	    clear: true
	    });
	bigViewer = start("Viewer",{
	    instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 290,
		    "height" : 290,
		    "location": [10,10]
		}
	    },
	    canvasID : "viewerLeft",
	    clear: false
	    });
	      
	if(id){
	    var inst = InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
	}

};

Template.browseParts.helpers({
    parts: function(){
	return Parts.find();
	}
    });

Template.browseParts.events({
    "click .browse": function(event){
	var id = event.target.name;
	Router.go('browseParts',{_id:id});
	InstanceManager.getInstance(bigViewer).viewer.loadPart(Parts.findOne(id));
	},
    "mouseenter .browse": function(event){
	var id = event.target.name;
	//Router.go('browseParts',{_id:id});
	InstanceManager.getInstance(smallViewer).viewer.loadPart(Parts.findOne(id));
	}
});



