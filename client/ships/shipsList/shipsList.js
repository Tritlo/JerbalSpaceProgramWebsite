Template.shipsList.helpers({
    ships: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('paginationLimit'));
        return Ships.find({},{skip: (page-1)*limit, limit: limit});
	}
});


Template.shipsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalShips = Meteor.call("shipsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",2);
    Session.set("paginationItem","Ship");
    Session.set("paginationOf","browseShips");
}
