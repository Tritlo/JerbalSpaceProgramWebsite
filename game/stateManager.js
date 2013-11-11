stateManager = {
    "currentState": "menu",
    "updateFuncs" :  {
        "menu" : Menu.update,
        "simulation": Simulation.update
    },

    "states": ["menu","simulation"],

    update: function(du){
        this.updateFuncs[this.currentState](du);
    },

    "renderFuncs" : {
        "menu" : Menu.render,
        "simulation" : Simulation.render
    },

    render: function(ctx) {
        this.renderFuncs[this.currentState](ctx);
    },

    "handleMouseFuncs" : {
        "menu" : Menu.handleMouse,
        "simulation" : Simulation.handleMouse
    },
    handleMouse : function(evt,type) {
        this.handleMouseFuncs[this.currentState](evt,type)
    },

    switchState : function(state) {
        if (state) {
            if (this.states.indexOf(state) > -1){
                this.currentState = state;
            }
        } else {
            this.currentState = states[ (states.indexOf(currentState) + 1) % states.length];
        }
    }
}
