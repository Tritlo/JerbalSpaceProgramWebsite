function Manager(instance,descr) {
    this.setup(instance,descr);
    this.init();
 };

Manager.prototype.setup = function (instance,descr) {
    // Apply all setup properies from the (optional) descriptor
    this.instance = instance;
    for (var property in descr) {
        this[property] = descr[property];
    }
};

//Called when state is initialized
Manager.prototype.init = function () {
};
