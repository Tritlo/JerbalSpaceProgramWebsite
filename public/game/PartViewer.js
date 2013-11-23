function PartViewer(descr){
    this.setup(descr);
    this.init();
};

PartViewer.prototype = new State();
PartViewer.prototype.init = function(){
    this.grid = new Grid(this.grid);
    this.loadPart(this.part);
};


PartViewer.prototype.loadPart = function(part){
    var part = new Part(part);
    this.part = part.toDesigner(this.grid);
};


PartViewer.prototype.render = function(ctx){
    this.grid.render(ctx);
    this.part.render(ctx);
    this.part._renderAttachmentPoints(ctx);
};
