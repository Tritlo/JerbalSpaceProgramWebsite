Template.partsList.parts = function(){
    var page = parseInt(Session.get('currentPage'));
    var limit = parseInt(Session.get('paginationLimit'));
    var parts = Parts.find(this.scope(),{skip: (page-1)*limit, limit: limit, fields: {_id: 1, name :1, author: 1, authorID: 1}}).fetch();
    var partEvents = this.partEvents;
    parts = parts.map(function(p) {
	p.events = partEvents;
	return p;
    });
    return parts;
};


Template.partsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("partsCount",this.data.scope(), function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",3);
};
