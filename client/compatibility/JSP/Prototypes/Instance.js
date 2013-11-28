function Instance(descr){
    this.setup(descr);
    this.init();
}

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
Instance.prototype.enableQuit = true;
Instance.prototype.ship = undefined;
Instance.prototype.currentPlayers = undefined;
Instance.prototype.multi = false;
Instance.prototype.loadedShips = undefined;

Instance.prototype.loadShip = function(id){
    return loadedShips[id];
    if(this.loadedShips && id in this.loadedShips){
	return;
    }
    var inst = this.ID;
    console.log("loading ship" + id);
    var ship = new Ship(inst,loadedShips[id]);
    ship.unregister();
    ship.isMain = false;
    if(this.loadedShips){} else {
	this.loadedShips = {};
    }
    this.loadedShips[id] = ship;
};

Instance.prototype.getShip = function(id){
    this.loadShip(id);
    return this.loadedShips[id];
};

Instance.prototype.loadShips = function(){
    // =========
    // LOAD DEFAULTS
    // =========
    var inst = this.ID;
    if(this.ship){
	this.ships=[new Ship(inst,this.ship)];
	console.log("ship loaded");
    } else {
	g_defaultShips = g_defaultShips.map(function (str) {
	    var s = new Ship(inst,$.parseJSON(str));
	    console.log(s);
	    s.disconnect();
	    return s;
	});

	//Load default parts;
	g_defaultParts = g_defaultParts.map(function (str) {
	    var p = new Part(inst,$.parseJSON(str));
	    p.instanceID = undefined;
	    return p;
	});

	if(util.storageLoad('parts') === undefined){
	    util.storageSave('parts',g_defaultParts);
	}

	if(util.storageLoad('ships') === undefined){
	    util.storageSave('ships',g_defaultShips);
	}

	this.ships = util.storageLoad('ships') || [{}];
	this.ships = this.ships.map(function(s) {
	    return new Ship(inst,s);
	});
    }
};

Instance.prototype.init = function (){
    this.ID = InstanceManager.getNewID(this.canvasID);
    InstanceManager.addInstance(this);
    if(this.settings === undefined){
        this.settings = g_settings;
    }
    
    this.entityManager = new EntityManager(this.ID);
    this.spatialManager = new SpatialManager(this.ID);
    this.stateManager = new StateManager(this.ID);
    this.mainMenu = new MainMenu(this.ID);
    this.partsDesigner = new PartsDesigner(this.ID);
    this.shipDesigner = new ShipDesigner(this.ID);
    this.simulation = new Simulation(this.ID);
    if(this.grid){
        this.viewer = new Viewer(this.ID,{grid: this.grid});
    }
    this.loadShips();
    this.stateManager.init();
};

Instance.prototype.start = function(){
    InstanceManager.startInstance(this.ID);
};


Instance.prototype.handleMouse = function(evt,type){
    return this.stateManager.handleMouse(evt,type);
};

Instance.prototype.setup = function (descr){
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.canvas = document.getElementById(this.canvasID);
    this.ctx = this.canvas.getContext("2d");
};

Instance.prototype.render = function (){
    var inst = this;
    var ctx = inst.ctx;
    if(inst.settings.enableDebug) {
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_CLEAR)) inst.settings.doClear = !inst.settings.doClear;
	if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_BOX)) inst.settings.doBox = !inst.settings.doBox;
    if (eatKey(inst.settings.debugKeys.KEY_TOGGLE_TIMER)){
        inst.settings.doTimerShow = !inst.settings.doTimerShow;
    }
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
        this.entityManager.getMainShip().isPaused = !this.entityManager.getMainShip().isPaused;
    }
    return this.isUpdatePaused && !eatKey(this.settings.keys.KEY_STEP);    
};


Instance.prototype.processDiagnostics = function(){
    // GAME-SPECIFIC DIAGNOSTICS

    if (eatKey(this.settings.keys.KEY_TOGGLE_DEBUG))
        this.settings.enableDebug = ! this.settings.enableDebug;
    
    if(this.settings.enableDebug) {
        if (eatKey(this.settings.debugKeys.KEY_MIXED))
            this.settings.allowMixedActions = !this.settings.allowMixedActions;

        /*if (eatKey(this.settings.debugKeys.KEY_GRAVITY)) this.settings.useGravity = !this.settings.useGravity;

        if (eatKey(this.settings.debugKeys.KEY_AVE_VEL)) this.settings.useAveVel = !this.settings.useAveVel;
        */
        if (eatKey(this.settings.debugKeys.KEY_SPATIAL)) this.settings.renderSpatialDebug = !this.settings.renderSpatialDebug;

        if (eatKey(this.settings.debugKeys.KEY_HALT)){
            this.entityManager.haltShips();
        }
	
        if (eatKey(this.settings.debugKeys.KEY_ORBIT_SHIP)){
            this.entityManager.getMainShip().setOrbit(7000);
        }

        if (eatKey(this.settings.debugKeys.KEY_RESET)) this.entityManager.resetShips();

        if (eatKey(this.settings.debugKeys.KEY_0)) entityManager.toggleRocks();

        if (eatKey(this.settings.debugKeys.KEY_SPEEDUP)){
            this.settings.timeMultiplier/=2;
        }
        if (eatKey(this.settings.debugKeys.KEY_SLOWDOWN)) {
            if (this.settings.timeMultiplier < 1){
                this.settings.timeMultiplier*=2;
            }
                console.log(this.settings.timeMultiplier);
        }
        
        /*
        if (eatKey(inst.settings.debugKeys.KEY_1)) entityManager.generateShip({
            cx : inst.mouseX,
            cy : inst.mouseY,
            
            sprite : inst.sprites.ship});

        if (eatKey(inst.settings.debugKeys.KEY_2)) entityManager.generateShip({
            cx : inst.mouseX,
            cy : inst.mouseY,
            
            sprite : inst.sprites.ship2
            });

        //if (eatKey(g_settings.debugKeys.KEY_K)) entityManager.killNearestShip(
        //    g_mouseX, g_mouseY);
        */
    }
};
