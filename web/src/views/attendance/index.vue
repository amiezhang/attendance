<template>
  <div>
      <lessonComp v-show="showStatus == 0" :CommonObj="commonSpace"></lessonComp>
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
