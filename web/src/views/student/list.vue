<template>
  <div class="student-list">
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
      <el-button size="mini" type="primary" @click="showAdd" style="float:right">添加学生</el-button>
      <hr>
      <h1>{{CommonObj.className}}</h1>
      <div style="width:100%;overflow:hidden">
        <el-table :data="students">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="student_code" label="学号" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="150"></el-table-column>
          <el-table-column prop="lnames" label="参加课程"></el-table-column>
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
          <el-table-column label="考勤情况" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini" type="primary"
                @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog title="添加学生" :visible.sync="dialogVisible" :before-close="beforeClose">
        <el-form :model="studentForm" :rules="rules" ref="studentForm" label-width="100px">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="studentForm.name"></el-input>
          </el-form-item>
          <el-form-item label="学号：" prop="student_code">
            <el-input v-model="studentForm.student_code"></el-input>
          </el-form-item>
          <el-form-item label="课程：" prop="less">
            <el-tag :key="tag.id" v-for="tag in dynamicTags" closable :disable-transitions="false"
                    @close="handleClose(tag)">{{tag.name}}</el-tag>
            <el-select v-show="inputVisible" v-model="inputValue" ref="saveTagInput" @change="handleInputConfirm"
                       placeholder="请选择" class="len-mini">
                <el-option v-for="item in options" :key="item.id"
                         :label="item.name" :value="item"></el-option>
            </el-select>
            <el-button v-show="!inputVisible" class="button-new-tag" @click="showInput">+ 参与课程</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :title="studentName" :visible.sync="dialogVisible2">
        <attendTable :list="list" :lesson='true'></attendTable>
        <div class="attend-btns">
            <el-button size="small" type="danger" @click="dialogVisible2 = false">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">确定修改</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import attendTable from '@/components/attendTable'

export default {
  data(){
    return {
      students: [],
      rules: {
          name: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          student_code: [
            { required: true, message: '请输入学生学号', trigger: 'blur' },
            { validator: this.checkCode, trigger: 'blur' }
          ]
      },
      studentForm: {
        id: '',
        name: '',
        student_code: '',
        lesson_ids: '',
        class_id: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      options: [],
      dialogVisible: false,
      isAdd: true,
      studentName: '',
      studentId: '',
      dialogVisible2: false,
      title: '',
      list: [],
    }
  },
  components: {attendTable},
  props: ['CommonObj'],
  methods:{
    async getStudents() {
      let data = await this.$http.get('/api/student/list', {
        params: {
          id: this.CommonObj.classId
        }
      })
      this.students = data.list
    },
    async getLesson(){
      let data = await this.$http.post('/api/lesson/list')
      this.options = data
    },
    handleSubmit() {
      this.$http.post('api/record/sUpdate',{
          sid: this.studentId,
          list: this.list,
      }).then(res => {
          this.dialogVisible2 = false
          this.$message({
              type: 'success',
              message: '更新成功'
          });
      })
    },
    showAdd() {
      this.isAdd=true;
      this.dialogVisible=true;
      this.studentForm.id = ''
      this.studentForm.name = ''
      this.studentForm.student_code = ''
    },
    handleDelete(row) {
      this.$confirm(`确认要删除这个学生吗？`)
          .then(_ => {
            this.delete(row.id)
          })
          .catch(_ => {});
    },
    delete(id) {
      this.$http.post('api/student/delete',{id}).then(res=>{
        this.$message({
            type: 'success',
            message: '删除成功'
        });
        this.updatePage()
      })
    },
    handleEdit(row) {
      this.isAdd = false
      this.dialogVisible = true
      this.studentForm.id = row.id
      this.studentForm.name = row.name
      this.studentForm.student_code = row.student_code
      this.options.forEach(item=>{
        row.lesson_ids.split(',').forEach(id=>{
          if(id==item.id) this.dynamicTags.push(item)
        })
      })
    },
    detail(row){
      this.studentId = row.id
      this.studentName = row.name
      this.dialogVisible2 = true
      this.$http.get('api/record/sDetail',{
          params:{
              id: row.id
          }
      }).then(res => {
          this.list = res
      })
    },
    submitForm() {
      this.$refs['studentForm'].validate((valid) => {
        if (valid) {
          this.sendStu()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    sendStu(){
      if(this.isAdd) {
        this.$http.post('api/student/add',{
          student_code:this.studentForm.student_code,
          name:this.studentForm.name,
          class_id:this.CommonObj.classId,
          lesson_ids:this.dynamicTags.map(item=>item.id).join(',')
        }).then(res=>{
          this.$message({
              type: 'success',
              message: '添加成功'
          });
          this.updatePage()
          this.dialogVisible = false
        })
      } else {
        this.$http.post('api/student/update',{
          id:this.studentForm.id,
          student_code:this.studentForm.student_code,
          name:this.studentForm.name,
          lesson_ids:this.dynamicTags.map(item=>item.id).join(',')
        }).then(res=>{
          this.$message({
              type: 'success',
              message: '更新成功'
          });
          this.updatePage()
          this.dialogVisible = false
        })
      }
    },
    updatePage() {
      this.getLesson()
      this.getStudents()
      this.clearForm()
    },
    checkCode(rule, value, callback)  {
        if (!/^\d{12}$/.test(value)) {
          callback(new Error('学号应该为12位数字'));
        } else {
          callback();
        }
    },
    clearForm(){
      this.$refs['studentForm'] && this.$refs['studentForm'].resetFields();
      this.inputVisible = false;
      this.inputValue = '';
      this.dynamicTags = []
    },
    beforeClose(done) {
      this.clearForm()
      done()
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.reference.$el.click();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      let isExist = this.dynamicTags.filter(item=>item.id==inputValue.id).length > 0
      if(isExist) {
        this.$message({
            type: 'error',
            message: '不能选择重复的课程'
        });
      } else if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getStudents()
      this.getLesson()
    })
  },
  activated() {
    this.$nextTick(()=>{
      this.getStudents()
      this.getLesson()
    })
  },
  watch:{
    'CommonObj.className':{
      handler(){
        this.getStudents()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
  .student-list{
    .el-form-item__content {
      .len-mini{
        width: 150px;
        .el-input input{
          height: 30px;
        }
      }
      .button-new-tag{
        padding: 8px 15px;
      }
    }
    .el-tag{
      margin-right: 10px;
    }
  }
  .attend-btns{
      button {
          float: right;
          margin-left: 15px;
      }
      margin-top: 15px;
      overflow: hidden;
  }
</style>
