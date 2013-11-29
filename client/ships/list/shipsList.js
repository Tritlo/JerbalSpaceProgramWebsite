// Template to view and browse through list of ships
Template.shipsList.ships = function(){
    var page = parseInt(Session.get('currentPage'));
    var limit = parseInt(Session.get('paginationLimit'));
	// select ships to display on current page
    return Ships.find(this.scope(),{skip: (page-1)*limit, limit: limit});
};


Template.shipsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalShips = Meteor.call("shipsCount", this.data.scope(), function(error,result){ Session.set("paginationTotal",result);} ); 
	// display at most 2 ships per page
    Session.set("paginationLimit",2);
};
