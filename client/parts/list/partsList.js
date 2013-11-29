//The partsList takes in a scope and an event dict.
//the scope is used to find the parts the user wants to display
//and the event dict determines what happens on the part
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

//Find the total parts to set the pageinationTotal, which allows
//for removing the next button when we are all out of parts
//we set the number of parts to display to 3;
Template.partsList.created = function(){
    var page = parseInt(Session.get('currentPage'));
    var totalParts = Meteor.call("partsCount",this.data.scope(), function(error,result){ Session.set("paginationTotal",result);} );
    Session.set("paginationLimit",3);
};
