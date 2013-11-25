function Instantiable(instanceID,descr){
    this.setup(descr);
};

Instantiable.prototype.getInstance = function(){
    return InstanceManager.getInstance(this.instanceID);
};

Instantiable.prototype.setup = function(instanceID, descr){
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.instanceID = instanceID;
};
