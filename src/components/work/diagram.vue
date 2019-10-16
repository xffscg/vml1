<template>
	<div id="diagram" @drop="drop($event)" @dragover.prevent="dragover($event)">
   <RightMenu v-show="showMenu"></RightMenu> 
  </div>
</template>

<script>
import {jsPlumb} from 'jsplumb'
import RightMenu from './rightMenu'
export default {
  name: 'diagram',
  components : {
    RightMenu
  },
  data(){
  	return {
  		plumb:null,
      showMenu : false,
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
  		this.dragContent.removeAttribute("class");
  		this.dragContent.id = "drop"+this.dragContent.id;
  		this.dragContent.style.position = "absolute";
  		this.dragContent.style.width = "80px";
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
        console.log("wait config");         
      }, false);
      //阻止右键的默认事件
      this.dragContent.addEventListener("contextmenu", function(event) {          
        event.preventDefault();
      }, false);
      //右键弹出操作菜单
      this.dragContent.addEventListener("mouseup", function(event) {          
        if(event.button === 2){
          let para = {type:event.currentTarget.id,left:event.clientX, top:event.clientY}
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
      console.log("ele"+ele);
      this.plumb.remove(ele);
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
      if(newV.slice(0,3) == "del"){
        this.delElement();
      }
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
}
</style>