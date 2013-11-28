function Simulation(instanceID,descr) {
    this.setup(instanceID,descr);
};

Simulation.prototype = new State();

Simulation.prototype.render = function (ctx) {
    this.getInstance().entityManager.render(ctx);
    this.getInstance().HUD.render(ctx);

    if (this.getInstance().settings.renderSpatialDebug) this.getInstance().spatialManager.render(ctx);
   };
Simulation.prototype.update = function (du){
    this.getInstance().entityManager.update(du);

    // Prevent perpetual firing!
    };

Simulation.prototype.cameraUpdate = function(du) {
    this.getInstance().entityManager.updateCamera();
    this.getInstance().Stars.update(du);
};

Simulation.prototype.onActivation = function(){
    this.getInstance().Stars = new Stars(this.instanceID);
    this.getInstance().spatialManager.init();
    this.getInstance().entityManager.init();
    this.getInstance().HUD = new HUD(this.instanceID);
    if(!this.getInstance().entityManager.getMainShip()){
	    this.getInstance().entityManager.createInitialShips();
	}
    var s = this.getInstance().entityManager.getMainShip();
    this.getInstance().entityManager.getTerrain(s.cx,s.cy).addLaunchpad(s);
};

Simulation.prototype.onDeactivation = function() {
    this.getInstance().entityManager.deInit();
};

Simulation.prototype.handleMouse = function (evt,type) {
    var pos = util.findPos(this.getInstance().canvas);
    if (type === "down"){
        this.g_mouseClick = [evt.clientX-pos.x,evt.clientY-pos.y];
        this.g_mouseDown = true;
    } else if (type === "move") {
	if (this.g_mouseDown) {
        var g_mouse = [evt.clientX-pos.x,evt.clientY-pos.y];
        this.getInstance().entityManager.mouseOffset = util.vecMinus(g_mouse,this.g_mouseClick);
	}
    } else if (type === "up") {
	this.g_mouseDown = false;
	//this.getInstance().entityManager.cameraOffset = util.vecPlus(this.getInstance().entityManager.cameraOffset,util.rotateVector(util.mulVecByScalar(1/this.getInstance().entityManager.cameraZoom,this.getInstance().entityManager.mouseOffset),-this.getInstance().entityManager.cameraRotation));

    }
 };
