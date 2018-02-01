<template>
    <div class="login-wrap">
      <div class="login-div">
        <h2>自动考勤系统</h2>
        <el-form ref="form" label-width="60px" @keydown.enter="login">
            <el-form-item label="用户名">
              <el-input type="text" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    login () {

    }
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
    .login-div{
        width: 6rem;
    }
    @media screen and (min-width: 1080px) {
      .login-div{
        width: 4rem;
      }
    }
    h2{
      text-align: center;
    }
  }
</style>
