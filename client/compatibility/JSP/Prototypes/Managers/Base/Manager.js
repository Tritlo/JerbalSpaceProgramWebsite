function Manager(instanceID,descr) {
    this.setup(instanceID,descr);
    this.init();
 };

Manager.prototype = new Instantiable();

Manager.prototype.setup = function (instanceID,descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.instanceID = instanceID;
};

//Called when state is initialized
Manager.prototype.init = function () {
};

