function PartsDesigner(descr) {
    this.setup(descr);
    this.init();
};



PartsDesigner.prototype = new State();

PartsDesigner.prototype.init = function() {
    this.menu = new Menu({
	    "state" : this,
	    "items" : [
		{
		"text": "New Part",
		"action" : function (state){
		    state.newPart();
		    }
		},
		{
		"text": "Save Part",
		"action" : function (state){
		    state.savePart();
		    },
		},
		{
		"text": "Set Flame",
		"action" : function (state){
		    state.setFlame();
		    },
		},
		
		
	    ],
	    "width" : 100,
	    "height" : g_canvas.height*2,
	    "itemHeight" : 25,
		"location": [55,-g_canvas.height+60]
    });

    
    this.grid = new Grid({
	"dims" : [32,32],
        "width" : 525,
        "height" : 525,
        "location": [375,375],
	});

    }

PartsDesigner.prototype.newPart = function () {
    console.log("new part");
    console.log(this.currentPart);
    $('#in1').val("");
    $('#in2').val("");
    $('#in3').val("");
    $('#in4').val("");
    $('#in5').val("");
    $('#in6').val("#00ff00");
    this.currentPart = new Part({
        "stroke" : "lime",
        "lineWidth" : 4,
    });
    }

PartsDesigner.prototype.setFlame = function () {
    }

PartsDesigner.prototype.savePart = function () {
    if(this.currentPart){
	console.log(this.currentPart);
	}
    }

PartsDesigner.prototype.onActivation = function () {
    $('#in1').show();
    $('#in2').show();
    $('#in3').show();
    $('#in4').show();
    $('#in5').show();
    $('#in6').show();
    $('#in7').show();
    var canvas_pos = util.findPos(g_canvas);
    var offsetFromMenu = 50;
    $('#in7').offset({top:canvas_pos.y + offsetFromMenu+100, left: canvas_pos.x});
    $('#in6').offset({top:canvas_pos.y + offsetFromMenu+150, left: canvas_pos.x});
    $('#in5').offset({top:canvas_pos.y + offsetFromMenu+200, left: canvas_pos.x});
    $('#in4').offset({top:canvas_pos.y + offsetFromMenu+250, left: canvas_pos.x});
    $('#in3').offset({top:canvas_pos.y + offsetFromMenu+300, left: canvas_pos.x});
    $('#in2').offset({top:canvas_pos.y + offsetFromMenu+350, left: canvas_pos.x});
    $('#in1').offset({top:canvas_pos.y + offsetFromMenu+400, left: canvas_pos.x});
    $('#in5').attr("placeholder","Part Name");
    $('#in4').attr("placeholder","Mass");
    $('#in4').get(0).type = "number";
    $('#in4').attr("step","0.1");
    $('#in3').attr("placeholder","Fuel");
    $('#in3').get(0).type = "number";
    $('#in3').attr("step","10");
    $('#in2').attr("placeholder","Thrust");
    $('#in2').get(0).type = "number";
    $('#in2').attr("step","0.1");
    $('#in1').attr("placeholder","Efficiency");
    $('#in1').get(0).type = "number";
    $('#in1').attr("step","0.1");
    $('#in6').val("#00ff00");
    $('#in7').val("Type");
    var pseudoPart = new Part();
    $.each(pseudoPart.types, function (key,value) {
    $("#in7").append('<option value="'+value+'">'+value+'</option>');});
    
    }

PartsDesigner.prototype.onDeactivation = function() {
    $('#in1').hide();
    $('#in2').hide();
    $('#in3').hide();
    $('#in4').hide();
    $('#in5').hide();
    $('#in6').hide();
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
        ctx.strokeStyle = "#aaaaff"
        util.strokeCircle(ctx,p[0],p[1],10);
        ctx.restore();
	}
    if (this.currentPart) {
        this.currentPart.render(ctx);
    }
};

PartsDesigner.prototype.update = function (du) {
    if (this.currentPart){
	this.currentPart.stroke = $('#in6').val();
	this.currentPart.name   = $('#in5').val();
	this.currentPart.mass   = parseFloat($('#in4').val());
	this.currentPart.fuel   = parseFloat($('#in3').val());
	this.currentPart.thrust = parseFloat($('#in3').val());
	this.currentPart.type   = $('#in7').val();
	}
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
