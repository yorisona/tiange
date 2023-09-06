<template>
  <div class="tg-live-display-detail-tab-pane3" style="padding: 0 18px">
    <div class="edit-block">
      <tg-button
        icon="ico-add-lite"
        type="primary"
        v-if="Permission.canEdit && canEditFormData"
        class="live-data-typein-button"
        @click="toggleLiveDataInputModalVisible(true)"
        >录入直播数据</tg-button
      >
      <!-- <a @click="toggleLiveDataInputModalVisible(true)">录入直播数据</a> -->
    </div>
    <!-- 关联直播间实时数据 -->
    <div style="margin-bottom: 19px; border-bottom: 1px solid var(--border-line-color)">
      <div style="margin-top: 10px; height: 40px; line-height: 40px; color: var(--text-color)">
        关联直播间实时数据
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
              v-if="Permission.canDownloadTaobaoLiveStudioData"
              style="color: #297aff; cursor: pointer"
              @click="handleDownloadTaobaoLiveStudioData(LiveLog)"
            >
              下载实时数据
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="NoDisplayInfoData">
      <div
        class="live-data-typein-info"
        style="height: 40px; line-height: 40px; color: var(--text-color)"
      >
        <span>直播数据</span>
        <span class="live-data-typein-info-label">录入人：</span
        ><span class="live-data-typein-info-value" style="margin-right: 24px">{{
          liveDisplay.live_data_add_by_username ? liveDisplay.live_data_add_by_username : '--'
        }}</span>
        <span class="live-data-typein-info-label">录入时间：</span
        ><span class="live-data-typein-info-value">{{
          liveDisplay.live_data_time ? liveDisplay.live_data_time : '--'
        }}</span>
      </div>
      <tg-block class="mgt-10 flex-auto">
        <el-table stripe>
          <template #empty>
            <div class="tg-page-empty">
              <empty-common detail-text="暂无直播数据"></empty-common>
            </div>
          </template>
        </el-table>
      </tg-block>
    </div>

    <div v-if="!NoDisplayInfoData">
      <div
        class="live-data-typein-info"
        style="height: 40px; line-height: 40px; color: var(--text-color)"
      >
        <span>直播数据</span>
        <span class="live-data-typein-info-label">录入人：</span
        ><span class="live-data-typein-info-value" style="margin-right: 24px">{{
          liveDisplay.live_data_add_by_username ? liveDisplay.live_data_add_by_username : '--'
        }}</span>
        <span class="live-data-typein-info-label">录入时间：</span
        ><span class="live-data-typein-info-value">{{
          liveDisplay.live_data_time ? liveDisplay.live_data_time : '--'
        }}</span>
      </div>
      <div class="sub-block">
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">直播时间：</div>
            <div class="base-grid-item-content">
              {{ liveTimeFormat(DisplayInfo.real_start_time, DisplayInfo.real_end_time) }}
            </div>
          </div>
        </div>
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">直播时长：</div>
            <div class="base-grid-item-content">{{ real_duration_str }}</div>
          </div>
        </div>
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">直播链接：</div>
            <div class="base-grid-item-content">
              <a :href="DisplayInfo.live_url" rel="noopener noreferrer" target="_blank">{{
                DisplayInfo.live_url
              }}</a>
            </div>
          </div>
        </div>
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">直播时长截图：</div>
            <div class="base-grid-item-content">
              <el-image
                v-if="DisplayInfo.duration_screenshot"
                class="avatar"
                style="height: 80px; width: auto"
                :src="DisplayTimeImageUrl"
                :preview-src-list="[DisplayTimeImageUrl, DisplayDataImageUrl]"
              >
              </el-image>
            </div>
          </div>
        </div>
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">直播数据截图：</div>
            <div class="base-grid-item-content">
              <el-image
                v-if="DisplayInfo.data_screenshot"
                class="avatar"
                style="height: 134px; width: auto"
                :src="DisplayDataImageUrl"
                :preview-src-list="[DisplayDataImageUrl, DisplayTimeImageUrl]"
              >
              </el-image>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TgLiveDisplayDataInputDialog
      :visible="AddLiveDataInputVisible"
      @dialog:close="onAddDataInputModalClose"
      :DisplayInfo="DisplayInfo"
    />
  </div>
</template>

<script src="./pane3.ts"></script>

<style lang="less">
@import './pane3.less';
</style>
