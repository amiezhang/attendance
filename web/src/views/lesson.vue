<template>
  <div class="lesson">
      <el-button size="mini" type="primary" @click="dialogVisible = true">导入新课程</el-button>
      <hr>
      <div style="width:100%;overflow:hidden">
        <el-table :data="lessons">
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="名字" width="150"></el-table-column>
          <el-table-column prop="teach_time" label="上课时间"></el-table-column>
          <el-table-column prop="area" label="上课地点" width="150"></el-table-column>
          <el-table-column prop="lesson_code" label="选课课号"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[15, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <el-dialog title="导入新课程" :visible.sync="dialogVisible" width="403px" :before-close="beforeClose">
        <el-input v-model="lName" placeholder='课程名称（如"电机学（12电气56班）"）'></el-input>
        <el-upload ref="uploadDiv" :limit="1" :auto-upload="false" drag :on-change="beforeUpload"
                   :data="{lessonName: lName}" action="api/lesson/import">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xls文件，且不超过1Mb</div>
        </el-upload>
        <el-button size="mini" type="primary" @click="upload">上传并导入</el-button>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      excelFile: [],
      lName: '',
      cur: 1,
      pageSize: 15,
      total: 100,
      dialogVisible: false,
      lessons: [
        {
          id: 0,
          name: '搞这些',
          teach_time: '周一第3,4节{第1-13周};周四第11,12,13节{第1-13周}',
          area: '3507;3603',
          lesson_code: '(2014-2015-1)-8211170-30003639-1',
        }
      ]
    }
  },
  methods: {
    importLesson() {

    },
    handleEdit() {

    },
    handleDelete(row) {
      this.$confirm(`确认要删除这门课程？`)
          .then(_ => {
            this.delete(row.id)
          })
          .catch(_ => {});
    },
    delete(id) {
      console.log('删除了'+id)
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange() {

    },
    beforeClose(done) {
      this.$refs['uploadDiv'].clearFiles()
      this.lName = ''
      done()
    },
    beforeUpload(file){
      console.log(file)
      const isXls = (file.name).endsWith('.xls');
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isXls) {
        this.$message.error('只能上传xls文件!');
        this.$refs['uploadDiv'].clearFiles()
      } else if (!isLt1M) {
        this.$message.error('上传的文件大小不能超过1M');
        this.$refs['uploadDiv'].clearFiles()
      }
      this.lName = this.lName ? this.lName : file.name.replace('.xls','')
    },
    upload() {
      this.lName = ''
      this.$refs['uploadDiv'].submit()
    }
  }
}
</script>

<style lang="scss">
  .lesson {
    .el-pagination {
      margin-top: 20px;
      float: right;
    }
    .el-dialog__body {
      padding: 5px 21px;
      .el-upload__tip{
        margin-top: 0;
      }
      .el-input{
        margin-bottom: 5px;
      }
      .el-button{
        display: block;
        margin: 10px auto;
      }
    }
  }
</style>
