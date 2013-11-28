Template.pagination.events({
    "click .previous": function(event){
	event.preventDefault();
	var page = parseInt(Session.get("currentPage"))-1;
	var paginationOf = Session.get("paginationOf");
	var id = Session.get("current"+paginationOf);
	Session.set("currentPage", page);
	Router.go('browse'+paginationOf+"s",{page: page,_id:id});
    },
    "click .next": function(event){
	event.preventDefault();
	var page = parseInt(Session.get("currentPage"))+1;
	var paginationOf = Session.get("paginationOf");
	var id = Session.get("current"+paginationOf);
	Session.set("currentPage", page);
	Router.go('browse'+paginationOf+"s",{page: page,_id:id});
    }
});


Template.pagination.notFirstPage = function(){
	return parseInt(Session.get("currentPage")) > 1;
};
	
Template.pagination.notLastPage = function(){
        var page =  parseInt(Session.get("currentPage"));
        var limit = parseInt(Session.get("paginationLimit"));
        var count = parseInt(Session.get("paginationTotal"));
        return (page)*limit < count;
};
