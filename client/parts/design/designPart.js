Template.designPart.rendered = function(){
        var id = Session.get('currentPart');
	partsDesigner = start("PartDesigner",{
	    /*instanceOptions : {
		grid: {
		    "dims" : [32,32],
		    "width" : 490,
		    "height" : 490,
		    "location": [10,10]
		}
	    },*/
	    canvasID : "PartDesigner",
	    clear: true
	    });
        Session.set("mainInstance",partsDesigner);


};
