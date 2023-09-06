<!--
 * @Brief: 店铺代播-直播场次-新增场次弹框
 * @Author: tingzhu
 * @Date: 2020-12-31 17:24:13
-->
<template>
  <div class="tg-live-display-dialog-add-page tg-dialog-vcenter">
    <el-drawer
      :title="title"
      class="tg-dialog-classic"
      :visible="visible"
      :wrapperClosable="false"
      @close="handleCloseAction"
    >
      <!-- <template #title>{{ title }}</template> -->
      <div class="ta-live-display-content">
        <el-form
          label-position="top"
          ref="formRef"
          :model="form"
          :rules="formRules"
          size="mini"
          label-width="106px"
        >
          <!-- 新增时显示 -->
          <head-lines style="margin: 0px 0px 12px -10px" title="场次信息" />
          <el-form-item class="one-item" label="场次标题：" prop="live_title">
            <el-input
              v-model.trim="form.live_title"
              placeholder="请输入场次标题"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item class="one-item" label="场次类型：" prop="live_type">
            <el-select
              popper-class="el-select-popper-mini"
              v-model.trim="form.live_type"
              placeholder="请选择场次类型"
              maxlength="20"
            >
              <el-option label="直播" :value="60" />
              <el-option label="短视频" :value="61" />
              <el-option label="图文" :value="62" />
            </el-select>
          </el-form-item>
          <div class="four-item">
            <el-form-item
              label="场次开始时间："
              style="width: 118px"
              prop="live_start_time"
              class="date-picker-item"
            >
              <el-date-picker
                v-model="form.startTimeAndEndTime"
                :clearable="false"
                type="datetimerange"
                style="width: 472px"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                popper-class="mcn-live-time-popover-display-add"
                @change="onLiveTimeChange"
              />
            </el-form-item>
          </div>
          <el-form-item
            class="one-item"
            label="预计GMV："
            prop="expect_gmv"
            v-if="form.live_type === 60"
          >
            <el-input
              @input="limitGMV"
              v-model.trim="form.expect_gmv"
              placeholder="请输入预计GMV"
              maxlength="11"
              clearable
            />
          </el-form-item>
        </el-form>
        <div class="live-display-add-footer">
          <tg-button @click="handleCloseAction">取消</tg-button>
          <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
        </div>
      </div>
    </el-drawer>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./live.display.add.ts"></script>

<style lang="less">
.tg-live-display-dialog-add-page {
  .el-form-item__label {
    margin-bottom: 6px;
  }

  .delete-btn-time {
    cursor: pointer;
    position: absolute;
    top: -4px;
    right: -4px;
    color: #d2d4d9;
    font-size: var(--small-font-size);
    &:hover {
      color: var(--error-color);
    }
  }

  .add-timeline {
    display: inline-block;
    margin-top: 12px;
    color: #396fff;
    cursor: pointer;

    i {
      margin-right: 5px;
    }
  }

  .el-drawer {
    width: 532px !important;

    .live-display-add-footer {
      background: #f2f7ff;
      height: 50px;
      line-height: 50px;
      display: grid;
      grid-template-columns: repeat(2, auto);
      align-content: center;
      justify-content: end;
      column-gap: 12px;
      padding: 24px;
    }
  }

  .ta-live-display-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: visible;
  }

  .el-form {
    flex: 1;
    padding: 24px 8px 12px 28px;
    overflow-y: auto;
    overflow: overlay;

    .el-form-item {
      margin-bottom: 18px;

      .el-form-item__label {
        padding: 0;
        line-height: 18px !important;
        height: 24px !important;
        font-size: 12px;
        margin-bottom: 0;
      }

      .el-date-editor {
        width: 100%;
      }

      .el-select {
        display: block;
      }
    }

    .date-picker-item {
      display: inline-block;
    }

    .time-picker-item {
      display: inline-block;
    }

    .remark-input {
      .el-textarea__inner {
        height: 94px;
      }
    }

    .el-input-group__append {
      padding: 0 10px;
      background-color: #f9f9f9;
      color: var(--text-third-color);
    }

    .selection-target-sub-title {
      height: 18px;
      line-height: 18px;
      margin: 6px 0 4px 0;

      span {
        font-size: 12px;
        color: var(--tip-icon-color);
      }

      div {
        border-top: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);
        height: 1px;
        overflow: hidden;
        display: inline-block;
        width: 510px;
        margin-left: 6px;
        margin-bottom: 4px;
      }
    }
  }

  .one-item {
    display: block;
    width: 472px;
  }

  .two-item-left {
    display: inline-block;
    width: 267px;
    margin-right: 18px;
  }

  .two-item-right {
    display: inline-block;
    width: 267px;
    margin-right: 0;
  }

  .el-form-item__label {
    line-height: 16px;
  }

  .el-form-item {
    .el-input--suffix .el-input__inner {
      padding-right: 6px;
    }
  }

  .three-item {
    .el-form-item {
      display: inline-block;
      margin-right: 18px;
      width: 172px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .four-item {
    .el-form-item {
      display: inline-block;

      &:nth-of-type(1) {
        margin-right: 6px;
        width: 141px;
      }

      &:nth-of-type(3) {
        margin-right: 6px;
        width: 141px;
      }

      &:nth-of-type(2) {
        // margin-right: 18px;
        width: 120px;
      }

      &:last-of-type {
        margin-right: 0;
        width: 120px;
      }

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .mgb-18 {
    margin-bottom: 18px !important;
  }
}

.mcn-live-time-popover-display-add {
  .el-time-panel {
    left: -33px !important;
  }
}
</style>
