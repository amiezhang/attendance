<template>
  <div class="myClass">
      <h1>选择班级</h1>
      <hr>
      <div style="width:100%;overflow:hidden">
        <el-table :data="classes">
          <el-table-column prop="id" label="ID" width="200"></el-table-column>
          <el-table-column prop="name" label="名字"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" :formatter="dateFormat"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini" type="info"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="成员" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <el-pagination @current-change="getClass" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[10, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      
      <el-dialog title="编辑课程" :visible.sync="dialogVisible">
        <el-form :model="classDetail" ref="classDetail" label-width="100px">
          <el-form-item label="id">
            <el-input :disabled="true" v-model="classDetail.id"></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="name">
            <el-input :maxlength="64" v-model="classDetail.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">确定</el-button>
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
      classes: [],
      dialogVisible: false,
      classDetail: {
        id: '',
        name: '',
      }
    }
  },
  props: ['CommonObj'],
  methods:{
    async getClass() {
      let data = await this.$http.get('/api/student/class', {
        params: {
          page: this.cur,
          pageSize: this.pageSize
        }
      })
      this.total = data.total
      this.classes = data.list
    },
    detail(row){
      this.CommonObj.classId = row.id
      this.CommonObj.className = row.name
      this.CommonObj.changePage(1)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getClass()
    },
    dateFormat(row, column, cellValue) {
      return utils.DateTransfer(new Date(cellValue),'yyyy-MM-dd hh:mm:ss')
    },
    handleEdit(row) {
      this.dialogVisible = true
      this.classDetail = Object.assign({},row)
    },
    handleDelete(row) {
      this.$confirm(`确认要删除这个班级？`)
          .then(_ => {
            this.delete(row.id)
          })
          .catch(_ => {});
    },
    delete(id) {
      this.$http.post('api/student/cDelete',{id}).then(res=>{
        this.$message({
            type: 'success',
            message: '删除成功'
        });
        this.getClass()
      })
    },
    submitForm() {
      this.$http.post('/api/student/cUpdate',this.classDetail).then(res=>{
        this.$message({
            type: 'success',
            message: '更新成功'
        });
        this.getClass()        
        this.dialogVisible = false;
      })
    },
  },
  mounted() {
    this.$nextTick(()=>{
      this.getClass()
    })
  },
  activated() {
    this.$nextTick(()=>{
      this.getClass()
    })
  }
}
</script>

<style lang="scss">

</style>
