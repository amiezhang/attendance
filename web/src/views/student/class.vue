<template>
  <div class="myClass">
      <h1>选择班级</h1>
      <hr>
      <div style="width:100%;overflow:hidden">
        <el-table :data="classes">
          <el-table-column prop="id" label="ID" width="200"></el-table-column>
          <el-table-column prop="name" label="名字"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" :formatter="dateFormat"></el-table-column>
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
        :current-page.sync="cur" :page-sizes="[15, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>

<script>
import utils from '@/utils'

export default {
  data() {
    return {
      cur: 1,
      pageSize: 15,
      total: 0,
      classes: []
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
    }
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
