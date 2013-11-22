function getScriptsInOrder(files, onFinish){
    var head = files.shift();
    if(head === undefined){ 
        if(onFinish) return onFinish();
        else return true;
    }
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
	      "game/csscolorparser.js"
	    , "game/globals.js"
	    , "game/consts.js"
	    , "game/util.js"
	    , "game/keys.js"
	    , "game/spatialManager.js"
	    , "game/Stars.js"
	    , "game/entityManager.js"
	    , "game/Sprite.js"
	    , "game/Entity.js"
	    , "game/Terrain.js"
	    , "game/Ship.js" 
	    , "game/update.js"
	    , "game/render.js"
	    , "game/HUD.js"
	    , "game/imagesPreload.js"
	    , "game/main.js"
	    , "game/State.js"
	    , "game/Grid.js"
	    , "game/Part.js"
	    , "game/Menu.js"
	    , "game/PartsDesigner.js"
	    , "game/ShipDesigner.js"
	    , "game/Simulation.js"
	    , "game/stateManager.js"
	    , "game/handleMouse.js"
	    , "game/JerbalSpaceProgram.js"
	  ];

    getScriptsInOrder(jsFiles);
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
