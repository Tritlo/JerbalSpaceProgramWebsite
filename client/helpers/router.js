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
	    Session.set('currentItem',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('designPart', {
	path: '/parts/design/:_id?',
	before: [function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    if(this.params._id)
		Session.set('currentItem',this.params._id);
	}]
    });
    
    this.route('myParts', {
	path: '/parts/myParts/:page?/:_id?',
	before: [function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    Session.set('currentItem',this.params._id);
	}]
    });

    this.route('browseShips', {
	path: '/ships/browse/:page?/:_id?',
	before: [function(){
	    Session.set('currentItem',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('designShip', {
	path: '/ships/design/:_id?',
	before: [function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    if(this.params._id)
	    Session.set('currentItem',this.params._id);
	    
	}]
    });
    
	this.route('myShips', {
	path: '/ships/myShips/:page?/:_id?',
	before: [function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    console.log(this.params._id)
	    Session.set('currentItem',this.params._id);
	    Session.set('currentPage',this.params.page);
	}]
    });
    
    this.route('launchShip', {
	path: '/ships/launch/:_id?',
	before: [function(){
	    if(this.params._id) Session.set('currentItem',this.params._id);
	    if(!(Session.get('currentItem') || !(Ships.findOne(Session.get('currentItem'))))){
		this.render("mustSelectShip");
		this.stop();
	    }
	    
	}]
    });
});
