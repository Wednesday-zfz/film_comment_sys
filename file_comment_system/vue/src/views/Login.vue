<script>
import anime from 'animejs';
import {ElMessage} from 'element-plus';
import request from "../utils/request";

export default {
  data() {
    return {
      isSmsLogin: false, // 当前是否为短信登录模式
      username: "用户名",
      password: "密码",
      rightCleared: false,
      allCleared: false,
    };
  },

  methods: {
    handleToggleMode() {
      this.rightCleared = true; // 先清空 right 区域
      setTimeout(() => {
        this.isSmsLogin = !this.isSmsLogin;
        this.username = this.isSmsLogin ? "手机号" : "用户名";
        this.password = this.isSmsLogin ? "验证码" : "密码";
        this.rightCleared = false; // 渲染新的 right 区域
        this.$nextTick(() => {
          this.loadInputFocusHooks();
        });
      }, 300); // 动画时间与 CSS 定义一致
    },

    register() {

      this.allCleared = true; // 先清空整个表单
      setTimeout(() => {
        this.$router.push({name: 'register'});
      }, 300); // 动画时间与 CSS 定义一致
    },

    async sendSms() {
      const phone = document.querySelector('#email').value;

      if (!phone) {
        ElMessage.error("请输入手机号！");
        return;
      }

      if (phone.length !== 11) {
        ElMessage.error("手机号格式错误！");
        return;
      }

      try {
        const res = await request.get(
            '/phone-code/',
            {
              params: { phone: phone },
            }
        );
        if (res.status === "success") {
          ElMessage.success("验证码已发送！");
        } else {
          ElMessage.error(res.message || "发送验证码失败");
        }
      } catch (error) {
        console.log(error);
        ElMessage.error(error.response.data.message || "发送验证码失败");
        if (error.response.data.errors) {
            ElMessage.error(error.response.data.errors);
        }
      }
    },

    loadInputFocusHooks() {
      const emailInput = document.querySelector('#email');
      const passwordInput = document.querySelector('#password');

      const animatePath = (offset, array) => {
        anime({
          targets: 'path',
          strokeDashoffset: {
            value: offset,
            duration: 700,
            easing: 'easeOutQuart',
          },
          strokeDasharray: {
            value: array,
            duration: 700,
            easing: 'easeOutQuart',
          },
        });
      };

      // 解绑旧事件监听器，避免重复绑定
      emailInput?.removeEventListener('focus', this.handleEmailFocus);
      passwordInput?.removeEventListener('focus', this.handlePasswordFocus);

      // 绑定新的事件监听器
      this.handleEmailFocus = () => animatePath(0, '240 1386');
      this.handlePasswordFocus = () => animatePath(-340, '240 1386');

      emailInput?.addEventListener('focus', this.handleEmailFocus);
      passwordInput?.addEventListener('focus', this.handlePasswordFocus);
    },

    async login() {
      if (!email.value || !password.value) {
        ElMessage.error('邮箱和密码不能为空');
        return;
      }

      try {
        if (this.isSmsLogin) {
          // 短信验证码登录
          const res = await request({
            url: '/login-with-code/',
            method: 'post',
            data: {
              phone: email.value,
              code: password.value,
            },
          });

          this.dealWithLogin(res);
        } else {
          // 用户名密码登录
          const res = await request({
            url: '/login/',
            method: 'post',
            data: {
              username: email.value,
              password: password.value,
            },
          });

          this.dealWithLogin(res);
        }


      } catch (e) {
        console.log(e)
        ElMessage.error(e.response.data.message);
      }

    },

    async dealWithLogin(res) {
      if (res.status === "success") {
        ElMessage.success('登录成功');
      } else {
        ElMessage.error('登录失败');
        return;
      }

      // 登录成功后的操作
      localStorage.setItem('tokens', JSON.stringify(res.data));
      console.log(res.data);

      try {
        // 获得一下用户信息
        const res2 = await request({
          url: '/user/',
          method: 'get',
        });

        if (res2.status === "success") {
          localStorage.setItem('user', JSON.stringify(res2.data));
          console.log(res2.data);
        } else {
          ElMessage.error('获取用户信息失败');
        }
      } catch (e) {
        console.log(e)
        ElMessage.error(e.response.data.message);
        ElMessage.error('获取用户信息失败');
      }

      this.$router.push({name: 'home'});

    },


    mounted() {
      this.loadInputFocusHooks();
    },
  }
}
</script>

<template>
  <div class="gradient-bg">
    <div class="gradients-container">
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
      <div class="g6"></div>
    </div>

    <transition name="fade">


      <div v-if="!allCleared" class="container">
        <div class="left">
          <div class="login">登陆</div>
          <div class="eula">
            <b>登陆之前保证已注册账号</b>
            <br/>
            <br/>
            <b>可选择用户名密码登陆or短信验证码登陆</b>
          </div>
        </div>


        <div class="right">
          <svg viewBox="0 0 320 300">
            <defs>
              <linearGradient id="linearGradient" x1="13" y1="193.5" x2="307" y2="193.5">
                <stop style="stop-color:#ff00ff;" offset="0"/>
                <stop style="stop-color:#ff0000;" offset="1"/>
              </linearGradient>
            </defs>
            <path
                d="m 40,120.00016 239.99984,-3.2e-4
                  c 0,0 24.99263,0.79932 25.00016,37.00016 0.008,36.20084 -25.00016,37 -25.00016,37
                  h -240"
            />
          </svg>

          <transition name="fade">
            <div v-if="!rightCleared" class="form">
              <label for="email">{{ username }}</label>
              <input type="email" id="email"/>
              <label for="password">{{ password }}</label>
              <div v-if="!isSmsLogin">
                <input type="password" id="password"/>
              </div>
              <div v-else>
                <input type="text" id="password"/>
              </div>
              <div v-if="isSmsLogin">
                <button class="send-sms" @click="sendSms">发送验证码</button>
              </div>
              <div class="button-group">
                <input type="submit" id="submit" value="登录" @click="login"/>
                <input type="submit" @click="handleToggleMode" value="切换模式"/>
                <input type="submit" @click="register" value="注册"/>
              </div>
            </div>
          </transition>
        </div>

      </div>

    </transition>
  </div>

</template>

<style>
:root {
  --color-bg1: #dff9fb;
  --color-bg2: #ffffff;
  --color1: 104, 109, 224;
  --color2: 126, 214, 223;
  --color3: 223, 249, 251;
  --color4: 255, 121, 121;
  --color5: 149, 175, 192;
  --color6: 140, 100, 255;
  --circle-size: 200%;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter UI', sans-serif;
}

.gradient-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
}

.gradients-container {
  z-index: 1;
  position: absolute;
  filter: blur(40px);
  width: 100%;
  height: 100%;
}

.g1,
.g2,
.g3,
.g4,
.g5,
.g6 {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0%, rgba(var(--color1), 0) 50%);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
}

.g1 {
  animation: moveVertical 30s ease infinite;
}

.g2 {
  background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0%, rgba(var(--color2), 0) 50%);
  animation: moveInCircle 20s reverse infinite;
}

.g3 {
  background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0%, rgba(var(--color3), 0) 50%);
  animation: moveInCircle 40s linear infinite;
}

.g4 {
  background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0%, rgba(var(--color4), 0) 50%);
  animation: moveHorizontal 40s ease infinite;
}

.g5 {
  background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0%, rgba(var(--color5), 0) 50%);
  animation: moveInCircle 20s ease infinite;
}

.g6 {
  background: radial-gradient(circle at center, rgba(var(--color6), 0.8) 0%, rgba(var(--color6), 0) 50%);
  animation: moveInCircle 20s ease infinite;
}


.container {
  z-index: 10;
  position: relative;
  display: flex;
  height: 380px;
  width: 760px;
}

.left {
  background: white;
  height: 300px;
  position: relative;
  width: 50%;
  margin-top: 40px;
}

.login {
  font-size: 50px;
  font-weight: 900;
  margin: 50px 40px 40px;
}

.eula {
  color: #999;
  font-size: 16px;
  line-height: 1.5;
  margin: 40px;
}

.right {
  background: #474a59;
  box-shadow: 0 0 40px 16px rgba(0, 0, 0, 0.22);
  color: #f1f1f2;
  position: relative;
  width: 50%;
}

svg {
  position: absolute;
  width: 320px;
}

path {
  fill: none;
  stroke: url(#linearGradient);
  stroke-width: 4;
  stroke-dasharray: 240 1386;
}

.form {
  margin: 40px;
  position: absolute;
}

label {
  color: #c2c2c5;
  display: block;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 5px;
}

input {
  background: transparent;
  border: 0;
  color: #f2f2f2;
  font-size: 20px;
  outline: none;
  width: 100%;
}

input[type='submit'] {
  color: #707075;
  margin-top: 40px;
  transition: color 300ms;
}

.send-sms {
  background: #575fcf;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  transition: background 300ms;
}

.send-sms:hover {
  background: #686de0;
}

.button-group {
  display: flex;
  justify-content: space-between; /* 按钮之间自动分配间隔 */
  align-items: center;
  margin-top: 60px; /* 增加与上方表单的间隔 */
}

.button-group input[type='submit'] {
  flex: 1;
  margin: 0 15px;
  border: none;
  padding: 0.8rem;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background 300ms, transform 300ms, box-shadow 300ms; /* 添加多种属性的过渡效果 */
}

.button-group input[type='submit']:hover {
  color: white;
  background: #575fcf;
  transform: scale(1.05); /* 鼠标悬停时按钮稍微放大 */
  box-shadow: 0 5px 15px rgba(87, 95, 207, 0.4); /* 添加阴影效果 */
}

.button-group input[type='submit']:active {
  transform: scale(1); /* 点击时还原大小 */
  box-shadow: 0 3px 10px rgba(87, 95, 207, 0.2); /* 阴影变小 */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease; /* 设置动画时长和效果 */
}

.fade-enter-from, .fade-leave-to {
  opacity: 0; /* 初始和结束透明度 */
}


@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}
</style>

