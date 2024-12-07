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
        <el-table-column prop="logo" width="100" label="logo">
          <template #default="scope">
            <el-image :src="scope.row.logo" style="width: 40px; height: 40px; border-radius: 5px"
                      :preview-src-list="[scope.row.logo]" preview-teleported></el-image>
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
        <el-form-item label="logo">
          <input type="file" id="logo" @change="handleLogo" class="form-input" ref="logoInput"
                 style="display: none;"/>
          <el-button type="primary" @click="triggerLogoInput">
            上传logo
          </el-button>
        </el-form-item>
        <el-image v-if="data.newLogoUrl||data.form.logo" :src="data.newLogoUrl ? data.newLogoUrl : data.form.logo"
                  style="width: 90px; height: 90px; border-radius: 5px; margin-left: 80px; margin-bottom: 10px; margin-top: -10px"></el-image>
        <el-form-item label="封面">
          <input type="file" id="cover" @change="handleCover" class="form-input" ref="imgInput"
                 style="display: none;"/>
          <el-button type="primary" @click="triggerCoverInput">
            上传封面
          </el-button>
        </el-form-item>
        <el-image v-if="data.newCoverUrl||data.form.cover" :src="data.newCoverUrl ? data.newCoverUrl : data.form.cover"
                  style="width: 160px; height: 90px; border-radius: 5px; margin-left: 80px; margin-bottom: 10px; margin-top: -10px"></el-image>

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
  pageSize: 8,
  name: null,
  formVisible: false,
  form: {},
  AITypeList: [],
  newTypeName: null,
  newCover: null,
  newLogo: null,
  newLogoUrl: null,
  newCoverUrl: null
})

const load = () => {
  request.get('/entity-ai/', {
    params: {
      page: data.pageNum,
      page_size: data.pageSize,
      //name: data.name
    }
  }).then(res => {
    data.tableData = res.data.results.filter(res => {
      return data.name == null || res.name.includes(data.name)
    })
    data.total = data.name ? data.tableData.length : res.data.count
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
  data.newCoverUrl = null
  data.newLogoUrl = null
  data.formVisible = true
}

const add = async () => {
  await request.post('/entity-ai/', data.form).then(res => {
    if (res.status === 'success') {
      console.log(data.form)
      data.form.id = res.data.id
      data.formVisible = false
    } else {
      ElMessage.error(res.msg)
      return
    }
  })

  if (data.newCover || data.newLogo) {
    const imgFormData = new FormData()
    if (data.newCover) imgFormData.append('cover', data.newCover)
    if (data.newLogo) imgFormData.append('logo', data.newLogo)
    await request({
      url: '/entity-ai/' + data.form.id + '/',
      method: 'patch',
      data: imgFormData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (!res.status === 'success') {
        ElMessage.error(res.msg)
        return
      }
    })
  }
  load()
  handleAdd()
  ElMessage.success('操作成功')
}

const triggerLogoInput = () => {
  const LogoInput = document.getElementById('logo')
  LogoInput.click()// 点击隐藏的 input 元素
}

const triggerCoverInput = () => {
  const CoverInput = document.getElementById('cover')
  CoverInput.click()// 点击隐藏的 input 元素
}

// 编辑按钮触发
const handleEdit = (row) => {

  data.form = JSON.parse(JSON.stringify(row))  // 给表单赋值当前的行对象的数据  深度拷贝
  data.formVisible = true
  data.newTypeName = row.type.name
  // console.log(data.form)
}
const update = async () => {
  //console.log(data.form)
  const aiUpadteResponse = await request({
    url: '/entity-ai/' + data.form.id + '/',
    method: 'patch',
    data: {
      name: data.form.name,
      description: data.form.description,
      url: data.form.url,
      type_id: data.form.type_id,
    }
  })

  if (!(aiUpadteResponse.status === 'success')) {
    ElMessage.error(aiUpadteResponse.msg)
    return
  }
  if (data.newCover || data.newLogo) {
    const imgFormData = new FormData()
    if (data.newCover) imgFormData.append('cover', data.newCover)
    if (data.newLogo) imgFormData.append('logo', data.newLogo)
    await request({
      url: '/entity-ai/' + data.form.id + '/',
      method: 'patch',
      data: imgFormData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (!res.status === 'success') {
        ElMessage.error(res.msg)
        return
      }
    })
  }

  data.newLogoUrl = null
  data.newCoverUrl = null
  data.formVisible = false
  ElMessage.success('操作成功')
  load()

}

const save = () => {
  data.form.id ? update() : add()
}

const del = (id) => {
  ElMessageBox.confirm('删除数据后无法恢复，您确认吗？', '确认删除', {type: 'warning'}).then(res => {
    request.delete('/entity-ai/' + id + '/').then(res => {
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

const handleCover = (event) => {
  const file = event.target.files[0]
  data.newCover = file
  data.newCoverUrl = URL.createObjectURL(file)
}

const handleLogo = (event) => {
  //console.log(file)
  const file = event.target.files[0]
  data.newLogo = file
  data.newLogoUrl = URL.createObjectURL(file)
  console.log(data.newLogo)
  console.log(data.newLogoUrl)
  // console.log(URL.createObjectURL(file))
}

//获取TypeList
request.get('/entity-ai-type/').then(res => {
  data.AITypeList = res.data
})
const handleDropdownItemClick = (res) => {
  data.form.type_id = res.id
  data.newTypeName = res.name
}

const handleImageError = () => {
  console.log(data.newLogoUrl);
}
</script>

<style scoped>
.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  margin-bottom: 15px;
}
</style>