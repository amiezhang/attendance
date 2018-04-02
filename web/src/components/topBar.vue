<template>
  <header>
      <div class="left">
        <span>{{isCollapse ? '考勤' : '自动考勤系统'}}</span>
        <span class="fa fa-bars" @click="triggerCollapse"></span>
      </div>
      <div class="right">
        你好，{{name}}&nbsp;&nbsp;
        <span @click="dialogVisible=true">修改密码</span>
        <router-link to="/login">退出登陆</router-link>
      </div>
      <el-dialog title="修改密码" :visible.sync="dialogVisible">
        <el-form :model="passForm" ref="passForm" label-width="100px" :rules="rules">
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="passForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确定新密码" prop="confirmPassword">
            <el-input type="password" v-model="passForm.confirmPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPass()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </header>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  data() {
    return {
      dialogVisible: false,
      passForm: {
        password: '',
        confirmPassword: ''
      },
      rules: {
         password: [
           { required: true, message: '请输入密码', trigger: 'blur' },
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
  computed: {
    ...mapState(['isCollapse']),
    name() {
      return localStorage.username
    }
  },
  methods:{
    ...mapMutations(['triggerCollapse']),
    submitPass() {
      this.$refs['passForm'].validate((valid) => {
        if (valid) {
          this.$http.post('/api/user/minePass',{
            password: this.passForm.confirmPassword
          }).then(res=>{
            this.$message({
                type: 'success',
                message: '更新成功'
            });
            this.dialogVisible = false;
            this.passForm.password = ''
            this.passForm.confirmPassword = ''
          })
        }
      });
    },
    validatePass(rule, value, callback) {
        if (this.passForm.password != this.passForm.confirmPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
    },
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
    a,span {
      color: #fff;
      cursor: pointer;
      &:hover{
        text-decoration: underline;
      }
    }
    float: right;
  }
</style>
