var InstanceManager = {};

InstanceManager.init = function() {
    this._nextInstanceID = 0;
    this.instances = [];
};

InstanceManager.getNewID = function(){
    return this._nextInstanceID++;
};

InstanceManager.clear = function(){
    this._nextInstanceID = 0;
    this.instances = [];
};

InstanceManager.addInstance = function(instance){
    console.log("adding instance with ID: "+ instance.ID);
    console.log(instance);
    this.instances[instance.ID] = instance;
};

InstanceManager.render = function(){
    for(var ID in this.instances)
	this.instances[ID].render();
    };

InstanceManager.update = function(dt,original_dt){
    for(var ID in this.instances)
	this.instances[ID].update(dt,original_dt);
    };


InstanceManager.handleMouse = function(evt,type){
    var g_mouse = [evt.clientX,evt.clientY];
    for(var ID in this.instances){
	var inst = this.instances[ID];
	var pos = util.findPos(inst.canvas);
	var w = inst.canvas.width;
	var h = inst.canvas.height;
	if (util.isBetween(g_mouse[0],pos.x, pos.x+w) && util.isBetween(g_mouse[1],pos.y,pos.y+h)){
	    return inst.handleMouse(evt,type);
	    }
	}
    return false;
};

InstanceManager.quit = function(){
    for(var ID in this.instances){
	    var inst = this.instances[ID];
	    var reqQ = keys[inst.settings.keys.KEY_QUIT];
	    if (reqQ) {
		inst.stateManager.switchState('menu');
	    }
	}
};

InstanceManager.init();

