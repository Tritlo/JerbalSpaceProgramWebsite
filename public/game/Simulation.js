// GAME-SPECIFIC UPDATE LOGIC
    function updateSimulation(du) {
        
        
        entityManager.update(du);

        // Prevent perpetual firing!
        eatKey(g_settings.keys.KEY_FIRE);
    }

    // =================
    // RENDER SIMULATION
    // =================

    // We take a very layered approach here...
    //
    // The primary `render` routine handles generic stuff such as
    // the diagnostic toggles (including screen-clearing).
    //
    // It then delegates the game-specific logic to `gameRender`


    // GAME-SPECIFIC RENDERING

    function renderSimulation(ctx) {

        entityManager.render(ctx);
    renderHUD(ctx);

    if (g_settings.renderSpatialDebug) spatialManager.render(ctx);
}


function Simulation(descr) {
    this.setup(descr);
};

Simulation.prototype = new State();
Simulation.prototype.render = function (ctx) {
    renderSimulation(ctx);
   };
Simulation.prototype.update = function (du){
    updateSimulation(du);
    };

Simulation.prototype.cameraUpdate = function(du) {
    entityManager.updateCamera();
    Stars.update(du);
};

Simulation.prototype.onActivation = function(){
    if(g_settings.graphicsLevel == 1){
        Stars.init({"_STpBL": {min:10, max:30}});
    }
    if(g_settings.graphicsLevel == 2){
        Stars.init({"_STpBL": {min:30, max:80}});
    }
    
    entityManager.init();
    entityManager.createInitialShips();
    var s = entityManager.getMainShip();
    entityManager.getTerrain(s.cx,s.cy).addLaunchpad(s);
};

Simulation.prototype.onDeactivation = function() {
    entityManager.deInit();
    spatialManager.unregisterAll();

};

Simulation.prototype.handleMouse = function (evt,type) {
    if (type === "down"){
	g_mouseClick = [evt.clientX - g_canvas.offsetLeft,evt.clientY - g_canvas.offsetTop];
	g_mouseDown = true;
    } else if (type === "move") {
	if (g_mouseDown) {
	g_mouse = [evt.clientX - g_canvas.offsetLeft,evt.clientY - g_canvas.offsetTop];
	entityManager.mouseOffset = util.vecMinus(g_mouse,g_mouseClick);
	}
    } else if (type === "up") {
	g_mouseDown = false;
	    //entityManager.cameraOffset = util.vecPlus(entityManager.cameraOffset,entityManager.mouseOffset);
	entityManager.cameraOffset = util.vecPlus(entityManager.cameraOffset,util.rotateVector(util.mulVecByScalar(1/entityManager.cameraZoom,entityManager.mouseOffset),-entityManager.cameraRotation));
	    entityManager.mouseOffset = [0,0];
    }
 };

var simulation = new Simulation();
