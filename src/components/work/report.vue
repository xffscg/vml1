<template>
	<div class="report">
		<h3>报告</h3>
		<div class="content" id="contentList">
		</div>
		<div class="footer">
			<el-button type="primary" plain icon="el-icon-s-operation" @click="saveReport">保存报告</el-button>
		</div>
	</div>
</template>

<script>
import ChartReport from '../report/relation'
import TableReport from '../report/preProcess'
import FreReport from '../report/freReport'
export default {
  name: 'report',
  components : {
  	ChartReport,
  	TableReport,
  	FreReport
  },
  methods: {
  	close(){
  		this.$store.commit("changeShow", 0);
  	},
  	saveReport(){
  		this.$store.commit("changeShow", 0);
  	},
  	deepCopy(oldVal){
        let target = oldVal.constructor === Array?[]:{};
        for(let key in oldVal){
          if(oldVal.hasOwnProperty(key)){
            if(oldVal[key] && typeof oldVal[key] === "object"){
              target[key] = oldVal[key].constructor === Array?[]:{};
              target[key] = this.deepCopy(oldVal[key]);
            }else{
              target[key] = oldVal[key];
            }
          }
        }
        return target;
    },
  	createReport(){
  		let list = this.$store.state.runResult;
  		let start = this.$store.state.start;
  		let runList = this.$store.state.runList;
  		let cache = this.deepCopy(start);
  		let space = document.getElementById("contentList");
  		for(let i in cache){
  			for(let j in cache[i].next){
  				cache.push(cache[i].next[j]);
  				if(cache[i].sclice(4,7) == "dat" || cache[i].sclice(4,8) == "exp1" || cache[i].sclice(4,7) == "pre"){
  					console.log("data");
  					let data = document.createElement("TableReport");
  					space.append(data);
  				}else if(cache[i].sclice(4,8) == "exp2"){
  					console.log("fre")
  				}else if(cache[i].sclice(4,8) == "exp3" || cache[i].sclice(4,8) == "exp4"){
  					console.log("relation")
  				}
  			}

  		}
  	},
  },
};
</script>

<style scoped>
.report {
	height: 100%;
	width: 100%;
	position: relative;
	background-color: white;
}
.reportItem {
	width: 100%;
}
.content {
	height: 650;
	width: 100%;
	margin-bottom: 10px;
	overflow-y: auto;
}
.footer {
	height: 50px;
	width: 100%;
	bottom: 0;
	padding-bottom: 10px;
	position: absolute;
	display: flex;
	justify-content: center;
}
</style>