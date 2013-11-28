Router.configure({
    autoRender: false,
    notFoundTemplate: 'notFound'
});


Router.map(function() {
    this.route('home', {
	path: '/'
    });
    this.route('info', {});
    this.route('instructions', {});
    
    this.route('browseParts', {
	path: '/parts/browse/:page?/:_id?',
	before: [function(){
	    Session.set('currentPart',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('browseShips', {
	path: '/ships/browse/:page?/:_id?',
	before: [function(){
	    Session.set('currentShip',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('launchShip', {
	path: '/ships/launch/:_id',
	before: [function(){
	    Session.set('currentShip',this.params._id);
	}],
    });
});
