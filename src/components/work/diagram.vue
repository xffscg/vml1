<template>
	<div id="diagram" @drop="drop($event)" @dragover.prevent="dragover($event)"></div>
</template>

<script>
import $ from 'jquery'
import {jsPlumb} from 'jsplumb'
export default {
  name: 'diagram',
  data(){
  	return {
  		plumb:null,
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
    // this.plumb.importDefaults({
    //   ConnectionsDetachable: false
    // })
  },
  methods:{
  	drop(e){
      console.log(3);
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
      let that = this; 		
			space.append(this.dragContent); 
      //监听元素再次拖拽			
			document.getElementById(this.dragContent.id).addEventListener("dragstart", function(event) {	    			
				that.$store.commit('changeDrag', event.currentTarget);
			}, false);
      //为元素添加锚点      
      this.plumb.addEndpoint(this.dragContent.id,{anchor : ['Top']}, this.defaultConfig);
      this.plumb.addEndpoint(this.dragContent.id,{anchor : ['Bottom']}, this.defaultConfig) ; 
      this.plumb.draggable(this.dragContent.id);
  		
  	},
  	dragover(e){
      e.preventDefault();
  	},

  },
  computed:{
  	dragContent(){
  		return this.$store.state.dragContent;
  	}
  }
};
</script>

<style scoped>
#diagram {
	width:100%;
	height: 100%;
	border :solid 1px black;
	position: absolute;
}
</style>