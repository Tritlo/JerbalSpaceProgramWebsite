stateManager = {
    "currentState": "menu",
    "states": {
        "menu" : mainMenu,
        "simulation" : simulation,
        "partsDesigner" : partsDesigner,
        "shipDesigner" : shipDesigner
		},

    cameraUpdate: function(du){
        this.states[this.currentState].cameraUpdate();
    },

    update: function(du){
        this.states[this.currentState].update(du);
    },

    render: function(ctx) {
        this.states[this.currentState].render(ctx);
    },

    handleMouse : function(evt,type) {
        this.states[this.currentState].handleMouse(evt,type)
    },

    switchState : function(state) {
	var keys = Object.keys(this.states);
        if (state) {
            if (keys.indexOf(state) > -1){
		this.states[this.currentState].onDeactivation();
                this.currentState = state;
		this.states[this.currentState].onActivation();
            }
        } else {
	    this.states[this.currentState].onDeactivation();
            this.currentState = states[ keys[keys.indexOf((currentState) + 1) % keys.length]]
	    this.states[this.currentState].onActivation();
        }
    }
}
