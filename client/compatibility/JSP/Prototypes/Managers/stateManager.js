function StateManager(instanceID,descr){
    this.setup(instanceID,descr);
}

StateManager.prototype = new Manager();
StateManager.prototype.setup = function (instanceID,descr) {
    this.instanceID = instanceID;
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
		    "menu" : this.getInstance().mainMenu,
		    "simulation" : this.getInstance().simulation,
		    "partsDesigner" : this.getInstance().partsDesigner,
		    "shipDesigner" : this.getInstance().shipDesigner,
	            "viewer" : this.getInstance().viewer
	};
        //Deactivate all other possible states
        if(typeof(this.getInstance().simulation) !== 'undefined'){
            this.getInstance().simulation.onDeactivation();
        }
        if(typeof(this.getInstance().partsDesigner) !== 'undefined'){
            this.getInstance().partsDesigner.onDeactivation();
        }
	
        if(typeof(this.getInstance().shipDesigner) !== 'undefined'){
            this.getInstance().shipDesigner.onDeactivation();
        }
        if(typeof(this.getInstance().mainMenu) !== 'undefined'){
            this.getInstance().mainMenu.onDeactivation();
        }
        if(typeof(this.getInstance().viewer) !== 'undefined'){
            this.getInstance().viewer.onDeactivation();
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
