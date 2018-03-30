<template>
  <div class="lesson">
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
      <el-button size="mini" type="primary" @click="showAdd" style="float:right">添加问题</el-button>
      <hr>
      <h1>{{CommonObj.lessonName}}的题库</h1>
      <div style="width:100%;overflow:hidden">
        <el-table :data="questions">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="题目名字" width="400"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat"></el-table-column>
          <el-table-column label="编辑" width="160">
            <template slot-scope="scope">
              <el-button size="mini"
                @click="handleEdit(scope.row)">修改</el-button>
                <el-button size="mini" type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="提问" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="quest(scope.row)">提问</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <el-pagination @current-change="getQuestion" @size-change="handleSizeChange"
        :current-page.sync="cur" :page-sizes="[10, 50, 100]" background
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <el-dialog :title="title" :visible.sync="dialogVisible" :before-close="beforeClose">
        <el-form :model="questForm" :rules="rules" ref="questForm" label-width="100px">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="questForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="question">
             <el-input v-model="questForm.question" type="textarea" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="答案：" prop="answer">
             <el-input v-model="questForm.answer" type="textarea" :rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="提问" :visible.sync="dialogVisible2" :before-close="beforeClose2">
          <div class="whiteSpace" v-html="questForm.title"></div>
          <div class="whiteSpace content" v-html="questForm.question"></div>
          <el-collapse v-model="activeNames">
                <el-collapse-item title="答案" name="1">
                    <div class="whiteSpace" v-html="questForm.answer"></div>
                </el-collapse-item>
           </el-collapse>
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
      questions: [],
      title: '',
      dialogVisible: false,
      title2: '',
      dialogVisible2: false,
      questForm:{
          id: '',
          title: '',
          question: '',
          answer: '',
      },
      rules: {
          title: [
            { required: true, message: '请输入题目标题', trigger: 'blur' }
          ]
      },
      isAdd: true,
      activeNames: []
    }
  },
  props: ['CommonObj'],
  methods: {
    async getQuestion() {
      let data = await this.$http.get('/api/quest/list', {
        params: {
          id: this.CommonObj.lessonId,
          page: this.cur,
          pageSize: this.pageSize
        }
      })
      this.questions = data.list
      this.total = data.total
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getQuestion()
    },
    handleEdit(row) {
      this.$http.get('api/quest/detail',{
          params:{
              id:row.id
          }
      }).then(res=>{
          this.questForm.question = res.question
          this.questForm.id = row.id
          this.questForm.title = row.title
          this.questForm.answer = res.answer
      })
      this.title = '修改题目信息'
      this.dialogVisible = true
      this.isAdd = false
    },
    quest(row) {
      this.$http.get('api/quest/detail',{
          params:{
              id:row.id
          }
      }).then(res=>{
          this.questForm.question = res.question
          this.questForm.id = row.id
          this.questForm.title = row.title
          this.questForm.answer = res.answer
      })
      this.title2 = row.title.length>32 ? row.title.substring(0,31)+'...':row.title
      this.dialogVisible2 = true
    },
    dateFormat(row, column, cellValue) {
      return utils.DateTransfer(new Date(cellValue),'yyyy-MM-dd hh:mm:ss')
    },
    showAdd(){
        this.title = '添加题目'
        this.dialogVisible = true
        this.isAdd = true
        this.questForm.id = ''
        this.questForm.title = ''
        this.questForm.question = ''
        this.questForm.answer = ''
    },
    submitForm() {
      this.$refs['questForm'].validate((valid) => {
        if (valid) {
          this.sendQuest()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    sendQuest(){
      if(this.isAdd) {
        this.$http.post('api/quest/add',{
          question:this.questForm.question,
          answer:this.questForm.answer,
          lesson_id:this.CommonObj.lessonId,
          title:this.questForm.title
        }).then(res=>{
          this.$message({
              type: 'success',
              message: '添加成功'
          });
          this.getQuestion()
          this.dialogVisible = false
        })
      } else {
        this.$http.post('api/quest/update',{
          id:this.questForm.id,
          question:this.questForm.question,
          answer:this.questForm.answer,
          title:this.questForm.title
        }).then(res=>{
          this.$message({
              type: 'success',
              message: '更新成功'
          });
          this.getQuestion()
          this.dialogVisible = false
        })
      }
    },
    beforeClose(done) {
      this.$refs['questForm'] && this.$refs['questForm'].resetFields();
      done()
    },
    beforeClose2(done) {
      this.activeNames = []
      done()
    },
    handleDelete(row) {
      this.$confirm(`确认要删除这个问题吗？`)
          .then(_ => {
            this.delete(row.id)
          })
          .catch(_ => {});
    },
    delete(id) {
      this.$http.post('api/quest/delete',{id}).then(res=>{
        this.$message({
            type: 'success',
            message: '删除成功'
        });
        this.getQuestion()
      })
    },
  },
  mounted(){
    this.$nextTick(() => {
      this.getQuestion()
    })
  },
  activated(){
    this.$nextTick(() => {
      this.getQuestion()
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
  .whiteSpace{
      white-space: pre-wrap;
      &.content {
          margin: 10px 0;
      }
  }
</style>
