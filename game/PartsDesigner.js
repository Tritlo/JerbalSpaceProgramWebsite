function PartsDesigner(descr) {
    this.setup(descr);
    this.init();
};



PartsDesigner.prototype = new State();

PartsDesigner.prototype.init = function() {
    this.back = new Menu({
	"state" : this,
	"items" : [{
	    "text" : "Back",
	    "action" : function (state) {
		stateManager.switchState("menu");
		}
	    }],
	"width" : 50,
	"height" : 25,
	"location" : [ g_canvas.width - 50, 25]
	});
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
		"text": "Load Part",
		"action" : function (state){
		    state.loadPart();
		    },
		},
		{
		"text": "Clear Storage",
		"action" : function (state){
		    util.storageSave("parts",null);
		    $("#in9").empty();
		    console.log("parts storage cleared");
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
		"location": [55,-g_canvas.height+85]
    });

    
    this.grid = new Grid({
	"dims" : [32,32],
        "width" : 525,
        "height" : 525,
        "location": [375,375],
	});

    this.newPart();
    }

PartsDesigner.prototype.newPart = function () {
    console.log("new part");
    console.log(this.currentPart);
    console.log("old parts");
    console.log(util.storageLoad("parts"));
    $('#in1').val("");
    $('#in2').val("");
    $('#in3').val("");
    $('#in4').val("");
    $('#in5').val("");
    $('#in6').val("#00ff00");
    $('#in8').val("#000000");
    this.flame = undefined;
    this.currentPart = new Part({
        "stroke" : "lime",
        "lineWidth" : 4,
	"currentThrust" : 0.2
    });
    }

PartsDesigner.prototype.setFlame = function () {
    if(this.editing){
	this.editing = false;
	this.currentPart.outline.pop();
	}
    this.currentPart.currentThrust = this.currentPart.thrust;
    this.flameSet = false;
    this.flame = [];
    }

PartsDesigner.prototype.savePart = function () {
    if(this.currentPart){
	this.currentPart.finalize();
	var parts = util.storageLoad("parts");
	if (parts){
	    parts.push(this.currentPart);
	} else {
	    parts = [this.currentPart];
	    }
	util.storageSave("parts",parts);
	var parts = util.storageLoad("parts");
	$("#in9").empty();
	$.each(parts, function (key,value) {
	    $("#in9").append('<option value="'+key+'">'+value.name+'</option>');});
	}
    }

PartsDesigner.prototype.loadPart = function () {
    var parts = util.storageLoad("parts");
    this.currentPart = new Part(parts[$('#in9').val()]);
    if (this.currentPart){
	$('#in8').val(this.currentPart.fill);
	$('#in7').val(this.currentPart.type);
	$('#in6').val(this.currentPart.stroke);
	$('#in5').val(this.currentPart.name);
	$('#in4').val(this.currentPart.mass);
	$('#in3').val(this.currentPart.fuel);
	$('#in2').val(this.currentPart.thrust);
	$('#in1').val(this.currentPart.efficiency);
	} else this.newPart();
    
    }

PartsDesigner.prototype.onActivation = function () {
    for(var i = 1; i < 10; i++){
	$('#in'+i).show();
	}
    var canvas_pos = util.findPos(g_canvas);
    var offsetFromMenu = 150;
    $('#in9').offset({top:canvas_pos.y + offsetFromMenu, left: canvas_pos.x});
    $('#in8').offset({top:canvas_pos.y + offsetFromMenu+150, left: canvas_pos.x});
    $('#in7').offset({top:canvas_pos.y + offsetFromMenu+100, left: canvas_pos.x});
    $('#in6').offset({top:canvas_pos.y + offsetFromMenu+200, left: canvas_pos.x});
    $('#in5').offset({top:canvas_pos.y + offsetFromMenu+250, left: canvas_pos.x});
    $('#in4').offset({top:canvas_pos.y + offsetFromMenu+300, left: canvas_pos.x});
    $('#in3').offset({top:canvas_pos.y + offsetFromMenu+350, left: canvas_pos.x});
    $('#in2').offset({top:canvas_pos.y + offsetFromMenu+400, left: canvas_pos.x});
    $('#in1').offset({top:canvas_pos.y + offsetFromMenu+450, left: canvas_pos.x});
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
    $('#in8').val("#000000");
    var pseudoPart = new Part();
    $.each(pseudoPart.types, function (key,value) {
	$("#in7").append('<option value="'+value+'">'+value+'</option>');});
    var parts = util.storageLoad("parts");
    $.each(parts, function (key,value) {
	$("#in9").append('<option value="'+key+'">'+value.name+'</option>');});
    }

PartsDesigner.prototype.onDeactivation = function() {
    for(var i = 1; i < 10; i++){
	$('#in'+i).hide();
	}
    //this.currentPart = undefined;
	    
    }

PartsDesigner.prototype.render = function(ctx) {
    this.menu.render(ctx);
    this.back.render(ctx);
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
    if(this.flame){
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ff0000"
	for(var i = 0; i< this.flame.length; i++){
            util.strokeCircle(ctx,this.flame[i][0],this.flame[i][1],5);
	    }
        ctx.restore();
	
	}
    if (this.currentPart) {
        this.currentPart.render(ctx);
    }
};

PartsDesigner.prototype.update = function (du) {
    if (this.currentPart){
	this.currentPart.stroke = $('#in6').val();
	if ($('#in8').val() != "#000000"){
	    this.currentPart.fill   = $('#in8').val() ;
	    } else {
	    this.currentPart.fill   = undefined;
		}
	this.currentPart.name   = $('#in5').val();
	this.currentPart.mass   = parseFloat($('#in4').val());
	this.currentPart.fuel   = parseFloat($('#in3').val());
	this.currentPart.efficiency   = parseFloat($('#in1').val());
	this.currentPart.thrust = parseFloat($('#in2').val());
	this.currentPart.type   = $('#in7').val();
	
	if(this.flame && this.flame.length === 3 && !this.flameSet) {
	    this.currentPart.setFlame(this.flame);
	    this.flameSet = true;
	}
    }
};

PartsDesigner.prototype.handleMouse = function (evt,type) {
    var pos = util.findPos(g_canvas);
    g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
    if (this.menu.inMenu(g_mouse[0],g_mouse[1])){
	this.menu.handleMouse(evt,type);
	} else if (this.back.inMenu(g_mouse[0],g_mouse[1])){
	this.back.handleMouse(evt,type);
	    }
    else {
	this.closest = this.grid.findNearestPoint(g_mouse[0],g_mouse[1]);
	this.closestPoint = this.grid.points[this.closest[0]][this.closest[1]]

    if (type === "down") {
        if(evt.button === 0){
            if(this.currentPart) {
		if (this.flame && this.flame.length < 3){
		    this.flame.push(this.closestPoint);
		} else {
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
            }
        } else if (evt.button === 2) {
	    if(this.editing){
		this.editing = false;
		this.currentPart.outline.pop();
		}
        }
    } else if (type === "move") {
        if (this.editing && this.currentPart) {
            this.currentPart.setLastPoint(this.closestPoint);
        }
    } 

	}
};

var partsDesigner = new PartsDesigner();
