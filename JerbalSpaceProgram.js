function getScriptsInOrder(files){
    var head = files.shift();
    console.log("Loading " + head);
    if(head === undefined) return true
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = head;
    var onL = function(){
        getScriptsInOrder(files)
    }
    script.onload = onL;
    document.getElementsByTagName('head')[0].appendChild(script);
}


if (Meteor.isClient) {
  Template.game.created = function() {
      var jsFiles = [
	      "JerbalSpaceProgram/game/csscolorparser.js"
	    , "JerbalSpaceProgram/game/globals.js"
	    , "JerbalSpaceProgram/game/consts.js"
	    , "JerbalSpaceProgram/game/util.js"
	    , "JerbalSpaceProgram/game/keys.js"
	    , "JerbalSpaceProgram/game/spatialManager.js"
	    , "JerbalSpaceProgram/game/Stars.js"
	    , "JerbalSpaceProgram/game/entityManager.js"
	    , "JerbalSpaceProgram/game/Sprite.js"
	    , "JerbalSpaceProgram/game/Entity.js"
	    , "JerbalSpaceProgram/game/Terrain.js"
	    , "JerbalSpaceProgram/game/Ship.js" 
	    , "JerbalSpaceProgram/game/update.js"
	    , "JerbalSpaceProgram/game/render.js"
	    , "JerbalSpaceProgram/game/HUD.js"
	    , "JerbalSpaceProgram/game/imagesPreload.js"
	    , "JerbalSpaceProgram/game/main.js"
	    , "JerbalSpaceProgram/game/State.js"
	    , "JerbalSpaceProgram/game/Grid.js"
	    , "JerbalSpaceProgram/game/Part.js"
	    , "JerbalSpaceProgram/game/Menu.js"
	    , "JerbalSpaceProgram/game/PartsDesigner.js"
	    , "JerbalSpaceProgram/game/ShipDesigner.js"
	    , "JerbalSpaceProgram/game/Simulation.js"
	    , "JerbalSpaceProgram/game/stateManager.js"
	    , "JerbalSpaceProgram/game/handleMouse.js"
	    , "JerbalSpaceProgram/game/JerbalSpaceProgram.js"
	  ];

      getScriptsInOrder(jsFiles);
      
      
    $('head').append('<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=VT323">');
		     
  }

  /*
  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
  */
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
