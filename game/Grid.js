function Grid(descr) {
    this.setup(descr);
    this.init();
};

Grid.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};

Grid.prototype.init = function () {
    this.points = [];
    for(var i = 0; i < this.dims[0]; i++){
	this.points[i] = [];
	for(var j = 0; j < this.dims[1]; j++){
	    this.points[i][j] = [j*this.width/this.dims[0] + this.location[0] - this.width/2,i*this.height/this.dims[1]+ this.location[1] - this.height/2];
	    }
	}
}

Grid.prototype.findNearestPoint = function (x,y) {
    var line = this.points[0];
    var xs = [];
    var ys = [];
    for(var i = 0; i < line.length; i++){
	xs.push(line[i][0])
	}
    for(var i = 0; i < this.points.length; i++){
	ys.push(this.points[i][0][1])
	}

    var i = util.binarySearch(y,ys);
    var j = util.binarySearch(x,xs);
    if(i > 0){
	i =  util.square(ys[i]-y) < util.square(ys[i-1]-y) ? i : i-1;
	}
    if(j > 0) {
	j =  util.square(xs[j]-x) < util.square(xs[j-1]-x) ? j : j-1;
	}
    return [i,j];
    }

Grid.prototype.color = "#0000ff";

Grid.prototype.render = function (ctx) {
	ctx.save();
        ctx.strokeStyle = this.color;
	//ctx.beginPath()
        var n = this.points[0].length
        var m = this.points.length
	for(var i = 1; i < n-1; i++){
	    if (i % (n/4) === 0){
		ctx.lineWidth *= 2;
		}
	    if (i % (n/8) === 0){
		ctx.lineWidth *= 2;
		}
	    var p = this.points[0][i];
	    var p1 = this.points[this.points.length-1][i];
	    util.drawLine(ctx,p[0],p[1],p1[0],p1[1]);
	    if (i % (n/8) === 0){
		ctx.lineWidth /= 2;
		}
	    if (i % (n/4) === 0){
		ctx.lineWidth /= 2;
		}
	    }
	for(var j = 1; j < m-1; j++){
	    if (j % (m/4) === 0){
		ctx.lineWidth *= 2;
		}
	    if (j % (m/8) === 0){
		ctx.lineWidth *= 2;
		}
	    var p = this.points[j][0];
	    var p1 = this.points[j][this.points[0].length-1];
	    util.drawLine(ctx,p[0],p[1],p1[0],p1[1]);
	    if (j % (m/8) === 0){
		ctx.lineWidth /= 2;
		}
	    if (j % (m/4) === 0){
		ctx.lineWidth /= 2;
		}
	    }
	//ctx.closePath()
	ctx.restore()
};
