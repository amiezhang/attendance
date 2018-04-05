<template>
  <div>
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
      <el-button class="right-lbtn" size="mini" type="success" @click="exportExcel">导出考勤表</el-button>
      <el-button class="right-lbtn" size="mini" type="warning" @click="dialogVisible2 = true">配置考勤分数</el-button>
      
      <hr>
      <h1>{{CommonObj.lessonName}}</h1>
      <el-table :data="list">
        <el-table-column prop="order" label="考勤序列"></el-table-column>
        <el-table-column prop="date" label="考勤时间" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="count" label="抽查人数"></el-table-column>
        <el-table-column label="考勤情况" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini" type="primary"
              @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="title" :visible.sync="dialogVisible">
        <attendTable :list="students"></attendTable>
        <div class="attend-btns">
            <el-button size="small" type="danger" @click="dialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">确定修改</el-button>
        </div>
      </el-dialog>
      <el-dialog title="配置考勤分数" :visible.sync="dialogVisible2">
        <el-form :inline="true" :model="scoreForm" ref="scoreForm" :rules="rules">
            <el-form-item prop="normal" label="正常:">
                <el-input class="score-input" v-model="scoreForm.normal"></el-input>&nbsp;分
            </el-form-item>
            <el-form-item prop="noAttend" label="缺勤:">
                <el-input class="score-input" v-model="scoreForm.noAttend"></el-input>&nbsp;分
            </el-form-item>
            <el-form-item prop="late" label="迟到:">
                <el-input class="score-input" v-model="scoreForm.late"></el-input>&nbsp;分
            </el-form-item>
            <el-form-item prop="early" label="早退:">
                <el-input class="score-input" v-model="scoreForm.early"></el-input>&nbsp;分
            </el-form-item>
            <el-form-item prop="leave" label="请假:">
                <el-input class="score-input" v-model="scoreForm.leave"></el-input>&nbsp;分
            </el-form-item>
            
            <div class="attend-btns">
                <el-button size="small" type="danger" @click="dialogVisible2 = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleSubmit2">确定修改</el-button>
            </div>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils'
import attendTable from '@/components/attendTable'

export default {
    data(){
        return{
            list: [],
            dialogVisible: false,
            dialogVisible2: false,
            title: '',
            students: [],
            series: undefined,
            scoreForm: {
                normal: '',//正常
                noAttend: '', //缺勤
                late: '', //迟到
                early: '', //早退
                leave: '' // 请假
            },
            rules: {
                normal: [
                    { validator: this.validateNum, trigger: 'blur' }
                ],
                noAttend: [
                    { validator: this.validateNum, trigger: 'blur' }
                ],
                late: [
                    { validator: this.validateNum, trigger: 'blur' }
                ],
                early: [
                    { validator: this.validateNum, trigger: 'blur' }
                ],
                leave: [
                    { validator: this.validateNum, trigger: 'blur' }
                ],
            }
        }
    },
    components: {attendTable},
    props: ['CommonObj'],
    methods:{
        validateNum(rule, value, callback) {
            if (isNaN(Number(value))) {
                callback(new Error('请输入正确的数字'));
            } else if(value.split('.')[1] && value.split('.')[1].length>2){
                callback(new Error('小数最多保留两位'));                    
            } else {
                callback();
            }
        },
        async getList(){
            let data = await this.$http.get('/api/record/list', {
                params: {
                    id: this.CommonObj.lessonId
                }
            })
            this.list = data
            let scores = (await this.$http.get('/api/lesson/scoreConf', {
                params: {
                    id: this.CommonObj.lessonId
                }
            })).split(',')
            this.scoreForm.normal = scores[0]
            this.scoreForm.noAttend = scores[1]
            this.scoreForm.late = scores[2]
            this.scoreForm.early = scores[3]
            this.scoreForm.leave = scores[4]
        },
        dateFormat(row, column, cellValue) {
            return utils.DateTransfer(new Date(cellValue),'yyyy-MM-dd hh:mm:ss')
        },
        detail(row) {
            this.title = row.order
            this.dialogVisible = true
            this.series = row.series
            this.$http.get('api/record/detail',{
                params:{
                    id: this.CommonObj.lessonId,
                    series: row.series
                }
            }).then(res => {
                this.students = res
            })
        },
        handleSubmit() {
            this.$http.post('api/record/update',{
                lid: this.CommonObj.lessonId,
                list: this.students,
                series: this.series,
            }).then(res => {
                this.dialogVisible = false
                this.$message({
                    type: 'success',
                    message: '更新成功'
                });
            })
        },
        handleSubmit2() {
            this.$refs['scoreForm'].validate((valid) => {
                if (valid) {
                   let arr = []
                   for(let key in this.scoreForm) {
                       arr.push(this.scoreForm[key])
                   }
                   this.$http.post('api/lesson/scoreConf',{
                       id: this.CommonObj.lessonId,
                       attend_score: arr.map(item=>Number(item)).join(',')
                   }).then(res => {
                       this.dialogVisible2 = false
                       this.$message({
                           type: 'success',
                           message: '更新成功'
                       });
                       this.getList();
                   })
                }
            })
            
        },
        exportExcel(){
            location.href = `api/export/attendance?id=${this.CommonObj.lessonId}`
        }
    },
    mounted() {
        this.$nextTick(()=>{
            this.getList()
        })
    },
    activated() {
        this.$nextTick(()=>{
            this.getList()
        })
    }
}
</script>

<style lang="scss">
    .attend-btns{
        button {
            float: right;
            margin-left: 15px;
        }
        margin-top: 15px;
        overflow: hidden;
    }
    .right-lbtn {
        float: right;
    }
    .score-input{
        width:80px;
        input{
            text-align: center
        }
    }
</style>
