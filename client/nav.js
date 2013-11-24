Template.nav.helpers({
    activePage: function (routeName){
	ctx = Router.current();
	return (ctx && (ctx.route.name === routeName)) ? 'active' : '';
    }
});
