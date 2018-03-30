<template>
  <div class="lesson">
      <h1>选择课程</h1>
      <hr>
      <div style="width:100%;overflow:hidden">
        <el-table :data="lessons">
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="名字" width="200"></el-table-column>
          <el-table-column prop="teach_time" label="上课时间" width="350"></el-table-column>
          <el-table-column prop="area" label="上课地点" width="150"></el-table-column>
          <el-table-column prop="lesson_code" label="选课课号"></el-table-column>
          <el-table-column label="题库列表" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="toDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <el-pagination @current-change="getLesson" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[10, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cur: 1,
      pageSize: 10,
      total: 0,
      lessons: [],
    }
  },
  props: ['CommonObj'],
  methods: {
    async getLesson() {
      let data = await this.$http.get('/api/lesson/list', {
        params: {
          page: this.cur,
          pageSize: this.pageSize
        }
      })
      this.lessons = data.list
      this.total = data.total
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getLesson()
    },
    toDetail(row) {
      this.CommonObj.lessonId = row.id
      this.CommonObj.lessonName = row.name
      this.CommonObj.changePage(1)
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.getLesson()
    })
  },
  activated(){
    this.$nextTick(() => {
      this.getLesson()
    })
  }
}
</script>

<style lang="scss">
  .lesson {
    .el-dialog__body {
      padding: 5px 21px;
      .el-upload__tip{
        margin-top: 0;
      }
      .el-input{
        margin-bottom: 5px;
      }
    }
  }
</style>
