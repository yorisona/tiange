<template>
  <div class="drawer-header">
    <span class="drawer-header-tag"></span>
    <span class="drawer-header-title">{{ title }}</span>
    <slot></slot>
  </div>
</template>

<script src="./drawer.header.ts"></script>

<style lang="less">
@import './drawer.header.less';
</style>
