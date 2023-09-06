<!--
 * @Brief: 店铺代播-直播场次-场次详情
 * @Author: tingzhu
 * @Date: 2020-12-28 16:54:33
-->
<template>
  <div class="tg-live-display-detail-page" v-if="displayInfo !== undefined">
    <TgBreadcrumbs class="flex-none" :routes="routes" />
    <tg-block class="tg-live-display-info flex-none">
      <div class="dis-display-title">
        <div class="dis-display-title-left">
          <!-- 标题 -->
          <tg-icon class="diaplay-icon" :name="business_icon(displayInfo.business_type)" />
          <span>{{ displayInfo.live_title }}</span>
          <!-- 状态 -->
          <span v-if="displayInfo.live_status" :class="statusClasses(displayInfo.live_status)">{{
            liveStatus(displayInfo.live_status)
          }}</span>
        </div>
        <div
          class="dis-display-title-edit"
          v-if="displayInfo.live_status !== LiveDisplayStatus.lived && displayInfo.project_uid"
        >
          <!-- 待录入时才显示 -->
          <el-popover
            placement="top"
            trigger="hover"
            content="编辑"
            popper-class="tg-live-display-detail-custom-popover"
          >
            <tg-button
              slot="reference"
              v-if="Permission.canEdit"
              @click="handleEditDisplayAction"
              type="link"
            >
              <tg-icon name="ico-edit"></tg-icon>
            </tg-button>
          </el-popover>

          <span class="verLine" v-if="Permission.canDelete">|</span>

          <el-popover
            placement="top"
            trigger="hover"
            content="删除"
            popper-class="tg-live-display-detail-custom-popover"
          >
            <tg-button
              slot="reference"
              v-if="Permission.canDelete"
              @click="handleDeleteDisplayAction"
              type="link"
            >
              <tg-icon name="ico-delete"></tg-icon>
            </tg-button>
          </el-popover>

          <span
            class="verLine"
            v-if="
              Permission.canClose && displayInfo.live_status === LiveDisplayStatus.waitingTypeIn
            "
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
              v-if="
                Permission.canClose && displayInfo.live_status === LiveDisplayStatus.waitingTypeIn
              "
              @click="handleCloseDisplayAction"
              type="link"
            >
              <tg-icon name="ico-power"></tg-icon>
            </tg-button>
          </el-popover>
          <!-- <a v-if="Permission.canEdit" @click="handleEditDisplayAction">编辑</a>
          <span
            v-if="
              Permission.canClose && displayInfo.live_status === LiveDisplayStatus.waitingTypeIn
            "
            >|</span
          >
          <a
            v-if="
              Permission.canClose && displayInfo.live_status === LiveDisplayStatus.waitingTypeIn
            "
            @click="handleCloseDisplayAction"
            >关闭</a
          >
          <span v-if="Permission.canDelete">|</span>
          <a v-if="Permission.canDelete" @click="handleDeleteDisplayAction">删除</a> -->
        </div>
      </div>
      <!-- 项目信息 -->
      <div class="div-display-info">
        <div class="div-display-info-item">
          <span class="div-display-info-item-label">项目名称：</span>
          <a
            class="div-display-info-item-value div-display-info-item-value-link"
            @click="goToProjectDetail"
            >{{ displayInfo.project_name ? displayInfo.project_name : '--' }}</a
          >
        </div>
        <div class="div-display-info-item">
          <span class="div-display-info-item-label">项目编号：</span>
          <a
            class="div-display-info-item-value div-display-info-item-value-link"
            @click="goToProjectDetail"
            >{{ displayInfo.project_uid }}</a
          >
        </div>
        <div class="div-display-info-item">
          <span class="div-display-info-item-label">品牌：</span>
          <span class="div-display-info-item-value">{{
            displayInfo.brand_name ? displayInfo.brand_name : '--'
          }}</span>
        </div>
        <div class="div-display-info-item">
          <span class="div-display-info-item-label">直播间：</span>
          <span class="div-display-info-item-value">{{ displayInfo.studio_name }}</span>
        </div>
        <div class="div-display-info-item">
          <span class="div-display-info-item-label">直播时间：</span>
          <span class="div-display-info-item-value">{{
            liveTime(displayInfo.live_start_time, displayInfo.live_end_time)
          }}</span>
        </div>
      </div>
      <!-- 备注 -->
      <div class="div-display-info-remark">
        <div class="div-display-info-item-value">
          <span class="div-display-info-item-label">备注：</span
          >{{ displayInfo.remark ? displayInfo.remark : '--' }}
        </div>
      </div>
      <!-- 目标 -->
      <el-collapse-transition>
        <div v-show="isExpand">
          <!-- 基础目标 -->
          <hr class="hor-line-style" />
          <div class="target-title">基础目标</div>
          <div class="div-display-info">
            <div class="div-display-info-item">
              <span class="div-display-info-item-label">目标销售额：</span>
              <span class="div-display-info-item-value">{{
                formatNumberDisplay(
                  displayInfo.base_goal ? displayInfo.base_goal.target_sale_amount : undefined,
                  '￥',
                )
              }}</span>
            </div>
            <div class="div-display-info-item">
              <span class="div-display-info-item-label">预计投放：</span>
              <span class="div-display-info-item-value">{{
                formatNumberDisplay(
                  displayInfo.base_goal ? displayInfo.base_goal.expect_throw_amount : undefined,
                  '￥',
                )
              }}</span>
            </div>
            <div class="div-display-info-item">
              <span class="div-display-info-item-label">目标增粉：</span>
              <span class="div-display-info-item-value">{{
                formatNumberDisplay(
                  displayInfo.base_goal ? displayInfo.base_goal.target_add_fans : undefined,
                  undefined,
                  '人',
                )
              }}</span>
            </div>
          </div>
          <!-- 选品目标 -->
          <hr class="hor-line-style" />
          <div class="target-title">选品目标</div>
          <div class="selection-target">
            <div v-for="n in 4" :key="n" class="selection-target-sub">
              <div class="selection-target-item">
                <span>计划销量</span>
                <span>{{ selection_target_format(n, 0) }}</span>
              </div>
              <div class="selection-target-item">
                <span>计划销售额</span>
                <span>{{ selection_target_format(n, 1) }}</span>
              </div>
              <div class="selection-target-item">
                <span>计划直播商品数</span>
                <span>{{ selection_target_format(n, 2) }}</span>
              </div>
              <div class="selection-target-item">
                <span>预估单价</span>
                <span>{{ selection_target_format(n, 3) }}</span>
              </div>
              <div class="selection-target-item">
                <span>预估单品销量</span>
                <span>{{ selection_target_format(n, 4) }}</span>
              </div>
              <span :class="selection_target_tag_background(n)">{{
                selection_target_tag_name(n)
              }}</span>
            </div>
          </div>
        </div>
      </el-collapse-transition>
      <!-- 展开/收起按钮 -->
      <div class="expand-btn-area" @click="isExpand = !isExpand">
        <hr class="hor-line-style" />
        <div>
          <tg-icon
            :style="!isExpand ? '' : 'transform: rotateX(180deg)'"
            name="ico-expand"
          ></tg-icon>
          <span>{{ !isExpand ? '展开' : '收起' }}</span>
        </div>
      </div>
    </tg-block>
    <tg-card class="pane-block mgt-18 flex-auto" :padding="[0, 0, 18, 0]">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" bottom />
      <component
        class="flex-auto mgt-10"
        :is="checkedTab"
        :detailData="displayInfo"
        @detailPageReload="reload"
      />
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
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
