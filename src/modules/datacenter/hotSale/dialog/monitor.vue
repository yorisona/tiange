<template>
  <div class="hot-sale-monitor-dialog">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="488px"
      title="监控设置"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div class="warning-box" style="margin-bottom: 20px">
        <tg-icon name="ico-icon_tongyong_jinggao_mianxingbeifen-01"></tg-icon>
        <p class="text">添加的监控账号为直播账号名称</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="formRules" size="mini" inline>
        <el-form-item
          prop="hot_sale_time"
          label="热销阀值设置："
          label-width="108px"
          style="margin-right: 6px !important"
        >
          <el-select v-model="form.hot_sale_time" style="width: 90px" placeholder="">
            <el-option label="1" :value="1" />
            <el-option label="2" :value="2" />
            <el-option label="3" :value="3" />
            <el-option label="4" :value="4" />
            <el-option label="5" :value="5" />
            <el-option label="6" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item prop="hot_sale_count" label="小时内单品销量达到" label-width="126px">
          <el-input
            style="width: 120px; margin-left: 6px"
            v-model.trim="form.hot_sale_count"
            placeholder=""
            :maxlength="20"
            @input="formatInterger"
          ></el-input>
        </el-form-item>
        <el-form-item prop="receiver_list" label="消息接收人：" label-width="108px" />

        <el-select
          style="
            width: 362px;
            line-height: 28px;
            max-height: 168px;
            overflow-y: scroll;
            margin-left: -8px;
          "
          clearable
          multiple
          remote
          filterable
          :value="selectNames"
          :remote-method="getAllOtherMembersRequest"
          :loading="otherMemberLoading"
          placeholder=""
          @change="onOtherMembersChanged"
        >
          <el-option
            v-for="member in otherMembers"
            :key="member.user_id"
            :label="member.name"
            :value="member.name"
          >
          </el-option>
        </el-select>
        <div class="tip-line-box">
          <tg-icon name="ico-icon_tongyong_tishi_mianxing-01"></tg-icon>
          <p class="text">达到热销阀值后会发送消息提醒，每款商品一天只提醒一次</p>
        </div>
        <div class="account-box">
          <div class="account-label">监控账号设置：</div>
          <div class="flex-line-box-wrap">
            <div v-for="(_, index) in form.monitor_accounts" :key="index" class="flex-line-item">
              <el-form-item
                :prop="`monitor_accounts[${index}]`"
                :rules="[
                  {
                    required: true,
                    validator: (rule, value, callback) =>
                      monitorAcCheck(rule, value, callback, index),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model.trim="form.monitor_accounts[index]"
                  placeholder="请输入账号名称"
                  :maxlength="20"
                  style="width: 180px"
                ></el-input>
              </el-form-item>
              <tg-icon
                name="ico-btn-delete"
                class="ico-btn-delete"
                @click="deleteAccount(index)"
              ></tg-icon>
            </div>
            <div class="flex-line-item" style="margin-bottom: 18px">
              <tg-button
                :disabled="form.monitor_accounts.length >= 5"
                type="primary"
                icon="ico-btn-add"
                @click="addAccount"
                >新增监控账号</tg-button
              >
            </div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <tg-button @click="onClose">取消</tg-button>
        <tg-button type="primary" @click="onSave">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./monitor.ts"></script>

<style lang="less">
.hot-sale-monitor-dialog {
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '';
  }
  .el-form .el-form-item {
    margin-bottom: 20px;
    margin-right: 6px !important;
  }
  .warning-box,
  .tip-line-box {
    .icon {
      font-size: 20px;
    }
    .text {
      font-size: 12px;
    }
  }
  .warning-box {
    display: flex;
    align-items: center;
    height: 40px;
    padding-left: 15px;
    background: #fff7f3;
    color: #ff7a36;
  }
  .tip-line-box {
    width: 446px;
    height: 20px;
    padding-bottom: 24px;
    margin: 6px auto 12px;
    border-bottom: 1px solid rgba(164, 178, 194, 0.3);
    display: flex;
    align-items: center;
    color: var(--theme-color);
  }
  .account-box {
    width: 446px;
    margin-left: 20px;
    margin-bottom: 20px;
    .account-label {
      color: var(--text-third-color);
      font-size: 12px;
      margin-bottom: 12px;
    }
    .flex-line-box-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .flex-line-item {
        display: flex;
        width: calc(50%);
        .ico-btn-delete {
          font-size: 16px;
          margin-top: 6px;
          color: var(--text-third-color);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
