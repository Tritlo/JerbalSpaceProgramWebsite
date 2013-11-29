Template.myPartsList.helpers({
		myParts: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('myPaginationLimit'));
        return Parts.find({ author:Meteor.user().username },{skip: (page-1)*limit, limit: limit});
	}
});


Template.myPartsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("myPartsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("myPaginationLimit",3);
    Session.set("myPaginationOf","myPart");
}
