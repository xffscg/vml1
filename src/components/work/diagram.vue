<template>
	<div id="diagram" @drop="drop($event)" @dragover.prevent="dragover($event)">
     <transition name="el-fade-in-linear">
       
        <RightMenu v-show="showMenu" style="z-index : 3;" @runFrom="runFrom"></RightMenu>
     </transition>
   <!-- <div class="hover" v-show="showHover">
     <div class="hoverItem" v-for="item in hoverDetail">{{item}}</div>
   </div>  -->
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {jsPlumb} from 'jsplumb'
import RightMenu from './rightMenu'
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult, executeAll, executeFromOne } from '@/api/addProject'
import { rawDataPreview, currentDataPreview } from '@/api/dataSource'
import { getColumnNames, getColumnNameWithNumberType, fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
export default {
  name: 'diagram',
  components : {
    RightMenu
  },
  data(){
  	return {
  		plumb:null,
      showMenu : false,
      showHover : false,
      workData : {name : "", detail : {}},
      hoverDetail : [],
      // 将isSource和isTarget设置成true，那么久可以用户在拖动时，自动创建链接。
  		endConfig : {
        isSource: false,
        isTarget: true,
        connector: [ "Bezier", { curviness: 30 } ],
        endpoint: 'Blank',
        maxConnections: -1,
        paintStyle: {
          fill: 'white',
          outlineStroke: 'black',
          strokeWidth: 1
        },

        hoverPaintStyle: {
          outlineStroke: 'lightblue'
        },
        connectorStyle: {
          outlineStroke: '#909399',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        }
      },
      startConfig : {
        isSource: true,
        isTarget: false,
        connector: [ "Bezier", { curviness: 30 } ],
        endpoint: 'Dot',
        maxConnections: -1,
        endpointStyle: { fill: '#EBF5FA', outlineStroke: 'darkblue', outlineWidth: 1, radius: 6},
        paintStyle: {
          fill: 'white',
          outlineStroke: 'black',
          strokeWidth: 1
        },
        hoverPaintStyle: {
          outlineStroke: 'lightblue'
        },
        connectorStyle: {
          outlineStroke: '#909399',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        }
      },
      defaultConfig :{
        endpoint : "Dot",
        endpointStyle: { fill: '#EBF5FA', outlineStroke: 'darkblue', outlineWidth: 1, radius: 6},
        connector: [ "Bezier", { curviness: 30 } ],
        connectorStyle: {
          outlineStroke: '#909399',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        },
        overlays: [ ['Arrow', {
                location: 1,
                width : 12,
                length : 12,
                visible: true,
                id: "arrow"
            }] ]
      }
  	}
  },
  mounted(){
  	this.plumb = jsPlumb.getInstance({ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                width : 12,
                length : 12,
                visible: true,
                id: "arrow"
            }]
        ]});
    this.plumb.setContainer('diagram');    
    let that = this;
    this.plumb.bind('click', function (conn, originalEvent) {
      that.plumb.deleteConnection(conn);
      let c = that.plumb.getAllConnections();
      let r = [];
      let list = {}
      for(let i = 0; i < c.length; i++){
          if(!list[c[i].sourceId]){ 
            list[c[i].sourceId] = {next:[], pre :[]};          
          } 
          if(!list[c[i].targetId]){ 
            list[c[i].targetId] = {next:[], pre :[]};          
          }         
          list[c[i].sourceId].next.push(c[i].targetId); 
          list[c[i].targetId].pre.push(c[i].sourceId); 
          r.push([c[i].endpoints[0].getUuid(), c[i].endpoints[1]].getUuid());

        }
        that.$store.commit("changeRun", list);
        that.$store.commit("changeRelation", r);
    });
    this.plumb.bind('connection', function (conn, originalEvent) {
      let c = that.plumb.getAllConnections();
      let r = [];
      let list = {}
      for(let i = 0; i < c.length; i++){
          if(!list[c[i].sourceId]){ 
            list[c[i].sourceId] = {next:[], pre :[]};          
          } 
          if(!list[c[i].targetId]){ 
            list[c[i].targetId] = {next:[], pre :[]};          
          }         
          list[c[i].sourceId].next.push(c[i].targetId); 
          list[c[i].targetId].pre.push(c[i].sourceId); 
          let n1 = c[i].endpoints[0].getUuid();
          let n2 = c[i].endpoints[1].getUuid();
          r.push([n1, n2]);

        }
      that.$store.commit("changeRelation", r);
      that.$store.commit("changeRun", list);
    });
    $(document).on('click', function(e) {
        var contentEle= $('RightMenu');
        if(contentEle!== e.target && contentEle.has(e.target).length === 0) {
            that.showMenu = false;
        }
    });
  },
  methods:{
    runFrom(){
        let id = this.$store.state.menuType.type;
        this.initialStyle(id);        
        this.$emit("clearSuccess",id);
        executeFromOne({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId: id})
        .then(res=>res.data).then(res=>{
          console.log(res);
          this.$emit("setLog",res.model_execute_id);
        })
        .catch(e=>{
          Message.error("运行失败");
        })
    },
    initialStyle(id){
      console.log(id);
      let list = this.$store.state.runList;
      this.changeClass("initial", id);
      if(list[id].next.length != 0){
        for(let i in list[id].next){
          this.initialStyle(list[id].next[i]);
        }
      }
    },
    changeClass(state, currentNode){      
      $("#" + currentNode +' i').remove();
      console.log(currentNode);
      if(state == "success"){
        let i = document.createElement("i");
        i.setAttribute("class", "el-icon-check");
        $("#" + currentNode).append(i);
        $("#" + currentNode).css("border","solid 2px #409EFF");
      }else if(state == "error"){
        let i = document.createElement("i");
        i.setAttribute("class", "el-icon-close");
        $("#" + currentNode).append(i);
        $("#" + currentNode).css("border","solid 2px #F56C6C");
      }else if(state == "running"){
        let i = document.createElement("i");
        i.setAttribute("class", "el-icon-loading");
        $("#" + currentNode).append(i);
        $("#" + currentNode).css("border","2px dashed #67C23A")
        // $("#" + currentNode).css("background","linear-gradient(to bottom, #34538b, #cd0000)");
        // $("#" + currentNode).css("background-origin","border-box");
      }else if(state == "initial"){
        $("#" + currentNode).css("border","solid 1px #96D0F7");
      }
    },
    createCoverProject(id){
        queryProject({userId : this.$store.state.userId, projectId : id}).then(res=>res.data)
        .then(res=>{
          console.log(res);
          let r = this.deepCopy(res);
          let newId = {};

          let timestamp = new Date().getTime(); 
          for(let i in r.config){
            timestamp = timestamp + 1;
            console.log(timestamp);
            newId[i] = i.slice(0,-13) + timestamp;
            this.$store.commit("changeConfig", {type : "addNode", detail:{name : newId[i], type : r.config[i].type, nameAll : r.config[i].name}});
          }//配置数据
          console.log(newId);
          for(let i in r.config){
            let newconfig = this.deepCopy(r.config[i].config);
            newconfig.fileUrl = [];
            for(let j in r.config[i].config.fileUrl){
              for(let item in r.config[i].config.fileUrl[j]){
                let obj = {};
                obj[newId[item]] = r.config[i].config.fileUrl[j][item];
                newconfig.fileUrl.push(obj);
              }
            }
            this.$store.commit("changeConfig", {type : "addConfig", detail:{name : newId[i], config : newconfig}});
          }//配置数据
          for(let i in r.startNode){
            this.$store.commit("changeStart", {type:"add", detail:newId[r.startNode[i]]});
          }//节点名称数据
          let newOrder = {};
          for(let item in r.config_order){
            newOrder[newId[item]] = this.deepCopy(r.config_order[item]);
          }
          this.$store.commit("changeConfigOrder", {type:"copy", config:newOrder});
          
          this.setDiagramCover(r.config, newId);
          // this.$store.commit("changeRelation", r.relationship);
          for(let i in r.relationship){
            let item = r.relationship[i];
            let from = newId[item[0].slice(5)];
            console.log(from);

            let fromUU = item[0].slice(0,5) + from;
            let to = newId[item[1].slice(2)];
            console.log(to);
            let toUU = "to"+to; 
            // if(item[0])
            this.plumb.connect({
              source : from,
              target : to,
              uuids : [fromUU, toUU],
            },this.defaultConfig);
          }//连接线
          // this.$store.commit("changeRelation", r.relationship);
       })
        .catch(e=>{
            console.log(e);
        })
    },
  	drop(e){
      let nameAll = this.dragContent.firstChild.innerHTML;
      console.log(nameAll);
  		let space = document.getElementById('diagram');
  		e.preventDefault();
      let isType = this.dragContent.id.slice(0,3);
      let typeAlg =this.dragContent.id.slice(0,4);
      if(isType == "pro"){
        let proId = Number(this.dragContent.id.slice(3));
        this.$store.commit("changeProId", proId);
        queryProject({userId : this.$store.state.userId, projectId : proId}).then(res=>res.data)
        .then(res=>{
          console.log(res);
          let r = this.deepCopy(res);
          this.setDiagram(r.config);
          for(let i in r.config){
            this.$store.commit("changeConfig", {type : "addNode", detail:{name : i, type : r.config[i].type, nameAll : r.config[i].name}});
            this.$store.commit("changeConfig", {type : "addConfig", detail:{name : i, config : r.config[i].config}});
          }//配置数据
          for(let i in r.startNode){
            this.$store.commit("changeStart", {type:"add", detail:r.startNode[i]});
          }//节点名称数据
          this.$store.commit("changeConfigOrder", {type:"copy", config:r.config_order});
          // this.$store.commit("changeRelation", r.relationship);
          for(let i in r.relationship){
            let item = r.relationship[i];
            // if(item[0])
            this.plumb.connect({
              source : item[0].slice(5),
              target : item[1].slice(2),
              uuids : [item[0], item[1]],
            },this.defaultConfig);
          }//连接线
          // this.$store.commit("changeRelation", r.relationship);
       })
        .catch(e=>{
            console.log(e);
        })
      }else{ 
        let timestamp = new Date().getTime();  
        this.dragContent.removeAttribute("class");
        console.log(this.dragContent);
        if(this.dragContent.id.slice(0,3) == "100" || this.dragContent.id.slice(0,3) == "200" || this.dragContent.id.slice(0,3) == "300" || this.dragContent.id.slice(0,3) == "400" || this.dragContent.id.slice(0,3) == "500" || this.dragContent.id.slice(0,3) == "600" || this.dragContent.id.slice(0,3) == "700"){
          this.dragContent.id = "drop"+this.dragContent.id.slice(4)+timestamp;
          isType = "alg";
        }else{
          this.dragContent.id = "drop"+this.dragContent.id+timestamp;
        }
        console.log(this.dragContent.id)
        this.dragContent.style.position = "absolute";
        this.dragContent.style.width = "150px";
        this.dragContent.style.height = "25px";
         this.dragContent.style.textAlign = "center";
        this.dragContent.style.border = "solid 1px #96D0F7";
        this.dragContent.style.backgroundColor = "#F2F6FC";
        this.dragContent.style.borderRadius = "30px";         
        this.dragContent.style.left = e.offsetX+"px";
        this.dragContent.style.top = e.offsetY+"px"; 
        // this.dragContent.style.display = "flex";
        // this.dragContent.style.justifyContent = "spaceAro"
        space.append(this.dragContent);
        //添加dom事件 
        this.$store.commit("changeLoc", {name : this.dragContent.id, x : this.dragContent.style.left, y : this.dragContent.style.top});
        this.addElement(this.dragContent);
        this.addJsPlumb(this.dragContent);        
        this.saveConfigNode(isType, nameAll, typeAlg);
      }  		
  	},
    saveConfigNode(type, name, typeAlg){

      let fileUrl = [];
      if(type == "dat"){
          this.$store.commit("changeStart", {type:"add", detail:this.dragContent.id});
          let index = this.dragContent.id.slice(7,-13);
          let info = this.dataInfo[Number(index)];
          let obj = {};
          obj[this.dragContent.id] = info.fileUrl;
          fileUrl.push(obj);
          this.getColumns(this.dragContent.id, info.fileId, info.fileUrl);
          this.$store.commit("changeConfig", {type : "addNode", detail:{name : this.dragContent.id, type : name, nameAll : 5001}});
          this.$store.commit("changeResult", {type : "add",name : this.dragContent.id, config:{fileId : info.fileId, fileUrl : info.fileUrl}});
          this.$store.commit("changeConfig", {type : "addConfig", detail:{name : this.dragContent.id, config : {fileId : info.fileId, fileUrl : fileUrl}}});
      }else if(type == "alg"){
          this.$store.commit("changeConfig", {type : "addNode", detail:{name : this.dragContent.id, type : name, nameAll : Number(typeAlg)}});
      }else if(type == "mod"){
        let m = this.$store.state.modelList;
        let index = Number(this.dragContent.id.slice(7,-13));
        this.$store.commit("changeStart", {type:"add", detail:this.dragContent.id});
        this.$store.commit("changeConfig", {type : "addNode", detail:{name : this.dragContent.id, type : name, nameAll : 8000}});
        this.$store.commit("changeConfig", {type : "addConfig", detail:{name : this.dragContent.id, config : {parameter : {userId: this.$store.state.userId, projectId : this.$store.state.projectId, MLModelId : m[index].MLModelId, modelTypeId : m[index].operatorTypeId}, fileUrl : []}}});
      }
    },
    setDiagram(config){
      let space = document.getElementById("diagram");
      for(let i in config){
        let d = document.createElement("div");
        d.id = i;
        d.style.left = config[i].location.x;
        d.style.top = config[i].location.y;
        d.style.position = "absolute";
        d.style.width = "130px";
        d.style.height = "25px";
        d.style.border = "solid 1px #96D0F7";
        d.style.backgroundColor = "#F2F6FC";
        d.style.textAlign = "center";
        d.style.borderRadius = "30px";   
        let s = document.createElement("span");
        s.innerHTML = config[i].type;
        this.$store.commit("changeLoc", {name : i, x : config[i].location.x, y : config[i].location.y});
        // let icon = document.createElement("i");
        // icon.setAttribute("class", "el-icon-circle-check");
        // icon.style.flo
        // s.append(icon);
        d.append(s);
        space.append(d);
        this.addElement(d);
        this.addJsPlumb(d);
      }
    }, 
    setDiagramCover(config, newId){
      let space = document.getElementById("diagram");
      for(let i in config){
        let d = document.createElement("div");
        d.id = newId[i];
        d.style.left = config[i].location.x;
        d.style.top = config[i].location.y;
        d.style.position = "absolute";
        d.style.width = "130px";
        d.style.height = "25px";
        d.style.border = "solid 1px #96D0F7";
        d.style.backgroundColor = "#F2F6FC";
        d.style.textAlign = "center";
        d.style.borderRadius = "30px";   
        let s = document.createElement("span");
        s.innerHTML = config[i].type;
        this.$store.commit("changeLoc", {name : newId[i], x : config[i].location.x, y : config[i].location.y});
        // let icon = document.createElement("i");
        // icon.setAttribute("class", "el-icon-circle-check");
        // icon.style.flo
        // s.append(icon);
        d.append(s);
        space.append(d);
        this.addElement(d);
        this.addJsPlumb(d);
      }
    },   
    getColumns(name, id, url){
      getColumnNames({ params: { userId: 1, fileId : id, fileUrl : url } })
      .then(res => res.data)
      .then(res => {
        this.$store.commit("changeConfigOrder", {type : "addColumn", config : {name : name, column: res}});      })
      .catch(e => {
        Message.error(e.error || 'getColumnNames接口1错误，请重试')
      })
      getColumnNameWithNumberType({ // 获取数值型列名
        params: {
          userId: 1, fileId : id, fileUrl : url
        }
      })
        .then(res => res.data)
        .then(res => {
          this.$store.commit("changeConfigOrder", {type : "addColumnN", config : {name : name, columnNumber: res}});
          
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNameWithNumberType接口错误，请重试')
        })
        
    },    
  	dragover(e){
      e.preventDefault();
  	},
    addElement(node){        
      let that = this; 
      //点击配置   
      node.addEventListener("click", function(event) { 
        console.log(event.currentTarget);   
        console.log(event.currentTarget.style.left);     
        that.$emit("goConfig", event.currentTarget.id);
        that.$store.commit("changeLoc", {name : event.currentTarget.id, x : event.currentTarget.style.left, y : event.currentTarget.style.top});
      }, false);
      // this.dragContent.addEventListener("mouseover",function(event){
      //   let d = that.$store.state.configData[event.currentTarget.id] || [];
      //   that.hoverDetail = [];
      //   if(d != []){          
      //     if(d.hasOwnProperty("parameter")){
      //       for(let item in d["parameter"]){
      //         that.hoverDetail.push(d["parameter"][item]);
      //       }
      //     }else{
      //       for(let item in d){
      //         if(item != "userId" && item != "projectName"){
      //           that.hoverDetail.push({item : d[item]});
      //         }
      //       }
      //     }
      //     let ele = $("#"+event.currentTarget.id);
      //     let left = parseInt(ele.css("left").slice(0,-2))+parseInt(ele.css("width").slice(0,-2)) + 3 + "px";
      //     $(".hover").css("left", left);
      //     $(".hover").css("top", ele.css("top"));
      //     console.log(that.hoverDetail);
      //     that.showHover = true;
      //   }

      // });
      node.addEventListener("mouseout", function(event) {          
        that.showHover = false;
      });
      //阻止右键的默认事件
      node.addEventListener("contextmenu", function(event) {          
        event.preventDefault();
      }, false);
      //右键弹出操作菜单
      node.addEventListener("mouseup", function(event) {          
        if(event.button === 2){
          let ele = $("#"+event.currentTarget.id);
          let left = parseInt(ele.css("left").slice(0,-2))+parseInt(ele.css("width").slice(0,-2)) + 3 + "px";
          let para = {type:event.currentTarget.id,left:left, top:ele.css("top")}
          that.$store.commit("changeMenu", para);
          that.showMenu = true;
        }
      }, false);
    },
    addJsPlumb(node){
      this.plumb.addEndpoint(node.id,{anchor : ['Top'], uuid: "to" + node.id}, this.endConfig);
      if(node.id.slice(4,8) == "pre9"){
        this.plumb.addEndpoint(node.id,{anchor : [[0.3, 1, 0, 1]], uuid :"from0"+ node.id}, this.startConfig) ;
        this.plumb.addEndpoint(node.id,{anchor : [[0.7, 1, 0, 1]], uuid :"from1"+ node.id}, this.startConfig);
      }else{
        this.plumb.addEndpoint(node.id,{anchor : ['Bottom'], uuid :"from0"+ node.id}, this.startConfig) ;
      }
      // this.plumb.addEndpoint(node.id,{anchor : ['Bottom'], uuid :"from"+ node.id}, this.startConfig) ; 
      this.plumb.draggable(node.id,{containment: 'parent'});
      
    },
    delElement(){
      let ele = this.$store.state.menuType.type;
      this.$store.commit("changeConfig", {type : "delNode", detail:{ name: ele}});
      this.$store.commit("changeConfigOrder", {type : "del", config:{ name: ele}});
      this.$store.commit("changeResult", {type : "del",name: ele});
      // this.$store.commit("changeLoc", {type : "del", config:{ name: ele}});
      this.plumb.remove(ele);
      if(ele.slice(4,7) == "dat" || ele.slice(4,7) == "mod"){
        this.$store.commit("changeStart", {type:"del", detail:ele});
      }
      let c = this.plumb.getAllConnections();
      let r = [];
      let list = {}
      for(let i = 0; i < c.length; i++){
          if(!list[c[i].sourceId]){ 
            list[c[i].sourceId] = {next:[], pre :[]};          
          } 
          if(!list[c[i].targetId]){ 
            list[c[i].targetId] = {next:[], pre :[]};          
          }         
          list[c[i].sourceId].next.push(c[i].targetId); 
          list[c[i].targetId].pre.push(c[i].sourceId); 
          r.push([c[i].endpoints[0].getUuid(), c[i].endpoints[1].getUuid()]);

        }
        this.$store.commit("changeRun", list);
        this.$store.commit("changeRelation", r);
    },
    showDetail(n){
      this.$store.commit("changeShow", Number(n));
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

    

  },
  computed:{
  	dragContent(){
  		return this.$store.state.dragContent;
  	},
    menuOp(){
      return this.$store.state.menuOp;
    },
    dataInfo(){
      return this.$store.state.dataList;
    },
    clear(){
      return this.$store.state.clearFlag;
    },
  },
  watch:{
    clear(newV){
      let all =  this.$store.state.configData;
      console.log(all);
      for(let i in all){
        this.plumb.remove(i);
      }     
      this.$store.commit("changeConfig", {type : "clear"});
    },
    menuOp(newV){
      let t = newV.slice(0,3);
      switch(t){
        case "del":
          this.delElement();
          break;
        case "dat":
          this.showDetail(1);
          break;
        case "res":
          this.showDetail(newV.slice(3,4));
          break;
        case "mod":
          console.log("mod")
          this.showDetail(9);
          break;
        default:
          break;
      }
      // if(newV.slice(0,3) == "del"){
      //   this.delElement();
      // }else if(newV.slice(0,3) == "dat")
    }
  }
};
</script>

<style scoped>
#diagram {
	width:100%;
	height: 450px;
	position: relative;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.diagramItem {
  position: absolute;
  width: 150px;
  height: 30px;
  border : solid 1px black;
}
.hover {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 150px;
}
.hoverItem {
  height: 20px;
  width: 100%;
  border-bottom: solid 1px   #FFFFF0;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
  background-color: #EEEEE4;
}
.runBox {
    width: 150px;
    border: 2px dashed #fff;
    background: linear-gradient(to bottom, #34538b, #cd0000);
}
/*.runState {
  animation: runAni 
}
@keyframes runAni{
  from {}
}
@-webkit-keyframes runAni
{*/
/*}*/
</style>