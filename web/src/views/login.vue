<template>
    <div class="login-wrap">
      <div class="login-div">
        <div class="left">
          <h2>自动考勤系统</h2>
          <p class="blue-rectangle"></p>
        </div>
        <div class="right">
          <el-form ref="loginForm" :model="loginForm" label-width="60px" :rules="rules">
              <el-form-item label="用户名" prop="username">
                <el-input type="text" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" @keydown.native.enter="login"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="login">登陆</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$http.post('api/user/login',{
            username: this.loginForm.username,
            password: this.loginForm.password
          }).then(res => {
            this.setLogin({
              role: res,
              name: this.loginForm.username,
              isLogin: true
            })
            this.$router.push('/')
          })
        }
      })
    },
    logout () {
      this.$http.get('api/user/logout').then(res => {}, err => {})
      this.resetLogin()
    },
    ...mapMutations(['setLogin','resetLogin'])
  },
  computed: {
    ...mapState(['isLogin','name','role'])
  },
  mounted () {
    this.logout()
  }
}
</script>

<style lang="scss" scoped>
  .login-wrap{
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: url('../resource/imgs/bg.jpg') no-repeat #ccc;
    background-size: cover;
    .login-div{
        width: 600px;
        box-sizing: content-box;
        border: 1px solid transparent;
        overflow: hidden;
        border-radius: 10px;
        display: flex;
        &>div{
          &.left{
            padding: 10px;
            width: 40%;
            background: rgba(0,0,0,.7);
            padding-top: 75px;
            h2{
              text-align: center;
              font-size: 22px;
              color: #fff;
            }
            .blue-rectangle{
              width: 60px;
              position: relative;
              left: 50%;
              height: 4px;
              margin: 30px 0 0 -30px;
              background: #409EFF;
            }
          }
          &.right{
            padding: 30px;
            width: 60%;
            background: #fff;
          }
        }
        &::after {
          content: '';
          display: block;
          clear: both;
        }
        .el-form{
          margin-bottom: -22px;
        }
    }
  }
</style>

<style>
  .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
</style>
