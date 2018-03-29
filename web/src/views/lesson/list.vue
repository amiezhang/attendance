<template>
  <div>
      <el-button size="mini" type="primary" @click="CommonObj.changePage(0)">返回</el-button>
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
            title: '',
            students: [],
            series: undefined
        }
    },
    components: {attendTable},
    props: ['CommonObj'],
    methods:{
        async getList(){
            let data = await this.$http.get('/api/record/list', {
                params: {
                    id: this.CommonObj.lessonId
                }
            })
            this.list = data
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
</style>
