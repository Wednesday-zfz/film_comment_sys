<template>
  <div>
    <div class="card" style="margin-bottom: 5px">
      <el-input v-model="data.name" placeholder="请输入AI名称查询" style="width: 300px; margin-right: 10px"></el-input>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 5px">
      <el-button :class="{ 'film-active' : data.categoryId === null }" @click="loadFilmByCategory(null)">全部
      </el-button>
      <el-button :class="{ 'film-active' : data.categoryId === item.id }" v-for="item in data.categoryList"
                 :key="item.id" @click="loadFilmByCategory(item.id)">{{ item.name }}
      </el-button>
    </div>

    <div class="card" style="margin-bottom: 5px">
      <el-row :gutter="10">
        <el-col :span="6" v-for="item in data.tableData" :key="item.id"
                style="margin-bottom: 20px; cursor: pointer;">
          <el-card
              :body-style="{ padding: '10px' }"
              class="card-item"
              hoverable
              style="cursor: pointer;"
          >
            <div style="margin: 5px 0; font-size: 18px" class="line1">{{ item.name }}</div>

            <div style="position: relative;margin-bottom: 10px">
              <div style="display: flex; grid-gap: 10px; flex: 1;">
                <el-tooltip class="item" effect="dark" content="详情页面" placement="bottom">
                  <img :src="item.cover" alt="" style="width: 100px; height: 100px; border-radius: 5px"
                       @click="goDetail(item.id)">
                </el-tooltip>
                <div style="flex: 1">
                  <el-rate v-model="item.average_score" disabled allow-half show-score
                           style="margin-bottom: 5px"></el-rate>
                  <div style="text-align: left; color: #1967e3;margin-bottom: 20px;">{{ item.like_count }}人收藏</div>
                  <el-tooltip class="item" effect="dark" content="跳转链接" placement="bottom">
                    <el-button type="primary" circle size="small">
                      <a :href="item.url" target="_blank" style="color: white;">
                        <el-icon>
                          <ArrowRight/>
                        </el-icon>
                      </a>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div style="font-size: 13px; height: 50px; color: #666" class="line3">{{ item.description }}</div>
            <!--          <img :src="item.cover" alt="" style="width: 100%; height: 250px; border-radius: 5px">-->
            <!--          <div style="margin: 5px 0; font-size: 18px" class="line1">{{ item.name }}</div>-->
            <!--          <div style="margin: 5px 0; display: flex; align-items: center">-->
            <!--            <el-rate v-model="item.score" disabled allow-half show-score></el-rate>-->
            <!--            <div style="flex: 1; text-align: right; color: #1967e3">{{ item.commentNum }}人评论</div>-->
            <!--          </div>-->
            <!--          <div style="font-size: 13px; color: #666" class="line3">{{ item.description }}</div>-->
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="card">
      <el-pagination background layout="total, prev, pager, next" v-model:current-page="data.pageNum"
                     v-model:page-size="data.pageSize"
                     :total="data.total" @current-change="load"/>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import request from "@/utils/request";

const data = reactive({
  name: null,
  pageNum: 1,
  pageSize: 8,
  tableData: [],
  total: 0,
  categoryList: [],
  categoryId: null
})

const goDetail = (id) => {
  location.href = '/AIDetail?id=' + id
}

// 查询所有电影分类信息
const loadCategory = () => {
  request.get('/entity-ai-type/').then(res => {
    data.categoryList = res.data
  })
}
loadCategory()

// 根据分类查询电影列表
const loadFilmByCategory = (categoryId) => {
  data.categoryId = categoryId
  load()
}

const load = () => {
  request.get('/entity-ai/', {
    params: {
      page: data.pageNum,
      page_size: data.pageSize,
      // name: data.name,
      type: data.categoryId
    }
  }).then(res => {
    console.log(data.name)
    data.tableData = res.data.results.filter(res => {
      return data.name == null || res.name.includes(data.name)
    })
    data.total = data.tableData.length
  })
}
load()

const reset = () => {
  data.name = null
  load()
}
</script>

<style scoped>
.film-active {
  background-color: #1967e3;
  color: white;
}

.el-col {
  transition: transform 0.3s ease; /* 平滑过渡 */
}

.el-col:hover {
  transform: translateY(-10px); /* 向上浮起10px */
}

/* 可以添加阴影效果，增加浮起感 */
.el-col:hover .item {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

/* 默认样式 */
.card-item {
  border: 1px solid #ccc; /* 默认边框 */
  border-radius: 8px; /* 圆角边框 */
  transition: transform 0.3s ease, border-color 0.3s ease; /* 添加边框颜色变化 */
}

/* 鼠标悬停时的浮起效果和边框颜色变化 */
.card-item:hover {
  transform: translateY(-10px); /* 向上浮起10px */
  border-color: #409EFF; /* 悬停时的边框颜色 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* 阴影效果 */
}

.el-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5); /* 更明显的阴影 */
  transform: translateY(-5px); /* 鼠标悬停时浮起 */
  border: 1px solid #409EFF; /* 悬停时边框颜色 */
}
</style>