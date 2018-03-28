<template>
  <div>
      <div style="width:100%;overflow:hidden">
        <el-table :data="lessons">
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="名字" width="200"></el-table-column>
          <el-table-column prop="teach_time" label="上课时间" width="250"></el-table-column>
          <el-table-column prop="area" label="上课地点" width="150"></el-table-column>
          <el-table-column prop="lesson_code" label="选课课号"></el-table-column>
          <el-table-column label="考勤" width="120">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="attendance(scope.row)">开始考勤</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination @current-change="getLesson" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[15, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return{
      cur: 1,
      pageSize: 15,
      total: 0,
      lessons: [],
    }
  },
  props: ['CommonObj'],
  methods:{
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
    attendance(row){
      this.CommonObj.lessonId = row.id
      this.CommonObj.lessonName = row.name
      this.CommonObj.series = parseInt(row.attend_count)+1
      this.CommonObj.changePage(1)
    }
  },
  activated(){
    this.$nextTick(() => {
      this.getLesson()
    })
  }
}
</script>

<style lang="scss">

</style>
