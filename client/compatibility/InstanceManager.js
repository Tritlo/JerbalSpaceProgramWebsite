var InstanceManager = {};

InstanceManager.init = function() {
    this._nextInstanceID = 0;
    this.instances = [];
};

InstanceManager.getNewID = function(){
    return this._nextInstanceID++;
};

InstanceManager.addInstance = function(instance){
    this.instances[Instance.ID] = instance;
};

InstanceManager.render = function(){
    for(var ID in this.instances)
	this.instances[ID].render();
    };

InstanceManager.update = function(dt,original_dt){
    for(var ID in this.instances)
	this.instances[ID].update(dt,original_dt);
    };

