    function Viewer(instance,descr){
    this.setup(instance,descr);
    console.log(descr);
    this.init();
};

Viewer.prototype = new State();

Viewer.prototype.init = function(){
    this.grid = new Grid(this.grid);
};


Viewer.prototype.loadPart = function(part){
    var part = new Part(this.instance,part);
    var w = part.width;
    var h = part.height;
    var r = Math.max(w,h)+1;
    var shiftH = Math.floor((r-1-h)/2);
    var shiftW = Math.floor((r-1-w)/2);
    this.grid.dims = [r,r];
    part.updateCenter([part.center[0]+shiftW,part.center[1]+shiftH]);
    this.grid = new Grid(this.grid);
    this.parts = [part.toDesigner(this.grid)];
    console.log(this.parts);
};

Viewer.prototype.loadShip = function(ship){
    var ship = new Ship(this.instance,ship);
    var w = ship.width;
    var h = ship.height;
    var r = Math.max(w,h)+1;
    this.grid.dims = [r,r];
    this.grid = new Grid(this.grid);
    this.ship = ship.disassemble(this.grid,this.instance);
    this.parts = ship.parts;
};

Viewer.prototype.clear = function(){
    this.parts = undefined;
    this.ship = undefined;
};


Viewer.prototype.render = function(ctx){
    this.grid.render(ctx);
    if(this.parts){
	this.parts.map(function (part){
	    part.render(ctx);
	    part._renderAttachmentPoints(ctx);
	});
    }
};

Viewer.prototype.update = function(du){};
