<!--
 * @Brief: 班次设置
-->
<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-commentary"
      :visible="visiable"
      height="400px"
      width="440px"
      append-to-body
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>新增批注</template>
      <div class="news-body">
        <div>
          <div>
            <div class="select-item" style="margin-top: 0px" size="medium">
              <div style="width: 36px; color: #6a7b92">时间</div>
              <div
                style="
                  width: 392px;
                  margin-top: 6px;
                  border: 1px solid rgba(164, 178, 194, 0.5);
                  border-radius: 2px;
                "
              >
                <!-- <el-time-picker
                  popper-class="tpc"
                  :editable="false"
                  :clearable="false"
                  v-model="dates[0]"
                  placeholder="开始时间"
                  format="HH:mm"
                  value-format="HH:mm"
                />
                <span class="date-picker-separator">~</span>
                <el-time-picker
                  popper-class="tpc"
                  class="noshowtime"
                  :editable="false"
                  :clearable="false"
                  v-model="dates[1]"
                  type="date"
                  placeholder="结束时间"
                  format="HH:mm"
                  value-format="HH:mm"
                /> -->
                <el-date-picker
                  v-model="dates"
                  style="width: 100%"
                  class="date-pk"
                  popper-class="date-pk"
                  type="datetimerange"
                  range-separator="~"
                  :clearable="false"
                  format="yyyy.MM.dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="{
                    disabledDate: val => disabledDate(val),
                  }"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="select-item" size="medium">
              <div style="width: 36px; color: #6a7b92">内容</div>
              <div
                style="
                  width: 392px;
                  margin-top: 6px;
                  border: 1px solid rgba(164, 178, 194, 0.5);
                  border-radius: 2px;
                "
              >
                <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入内容"
                  v-model="commentaryContent"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less">
.tg-dialog-vcenter-commentary {
  z-index: 100000000 !important;
}
.tpc .el-time-spinner__wrapper {
  width: 100% !important;
}
.tpc .el-time-spinner__wrapper:nth-of-type(2) {
  display: none !important;
}
.date-pk {
  z-index: 100000001 !important;
  .el-picker-panel__footer {
    .el-button {
      &:nth-child(1) {
        display: none;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.header-title {
  height: 40px;
  background: rgba(255, 122, 54, 0.06);
  width: 100%;

  font-size: 12px;
  color: #ff7a36;
  line-height: 40px;
  padding: 0px 20px;
  /deep/ .ico-warn {
    width: 20px;
    font-size: 16px;
    top: -1px;
    color: #ff7a36;
    height: 20px;
    margin-top: -3px;
    margin-right: 5px;
    vertical-align: middle;
  }
}
.news-body {
  max-height: 500px;
  margin: 24px 24px 32px 24px;
  /deep/.el-input {
    width: 176px;
  }
  .time-select-box {
    width: 392px;
    border-radius: 2px;
    border: 1px solid rgba(164, 178, 194, 0.5);
    margin-left: 20px;
    flex: 1;
    display: flex;
    justify-content: left;
    p {
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
      color: #a4b2c2;
    }
    /deep/.el-input {
      width: 186px;
      .el-input__inner {
        border-width: 0;
      }
      .el-input__prefix {
        display: none;
      }
    }
  }
  .title-item {
    margin-left: 24px;
    margin-top: 18px;
    display: flex;
    justify-content: left;
    width: 494px;
    margin-bottom: 2px;
    div {
      height: 18px;
      font-weight: 400;
      font-size: 14px;
      color: var(--text-color);
      line-height: 18px;
      text-align: center;
    }
  }
  .select-item {
    margin-top: 16px;
    margin-bottom: 0px;
    /deep/.el-textarea__inner {
      border-width: 0px;
    }
    &.marginbottom {
      margin-bottom: 0px !important;
    }
    /*  /deep/ .el-select .el-input .el-select__caret {
        color: #c0c4cc;
        font-size: 14px;
        transition: transform 0.3s;
        transform: rotateZ(180deg);
        cursor: pointer;
        &:before {
          content: '\e605';
        }
      }*/
    /deep/ .el-input-group__append {
      padding: 0px 10px;
      height: 28px !important;
      line-height: 28px !important;
    }
    /deep/ .el-input__inner {
      line-height: 32px;
      height: 32px;
      font-size: 14px !important;
      border-width: 0px;
    }
    /deep/ .el-input__icon {
      line-height: 24px;
      &.el-icon-delete {
        line-height: 32px;
        margin-left: 6px;
        color: var(--text-third-color);
      }
      &:hover {
        color: rgba(var(--theme-rgb-color), 0.9);
      }
    }
    /deep/.el-date-editor .el-range-separator {
      line-height: 26px;
    }
    .el-date-editor {
      width: 192px;
      /deep/.el-input__inner {
        border-width: 0px;
        line-height: 30px;
        height: 30px;
        text-align: center;
        padding-left: 40px;
      }
      &.noshowtime {
        width: 182px;
        /deep/.el-input__prefix {
          display: none;
        }
        /deep/.el-input__inner {
          padding-left: 30px;
        }
      }
    }
  }
}
</style>
