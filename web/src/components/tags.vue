<template>
    <el-tabs v-model="activeKey" @tab-click="handleClick" type="card" closable @tab-remove="close">
      <el-tab-pane v-for="item in activedRouter" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
    </el-tabs>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  computed: {
    ...mapState(['activedRouter','activeName']),
    activeKey: {
      set(key) {
        this.setActive(key)
      },
      get() {
        return this.activeName
      }
    }
  },
  methods: {
    handleClick(tab) {
      this.$router.push(tab.name);
    },
    close(key) {
      this.closeTag(key)
      if(this.activedRouter.length == 0){
        this.$router.push('/welcome')
      }else if(this.activeName == key) {
          this.$router.push(this.activedRouter[0].name)
          this.setActive(this.activedRouter[0].name)
      }
    },
    ...mapMutations(['closeTag','setActive','addTag'])
  }
}
</script>

<style lang="scss" scoped>

</style>
