<template>
  <header>
      <div class="left">
        <span>{{isCollapse ? '考勤' : '自动考勤系统'}}</span>
        <span class="fa fa-bars" @click="triggerCollapse"></span>
      </div>
      <div class="right">
        你好，{{name}}&nbsp;&nbsp;
        <router-link to="/reset">修改密码</router-link>
        <router-link to="/login">退出登陆</router-link>
      </div>
  </header>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  computed: {
    ...mapState(['isCollapse']),
    name() {
      return localStorage.username
    }
  },
  methods:{
    ...mapMutations(['triggerCollapse'])
  }
}
</script>

<style lang="scss" scoped>
  header{
    display: block;
    background: linear-gradient(to bottom, #0D3863, #000);
    overflow: hidden;
    height: 54px;
    line-height: 52px;
    padding: 0 10px;
  }
  .left {
    float: left;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    span{
      cursor: pointer;
    }
  }
  .right {
    font-size: 18px;
    color: #fff;
    a {
      color: #fff;
    }
    float: right;
  }
</style>
