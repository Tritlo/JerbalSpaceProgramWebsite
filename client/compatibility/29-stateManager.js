stateManager = {
    "currentState": undefined,
    states: {
		"menu" : mainMenu,
		"simulation" : simulation,
		"partsDesigner" : partsDesigner,
		"shipDesigner" : shipDesigner,
        "viewer" : viewer
    },

    init: function() {
        //Deactivate all other possible states
        if(typeof(partsDesigner) !== 'undefined'){
            simulation.onDeactivation();
        }
        if(typeof(shipDesigner) !== 'undefined'){
            shipDesigner.onDeactivation();
        }
        if(typeof(mainMenu) !== 'undefined'){
            mainMenu.onDeactivation();
        }
        if(typeof(viewer) !== 'undefined'){
            viewer.onDeactivation();
        }
        var stateK = Object.keys(this.states);
        for(var i = 0; i < stateK.length; i++){
            var state = stateK[i];
            if(!state.hasBeenInitialized){
                console.log("Initializing " + state);
                this.states[state].init();
                this.states[state].hasBeenInitialized = true;
            }
        }
	},
    addState: function(statename, state){
	    this.states[statename] = state;
    },
    cameraUpdate: function(du){
	if(this.currentState){
	    this.states[this.currentState].cameraUpdate();
	}
    },

    update: function(du){
	if(this.currentState){
	    this.states[this.currentState].update(du);
	}
    },

    render: function(ctx) {
	if(this.currentState){
	    this.states[this.currentState].render(ctx);
	}
    },

    handleMouse : function(evt,type) {
	if(this.currentState){
	    this.states[this.currentState].handleMouse(evt,type);
	}
    },

    switchState : function(state) {
	var keys = Object.keys(this.states);
        if (state) {
            if (keys.indexOf(state) > -1){
		if(this.currentState && this.states && this.states[this.currentState]){
		    this.states[this.currentState].onDeactivation();
		}
                this.currentState = state;
		this.states[this.currentState].onActivation();
            }
        } else {
	    if(this.currentState){
		this.states[this.currentState].onDeactivation();
		this.currentState = states[ keys[keys.indexOf((currentState) + 1) % keys.length]];
	    } else this.currenState = states[0];
	    this.states[this.currentState].onActivation();
        }
    }
};

			 
