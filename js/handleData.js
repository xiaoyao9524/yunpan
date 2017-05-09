var handle = {
	//根据ID找到自己
	getSelf(data,id){
		return data.find(function(value){
			return value.id == id;
		})
	},
	//根据ID找到子数据
	getChildsById(data,id){
		return data.filter(function(value){
			return value.pid == id;
		})
	},
	//根据ID找到所有父数据和自己
	getParentNodeById(data,id){
		var arr = [];
		var self = handle.getSelf(data,id);
		
		if(self){
			arr.push(self);
			arr = arr.concat(handle.getParentNodeById(data,self.pid));
		}
		return arr;
	},
	//传进一个数组通过data-id获取到自己,返回自己
	getSelfByLastId(arr,did){
		return arr.find(function(value){
			return value.dataset.id == did;
		})
	},
	//传进数据、id和一个字符串，检测数据中这个id下的子元素的title有没有和这个字符串一样的，如果有返回true，没有返回false
	judegTitle(data,id,title){
		var childs = handle.getChildsById(data,id);
		return childs.findIndex(function(value){
			return value.title === title;
		})!==-1;
	},
	//获取所有子数据
	getChildAll(data,id){
		var arr = [];
		var self = handle.getSelf(data,id);
		arr.push(self);
		var childs = handle.getChildsById(data,self.id);
		childs.forEach(function(value){
			arr = arr.concat(handle.getChildAll(data,value.id));
		})
		return arr;
	},
	getChildsAllArr(data,idArr){
		var arr = [];
		idArr.forEach(function(value){
			arr = arr.concat(handle.getChildAll(data,value));
		})
		return arr;
	},
	delectChildsAll(data,idArr){
		var childs = handle.getChildsAllArr(data,idArr);
		for (var i = 0; i < data.length; i++){
			for (var j = 0; j < childs.length; j++){
				if(data[i] === childs[j]){
					data.splice(i,1);
					i--;
					break;
				}
			}
		}
	}
}//end

