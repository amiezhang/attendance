<template>
  <div>
      <div style="width:100%;overflow:hidden">
        <el-table :data="users">
          <el-table-column prop="id" label="ID" width="120"></el-table-column>
          <el-table-column prop="login_name" label="用户名"></el-table-column>
          <el-table-column prop="role" label="角色" :formatter="roleFormat"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="primary"
                @click="toDetail(scope.row)">修改</el-button>
              <el-button size="mini" type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="修改密码" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="info"
                @click="changePass(scope.row)">修改密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <el-pagination @current-change="getUser" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[10, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <el-dialog title="修改密码" :visible.sync="dialogVisible" :before-close="beforeClose">
        <el-form :model="userPass" ref="userPass" label-width="100px" :rules="passRule">
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="userPass.pass"></el-input>
          </el-form-item>
          <el-form-item label="确定新密码" prop="confirmPass">
            <el-input type="password" v-model="userPass.confirmPass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPass()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="编辑课程" :visible.sync="dialogVisible2">
        <el-form :model="userDetail" ref="userDetail" label-width="100px">
          <el-form-item label="用户名" prop="loginName">
            <el-input disabled v-model="userDetail.loginName"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
             <el-radio v-model="userDetail.role" :label="0">普通用户</el-radio>
             <el-radio v-model="userDetail.role" :label="1">管理员</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRole()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils'

export default {
    data() {
      return {
        cur: 1,
        pageSize: 10,
        total: 0,
        dialogVisible: false,
        dialogVisible2: false,
        users: [],
        id: '',
        userPass: {
          pass: '',
          confirmPass: ''
        },
        userDetail: {
          loginName: '',
          role: 0
        },
        passRule: {
          pass: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
          ],
          confirmPass: [
            { required: true, message: '请输入再次输入新密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
            { validator: this.validatePass, trigger: 'blur' }
          ]
        },
      }
  },
  methods: {
    async getUser() {
      let data = await this.$http.get('/api/user/list', {
        params: {
          page: this.cur,
          pageSize: this.pageSize
        }
      })
      this.users = data.list
      this.total = data.total
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUser()
    },
    changePass(row) {
      this.id = row.id
      this.dialogVisible = true;
    },
    submitPass() {
      this.$refs['userPass'].validate((valid) => {
        if (valid) {
          this.$http.post('/api/user/updatePass',{
            id:this.id,
            password: this.userPass.confirmPass
          }).then(res=>{
            this.$message({
                type: 'success',
                message: '更新成功'
            });
            this.getUser()        
            this.dialogVisible = false;
            this.userPass.pass = ''
            this.userPass.confirmPass = ''
          })
        }
      });
    },
    submitRole() {
      this.$refs['userDetail'].validate((valid) => {
        if (valid) {
          this.$http.post('/api/user/updateRole',{
            id:this.id,
            role: this.userDetail.role
          }).then(res=>{
            this.$message({
                type: 'success',
                message: '更新成功'
            });
            this.getUser()        
            this.dialogVisible2 = false;
          })
        }
      });
    },
    roleFormat(row, column, cellValue) {
      return cellValue == 0 ? '普通用户' : '管理员'
    },
    dateFormat(row, column, cellValue) {
      return utils.DateTransfer(new Date(cellValue),'yyyy-MM-dd hh:mm:ss')
    },
    validatePass(rule, value, callback) {
        if (this.userPass.pass != this.userPass.confirmPass) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
    },
    toDetail(row) {
      this.dialogVisible2 = true
      this.id = row.id
      this.userDetail.loginName = row.login_name
      this.userDetail.role = row.role
    },
    beforeClose(done) {
      this.userPass.pass = ''
      this.userPass.confirmPass = ''
      this.$refs['userPass'] && this.$refs['userPass'].resetFields();
      done()
    },
    beforeClose2(done) {
      this.activeNames = []
      done()
    },
    handleDelete(row) {
      this.$confirm(`确认要删除这个用户吗？`)
          .then(_ => {
            this.delete(row.id)
          })
          .catch(_ => {});
    },
    delete(id) {
      this.$http.post('api/user/delete',{id}).then(res=>{
        this.$message({
            type: 'success',
            message: '删除成功'
        });
        this.getUser()
      })
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.getUser()
    })
  },
  activated(){
    this.$nextTick(() => {
      this.getUser()
    })
  }
}
</script>

<style lang="scss">

</style>
