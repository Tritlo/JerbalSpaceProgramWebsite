Meteor.methods({
    partsCount: function(){
	       return Parts.find().count();
	}
    });
