<template>
  <div class="attend-list">
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
      <hr>
      <h1>{{CommonObj.lessonName}}：第{{CommonObj.series}}次考勤</h1>
      <div class="txt">
          <span>课程共有{{sum}}名学生，抽取</span>
          <el-input type="number" v-model="num" :max="sum" :min="0" size="small"></el-input>
          <span>人</span>
          <el-button type="primary" @click="getStudent" size="small">抽查</el-button>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            num: 5,
            sum: 0,
            students: []
        }
    },
    props: ['CommonObj'],
    methods:{
        async getStudent(){
            let data = await this.$http.post('/api/student/list', {
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
        }
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
    }
</style>
