function PartsDesigner(descr) {
    this.setup(descr);
};

PartsDesigner.prototype = new State();

PartsDesigner.prototype.menu = new Menu({
        "title" : "HEYHEY",
        "items" : [ {
            "text": "New Part",
            "action" : "newPart",
        }, {"text" : "hey"}],
        "width" : 300,
        "height" : 500,
        "itemHeight" : 25,
        "location": [g_canvas.width/2,50],
        "onSelected" : function (item) {
            this[item.action];
        }
});
PartsDesigner.prototype.render = function(ctx) {
    this.menu.render(ctx);

};

PartsDesigner.prototype.update = function (du) {
};

PartsDesigner.prototype.handleMouse = function (evt,type) {
    this.menu.handleMouse(evt,type);
};

var partsDesigner = new PartsDesigner();
