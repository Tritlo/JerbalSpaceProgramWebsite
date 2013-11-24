function MainMenu(descr){
    this.setup(descr);
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
	this.menu = new Menu({
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
	    "location": [g_canvas.width/2,0],
	"titleHeight" : 50,
	"itemHeight" : 42,
	"width" : g_canvas.width,
	"height" : g_canvas.height,
	"margin_bottom" : 5,
	"onSelected" : function (item) {
	     stateManager.switchState(item.state);
	}
	});
	};

var mainMenu = new MainMenu();
