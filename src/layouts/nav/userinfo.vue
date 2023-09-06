<template>
  <div class="nav-userinfo" @click.stop="toggleDropdownMenuVisible">
    <tg-icon name="ico-default-avatar" style="font-size: 24px" />
    <template v-if="isLogin">
      <span class="nickname">{{ nickname }}</span>
      <span class="role">（{{ role }}）</span>
    </template>
    <template v-else>
      <span class="nickname">未登录</span>
      <span class="role"></span>
    </template>
    <tg-icon name="ico-triangle-down" />
    <div
      class="dropdown-menu"
      :class="[dropdownMenuVisible ? 'active' : '', dropdownMenuLeaving ? 'inactive' : '']"
      @animationend="onDropdownMenuLeaveEnd"
      @click.stop
    >
      <div class="dropdown-menu-item" @click.stop="openResetPasswordDialog">修改密码</div>
      <div class="dropdown-menu-item" @click.stop="logout">退出登录</div>
    </div>
  </div>
</template>

<script src="./userinfo.ts"></script>

<style lang="less">
@import './userinfo.less';
</style>
