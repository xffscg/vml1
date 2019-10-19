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
        this.getDataView();
        
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
    getDataView(){
      // this.tableCol = [];
      rawDataPreview({ start: 1, end: 50, projectName: "医药病例分类分析" }).then(res => res.data)
        .then(res => {
          console.log(res);
          this.workData.name = this.dragContent.id;
          this.workData.detail["data"] = res.data;
          this.workData.detail["length"] = res.length;
          this.workData.detail["column"] = [];
          for (var key in res.data[0]) {
            this.workData.detail["column"].push({ prop: key })
          }
          this.workData.detail["column"][0].fixed = 'left';
          console.log(this.workData);
          this.$store.commit("changeConfig", this.workData);
          // this.tableCol[0].fixed = 'left'
          // console.log(this.tableCol)
        })
        .catch(e => {
          Message.error(e.errors || 'rawDataPreview接口错误，请重试')
        })
    },
    addElement(){        
      let that = this; 
      //点击配置   
      this.dragContent.addEventListener("click", function(event) { 
        console.log("wait config");         
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
	border :solid 1px black;
	position: relative;
  overflow-y: auto;
}
</style>