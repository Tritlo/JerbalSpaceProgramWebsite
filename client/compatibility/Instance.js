function Instance(descr){
    this.setup(descr);
    this.init();
}

Instance.prototype.init = function (){
    if(this.settings === undefined){
	this.settings = g_settings;
    }
    this.entityManager = new EntityManager(this);
    this.spatialManager = new SpatialManager(this);
    this.stateManager = new StateManager(this);
    this.mainMenu = new MainMenu(this);
    this.partsDesigner = new PartsDesigner(this);
    this.shipDesigner = new ShipDesigner(this);
    this.simulation = new Simulation(this);
    this.viewer = new Viewer(this);

};

Instance.prototype.start = function(){
    this.ID = instanceManager.getNewID();
    instanceManager.addInstance(this);
};


Instance.prototype.setup = function (descr){
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.ctx = this.canvas.getContext("2d");
};

Instance.prototype.render = function (){
    var inst = this;
	 var ctx = inst.ctx;
    if(inst.settings.enableDebug) {
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_CLEAR)) inst.settings.doClear = !inst.settings.doClear;
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_BOX)) inst.settings.doBox = !inst.settings.doBox;
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_UNDO_BOX)) inst.settings.undoBox = !inst.settings.undoBox;
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_FLIPFLOP)) inst.settings.doFlipFlop = !inst.settings.doFlipFlop;
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_RENDER)) inst.settings.doRender = !inst.settings.doRender;
	}
    // Process various option toggles
    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //
    if (inst.settings.doClear) util.clearCanvas(ctx);

    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //
    if (inst.settings.doBox) util.fillBox(ctx, 200, 200, 50, 50, "red");


    // The core rendering of the actual game / simulation
    //
    if (inst.settings.doRender)  inst.stateManager.render(inst.ctx);


    // This flip-flip mechanism illustrates the pattern of alternation
    // between frames, which provides a crude illustration of whether
    // we are running "in sync" with the display refresh rate.
    //
    // e.g. in pathological cases, we might only see the "even" frames.
    //
    if (inst.settings.doFlipFlop) {
	var boxX = 250,
	    boxY = inst.settings.isUpdateOdd ? 100 : 200;

	// Draw flip-flop box
	util.fillBox(ctx, boxX, boxY, 50, 50, "green");

	// Display the current frame-counter in the box...
	ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
	// ..and its odd/even status too
	var text = g_frameCounter % 2 ? "odd" : "even";
	ctx.fillText(text, boxX + 10, boxY + 40);
    }

    // Optional erasure of diagnostic "box",
    // to illustrate flicker-proof double-buffering
    //
    if (inst.settings.undoBox) ctx.clearRect(200, 200, 50, 50);
};

Instance.prototype.update = function (dt, original_dt){
    var du = (dt / consts.NOMINAL_UPDATE_INTERVAL)/this.settings.timeMultiplier;
    if(!(this.shouldSkipUpdate())){
	this.stateManager.update(du);
	this.prevUpdateDt = original_dt;
	this.prevUpdateDu = du;
	this.isUpdateOdd = !this.isUpdateOdd;
    }
    this.stateManager.cameraUpdate(du);
    };

Instance.prototype.shouldSkipUpdate = function (){
    if (eatKey(this.settings.keys.KEY_PAUSE)) {
        this.isUpdatePaused = !this.isUpdatePaused;
    }
    return this.isUpdatePaused && !eatKey(this.settings.keys.KEY_STEP);    
};

Instance.prototype.isUpdatePaused = false;
Instance.prototype.isUpdateOdd = false;
Instance.prototype.canvas = undefined;
Instance.prototype.settings = undefined;
Instance.prototype.entityManager = undefined;
Instance.prototype.spatialManager = undefined;
Instance.prototype.stateManager = undefined;
Instance.prototype.mainMenu = undefined;
Instance.prototype.partsDesigner = undefined;
Instance.prototype.shipDesigner = undefined;
Instance.prototype.simulation = undefined;
Instance.prototype.main = undefined;
