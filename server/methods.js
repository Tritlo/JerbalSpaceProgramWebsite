Meteor.methods({
    partsCount: function(){
	       return Parts.find().count();
	},
    shipsCount: function(){
	       return Ships.find().count();
	}
    });
