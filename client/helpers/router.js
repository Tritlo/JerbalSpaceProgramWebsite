Router.configure({
    autoRender: false,
    notFoundTemplate: 'notFound'
});

clearInstanceManager = function(){
    if(InstanceManager) InstanceManager.clear();
};

Router.map(function() {
    this.route('home', {
	path: '/'
    });
    this.route('info', {});
    this.route('instructions', {});
    
    this.route('browseParts', {
	path: '/parts/browse/:page?/:_id?',
	before: [clearInstanceManager, function(){
	    Session.set('currentPart',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('designPart', {
	path: '/parts/design/:_id?',
	before: [clearInstanceManager,function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    if(this.params._id)
		Session.set('currentPart',this.params._id);
	}]
    });
    
    this.route('myParts', {
	path: '/parts/myParts/:page?/:_id?',
	before: [clearInstanceManager,function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    Session.set('currentPart',this.params._id);
	}]
    });

    this.route('browseShips', {
	path: '/ships/browse/:page?/:_id?',
	before: [clearInstanceManager,function(){
	    Session.set('currentShip',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('designShip', {
	path: '/ships/design/:_id?',
	before: [clearInstanceManager,function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    if(this.params._id)
		Session.set('currentShip',this.params._id);
	    
	}]
    });
    
	this.route('myShips', {
	path: '/parts/myShips/:page?/:_id?',
	before: [clearInstanceManager,function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    Session.set('currentShip',this.params._id);
	}]
    });
    
    this.route('launchShip', {
	path: '/ships/launch/:_id?',
	before: [clearInstanceManager,function(){
	    if(this.params._id) Session.set('currentShip',this.params._id);
	    if(!(Session.get('currentShip') || !(Ships.findOne(Session.get('currentShip'))))){
		this.render("mustSelectShip");
		this.stop();
	    }
	    
	}]
    });
});
