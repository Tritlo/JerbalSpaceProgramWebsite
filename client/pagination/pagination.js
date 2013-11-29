Template.pagination.events({
    "click .previous": function(event){
	event.preventDefault();
	var page = parseInt(Session.get("currentPage"))-1;
	var id = Session.get("currentItem");
	Session.set("currentPage", page);
	if(!(Session.get("shouldNotPaginate"))){
		Router.go(Router.current().router.name,{page: page,_id:id});
	}
    },
    "click .next": function(event){
	event.preventDefault();
	var page = parseInt(Session.get("currentPage"))+1;
	var id = Session.get("currentItem");
	Session.set("currentPage", page);
	if(!(Session.get("shouldNotPaginate"))){
	    Router.go(Router.current().router.name,{page: page,_id:id});
	}
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

Template.pagination.destroyed = function(){
    Session.set("currentPage",1);

};
