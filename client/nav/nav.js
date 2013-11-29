//Here we add some helpers to the nav, so that we can see which page is currently active
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
