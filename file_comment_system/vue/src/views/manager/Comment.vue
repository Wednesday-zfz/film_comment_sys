<template>
  <div>
    <div class="card" style="margin-bottom: 5px">
      <el-input v-model="data.AIName" placeholder="请输入AI名字查询" style="width: 300px; margin-right: 10px"></el-input>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <div class="card" style="margin-bottom: 5px">

      <el-table :data="data.tableData" stripe>
        <el-table-column prop="entityAI.id" label="ID" width="50"/>
        <el-table-column prop="entityAI.name" label="AI名称"/>
        <el-table-column prop="score1" label="评分">
          <template #default="scope">
            <el-rate disabled v-model="scope.row.score1" allow-half/>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="评论">
          <template #default="scope">
            <el-button @click="preview(scope.row.content)">查看内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="author.username" label="用户名称"/>
        <el-table-column prop="created_time" label="评论时间"/>
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.type === 0">短评</el-tag>
            <el-tag type="success" v-if="scope.row.type === 1">长评</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="card">
      <el-pagination background layout="total, prev, pager, next" v-model:current-page="data.pageNum"
                     v-model:page-size="data.pageSize"
                     :total="data.total" @current-change="load"/>
    </div>

    <el-dialog v-model="data.formVisibleComment" title="评论内容" width="40%">
      <div v-html="data.commentContent"></div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisibleComment = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {reactive} from "vue";
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";

const data = reactive({
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  AIName: null,
  formVisible: false,
  form: {},
  formVisibleComment: false,
  commentContent: null
})

const preview = (comment) => {
  data.commentContent = comment
  data.formVisibleComment = true
}

const load = () => {
  request.get('/comment/', {
    params: {
      page: data.pageNum,
      page_size: data.pageSize,
      author: data.user.id,
    }
  }).then(res => {
    console.log(res)
    data.tableData = data.AIName == null ? res.data.results : res.data.results.filter(row => {
      return row.entityAI.name.includes(data.AIName)
    })
    data.total = res.data.count
  })
}
load()

const reset = () => {
  data.AIName = null
  load()
}

// 初始化新增的数据
const handleAdd = () => {
  data.form = {}
  data.formVisible = true
}

const add = () => {
  request.post('/comment/add', data.form).then(res => {
    if (res.code === '200') {
      load()
      data.formVisible = false
      ElMessage.success('操作成功')
    } else {
      ElMessage.error(res.msg)
    }
  })
}

// 编辑按钮触发
const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))  // 给表单赋值当前的行对象的数据  深度拷贝
  data.formVisible = true
}
const update = () => {
  request.put('/comment/update', data.form).then(res => {
    if (res.code === '200') {
      load()
      data.formVisible = false
      ElMessage.success('操作成功')
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const save = () => {
  data.form.id ? update() : add()
}

const del = (id) => {
  // console.log(id)
  ElMessageBox.confirm('删除数据后无法恢复，您确认吗？', '确认删除', {type: 'warning'}).then(res => {
    // console.log(id)
    request.delete('/comment/' + id+ "/").then(res => {
      load()
    })
  }).catch(err => {
    console.log(err)
  })
}
</script>