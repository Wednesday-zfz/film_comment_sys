<template>
  <div>
    <div class="card" style="margin-bottom: 5px">
      <el-input v-model="data.name" placeholder="请输入名称查询" style="width: 300px; margin-right: 10px"></el-input>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <div class="card" style="margin-bottom: 5px">
      <el-button type="primary" style="margin-bottom: 10px" @click="handleAdd">新增</el-button>

      <el-table :data="data.tableData" stripe>
        <el-table-column prop="name" width="100" label="名称"/>
        <el-table-column prop="cover" width="100" label="logo">
          <template #default="scope">
            <el-image :src="scope.row.cover" style="width: 40px; height: 40px; border-radius: 5px"
                      :preview-src-list="[scope.row.cover]" preview-teleported></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="type.name" width="100" label="分类"/>
        <el-table-column prop="like_count" width="100" label="收藏量" align="center"/>
        <el-table-column prop="description" label="描述" show-overflow-tooltip/>
        <!--        <el-table-column prop="director" label="导演" />-->
        <!--        <el-table-column prop="actors" label="演员" show-overflow-tooltip />-->

        <!--        <el-table-column prop="country" label="国家" />-->
        <!--        <el-table-column prop="language" label="语言" />-->
        <!--        <el-table-column prop="date" label="上映日期" />-->
        <!--        <el-table-column prop="duration" label="片长" />-->
        <!--        <el-table-column prop="imdb" label="IMDb" />-->
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog v-model="data.formVisible" title="AI信息" width="40%">
      <el-form :model="data.form" label-width="80px" style="padding-right: 20px">
        <el-form-item label="名称">
          <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="logo" prop="logo">
          <el-upload :action="uploadUrl" list-type="picture" :on-change="handleLogo">
            <el-button type="primary">上传logo</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-upload list-type="picture" :on-change="handleImg">
            <el-button type="primary">上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类">
          <el-dropdown split-button type="primary">
            <div v-if="!data.newTypeName">选择分类</div>
            <div v-else>{{ data.newTypeName }}</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    v-for="(item, index) in data.AITypeList"
                    :key="index"
                    @click="handleDropdownItemClick(item)"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="data.form.url" autocomplete="off" placeholder="请输入跳转链接"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input :rows="5" type="textarea" v-model="data.form.description" autocomplete="off"
                    placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {reactive} from "vue";
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";

// 文件上传的接口地址
const uploadUrl = import.meta.env.VITE_BASE_URL + '/entity-ai/'

const data = reactive({
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  name: null,
  formVisible: false,
  form: {},
  AITypeList: [],
  newTypeName: null,
  newCover: null,
  newLogo: null,
})

const load = () => {
  request.get('/entity-ai/', {
    params: {
      page: data.pageNum,
      page_size: data.pageSize,
      //name: data.name
    }
  }).then(res => {
    data.tableData = res.data.results
    data.total = res.data.count
  })
}
load()

const reset = () => {
  data.name = null
  load()
}

// 初始化新增的数据
const handleAdd = () => {
  data.form = {}
  data.newCover = null
  data.newLogo = null
  data.newTypeName = null
  data.formVisible = true
}

const add = () => {
  request.post('/entity-ai/', data.form).then(res => {
    if (res.status === 'success') {
      console.log(data.form)
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
  // console.log(data.form)
}
const update = () => {
  request.patch('/entity-ai/' + data.form.id + '/', data.form).then(res => {
    if (res.status === 'success') {
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
  ElMessageBox.confirm('删除数据后无法恢复，您确认吗？', '确认删除', {type: 'warning'}).then(res => {
    request.delete('/entity-ai/' + data.form.id + '/').then(res => {
      if (res.status === 'success') {
        load()
        ElMessage.success('操作成功')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => {
    ElMessage.error(err.msg)
  })
}

const handleImg = (res) => {
  data.newCover = res.data  // res.data就是文件上传返回的文件路径，获取到路径后赋值表单的属性
}

const handleLogo = (file) => {
  data.newLogo = file  // res.data就是文件上传返回的文件路径，获取到路径后赋值表单的属性
  data.prevNewLogo = URL.createObjectURL(file.raw)
}

//获取TypeList
request.get('/entity-ai-type/').then(res => {
  data.AITypeList = res.data
})
const handleDropdownItemClick = (res) => {
  data.form.type_id = res.id
  data.newTypeName = res.name
}
</script>