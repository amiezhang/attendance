<template>
  <section :class="isCollapse?'collapse':''">
      <el-menu
      :default-openeds=[1,2]
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      background-color="transparent"
      text-color="#fff"
      active-text-color = "#fff"
      @select="linkTo">
      <el-menu-item index="/attendance">
        <i class="el-icon-edit"></i>
        <span slot="title">课堂考勤</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>数据管理</span>
        </template>
        <el-menu-item index="/lesson">
            <span slot="title">我的课程</span>
        </el-menu-item>
        <el-menu-item index="/class">
            <span slot="title">我的班级</span>
        </el-menu-item>
        <el-menu-item index="/student">
            <span slot="title">我的学生</span>
        </el-menu-item>
        <el-menu-item index="/question">
            <span slot="title">我的题库</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="fa fa-user"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user">
            <span slot="title">用户列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </section>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
    methods: {
        linkTo(key) {
            let menus = {
                '/attendance': '课堂考勤',
                '/lesson': '我的课程',
                '/class': '我的班级',
                '/student': '我的学生',
                '/question': '我的题库',
                '/user': '用户列表',
            }
            this.$router.push(key)
            this.addTag({name:key, label: menus[key]})
        },
        ...mapMutations(['addTag'])
    },
    computed:{
        ...mapState(['isCollapse'])
    }
}
</script>

<style lang="scss" scoped>
    section {
        width: 160px;
        background: linear-gradient(to bottom, #0D3863 50%, #000 100%);
        overflow: hidden;
        transition: all ease .3s;
        .el-menu-vertical-demo{
            height: 100%;
            border: none;
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 160px;
            min-height: 400px;
        }
        .el-icon-edit,.el-icon-tickets,.fa-user{
            color: #fff
        }
        .fa-user{
            font-size: 18px;
            margin: 0 10px 0 5px;
        }
        &.collapse {
            width: 65px;
        }
    }
</style>

<style>
    .el-menu--popup{
        background: #0D3863!important;
        
    }
    .el-menu--popup li:hover {
        background: rgba(255,255,255,.2)!important;
    }
</style>
