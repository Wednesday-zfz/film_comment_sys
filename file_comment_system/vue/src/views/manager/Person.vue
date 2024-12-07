<!-- User.vue -->
<template>
  <div class="bg">
    <div id="logout">
      <el-button type="warning" @click="goToAdmin" class="adminBtn">管理员模式</el-button>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>
    <div class="userInfo" v-if="userInfo">
      <el-row :gutter="10">
        <el-col :span="12" style="width: 200px;">
          <el-avatar :size="200" :src="userInfo.avatar"></el-avatar>
        </el-col>
        <el-col :span="12" style="width: 250px!important;">
          <h2>
            {{ userInfo.username }}
            <span v-if="userInfo.gender === 'F'" class="gender-icon"><i class="fas fa-female"></i></span>
            <span v-if="userInfo.gender === 'M'" class="gender-icon"><i class="fas fa-male"></i></span>
            <span v-if="userInfo.gender === 'null'" class="gender-icon"><i class="fas fa-genderless"></i></span>
          </h2>
          <p class="in-one"><strong>邮箱：</strong>{{ userInfo.email }}</p>
          <p class="in-one"><strong>手机号：</strong>{{ userInfo.phone }}</p>
          <p class="in-one"><strong>您已使用小站：</strong>{{ userInfo.used_days }}天</p>
        </el-col>
      </el-row>
    </div>

    <div class="editUserInfo">
      <el-button @click="showEditModal = true" class="userBtn" type="primary">编辑用户信息</el-button>
      <EditUserInfoModal
          v-if="userInfo"
          :userInfo="userInfo"
          :showModal="showEditModal"
          @update:showModal="showEditModal = $event"
          @doUpdate="doUpdate"
      />
      <el-button @click="showChangePasswordModal = true" class="userBtn" type="primary">修改密码</el-button>
      <ChangePasswordModal
          :showModal="showChangePasswordModal"
          @update:showModal="showChangePasswordModal = $event"
      />
    </div>

    <h3 class="title">我的收藏</h3>

    <div class="card" style="margin-bottom: 5px; margin-top: 10px">
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
                  <img :src="item.logo" alt="" style="width: 100px; height: 100px; border-radius: 5px"
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
            <div style="font-size: 13px; height: 54px; color: #666" class="line3">{{ item.description }}</div>
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

  <div v-if="isRedirecting" class="loading-overlay">
    <div class="loading-content">
      <img src="/Ai.svg" class="ai-logo" alt="小鸟">
      <div class="loading-text">正在跳转...</div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import EditUserInfoModal from '@/components/EditUserInfoModal.vue';
import ChangePasswordModal from '@/components/ChangePasswordModal.vue';
import request from "@/utils/request";
import {ElMessageBox} from "element-plus";

const data = reactive({
  name: null,
  pageNum: 1,
  pageSize: 4,
  tableData: [],
  total: 0,
  sortType: "pinyin_name"
})

const load = () => {
  request.get('/entity-ai/', {
    params: {
      page: data.pageNum,
      page_size: data.pageSize,
      // name: data.name,
      ordering: data.sortType,
      liked_by_user: true
    }
  }).then(res => {
    console.log(data.name)
    data.tableData = res.data.results.filter(res => {
      return data.name == null || res.name.includes(data.name)
    })
    data.total = res.data.count;
  })
}
load()


// 加载用户信息
const userInfo = ref(null);
const isRedirecting = ref(false);

const emit = defineEmits(['update-user']);

// 获取用户信息
const getUserInfo = async () => {
  try {
    const res = await request.get('/user/');
    if (res.data) {
      userInfo.value = res.data;
      localStorage.setItem('user', JSON.stringify(userInfo.value));
      document.title = "欢迎" + userInfo.value.username + "来到个人中心";
      emit("update-user"); // 通知父组件更新
    }
  } catch (e) {
    console.error(e);
  }
};


const showEditModal = ref(false);
const showChangePasswordModal = ref(false);


// onMounted 生命周期钩子
onMounted(() => {
  getUserInfo();
});

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    try {
      request.post('/logout');
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  });
};

const goToAdmin = () => {
  isRedirecting.value = true;
  setTimeout(() => {
    window.location.href = 'http://localhost:8000/admin/';
  }, 1000); // 1秒钟的过渡动画
};

// 更新用户信息
const doUpdate = () => {
  getUserInfo();
};

</script>

<style scoped>
.bg {
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  position: relative;
}


#logout {
  margin-top: 10px;
  margin-right: 10px;
  float: right;
}

.editUserInfo {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

h3 {
  margin: 0;
  padding: 10px;
  background-color: #4274b9;
  color: white;
  text-align: center;
}

.userInfo {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}

.gender-icon {
  margin-left: 10px;
  font-size: 0.8em; /* 调整字体大小 */
  color: #888; /* 调整颜色 */
}

.gender-icon i {
  margin-right: 5px;
}

.in-one {
  width: 240px;
}

.fa-female {
  color: pink;
}

.fa-male {
  color: blue;
}

.userBtn {
  margin: 10px;
}

.adminBtn {
  margin-right: 10px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  animation: fadeIn 1s forwards;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ai-logo {
  width: 100px;
}

.loading-text {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}

.title {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}


</style>
