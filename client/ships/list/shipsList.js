Template.shipsList.ships = function(){
    var page = parseInt(Session.get('currentPage'));
    var limit = parseInt(Session.get('paginationLimit'));
    return Ships.find(this.scope(),{skip: (page-1)*limit, limit: limit});
};


Template.shipsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalShips = Meteor.call("shipsCount", this.data.scope(), function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",2);
};
