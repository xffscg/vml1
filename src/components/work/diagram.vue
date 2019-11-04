<template>
	<div id="diagram" @drop="drop($event)" @dragover.prevent="dragover($event)">
   <RightMenu v-show="showMenu" style="z-index : 3;"></RightMenu>
   <div class="hover" v-show="showHover">
     <div class="hoverItem" v-for="item in hoverDetail">{{item}}</div>
   </div> 
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {jsPlumb} from 'jsplumb'
import RightMenu from './rightMenu'
import { rawDataPreview, currentDataPreview } from '@/api/dataSource'
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
        connector: 'Flowchart',
        endpoint: 'Blank',
        maxConnections: -1,
        paintStyle: {
          fill: 'white',
          outlineStroke: 'black',
          strokeWidth: 1
        },

        // endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 1 },

        hoverPaintStyle: {
          outlineStroke: 'lightblue'
        },
        connectorStyle: {
          outlineStroke: 'gray',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        }
      },
      startConfig : {
        isSource: true,
        isTarget: false,
        connector: 'Flowchart',
        endpoint: 'Dot',
        maxConnections: -1,
        endpointStyle: { fill: 'lightgray', outlineStroke: 'darkblue', outlineWidth: 1, radius: 6},
        paintStyle: {
          fill: 'white',
          outlineStroke: 'black',
          strokeWidth: 1
        },
        hoverPaintStyle: {
          outlineStroke: 'lightblue'
        },
        connectorStyle: {
          outlineStroke: 'gray',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        }
      },
      defaultConfig :{
        endpoint : "Dot",
        endpointStyle: { fill: 'lightgray', outlineStroke: 'darkblue', outlineWidth: 1, radius: 6},
        connector: 'Flowchart',
        connectorStyle: {
          outlineStroke: 'gray',
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
    });
    this.plumb.bind('connection', function (conn, originalEvent) {
      let c = that.plumb.getAllConnections();
      let r = [];
      for(let i = 0; i < c.length; i++){
          r.push([c[i].sourceId, c[i].targetId]);
        }
      that.$store.commit("changeRelation", r);
    });
    $(document).on('click', function(e) {
        var contentEle= $('RightMenu');
        if(contentEle!== e.target && contentEle.has(e.target).length === 0) {
            that.showMenu = false;
        }
    });
  },
  methods:{
  	drop(e){
      console.log(this.dragContent.firstChild.innerHTML);
      this.$store.commit("changeNodes", {type : "add", config : { id: "drop"+this.dragContent.id, name : this.dragContent.firstChild.innerHTML}});
  		let space = document.getElementById('diagram');
  		e.preventDefault();
      let isType = this.dragContent.id.slice(0,3);
      console.log(isType);
      if(isType == "alg"){
        console.log("alg");
      }else if(isType == "pre"){
        console.log("pre");
      }else if(isType == "exp"){
        console.log("exp");
      }else if(isType == "dat"){
        console.log("data");
        this.$store.commit("changeStart", {type:"add", detail:"drop"+this.dragContent.id});
        // this.getDataView();
        
      }else if(isType == "pro"){
        let session = window.sessionStorage;
        let r = JSON.parse(session.getItem("project"));
        let order = this.getOrder(r.relationship);
        this.setDiagram(order, r.nodes);
        for(let i in r.configData){
          this.$store.commit("changeConfig", {name : i, config : r.configData[i]});
        }//配置数据
        for(let i in r.nodes){
          this.$store.commit("changeNodes", {type : "add", config : {id : i, name : r.nodes[i]}});
        }//节点名称数据
        this.$store.commit("changeRelation", r.relationship);
        for(let i in r.relationship){
          this.plumb.connect({
            source : r.relationship[i][0],
            target : r.relationship[i][1],
            uuids : ["from"+r.relationship[i][0], "to"+r.relationship[i][1]],
          },this.defaultConfig);
        }//连接线
      }
      if(isType != "pro"){        
        this.dragContent.removeAttribute("class");
        this.dragContent.id = "drop"+this.dragContent.id;
        this.dragContent.style.position = "absolute";
        this.dragContent.style.width = "150px";
        this.dragContent.style.height = "30px";
        this.dragContent.style.border = "solid 1px black";        
        this.dragContent.style.left = e.offsetX+"px";
        this.dragContent.style.top = e.offsetY+"px"; 
        space.append(this.dragContent);
        //添加dom事件 
        this.addElement(this.dragContent);
        this.addJsPlumb(this.dragContent);
      }  		
  	},
    setDiagram(order, node){
      let space = document.getElementById("diagram");
      let left = "200px", top=50;
      for(let i = 0; i < order.length; i++){
        let d = document.createElement("div");
        d.id = order[i];
        d.style.left = left;
        d.style.top = top + "px";
        d.style.position = "absolute";
        d.style.width = "130px";
        d.style.height = "30px";
        d.style.border = "solid 1px black";
        let s = document.createElement("span");
        // // s.style.display = "flex";
        // // s.style
        s.innerHTML = node[order[i]];
        // let icon = document.createElement("i");
        // icon.setAttribute("class", "el-icon-circle-check");
        // icon.style.flo
        // s.append(icon);
        d.append(s);
        space.append(d);
        this.addElement(d);
        this.addJsPlumb(d);
        top += 80;
      }
    },
    getOrder(r){      
      let order = [];
      let start = "";
      for(let i = 0; i < r.length; i++){
        if(r[i][0].slice(4,7) == "dat"){
          order.push(r[i][0]);
          start = r[i][0];
          this.$store.commit("changeStart", {type:"clear", detail:""});
          this.$store.commit("changeStart", {type:"add", detail:start});
        }
      }
      let flag = Array(r.length);
      flag.fill(0);
      let time = 0;
      while(flag.some(function(v){ return (v == 0)}) && time < 10){
        for(let i = 0; i < r.length; i++){
          if(flag[i] == 0){
            if(r[i][0] == start){
              order.push(r[i][1]);
              flag[i] = 1;
              start = r[i][1];
            }
          }
        }
        time += 1;
      }//得到执行的顺序
      return order;
    },
  	dragover(e){
      e.preventDefault();
  	},
    addElement(node){        
      let that = this; 
      //点击配置   
      node.addEventListener("click", function(event) { 
        console.log(event.currentTarget.id);        
        let connections = that.plumb.getAllConnections();
        that.$store.commit("changeConfigType", event.currentTarget.id);
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
      this.plumb.addEndpoint(node.id,{anchor : ['Bottom'], uuid :"from"+ node.id}, this.startConfig) ; 
      this.plumb.draggable(node.id,{containment: 'parent'});
      
    },
    delElement(){
      let ele = this.$store.state.menuType.type;
      this.$store.commit("changeNodes", {type : "del", config:{ id: ele}});
      this.plumb.remove(ele);
      if(ele.slice(4,7) == "dat"){
        this.$store.commit("changeStart", {type:"del", detail:ele});
      }
      let c = this.plumb.getAllConnections();
      let r = [];
        for(let i = 0; i < c.length; i++){
            r.push([c[i].sourceId, c[i].targetId]);
          }
        this.$store.commit("changeRelation", r);
    },
    showDetail(){
      this.$store.commit("changeShow", 1);
    },
    

  },
  computed:{
  	dragContent(){
  		return this.$store.state.dragContent;
  	},
    menuOp(){
      return this.$store.state.menuOp;
    },
  },
  watch:{
    menuOp(newV){
      let t = newV.slice(0,3);
      switch(t){
        case "del":
          this.delElement();
          break;
        case "dat":
          this.showDetail();
          break;
        case "res":
          this.showDetail();
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
</style>