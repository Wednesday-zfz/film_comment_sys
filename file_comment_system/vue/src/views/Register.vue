<script>
import anime from 'animejs';
import request from "../utils/request";
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      allCleared: false,
      formFields: {
        username: "用户名",
        password: "密码",
        confirmPassword: "确认密码",
        phone: "手机号",
        verificationCode: "验证码",
      },
    };
  },

  methods: {
    goToLogin() {
      this.allCleared = true;
      setTimeout(() => {
        this.$router.push({name: 'login'});
      }, 300);
    },

    async sendSms() {
      const phone = document.querySelector('#phone').value;

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

    async register() {
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      const confirmPassword = document.querySelector('#confirm-password').value;
      const phone = document.querySelector('#phone').value;
      const verificationCode = document.querySelector('#verification-code').value;

      if (!username || !password || !confirmPassword || !phone || !verificationCode) {
        ElMessage.error("请填写完整信息！");
        return;
      }

      if (password !== confirmPassword) {
        ElMessage.error("两次密码输入不一致！");
        return;
      }

      if (phone.length !== 11) {
        ElMessage.error("手机号格式错误！");
        return;
      }

      try {
        const res = await request.post(
            '/register/',
            {
              username: username,
              password: password,
              phone: phone,
              code: verificationCode,
            }
        );
        if (res.status === "success") {
          ElMessage.success("注册成功！");
          this.goToLogin();
        } else {
          ElMessage.error(res.message || "注册失败");
        }
      } catch (error) {
        console.log(error);
        ElMessage.error(error.response.data.message || "注册失败");
        if (error.response.data.errors) {
          for (const key in error.response.data.errors) {
            ElMessage.error(error.response.data.errors[key][0]);
          }
        }
      }
    },

    loadInputFocusHooks() {
      const inputs = [
        {id: '#username', order: 0},
        {id: '#password', order: 1},
        {id: '#confirm-password', order: 2},
        {id: '#phone', order: 3},
        {id: '#verification-code', order: 4}
      ];

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

      const maxPathLength = '240 1590'; // 根据蛇形运动的长度适配

      // 手动设置每个输入框的偏移量
      const offsets = [
        0,          // username的偏移量
        -338,       // password的偏移量
        -678,       // confirm-password的偏移量
        -1017,       // phone的偏移量
        -1355       // verification-code的偏移量
      ];

      inputs.forEach(({id, order}) => {
        const offset = offsets[order]; // 获取对应的偏移量
        const input = document.querySelector(id);
        if (input) {
          input.removeEventListener('focus', input.handleFocus);
          input.handleFocus = () => animatePath(offset, maxPathLength);
          input.addEventListener('focus', input.handleFocus);
        }
      });
    }

  },

  mounted() {
    this.loadInputFocusHooks();
  },

};
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
      <div v-if="!allCleared" class="container-new">
        <div class="left-new">
          <div class="login">注册</div>
          <div class="eula">
            <b>请填写完整注册信息</b>
            <br/>
            <br/>
            <b>账号信息包括用户名、密码、手机号等</b>
          </div>
        </div>

        <div class="right">
          <svg viewBox="0 0 320 500">
            <defs>
              <linearGradient id="linearGradient" x1="13" y1="193.5" x2="307" y2="193.5">
                <stop style="stop-color:#ff00ff;" offset="0"/>
                <stop style="stop-color:#ff0000;" offset="1"/>
              </linearGradient>
            </defs>
            <path
                d="m 40,120
                 240,0
                 c 0,0 25,0.8 25,37
                0,36.2 -25,35 -25,37
                h -240
                c 0,0 -25,4.0 -25,38.5
                0,34.5 25,38.5 25,38.5
                h 240
                c 0,0 25,0.8 25,38
                0,37.2 -25,35 -25,38
                h -240
                c 0,0 -25,4.0 -25,38.5
               0,34.5 25,38.5 25,38.5
                h 240"
            />
          </svg>
          <div class="form">
            <label for="username">{{ formFields.username }}</label>
            <input type="text" id="username"/>
            <label for="password">{{ formFields.password }}</label>
            <input type="password" id="password"/>
            <label for="confirm-password">{{ formFields.confirmPassword }}</label>
            <input type="password" id="confirm-password"/>
            <label for="phone">{{ formFields.phone }}</label>
            <input type="text" id="phone"/>
            <label for="verification-code">{{ formFields.verificationCode }}</label>
            <input type="text" id="verification-code"/>
            <button class="send-sms" @click="sendSms">发送验证码</button>
            <div class="button-group">
              <input type="submit" id="register-submit" value="注册" @click="register"/>
              <input type="submit" @click="goToLogin" value="返回登录"/>
            </div>
          </div>
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


.container-new {
  z-index: 10;
  position: relative;
  display: flex;
  width: 760px;
  height: 600px;
}

.left-new {
  background: white;
  height: 300px;
  position: relative;
  width: 50%;
  margin-top: 150px;
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
  box-sizing: border-box;
}

svg {
  position: absolute;
  width: 320px;
}

path {
  fill: none;
  stroke: url(#linearGradient);
  stroke-width: 4;
  stroke-dasharray: 240 1590;
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

