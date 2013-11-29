Meteor.methods({
    partsCount: function(scope){
	       return Parts.find(scope).count();
    },
    shipsCount: function(scope){
	       return Ships.find(scope).count();
    }
});
