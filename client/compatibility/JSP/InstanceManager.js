var InstanceManager = {};

InstanceManager.init = function() {
    this._nextInstanceID = 0;
    this.instances = {};
    this.runningInstances = {};
};

InstanceManager.getNewID = function(){
    return this._nextInstanceID++;
};

InstanceManager.processDiagnostics = function(frameTime_ms, frameTimeDelta_ms, prevUpdateDu){
    for(var ID in this.runningInstances){
        var inst = this.getInstance(ID);
        inst.processDiagnostics();
        if (inst.settings.doTimerShow){
            var y = 350;
            ctx = inst.ctx;
            ctx.save()
            ctx.fillStyle = "white";
            ctx.fillText('FT ' + frameTime_ms, 50, y+10);
            ctx.fillText('FD ' + frameTimeDelta_ms, 50, y+20);
            ctx.fillText('UU ' + inst.prevUpdateDu, 50, y+30); 
            ctx.fillText('FrameSync ON', 50, y+40);
            ctx.fill();
            ctx.restore();
        }
    }
};

InstanceManager.clear = function(){
    this._nextInstanceID = 0;
    for(var ID in this.runningInstances){
	this.stopInstance(ID);
    }
    for(var ID in this.instances){
	this.removeInstance(ID);
    }
};

InstanceManager.startInstance = function(instanceID){
    this.runningInstances[instanceID] = this.instances[instanceID];
};

InstanceManager.stopInstance = function(instanceID){
    delete this.runningInstances[instanceID];
};

InstanceManager.isRunning = function(instanceID){
    return (this.runningInstances[instanceID] !== undefined);
};

InstanceManager.removeInstance = function(instanceID){
    if(this.isRunning(instanceID))
	this.stopInstance(instanceID);
    delete this.instances[instanceID];
};

InstanceManager.addInstance = function(instance){
    console.log("adding instance with ID: "+ instance.ID);
    this.instances[instance.ID] = instance;
};

InstanceManager.getInstance = function(ID){
    return this.instances[ID];
};

InstanceManager.render = function(){
    for(var ID in this.runningInstances)
	this.instances[ID].render();
    };

InstanceManager.update = function(dt,original_dt){
    for(var ID in this.runningInstances)
	this.instances[ID].update(dt,original_dt);
    };


InstanceManager.handleMouse = function(evt,type){
    var g_mouse = [evt.clientX,evt.clientY];
    for(var ID in this.runningInstances){
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
    for(var ID in this.runningInstances){
	    var inst = this.instances[ID];
	    var reqQ = keys[inst.settings.keys.KEY_QUIT];
	    if (reqQ && inst.enableQuit) {
		inst.stateManager.switchState('menu');
	    }
	}
};

InstanceManager.init();

