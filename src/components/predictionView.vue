<template>
  <div>
    <span>预测</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pathID: this.$route.query.id
    }
  },
  mounted () {
    console.log(this.pathID)
  }
}
</script>
<style scoped>
</style>
