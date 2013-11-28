Meteor.methods({
    partsCount: function(){
	       return Parts.find().count();
	},
    shipsCount: function(){
	       return Ships.find().count();
	},
	myPartsCount: function(){
		return Parts.find( { author: Meteor.user() } ).count();
	}    
});
