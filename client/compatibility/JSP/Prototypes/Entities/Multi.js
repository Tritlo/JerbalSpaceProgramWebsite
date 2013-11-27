var isUpdating = false;
var currentPlayers = {};
var lastUpdated = 0;
var timeout = 30000;
function updatePlayerState(state){
    var now = Date.now();
    if(this.isUpdating || (now - lastUpdated) <= 2000){
	return;
    }
    lastUpdated = now;
    isUpdating = true;
    var id = Meteor.userId();
    if(id){
	state.time = Date.now();
	Players.upsert(id,{$set: state},{},updatePlayers);
    }
};

function updatePlayers(){
    var id = Meteor.userId();
    var now = Date.now();
    var sinceTimeout = Date.now() - timeout;
    var oPs = Players.find({_id: {$ne: id}, time: {$gt: sinceTimeout}},{limit:5}).fetch();
    var ps = {};
    for(var i =0; i< oPs.length; i++){
	var player = oPs[i];
	var name = Meteor.users.findOne(player._id).username;
	loadShip(player.shipId);
	ps[name] = player;
    }
    currentPlayers = ps;
    isUpdating = false;
};

var loadedShips = {};

function loadShip(id){
    if(id in loadedShips){
	return;
    } else {
	var ship = Ships.findOne(id);
	this.loadedShips[id] = ship;
    }
}



