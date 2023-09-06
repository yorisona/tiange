<script src="./index.ts" lang="ts"></script>

<template>
  <div style="min-height: 500px; padding-top: 6px">
    <tg-button
      v-if="
        (permission.view_or_save_shop_daily_report ||
          permission.local_life_view_or_save_shop_daily_report) &&
        is_from_project
      "
      type="primary"
      icon="ico-btn-add"
      @click="onAddClick"
      style="margin-top: 18px"
      >新增批注</tg-button
    >
    <div style="margin: 18px 0">
      <div v-for="item in list" :key="item" class="title-detail">
        <div class="title">
          <span>
            {{ item.live_start_time }} - {{ item.live_end_time }}
            <span style="margin-left: 24px; color: var(--text-third-color)">{{
              item.flower_name
            }}</span></span
          >
          <span
            v-if="
              (permission.view_or_save_shop_daily_report ||
                permission.local_life_view_or_save_shop_daily_report) &&
              is_from_project
            "
            class="operation-area"
          >
            <tg-icon class="ico-btn" name="ico-delete" @click="deleteClick(item)" />
          </span>
        </div>
        <div class="detail">{{ item.comment }}</div>
      </div>
      <div v-if="list.length < 1">
        <empty-common
          :imgWidth="200"
          :imgHeight="100"
          v-if="list.length === 0"
          style="margin-top: 150px"
          detail-text="暂无数据~"
        />
      </div>
    </div>
    <addDialog
      :performanceId="performanceId"
      :projectData="projectData"
      :visiable="dialogVisiable"
      @closeAction="closeAction"
    />
  </div>
</template>

<style lang="less" scoped>
.title-detail {
  margin-bottom: 16px;
  padding: 16px 18px;
  border: 1px solid var(--border-line-div-color);
  border-radius: 4px;
  .item-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(var(--theme-rgb-color), 0.09);
    text-align: center;
    line-height: 36px;
    font-weight: 600;
    font-size: 16px;
  }
  .operation-area {
    display: none;
  }
  &:hover {
    box-shadow: 0 2px 8px 0 rgba(53, 81, 202, 0.1);
    border: 1px solid var(--theme-color);
    .operation-area {
      display: block;
      .ico-btn {
        color: var(--text-third-color);
        margin-left: 12px;
        font-size: 20px;
        width: 13px;
        height: 13px;
        cursor: pointer;
      }
    }
  }
}
.title {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-color);
}
.detail {
  margin-top: 8px;
  color: var(--text-second-color);
  font-size: 12px;
  font-weight: 400;
  padding: 0 32px 0 0;
  line-height: 20px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  word-break: break-all; //只对英文起作用，以字母作为换行依据
  word-wrap: break-word; //只对英文起作用，以单词作为换行依据
  white-space: pre-wrap; //只对中文起作用，强制换行
}
</style>
