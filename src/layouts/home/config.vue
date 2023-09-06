<template>
  <el-dialog
    class="tg-dialog-classic tg-dialog-vcenter-new"
    :visible="globalConfigDialogVisible"
    width="500px"
    @close="closeGlobalConfigDialog"
    lock-scroll
    destroy-on-close
  >
    <template #title>全局配置</template>
    <div class="global-setting-content">
      <div class="warning" style="">请注意，本配置项仅限 当前浏览器*当前用户</div>
      <div class="scrollbar-list">
        <div class="subject">列表页滚动范围</div>
        <div class="scrollbar-setting-grid">
          <template v-for="(item, itemIndex) in scrollbarSettingList">
            <div :key="itemIndex">{{ item.name }}</div>
            <div :key="`d${itemIndex}`">
              <el-switch
                inactive-text="全工作区"
                active-text="仅表格内"
                size="small"
                v-model="item.value"
                @change="onSwitchChange"
              />
            </div>
          </template>
        </div>
        <div class="subject">二次确认对话框</div>
        <div class="scrollbar-setting-grid">
          <div>确认/取消快捷键</div>
          <div>
            <el-switch
              inactive-text="不启用"
              active-text="启用"
              size="small"
              v-model="enableConfirmDialogHotkey"
              @change="onConfirmDialogHotkeySwitchChange"
            />
          </div>
          <div>快捷键显示在按钮上</div>
          <div>
            <el-switch
              inactive-text="不显示"
              active-text="显示"
              size="small"
              v-model="enableConfirmDialogHotkeyShowInButton"
              @change="onConfirmDialogHotkeySwitchChange"
              :disabled="!enableConfirmDialogHotkey"
            />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { useGlobalConfig } from '@/use/app.global';

export default defineComponent({
  setup() {
    return {
      ...useGlobalConfig(),
    };
  },
});
</script>

<style lang="less">
@import '~@/styles/utils/index.less';
// 全局配置对话框
.global-setting-content {
  .pd(12px 18px);
  user-select: none;
  .subject {
    .fs(18px);
    .mg(6px 0);
    font-weight: 600;
  }
  .scrollbar-list {
    .pdt(12px);
  }
  .scrollbar-setting-grid {
    display: grid;
    grid-template-columns: repeat(2, auto);
    row-gap: 6px;
  }

  .warning {
    padding: 12px;
    font-size: 12px;
    .fgc(var(--warning-color));
    .bgc(rgba(var(--warning-rgb-color),0.06));
    .brdr(2px);
  }
}
</style>
