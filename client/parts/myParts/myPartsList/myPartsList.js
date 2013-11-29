Template.partsList.helpers({
		parts: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('paginationLimit'));
        return Parts.find({ author:Meteor.user().username },{skip: (page-1)*limit, limit: limit});
	}
});


Template.partsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("partsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",3);
    Session.set("paginationOf","myParts");
    Session.set("paginationItem","part");
}
