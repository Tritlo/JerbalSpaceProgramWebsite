function MainMenu(instance,descr){
    this.setup(instance,descr);
}

MainMenu.prototype = new State();

MainMenu.prototype.render = function (ctx){
	this.menu.render(ctx);
	};

MainMenu.prototype.handleMouse = function(evt,type) {
    this.menu.handleMouse(evt,type);
};
MainMenu.prototype.update =  function(du) {
    this.menu.update(du);
};
MainMenu.prototype.init =  function () {
	this.menu = new Menu( this.instance,{
	"state" : this,
	"title" : "JERBAL SPACE PROGRAM",
	"items": [ {
		"text": "Quick Start",
		"state" : "simulation"
		},
		{ "text": "Part Design",
		  "state" : "partsDesigner"
		},
		{ "text": "Ship Design",
		  "state" : "shipDesigner"
		}
	],
	    "location": [this.instance.canvas.width/2,0],
	"titleHeight" : 50,
	"itemHeight" : 42,
	"width" : this.instance.canvas.width,
	"height" :this.instance.canvas.height,
	"margin_bottom" : 5,
	"onSelected" : function (item) {
	     this.instance.stateManager.switchState(item.state);
	}
	});
	};
