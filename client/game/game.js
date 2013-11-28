Template.game.rendered = function() {
    start("JSP",{canvasID: "JSPCanvas", clear: false});
};

Template.game.destroyed = function(){
    InstanceManager.clear();
};
