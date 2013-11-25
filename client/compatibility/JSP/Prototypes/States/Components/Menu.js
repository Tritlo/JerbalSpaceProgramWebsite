function MenuItem(descr,instance) {
    this.setup(descr,instance);
};
MenuItem.prototype.setup = function (descr,instance) {
    this.instance = instance;
    for (var property in descr) {
        this[property] = descr[property];
    }
};

MenuItem.prototype.hitBox = false;
MenuItem.prototype.selected = false;


function Menu(instance,descr) {
    this.setup(instance,descr);
};

Menu.prototype.setup = function (instance,descr) {
    this.instance = instance;
    for (var property in descr) {
        this[property] = descr[property];
    }
};

Menu.prototype.inMenu = function(x,y) {
     return (this.initialized &&  util.circInBox(x,y,0,this.hitBox[0],this.hitBox[1]));
};
    
    

Menu.prototype.titleHeight = 50;
Menu.prototype.itemHeight = 25;
Menu.prototype.margin_bottom = 5;

//Must take in context to compute properties
Menu.prototype.init = function (ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = this.itemHeight+"px " +this.font;
    var offsetFromTitle = this.height/2 - (this.itemHeight + this.margin_bottom)*this.items.length/2;
    ctx.textBaseline = "middle";
    for(var i = 0; i < this.items.length; i++){
        this.items[i] = new MenuItem(this.items[i]);
        this.items[i].location = [this.location[0],this.location[1] + offsetFromTitle + i*(this.itemHeight + this.margin_bottom)];
        var wiOText = ctx.measureText(this.items[i].text).width
        this.items[i].width = wiOText < this.width ? wiOText : this.width;
        var loc = this.items[i].location;
        var w = this.items[i].width
        var h = this.itemHeight;
        this.items[i].hitBox = [[loc[0]-w/2,loc[1]-h/2],[loc[0]+w/2,loc[1]+h/2]];
    }
    ctx.restore();

    this.hitBox = [[this.location[0] - this.width/2, this.location[1]], [this.location[0]+this.width/2, this.location[1]+this.height]];
    this.initialized = true;
};

Menu.prototype.initialized = false;

Menu.prototype.items = [];

Menu.prototype.fill = "lime";
Menu.prototype.stroke = "lime";
Menu.prototype.font = "VT323";
Menu.prototype.height = 0;
Menu.prototype.width = 0;

Menu.prototype.render = function(ctx) {
        if (!this.initialized) { this.init(ctx);}
        ctx.save();
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        if(this.title){
            ctx.font = this.titleHeight+"px " +this.font;
            ctx.fillText(this.title, this.location[0],this.location[1],this.width);
        }
        ctx.font = this.itemHeight+"px " +this.font;
        ctx.textBaseline = "middle";
        for(var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var loc = item.location;
            var w = item.width;
            var h = this.itemHeight;
            ctx.fillText(item.text,loc[0],loc[1],this.width);
            if (item.selected) {
                util.strokeBox(ctx,item.hitBox[0][0],item.hitBox[0][1],w,h);
            }
        }
        if(g_settings.enableDebug) util.strokeBox(ctx,this.hitBox[0][0],this.hitBox[0][1],this.width,this.height);
        ctx.restore();
    };



Menu.prototype.update = function (du) {
};

Menu.prototype.onSelected = function (item) {
    item.action(this.state);
};

Menu.prototype.handleMouse = function (evt, type) {
	var pos = util.findPos(this.instance.canvas);
	var g_mouse = [evt.clientX - pos.x,evt.clientY - pos.y];
        if (this.inMenu(g_mouse[0],g_mouse[1])){
            if (type === "down"){

            } else if (type === "move") {
                for (var i = 0; i < this.items.length; i++){
                    var item = this.items[i];
                    item.selected = false;
                    if (util.circInBox(g_mouse[0],g_mouse[1],0,item.hitBox[0],item.hitBox[1])) {
                        item.selected = true;
                    }
                }
            } else if (type === "up") {
                for (var i = 0; i < this.items.length; i++){
                    var item = this.items[i];
                    if (item.selected){
                        this.onSelected(item);
                        break;
                    }
                }
            }
	    }
};

			    
