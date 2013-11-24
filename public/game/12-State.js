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

//Called when state is initialized
State.prototype.init = function () {
};

//Called when state is activated
State.prototype.onActivation = function() {
    };

//Called when state is deactivated;
State.prototype.onDeactivation = function() {
    };

State.prototype.render = function (ctx) {
    };

State.prototype.cameraUpdate = function () {
    };

State.prototype.update = function (du) {
    };

State.prototype.handleMouse = function (evt,type) {
    };