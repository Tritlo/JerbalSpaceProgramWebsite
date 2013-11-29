Template.myShipsList.helpers({
    myShips: function(){
        var page = parseInt(Session.get('currentPage'));
        var limit = parseInt(Session.get('paginationLimit'));
        return Ships.find({author:Meteor.user().username},{skip: (page-1)*limit, limit: limit});
	}
});


Template.myShipsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalShips = Meteor.call("myShipsCount", function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",2);
    Session.set("paginationItem","Ship");
    Session.set("paginationOf","myShips");
}
