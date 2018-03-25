<template>
  <div class="wrap">
      <topBar></topBar>
      <div class="main">
        <sideBar></sideBar>
        <div class="content">
          <tags />
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
  </div>
</template>

<script>
import topBar from '@/components/topBar'
import sideBar from '@/components/sideBar'
import tags from '@/components/tags'

export default {
  components: {
    topBar, sideBar, tags
  }
}
</script>

<style lang="scss" scoped>
  .wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .main {
      display: flex;
      height: 100%;
      .content{
        flex: 1;
      }
    }
  }
</style>
