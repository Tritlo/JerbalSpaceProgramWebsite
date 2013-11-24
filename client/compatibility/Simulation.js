function Simulation(instance,descr) {
    this.setup(instance,descr);
};

Simulation.prototype = new State();
Simulation.prototype.render = function (ctx) {
    this.instance.entityManager.render(ctx);
    this.instance.HUD.render(ctx);

    if (this.instance.settings.renderSpatialDebug) this.instance.spatialManager.render(ctx);
   };
Simulation.prototype.update = function (du){
    this.instance.entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(this.instance.settings.keys.KEY_FIRE);
    };

Simulation.prototype.cameraUpdate = function(du) {
    this.instance.entityManager.updateCamera();
    this.instance.Stars.update(du);
};

Simulation.prototype.onActivation = function(){
    this.instance.Stars = new Stars(this.instance);
    this.instance.spatialManager.init();
    this.instance.entityManager.init();
    this.instance.HUD = new HUD(this.instance);
    if(!this.instance.entityManager.getMainShip()){
	this.instance.entityManager.createInitialShips();
	}
    var s = this.instance.entityManager.getMainShip();
    this.instance.entityManager.getTerrain(s.cx,s.cy).addLaunchpad(s);
};

Simulation.prototype.onDeactivation = function() {
    this.instance.entityManager.deInit();
};

Simulation.prototype.handleMouse = function (evt,type) {
    if (type === "down"){
	var g_mouseClick = [evt.clientX - this.instance.canvas.offsetLeft,evt.clientY - this.instance.canvas.offsetTop];
	var g_mouseDown = true;
    } else if (type === "move") {
	if (g_mouseDown) {
	var g_mouse = [evt.clientX - this.instance.canvas.offsetLeft,evt.clientY - this.instance.canvas.offsetTop];
	this.instance.entityManager.mouseOffset = util.vecMinus(g_mouse,g_mouseClick);
	}
    } else if (type === "up") {
	g_mouseDown = false;
	    //entityManager.cameraOffset = util.vecPlus(entityManager.cameraOffset,entityManager.mouseOffset);
	this.instance.entityManager.cameraOffset = util.vecPlus(this.instance.entityManager.cameraOffset,util.rotateVector(util.mulVecByScalar(1/this.instance.entityManager.cameraZoom,this.instance.entityManager.mouseOffset),-entityManager.cameraRotation));
	    this.instance.entityManager.mouseOffset = [0,0];
    }
 };

var simulation = new Simulation();
