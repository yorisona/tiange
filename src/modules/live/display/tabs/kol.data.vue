<!--
 * @Brief: 主播数据
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2020-12-28 16:54:33
-->
<template>
  <div class="tg-live-display-detail-tab-kol-data mgt-12">
    <div>
      <tg-button
        icon="ico-add-lite"
        type="primary"
        v-if="Permission.canEdit && showTypeIn"
        class="kol-data-typein-button"
        @click="typeInAction"
        >录入主播数据</tg-button
      >
    </div>
    <!-- 关联直播间场记 -->
    <div style="border-bottom: 1px solid var(--border-line-color)">
      <div style="margin-top: 12px; height: 40px; line-height: 40px; color: var(--text-color)">
        关联直播间场记
      </div>
      <div
        v-if="!TaobaoLiveLogs.length"
        style="margin-top: 20px; margin-bottom: 30px; width: 100%; text-align: center"
      >
        <div class="tg-page-empty" style="margin: 60px 0">
          <empty-common detail-text="请使用天鸽插件并在直播中控台关联直播场次"></empty-common>
        </div>
      </div>
      <div
        style="display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; line-height: 32px"
        v-for="(LiveLog, index) in TaobaoLiveLogs"
        :key="index"
      >
        <div class="base-grid">
          <div style="padding-left: 18px; min-width: 288px">
            <div class="base-grid-item-content" style="color: var(--text-color)">
              {{ index + 1 }} {{ LiveLog.title }}
            </div>
          </div>
          <div style="width: 414px">
            <div style="float: left; width: 70px; color: #a4b2c2">直播时间：</div>
            <div style="color: var(--text-color)">
              {{ LiveLog.start_time }} ~ {{ LiveLog.end_time }}
            </div>
          </div>
          <div style="min-width: 308px">
            <div
              v-if="Permission.canDownloadTaobaoLiveLog"
              style="color: #297aff; cursor: pointer"
              @click="handleDownloadTaobaoLiveLog(LiveLog)"
            >
              下载直播间场记
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="kol-data-typein-info">
      <span class="kol-data-typein-info-label">录入人：</span
      ><span class="kol-data-typein-info-value" style="margin-right: 24px">{{
        list.length ? list[list.length - 1].add_by_username : '--'
      }}</span>
      <span class="kol-data-typein-info-label">录入时间：</span
      ><span class="kol-data-typein-info-value">{{
        list.length ? list[list.length - 1].gmt_modified : '--'
      }}</span>
    </div>
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index"> </el-table-column>
      <!-- 空白页 -->
      <template #empty>
        <empty-common detail-text="暂无主播数据"></empty-common>
      </template>
    </el-table>
    <kolDataTypeIn
      :typeInKols="typeInKols"
      :liveDisplayID="id"
      :visible="typeInVisiable"
      @close="typeInVisiable = false"
      @save="save"
    ></kolDataTypeIn>
  </div>
</template>

<script src="./kol.data.ts"></script>
<style lang="less">
.tg-live-display-detail-tab-kol-data {
  padding: 0 18px;
  position: relative;

  .base-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    padding: 5px 0;
    > .base-grid-item {
      > .base-grid-item-lbl {
        width: 100px;
        flex: none;
      }
      > .base-grid-item-content {
        width: 500px;
      }
    }
  }

  .kol-data-typein-button {
    margin-right: 24px;
  }
  .kol-data-typein-info {
    // display: flex;
    // line-height: 32px;
    // margin-top: 2px;
    // margin-bottom: 12px;
    height: 40px;
    display: flex;
    align-items: center;
    .kol-data-typein-info-label {
      // margin-left: 24px;
      color: #a4b2c2;
    }
    .kol-data-typein-info-value {
      color: var(--text-color);
    }
  }
  .kol-data-empty {
    margin: 60px 0;
  }
}
</style>
