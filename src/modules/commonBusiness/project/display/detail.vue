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
    <div v-if="inProjectTeam && displayInfo !== undefined" style="height: 100%; flex-grow: 1">
      <tg-block class="tg-live-display-info flex-none">
        <div class="dis-display-title">
          <div class="dis-display-title-left">
            <!-- 标题 -->
            <tg-icon
              class="diaplay-icon"
              :name="business_icon(displayInfo.project_platform_type)"
            />
            <span>{{ displayInfo.live_title }}</span>
            <!-- 状态 -->
            <span v-if="displayInfo.live_status" :class="statusClasses(displayInfo.live_status)">{{
              liveStatus(displayInfo.live_status)
            }}</span>
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
        <div class="display-datetime-info">
          <span>直播时间：{{ display_live_date_range_str }}</span>
          <span>场次类型：{{ live_type_str }}</span>
        </div>
        <!--        <div-->
        <!--          v-if="permission.mcn_save_shop_live && displayInfo.live_status !== 4"-->
        <!--          class="display-options"-->
        <!--        >-->
        <!--          <tg-button icon="ico-btn-add" type="primary" @click="addMerchantGoodsClick"-->
        <!--            >新增商品</tg-button-->
        <!--          >-->
        <!--        </div>-->
      </tg-block>
      <tg-card class="pane-block flex-auto" :padding="[0, 18, 0, 18]">
        <el-table
          border
          stripe
          v-loading="loading"
          height="calc(100vh - 210px)"
          :data="ShopLiveDataList"
        >
          <el-table-column v-for="(col, index) in ShopLiveColumns" v-bind="col" :key="index" />
          <template #empty>
            <empty-common detail-text="暂无商品，快去添加吧~"></empty-common>
          </template>
        </el-table>
        <el-pagination
          :current-page.sync="QueryForm.page_num"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="QueryForm.num"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
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
      <!-- 新增编辑商品 -->
      <!--      <live-goods-->
      <!--        :visible.sync="addGoodsDialogVisible"-->
      <!--        :shop-live-id="shop_live_id"-->
      <!--        :item="merchantGoods"-->
      <!--        @save="onMerchantGoodsSave"-->
      <!--        @edit="onMerchantGoodsEdit"-->
      <!--      />-->
    </div>
    <el-dialog
      title="场次归档"
      :visible="dialogVisible"
      class="tg-dialog-classic el-dialog-center-rewrite"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      @close="onCancelBtnClick"
      width="300px"
    >
      <el-form
        label-width="106px"
        size="small"
        :rules="dialog_rules"
        :model="dialog_form"
        ref="dialogActualRef"
      >
        <div class="form-box">
          <el-form-item label="实际GMV" prop="actual_gmv">
            <el-input
              @input="limitGMV"
              :maxlength="11"
              placeholder="请填写实际GMV"
              v-model="dialog_form.actual_gmv"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <tg-button @click="onCancelBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onSaveBtnClick">确定</tg-button>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less" scoped>
@import './detail.less';
</style>
