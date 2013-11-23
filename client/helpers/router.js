Router.configure({
    autoRender: false
});


Router.map(function() {
    this.route('home', {
	path: '/'
    });
    this.route('instructions', {
    });
    this.route('parts', {
	path: '/parts'
    });
});
