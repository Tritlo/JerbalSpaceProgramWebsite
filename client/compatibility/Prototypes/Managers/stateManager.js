function StateManager(descr,instance){
    this.setup(descr,instance);
}

StateManager.prototype = new Manager();
StateManager.prototype.setup = function (instance,descr) {
    this.instance = instance;
    if(!(descr)){
	descr = {
	    "currentState" : undefined
	};
    };
    for (var property in descr) {
        this[property] = descr[property];
    }
};

StateManager.prototype.init = function(states) {
	this.states =  {
		    "menu" : this.instance.mainMenu,
		    "simulation" : this.instance.simulation,
		    "partsDesigner" : this.instance.partsDesigner,
		    "shipDesigner" : this.instance.shipDesigner,
	            "viewer" : this.instance.viewer
	};
        //Deactivate all other possible states
        if(typeof(this.instance.simulation) !== 'undefined'){
            this.instance.simulation.onDeactivation();
        }
        if(typeof(this.instance.partsDesigner) !== 'undefined'){
            this.instance.partsDesigner.onDeactivation();
        }
	
        if(typeof(this.instance.shipDesigner) !== 'undefined'){
            this.instance.shipDesigner.onDeactivation();
        }
        if(typeof(this.instance.mainMenu) !== 'undefined'){
            this.instance.mainMenu.onDeactivation();
        }
        if(typeof(this.instance.viewer) !== 'undefined'){
            this.instance.viewer.onDeactivation();
        }
        var stateK = Object.keys(this.states);
        for(var i = 0; i < stateK.length; i++){
            var state = stateK[i];
            if(!state.hasBeenInitialized){
		if(this.states[state]){
		    console.log("Initializing " + state);
		    this.states[state].init();
		    this.states[state].hasBeenInitialized = true;
		    }
            }
        }
    };
StateManager.prototype.addState = function(statename, state){
	    this.states[statename] = state;
};
StateManager.prototype.cameraUpdate = function(du){
	if(this.currentState){
	    this.states[this.currentState].cameraUpdate();
	}
};

StateManager.prototype.update = function(du){
	if(this.currentState){
	    this.states[this.currentState].update(du);
	}
    };

StateManager.prototype.render =  function(ctx) {
	if(this.currentState){
	    this.states[this.currentState].render(ctx);
	}
};

StateManager.prototype.handleMouse = function(evt,type) {
	if(this.currentState){
	    this.states[this.currentState].handleMouse(evt,type);
	}
};

StateManager.prototype.switchState = function(state) {
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
		this.currentState = this.states[ keys[keys.indexOf((this.currentState) + 1) % keys.length]];
	    } else this.currenState = this.states[0];
	    this.states[this.currentState].onActivation();
        }
    };
