function State(descr) {
    this.setup(descr);
    this.init();
 };

State.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};

State.prototype.init = function () {
    }

//To be done when activaed
State.prototype.onActivation = function() {
    }

//To be done when deactivated
State.prototype.onDeactivation = function() {
    }

State.prototype.render = function (ctx) {
    console.log("ERROR: RENDER NOT OVERWRITTEN FOR:");
    console.log(this); 
    };

State.prototype.update = function (du) {
    console.log("ERROR: UPDATE NOT OVERWRITTEN FOR:");
    console.log(this); 
    };

State.prototype.handleMouse = function (evt,type) {
    console.log("ERROR: HANDLEMOUSE NOT OVERWRITTEN FOR:");
    console.log(this); 
    };
