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
	path: '/parts/browse/:_id?',
	before: [function(){
	    Session.set('currentPart',this.params._id);
	}]
    });
    
    this.route('browseShips', {
	path: '/ships/browse/:_id?',
	before: [function(){
	    Session.set('currentShip',this.params._id);
	}]
    });
    
    this.route('launchShip', {
	path: '/ships/launch/:_id',
	before: [function(){
	    Session.set('currentShip',this.params._id);
	}],
    });
});
