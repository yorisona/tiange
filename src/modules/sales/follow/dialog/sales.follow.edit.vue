<template>
  <div class="tg-sales-follow-edit-dialog">
    <el-dialog
      class="customer-dialog account-form-modal tg-dialog-vcenter"
      :visible="dialogVisible"
      width="612px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="handleEditCloseAction"
    >
      <template #title>编辑跟进任务</template>
      <div class="dialog-content" style="padding: 24px 24px 6px 24px; height: 570px">
        <el-form
          ref="formRef"
          :model="salesFollowDetail"
          :rules="salesFollowDetailRules"
          label-width="100px"
          label-position="top"
          :inline="false"
        >
          <el-form-item label="客户名称" size="small" prop="customer_name">
            <el-select
              v-model="salesFollowDetail.customer_name"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索并选择客户名称"
              :remote-method="getCustomerList"
              @focus="handleCustomerFocus"
              @change="onCustomerNameChange"
              class="edit-input-item"
              style="width: 100%"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.shop_name"
                :value="item.id"
              >
                <span>{{ item.shop_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" size="small" prop="business_type">
            <el-radio-group
              v-model="salesFollowDetail.business_type"
              style="margin-top: 12px; margin-left: 12px"
              @change="handleBusinessTypeChange"
            >
              <el-radio :label="1">营销业务</el-radio>
              <el-radio :label="3">抖音店播</el-radio>
              <el-radio :label="2">淘宝店播</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="合作类型"
            size="small"
            prop="cooperation_type"
            style="padding: 18px; background-color: rgba(164, 178, 194, 0.09)"
            v-if="salesFollowDetail.business_type === 1"
          >
            <el-checkbox-group v-model="salesFollowDetail.cooperation_type">
              <el-checkbox :label="1" style="margin: 0 12px">直播</el-checkbox>
              <el-checkbox :label="2" style="margin: 0 12px">视频</el-checkbox>
              <el-checkbox :label="3" style="margin: 0 12px">图文</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户意向" size="small" prop="customer_intention">
            <el-select v-model="salesFollowDetail.customer_intention" style="width: 100%">
              <el-option :value="1" label="标三">标三</el-option>
              <el-option :value="2" label="方案">方案</el-option>
              <el-option :value="3" label="重点">重点</el-option>
              <el-option :value="4" label="预测">预测</el-option>
            </el-select>
          </el-form-item>

          <div class="two-item-left">
            <el-form-item label="联系人" size="small" prop="contact_name">
              <el-input
                v-model.trim="salesFollowDetail.contact_name"
                placeholder="请输入联系人姓名"
                class="edit-input-item"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="two-item-right">
            <el-form-item label="" size="small" prop="wechat" class="more-one-item">
              <label slot="label">
                <span>联系方式</span> <span style="color: #a4b2c2">（至少一项）</span>
              </label>
              <el-input
                v-model.trim="salesFollowDetail.phone"
                placeholder="请输入手机号"
                maxlength="11"
                clearable
                style="width: 134px"
              />
              <el-input
                v-model.trim="salesFollowDetail.wechat"
                placeholder="请输入微信号"
                clearable
                maxlength="20"
                style="width: 133px; margin-left: 6px"
              />
            </el-form-item>
          </div>

          <div class="two-item-left">
            <el-form-item label="预估金额" size="small">
              <el-input
                v-model.trim="salesFollowDetail.estimate_money"
                oninput="value=value.replace(/[^\d.]/g,'')"
                @input="inputLoanAmountCost(index, $event)"
                placeholder="请输入预估金额"
                class="edit-input-item"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="two-item-right">
            <el-form-item label="预估到账" size="small">
              <el-date-picker
                v-model="salesFollowDetail.estimate_time"
                type="date"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                placeholder="请选择预估到账日期"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <el-form-item label="备注" size="small">
            <el-input
              clearable
              maxlength="100"
              show-word-limit
              type="textarea"
              v-model="salesFollowDetail.remark"
              class="remark-input"
              placeholder="请输入文本"
              :rows="3"
              style="width: 100%; margin-bottom: 24px"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="handleEditCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleEditSaveAction">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./sales.follow.edit.ts"></script>

<style lang="less">
.tg-sales-follow-edit-dialog {
  .el-checkbox__input + .el-checkbox__label {
    color: var(--text-color);
    font-weight: 400;
  }

  .el-radio__input + .el-radio__label {
    color: var(--text-color);
    font-weight: 400;
  }

  .two-item-left {
    width: 273px;
    display: inline-block;
  }

  .two-item-right {
    width: 273px;
    margin-left: 12px;

    display: inline-block;
  }
  .el-dialog {
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      background-color: rgba(var(--theme-rgb-color), 0.05);
    }

    .el-dialog__footer {
      height: 50px;
      line-height: 50px;
      background-color: rgba(var(--theme-rgb-color), 0.05);
      .tg-btn-default {
        border: 1px solid var(--border-line-div-color);
      }
    }

    .el-form {
      .el-form-item {
        margin-bottom: 18px;

        .el-form-item__label {
          font-size: 12px;
          line-height: 12px;
        }
        .el-form-item__error {
          left: 11px;
          margin-top: 2px;
        }
      }
    }

    .account-form-modal {
      .el-dialog {
        border-radius: 4px;
      }

      .el-dialog__body {
        background: #f6f6f6;
      }
      .dialog-content {
        background: #fff;
        padding-top: 20px;
        padding-bottom: 30px;
        margin: 0;
        .el-form-item__error {
          padding-top: 0;
        }
      }
    }
  }
}
</style>
