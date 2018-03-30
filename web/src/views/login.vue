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
                <el-button type="warning" @click="dialogVisible = true">注册</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog title="注册" :visible.sync="dialogVisible" :before-close="beforeClose">
        <el-form :model="regForm" ref="regForm" label-width="100px" :rules="regRule">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="regForm.username"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="regForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确定新密码" prop="confirmPassword">
            <el-input type="password" v-model="regForm.confirmPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="regUser()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  data () {
    return {
      dialogVisible: false,
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
      },
      regForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      regRule: {
         username: [
           { required: true, message: '请输入用户名', trigger: 'blur' },
           { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
         ],
         password: [
           { required: true, message: '请输入新密码', trigger: 'blur' },
           { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
         ],
         confirmPassword: [
           { required: true, message: '请输入再次输入新密码', trigger: 'blur' },
           { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
           { validator: this.validatePass, trigger: 'blur' }
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
            this.$router.push('/welcome')
            localStorage.username = this.loginForm.username
            localStorage.role = res
            this.clearTag()
          })
        }
      })
    },
    logout () {
      this.$http.get('api/user/logout').then(res => {}, err => {})
    },
    beforeClose(done) {
      this.regForm.username = ''
      this.regForm.password = ''
      this.regForm.confirmPassword = ''
      this.$refs['regForm'] && this.$refs['regForm'].resetFields();
      done()
    },
    validatePass(rule, value, callback) {
        if (this.regForm.password != this.regForm.confirmPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
    },
    regUser() {
      this.$refs['regForm'].validate((valid) => {
        if (valid) {
          this.$http.get('api/user/reg',{
           params:{
              username: this.regForm.username,
              password: this.regForm.password
           }
          }).then(res => {
            this.$message({
                type: 'success',
                message: '注册成功'
            });
            this.dialogVisible = false
          })
        }
      })
    },
    ...mapMutations(['clearTag'])
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
  .right .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
</style>
