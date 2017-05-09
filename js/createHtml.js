(function(){
	var content = document.getElementById("content");
	var oTop = document.getElementById("top");
	function resize(){
		var clientH = t.view().h;
		content.style.height = clientH - oTop.offsetHeight + "px";
	}
	window.onresize = resize;
	resize();

	//准备数据
	var datas = data.files;
	//--------------------------------渲染树形结构区域-------------------------------------------------------
	var tree = document.getElementById("tree");
	function createTreeHtml(data,id){
		var treeChild =  handle.getChildsById(datas,id);
		if(!treeChild.length){
			return "";
		}
		var treeHtml = "<ul>";
		treeChild.forEach(function(value){
			var level = handle.getParentNodeById(datas,value.id).length;//判断它是第几级
			
			var childs2 = handle.getChildsById(datas,value.id);
			var className = childs2.length?"div-open":"div-no";
			treeHtml += "<li><div class='dataSet "+ className +"' style='padding-left:" + (level*14) +"px' data-id="+ value.id +"><span class='ico'></span><i class='folder_close'></i><strong>" + value.title + "</strong></div>";
			treeHtml += createTreeHtml(datas,value.id);
		})
		treeHtml += "</li></ul>";
		return treeHtml;
	}
	tree.innerHTML = createTreeHtml(datas,-1);
	//--------------------------------渲染面包屑区域-------------------------------------------------------
	var nav = document.getElementById("nav");
	function creatrNavHtml(data,id){
		var navHtml = "<div>";
		var parent = handle.getParentNodeById(data,id).reverse();
		var parentLeng = parent.length;
		for (var i = 0; i < parentLeng-1; i++) {
			navHtml += "<a data-id="+ parent[i].id +" href='javascript:;'>" + parent[i].title +"</a><span class='separate'></span>";
		}
		navHtml += "<span style='border-bottom:2px solid #55addc;color:#55addc'>"+ parent[parent.length-1].title +"</span>";
		navHtml += "</div>";
		return navHtml;
	}
	nav.innerHTML = creatrNavHtml(datas,0);
	//--------------------------------渲染文件区域-------------------------------------------------------
	var files = document.getElementById("files");
	var alert1 = document.getElementById("alert");
	function createFilesHtml(data,id){
		var filesChilds = handle.getChildsById(data,id);
		if(!filesChilds.length){
			alert1.style.display = "block";
			files.style.display = "none";
		}else{
			alert1.style.display = "none";
			files.style.display = "block";
		}
		var filesHtml = "";
		filesChilds.forEach(function(value){
			filesHtml += "<div class='disdiv dataSet' data-id="+ value.id +"><div class='select'></div><img src='img/files-ico.png' alt='' /><span>"+ value.title +"</span><input class='oText' type='text' /></div>";
		})
		return filesHtml;
	}
	files.innerHTML = createFilesHtml(datas,0);
	//--------------------------------找到树形结构中的某项-------------------------------------------------------
	function getTreeTitle(dataId){
		var treeChilds = Array.from(tree.getElementsByTagName("div"));
		return treeChilds.find(function(item){
			return item.dataset.id == dataId;
		})
	}
	//------------------------通过创建元素新建文件方法-----------------------------------------------------
	function createFile(){
		var div = document.createElement("div");
		div.className = "dataSet disdiv";
		div.innerHTML = `<div class='select'>
		
						</div>
						<img src='img/files-ico.png' alt='' />
						<span>${""}</span>
						<input class='oText' type='text' />`;
						return div;
	}
	
	//--------------------------------设置上面的提示小框的颜色和提示语句--------------------------------------------
	
	function reminderFn(color,value){
		var color1 = String(color);
		var reminder = document.getElementById("reminder");
		reminder.style.transition = "none";
		reminder.style.top = "-50px";
		reminder.children[0].className = "";
		reminder.children[0].innerHTML = "";
		setTimeout(function(){
			reminder.style.transition = ".3s";
			reminder.style.top = "8px";
			reminder.children[0].className = color1;
		reminder.children[0].innerHTML = value;
		},0)
		clearTimeout(reminder.timer);
		reminder.timer = setTimeout(function(){
			reminder.style.top = "-50px";
		},2000)
	}
	
	//--------------------------------存一个变量保存上次的元素-------------------------------------------------------
	var lastEleDataId = 0;
	
	//--------------------------------添加树形菜单交互-------------------------------------------------------
	tree.addEventListener("mouseup",function(ev){
		var target = ev.target;//获取触发点击的元素
		var thisFa = t.parent(target,".dataSet");//获取触发点击的元素最近的有data-id的元素
		t.removeClass(getTreeTitle(lastEleDataId),"click");
		//有问题
	//	console.log(thisFa);
		var dataId = thisFa.dataset.id;//获取触发点击的元素最近的有data-id的元素的data-id
		lastEleDataId = dataId;
		t.addClass(thisFa,"click");//给这个父级元素添加class：click
		nav.innerHTML = creatrNavHtml(datas,dataId);//渲染结构
		files.innerHTML = createFilesHtml(datas,dataId);//渲染结构
		
		t.removeClass(selectAll,"selectAllon");
	})
	//--------------------------------添加导航区域交互-------------------------------------------------------
	nav.addEventListener("click",function(ev){
		var target = ev.target;
		var dataId = target.dataset.id;
		if(target.nodeName === "A"){
			nav.innerHTML = creatrNavHtml(datas,target.dataset.id);
			files.innerHTML = createFilesHtml(datas,target.dataset.id);//渲染结构
			t.removeClass(getTreeTitle(lastEleDataId),"click");
			t.addClass(getTreeTitle(dataId),"click");
			lastEleDataId = dataId;
			
			t.removeClass(selectAll,"selectAllon");
		}
	})
	//----------------------文件区域点击函数--------------------------------------
	
		
	
	//--------------------------------添加文件区域交互-------------------------------------------------------
	files.addEventListener("click",function(ev){
		var target = ev.target;
		if(t.parent(target,".oText")){
			return;
		}else if(t.parent(target,".select")){//如果点击的是select，则是单选，否则是打开
			target = t.parent(target,".select");//给target赋值为select
			t.toggleClass(target,"selecton");//给select添加或删除class
			t.toggleClass(target.parentNode,"disClickDiv");//给select的父级添加或删除class
		}else if(t.parent(target,".dataSet")){//如果点击的不是select，就是打开
			target = t.parent(target,".dataSet")
			var dataId = target.dataset.id;//获取触发点击的元素最近的有data-id的元素的data-id
			
			t.removeClass(getTreeTitle(lastEleDataId),"click");
			t.addClass(getTreeTitle(dataId),"click");
			lastEleDataId = dataId;
			nav.innerHTML = creatrNavHtml(datas,dataId);//渲染结构
			files.innerHTML = createFilesHtml(datas,dataId);//渲染结构
			
			t.removeClass(selectAll,"selectAllon");
			return;
		}
		
		var selectS = Array.from(files.getElementsByClassName("select"));
		
		var bl = selectS.every(function(item){
			return t.hasClass(item,"selecton");
		})
		
		if(bl){
			t.addClass(selectAll,"selectAllon");
		}else{
			t.removeClass(selectAll,"selectAllon");
		}
	})
	//----------------------------------------文件区域鼠标移入--------------------------------------------------
	files.addEventListener("mouseover",function(ev){
		var target = ev.target;
		if(files.isMove)return;
		if(!t.parent(target,".disClickDiv")){
			if(target = t.parent(target,".dataSet")){
				t.removeClass(target,"disdiv");
				t.addClass(target,"disHoverDiv");
			}
		}
	})
	//----------------------------------------文件区域鼠标移出--------------------------------------------------
	files.addEventListener("mouseout",function(ev){
		var target = ev.target;
		if(target = t.parent(target,".dataSet")){
			t.removeClass(target,"disHoverDiv");
			t.addClass(target,"disdiv");
		}
	})
	//----------------------------------------文件区域全选--------------------------------------------------
	var file = document.getElementById("file");
	var selectAll = file.getElementsByClassName("selectAll")[0];//全选按钮
	
	selectAll.addEventListener("click",function(){//当全选按钮按下时
		if(files.style.display == "none"){
			return;
		}
		var bl = t.toggleClass(this,"selectAllon");//这个是判断全选按钮按下没
		//所有的单选按钮
		var selects = Array.from(files.getElementsByClassName("select"));
		selects.forEach(function(item){
			if(bl){//如果全选按钮按下
				t.addClass(item,"selecton");
				t.addClass(item.parentNode,"disClickDiv");
			}else{//如果全选按钮没按下
				t.removeClass(item,"selecton");
				t.removeClass(item.parentNode,"disClickDiv");
			}
		})
		
	})
	//-----------------------阻止冒泡--------------------------------------------------------------------
	files.addEventListener("mousedown",function(ev){
		var target = ev.target;
		if(t.parent(target,".oText")){
			ev.stopPropagation();
		}
	})
	//----------------------------------------新建文件夹--------------------------------------------------
	var newFile = document.getElementById("newFile");
	newFile.addEventListener("mouseup",function(){
		t.removeClass(selectAll,"selecton");
		var newFile = createFile();//新建一个元素
		
		var firstEle = files.children[0];//获取文件区域第一个元素
		alert1.style.display = "none";//隐藏空文件提示
		files.style.display = "block";//显示文件区域
		
		files.insertBefore(newFile,firstEle);
		
		var newTitle = newFile.getElementsByTagName("span")[0];
		var newInp = newFile.getElementsByTagName("input")[0];
		newTitle.style.display = "none";
		newInp.style.display = "block";
		
		newInp.focus();
		
		files.isCreate = true;//给文件区域添加一个判断,是不是正在新建文件状态,true代表是
	})
	
	//-------------------------------document添加鼠标抬起处理函数--------------------------------------
	document.addEventListener("mousedown",createFiles);
	document.addEventListener("keyup",function(ev){
		if(ev.keyCode === 13){
			createFiles();
		}
	})
	function createFiles(){
		if(!files.isCreate)return;//是新建文件夹状态的话,才能继续执行
		var firstEle = files.children[0];//重新获取文件区域第一个元素(新建的元素)
		var newName = firstEle.getElementsByTagName("span")[0];//重新获取第一个元素的标题
		var newInp = firstEle.getElementsByTagName("input")[0];//重新获取第一个元素的改名框
		var newValue = newInp.value.trim();//这个是改名框的value值并且去掉前后空格
		
		var isTitleSame = handle.judegTitle(datas,lastEleDataId,newValue);//这个判断是否在同级有重名,有重名显示true,没有重名显示false
		
		if(!newValue.length){//如果value框是空的的话
			files.removeChild(firstEle);//直接删除掉这个元素
			reminderFn("red","名字不能为空,创建失败");
			
			var childs = handle.getChildsById(datas,lastEleDataId);
			if(!childs.length){
				files.style.display = "none";
				alert1.style.display = "block";
			}
			
		}else if(isTitleSame){//如果名字冲突的话
			files.removeChild(firstEle);//直接删除掉这个元素,并且上面那个提示小框会跳出来
			reminderFn("red","名字冲突,创建失败");
		}else{//创建成功
			newName.style.display = "block";
			newName.innerHTML = newInp.value;
			newInp.style.display = "none";
			var dataId = Math.random();
			//添加数据
			datas.unshift({
				id:dataId,
				title:newInp.value,
				pid:lastEleDataId,
				type:"file"
			})
			firstEle.setAttribute("data-id",dataId);
			tree.innerHTML = createTreeHtml(datas,-1);
			reminderFn("green","创建成功");
		}
		files.isCreate = false;
		
	}
	//-------------------删除------------------------------------------------
	var del = document.getElementById("del");
	del.addEventListener("mouseup",function(){
		var delEle = whoSelect();
		if(delEle.length){
			tanBoxFn({
				title:"删除",
				content:"真的要删么？？？",
				okfn:function(){
					
					var idArr = [];
					delEle.forEach(function(item){
						idArr.push(item.dataset.id);
					})
					handle.delectChildsAll(datas,idArr);
					
					files.innerHTML = createFilesHtml(datas,lastEleDataId);//渲染结构
					tree.innerHTML = createTreeHtml(datas,-1);
					t.removeClass(selectAll,"selectAllon");
					
				}
			});
		}else{
			reminderFn("red","请选择要删除的文件")
		}
	});
	//--------------------------判断哪些元素被选中了-------------------------------------------
	function whoSelect(){
		return Array.from(files.getElementsByClassName("select")).filter(function(item){
			return t.hasClass(item,"selecton")
		}).map(function(item){
			return t.parent(item,".dataSet");
		})
	}
	//--------------------------------------重命名------------------------------------------------------------
	var reName = document.getElementById("resizeName");
	var re = {};
	reName.addEventListener("click",function(){
		re.childs = [];
		re.childs = whoSelect();
		if(!re.childs.length){
			reminderFn("yellow","请选择要重命名的文件");
		}else if(re.childs.length>1){
			reminderFn("yellow","一次只能重命名一个文件");
		}else{
			
			re.Element = re.childs[0];//要重命名的文件
			re.inp = re.Element.getElementsByTagName("input")[0];//要重命名文件的输入框
			re.span = re.Element.getElementsByTagName("span")[0];//要重命名文件的名字
			re.span.style.display = "none";//span隐藏
			re.inp.style.display = "block";//input显示
			re.inp.value = re.span.innerHTML;//显示后value的值为文件的名字
			re.inp.select();//选中
			re.isReName = true;//当前是重命名状态
		}
	})
	document.addEventListener("mousedown",function(){
		if(!re.isReName){//如果不是重命名状态的话直接return
			return;
		}
		var value = re.inp.value;//输入框的值
		var isData = handle.judegTitle(datas,lastEleDataId,re.inp.value);//判断同级元素的title有没有一样的,有返回true
		if(re.inp.value === re.span.innerHTML){//如果和原来的名字一样的话
			reminderFn("red","修改失败");
		}else if(!re.inp.value.length){//如果没有输入
			reminderFn("yellow","请输入要修改的名字");
		}else if(isData){//如果命名冲突
			reminderFn("red","命名冲突,请重新修改");
		}else{//否则才是创建成功
			re.span.innerHTML = value;//span的值为value
			
			reminderFn("green","命名成功");//提示
			//修改数据
			re.self = handle.getSelf(datas,re.Element.dataset.id);//找到自己的数据
			re.self.title = value;//修改title
			tree.innerHTML = createTreeHtml(datas,-1);//重新渲染树形菜单
			
		}
		re.inp.style.display = "none";//让input隐藏,span显示
		re.span.style.display = "block";
		
		re.isReName = false;//当前状态不是重命名
	})
	//-------------------------------------移动到-----------------------------------------------------
	var move = document.getElementById("move");
	move.addEventListener("click",function(){
		var selectArr = whoSelect();//存的是选中的元素
		var filId = null;
		var moveOk = true;//代表可不可以关闭弹框,true代表选中了不能移动到的目录,弹框不可以关闭
		
		
		if(!selectArr.length){
			reminderFn("yellow","请选择要移动的文件");
			return;
		}else{
			tanBoxFn({
				title:"移动到",
				content:"<div id='moveTree'>" + createTreeHtml(datas,-1) + "</div>",
				
				okfn:function(){
					if(moveOk){//代表可不可以关闭弹框,true代表选中了不能移动到的目录,弹框不可以关闭
						return true;
					}else{//否则代表选中了可移动的目录,弹框可以关闭
						
						var onoff = false;
						for (var i = 0; i < selectIdArr.length; i++) {
							var self = handle.getSelf(datas,selectIdArr[i]);//存的是选中元素的数据
							
							var isExist = handle.judegTitle(datas,filId,self.title);
							//console.log(isExist);
							if(!isExist){
								self.pid = filId;
								files.removeChild(selectArr[i]);
							}else{
								onoff = true;
							}
							if(onoff){
								reminderFn("yellow","部分移动失败,因为名字已存在");
							}
							
						}
						tree.innerHTML = createTreeHtml(datas,-1);
					}
					
				}
			});
		}
		//给生成的属性菜单添加点击处理函数
		var moveTree = document.getElementById("moveTree");
		
		var selectIdArr = [];//存的是选中元素的data-id
		for (var i = 0; i < selectArr.length; i++) {
			selectIdArr.push(selectArr[i].dataset.id);
		}
		
		var selectChildsAllDataId = handle.getChildsAllArr(datas,selectIdArr);//存的是选中的元素所有的子数据包含自己
		
		var tanBox = document.getElementById("tanBox");
		var error = tanBox.querySelector(".error");
		
		
		var weiyun = tanBox.getElementsByClassName("dataSet")[0];
		t.addClass(weiyun,"click");
		
		moveTree.addEventListener("click",function(ev){//点击树形菜单
			var target = ev.target;
			if(t.parent(target,".dataSet")){//如果点击的是dataSet的话
				target = t.parent(target,".dataSet");//赋值
				
				t.removeClass(weiyun,"click");
				t.addClass(target,"click");
				weiyun = target;
				
				
				filId = target.dataset.id;//存的是点击的树形菜单的data-id
				var oneData = handle.getSelf(datas,filId);//存的是点击树形菜单对应的数据
				
				var onOff = false;
				for (var i = 0; i < selectChildsAllDataId.length; i++) {//循环所有选中的元素数据和子数据
					if(selectChildsAllDataId[i].id == filId){//如果它们的某一项id和点击的树形菜单的data-id相同的话,让开关为true,代表不能移动
						onOff = true;
						break;
					}
				}
				var selfParentId = handle.getSelf(datas,selectArr[0].dataset.id).pid;//存的是选中元素的pid
				if(filId == selfParentId){//如果点击的树形菜单的data-id == 选中元素的pid,说明点击的是选中元素的父级,不能移动
					error.innerHTML = "* 该文件下已经存在";
					moveOk = true;//代表不可以关闭弹框
					return;
				}
				
				if(onOff){//开关为true的话代表不能移动
					error.innerHTML = "* 不能将文件移动到自身或其子文件夹下";
					moveOk = true;//代表不可以关闭弹框
				}else{//否则代表可以移动
					error.innerHTML = "";
					moveOk = false;//代表可以关闭弹框
				}
				
			}
		})
	})
	
	//-----------------------------------框选----------------------------------------------------------------	
	var kuang = null,
		disX = null,
		disY = null,
		sketchDiv = null,
		wz = null,
		isHitElement = null;
	files.addEventListener("mousedown",function(ev){
		
		if(re.isReName || files.isCreate){
			return;
		}
		
		if(ev.which != 1) return;//判断点的是不是鼠标左键
		ev.preventDefault();//去掉浏览器默认行为
		
		if(!t.parent(ev.target,"#files")){//如果不是文件区域不能画框
			return;
		}
		var isSelect = false;//存的是选中文件夹下有没有class为selecton的元素,有的话为true,说明按下的元素是选中的,这个变量为false的话才可以画框
		if(t.parent(ev.target,".dataSet")){//让这个变量等于鼠标按下时文件夹是否是选中状态
			isSelect = !!t.parent(ev.target,".dataSet").querySelector(".selecton");
		}
		
		disX = ev.clientX;//鼠标按下时的X值
		disY = ev.clientY;//鼠标按下时的Y值
		
		
		document.onmousemove = function(ev){
			if(isSelect){
				if( Math.abs( ev.clientX - disX ) < 3 || Math.abs( ev.clientY - disY ) < 3 ){
					return;
				}
				var selectArr = whoSelect();//存的是被选中的元素
				if(!sketchDiv){
					sketchDiv = document.createElement("div");
					sketchDiv.className = "sketch";
					
					wz = document.createElement("div");
					wz.style.cssText = `
										width:15px;
										height:15px;
										background:red;
										position:absolute;
										left:0;
										top:0;
										opacity:0;
					`;
					
					document.body.appendChild(sketchDiv);
					document.body.appendChild(wz);
				}
				sketchDiv.style.left = ev.clientX + 15 + "px";
				sketchDiv.style.top = ev.clientY + 15 + "px";
				wz.style.left = ev.clientX - 5 + "px";
				wz.style.top = ev.clientY - 5 + "px";
				sketchDiv.innerHTML = selectArr.length;
				
				
				var fileItem = files.getElementsByClassName("dataSet");
				isHitElement = null;
				for (var i = 0; i < fileItem.length; i++) {
					var onoff = false;
					for (var j = 0; j < selectArr.length; j++) {
						if(selectArr[j] == fileItem[i] ){
							onoff = true;
						}
					}
					if(onoff){
						continue;
					}
					
					if(pengzhuang(wz,fileItem[i])){
						t.addClass(fileItem[i],"disHoverDiv");
						isHitElement = fileItem[i];
					}else{
						t.removeClass(fileItem[i],"disHoverDiv");
					}
				}
				
				
				
				
				
				
				
				return;
			}
			if(Math.abs(ev.clientX - disX)>15||Math.abs(ev.clientY - disY)>15){
				if(!kuang){
					kuang = document.createElement("div");
					kuang.className = "kuang";
					
					
					
					document.body.appendChild(kuang);
				}
				kuang.style.width = Math.abs(ev.clientX - disX) + "px";
				kuang.style.height = Math.abs(ev.clientY - disY) + "px";
				kuang.style.left = Math.min(ev.clientX,disX) + "px";
				kuang.style.top = Math.min(ev.clientY,disY) + "px";	
			
			
			
				//检测碰撞
				
				var fileItem = files.getElementsByClassName("dataSet");
				for (var i = 0; i < fileItem.length; i++) {
					if(pengzhuang(kuang,fileItem[i])){
						t.addClass(fileItem[i],"disClickDiv");
						t.addClass(fileItem[i].children[0],"selecton");
					}else{
						t.removeClass(fileItem[i],"disClickDiv");
						t.removeClass(fileItem[i].children[0],"selecton");
					}
				}
				//检测全选
				var selectArr = whoSelect();
				if(selectArr.length === fileItem.length){
					t.addClass(selectAll,"selectAllon");
				}else{
					t.removeClass(selectAll,"selectAllon");
				}
			}
		}
		document.onmouseup = function(){
			if(kuang){
				document.body.removeChild(kuang);
				kuang = null;
			}
			if(sketchDiv){
				document.body.removeChild(sketchDiv);
				document.body.removeChild(wz);
				sketchDiv = null;
				wz = null;
			}
			if(isHitElement){
				var onoff = false;
				
				var selectArr = whoSelect();
				var selectIdArr = selectArr.map(function (item){
					return item.dataset.id;
				})
				var filId = isHitElement.dataset.id;
				
				
				for (var i = 0; i < selectIdArr.length; i++) {
					var self = handle.getSelf(datas,selectIdArr[i]);//存的是选中元素的数据
					
					var isExist = handle.judegTitle(datas,filId,self.title);
					if(!isExist){
						self.pid = filId;
						files.removeChild(selectArr[i]);
					}else{
						onoff = true;
					}
					if(onoff){
						reminderFn("yellow","部分移动失败,因为名字已存在");
					}
					
				}
				tree.innerHTML = createTreeHtml(datas,-1);
				isHitElement = null;
			}
			document.onmousemove = null;
		}
		function pengzhuang(obj1,obj2){
			var obj1Rect = 	obj1.getBoundingClientRect();
			var obj2Rect = 	obj2.getBoundingClientRect();
		
			//如果obj1碰上了哦obj2返回true，否则放回false
			var obj1Left = obj1Rect.left;
			var obj1Right = obj1Rect.right;
			var obj1Top = obj1Rect.top;
			var obj1Bottom = obj1Rect.bottom;
		
			var obj2Left = obj2Rect.left;
			var obj2Right = obj2Rect.right;
			var obj2Top = obj2Rect.top;
			var obj2Bottom = obj2Rect.bottom;
		
			if( obj1Right < obj2Left || obj1Left > obj2Right || obj1Bottom < obj2Top || obj1Top > obj2Bottom ){
				return false;
			}else{
				return true;
			}
		}
	})
	
})()


