function ShipDesigner(descr) {
    this.setup(descr);
    this.init();
};

ShipDesigner.prototype = new State();

ShipDesigner.prototype.init = function() {
    this.back = new Menu({
	"state" : this,
	"items" : [
        {
	    "text" : "Back",
	    "action" : function (state) {
		stateManager.switchState("menu");
		}
	    },
        ],
	"width" : 100,
	"height" : 100,
	"location" : [ g_canvas.width - 100, 0]
	});

    this.menu2 = new Menu({
	"state" : this,
	"items" : [
        {
	    "text" : "Echo Ship JSON",
	    "action" : function (state)
             {
                var ship = state.currentShip.assemble(state.grid);
                util.echoJSON(state.currentShip);
                state.currentShip.disassemble(state.grid);
		    }
	    },
	    {
	        "text" : "Add Selected Part",
		"action" : function(state){
		    state.addPart($("#in7").val());
		}
	    }
        ],
	"width" : 200,
	"height" : 100,
	"location" : [ 260, 0]
	});

    this.menu = new Menu({
	    "state" : this,
	    "items" : [
		{
		"text": "New Ship",
		"action" : function (state){
		    state.newShip();
		    }
		},
		{
		"text": "Save Ship",
		"action" : function (state){
		    state.saveShip();
		    },
		},
		{
		"text": "Load Ship",
		"action" : function (state){
		    state.loadShip();
		    },
		},
		{
		"text": "Clear Storage",
		"action" : function (state){
		    util.storageSave("ships",undefined);
		    $("#in9").empty();
		    console.log("ship storage cleared");
		    },
		}
	    ],
	    "width" : 100,
	    "height" : g_canvas.height*2,
	    "itemHeight" : 25,
		"location": [55,-g_canvas.height+70]
    });

    
    this.grid = new Grid({
	    "dims" : [32,32],
        "width" : 525,
        "height" : 525,
        "location": [375,375]
	});

    this.newShip();
    }

ShipDesigner.prototype.newShip = function ()
{
    this.currentShip = new Ship(
            {
            });
    this.addedParts = this.currentShip.parts;
}


ShipDesigner.prototype.addPart = function (partInd){
    var parts = util.storageLoad("parts");
    var part = new Part(parts[partInd]);
    this.heldPart = part.toDesigner(this.grid);
    if(this.addedParts){
		this.indexOfHeldPart = this.addedParts.length;
        this.addedParts.push(this.heldPart);
    } else {
        this.addedParts = [this.heldPart];
		this.indexOfHeldPart = 0;
    }
    console.log(part);
}



ShipDesigner.prototype.saveShip = function ()
{
    this.currentShip = new Ship({"parts"
    : this.addedParts,
    "name": $('#in5').val()
    });

    if(this.currentShip)
    {
        this.currentShip.assemble(this.grid);
        var ships = util.storageLoad("ship");
        if (ships){
            ships.push(this.currentShip);
        } else {
            ships = [this.currentShip];
            }
        util.storageSave("ships",ships);
        this.currentShip.disassemble(this.grid);
        var ships = util.storageLoad("ships");
        $("#in9").empty();
        if(ships)
        {
            $.each(ships, function (key,value) {
                $("#in9").append('<option value="'+key+'">'+value.name+'</option>');});
        }
    }
}

ShipDesigner.prototype.loadShip = function ()
{
    var ships = util.storageLoad("ships");
    var ship = new Ship(ships[$('#in9').val()]);
    var ship = ship.disassemble(this.grid);
    var gri = this.grid;
    this.addedParts = ship.parts;
}

ShipDesigner.prototype.onActivation = function ()
{
	$('#in9').show();
	$('#in5').show();
	$('#in7').show();
    var canvas_pos = util.findPos(g_canvas);
    var offsetFromMenu = 150;
    $('#in9').offset({top:canvas_pos.y + offsetFromMenu    , left: canvas_pos.x+5});
    $('#in5').offset({top:canvas_pos.y + offsetFromMenu +100, left: canvas_pos.x+5});
    $('#in7').offset({top:canvas_pos.y + offsetFromMenu +50, left: canvas_pos.x+5});
	$('#in5').val("");
	$('#in5').attr("placeholder","Ship Name");
    var ships = util.storageLoad("ships");
    if(ships)
    {
        $.each(ships, function (key,value) {
        $("#in9").append('<option value="'+key+'">'+value.name+'</option>');});
    }
    var parts = util.storageLoad("parts");
    if(parts){
        $.each(parts, function(key,value){
	    $("#in7").append('<option value="'+key+'">'+value.name+'</option>');
	});
    }
}

ShipDesigner.prototype.onDeactivation = function()
{
	$('#in9').hide();
	$('#in5').hide();
	$('#in7').hide();
	$('#in9').empty();
	$('#in7').empty();
}

//RENDER
//=====


ShipDesigner.prototype.render = function(ctx) {
    this.menu.render(ctx);
    this.menu2.render(ctx);
    this.back.render(ctx);
    this.grid.render(ctx);
    if(this.addedParts){
        this.addedParts.map(function (part) {
	    part.render(ctx);
            part._renderAttachmentPoints(ctx);
	    });
        if(this.heldPart && !this.heldPart.attached){
            this.heldPart._renderHitbox(ctx);
        }
    }
    if (this.currentShip)
    {
        //this.currentShip.render(ctx);
    }
};

ShipDesigner.prototype.update = function (du) {
	this.currentShip.name   = $('#in5').val();
};

ShipDesigner.prototype.handleMenus = function(evt,type){
    var pos = util.findPos(g_canvas);
    g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
    if (this.menu.inMenu(g_mouse[0],g_mouse[1])){
        this.menu.handleMouse(evt,type);
        return true;
	}
    else if (this.back.inMenu(g_mouse[0],g_mouse[1])){
        this.back.handleMouse(evt,type);
        return true;
	    }
    else if (this.menu2.inMenu(g_mouse[0],g_mouse[1])){
        this.menu2.handleMouse(evt,type);
        return true;
	    }
    else {
        return false;
    }
}

ShipDesigner.prototype.handleDown = function(evt,type) {
        if(evt.button === 0) {
            if(this.addedParts)
            {
                var pos = util.findPos(g_canvas);
                g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
				for(var i = 0; i < this.addedParts.length; i++){
				   var p = this.addedParts[i];
				   if(util.circInBox(g_mouse[0],g_mouse[1],
					  0, p.hitBox[0], p.hitBox[1])){
					  this.heldPart = p;
				      this.indexOfHeldPart = i;
					  break;
					  }
		}
                this.editing = true;
            }
        } else if (evt.button === 2) {
	    	if(this.heldPart && !(this.heldPart.attached || this.indexOfHeldPart === 0)){
				this.addedParts.splice(this.indexOfHeldPart,1)
				this.indexOfHeldPart = -1;
			}
			this.heldPart = undefined;
            if(this.editing){
                this.editing = false;
            }
        }
}

ShipDesigner.prototype.handleMouse = function (evt,type) {
    var pos = util.findPos(g_canvas);
    g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
    if(this.handleMenus(evt,type)){
        return true;
    }
	this.closest = this.grid.findNearestPoint(g_mouse[0],g_mouse[1]);
	this.closestPoint = this.grid.points[this.closest[0]][this.closest[1]]
    if (type === "down") {
        this.handleDown(evt,type);
    } else if (type === "move") {
        if(this.heldPart){
	    	var newC = util.vecMinus(this.closestPoint, this.heldPart.gridCenterOffset);
	    	this.heldPart.updateCenter(newC);
			this.heldPart.attached = false;
			for(var i = 0; i < this.addedParts.length; i++){
				if (i === this.indexOfHeldPart)
					continue;
				if (this.heldPart.isAttachedTo(this.addedParts[i])){
					this.heldPart.attached = true;
				}
			}
			
        }
    } 
};

var shipDesigner = new ShipDesigner()
