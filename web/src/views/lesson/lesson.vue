<template>
  <div class="lesson">
      <el-button size="mini" type="primary" @click="dialogVisible = true">导入新课程</el-button>
      <hr>
      <div style="width:100%;overflow:hidden">
        <el-table :data="lessons">
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="名字" width="200"></el-table-column>
          <el-table-column prop="teach_time" label="上课时间" width="250"></el-table-column>
          <el-table-column prop="area" label="上课地点" width="150"></el-table-column>
          <el-table-column prop="lesson_code" label="选课课号"></el-table-column>
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
          <el-table-column label="考勤记录" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="toDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <el-pagination @current-change="getLesson" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[15, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <el-dialog title="导入新课程" :visible.sync="dialogVisible" width="403px" :before-close="beforeClose">
        <el-input v-model="lName" placeholder='课程名称（如"电机学（12电气56班）"）'></el-input>
        <el-upload ref="uploadDiv" :limit="1" :auto-upload="false" drag :on-change="handleChange"
                  :on-success="clearUpload" :data="{lessonName: lName}" action="api/lesson/import">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xls文件，且不超过1Mb</div>
        </el-upload>
        <el-button size="mini" type="primary" @click="upload" style="display:block;margin:10px auto;">上传并导入</el-button>
      </el-dialog>

      <el-dialog title="编辑课程" :visible.sync="dialogVisible2">
        <el-form :model="lessonDetail" ref="lessonDetail" label-width="100px">
          <el-form-item label="id">
            <el-input :disabled="true" v-model="lessonDetail.id"></el-input>
          </el-form-item>
          <el-form-item label="选课编号" prop="lesson_code">
            <el-input :disabled="true" v-model="lessonDetail.lesson_code"></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="name">
            <el-input :maxlength="64" v-model="lessonDetail.name"></el-input>
          </el-form-item>
          <el-form-item label="上课时间" prop="teach_time">
            <el-input :maxlength="128" v-model="lessonDetail.teach_time"></el-input>
          </el-form-item>
          <el-form-item label="上课地点" prop="area">
            <el-input :maxlength="32" v-model="lessonDetail.area"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">确定</el-button>
          </el-form-item>
        </el-form>
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
      total: 0,
      dialogVisible: false,
      dialogVisible2: false,
      lessons: [],
      lessonDetail: {
        id: '',
        name: '',
        teach_time: '',
        area: '',
        lesson_code: '',
      }
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
    handleEdit(row) {
      this.dialogVisible2 = true
      this.lessonDetail = Object.assign({},row)
    },
    handleDelete(row) {
      this.$confirm(`确认要删除这门课程？`)
          .then(_ => {
            this.delete(row.id)
          })
          .catch(_ => {});
    },
    delete(id) {
      this.$http.post('api/lesson/delete',{id}).then(res=>{
        this.$message({
            type: 'success',
            message: '删除成功'
        });
        this.getLesson()
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getLesson()
    },
    clearUpload() {
      this.$refs['uploadDiv'].clearFiles()
      this.lName = ''
    },
    beforeClose(done) {
      this.clearUpload()
      done()
    },
    handleChange(file){
      if(file.response && file.response.code == 1) {
        this.getLesson()
        this.clearUpload()
        this.dialogVisible = false
        this.$message.success('上传成功')
        return
      } else if(file.response && file.response.code == 0) {
        this.clearUpload()
        this.dialogVisible = false
        this.$message.error('上传失败,'+file.response.msg)
        return
      } else if(file.status == "fail") {
        this.lName = ''
        this.$message.error('上传失败,服务器后台错误')
        return
      }
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
    },
    submitForm() {
      this.$http.post('/api/lesson/update',this.lessonDetail).then(res=>{
        this.$message({
            type: 'success',
            message: '更新成功'
        });
        this.getLesson()        
        this.dialogVisible2 = false;
      })
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
