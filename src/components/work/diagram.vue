<template>
	<div id="diagram" @drop="drop($event)" @dragover.prevent="dragover($event)">
   <RightMenu v-show="showMenu"></RightMenu> 
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
      workData : {name : "", detail : {}},
      // 将isSource和isTarget设置成true，那么久可以用户在拖动时，自动创建链接。
  		defaultConfig : {
        isSource: true,
        isTarget: true,
        connector: 'Flowchart',
        endpoint: 'Dot',
        paintStyle: {
          fill: 'white',
          outlineStroke: 'black',
          strokeWidth: 1
        },
        endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 1 },
        hoverPaintStyle: {
          outlineStroke: 'lightblue'
        },
        connectorStyle: {
          outlineStroke: '#51514A',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        },
        overlays : [['Arrow', {width: 8, length: 8, location: 1 }]]
      },
  	}
  },
  mounted(){
  	this.plumb = jsPlumb.getInstance();
    this.plumb.setContainer('diagram');    
    let that = this;
    this.plumb.bind('click', function (conn, originalEvent) {
      console.log(that.plumb);
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
  		let space = document.getElementById('diagram');
  		e.preventDefault();
      let isType = this.dragContent.id.slice(0,3);
      if(isType == "alg"){
        console.log("alg");
      }else if(isType == "pre"){
        console.log("pre");
      }else if(isType == "exp"){
        console.log("exp");
      }else{
        console.log("data");
        this.$store.commit("changeStart", {type:"add", detail:"drop"+this.dragContent.id});
        // this.getDataView();
        
      }
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
      this.addElement();
      this.addJsPlumb();  		
  	},
  	dragover(e){
      e.preventDefault();
  	},
    addElement(){        
      let that = this; 
      //点击配置   
      this.dragContent.addEventListener("click", function(event) { 
        console.log(event.currentTarget.id);        
        let connections = that.plumb.getAllConnections();
        // let r = []
        // for(let i = 0; i < connections.length; i++){
        //   r.push([connections[i].sourceId, connections[i].targetId]);
        // }
        // console.log(r);
        // that.$store.commit("changeRelation", r);
        that.$store.commit("changeConfigType", event.currentTarget.id);
      }, false);
      //阻止右键的默认事件
      this.dragContent.addEventListener("contextmenu", function(event) {          
        event.preventDefault();
      }, false);
      //右键弹出操作菜单
      this.dragContent.addEventListener("mouseup", function(event) {          
        if(event.button === 2){
          let ele = $("#"+event.currentTarget.id);
          let left = parseInt(ele.css("left").slice(0,-2))+parseInt(ele.css("width").slice(0,-2)) + 3 + "px";
          let para = {type:event.currentTarget.id,left:left, top:ele.css("top")}
          that.$store.commit("changeMenu", para);
          that.showMenu = true;
        }
      }, false);
    },
    addJsPlumb(){
      this.plumb.addEndpoint(this.dragContent.id,{anchor : ['Top']}, this.defaultConfig);
      this.plumb.addEndpoint(this.dragContent.id,{anchor : ['Bottom']}, this.defaultConfig) ; 
      this.plumb.draggable(this.dragContent.id,{containment: 'parent'});
      
    },
    delElement(){
      let ele = this.$store.state.menuType.type;
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
      this.$store.commit("changeShow", true);
    }

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
	height: 100%;
	position: relative;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>