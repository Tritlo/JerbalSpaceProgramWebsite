function State(instance, descr) {
    this.setup(instance, descr);
    this.init();
 };
State.prototype = new Instantiable();

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
