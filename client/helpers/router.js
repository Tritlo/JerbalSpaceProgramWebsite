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
    
    this.route('designPart', {
	path: '/parts/design/:_id?',
	before: [function(){
	    if(!Meteor.user()){
		this.render("mustBeLoggedIn");
		this.stop();
	    }
	    Session.set('currentPart',this.params._id);
	}]
    });
    
    this.route('browseShips', {
	path: '/ships/browse/:page?/:_id?',
	before: [function(){
	    Session.set('currentShip',this.params._id);
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
	    Session.set('currentShip',this.params._id);
	}]
    });
    
    this.route('launchShip', {
	path: '/ships/launch/:_id?',
	before: [function(){
	    if(this.params._id) Session.set('currentShip',this.params._id);
	    else{
		var id = Session.get('currentShip');
		if(!id){
		    this.render("mustSelectShip");
		    this.stop();
		}
	    }
	    if(!(Ships.findOne(id))){
		    this.render("mustSelectShip");
		    this.stop();
	    }
	    
	}]
    });
});
