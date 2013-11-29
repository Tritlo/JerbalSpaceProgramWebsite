//This is where the pagination magic happens

Template.pagination.events({
    "click .previous": function(event){
	event.preventDefault();
    //Go to the previous page. Always more than zero,
    //as we don't display the button otherwise
	var page = parseInt(Session.get("currentPage"))-1;
	var id = Session.get("currentItem");
	Session.set("currentPage", page);

    //We don't want to reload the page in the designer
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


//If we're on the first page, we don't display previous
Template.pagination.notFirstPage = function(){
	return parseInt(Session.get("currentPage")) > 1;
};
	
//If we're on the first page, we don't display next;
Template.pagination.notLastPage = function(){
        var page =  parseInt(Session.get("currentPage"));
        var limit = parseInt(Session.get("paginationLimit"));
        var count = parseInt(Session.get("paginationTotal"));
        return (page)*limit < count;
};

//Set the session variable to the first page when
//we go to another tab
Template.pagination.destroyed = function(){
    Session.set("currentPage",1);

};
