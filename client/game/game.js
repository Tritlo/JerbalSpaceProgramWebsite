Template.game.rendered = function() {
    start("JSP",{canvasID: "JSPCanvas", clear: false, instanceOptions: {local: true}});
};

Template.game.destroyed = function(){
    InstanceManager.clear();
};
