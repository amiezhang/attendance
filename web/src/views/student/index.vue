<template>
  <div>
      <classComp v-if="showStatus == 0" :CommonObj="commonSpace"></classComp>
      <listComp v-if="showStatus == 1" :CommonObj="commonSpace"></listComp>
  </div>
</template>

<script>
import classComp from './class'
import listComp from './list'

export default {
    data(){
        return{
            showStatus: 0,
            commonSpace: {
                classId: '',
                className: '',
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
        classComp,listComp
    }
}
</script>

<style lang="scss">

</style>
