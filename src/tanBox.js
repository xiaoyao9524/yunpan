var tanBoxFn =function(option){
	option = option||{};
	
	var defaults = {
		title:"这是一个弹框",
		content:"我是弹框",
		okFn:function(){}
	};	
	for(var attr in option){
		defaults[attr] = option[attr];
	}
	var tanBox = document.createElement("div");
	tanBox.id = "tanBox";
	tanBox.className = "clearfix";
	tanBox.innerHTML = `
		<div class="prompt-top">
			<i class="warning-ico"></i>
			<p class="prompt-p1">${defaults.title}</p>
			<div class="prompt-p2 clearfix">${defaults.content}</div>
		</div>
		<div class="prompt-bottom">
			<span class="error"></span>
			<div class="btnBox">
				<a class="a1" href="javascript:;">确定</a>
				<a class="a2" href="javascript:;">取消</a>
			</div>
		</div>
		<span class="closePrompt"></span>
	`
	var title = tanBox.getElementsByClassName("prompt-p1")[0];
	var content = tanBox.getElementsByClassName("prompt-p2")[0];
	
	tanBox.style.zIndex = 100;
	
	document.body.appendChild(tanBox);
	
	var mask = document.createElement("div");
	mask.style.cssText = 'width:100%;height:100%;background:black;opacity:.3;position:fixed;top:0;left:0;zIndex:99;';
	document.body.appendChild(mask);
	
	
	//居中显示
	tanBox.style.left = (document.documentElement.clientWidth - tanBox.offsetWidth)/2 + "px";
	tanBox.style.top = (document.documentElement.clientHeight - tanBox.offsetHeight)/2 + "px";
	
	window.addEventListener("resize",function(){
		tanBox.style.left = (document.documentElement.clientWidth - tanBox.offsetWidth)/2 + "px";
		tanBox.style.top = (document.documentElement.clientHeight - tanBox.offsetHeight)/2 + "px";
	})
	
	//获取可以点击的按钮
	var ok = tanBox.getElementsByClassName('a1')[0];
	var close = tanBox.querySelector(".a2");
	var closePrompt = tanBox.querySelector(".closePrompt");
	//点击确定
	ok.addEventListener("click",function(){
		var bl = defaults.okfn();
		
		if(!bl){
			document.body.removeChild(tanBox);
			document.body.removeChild(mask);
		}
	})
	
	
	//点击取消
	close.addEventListener("click",function(){
		document.body.removeChild(tanBox);
		document.body.removeChild(mask);
	})
	closePrompt.addEventListener("click",function(){
		document.body.removeChild(tanBox);
		document.body.removeChild(mask);
	})
	
}