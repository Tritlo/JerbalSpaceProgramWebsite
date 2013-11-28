Template.shipsList.helpers({
    ships: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('paginationLimit'));
        return Ships.find({},{skip: (page-1)*limit, limit: limit});
	}
});


Template.partsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("shipsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",3);
    Session.set("paginationOf","Ship");
}
