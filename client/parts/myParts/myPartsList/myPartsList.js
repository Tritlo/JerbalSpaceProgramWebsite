Template.myPartsList.helpers({
		myParts: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('paginationLimit'));
        return Parts.find({ author:Meteor.user() },{skip: (page-1)*limit, limit: limit});
	}
});


Template.myPartsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("myPartsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",3);
    Session.set("paginationOf","Part");
}
