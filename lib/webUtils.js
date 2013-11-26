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
	    webUtil.getScriptsInOrder(files,onFinish);
	};
	script.onload = onL;
	document.getElementById('javascripts').appendChild(script);
	return false;
    },
   clearScripts: function(){
       $('#javascripts').empty();
    }
};
