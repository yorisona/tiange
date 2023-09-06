<template>
  <SettlementStep3Layout
    class="settlement-step3-live-douyin-after"
    :class="settlement.is_estimate === 1 ? 'is_estimate' : ''"
  >
    <template #top>
      <top-card
        :amount="total_amount"
        :taxed="DataForm.is_include_tax"
        :invoice_type="DataForm.invoice_type"
        :tax_rate="DataForm.tax_rate"
        :name="settlement.company_name"
        name_desc="供应商："
        type="value2"
      ></top-card>
    </template>
    <template #left>
      <CardLayout>
        <template #title>成本信息</template>
        <div>
          <div class="one-item-block">
            <div class="one-block" style="margin-bottom: 12px" v-if="amountDetail(9)">
              <div class="label" style="width: 100px; color: var(--text-third-color); float: left">
                主播成本：
              </div>
              <div class="one-block" style="display: inline-block; float: left; line-height: 28px">
                <span style="font-weight: 600; color: var(--text-color)"
                  >{{ kol_service_all_amount_str }} 元</span
                >
                <div
                  class="one-label"
                  style="
                    color: var(--text-third-color);
                    display: block;
                    width: 490px;
                    line-height: 22px;
                    height: 22px;
                  "
                >
                  主播服务费：<span style="font-weight: 600; color: var(--text-color)"
                    >{{ kol_service_amount_str }} 元</span
                  >
                </div>
                <div style="display: block">
                  <div
                    class="one-label"
                    style="
                      width: 490px;
                      color: var(--text-third-color);
                      line-height: 22px;
                      height: 22px;
                    "
                  >
                    机构服务费：<span style="font-weight: 600; color: var(--text-color)"
                      ><span v-if="DataForm.company_service_type === '1'"
                        >抽成服务费 {{ company_service_amount_str }} 元 比率
                        {{ DataForm.company_service_rate }} %</span
                      ><span v-else>固定费用 {{ company_service_amount_str }} 元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="one-block" style="margin-bottom: 12px" v-if="amountDetail(8)">
              <div class="label" style="width: 100px; color: var(--text-third-color); float: left">
                投放成本：
              </div>
              <div
                class="one-block"
                style="display: inline-block; line-height: 28px; float: left; width: 580px"
              >
                <span style="font-weight: 600; color: var(--text-color)"
                  >{{ Decimal2String(amountDetail(8).amount) }} 元</span
                >
              </div>
            </div>
            <div class="one-block" style="margin-bottom: 12px" v-if="amountDetail(6)">
              <div class="label" style="width: 100px; color: var(--text-third-color); float: left">
                其他成本：
              </div>
              <div
                class="one-block"
                style="display: inline-block; line-height: 28px; float: left; width: 580px"
              >
                <span style="font-weight: 600; color: var(--text-color)"
                  >{{ Decimal2String(amountDetail(6).amount) }} 元</span
                >
                <div style="display: block; line-height: 20px; margin-right: 100px">
                  <span style="color: var(--text-third-color); font-size: 12px"
                    >{{ amountDetail(6).remark }}
                  </span>
                </div>
              </div>
            </div>
            <div class="one-block" style="margin-bottom: 12px" v-if="amountDetail(15)">
              <div class="label" style="width: 100px; color: var(--text-third-color); float: left">
                营销/商广：
              </div>
              <div
                class="one-block"
                style="display: inline-block; line-height: 28px; float: left; width: 580px"
              >
                <span style="font-weight: 600; color: var(--text-color)"
                  >{{ Decimal2String(amountDetail(15).amount) }} 元</span
                >
                <div style="display: block; line-height: 20px; margin-right: 100px">
                  <span style="color: var(--text-third-color); font-size: 12px"
                    >{{ amountDetail(15).remark }}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="one-block"
              style="margin-bottom: 12px"
              v-if="DataForm.adjust_info.length > 0"
            >
              <div class="label" style="width: 100px; color: var(--text-third-color)">
                手工调账：
              </div>
              <div style="line-height: 28px">
                <div class="value" style="font-weight: 600; color: var(--text-color)">
                  {{ getAdjustAmount }} 元
                </div>
                <div
                  style="font-size: 12px"
                  v-for="(adjustItem, seq) in DataForm.adjust_info"
                  :key="seq"
                >
                  <div
                    style="
                      display: inline-block;
                      width: 80px;
                      text-align: right;
                      padding: 0;
                      color: var(--text-third-color);
                      float: left;
                      line-height: 20px;
                      margin-left: -22px;
                    "
                    v-if="adjustItem.type"
                  >
                    {{
                      adjustItem.type === 8
                        ? '投放成本：'
                        : adjustItem.type === 6
                        ? '其他成本：'
                        : adjustItem.type === 9
                        ? '主播成本：'
                        : adjustItem.type === 15
                        ? '营销/商广：'
                        : ''
                    }}
                  </div>
                  <div
                    style="
                      display: inline-block;
                      width: 400px;
                      padding: 0;
                      color: var(--text-third-color);
                      float: left;
                      line-height: 20px;
                      margin-bottom: 4px;
                    "
                  >
                    <div style="color: var(--text-color)">
                      调整金额：{{ formatAmountWithoutPrefix(adjustItem.adjust_amount) }} 元
                    </div>
                    <div style="color: var(--text-third-color)">
                      调整原因：{{ adjustItem.adjust_reason }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #right>
      <CardLayout
        class="tg-files-container"
        :style="{
          height: settlement.is_estimate === 1 ? '360px' : '300px',
        }"
        :padding="[0, 12, 0, 0]"
      >
        <template #title>文件</template>
        <div
          style="padding: 17px 12px 12px 0; height: 217px"
          :style="{ height: isYuFengCompany(settlement.company_name) ? '217px' : '157px' }"
        >
          <div class="file-block-content" v-if="amountDetail(9)">
            <div style="height: 18px; font-size: 12px; color: var(--text-third-color)">
              主播工资明细
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--text-color)">
              <div class="fileItem" v-if="kolSalaryDataUrl && kolSalaryDataUrl !== ''">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 16px; height: 16px; margin-top: 2px"
                />
                <div class="line-clamp-1">主播费用明细.xlsx</div>
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex"
                  type="link"
                  @click="downloadKolServiceFeeFile('主播费用明细.xlsx')"
                  >下载</tg-button
                >
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex; margin-left: 8px"
                  type="link"
                  @click="previewKolServiceFeeFile('主播费用明细.xlsx')"
                  >预览</tg-button
                >
              </div>
            </div>
          </div>
          <div class="file-block-content" style="margin-top: 16px" v-if="amountDetail(9)">
            <div style="height: 18px; font-size: 12px; color: var(--text-third-color)">
              主播排班信息
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--text-color)">
              <div class="fileItem" v-for="(item, index) in schedule_file_list" :key="index">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 16px; height: 16px; margin-top: 2px"
                />
                <div class="line-clamp-1">{{ item.name }}直播排班.xlsx</div>
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex"
                  type="link"
                  @click="downloadKolScheduleFile(item.name + '直播排班.xlsx')"
                  >下载</tg-button
                >
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex; margin-left: 8px"
                  type="link"
                  @click="previewKolScheduleFile(item.name + '直播排班.xlsx')"
                  >预览</tg-button
                >
              </div>
            </div>
          </div>
          <div
            class="file-block-content"
            style="margin-top: 16px"
            v-if="
              isYuFengCompany(settlement.company_name) &&
              amountDetail(8) &&
              DataForm.business_type !== 8
            "
          >
            <div style="height: 18px; font-size: 12px; color: var(--text-third-color)">
              投放明细
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--text-color)">
              <div class="fileItem">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 16px; height: 16px; margin-top: 2px"
                />
                <div class="line-clamp-1">投放明细</div>
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex"
                  type="link"
                  @click="downloadPutServiceFeeFile()"
                  >下载</tg-button
                >
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex; margin-left: 8px"
                  type="link"
                  @click="previewPutServiceFeeFile('投放明细.xlsx')"
                  >预览</tg-button
                >
              </div>
            </div>
          </div>
        </div>
        <div
          style="border-bottom: 1px solid rgba(164, 178, 194, 0.3); margin: 0px 8px 0px 18px"
        ></div>
        <div class="file-block-content">
          <div
            class="statements-file-block"
            :style="{ color: !readonly ? 'var(--text-second-color)' : 'var(--text-third-color)' }"
          >
            <div
              class="statements-file"
              :style="readonly ? 'padding: 18px 18px 12px 0' : 'padding: 18px 0 12px 0'"
            >
              <div>
                <div class="title">
                  <span style="color: red" v-if="!readonly && settlement.is_estimate !== 1">*</span
                  >结算文件
                </div>
                <div
                  style="
                    display: flex;
                    line-height: 32px;
                    height: 32px;
                    width: 100%;
                    font-size: 12px;
                  "
                  v-if="!readonly"
                >
                  <el-upload
                    v-if="uploadedFileList.length < 50"
                    action="/"
                    accept=".docx,.pdf,.jpg,.jpeg,.xlsx,.png,.xls"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadFileHandler"
                  >
                    <tg-button icon="ico-btn-upload" class="settlement-upload-btn"
                      >上传文件</tg-button
                    >
                  </el-upload>
                  <tg-button
                    v-else
                    :disabled="true"
                    icon="ico-btn-upload"
                    class="settlement-upload-btn"
                    >上传文件</tg-button
                  >
                  <div
                    style="
                      display: inline-block;
                      margin-left: 6px;
                      font-size: 12px;
                      width: 166px;
                      color: var(--text-third-color);
                      height: 32px;
                      line-height: 14px;
                      font-weight: 400;
                    "
                  >
                    支持.docx .pdf .jpg .png .xlsx .xls(单个文件大小不超过50M)
                  </div>
                </div>
              </div>
              <div class="fileList" style="margin-top: 12px">
                <div class="fileItem" v-for="(item, index) in uploadedFileList" :key="index">
                  <FileItem
                    :key="index"
                    :filepath="item.path"
                    @remove="handleRemoveFileClick(index)"
                    :readonly="readonly"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #files>
      <div>
        <el-form size="mini" :style="{ marginTop: readonly ? '0px' : '' }">
          <el-form-item
            v-if="settlement.is_estimate !== 1"
            label="是否盖章："
            label-width="72px"
            :rules="
              readonly ? [] : [{ required: true, message: '请选择是否盖章', trigger: 'change' }]
            "
            :class="readonly ? 'text-item' : ''"
          >
            <div v-if="readonly">
              <div style="color: var(--text-color); font-size: 12px">
                {{ DataForm.seal_type === 2 ? '是' : DataForm.seal_type === 1 ? '否' : '--' }}
              </div>
            </div>
            <div v-else style="display: flex; align-items: center">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="DataForm.seal_type"
                placeholder="请选择"
                style="width: 108px"
                :disabled="readonly"
              >
                <el-option :key="2" :value="2" label="是"></el-option>
                <el-option :key="1" :value="1" label="否"></el-option>
              </el-select>
              <div class="stamp-tips">选"是"财务确认结算单后，系统自动发起结算单盖章流程。</div>
            </div>
          </el-form-item>
          <el-form-item
            label="关联合同："
            label-width="72px"
            :rules="
              !settlement.is_estimate && !readonly
                ? [
                    {
                      required: settlement.is_estimate !== 1 ? true : false,
                      message: '请选择合同',
                      trigger: 'change',
                    },
                  ]
                : []
            "
            :class="readonly ? 'text-item' : ''"
          >
            <div v-if="readonly">
              <div
                class="contract-div"
                v-if="cooperation_link_contract_id && contract_info.sign_type_name"
                @click="contractClick"
              >
                {{
                  contract_info.contract_company_name +
                  '  (' +
                  contract_info.sign_type_name +
                  ')  ' +
                  contract_info.coop_start_date +
                  '-' +
                  contract_info.coop_end_date
                }}
              </div>
              <div v-else style="width: 700px; font-size: 12px">--</div>
            </div>
            <div v-else style="display: flex; align-items: center">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="cooperation_link_contract_id"
                filterable
                remote
                reserve-keyword
                clearable
                :placeholder="
                  readonly ? '--' : contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'
                "
                :remote-method="getContract"
                style="width: 520px"
                :disabled="readonly"
                @change="val => selectContractUidChange(val)"
              >
                <el-option
                  v-for="item in contract_id_list"
                  :key="item.contract_id"
                  :label="
                    item.company_name +
                    '  (' +
                    item.sign_type_name +
                    ')  ' +
                    item.coop_start_date +
                    '-' +
                    item.coop_end_date
                  "
                  :value="item.contract_id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #button v-if="!readonly">
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">提交</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.after.ts"></script>

<style lang="less">
.settlement-step3-live-douyin-after {
  .statements-file .title {
    font-size: 12px;
    line-height: 16px;
    height: 16px;
    margin-bottom: 6px;
    color: var(--text-second-color);
  }
  .line-clamp-1 {
    margin-left: 2px;
    margin-right: 12px;
    height: 18px;
    line-height: 20px;
    width: 170px;
    font-size: 12px;
    color: var(--text-color);
    &.basename {
      width: auto;
      max-width: 180px;
    }
  }
  .step2-cost-layout-content {
    grid-template-rows: 118px 300px 60px !important;
    .tg-files-container {
      height: 320px;
    }
  }
  &.is_estimate .step2-cost-layout-content {
    grid-template-rows: 118px 360px 30px !important;
    .tg-files-container {
      height: 380px;
    }
  }
  .one-item-block {
    .one-block {
      display: flex;
      .label {
        display: inline-block;
        width: 76px;
        color: var(--text-third-color);
        font-size: 12px;
        text-align: right;
        line-height: 28px;
      }
      .one-label {
        line-height: 28px;
        height: 28px;
        display: inline-block;
        width: 76px;
        color: var(--text-third-color);
        font-size: 12px;
        text-align: left;
      }
    }
  }

  .tg-files-container {
    height: 320px;
    .file-block-content .fileItem:nth-child(n + 2) {
      margin-top: 14px;
    }

    .file-block-content {
      padding: 0 0 0 18px;

      .fileItem {
        color: var(--text-color);
        font-size: 14px;
        color: var(--text-color);
        text-align: left;
        line-height: 20px;
        height: 20px;
        font-weight: 400;

        display: flex;
        svg {
          float: left;
          width: 16px;
          line-height: 20px;
          height: 16px;
        }
        div {
          float: left;
          padding: 0;
          margin: 0;
        }
      }
    }
  }

  .statements-file-block {
    width: 100%;
    display: flex;
    font-size: 14px;
    color: var(--text-third-color);
    font-weight: 400;
    overflow-y: auto;

    .statements-file {
      flex: 1;
    }

    .fileList {
      margin-top: 12px;

      .fileItem {
        color: var(--text-color);
        font-size: 14px;
        color: var(--text-color);
        text-align: left;
        line-height: 20px;
        height: 20px;
        font-weight: 400;
        flex-shrink: 0;
        display: flex;
        margin-bottom: 12px;

        &:hover {
          .file-delete-icon {
            visibility: visible;
          }
        }

        .file-delete-icon {
          padding-top: 2px;
          line-height: 20px;
          height: 20px;
          visibility: hidden;
        }

        svg {
          float: left;
          height: 16px;
          width: 16px;
          line-height: 20px;
          display: flex;
        }
        div {
          float: left;
          padding: 0;
          margin: 0;
        }
      }
      .tg-btn.tg-btn-default svg.icon {
        color: var(--icon-color);
        height: 16px;
      }
    }
  }

  .header {
    width: 100%;
    height: 40px;
    text-indent: 18px;
    background: rgba(164, 178, 194, 0.09);
    line-height: 40px;

    .label {
      color: var(--text-color);
      font-weight: 600;
      font-size: 14px;
    }
    .desc {
      font-size: 12px;
      color: #a4b2c2;
      padding-left: 12px;
    }
  }
  .settlement-upload-btn {
    .tg-btn-content {
      flex-shrink: 0;
    }
  }
}

.el-popover.kol-tips-popper {
  line-height: 24px;
  font-size: 12px;
  padding: 10px 18px 8px 18px;
}
</style>
<style lang="less" scoped>
/deep/ .step2-cost-layout-content {
  column-gap: 16px !important;
  row-gap: 16px !important;
  grid-template-areas:
    'top top'
    'left right'
    'files files';
  grid-template-columns: auto repeat(2, 286px) auto;
}
/deep/ .step2-layout-content-files {
  grid-area: files;
  margin-top: -1px;
}
.one-block {
  .label {
    line-height: 30px;
    height: 30px;
  }
}
/deep/.el-form {
  /* display: flex;
  justify-content: space-between;*/
  .el-form-item {
    //display: inline-block;
    margin-right: 0px;
    vertical-align: top;
  }
}
.stamp-tips {
  display: inline-block;
  margin-left: 6px;
  font-size: 12px;
  width: 312px;
  color: var(--text-third-color);
  line-height: 28px;
  height: 28px;
  font-weight: 400;
}
.contract-div {
  font-size: 12px;
  width: 700px;
  display: flex;
  align-items: center;
  color: var(--theme-color);
  cursor: pointer;
  &:hover {
    color: var(--theme-color);
  }
}
</style>
