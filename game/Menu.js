function Menu(descr) {
    this.setup(descr);
};

Menu.prototype = new State();

Menu.prototype.items = [];

Menu.prototype.render = function(ctx) {
        ctx.save();
        ctx.fillStyle = "lime";
        ctx.strokeStyle = "lime";
        ctx.textAlign ="center";
        ctx.textBaseline = "top";
        var h = 50;
        ctx.font = h+"px Quantico";
        ctx.fillText("JERBAL SPACE PROGRAM", g_canvas.width/2,0);
        ctx.textBaseline = "middle";
        for(var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var loc = item.location;
            var w = ctx.measureText(item.text).width;
            ctx.fillText(item.text,loc[0],loc[1] );
            if (!item.hitBox) {
                item.hitBox = [[loc[0]-w/2,loc[1]-h/2],[loc[0]+w/2,loc[1]+w/2]];
            }
            if (item.selected) {
                util.strokeBox(ctx,item.hitBox[0][0],item.hitBox[0][1],w,h);
            }
        }
        ctx.stroke();
        ctx.restore();
    };



Menu.prototype.update = function (du) {
};

Menu.prototype.handleMouse = function (evt, type) {
        if (type === "down"){
        } else if (type === "move") {
            var pos = util.findPos(g_canvas);
            g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
            for (var i = 0; i < this.items.length; i++){
                var item = this.items[i];
                item.selected = false;
                if (util.circInBox(g_mouse[0],g_mouse[1],1,item.hitBox[0],item.hitBox[1])) {
                    item.selected = true;
                }
            }
        } else if (type === "up") {
            for (var i = 0; i < this.items.length; i++){
                var item = this.items[i];
                if (item.selected){
                    stateManager.switchState(item.state);
                    break;
                }
            }
        }
};

var mainMenu = new Menu({
    "items": [ {
	    "text": "Start",
	    "location": [g_canvas.width/2,g_canvas.height/2],
	    "hitBox" : false, //Set on render as dependent on measureText
	    "state" : "mainSimulation",
	    "selected" : false
	}]
    }
);
