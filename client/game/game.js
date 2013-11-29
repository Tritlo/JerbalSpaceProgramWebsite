//Here we start the game on the given canvas, with local play enabled.
Template.game.rendered = function() {
    start("JSP",{canvasID: "JSPCanvas", clear: true, instanceOptions: {local: true}});
};

Template.game.destroyed = function(){
    InstanceManager.clear();
};
