<template>
  <div class="wrap" v-if="isLogin">
      <topBar></topBar>
      <div class="main">
        <sideBar></sideBar>
        <div class="content" :class="isCollapse?'collapse':'normal'">
          <tags />
          <div class="router">
            <keep-alive>
                <!--前端路由-->
                <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import topBar from '@/components/topBar'
import sideBar from '@/components/sideBar'
import tags from '@/components/tags'
import {mapState} from 'vuex'

export default {
  data() {
    return {
      isLogin: false
    }
  },
  components: {
    topBar, sideBar, tags
  },
  computed: {
    ...mapState(['isCollapse'])
  },
  beforeCreate () {
    this.$http.get('api/user/isLogin').then(res=>{
      this.isLogin = true
    })
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
        &.collapse{
          width: calc(100% - 65px)
        }
        &.normal {
          width: calc(100% - 160px)
        }
        .router {
          padding: 10px 15px;
          height: calc(100% - 61px);
          overflow-y: scroll;
          &::-webkit-scrollbar {
            width: 5px;
          }
          &::-webkit-scrollbar-thumb{
            background: #666;
          }
        }
      }
    }
  }
</style>
