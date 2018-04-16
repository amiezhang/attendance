<template>
  <div>
      <!-- 考勤操作页 -->
      <lessonComp v-if="showStatus == 0" :CommonObj="commonSpace"></lessonComp>
      <!-- 课程列表页 -->
      <listComp v-if="showStatus == 1" :CommonObj="commonSpace"></listComp>
  </div>
</template>

<script>
import lessonComp from './lesson'
import listComp from './list'

export default {
    data(){
        return{
            showStatus: 0,
            commonSpace: {
                lessonId: '',
                lessonName: '',
                series: '',
                changePage: this.changePage.bind(this)
            }
        }
    },
    methods:{
        changePage(page){
            this.showStatus = page
        }
    },
    components: {
        lessonComp,listComp
    }
}
</script>

<style lang="scss">

</style>
