<template>
  <div>
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
      <el-button size="mini" type="primary" @click="dialogVisible = true" style="float:right">添加学生</el-button>
      <hr>
      <h1>{{CommonObj.className}}</h1>
      <div style="width:100%;overflow:hidden">
        <el-table :data="students">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="student_code" label="学号" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="150"></el-table-column>
          <el-table-column prop="lesson_ids" label="参加课程" :formatter="lessons"></el-table-column>
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

      <el-dialog title="添加学生" :visible.sync="dialogVisible">
        <el-form :model="studentForm" :rules="rules" ref="studentForm" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="studentForm.name"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="student_code">
            <el-input v-model="studentForm.student_code"></el-input>
          </el-form-item>
          <el-form-item label="课程" prop="less">
            <el-input v-model="studentForm.lesson_ids"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      students: [],
      dialogVisible: false,
      rules: {
          name: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          student_code: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' },
            { length: 12 , message: '学号长度为12位', trigger: 'blur' }
          ]
      },
      studentForm: {
        name: '',
        student_code: '',
        lesson_ids: '',
        class_id: '',
        createTime: '',
      }
    }
  },
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
    lessons() {
      return 'test'
    },
    detail(row){
      this.CommonObj.studentCode = row.student_code
      this.CommonObj.studentName = row.name
      this.CommonObj.changePage(2)
    },
    submitForm() {
      this.$refs['studentForm'].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getStudents()
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

</style>
