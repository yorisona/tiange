<template>
  <div class="tg-homepage">
    <Sider />
    <main class="main">
      <!-- header -->
      <div class="header header-top" :class="menuIsMini ? 'mini-header' : ''">
        <div class="page-name">
          <div v-if="!isExternal() && routes" class="name crumbs">
            <tg-breadcrumbs :showBackLeft="!isExternal() && backIconShow" :routes="routes" />
          </div>
          <template v-else>
            <tg-icon
              @click="backClick()"
              v-if="!isExternal() && backIconShow"
              name="ico-arrow-left"
            />
            <div class="name">
              {{ $route.meta.name === '模板管理' ? '合同模板管理' : $route.meta.name }}
            </div>
          </template>
        </div>
        <UserInfo @reset:start="toggleResetPasswordDialog(true)" />
      </div>
      <div class="main-content">
        <div class="main-content-inner">
          <transition name="fade">
            <keep-alive>
              <router-view class="router-view-content" v-if="$route.meta.isKeepLive" />
            </keep-alive>
          </transition>
          <transition name="fade">
            <router-view class="router-view-content" v-if="!$route.meta.isKeepLive" />
          </transition>
        </div>
      </div>
    </main>
    <a class="editor-link" v-if="isDev" href="/plugins/generate/editor" target="_meijv"
      >枚举编辑器</a
    >
    <el-dialog
      :visible="resetPasswordDialogVisible"
      class="customer-dialog reset-password-frm-dialog"
      width="444px"
      height="339px"
      top="15vh"
      :close-on-click-modal="false"
      @close="closeResetPasswordDialog"
    >
      <template #title>修改密码</template>
      <div style="padding: 12px 24px">
        <el-form
          class="el-form-vertical"
          :model="resetPwFrm"
          :rules="resetPwFrmRules"
          style="padding: 0"
          ref="resetPwFrmRef"
        >
          <el-form-item label="旧密码" prop="password">
            <el-input
              size="small"
              type="password"
              v-model="resetPwFrm.password"
              placeholder="请输入旧密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input
              size="small"
              type="password"
              v-model="resetPwFrm.new_password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="password_confirm">
            <el-input
              size="small"
              type="password"
              v-model="resetPwFrm.password_confirm"
              placeholder="请再次确认密码"
              show-password
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="closeResetPasswordDialog">取消</tg-button>
        <tg-button type="primary" @click="resetPassword">保存</tg-button>
      </template>
    </el-dialog>
    <GlobalConfig />
  </div>
</template>

<script src="./home.ts"></script>

<style lang="less">
@import './home.less';
</style>
