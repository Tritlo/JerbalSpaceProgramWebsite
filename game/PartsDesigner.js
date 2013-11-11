function PartsDesigner(descr) {
    this.setup(descr);
    this.init();
};



PartsDesigner.prototype = new State();

PartsDesigner.prototype.init = function() {
    this.menu = new Menu({
	    "state" : this,
	    "items" : [ {
		"text": "New Part",
		"action" : function (state){
		    state.newPart();
		    }
	    }],
	    "width" : 100,
	    "height" : 50,
	    "itemHeight" : 25,
	    "location": [50,0]
    });

    
    this.grid = new Grid({
	"dims" : [50,50],
        "width" : 600,
        "height" : 600,
        "location": [350,350],
	});

    }

PartsDesigner.prototype.newPart = undefined;

PartsDesigner.prototype.newPart = function () {
    console.log("new part");
    console.log(this.currentPart);
    this.currentPart = new Part({
        "stroke" : "white",
        "lineWidth" : 4,
    });
    }


PartsDesigner.prototype.render = function(ctx) {
    this.menu.render(ctx);
    this.grid.render(ctx);
    if (this.closest) {
        var i = this.closest[0];
        var j = this.closest[1];
        var p = this.grid.points[i][j];
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime";
        util.strokeCircle(ctx,p[0],p[1],10);
        ctx.restore();
	}
    if (this.currentPart) {
        this.currentPart.render(ctx);
    }
};

PartsDesigner.prototype.update = function (du) {
};

PartsDesigner.prototype.handleMouse = function (evt,type) {
    var pos = util.findPos(g_canvas);
    g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
    if (this.menu.inMenu(g_mouse[0],g_mouse[1])){
	this.menu.handleMouse(evt,type);
	}
    else {
	this.closest = this.grid.findNearestPoint(g_mouse[0],g_mouse[1]);
	this.closestPoint = this.grid.points[this.closest[0]][this.closest[1]]

    if (type === "down") {
        if(evt.button === 0){
            if(this.currentPart) {
                if(!(this.currentPart.outline)){
                    this.currentPart.addPoint(this.closestPoint);
                    this.currentPart.addPoint(this.closestPoint);
                } else if (!this.editing) {
                    if(util.inList(this.currentPart.outline,this.closestPoint)){
                        this.currentPart.rotate(this.closestPoint);
                        this.currentPart.setLastPoint(this.closestPoint);
                    }
                } else {
                    this.currentPart.addPoint(this.closestPoint);
                }
                this.editing = true;
            }
        } else if (evt.button === 2) {
            this.editing = false;
            this.currentPart.outline.pop();
        }
    } else if (type === "move") {
        if (this.editing && this.currentPart) {
            this.currentPart.setLastPoint(this.closestPoint);
        }
    } 

	}
};

var partsDesigner = new PartsDesigner();
