<template>
    <div>
        <table class="attend-table">
            <tr>
                <th v-if="lesson">课程</th>
                <th v-if="lesson">次序</th>
                <th v-if="!lesson">学号</th>
                <th v-if="!lesson">姓名</th>
                <th>正常</th>
                <th>缺勤</th>
                <th>迟到</th>
                <th>早退</th>
                <th>请假</th>
                <th>是否回答问题</th>
            </tr>
            <tr v-if="list.length == 0">
                <td colspan="8" style="text-align:center">暂无数据</td>
            </tr>
            <tr v-for="item in list" :key="item.id">
                <td v-if="lesson">{{item.name}}</td>
                <td v-if="lesson">第{{item.series}}次考勤</td>
                <td v-if="!lesson">{{item.student_code}}</td>
                <td v-if="!lesson">{{item.name}}</td>
                <td><el-radio v-model="item.attend_condition" :label="0"></el-radio></td>
                <td><el-radio v-model="item.attend_condition" :label="1"></el-radio></td>
                <td><el-radio v-model="item.attend_condition" :label="2"></el-radio></td>
                <td><el-radio v-model="item.attend_condition" :label="3"></el-radio></td>
                <td><el-radio v-model="item.attend_condition" :label="4"></el-radio></td>
                <td><el-checkbox v-model="item.is_quest"></el-checkbox></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props: ['list','lesson']
}
</script>

<style lang="scss">
    .attend-table{
        width: 100%;
        th {
            font-weight: bold;
            text-align: left;
        }
        td,th{
            color: #909399;
            font-size: 16px;
            padding: 12px 10px;
        }
        tr {
            border-bottom: 1px solid #888
        }
        .el-radio__label{
            display: none;
        }
        .el-radio__inner,.el-checkbox__inner{
            border-color: #999
        }
    }
</style>
