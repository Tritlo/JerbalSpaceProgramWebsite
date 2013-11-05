// GENERIC RENDERING


var g_frameCounter = 1;

function render(ctx) {
    
    // Process various option toggles
    if(g_settings.enableDebug) {
        if (eatKey(g_settings.debugKeys.KEY_TOGGLE_CLEAR)) g_settings.doClear = !g_settings.doClear;
        if (eatKey(g_settings.debugKeys.KEY_TOGGLE_BOX)) g_settings.doBox = !g_settings.doBox;
        if (eatKey(g_settings.debugKeys.KEY_TOGGLE_UNDO_BOX)) g_settings.undoBox = !g_settings.undoBox;
        if (eatKey(g_settings.debugKeys.KEY_TOGGLE_FLIPFLOP)) g_settings.doFlipFlop = !g_settings.doFlipFlop;
        if (eatKey(g_settings.debugKeys.KEY_TOGGLE_RENDER)) g_settings.doRender = !g_settings.doRender;
    }
    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //
    if (g_settings.doClear) util.clearCanvas(ctx);
    
    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //
    if (g_settings.doBox) util.fillBox(ctx, 200, 200, 50, 50, "red");
    
    
    // The core rendering of the actual game / simulation
    //
    if (g_settings.doRender) renderSimulation(ctx);
    
    
    // This flip-flip mechanism illustrates the pattern of alternation
    // between frames, which provides a crude illustration of whether
    // we are running "in sync" with the display refresh rate.
    //
    // e.g. in pathological cases, we might only see the "even" frames.
    //
    if (g_settings.doFlipFlop) {
        var boxX = 250,
            boxY = g_settings.isUpdateOdd ? 100 : 200;
        
        // Draw flip-flop box
        util.fillBox(ctx, boxX, boxY, 50, 50, "green");
        
        // Display the current frame-counter in the box...
        ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
        // ..and its odd/even status too
        var text = g_frameCounter % 2 ? "odd" : "even";
        ctx.fillText(text, boxX + 10, boxY + 40);
    }
    
    // Optional erasure of diagnostic "box",
    // to illustrate flicker-proof double-buffering
    //
    if (g_settings.undoBox) ctx.clearRect(200, 200, 50, 50);
    
    ++g_frameCounter;
}
