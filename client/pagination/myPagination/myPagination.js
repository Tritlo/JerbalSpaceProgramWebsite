Template.myPagination.events({
    "click .previous": function(event){
	event.preventDefault();
	var myPage = parseInt(Session.get("currentPage"))-1;
	var myPaginationOf = Session.get("myPaginationOf");
	var id = Session.get("current"+myPaginationOf);
	Session.set("currentPage", myPage);
	Router.go('my'+myPaginationOf+"s",{myPage: myPage,_id:id});
    },
    "click .next": function(event){
	event.preventDefault();
	var myPage = parseInt(Session.get("currentPage"))+1;
	var myPaginationOf = Session.get("myPaginationOf");
	var id = Session.get("current"+myPaginationOf);
	Session.set("currentPage", myPage);
	Router.go('my'+myPaginationOf+"s",{myPage: myPage,_id:id});
    }
});


Template.myPagination.notFirstPage = function(){
	return parseInt(Session.get("currentPage")) > 1;
};
	
Template.myPagination.notLastPage = function(){
        var myPage =  parseInt(Session.get("currentPage"));
        var limit = parseInt(Session.get("myPaginationLimit"));
        var count = parseInt(Session.get("myPaginationTotal"));
        return (myPage)*limit < count;
};
