/*Meteor.publish('parts', function (skip,limit) {
    return Parts.find({}, {skip: skip || 0, limit: limit || 0});}); 
*/
Meteor.publish('parts', function() { return Parts.find();});


/*
Meteor.publish('ships', function(limit) {
  return Ships.find({}, {sort: {author: 1}, limit: limit});
});
*/
Meteor.publish('ships', function() { return Ships.find();});



Meteor.publish('players',function() {return Players.find();});
