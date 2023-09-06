<!--
 * @Description: 供应商管理-供应商合同-新增供应商合同
 * @Author: your name
 * @Date: 2019-08-08 14:10:31
 * @LastEditTime: 2021-12-21 11:12:50
 * @LastEditors: 肖槿
 -->
<style lang="scss" scoped>
@import '@/assets/scss/public.scss';
$color-primary: var(--theme-color);

.body_label {
  display: inline-block;
  width: 110px;
  text-align: right;
}

::v-deep .el-dialog__close {
  position: relative;
  top: -2px;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: $color-primary;
  color: $color-primary;
}

::v-deep .el-checkbox__label {
  padding-left: 6px;
  color: #666;
}
::v-deep .dialog-content {
  height: 614px;
  background: white;
}
::v-deep .el-input__suffix {
  top: 3px;
}
// ::v-deep .dialog-content::-webkit-scrollbar {
//   display: none;
// }
::v-deep .el-date-editor .el-range-separator {
  position: relative;
  top: -3px;
}
::v-deep .el-dialog {
  padding: 0px !important;
}
::v-deep .el-dialog__header {
  text-align: left !important;
  padding: 0 !important;
  padding-left: 20px !important;
}

::v-deep .el-radio-group {
  margin-top: 0 !important;
}
.selected-settlement {
  background-color: #dadee6 !important;
  border-color: #dadee6 !important;
}

.box1 {
  background: #fff !important;
  padding-top: 8px;
  padding-bottom: 10px;
}
.box2 {
  background: #fff !important;
  padding-top: 8px;
  padding-bottom: 10px;
}
.box3 {
  background: #fff !important;
  padding-top: 8px;
  padding-bottom: 10px;
  .delete_tr {
    position: absolute;
    right: -23px;
    margin-top: -140px;
    .el-icon-error:hover {
      color: red !important;
    }
    &.cctv {
      right: 0;
      left: 920px;
    }
  }
  .content-header {
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
    padding: 30px 20px;
    padding-top: 0;
  }
  .content-body {
    padding: 0 30px;
    margin-top: -20px;
    padding-bottom: 20px;
    .line-status {
      background: #f6f6f6;
      padding: 10px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 33.3% 33.3% 33.3%;
      > div {
        line-height: 52px;
      }
    }
    ::v-deep .el-input {
      width: 160px !important;
    }
    .add_tr {
      border: 1px dashed #dcdfe6;
      line-height: 40px;
      color: $color-primary;
      text-align: center;
      cursor: pointer;
    }
    .add_tr:hover {
      border: 1px dashed $color-primary;
    }
    ::v-deep .el-form-item__content {
      margin-left: 0 !important;
    }
    ::v-deep .el-form-item {
      margin-bottom: 0 !important;
    }

    ::v-deep .el-form {
      .form-grid {
        display: grid;
        grid-template-columns: 33.3% 33.3% 33.3%;
        ::v-deep .el-form-item__label {
          width: 112px;
        }
      }
      ::v-deep .el-form-item__content {
        margin-right: 30px;
        margin-bottom: 15px;
      }
    }
    ::v-deep .el-input__inner {
      height: 36px !important;
    }
  }
  .form-remark {
    ::v-deep .el-form-item__error {
      position: relative;
      left: -467px;
    }
  }
}
.positionAdust {
  position: relative;
  top: 8px;
}
.box4 {
  background: #fff !important;
  margin-top: 10px;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
::v-deep .el-checkbox {
  color: #333 !important;
}
::v-deep .el-dialog {
  margin-bottom: 70px;
  padding-bottom: 0;
}
::v-deep .el-dialog__header {
  text-align: left !important;
}
#add-contract {
  .attachment-icon {
    width: 25px;
    vertical-align: middle;
  }
  ::v-deep .el-dialog__header {
    background-color: #f2f6f9;
    margin: 0;
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: var(--text-color);
    }
    .el-dialog__headerbtn {
      top: 12px;
      font-size: 24px;
      .el-dialog__close {
        color: var(--icon-color) !important;
      }
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0;
    background: #f2f6f9;
    .dialog-content {
      // max-height: 550px;
      overflow-y: auto;
      .box1,
      .box2 {
        padding: 10px 20px;
      }
      .content-header {
        font-size: 14px;
        color: var(--text-color);
        // height: 44px;
        // line-height: 44px;
        position: relative;
        top: -4px;
      }
      .content-body {
        font-size: 12px;
        .content-other {
          width: 829px;
          margin-left: 120px;
          background: #f6f6f6;
          display: flex;
          align-items: center;
          padding: 8px 0;
        }
        .content-lines {
          margin-top: 20px;
          line-height: 20px !important;
        }
        .content-line,
        .content-lines {
          // height: 52px;
          line-height: 52px;
          .content-label {
            display: inline-block;
            width: 120px;
            text-align: right;
            vertical-align: top;
            color: var(--text-second-color);
            em {
              font-style: normal;
              color: #f26467;
              margin-right: 5px;
            }
          }
          .content-value {
            display: inline-block;
            width: 680px;
            color: var(--text-color);
            .value-select {
              width: 100%;
            }
            .sale-chance-wrap {
              border-radius: 10px;
              line-height: 20px;
              margin-top: 5px;
              .chance-checkbox {
                margin: 10px 5px 0 0;
                min-width: 130px;
              }
            }
            .selected-sale-chance-wrap {
              line-height: 24px;
              padding: 10px 0;
              padding-top: 14px;
              .selected-sale-chance {
                display: inline-block;
                line-height: 24px;
                font-size: 14px;
                margin-bottom: 10px;
              }
            }
            .short-input {
              width: 230px;
            }
            .short-label {
              width: 100px;
              display: inline-block;
              text-align: right;
            }
            .upload-btn-wrap {
              display: inline-block;
              .upload-btn {
                // background: #396fff;
                color: #fff;
                position: relative;
                padding-left: 30px;
                i {
                  position: absolute;
                  top: 7px;
                  left: 8px;
                }
              }
            }
            .upload-tips {
              font-size: 12px;
              color: var(--text-third-color);
              margin-left: 11px;
            }
            .uploaded-attachment-name {
              display: inline-block;
              max-width: 160px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: middle;
              color: #396fff;
            }
            .clear-uploaded-file {
              color: #f26467;
              font-size: 18px;
              font-weight: 600;
              vertical-align: middle;
              cursor: pointer;
              margin-left: 10px;
            }
            .approver {
              width: 64px;
              height: 28px;
              display: inline-block;
              background: #f6f6f6;
              color: var(--text-second-color);
              line-height: 28px;
              text-align: center;
              border-radius: 10px;
            }
            .approver-icon {
              color: #dadada;
              font-size: 20px;
              margin: 0 5px;
              vertical-align: middle;
              font-weight: 600;
            }
            .tips {
              font-size: 12px;
              color: #f8931c;
              i {
                margin: 0 5px;
              }
            }
            .company-name.error {
              ::v-deep .el-input__inner {
                border-color: #f34b60;
              }
            }
            .company-name-slot {
              color: #f34b60;
              span {
                color: #396fff;
                margin: 0 13px;
                cursor: pointer;
              }
            }
            .select-partner-tips {
              font-size: 12px;
              color: var(--text-des-color);
              line-height: 20px;
              i {
                margin-right: 5px;
              }
            }
          }
        }
        .plan-table-wrap {
          padding: 25px 120px;
          .el-input .el-input__inner {
            text-align: right;
          }
          .plan-date {
            width: 100%;
          }
          .add-table-line {
            height: 32px;
            border: #d5e1f3 dashed 1px;
            text-align: center;
            line-height: 32px;
            margin-top: 10px;
            cursor: pointer;
            color: #396fff;
            i {
              margin-right: 6px;
              font-size: 15px;
              color: #396fff;
            }
          }
          .delete-btn {
            font-size: 22px;
            color: #bfc1c8;
            cursor: pointer;
            &:hover {
              // background-position: -118px -64px;
              color: #396fff;
            }
          }
        }
      }
    }
  }
}
::v-deep.el-dialog__body .dialog-content .box1 {
  // height: 510px;
  overflow: auto;
}
.sty-dialog::-webkit-scrollbar {
  width: 0;
}
</style>

<template>
  <div id="add-contract" class="sty-radio sty-dialog">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1006px"
      top="70px"
      @close="visible = false"
    >
      <div class="right" id="right"></div>
      <template #title>
        <div class="title">
          {{ type === 'add' ? '新增供应商合同' : '编辑供应商合同' }}
        </div>
      </template>
      <div class="dialog-content" id="dialog-content">
        <div class="box1">
          <div class="content-header">合同基础信息</div>
          <div class="content-body">
            <div class="content-lines">
              <div class="content-label">合同编号：</div>
              <div class="content-value">{{ form.contract_uid }}（系统生成）</div>
            </div>
            <div class="content-lines">
              <div class="content-label"><em>*</em>合同类型：</div>
              <el-radio-group
                @change="changeContract"
                v-model="form.contract_type"
                style="display: inline-block"
              >
                <el-radio :label="3">采买合同</el-radio>
                <el-radio :label="4">框架合同</el-radio>
              </el-radio-group>
            </div>
            <div class="content-lines content-other" v-if="form.contract_type === 3">
              <el-popover
                placement="top"
                trigger="hover"
                effect="light"
                content="如与供应商有签订框架合同请关联（非必填）"
              >
                <template slot="reference">
                  <i
                    class="el-icon-question"
                    style="cursor: pointer; position: relative; left: 10px"
                  ></i>
                </template>
              </el-popover>
              <div class="content-label" style="width: 84px">关联合同：</div>
              <div class="content-value">
                <el-select
                  v-model="form.frame_contract_uid"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请搜索并选择合同"
                  :remote-method="getContract"
                  size="medium"
                  style="width: 692px"
                  @change="val => selectContractUidChange(val)"
                >
                  <el-option
                    v-for="item in contractVal ? contract_id_list : []"
                    :key="item.contract_id"
                    :label="item.contract_uid"
                    :value="item.contract_uid"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="content-lines">
              <div class="content-label positionAdust"><em>*</em>供应商名称：</div>
              <div class="content-value">
                <el-select
                  v-model="form.partner_id"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请搜索并选择供应商"
                  :remote-method="getPartnerList"
                  size="medium"
                  @change="changePartner"
                  style="width: 830px"
                >
                  <el-option
                    v-for="item in partnerOptions"
                    :key="item.partner_id"
                    :label="item.partner_name"
                    :value="item.partner_id"
                  ></el-option>
                </el-select>
                <p class="select-partner-tips">
                  注：如果找不到相应的供应商名称，请让媒介先到【供应商管理 → 公司库】添加供应商
                </p>
              </div>
            </div>
            <div class="content-lines">
              <div class="content-label positionAdust"><em>*</em>合作期限：</div>
              <el-date-picker
                v-model="parterDate"
                :clearable="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                style="height: 36px"
              ></el-date-picker>
            </div>
            <div class="content-lines">
              <div class="content-label positionAdust" style="top: 5px"><em>*</em>采买渠道：</div>
              <div class="content-value" style="width: 820px">
                <div class="sale-chance-wrap">
                  <p>
                    <el-checkbox
                      :indeterminate="saleChance.isIndeterminate"
                      v-model="saleChance.checkAll"
                      @change="handleCheckAllChange"
                      >全部</el-checkbox
                    >
                  </p>
                  <el-checkbox-group
                    v-model="form.sale_chance"
                    @change="handleCheckedSaleChanceChange"
                  >
                    <el-checkbox
                      class="chance-checkbox"
                      v-for="(chance, index) in saleChances"
                      :label="chance.value"
                      :key="index"
                      style="color: #333"
                      >{{ chance.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box2">
          <div class="content-header">合同明细</div>
          <div class="content-body">
            <div v-if="form.contract_type === 3">
              <div class="content-line">
                <div class="content-label">产品(采买渠道)：</div>
                <div class="content-value">
                  <div class="selected-sale-chance-wrap">
                    <span
                      class="selected-sale-chance"
                      v-for="(item, index) in selectedSaleChances"
                      :key="index"
                      >{{ item.label }}
                      <label v-if="index !== selectedSaleChances.length - 1">、</label>
                    </span>
                  </div>
                </div>
              </div>
              <div class="content-line">
                <div class="content-label" style="color: #666">数量：</div>
                <div class="content-value">
                  <el-input
                    class="short-input"
                    type="number"
                    v-model="form.num"
                    placeholder="请输入数量"
                    size="medium"
                    @input="value => onlyPositiveInteger(value)"
                    @mousewheel.native.prevent
                  ></el-input>
                  <span class="short-label" style="color: #666">标准单价：</span>
                  <el-input
                    class="short-input"
                    type="number"
                    v-model="form.price"
                    placeholder="请输入标准单价"
                    size="medium"
                    @input="value => (form.price = getPositiveNumber(value))"
                    @blur="
                      event =>
                        parseInt(event.target.value, 10) === 0 ? (form.price = '') : form.price
                    "
                    @mousewheel.native.prevent
                  ></el-input>
                </div>
              </div>
              <div class="content-line">
                <div class="content-label">单位：</div>
                <div class="content-value">
                  <el-select
                    v-model="form.unit"
                    class="short-input"
                    size="medium"
                    placeholder="请选择单位"
                  >
                    <el-option label="场" :value="1"></el-option>
                    <el-option label="次" :value="2"></el-option>
                  </el-select>
                  <span class="short-label">折扣：</span>
                  <el-input
                    class="short-input"
                    type="number"
                    v-model="form.discount"
                    placeholder="请输入1-10之间的数字"
                    size="medium"
                    @blur="discountLimit"
                    @input="computeContractAmount"
                    @mousewheel.native.prevent
                  ></el-input>
                </div>
              </div>
              <div class="content-line">
                <div class="content-label">
                  <em v-show="this.form.contract_type !== 2">*</em>合同金额：
                </div>
                <div class="content-value">
                  <el-input
                    class="short-input"
                    type="number"
                    v-model="form.contract_amount"
                    placeholder="0.00"
                    size="medium"
                    @input="value => (form.contract_amount = getPositiveNumber(value))"
                    @blur="
                      event =>
                        parseInt(event.target.value, 10) === 0
                          ? (form.contract_amount = '')
                          : form.contract_amount
                    "
                    @mousewheel.native.prevent
                  ></el-input>
                </div>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label">合同附件单：</div>
              <div class="content-value">
                <template>
                  <!--  :disabled="uploadAttachment.uploading" -->
                  <el-upload
                    action
                    class="upload-btn-wrap"
                    :disabled="form.attachment_url.length === 5"
                    :show-file-list="false"
                    :multiple="false"
                    accept=".pdf,.docx,.doc,.jpg,.png,.jpeg,.xlsx,.xls"
                    :http-request="uploadAttachmentFile"
                  >
                    <el-button
                      :loading="uploadAttachment.uploading"
                      class="upload-btn btn-blue big-button"
                      size="small"
                      type="primary"
                      :disabled="no_upload_click"
                      :class="form.attachment_url.length === 5 ? 'upload-forbid' : ''"
                    >
                      <i
                        class="iconfont icon-zhongxinshangchuan"
                        style="font-size: 14px; top: 9px !important; left: 12px !important"
                      ></i
                      >上传文件
                    </el-button>
                  </el-upload>
                </template>
                <span class="upload-tips"
                  >最多上传5个文件（单个文件大小不超过30M），支持扩展名：.docx .doc .pdf .jpg .png
                  .xlsx .xls</span
                >
                <div class="uploaded-list">
                  <p
                    v-for="(item, index) in this.form.attachment_url"
                    :key="index"
                    style="margin-right: 10px; line-height: 30px"
                  >
                    <TgIcon name="ico-annex" style="margin-right: 5px"></TgIcon>
                    <span v-if="item" class="uploaded-attachment-name">{{
                      decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
                    }}</span>
                    <TgIcon
                      style="margin-left: 15px"
                      name="ico-cross"
                      v-if="item"
                      @click="clearUploadedFile(index)"
                    ></TgIcon>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box3" v-if="form.contract_type === 3">
          <div class="content-header content-block-header">付款计划</div>
          <div class="content-body">
            <div class="line-status" v-for="(items, j) in proceeds_plan" :key="j">
              <div>
                <span class="body_label">付款金额：</span
                ><el-input
                  placeholder="0.00"
                  v-model="items.proceeds_amount"
                  size="small"
                ></el-input>
              </div>
              <div>
                <span class="body_label">已付金额：</span
                ><el-input
                  placeholder="0.00"
                  v-model="items.obtained_amount"
                  size="small"
                ></el-input>
              </div>
              <div>
                <span class="body_label">待付金额：</span
                ><el-input
                  placeholder="0.00"
                  v-model="items.to_obtain_amount"
                  size="small"
                ></el-input>
              </div>
              <div>
                <span class="body_label">已收发票金额：</span
                ><el-input
                  placeholder="0.00"
                  v-model="items.invoice_amount"
                  size="small"
                ></el-input>
              </div>
              <div>
                <span class="body_label">计划付款日期：</span
                ><el-date-picker
                  v-model="items.proceeds_plan_date"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  class="plan-date"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                ></el-date-picker>
              </div>
              <span style="color: #f6f6f6">{{ proceeds_plan.length }}</span>
              <div style="position: relative" v-if="proceeds_plan.length !== 1 || isFirstDelete">
                <span class="delete_tr cctv" @click="deleteTr(j)"
                  ><i class="el-icon-error" style="color: #ccc"></i
                ></span>
              </div>
            </div>
            <div class="add_tr" @click="addTr">+ 点击添加</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button class="close-btn" size="medium" @click="visible = false">取消</el-button>
        <el-button
          class="save-btn btn-blue"
          size="medium"
          type="primary"
          :loading="this.uploadAttachment.uploading"
          @click="handleSubmitSave"
          :disabled="isSubmitForbid"
          :class="isSubmitForbid ? 'forbid-btn' : ''"
          style="margin-left: 20px"
          >{{
            this.uploadAttachment.uploading ? '附件上传中' : type === 'add' ? '提交' : '提交'
          }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saleChances } from '@/const/options'; // contractTypeOptions,
import {
  uploadContractAttachment,
  getDepartment,
  getApprover,
  getContractUid,
  getContractShopUid,
  getUserByRole,
  getPartnerList,
} from '@/api/customer';
import {
  SaveContractShop,
  SaveCoopContract,
  SaveContractCommonBusiness,
} from '@/services/contract';
import { getCostContractUid } from '@/api/cooperative';
import TgIcon from '@/components/IconFont/tg.vue';
import { ROLE_CODE } from '@/const/roleCode';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { getPositiveNumber } from '@/utils/string';
import { RouterNameProjectManage } from '@/const/router';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { ProjectTypeEnum } from '@/types/tiange/common';
import { ContractType } from '@/types/tiange/contract';
import { ref, unref } from '@vue/composition-api';
import { Loading } from 'element-ui';
export default {
  name: 'AddContract',
  inject: ['project_add_id', 'project'],
  props: {
    type: {
      type: String,
      default: 'add',
    },
    getType: {
      //这玩意好像没用
      type: Number,
      default: 1,
    },
  },
  conponents: {
    TgIcon,
  },
  setup(props, ctx) {
    /** 合同类型 */
    const project_contract_type = ref(ContractType.Sales);

    /** 店播项目 */
    const project_type = ref(ProjectTypeEnum.live);
    const breadcrumb = useBreadcrumb();

    if (
      breadcrumb.isLegalSupplierContractDetail ||
      breadcrumb.isLegalCustomerContractDetail ||
      breadcrumb.isLegalStatisticsCustomerContractDetail ||
      breadcrumb.isLegalStatisticsSupplierContractDetail
    ) {
      project_contract_type.value = ContractType.Framework;
    } else if (
      breadcrumb.isCommonBusinessDetail ||
      breadcrumb.isCommonBusinessCustomerContractDetail ||
      breadcrumb.isCommonBusinessSupplierContractDetail
    ) {
      /** 通用业务类型 */
      project_contract_type.value = ContractType.Purchase;
      project_type.value = ProjectTypeEnum.common_business;
    } else if (breadcrumb.isLiveDetail) {
      project_contract_type.value = ContractType.Purchase;
      project_type.value = ProjectTypeEnum.live;
    } else if (breadcrumb.isCoopSupplierContractDetail) {
      project_contract_type.value = ContractType.SupplierFramework;
      project_type.value = ProjectTypeEnum.marketing;
    }
    let loading;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const closeLoading = () => {
      // 使用Element loading-start 方法
      loading.close();
    };
    return {
      startLoading,
      closeLoading,
      project_contract_type,
      project_type,
      ContractType,
      ProjectTypeEnum,
    };
  },
  data() {
    return {
      isSubmitForbid: false,
      parterDate: '',
      contract_type: 1,
      no_upload_click: false,
      CONSTRACT_APPROVER, // 审批人id常量
      // 新增弹窗显示标志
      visible: false,
      saleChances,
      planData: [],
      accountManager: [],
      department: [],
      approver: [],
      contract_id_list: [], //关联框架合同编号集合
      contractVal: '',
      // 全选状态
      saleChance: {
        checkAll: false,
        isIndeterminate: false,
      },
      uploadAttachment: [],
      // 合同表单
      form: {
        frame_contract_uid: '',
        frame_contract_id: '',
        contract_uid: '',
        customer_name: '',
        contract_type: 3,
        sale_chance: [],
        num: undefined,
        price: undefined,
        unit: 1,
        discount: undefined,
        contract_amount: undefined,
        attachment_url: [],
        proceeds_plan: [
          {
            proceeds_plan_date: '',
            proceeds_amount: undefined,
            obtained_amount: undefined,
            to_obtain_amount: undefined,
            invoice_amount: undefined,
          },
        ],
        department: undefined,
        manager_id: undefined,
        // approver_id: undefined
        company_name: undefined,
        partner_id: undefined,
        supplier_name: undefined,
        coop_start_date: '',
        coop_end_date: '',
      },
      // 收款计划
      proceeds_plan: [
        {
          proceeds_plan_date: '',
          proceeds_amount: undefined,
          obtained_amount: undefined,
          to_obtain_amount: undefined,
          invoice_amount: undefined,
        },
      ],
      // 删除的收款计划，暂存变量
      deletedPlans: [],
      approverList: [
        { id: 6, username: '' }, // 文竹
        { id: 61, username: '' }, // 益智
        { id: 74, username: '' }, // 红掌
      ],
      // 客户(公司)名称 字段的提示文字显示标志
      companyNameIsShow: false,
      // 远程搜索供应商的选项
      partnerOptions: [],
      isFirstDelete: false,
      breadcrumb: useBreadcrumb(),
    };
  },
  watch: {
    proceeds_plan: {
      handler: function (val) {
        if (this.proceeds_plan.length === 1) {
          let temp = false;
          const val_temp = val[0];
          for (let key in val_temp) {
            if (val_temp[key]) {
              temp = true;
              break;
            }
          }
          this.isFirstDelete = temp;
        }
      },
      deep: true,
    },
  },
  computed: {
    // 计算选中的采买渠道在合同明细里面显示
    selectedSaleChances() {
      const selectedSaleChances = this.saleChances.filter(item => {
        if (this.form.sale_chance.find(selectedItem => selectedItem === item.value)) {
          return true;
        } else {
          return false;
        }
      });
      return selectedSaleChances;
    },
  },
  methods: {
    getPositiveNumber,
    //  --- 添加一行
    addTr() {
      this.proceeds_plan.push({
        proceeds_plan_date: '',
        proceeds_amount: undefined,
        obtained_amount: undefined,
        to_obtain_amount: undefined,
        invoice_amount: undefined,
      });
      this.isFirstDelete = false;
    },
    // --- 删除某行
    deleteTr(index) {
      /**
       * 1. 数量大于1，可删除任意明细
       * 2. 数量=1，初始数据(未修改) - 不允许删除
       *    数量=1，初始数据(已修改) - 允许删除，并自动添加一条空的明细
       */
      this.proceeds_plan.splice(index, 1);
      if (this.proceeds_plan.length === 0) {
        this.addTr();
      }
    },
    discountLimit(value) {
      if (value.currentTarget.value < 1 || value.currentTarget.value > 10) {
        this.form.discount = '';
      }
    },
    changeContract() {
      this.form.frame_contract_uid = '';
      // this.resetForm(this.form.contract_uid, this.form.contract_type);
    },
    //  父组件调用清空方法
    clearParterDate() {
      Object.assign(this.$data, this.$options.data());
    },
    changePartner(val) {
      for (const vals of this.partnerOptions) {
        if (vals.partner_id === val) {
          this.form.supplier_name = vals.partner_name;
        }
      }
    },
    // 提供给父组件使用，勿删
    show(contractDetail) {
      this.no_upload_click = false;
      if (this.type === 'add') this.getContractNumber();
      this.getAccountManager();

      this.getApprover();
      this.resetForm();

      // 如果是编辑 获取详情 写入表单
      if (this.type === 'edit') {
        // console.log(contractDetail)
        // for (let key in this.form) {
        //   this.form[key] = contractDetail.contract_info[key]
        // }
        if (!contractDetail) return false;
        this.saleChance.checkAll =
          contractDetail.contract_info.sale_chance.length === saleChances.length;
        this.saleChance.isIndeterminate =
          contractDetail.contract_info.sale_chance.length !== saleChances.length &&
          contractDetail.contract_info.sale_chance.length !== 0;
        this.uploadAttachment.file = contractDetail.contract_detail.attachment_url
          ? {
              name: contractDetail.contract_detail.attachment_url.split('/')[
                contractDetail.contract_detail.attachment_url.split('/').length - 1
              ],
            }
          : null;
        // 第一次获取下拉选项
        this.getPartnerList(contractDetail.contract_info.company_name);
        this.form = {
          contract_uid: contractDetail.contract_info.contract_uid,
          customer_name: contractDetail.contract_info.customer_name,
          contract_type: contractDetail.contract_info.contract_type,
          sale_chance: contractDetail.contract_info.sale_chance.map(item => item.value),
          num: contractDetail.contract_detail.num,
          price: contractDetail.contract_detail.price,
          unit: contractDetail.contract_detail.unit,
          discount: [0, '0', '0.0', '0.00'].includes(contractDetail.contract_detail.discount)
            ? ''
            : contractDetail.contract_detail.discount,
          contract_amount: contractDetail.contract_detail.contract_amount,
          attachment_url:
            contractDetail.contract_detail.attachment_url === ''
              ? []
              : contractDetail.contract_detail.attachment_url.split(','),
          proceeds_plan: [],
          department: contractDetail.contract_info.department + '',
          manager_id: contractDetail.contract_info.manager_id,
          // approver_id: contractDetail.contract_info.approver_id,
          id: contractDetail.contract_info.id,
          partner_id: contractDetail.contract_info.company_id,
          project_id: contractDetail.contract_info.project_id,
        };
        this.proceeds_plan = contractDetail.proceeds_plan.map(item => {
          return {
            proceeds_plan_date: item.proceeds_plan_date_str,
            proceeds_amount: item.proceeds_amount,
            obtained_amount: item.obtained_amount,
            to_obtain_amount: item.to_obtain_amount,
            invoice_amount: item.invoice_amount,
            id: item.id,
          };
        });
        if (!this.proceeds_plan.length) {
          this.proceeds_plan.push({
            proceeds_plan_date: '',
            proceeds_amount: undefined,
            obtained_amount: undefined,
            to_obtain_amount: undefined,
            invoice_amount: undefined,
          });
        }
        this.parterDate = [
          contractDetail.contract_info.coop_start_date,
          contractDetail.contract_info.coop_end_date,
        ];
        this.form.frame_contract_uid = contractDetail.contract_info.frame_contract_uid;
      } else {
        this.form.project_id = undefined;
      }
      this.visible = true;

      // 自动将滚动条滑到顶部
      setTimeout(() => {
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
      }, 100);
    },
    // 采买渠道全选
    handleCheckAllChange(val) {
      this.form.sale_chance = val ? saleChances.map(item => item.value) : [];
      this.saleChance.isIndeterminate = false;
    },
    // 处理已选中的采买渠道变动（checkbox group）
    handleCheckedSaleChanceChange(value) {
      // console.log(value, saleChances)
      const checkedCount = value.length;
      this.saleChance.checkAll = checkedCount === saleChances.length;
      this.saleChance.isIndeterminate = checkedCount > 0 && checkedCount < saleChances.length;
    },
    // 关联客户合同输入值获取
    getContract(val) {
      this.contractVal = val;
      let project_type = this.project_type;
      getCostContractUid({
        partner_type: 2,
        contract_status: 2,
        contract_type: 4,
        // partner_id: id,
        search: val,
        /*    project_id: unref(this.project_add_id),*/
        project_type: project_type,
      }).then(({ data }) => {
        this.$set(this, 'contract_id_list', data.data.data || []);
      });
    },
    // 选择关联框架合同
    selectContractUidChange(val) {
      this.contractVal = '';
      const contract_data = this.contract_id_list.find(item => {
        return item.contract_uid === val;
      });
      if (contract_data) {
        this.form.frame_contract_uid = contract_data.contract_uid;
        this.form.frame_contract_id = contract_data.contract_id;
      }
      // for (var i = 0; i < this.list.length; i++) {
      //   if (val === this.list[i].contract_uid) {
      //     item.contract_id = this.list[i].contract_id;
      //   }
      // }
    },
    // 上传附件
    uploadAttachmentFile(value) {
      if (this.form.attachment_url.length === 5) {
        this.$message.error('最多上传5个文件');
        return;
      }

      // console.log(this.form.attachment_url)
      if (value.file.size > 30 * 1025 * 1024) {
        this.$message.error('单个文件大小不超过30M');
        return;
      }
      this.startLoading();
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract');
      this.uploadAttachment.uploading = true;
      this.uploadAttachment.file = value.file;

      uploadContractAttachment(formData)
        .then(res => {
          this.closeLoading();
          if (!res.data.success) {
            this.uploadAttachment.file = null;
            this.$message({
              type: 'warning',
              message: res.data.message,
              showClose: true,
              duration: 2000,
            });
          } else {
            // this.form.attachment_url = res.data.data.source;
            //   this.uploadAttachment.push({
            //   file: value.file.name,
            //   path: res.data.data.source
            // })
            this.form.attachment_url.push(res.data.data.source);
            if (this.form.attachment_url.length === 5) {
              this.no_upload_click = true;
              //  this.uploadAttachment.uploading = true;
            } else {
              this.no_upload_click = false;
            }
            // 整理并赋值附件地址字段
            // const urlList = this.uploadAttachment.map(item => item.path)
            // this.form.attachment_url = urlList.join(',');
          }
          this.uploadAttachment.uploading = false;
        })
        .catch(error => {
          this.closeLoading();
          this.$message({
            type: 'warning',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          this.uploadAttachment.uploading = false;
          console.log(error.message);
        });
    },
    // 清除已上传的附件
    clearUploadedFile(index) {
      // this.uploadAttachment.file = null;
      // this.uploadAttachment.splice(index, 1);
      // this.attachment_url.splice(index, 1);
      this.form.attachment_url.splice(index, 1);
      this.no_upload_click = false;
    },
    // 添加一条收款计划
    addOnePlan() {
      this.proceeds_plan.push({
        proceeds_plan_date: '',
        proceeds_amount: undefined,
        obtained_amount: undefined,
        to_obtain_amount: undefined,
        invoice_amount: undefined,
      });
    },
    // 移除一条收款计划
    handleDeletePlan(index) {
      if (this.proceeds_plan[index].id) {
        this.proceeds_plan[index].is_delete = 1;
        this.deletedPlans.push(this.proceeds_plan[index]);
      }
      this.proceeds_plan.splice(index, 1);
    },
    //
    onlyPositiveInteger(inputValue) {
      const getPositiveInteger = value => {
        return value.replace(/\D/g, '').replace(REG_REMOVE_PREFIX_ZERO, '');
      };
      this.form.num = getPositiveInteger(inputValue);
    },
    // 计算合同金额
    computeContractAmount() {
      // console.log('num', (this.form.num))
      // console.log('price', (this.form.price))
      // console.log('discount', (this.form.discount))
      // debugger
      if (this.form.num < 0)
        setTimeout(() => {
          this.form.num = undefined;
        }, 50);
      if (this.form.price < 0)
        setTimeout(() => {
          this.form.price = undefined;
        }, 50);
      if (this.form.discount < 0) {
        setTimeout(() => {
          this.form.discount = undefined;
        }, 50);
        this.$message({
          type: 'warning',
          message: '折扣不能小于0',
        });
      }
      if (this.form.discount > 10) {
        setTimeout(() => {
          this.form.discount = undefined;
        }, 50);
        this.$message({
          type: 'warning',
          message: '折扣不能大于10',
        });
      }

      setTimeout(() => {
        let amount;
        if (this.form.num && this.form.price && !this.form.discount) {
          amount = this.form.num * this.form.price;
        } else if (this.form.num && this.form.price && this.form.discount) {
          // if (this.form.discount > 10 || this.form.discount < 0) {
          //   this.$message({
          //     type: 'warning',
          //     message: '合同折扣输入有误'
          //   })
          //   return false
          // }
          amount = (this.form.num * this.form.price * this.form.discount) / 10;
        }

        this.form.contract_amount = amount ? amount.toFixed(0) : amount;
      }, 50);
    },
    // 合同金额变动触发
    handleContractAmountChange() {
      if (this.form.contract_amount < 0)
        setTimeout(() => {
          this.form.contract_amount = undefined;
        }, 50);
      this.form.discount = undefined;
    },
    // 获取客户经理
    getAccountManager() {
      // queryUserNames({ role: ROLE_CODE.customer_manager + ',' + ROLE_CODE.major_customer_manager }).then(res => {
      //   if (res.data.success) {
      //     this.accountManager = res.data.data.user_data
      //   } else {
      //     this.$message({
      //       type: 'warning',
      //       message: res.data.message,
      //       duration: 2000,
      //       showClose: true
      //     })
      //   }
      // }).catch(error => {
      //   this.$message({
      //     type: 'error',
      //     message: '客户经理获取失败，稍后重试',
      //     duration: 2000,
      //     showClose: true
      //   })
      //   console.log(error.message)
      // })
      getUserByRole({
        roles: ROLE_CODE.customer_manager + ',' + ROLE_CODE.major_customer_manager,
      })
        .then(res => {
          if (res.data.success) {
            this.accountManager = res.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '客户经理获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 获取部门
    getDepartment() {
      getDepartment()
        .then(res => {
          if (res.data.success) {
            this.department = [];
            for (const key in res.data.data) {
              this.department.push({
                label: res.data.data[key],
                value: key,
              });
            }
            // this.department = res.data.data
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '部门获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 获取合同审批人
    getApprover() {
      getApprover()
        .then(res => {
          if (res.data.success) {
            // this.approver = res.data.data
            res.data.data.forEach(info => {
              this.approverList = this.approverList.map(item => {
                if (item.id === info.id) {
                  item.username = info.username;
                }
                return item;
              });
            });
            // console.log(this.approverList)
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '审批人获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 点击保存
    handleSubmitSave() {
      if (!this.form.partner_id) {
        this.$message({
          type: 'warning',
          message: '请搜索并选择供应商',
          duration: 2000,
          showClose: true,
        });
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return false;
      }
      if (this.parterDate) {
        this.form.coop_start_date = this.parterDate[0];
        this.form.coop_end_date = this.parterDate[1];
      } else {
        this.$message({
          type: 'warning',
          message: '请选择时间',
          duration: 2000,
          showClose: true,
        });
        return false;
      }

      if (this.form.sale_chance.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个采买渠道',
          duration: 2000,
          showClose: true,
        });
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return false;
      }
      // 当合同类型为框架协议时，合同金额可以为 0
      if (
        !this.form.contract_amount &&
        this.form.contract_type !== 2 &&
        this.form.contract_type !== 4
      ) {
        this.$message({
          type: 'warning',
          message: '请输入合同金额',
          duration: 2000,
          showClose: true,
        });
        return false;
      }
      // 编辑时 合并已删除的数据
      if (this.type === 'edit') {
        this.form.proceeds_plan = this.proceeds_plan.concat(this.deletedPlans);
      } else {
        this.form.proceeds_plan = this.proceeds_plan;
      }

      if (this.form.contract_type === 4) {
        this.form.frame_contract_uid = '';
        this.form.frame_contract_id = '';
      }
      this.isSubmitForbid = true;
      // 提交保存
      Promise.resolve()
        .then(() => {
          if (this.project_type === this.ProjectTypeEnum.common_business) {
            /** 通用业务 */
            return SaveContractCommonBusiness({
              ...this.form,
              project_id: unref(this.project_add_id),
            });
          } else if (this.project_type === this.ProjectTypeEnum.marketing) {
            /** 营销业务 **/
            return SaveCoopContract({
              ...this.form,
              cooperation_id: unref(this.project_add_id),
            });
          } else {
            /** 店铺代播 **/
            return SaveContractShop({
              ...this.form,
              project_id: unref(this.project_add_id),
            });
          }
        })
        .then(res => {
          if (res.data.success) {
            this.visible = false;
            this.proceeds_plan = [
              {
                proceeds_plan_date: '',
                proceeds_amount: undefined,
                obtained_amount: undefined,
                to_obtain_amount: undefined,
                invoice_amount: undefined,
              },
            ];
            this.deletedPlans = [];
            this.$message({
              type: 'success',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
            if (this.type === 'add') this.$emit('added');
            if (this.type === 'edit') {
              this.$emit('edited');
            }
            this.isSubmitForbid = false;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
            this.isSubmitForbid = false;
          }
          // this.isSubmitForbid = false;
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '合同保存失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
          this.isSubmitForbid = false;
        });
    },
    // 获取合同编号
    async getContractNumber() {
      Promise.resolve()
        .then(() => {
          if (
            this.breadcrumb.isLiveDetail ||
            this.breadcrumb.isSupplyChainDetail ||
            this.breadcrumb.isLocalLifeDetail ||
            this.breadcrumb.isCommonBusinessDetail
          ) {
            return getContractShopUid({
              business_type: this.project.value.business_type,
            });
          } else if (this.breadcrumb.isCoopDetail) {
            return getContractUid();
          } else {
            return getContractUid();
          }
        })
        .then(res => {
          if (res.data.success) {
            this.form.contract_uid = res.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '合同编号获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 重置表单
    resetForm(contract_uid = '', contract_type = 3) {
      this.form = {
        contract_uid: contract_uid,
        customer_name: '',
        contract_type: contract_type,
        sale_chance: [],
        num: undefined,
        price: undefined,
        unit: 1,
        discount: undefined,
        contract_amount: undefined,
        attachment_url: [],
        proceeds_plan: [
          {
            proceeds_plan_date: '',
            proceeds_amount: undefined,
            obtained_amount: undefined,
            to_obtain_amount: undefined,
            invoice_amount: undefined,
          },
        ],
        department: undefined,
        manager_id: undefined,
        company_name: undefined,
        partner_id: undefined,
        // approver_id: undefined
      };
      this.parterDate = '';
      this.saleChance.checkAll = false;
      this.saleChance.isIndeterminate = false;
    },
    // 根据id获取审批人名称
    getApproverUsername(id) {
      return this.approverList.find(item => item.id === id).username;
    },
    // 当选择客户经理select处于焦点状态事件，检测选项是否为空，如果没有选项，再次请求
    handleCustomerManagerSelectFocus() {
      if (this.accountManager.length === 0) {
        this.getAccountManager();
      }
    },
    // 客户经理选项发生变化，自动选择部门
    handleCustomerManagerSelectChange(value) {
      const department = this.accountManager.find(item => item.id === value);
      // debugger
      this.form.department = department ? department.department + '' : undefined;
    },
    // 补充公司信息
    handleAddCompanyNameClick() {
      this.visible = false;
      this.$router.push({
        name: RouterNameProjectManage.marketing.customer.list,
      });
    },
    // 获取供应商列表
    getPartnerList(partnerName, _cb) {
      if (partnerName === '' || partnerName === undefined) return;
      getPartnerList({
        partner_type: 2,
        partner_name: partnerName,
      }).then(res => {
        if (res.data.success) {
          this.partnerOptions = res.data.data;
          if (this.type === 'edit') {
            this.form.supplier_name = this.partnerOptions[0].partner_name;
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message,
            duration: 2000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>
