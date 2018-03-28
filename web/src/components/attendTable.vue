<template>
    <div>
        <table class="attend-table">
            <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>正常</th>
                <th>缺勤</th>
                <th>迟到</th>
                <th>早退</th>
                <th>是否回答问题</th>
            </tr>
            <tr v-for="item in list" :key="item.id">
                <td>{{item.student_code}}</td>
                <td>{{item.name}}</td>
                <td><el-radio v-model="item.condition" label="0"></el-radio></td>
                <td><el-radio v-model="item.condition" label="1"></el-radio></td>
                <td><el-radio v-model="item.condition" label="2"></el-radio></td>
                <td><el-radio v-model="item.condition" label="3"></el-radio></td>
                <td><el-checkbox v-model="item.is_quest"></el-checkbox></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props: ['list']
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
