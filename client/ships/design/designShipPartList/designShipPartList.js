Template.designShipPartList.helpers({
    parts: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('paginationLimit'));
        return Parts.find({},{skip: (page-1)*limit, limit: limit});
	}
});


Template.designShipPartList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("partsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",4);
    Session.set("paginationOf","Part");
}
