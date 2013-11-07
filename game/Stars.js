var Stars = {

_blockSize: {x: g_canvas.width*2, y: g_canvas.height*2},

_STpBL: {min: 50, max: 100},

_blocks: [],

update: function(du){
    var s = entityManager.getMainShip();
    var bl = this._posToBlock(s.cx,s.cy);
    for(var i = bl[0]-1; i <= bl[0]+1; i++){
        for(var j = bl[1]-1; j <= bl[1]+1; j++){
	    this._maybeGenerateBlock(i,j);
	}
    }
},

_maybeGenerateBlock: function(i,j){
    if(this._blocks[i] && this._blocks[i][j]) return;
    if(!this._blocks[i]) this._blocks[i] = [];
    var newBlock = [];
    var numStars = util.randRange(this._STpBL.min,this._STpBL.max);
    for(var k = 0; k < numStars; k++){
        var x = util.randRange(i*this._blockSize.x,(i+1)*this._blockSize.x);
        var y = util.randRange(j*this._blockSize.y,(j+1)*this._blockSize.y);
        var newStar = {x: x, y: y};
        newBlock.push(newStar);
    }
    //console.log(this._blocks[i] + " " + i);
    this._blocks[i][j] = newBlock;
},

render: function(ctx){
    var s = entityManager.getMainShip();
    var bl = this._posToBlock(s.cx,s.cy);
    for(var i = bl[0]-1; i <= bl[0]+1; i++){
        for(var j = bl[1]-1; j <= bl[1]+1; j++){
	    this._renderBlock(ctx,this._blocks[i][j]);
	}
    }
},

_starTween: function(x,y){
    var speed = Math.sqrt(x*x + y*y);
    var angle = Math.atan2(y,x);
    var newSpeed = Math.atan((Math.max(speed-15,0))/20)*100;
    return {x: Math.cos(angle)*newSpeed, y: Math.sin(angle)*newSpeed};
},

_renderStar: function(ctx,x,y){
    var s = entityManager.getMainShip();
    var addedSpeed = this._starTween(s.velX,s.velY);
    var x1 = x + addedSpeed.x;
    var y1 = y + addedSpeed.y;
    ctx.save();
    ctx.fillStyle="white";
    ctx.strokeStyle="white";
    util.fillCircle(ctx,x,y,2);
    util.fillCircle(ctx,x1,y1,2);
    ctx.lineWidth=4;
    util.drawLine(ctx,x,y,x1,y1);
    ctx.restore();
},


_renderBlock: function(ctx,block){
    if(!block) return;
    for(var i = 0; i < block.length;i++){
        this._renderStar(ctx,block[i].x,block[i].y);
    }
},

_posToBlock: function(x,y){
    var bx = Math.floor(x/this._blockSize.x);
    var by = Math.floor(y/this._blockSize.y);
    return [bx,by];
},
};
