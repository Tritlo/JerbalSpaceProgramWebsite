    var Stars = {
// Maximum parallax, affects render and genration radius
_maxPar: 5,
// The size of each render/generation block. Think Minecraft.
_blockSize: {x: g_canvas.width, y: g_canvas.height},
// The Level dayd whether a star is genearated or not,
// the more you zoom out, the fewer levels are rendered.
_maxLevel: 256,
// Stars per Block
_STpBL: {min: 30, max: 80},
// An Array containing the blocks
_blocks: [],
// The radius in which to render blocks around the
// camera center.
_rad: 0,
// Are we too zoomed out to afford rendering the stars?
_tooHeavy: false,

// Initialize the Starfield.
init: function(properties){
    var keys = Object.keys(properties);
    for(var i = 0; i<keys.length;i++){
        this[keys[i]] = properties[keys[i]];
    }
},

// Generate any Stars I might render
update: function(du){
    this._tooHeavy = entityManager.cameraZoom < 0.05;
    if(this._tooHeavy) return;
    var os = entityManager.trueOffset;
    //console.log("update: " + os);
    var bl = this._posToBlock(os[0],os[1]);
    this._rad=Math.floor(this._maxPar/(entityManager.cameraZoom*Math.sqrt(2)))+1;
    //this._rad=2;
    for(var i = bl[0]-this._rad; i <= bl[0]+this._rad; i++){
        for(var j = bl[1]-this._rad; j <= bl[1]+this._rad; j++){
	    this._maybeGenerateBlock(i,j);
	}
    }
},

// How many levels of Stars should I render bassed on the current
// zoom.
_getBlockLevel: function(zoom){
    var sp = 1/this._maxLevel;
    for(var i = 0; i < this._maxLevel; i++){
        if(zoom < Math.sqrt(sp*(i+1))) return i;
    }
    return this._maxLevel-1;
},

// Random block level for star generation
_getRandomBlockLevel: function(){
    return Math.floor(Math.random()*this._maxLevel);
},

// If the block does not exist yet, generate it
_maybeGenerateBlock: function(i,j){
    if(this._blocks[i] && this._blocks[i][j]) return;
    if(!this._blocks[i]) this._blocks[i] = [];
    //console.log(i,j);
    var newBlock = [];
    for(var h = 0; h < this._maxLevel; h++){
        newBlock.push([]);
    }
    var numStars = util.randRange(this._STpBL.min/this._maxPar,this._STpBL.max/this._maxPar);
    // generate the stars for the block
    for(var k = 0; k < numStars; k++){
        var x = util.randRange((i)*this._blockSize.x,(i+1)*this._blockSize.x);
        var y = util.randRange((j)*this._blockSize.y,(j+1)*this._blockSize.y);
	var p = util.randRange(1,this._maxPar);
        var newStar = {x: x, y: y, p: p};
	var l = this._getRandomBlockLevel();
        newBlock[l].push(newStar);
    }
    //console.log(this._blocks[i] + " " + i);
    this._blocks[i][j] = newBlock;
    //console.log(i,j,this._blocks[i][j]);
},

// I wonder what this does.
// Only renders Stars in close proximity to the camera
// center, based on zoom.
render: function(ctx){
    if(this._tooHeavy) return;
    var os = entityManager.trueOffset;
    //console.log("render: " + os);
    var bl = this._posToBlock(os[0],os[1]);
    //util.fillCircle(ctx,-os[0],-os[1],10);
    for(var i = bl[0]-this._rad; i <= bl[0]+this._rad; i++){
        for(var j = bl[1]-this._rad; j <= bl[1]+this._rad; j++){
	    //console.log(i,j);
	    this._renderBlock(ctx,i,j);
	}
    }
},

// How to the stars elongate when going fast
_starTween: function(x,y){
    if(entityManager.lockCamera) return {x:0,y:0};
    var speed = Math.sqrt(x*x + y*y);
    var angle = Math.atan2(y,x);
    var newSpeed = Math.atan((Math.max(speed-15,0))/600)*650;
    return {x: Math.cos(angle)*newSpeed, y: Math.sin(angle)*newSpeed};
},

// Change the position of the Star's rendering
// based on it's Parallax level. Creates the 3D effect in
// the starfield. Requires rendering more blocks.
_applyParallax: function(os,x,y,p){
    var ox = -os[0] + g_canvas.width/2;
    var oy = -os[1] + g_canvas.width/2;
    var dx = x-ox;
    var dy = y-oy;
    dx = dx/p;
    dy = dy/p;
    //console.log("y: "+y+" ny: "+(os[1]+dy)+" os: "+os[1]);
    return {x: ox+dx, y: oy+dy};
},

// Renders a random star. If not the star described,
// destroys the universe.
// (seriously though, just renders the star described))
_renderStar: function(ctx,x,y,p,l){
    var s = entityManager.getMainShip();
    
    var os = entityManager.trueOffset;
    var pos = this._applyParallax(os,x,y,p);//entityManager.cameraZoom < 0.6?{x:x,y:y}:this._applyParallax(os,x,y,p);
    var x0 = pos.x;
    var y0 = pos.y;
    
    var addedSpeed = this._starTween(s.velX,s.velY);
    var x1 = x0 + addedSpeed.x;
    var y1 = y0 + addedSpeed.y;
    ctx.save();
    ctx.fillStyle="white";
    ctx.strokeStyle="white";
    var r = Math.sqrt(this._maxLevel/(l+1))/2;
    util.fillCircle(ctx,x0,y0,r);
    util.fillCircle(ctx,x1,y1,r);
    ctx.lineWidth=2*r;
    util.drawLine(ctx,x0,y0,x1,y1);
    ctx.restore();
},

// Renders block number i,j
_renderBlock: function(ctx,i,j){
    //console.log(i,j,this._blocks[i][j]);
    if(!(this._blocks[i] && this._blocks[i][j])) return;
    //console.log(i,j);
    var level = this._getBlockLevel(entityManager.cameraZoom);
    for(var l = 0; l <= level; l++){
        var block = this._blocks[i][j][l];
        for(var k = 0; k < block.length;k++){
            this._renderStar(ctx,block[k].x,block[k].y,block[k].p,l);
        }
    }
},

// returns the block coordinates of (x,y), i.e., inside what block
// is (x,y)
_posToBlock: function(x,y){
    var bx = -Math.floor(x/this._blockSize.x-1/2)-1;
    var by = -Math.floor(y/this._blockSize.y-1/2)-1;
    return [bx,by];
},
};
