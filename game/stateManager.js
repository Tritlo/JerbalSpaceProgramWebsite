stateManager = {
    "currentState": "mainMenu",
    "states": { "mainMenu" : mainMenu,
		"mainSimulation" : mainSimulation
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
                this.currentState = state;
            }
        } else {
            this.currentState = states[ keys[keys.indexOf((currentState) + 1) % keys.length]]
        }
    }
}
