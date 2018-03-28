<template>
  <div class="attend-list">
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
      <hr>
      <h1>{{CommonObj.lessonName}}：第{{CommonObj.series}}次考勤</h1>
      <div class="txt">
          <span>课程共有{{sum}}名学生，抽取</span>
          <el-input type="number" v-model="num" :max="sum" :min="1" size="small"></el-input>
          <span>人</span>
          <el-button type="primary" @click="getStudent" size="small">抽查</el-button>
      </div>
      <div v-if="students.length > 0">
        <attendTable :list="students"></attendTable>
        <el-button class="attend-btn" size="small" type="primary" @click="handleSubmit">确定考勤</el-button>
      </div>
  </div>
</template>

<script>
import attendTable from '@/components/attendTable'

export default {
    data(){
        return{
            num: 1,
            sum: 0,
            students: []
        }
    },
    props: ['CommonObj'],
    components: {attendTable},
    methods:{
        async getStudent(){
            if(this.num>this.sum||this.num<0) {
                this.$message({
                    type: 'error',
                    message: `抽取数量只能是1~${this.sum}`
                });
                return
            }
            let data = await this.$http.post('/api/record/getRandom', {
                id: this.CommonObj.lessonId,
                num: this.num
            })
            this.students = data.list
        },
        async getSum(){
            let data = await this.$http.get('/api/student/listSum', {
                params:{
                    id: this.CommonObj.lessonId
                }
            })
            this.sum = data.total
        },
        handleSubmit() {
            this.$confirm(`确认要提交本次考勤吗？`)
                .then(_ => {
                    this.sumbit()
                })
                .catch(_ => {});
        },
        async sumbit() {
            for(let i = 0;i < this.students.length;i++){
                let stu = this.students[i]
                if(stu.condition == undefined) {
                    this.$message({
                        type: 'error',
                        message: '请确保每个抽取的同学都选中一种考勤状态！！'
                    });
                    return
                }
            }
            console.log(this.students)
            await this.$http.post('/api/record/submit', {
                series: this.CommonObj.series,
                lid: this.CommonObj.lessonId,
                list: this.students
            })
            this.$message({
                type: 'success',
                message: '考勤成功！！'
            });
            this.CommonObj.changePage(0)
        },
    },
    mounted(){      
        this.$nextTick(()=>{
            this.getSum()
        })
    }
}
</script>

<style lang="scss">
    .attend-list{
        .txt{
            font-size: 16px;
            margin: 15px 0;
            .el-input{
                display: inline-block;
                width: 50px;
                .el-input__inner{
                    text-align: center;
                    padding: 0;
                }
            }
            .el-button{
                font-size: 16px;
                padding: 6px 10px;
                margin-left: 10px;
            }
        }
        .attend-btn{
            float:right;
            margin-top: 20px;
        }
    }
</style>
