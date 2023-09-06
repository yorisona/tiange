<template>
  <div class="tg-live-display-detail-page">
    <div
      v-loading="PermissionCheckLoading"
      class="abnormal-empty"
      v-if="!inProjectTeam"
      style="background: #fff"
    >
      <div class="abnormal-empty-content">
        <empty-common
          :detail-text="
            inProjectTeam === undefined ? '获取场次详情失败，请稍后重试' : '暂无查看当前场次的权限'
          "
        ></empty-common>
      </div>
    </div>
    <div
      v-if="inProjectTeam && displayInfo !== undefined"
      style="height: 100%; flex-grow: 1; background: white; overflow-y: overlay; overflow-x: auto"
    >
      <div style="min-width: 1212px">
        <tg-block class="tg-live-display-info flex-none">
          <div class="dis-display-title">
            <div class="dis-display-title-left">
              <!-- 标题 -->
              <tg-icon class="diaplay-icon" :name="business_icon(displayInfo.business_type)" />
              <span>{{ displayInfo.live_title }}</span>
              <!-- 状态 -->
              <span
                v-if="displayInfo.live_status"
                :class="statusClasses(displayInfo.live_status)"
                >{{ liveStatus(displayInfo.live_status) }}</span
              >
            </div>
            <div class="dis-display-title-edit" v-if="displayInfo.project_uid">
              <!-- 待录入时才显示 -->
              <el-popover
                placement="top"
                trigger="hover"
                content="编辑"
                popper-class="tg-live-display-detail-custom-popover"
              >
                <tg-button
                  slot="reference"
                  v-if="
                    (Permission.canEdit && displayInfo.live_status !== LiveDisplayStatus.lived) ||
                    (Permission.canEditLived && displayInfo.live_status === LiveDisplayStatus.lived)
                  "
                  @click="handleEditDisplayAction"
                  type="link"
                >
                  <tg-icon name="ico-edit"></tg-icon>
                </tg-button>
              </el-popover>

              <span
                class="verLine"
                v-if="Permission.canEdit && displayInfo.live_status !== LiveDisplayStatus.lived"
                >|</span
              >

              <el-popover
                placement="top"
                trigger="hover"
                content="删除"
                popper-class="tg-live-display-detail-custom-popover"
              >
                <tg-button
                  slot="reference"
                  v-if="Permission.canEdit && displayInfo.live_status !== LiveDisplayStatus.lived"
                  @click="handleDeleteDisplayAction"
                  type="link"
                >
                  <tg-icon name="ico-delete"></tg-icon>
                </tg-button>
              </el-popover>

              <span
                class="verLine"
                v-if="Permission.canEdit && displayInfo.live_status !== LiveDisplayStatus.lived"
                >|</span
              >

              <el-popover
                placement="top"
                trigger="hover"
                content="关闭"
                popper-class="tg-live-display-detail-custom-popover"
              >
                <tg-button
                  slot="reference"
                  v-if="Permission.canEdit && displayInfo.live_status !== LiveDisplayStatus.lived"
                  @click="handleCloseDisplayAction"
                  type="link"
                >
                  <tg-icon name="ico-power"></tg-icon>
                </tg-button>
              </el-popover>
            </div>
          </div>
          <div
            class="display-datetime-info"
            style="margin-top: -9px; font-size: 14px; color: var(--text-second-color)"
          >
            直播时间：{{ display_live_date_range_str }}
          </div>
          <div class="div-display-info">
            <div class="display-info-block" style="width: 43.103%">
              <div class="display-info-block-header" style="display: flex; width: auto">
                <div
                  style="
                    border-radius: 1px;
                    height: 14px;
                    margin-top: 2px;
                    line-height: 18px;
                    width: 3px;
                    margin-right: 2px;
                    border-left: 3px solid rgba(var(--theme-rgb-color), 0.9);
                  "
                ></div>
                直播数据
                <div v-if="isTaobaoDisplay">
                  <div v-if="TaobaoLiveLogs.length === 0" style="color: rgba(60, 82, 105, 0.4)">
                    未关联场次
                  </div>
                  <div v-else style="color: var(--theme-color)">
                    <el-popover
                      placement="top"
                      trigger="hover"
                      popper-class="tg-live-display-detail-custom-popover"
                    >
                      <div>
                        <div
                          v-for="(TbLiveLog, tb_index) in TaobaoLiveLogs"
                          :key="tb_index"
                          style="margin-bottom: 12px"
                        >
                          <span style="color: #6a7b92">{{ TbLiveLog.title }}</span
                          >&nbsp;
                          <span style="color: var(--text-color)">{{
                            formDateRangeStr(TbLiveLog.start_time, TbLiveLog.end_time)
                          }}</span>
                        </div>
                      </div>
                      <span slot="reference" style="cursor: pointer"> 已关联场次 </span>
                    </el-popover>
                  </div>
                </div>
              </div>
              <div
                v-if="TaobaoLiveLogs.length !== 0"
                style="margin-top: 20px"
                class="display-info-block-live-data"
              >
                <div class="display-info-data-block">
                  <div style="font-size: 12px; color: var(--text-third-color)">
                    引导成交金额（万）
                  </div>
                  <div style="font-size: 14px; color: var(--text-color)">
                    {{ LiveStatData.promote_order_amount }}
                  </div>
                </div>
                <div class="display-info-data-block">
                  <div style="font-size: 12px; color: var(--text-third-color)">引导成交件数</div>
                  <div style="font-size: 14px; color: var(--text-color)">
                    {{ LiveStatData.promote_order_num }}
                  </div>
                </div>
                <div class="display-info-data-block">
                  <div style="font-size: 12px; color: var(--text-third-color)">引导成交人数</div>
                  <div style="font-size: 14px; color: var(--text-color)">
                    {{ LiveStatData.promote_order_person }}
                  </div>
                </div>
              </div>
              <div
                v-else
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 14px;
                  color: var(--text-third-color);
                "
              >
                <div style="padding-top: 50px" v-if="isTaobaoDisplay">暂无数据</div>
                <div
                  v-if="!isTaobaoDisplay && !shopLiveStatistic"
                  style="font-size: 14px; color: var(--text-third-color); padding-top: 50px"
                >
                  暂未获取场次数据
                </div>
                <div
                  class="display-info-live-data-douyin-grid"
                  v-if="!isTaobaoDisplay && shopLiveStatistic"
                  style="font-size: 14px; color: rgba(60, 82, 105, 0.4); display: grid"
                >
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">GMV</div>
                    <div
                      class="item-value"
                      :class="formatNum(shopLiveStatistic.gmv, true) === '--' ? '' : 'price'"
                    >
                      <!-- {{
                        shopLiveStatistic
                          ? formatAmount(shopLiveStatistic.gmv ? shopLiveStatistic.gmv : 0, 'None')
                          : '0'
                      }} -->
                      {{ formatNum(shopLiveStatistic.gmv, true) }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">曝光-进入率</div>
                    <div class="item-value">
                      <!-- {{
                        shopLiveStatistic
                          ? shopLiveStatistic.watch_cnt_show_ratio
                            ? shopLiveStatistic.watch_cnt_show_ratio
                            : 0
                          : 0
                      }}% -->
                      {{
                        formatNum(shopLiveStatistic.watch_cnt_show_ratio, true, true) === '--'
                          ? '--'
                          : `${formatNum(shopLiveStatistic.watch_cnt_show_ratio, true, true)}%`
                      }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">人均观看时长</div>
                    <div class="item-value">
                      <!-- {{
                        shopLiveStatistic
                          ? formatAmount(
                              shopLiveStatistic.avg_watch_duration
                                ? shopLiveStatistic.avg_watch_duration
                                : 0,
                              'None',
                              true,
                            )
                          : 0
                      }}秒 -->
                      {{
                        formatNum(shopLiveStatistic.avg_watch_duration, false) === '--'
                          ? '--'
                          : `${formatNum(shopLiveStatistic.avg_watch_duration, false)}秒`
                      }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">分钟评论次数</div>
                    <div class="item-value">
                      <!-- {{
                        shopLiveStatistic
                          ? formatAmount(
                              shopLiveStatistic.avg_min_comment_cnt
                                ? shopLiveStatistic.avg_min_comment_cnt
                                : 0,
                              'None',
                              true,
                            )
                          : '0'
                      }} -->
                      {{ formatNum(shopLiveStatistic.avg_min_comment_cnt, false) }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">千次观看转化</div>
                    <div
                      class="item-value"
                      :class="formatNum(shopLiveStatistic.gpm, true) === '--' ? '' : 'price'"
                    >
                      <!-- {{
                        shopLiveStatistic
                          ? formatAmount(shopLiveStatistic.gpm ? shopLiveStatistic.gpm : 0, 'None')
                          : '0'
                      }} -->
                      {{ formatNum(shopLiveStatistic.gpm, true) }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">观看成交转化率</div>
                    <div class="item-value">
                      <!-- {{
                        shopLiveStatistic
                          ? shopLiveStatistic.watch_pay_ucnt_ratio
                            ? shopLiveStatistic.watch_pay_ucnt_ratio
                            : 0
                          : 0
                      }}% -->
                      {{
                        formatNum(shopLiveStatistic.watch_pay_ucnt_ratio, false, true) === '--'
                          ? '--'
                          : `${formatNum(shopLiveStatistic.watch_pay_ucnt_ratio, false, true)}%`
                      }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">粉丝购买占比</div>
                    <div class="item-value">
                      <!-- {{
                        shopLiveStatistic
                          ? shopLiveStatistic.old_fans_pay_ucnt_ratio
                            ? shopLiveStatistic.old_fans_pay_ucnt_ratio
                            : 0
                          : 0
                      }}% -->
                      {{
                        formatNum(shopLiveStatistic.old_fans_pay_ucnt_ratio, false, true) === '--'
                          ? '--'
                          : `${formatNum(shopLiveStatistic.old_fans_pay_ucnt_ratio, false, true)}%`
                      }}
                    </div>
                  </div>
                  <div class="display-info-live-data-douyin-grid-item">
                    <div class="item-label">成交人数</div>
                    <div class="item-value">
                      <!-- {{
                        shopLiveStatistic
                          ? formatAmount(
                              shopLiveStatistic.pay_ucnt ? shopLiveStatistic.pay_ucnt : 0,
                              'None',
                              true,
                            )
                          : '0'
                      }} -->
                      {{ formatNum(shopLiveStatistic.pay_ucnt, false) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="TaobaoLiveLogs.length !== 0" class="display-info-block-live-data">
                <div class="display-info-data-block">
                  <div style="font-size: 12px; color: var(--text-third-color)">引导成交转化率</div>
                  <div style="font-size: 14px; color: var(--text-color)">
                    {{ LiveStatData.promote_order_conversion_rate }}
                  </div>
                </div>
                <div class="display-info-data-block">
                  <div style="font-size: 12px; color: var(--text-third-color)">
                    粉丝成交金额占比
                  </div>
                  <div style="font-size: 14px; color: var(--text-color)">
                    {{ LiveStatData.fans_order_amount_percent }}
                  </div>
                </div>
                <div class="display-info-data-block">
                  <div style="font-size: 12px; color: var(--text-third-color)">更多数据</div>
                  <div style="cursor: pointer; font-size: 14px; color: var(--theme-color)">
                    <a v-if="LiveStatData.view_link" :href="LiveStatData.view_link" target="_blank"
                      >查看</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="display-info-block" style="width: 27.586%">
              <div class="display-info-block-header">
                <div
                  style="
                    border-radius: 1px;
                    height: 14px;
                    margin-top: 2px;
                    line-height: 18px;
                    width: 3px;
                    margin-right: 2px;
                    border-left: 3px solid rgba(var(--theme-rgb-color), 0.9);
                  "
                ></div>
                主播排班
                <el-popover
                  style="margin-left: 8px; margin-top: -1px"
                  placement="top"
                  trigger="hover"
                  content="编辑"
                  popper-class="tg-live-display-detail-custom-popover"
                >
                  <tg-button
                    slot="reference"
                    v-if="CanEditStatus && Permission.canEditKOLSchedule"
                    @click="handleEditDisplayScheduleAction('anchor')"
                    type="link"
                  >
                    <tg-icon name="ico-edit"></tg-icon>
                  </tg-button>
                </el-popover>
              </div>
              <div
                style="
                  margin-top: 20px;
                  margin-left: 27px;
                  padding-right: 18px;
                  color: var(--text-color);
                  font-size: 12px;
                  line-height: 18px;
                  height: 110px;
                  overflow: auto;
                "
              >
                <div v-if="kolScheduleList.length > 0">
                  <div
                    style="margin-bottom: 12px; display: flex"
                    v-for="(kolItem, kolItemIndex) in kolScheduleList"
                    :key="kolItemIndex"
                  >
                    <div style="min-width: 140px">{{ kolItem.date_range_str }}</div>
                    <div style="min-width: 120px">{{ kolItem.users_str }}</div>
                  </div>
                </div>
                <div
                  v-else
                  style="
                    margin-top: 30px;
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                    color: var(--text-third-color);
                  "
                >
                  暂无排班
                </div>
              </div>
            </div>
            <div class="display-info-block" style="width: 27.586%">
              <div class="display-info-block-header">
                <div
                  style="
                    border-radius: 1px;
                    height: 14px;
                    margin-top: 2px;
                    line-height: 18px;
                    width: 3px;
                    margin-right: 2px;
                    border-left: 3px solid rgba(var(--theme-rgb-color), 0.9);
                  "
                ></div>
                运营排班
                <el-popover
                  style="margin-left: 8px; margin-top: -1px"
                  placement="top"
                  trigger="hover"
                  content="编辑"
                  popper-class="tg-live-display-detail-custom-popover"
                >
                  <tg-button
                    slot="reference"
                    v-if="CanEditStatus && Permission.canEditOperatorSchedule"
                    @click="handleEditDisplayScheduleAction('assistant')"
                    type="link"
                  >
                    <tg-icon name="ico-edit"></tg-icon>
                  </tg-button>
                </el-popover>
              </div>
              <div
                style="
                  margin-top: 20px;
                  margin-left: 27px;
                  padding-right: 18px;
                  color: var(--text-color);
                  font-size: 12px;
                  line-height: 18px;
                  height: 110px;
                  overflow: auto;
                "
              >
                <div v-if="OperatorScheduleList.length > 0">
                  <div
                    style="margin-bottom: 12px; display: flex"
                    v-for="(OpItem, OpIndex) in OperatorScheduleList"
                    :key="OpIndex"
                  >
                    <div style="min-width: 140px">{{ OpItem.date_range_str }}</div>
                    <div style="min-width: 120px">{{ OpItem.users_str }}</div>
                  </div>
                </div>
                <div
                  v-else
                  style="
                    margin-top: 30px;
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                    color: var(--text-third-color);
                  "
                >
                  暂无排班
                </div>
              </div>
            </div>
          </div>
        </tg-block>
        <!-- 抖音店播 - 直播留档 -->
        <tg-card
          v-if="!isTaobaoDisplay"
          class="pane-block flex-auto"
          :padding="[0, 18, 0, 18]"
          :style="{
            height: isFromLocalLife ? 'calc(100% - 120px)' : 'calc(100% - 320px)',
            marginTop: '24px',
          }"
        >
          <div>
            <div class="live-record-info-block-header">
              <div style="display: flex; height: 18px; margin-top: 5px">
                <div
                  style="
                    border-radius: 1px;
                    height: 14px;
                    margin-top: 3px;
                    line-height: 18px;
                    width: 3px;
                    margin-right: 2px;
                    border-left: 3px solid rgba(var(--theme-rgb-color), 0.9);
                  "
                ></div>
                直播留档
              </div>
              <tg-button
                v-if="CanEditStatus && Permission.canEditArchive"
                @click="AddLiveRecordHandler"
                type="primary"
                style="margin-left: 18px"
                >提交留档</tg-button
              >
            </div>
            <div
              style="
                color: var(--text-third-color);
                font-size: 16px;
                text-align: center;
                margin-top: 120px;
              "
              v-if="Permission.canEditArchive && ShopLiveRecordDataList.length === 0"
            >
              <empty-common detail-text="暂无留档信息"></empty-common>
            </div>
            <div
              v-if="!Permission.canEditArchive"
              style="
                color: var(--text-third-color);
                font-size: 16px;
                text-align: center;
                margin-top: 120px;
              "
            >
              <empty-common detail-text="暂无查看留档信息的权限"></empty-common>
            </div>
            <div v-if="Permission.canEditArchive">
              <div
                class="live-record-info-block"
                v-for="(LiveData, index) in ShopLiveRecordDataList"
                :key="index"
              >
                <div class="live-record-info-data-block">
                  <div style="display: flex; justify-content: space-between">
                    <div
                      style="display: grid; grid-template-columns: repeat(4, auto); width: 733px"
                    >
                      <div>
                        <span class="label">录入人：</span>
                        <span class="data">{{ LiveData.live_data_add_by_username }}</span>
                      </div>
                      <div>
                        <span class="label">录入时间：</span>
                        <span class="data">{{ LiveData.gmt_create }}</span>
                      </div>
                      <div>
                        <span class="label">直播时长：</span>
                        <span class="data">{{ LiveData.real_duration }} 小时</span>
                      </div>
                      <div>
                        <span class="label">场次数据：</span>
                        <tg-button
                          type="link"
                          style="color: var(--theme-color); font-size: 12px"
                          @click="() => onDownloadLiveData(LiveData)"
                          >下载</tg-button
                        >
                      </div>
                    </div>
                    <div
                      class="live-record-info-edit-block"
                      v-if="CanEditStatus && Permission.canEditArchive"
                    >
                      <el-popover
                        placement="top"
                        trigger="hover"
                        content="编辑"
                        popper-class="tg-live-display-detail-custom-popover"
                      >
                        <tg-button
                          slot="reference"
                          v-if="CanEditStatus && Permission.canEditArchive"
                          @click="handleUpdateDisplayInfoDataAction(LiveData)"
                          type="link"
                        >
                          <tg-icon name="ico-edit"></tg-icon>
                        </tg-button>
                      </el-popover>

                      <span class="verLine" v-if="CanEditStatus && Permission.canEditArchive"
                        >|</span
                      >

                      <el-popover
                        placement="top"
                        trigger="hover"
                        content="删除"
                        popper-class="tg-live-display-detail-custom-popover"
                      >
                        <tg-button
                          slot="reference"
                          v-if="CanEditStatus && Permission.canEditArchive"
                          @click="handleDeleteDisplayInfoDataAction(LiveData.id)"
                          type="link"
                        >
                          <tg-icon name="ico-delete"></tg-icon>
                        </tg-button>
                      </el-popover>
                    </div>
                  </div>
                  <!-- <div style="display: flex; margin-bottom: 12px">
                  <div style="width: 400px; display: flex">
                    <div class="label">直播时间：</div>
                    <div class="data">
                      {{ GetDateRangeStr(LiveData.real_start_time, LiveData.real_end_time) }}
                    </div>
                  </div>
                  <div style="display: flex">
                    <div class="label">直播时长：</div>
                    <div class="data">{{ LiveData.real_duration }} 小时</div>
                  </div>
                </div> -->
                  <!-- <div style="display: flex; margin-bottom: 12px">
                  <div class="label">直播链接：</div>
                  <div class="data" style="color: #2877ff">
                    <a href="#" target="_blank">{{ LiveData.live_url }}</a>
                  </div>
                </div> -->
                  <!-- <div style="display: flex; margin-bottom: 12px">
                  <div class="label">直播时长截图：</div>
                  <div
                    class="image-data"
                    v-if="LiveData.duration_screenshot"
                    style="width: 477px; height: 107px"
                  >
                    <el-image
                      v-if="LiveData.duration_screenshot"
                      class="avatar"
                      style="max-height: 95px"
                      :src="`${LiveData.duration_screenshot}?Authorization=${JWToken}`"
                      :preview-src-list="[
                        `${LiveData.data_screenshot}?Authorization=${JWToken}`,
                        `${LiveData.duration_screenshot}?Authorization=${JWToken}`,
                      ]"
                    >
                    </el-image>
                  </div>
                </div> -->
                  <div style="display: flex; margin-top: 18px">
                    <div class="label">直播留档截图：</div>
                    <div
                      class="image-data"
                      v-if="LiveData.duration_screenshot"
                      style="max-width: 1000px"
                    >
                      <el-image
                        v-if="LiveData.duration_screenshot"
                        class="avatar"
                        :src="`${LiveData.duration_screenshot}?Authorization=${JWToken}`"
                        :preview-src-list="[
                          `${LiveData.duration_screenshot}?Authorization=${JWToken}`,
                        ]"
                      >
                      </el-image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </tg-card>
        <!-- 淘宝店播 - 直播留档 -->
        <tg-card
          v-else
          class="pane-block mgt-18 flex-auto"
          :padding="[18, 18, 0, 18]"
          style="height: calc(100% - 320px)"
        >
          <div>
            <div class="live-record-info-block-header">
              <div style="display: flex; height: 18px; margin-top: 7px">
                <div
                  style="
                    border-radius: 1px;
                    height: 14px;
                    margin-top: 3px;
                    line-height: 18px;
                    width: 3px;
                    border-left: 3px solid rgba(var(--theme-rgb-color), 0.9);
                  "
                ></div>
                直播留档
              </div>
              <tg-button
                v-if="CanEditStatus && Permission.canEditArchive"
                @click="AddLiveRecordHandler"
                type="primary"
                icon="ico-btn-add"
                style="margin-left: 18px"
                >留档信息</tg-button
              >
            </div>
            <div
              style="
                color: var(--text-third-color);
                font-size: 16px;
                text-align: center;
                margin-top: 120px;
              "
              v-if="Permission.canEditArchive && ShopLiveRecordDataList.length === 0"
            >
              <empty-common detail-text="暂无留档信息"></empty-common>
            </div>
            <div
              v-if="!Permission.canEditArchive"
              style="
                color: var(--text-third-color);
                font-size: 16px;
                text-align: center;
                margin-top: 120px;
              "
            >
              <empty-common detail-text="暂无查看留档信息的权限"></empty-common>
            </div>
            <div v-if="Permission.canEditArchive">
              <div
                class="live-record-info-block"
                v-for="(LiveData, index) in ShopLiveRecordDataList"
                :key="index"
              >
                <div class="live-record-info-data-block">
                  <div style="display: flex; margin-bottom: 12px">
                    <div style="width: 400px; display: flex">
                      <div class="label">录入人：</div>
                      <div class="data">{{ LiveData.live_data_add_by_username }}</div>
                    </div>
                    <div style="display: flex">
                      <div class="label">录入时间：</div>
                      <div class="data">{{ LiveData.gmt_create }}</div>
                    </div>
                  </div>
                  <div style="display: flex; margin-bottom: 12px">
                    <div style="width: 400px; display: flex">
                      <div class="label">直播时间：</div>
                      <div class="data">
                        {{ GetDateRangeStr(LiveData.real_start_time, LiveData.real_end_time) }}
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="label">直播时长：</div>
                      <div class="data">{{ LiveData.real_duration }} 小时</div>
                    </div>
                  </div>
                  <div style="display: flex; margin-bottom: 12px">
                    <div class="label">直播链接：</div>
                    <div class="data" style="color: var(--theme-color)">
                      <a href="#" target="_blank">{{ LiveData.live_url }}</a>
                    </div>
                  </div>
                  <div style="display: flex; margin-bottom: 12px">
                    <div class="label">直播时长截图：</div>
                    <div
                      class="image-data"
                      v-if="LiveData.duration_screenshot"
                      style="width: 477px; height: 107px"
                    >
                      <el-image
                        v-if="LiveData.duration_screenshot"
                        class="avatar"
                        style="max-height: 95px"
                        :src="`${LiveData.duration_screenshot}?Authorization=${JWToken}`"
                        :preview-src-list="[
                          `${LiveData.data_screenshot}?Authorization=${JWToken}`,
                          `${LiveData.duration_screenshot}?Authorization=${JWToken}`,
                        ]"
                      >
                      </el-image>
                    </div>
                  </div>
                  <div style="display: flex">
                    <div class="label">直播数据截图：</div>
                    <div
                      class="image-data"
                      v-if="LiveData.data_screenshot"
                      style="width: 656px; height: 112px"
                    >
                      <el-image
                        v-if="LiveData.data_screenshot"
                        class="avatar"
                        style="max-height: 100px"
                        :src="`${LiveData.data_screenshot}?Authorization=${JWToken}`"
                        :preview-src-list="[
                          `${LiveData.data_screenshot}?Authorization=${JWToken}`,
                          `${LiveData.duration_screenshot}?Authorization=${JWToken}`,
                        ]"
                      >
                      </el-image>
                    </div>
                  </div>
                </div>
                <div
                  class="live-record-info-edit-block taoabao-edit"
                  v-if="CanEditStatus && Permission.canEditArchive"
                >
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="编辑"
                    popper-class="tg-live-display-detail-custom-popover"
                  >
                    <tg-button
                      slot="reference"
                      v-if="CanEditStatus && Permission.canEditArchive"
                      @click="handleUpdateDisplayInfoDataAction(LiveData)"
                      type="link"
                    >
                      <tg-icon name="ico-edit"></tg-icon>
                    </tg-button>
                  </el-popover>

                  <span class="verLine" v-if="CanEditStatus && Permission.canEditArchive">|</span>

                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="删除"
                    popper-class="tg-live-display-detail-custom-popover"
                  >
                    <tg-button
                      slot="reference"
                      v-if="CanEditStatus && Permission.canEditArchive"
                      @click="handleDeleteDisplayInfoDataAction(LiveData.id)"
                      type="link"
                    >
                      <tg-icon name="ico-delete"></tg-icon>
                    </tg-button>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </tg-card>
        <!-- 编辑场次弹框 -->
        <liveDisplayAddDialog
          title="编辑场次"
          :defaultDisplay="displayInfo"
          :visible="shouldEditing"
          @succeed="handleSaveSucceedAction"
          @closeAction="handleCloseAction"
        />
        <tg-mask-loading
          :visible="deleteLoading || closeLoading"
          :content="deleteLoading ? '  正在删除，请稍候...' : '  正在关闭，请稍候...'"
        />
        <!-- 直播留档 -->
        <TgLiveDisplayDataInputDialog
          :visible="AddLiveDataInputVisible"
          @dialog:close="onAddDataInputModalClose"
          :DisplayInfo="LiveDisplayInfoData"
        />
        <!-- 排班弹窗表单 -->
        <TgLiveScheduleDialog
          :schedules="LiveSchedules"
          :visible.sync="LiveScheduleDialogVisible"
          :type="LiveScheduleType"
          :detailData="displayInfo"
          @succeed="handleUpdateScheduleAction"
        />
        <liveData ref="liveDataRef" @save="onLiveDataSave"></liveData>
      </div>
    </div>
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
