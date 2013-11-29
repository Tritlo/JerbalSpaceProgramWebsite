//These are methods that can be called clientside
//which gives access to the server side collections and functions.
//useful if we limit the amount of parts/ships available on the client
Meteor.methods({
    partsCount: function(scope){
	       return Parts.find(scope).count();
    },
    shipsCount: function(scope){
	       return Ships.find(scope).count();
    }
});
