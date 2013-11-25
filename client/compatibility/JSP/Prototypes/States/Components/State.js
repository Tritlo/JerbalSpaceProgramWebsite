function State(instance, descr) {
    this.setup(instance, descr);
    this.init();
 };

State.prototype.setup = function (instance, descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.instance = instance;
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
