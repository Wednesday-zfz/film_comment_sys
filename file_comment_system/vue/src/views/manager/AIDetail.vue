<template>
  <div>
    <div style="display: flex; align-items: flex-start; grid-gap: 10px">
      <div style="flex: 1; width: 0">
        <div class="card" style="padding: 20px; margin-bottom: 10px">

          <div style="display: flex; align-items: center;">
            <div style="font-weight: bold; font-size: 18px; flex: 1">{{ data.AI.name }}</div>
            <div>
              <el-button type="primary" plain @click="addComment(0)">写短评</el-button>
              <el-button type="success" plain @click="addComment(1)">写长评</el-button>
            </div>
          </div>

          <div style="margin-bottom: 5px">
            <el-rate v-model="data.AI.average_score" disabled allow-half show-score></el-rate>
          </div>

          <div style="margin-bottom: 20px">
            <el-tag type="primary" style="margin-right: 8px;">Tag 1</el-tag>
            <el-tag type="success" style="margin-right: 8px;">Tag 2</el-tag>
            <el-tag type="info" style="margin-right: 8px;">Tag 3</el-tag>
            <el-tag type="warning" style="margin-right: 8px;">Tag 4</el-tag>
            <el-tag type="danger" style="margin-right: 8px;">Tag 5</el-tag>
          </div>

          <div style="position: relative;">
            <!-- 图片和电影信息模块 -->
            <div style="display: flex; grid-gap: 20px; margin-bottom: 20px; flex: 1;">
              <img :src="data.AI.cover" alt="" style="width: 480px; height: 270px; border-radius: 5px">
              <div style="flex: 1; color: #666">
                <div style="margin-bottom: 10px"><strong>分类：</strong>{{ data.type.name }}</div>
                <div style="margin-bottom: 10px"><strong>简介：</strong>{{ data.AI.description }}</div>
              </div>
            </div>
            <el-button type="primary" round style="position: absolute; left: 500px; bottom: 15px;">
              <a :href="data.AI.url" target="_blank" style="color: white;">
                跳转链接
              </a>
              <el-icon>
                <ArrowRight/>
              </el-icon>
            </el-button>

            <!-- 星星图标 (右下角) -->
            <el-icon style="position: absolute; right: 20px; bottom: 15px; font-size: 36px; color: #ffd700;"
                     @click="toggleStar">
              <star/>
              <star-filled v-show="data.isStared"
                           style="position: absolute; top: 0; left: 0; opacity: 1; font-size: 36px; color: #ffd700;"/>
            </el-icon>
          </div>

          <!--          <div style="font-size: 20px; color: #1967e3; margin-bottom: 10px">{{ data.AI.name }} 的剧情简介</div>-->
          <!--          <div style="color: #666; line-height: 24px; text-align: justify">{{ data.AI.descr }}</div>-->
        </div>

        <div class="card" style="padding: 20px; margin-bottom: 10px">
          <div style="font-size: 20px; color: #239113; margin-bottom: 10px">{{ data.AI.name }} 的短评 <span
              style="font-size: 14px; color: #333">...(全部{{ data.totalShort }}条)</span></div>
          <div style="border-bottom: 1px solid #eee; padding: 20px 0" v-for="item in data.commentShortList"
               :key="item.id">
            <div style="display: flex; align-items: center; margin-bottom: 5px">
              <span>{{ item.author.username }}</span>
              <el-rate style="margin: 0 10px" v-model="item.average_score" disabled allow-half></el-rate>
              <span style="color: #666">{{ item.created_time }}</span>
            </div>
            <div style="line-height: 24px; color:  #666;">{{ item.content }}</div>
          </div>
          <el-pagination layout="total, prev, pager, next" v-model:current-page="data.pageNumShort"
                         v-model:page-size="data.pageSizeShort"
                         :total="data.totalShort" @current-change="loadShortComment"/>
        </div>

        <div class="card" style="padding: 20px">
          <div style="font-size: 20px; color: orange; margin-bottom: 10px">{{ data.AI.name }} 的长评 <span
              style="font-size: 14px; color: #333">...(全部{{ data.totalLong }}条)</span></div>
          <div style="border-bottom: 1px solid #eee; padding: 20px 0" v-for="item in data.commentLongList"
               :key="item.id">
            <div style="display: flex; align-items: center; margin-bottom: 5px">
              <span>{{ item.author.username }}</span>
              <el-rate style="margin: 0 10px" v-model="item.average_score" disabled allow-half></el-rate>
              <span style="color: #666">{{ item.created_time }}</span>
            </div>
            <div style="line-height: 24px; color:  #666; margin-bottom: 5px" class="line3" v-html="item.content"></div>
            <div><span style="color: #1967e3; cursor: pointer" @click="viewLongComment(item.content)">查看更多...</span>
            </div>
          </div>
          <el-pagination layout="total, prev, pager, next" v-model:current-page="data.pageNumLong"
                         v-model:page-size="data.pageSizeLong"
                         :total="data.totalLong" @current-change="loadLongComment"/>
        </div>
      </div>

      <div style="width: 300px; padding: 20px" class="card">
        <div style="font-size: 20px; margin-bottom: 20px">相关推荐</div>
        <div style="margin-bottom: 20px; cursor: pointer" v-for="item in data.recommendList" :key="item.id"
             @click="goDetail(item.entity.id)">
          <img :src="item.entity.logo" alt="" style="width: 200px; height: 200px; margin-bottom: 5px">
          <div style="font-size: 18px">{{ item.entity.name }}</div>
          <div>
            <el-rate v-model="item.entity.average_score" disabled allow-half show-score></el-rate>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="data.formVisible" title="评论信息" width="50%">
      <el-form :model="data.form" label-width="80px" style="padding-right: 20px">
        <el-form-item label="数理能力">
          <el-rate v-model="data.score1" allow-half show-score></el-rate>
        </el-form-item>
        <el-form-item label="语言能力">
          <el-rate v-model="data.score2" allow-half show-score></el-rate>
        </el-form-item>
        <el-form-item label="图片能力">
          <el-rate v-model="data.score3" allow-half show-score></el-rate>
        </el-form-item>
        <el-form-item label="文本能力">
          <el-rate v-model="data.score4" allow-half show-score></el-rate>
        </el-form-item>
        <el-form-item label="平均能力">
          <el-rate v-model="data.form.average_score" allow-half show-score disabled></el-rate>
        </el-form-item>
        <el-form-item label="内容" v-if="data.form.type === 0">
          <el-input :rows="5" type="textarea" v-model="data.form.content" autocomplete="off" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="内容" prop="comment" v-if="data.form.type === 1">
          <div style="border: 1px solid #ccc; width: 100%">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :mode="mode"
            />
            <Editor
                style="height: 180px; overflow-y: hidden;"
                v-model="data.form.content"
                :mode="mode"
                :defaultConfig="editorConfig"
                @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="data.formVisibleView" title="长评" width="50%">
      <div style="line-height: 24px">
        <div class="longComment" v-html="data.comment"></div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisibleView = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import {reactive, watch} from "vue";
import router from "@/router";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onBeforeUnmount, ref, shallowRef} from "vue";
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

const data = reactive({
  id: router.currentRoute.value.query.id,
  AI: {},
  type: {},
  recommendList: [],
  formVisible: false,
  form: {},
  pageNumShort: 1,
  pageSizeShort: 3,
  totalShort: 0,
  commentShortList: [],
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  pageNumLong: 1,
  pageSizeLong: 3,
  totalLong: 0,
  commentLongList: [],
  formVisibleView: false,
  isStared: false,
  comment: null,
  score1: 0,
  score2: 0,
  score3: 0,
  score4: 0,
})

/* wangEditor5 初始化开始 */
const baseUrl = import.meta.env.VITE_BASE_URL
const editorRef = shallowRef()  // 编辑器实例，必须用 shallowRef
const mode = 'default'
const editorConfig = {MENU_CONF: {}}
// 图片上传配置
editorConfig.MENU_CONF['uploadImage'] = {
  server: baseUrl + '/files/wang/upload',  // 服务端图片上传接口
  fieldName: 'file'  // 服务端图片上传接口参数
}
// 组件销毁时，也及时销毁编辑器，否则可能会造成内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
// 记录 editor 实例，重要！
const handleCreated = (editor) => {
  editorRef.value = editor
}
/* wangEditor5 初始化结束 */

const viewLongComment = (comment) => {
  data.comment = comment
  data.formVisibleView = true
}

const addComment = (type) => {
  data.form = {type: type}
  data.formVisible = true
}

// 新增评论的方法
const save = () => {
  data.form.entityAI_id = data.id
  data.form.score1 = data.score1
  data.form.score2 = data.score2
  data.form.score3 = data.score3
  data.form.score4 = data.score4

  request.post('/comment/', data.form).then(res => {
    if (res.status === 'success') {
      console.log(res)
      data.formVisible = false
      ElMessage.success('评论成功')
      loadShortComment()
      loadLongComment()
      load()

    } else {
      ElMessage.success(res.msg)
    }
  }).catch(err => {
    ElMessage.error('评论失败')
    console.log(err)
  })
  data.score1 = 0
  data.score2 = 0
  data.score3 = 0
  data.score4 = 0
}

const loadShortComment = () => {
  request.get('/comment/', {
    params: {
      page: data.pageNumShort,
      page_size: data.pageSizeShort,
      entityAI: data.id,
      type: 0
    }
  }).then(res => {
    data.commentShortList = res.data.results
    data.totalShort = res.data.count
  })
}
loadShortComment()

const loadLongComment = () => {
  request.get('/comment/', {
    params: {
      page: data.pageNumLong,
      page_size: data.pageSizeLong,
      entityAI: data.id,
      type: 1
    }
  }).then(res => {
    data.commentLongList = res.data.results
    data.totalLong = res.data.count
  })
}
loadLongComment()

const load = () => {
  request.get('/entity-ai/' + data.id).then(res => {
    data.AI = res.data
    data.type = res.data.type
    data.isStared = res.data.is_liked
  })
}
load()

request.get('/recommend/').then(res => {
  data.recommendList = res.data
})

const goDetail = (id) => {
  location.href = '/AIDetail?id=' + id
}

watch(
    () => [data.score1, data.score2, data.score3, data.score4],  // 监听多个评分项
    () => {
      updateAverageScore();  // 评分变化时，更新平均分
    },
    //{immediate: true}  // 立即执行一次（初始化时也会更新平均分）
);
const updateAverageScore = () => {
  data.form.average_score = parseFloat(((data.score1 + data.score2 + data.score3 + data.score4) / 4).toFixed(1));

}

/********************收藏逻辑********************************/
//收藏，点击收藏之后触发
const toggleStar = () => { //修改多对多关系,在后端实现
  data.isStared ? deleteStar() : addStar()
  data.isStared = !data.isStared
}


const deleteStar = () => {
  request.delete('like/' + data.AI.id + '/').then(res => {
  })
}

const addStar = () => {
  request.post('like/' + data.AI.id + '/').then(res => {
  })
}

</script>


<style>
.longComment img {
  width: 100% !important;
}
</style>