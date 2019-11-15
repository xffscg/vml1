<template>
	<div class="runLog">
		<p>日志</p>
	</div>
</template>

<script>
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult } from '@/api/addProject'
export default {
  name: 'runLog',
  data(){
  	return {
  		interval : 1000,
  	}
  },
  methods : {
  	queryResult(){
  		queryResult({userId : 1, projectId : 32}).then(res=>res.data)
        .then(res=>{
	      	console.log(res);
	     })
        .catch(e=>{
      	    console.log(e);
        })
  	}
  }
};
</script>

<style>
.runLog {
	width: 100%;
	min-height: 250px; 
}
</style>