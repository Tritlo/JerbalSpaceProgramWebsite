Meteor.methods({
    partsCount: function(){
	       return Parts.find().count();
	},
    shipsCount: function(){
	       return Ships.find().count();
	},
	myPartsCount: function(){
		return Parts.find( { author: Meteor.user().username } ).count();
	},    
	myShipsCount: function(){
		return Ships.find( { author: Meteor.user().username } ).count();
	}    
});
