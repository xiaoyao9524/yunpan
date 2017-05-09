(function(){
	var methods = {
	//可视区域的宽高:
		view(){
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		},
		hasClass(element,className){
			var classNames = element.className.split(" ");
			for (var i = 0; i < classNames.length; i++) {
				if(classNames[i] === className){
					return true;
				}
			}
			return false;
		},
		parent(element,attr){
			var firstChar = attr.charAt(0);
			if(firstChar === "."){
				while(element.nodeType !== 9 && !methods.hasClass(element,attr.slice(1))){
					element = element.parentNode;
				}
			}else if(firstChar == "#"){
				while(element.nodeType !== 9 && element.id !== attr.slice(1)){
					element = element.parentNode;
				}
			}else {
				while(element.nodeType !== 9 && element.nodeName !== attr.toUpperCase()){
					element = element.parentNode;
				}
			}
			return element.nodeType === 9 ? null : element;
		},
		addClass(element,className){
			if(!methods.hasClass(element,className)){
				element.className += " "+className;
			}
		},
		removeClass(element,className){
			if(methods.hasClass(element,className)){
				var classNames = element.className.split(" ");
				for (var i = 0; i < classNames.length; i++) {
					if(classNames[i] === className){
						classNames.splice(i,1);
					}
				}
				element.className = classNames.join(" ");
			}
		},
		toggleClass(element,className){
			if(methods.hasClass(element,className)){
				methods.removeClass(element,className);
				return false;
			}else{
				methods.addClass(element,className);
				return true;
			}
		}
	}
	window.t = methods;
})()
