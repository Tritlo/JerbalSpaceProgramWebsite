stateManager = {
    "currentState": undefined,
    setStates: function(states){
	this.states = states;
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
		if(this.currentState){
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

			 
