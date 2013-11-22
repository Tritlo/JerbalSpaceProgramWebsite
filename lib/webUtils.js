webUtil = {
    getScriptsInOrder: function (files, onFinish){
	var head = files.shift();
	if(head === undefined){ 
	    if(onFinish) return onFinish();
	    else return true;
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = head;
	var onL = function(){
	    webUtil.getScriptsInOrder(files);
	};
	script.onload = onL;
	document.getElementsByTagName('head')[0].appendChild(script);
	return false;
    }
};
