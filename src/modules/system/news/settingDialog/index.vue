<!--
 * @Brief: 系统设置-消息管理 - 弹框
-->
<template>
  <tg-block>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      :visible="true"
      width="510px"
      height="400px"
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>设置</template>
      <div class="news-body">
        <div v-show="msgType === 1">
          <div class="header-title">
            <tg-icon name="ico-warn"></tg-icon
            >项目关联的客户经理、项目经理、财务BP为默认提醒对象，无需添加
          </div>
          <el-form
            size="mini"
            ref="formRef"
            label-position="top"
            :model="form"
            label-width="80px"
            style="margin-top: 6px"
          >
            <el-form-item class="select-item" label="店播项目消息接收人员：" />
            <el-select
              size="mini"
              popper-class="el-select-popper-mini"
              v-model="form.Live_ids"
              style="width: 462px; margin-left: 24px"
              multiple
              filterable
              remote
              :remote-method="getAllUserName"
              default-first-option
              :placeholder="form.iscanLive ? '请输入并选择接收人员' : '该消息暂不支持此项目类型'"
              :disabled="!form.iscanLive"
              @change="onChangeLive"
            >
              <el-option
                v-for="item in form.User_infos"
                :key="item.user_id"
                :label="item.name"
                :value="item.user_id"
              >
              </el-option>
            </el-select>

            <el-form-item class="select-item" label="营销项目消息接收人员：" />
            <el-select
              size="mini"
              popper-class="el-select-popper-mini"
              v-model="form.Marketing_ids"
              style="width: 462px; margin-left: 24px"
              multiple
              filterable
              remote
              :remote-method="getAllUserName"
              default-first-option
              :placeholder="
                form.iscanMarketing ? '请输入并选择接收人员' : '该消息暂不支持此项目类型'
              "
              :disabled="!form.iscanMarketing"
              @change="onChangeMarketing"
            >
              <el-option
                v-for="item in form.User_infos"
                :key="item.user_id"
                :label="item.name"
                :value="item.user_id"
              >
              </el-option>
            </el-select>
            <el-form-item class="select-item" label="MCN项目消息接收人员：" />
            <el-select
              size="mini"
              popper-class="el-select-popper-mini"
              v-model="form.Mcn_ids"
              style="width: 462px; margin-left: 24px"
              multiple
              remote
              filterable
              :remote-method="getAllUserName"
              default-first-option
              :placeholder="form.iscanMcn ? '请输入并选择接收人员' : '该消息暂不支持此项目类型'"
              :disabled="!form.iscanMcn"
              @change="onChangeMcn"
            >
              <el-option
                v-for="item in form.User_infos"
                :key="item.user_id"
                :label="item.name"
                :value="item.user_id"
              >
              </el-option>
            </el-select>
          </el-form>
        </div>
        <div class="check-tab-class" v-show="msgType === 2">
          <div class="header-title">
            <tg-icon name="ico-warn"></tg-icon>群内所有成员都可以接收到消息并查看对象，无需添加
          </div>
          <div v-show="messageIds.length" class="ids-row">
            <div class="ids-column" v-for="(item, idx) in messageIds" :key="'cctv_' + idx">
              <el-input size="mini" v-model.trim="messageIds[idx]" placeholder="请输入接收消息群ID">
                <i
                  style="cursor: pointer"
                  class="el-icon-delete el-input__icon"
                  slot="suffix"
                  @click="() => messageIds.splice(idx, 1)"
                >
                </i>
              </el-input>
            </div>
          </div>
          <div class="add-ids-btn" :style="{ marginTop: messageIds.length ? '0' : '18px' }">
            <tg-button
              :disabled="messageIds.length >= 10"
              type="primary"
              @click="() => messageIds.push('')"
              >新增群</tg-button
            >
          </div>
        </div>
        <div v-show="msgType === 3">
          <div class="header-title">
            <tg-icon name="ico-warn"></tg-icon>项目结算单确认提醒将会单独发送至项目经理，不需要设置
          </div>
          <el-form
            ref="formRef"
            label-position="top"
            :model="form"
            label-width="80px"
            style="margin-top: 6px"
            size="mini"
          >
            <el-form-item class="select-item" label="结算单确认提醒接收人员：" />
            <el-select
              size="mini"
              popper-class="el-select-popper-mini"
              v-model="form.Unity_ids"
              style="width: 462px; margin-left: 24px"
              multiple
              filterable
              remote
              :remote-method="getAllUserName"
              default-first-option
              :placeholder="form.isUnity ? '请输入并选择接收人员' : '该消息暂不支持此项目类型'"
              :disabled="!form.isUnity"
              @change="onChangeUnity"
            >
              <el-option
                v-for="item in form.User_infos"
                :key="item.user_id"
                :label="item.name"
                :value="item.user_id"
              >
              </el-option>
            </el-select>
          </el-form>
        </div>
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </tg-block>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.check-tab-class {
  /deep/.el-tabs__nav-wrap {
    padding-left: 24px;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
  .ids-row {
    padding: 24px;
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
    max-height: 320px;
    overflow-y: auto;
    /deep/ .el-input > input {
      color: var(--text-color);
    }
  }
  .add-ids-btn {
    margin: 0 0 24px 24px;
  }
}
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
  /deep/ .el-select {
    &.el-select--mini {
      height: auto;
    }
    max-height: 108px;
    .el-input > input {
      border-color: var(--border-line-color);
    }
  }
  /deep/ .el-select__tags {
    line-height: 24px;
    max-height: 100px;
    overflow-y: scroll;
    max-width: 454px !important;
    .el-tag {
      height: 20px;
      line-height: 20px;
      background: #f4f4f5;
      padding: 0 5px;
      color: #909399;
      font-size: 12px;
      margin: 2px 0 2px 6px;
      align-items: center;
      border-radius: 4px;
    }
    //padding: 0 2px 6px 2px;
  }
  /deep/ .el-form {
    margin-left: 0px !important;
    margin-right: 0px !important;
    margin-top: 6px !important;
    margin-bottom: 48px !important;
  }
  .select-item {
    margin-left: 24px;
    margin-top: 18px;
    display: block;
    width: 454px;
    margin-bottom: 0 !important;
    color: var(--text-third-color);
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
  }
  .el-select-dropdown__item.selected::after {
    content: '' !important;
  }

  .el-select-dropdown__item {
    padding-left: 12px;
  }
}
</style>
