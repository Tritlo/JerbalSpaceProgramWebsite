Template.nav.helpers({
    activePage: function (routeNames){
	ctx = Router.current();
	var routeNames = routeNames.split(',');
	for(var i = 0; i < routeNames.length; i++){

	    if(ctx && (ctx.route.name === routeNames[i])){
		return "active";
	    }
	}
	return '';
    }});
