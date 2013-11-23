function Viewer(descr){
    this.setup(descr);
    this.init();
};

Viewer.prototype = new State();

Viewer.prototype.init = function(){
    this.grid = new Grid(this.grid);
};


Viewer.prototype.loadPart = function(part){
    var part = new Part(part);
    this.parts = [part.toDesigner(this.grid)];
};

Viewer.prototype.loadShip = function(ship){
    var ship = new Ship(ship);
    this.ship = ship.disassemble(this.grid);
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

Viewer = new Viewer({
    grid: {
	"dims" : [64,64],
        "width" : 300,
        "height" : 300,
        "location": [150,150]
	}
    });
