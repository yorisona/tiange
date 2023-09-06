<template>
  <AuthLayout>
    <div class="tg-login-main">
      <div class="tg-login-form">
        <div class="banner">
          <img class="banner-img" src="@/assets/img/login/login-image.png" />
          <img class="left-img" src="@/assets/img/left.png" />
          <img class="right-img" src="@/assets/img/right.png" />
        </div>
        <div class="form">
          <el-form :model="form" :rules="formRules" ref="formRef">
            <caption class="form-cap">
              <div
                :class="['login-type talt', { active: isAccountLogin }]"
                @click="toggleLoginType"
              >
                账号密码登录
              </div>
              <div :class="['login-type', { active: isMobileLogin }]" @click="toggleLoginType">
                手机号登录
              </div>
            </caption>
            <template v-if="isAccountLogin">
              <el-form-item prop="username">
                <el-input
                  placeholder="请输入用户名"
                  v-model="form.username"
                  @keypress.enter.native="triggerPasswordFocus"
                >
                  <template #prefix>
                    <tg-icon name="ico-user" style="font-size: 20px" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="form.password"
                  ref="passwordRef"
                  @keypress.enter.native="onLoginBtnClick"
                  show-password
                >
                  <template #prefix>
                    <tg-icon name="ico-lock" style="font-size: 20px" />
                  </template>
                </el-input>
              </el-form-item>
            </template>
            <template v-if="isMobileLogin">
              <el-form-item prop="phone">
                <el-input
                  placeholder="请输入手机号"
                  v-model="form.phone"
                  key="phoneitem"
                  @keypress.enter.native="triggerUsercodeFocus"
                >
                  <template #prefix>
                    <tg-icon name="ico-mobile" style="font-size: 20px" />
                  </template>
                </el-input>
              </el-form-item>
              <!-- [图形验证码:获取短信验证码] -->
              <el-form-item prop="usercode">
                <el-input
                  v-model="form.usercode"
                  placeholder="输入字符"
                  auto-complete="off"
                  ref="usercodeRef"
                  @keypress.enter.native="triggerCodeFocus"
                >
                  <template #prefix>
                    <tg-icon name="ico-msg" style="font-size: 20px" />
                  </template>
                  <template #suffix>
                    <img
                      class="verify-code"
                      v-show="vCode !== ''"
                      :src="vCode"
                      @click="getVerifyCode"
                    />
                  </template>
                </el-input>
              </el-form-item>
              <!-- [短信验证码] -->
              <el-form-item prop="code">
                <el-input
                  v-model="form.code"
                  :maxlength="6"
                  placeholder="输入验证码"
                  auto-complete="off"
                  ref="codeRef"
                  @keypress.enter.native="onLoginBtnClick"
                >
                  <template #suffix>
                    <div>
                      <span
                        class="vcode-btn"
                        v-if="!getPhoneCodeStatus.status"
                        @click="handleGetPhoneCode"
                        >获取短信验证码</span
                      >
                      <span class="vcode-btn-count" v-if="getPhoneCodeStatus.status"
                        >重新获取（{{ getPhoneCodeStatus.time }}s）</span
                      >
                    </div>
                  </template>
                </el-input>
                <div class="code-tip tart" v-show="phoneCodeTimeTip">
                  验证码已发送，15分钟内输入有效
                </div>
              </el-form-item>
            </template>
            <el-form-item>
              <tg-button type="primary" class="login-btn" @click="onLoginBtnClick">登录</tg-button>
            </el-form-item>
            <div class="tac forget-pw"></div>
          </el-form>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script src="./login.ts"></script>
