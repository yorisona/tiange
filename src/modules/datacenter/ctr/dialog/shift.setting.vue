<!--
 * @Brief: 班次设置
-->
<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      width="532px"
      :visible="visiable"
      height="400px"
      append-to-body
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>班次管理</template>
      <div class="news-body">
        <div>
          <div class="header-title">
            <tg-icon name="ico-warn"></tg-icon
            >班次管理以开播时间为准，开播时间没有在指定班次时间内的场次统一计未其他班次
          </div>
          <div style="margin-top: 6px; margin-bottom: 16px">
            <div class="title-item">
              <div style="width: 176px">班次</div>
              <div style="width: 264px; margin-left: 20px">开播时间</div>
            </div>
            <template v-for="(item, index) in formList">
              <div class="select-item" size="mini" :key="index">
                <div>
                  <el-input
                    size="mini"
                    v-model="item.shift_name"
                    placeholder="请输入班次名称"
                  ></el-input>
                </div>
                <!--<el-time-picker
                  popper-class="tpc"
                  :clearable="false"
                  :editable="false"
                  v-model="item.dates"
                  is-range
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH"
                  value-format="HH"
                  style="width: 264px; margin-left: 20px"
                />-->
                <div
                  style="
                    width: 264px;
                    margin-left: 20px;
                    border: 1px solid rgba(164, 178, 194, 0.5);
                    border-radius: 2px;
                  "
                >
                  <el-time-picker
                    popper-class="tpc"
                    :editable="false"
                    :clearable="false"
                    v-model="item.dates[0]"
                    placeholder="开始时间"
                    format="HH"
                    value-format="HH"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00',
                    }"
                  />
                  <span class="date-picker-separator">~</span>
                  <el-time-picker
                    popper-class="tpc"
                    class="noshowtime"
                    :editable="false"
                    :clearable="false"
                    v-model="item.dates[1]"
                    type="date"
                    placeholder="结束时间"
                    format="HH"
                    value-format="HH"
                  />
                </div>
                <i
                  @click="deleteClick(index)"
                  v-if="formList.length > 1"
                  class="el-input__icon el-icon-delete"
                />
              </div>
            </template>
          </div>
        </div>
        <tg-button
          icon="ico-btn-add"
          type="primary"
          @click="AddShiftItem"
          style="margin-left: 24px; margin-bottom: 24px"
          >增加班次</tg-button
        >
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./shift.setting.ts"></script>
<style>
.tpc .el-time-spinner__wrapper {
  width: 100% !important;
}
.tpc .el-time-spinner__wrapper:nth-of-type(2) {
  display: none !important;
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
  /deep/.el-input {
    width: 176px;
  }
  .time-select-box {
    width: 268px;
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
      width: 126px;
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
    margin-left: 24px;
    margin-top: 16px;
    display: flex;
    justify-content: left;
    width: 494px;
    margin-bottom: 0px;
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
    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }

    /deep/ .el-input-group__append {
      padding: 0 10px;
      height: 28px !important;
      line-height: 28px !important;
    }

    /deep/ .el-form-item__label {
      padding: 0;
      /*display: block;*/
      text-align: left;
      line-height: 16px;
      height: 22px;
      padding-bottom: 6px;
      font-size: 12px !important;
    }
    /deep/ .el-input__inner {
      font-size: 12px !important;
    }
    /deep/ .el-input__icon {
      line-height: 24px;
      &.el-icon-delete {
        line-height: 28px;
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
      width: 132px;
      /deep/.el-input__inner {
        border-width: 0px;
        line-height: 26px;
        height: 26px;
        text-align: center;
        padding-left: 32px;
      }
      &.noshowtime {
        width: 112px;
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
