import { defineComponent, h, inject, onMounted, ref, Ref } from '@vue/composition-api';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TopCard from '@/modules/settlement/component/top.card.vue';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import { formatAmount } from '@/utils/string';
import {
  Settlement,
  SettlementAmountInfo,
  SettlementDataUnionParams,
  SettlementStep,
  SettlementSubmitParams,
} from '@/types/tiange/finance/settlement';
import { ContractSettlement } from '@/types/tiange/contract';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import { AsyncConfirm } from '@/use/asyncConfirm';
import Decimal from 'decimal.js';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import {
  saveSettlementDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { deepClone } from '@/utils/tools';
import moment from 'moment';
type SettlementPick = Pick<
  Settlement,
  | 'id'
  | 'total_settle_amount'
  | 'income_amount'
  | 'income_file'
  | 'settlement_files'
  | 'adjust_info'
  | 'json_data'
  | 'detail_file'
  | 'excel_data'
  | 'contract_id'
  | 'seal_type'
> & { amount_info_list: SettlementAmountInfo[] };

export default defineComponent({
  components: {
    SettlementStep3Layout,
    CardLayout,
    TopCard,
  },
  setup(props, ctx) {
    const loading = ref<boolean>(false);
    const loadingText = ref<string | undefined>(undefined);
    const injectSettlement =
      inject<Ref<Settlement | undefined>>('settlement') || ref<Settlement | undefined>(undefined);
    const initSettlementData = () => {
      return {
        seal_type: injectSettlement.value?.seal_type ?? null,
        /** ID */
        id: injectSettlement.value?.id ?? -1,
        /** 总结算金额 */
        total_settle_amount: injectSettlement.value?.total_settle_amount ?? 0,
        /** 收入金额 */
        income_amount: injectSettlement.value?.income_amount ?? 0,
        /** 收入文件 */
        income_file: injectSettlement.value?.income_file ?? '',
        /** 结算单文件列表 */
        settlement_files: injectSettlement.value?.settlement_files
          ? [...injectSettlement.value?.settlement_files]
          : [],
        /** 手工调账信息 */
        adjust_info: injectSettlement.value?.adjust_info
          ? [...injectSettlement.value?.adjust_info]
          : [],
        amount_info_list: injectSettlement.value?.json_data?.amount_info_list || [],
        detail_file: injectSettlement.value?.detail_file || '',
        excel_data: injectSettlement.value?.excel_data
          ? [...injectSettlement.value?.excel_data]
          : [],
        contract_id: injectSettlement.value?.contract_id ?? undefined,
      };
    };

    const settlementDetail = ref<SettlementPick>(initSettlementData());
    const originSettlementDetail = ref<SettlementPick>(initSettlementData());
    const DataForm = ref<{
      is_include_tax: 0 | 1;
      invoice_type: number | undefined;
      company_name: string;
      tax_rate: string;
      seal_type: null | number;
    }>({
      company_name: '',
      tax_rate: '',
      is_include_tax: 0,
      invoice_type: undefined,
      seal_type: null,
    });
    const methods = {
      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(false);
        } else {
          ctx.emit('prev');
        }
      },
      next: async () => {
        // ctx.emit('next');
        if (
          injectSettlement.value?.is_estimate === 0 &&
          !settlementDetail.value.settlement_files.length
        ) {
          ctx.root.$message.warning('请上传结算单扫描件');
          return;
        }
        if (injectSettlement.value?.is_estimate === 0 && !DataForm.value.seal_type) {
          ctx.root.$message.warning('请选择是否盖章');
          return;
        }
        if (
          injectSettlement.value?.is_estimate === 0 &&
          DataForm.value.seal_type === 2 &&
          !cooperation_link_contract_id.value
        ) {
          ctx.root.$message.warning('请选择合同');
          return;
        }
        const result = await AsyncConfirm(ctx, {
          title: '确定提交结算单吗?',
          content: () =>
            h('div', [
              h('div', '提交后将无法修改结算信息，确定要将结算单'),
              h('div', '提交给财务确认吗?'),
            ]),
          confirmText: '确定',
          cancelText: '取消',
        });
        if (!result) {
          return;
        }
        // 提交结算数据
        methods.submitSettlementDataRequest();
      },
      startLoading: (type: 'save' | 'upload' | 'submit') => {
        if (type === 'save') {
          loadingText.value = '正在保存，请稍候...';
        } else if (type === 'upload') {
          loadingText.value = '正在上传，请稍候...';
        } else if (type === 'submit') {
          loadingText.value = '正在提交，请稍候...';
        }
        loading.value = true;
      },
      stopLoading: () => {
        loading.value = false;
        loadingText.value = undefined;
      },
      isModified: () => {
        const originDetailData = JSON.stringify(originSettlementDetail.value.settlement_files);
        const newDetailData = JSON.stringify(settlementDetail.value.settlement_files);
        const old_contract_id = JSON.stringify(originSettlementDetail.value.contract_id);
        const old_seal_type = originSettlementDetail.value.seal_type;
        if (String(cooperation_link_contract_id.value) !== old_contract_id) {
          return true;
        }
        if (old_seal_type !== DataForm.value.seal_type) {
          return true;
        }
        if (originDetailData !== newDetailData) {
          return true;
        }
        return false;
      },
      adjustTotalAmount: () => {
        let amount: Decimal = new Decimal(0);
        settlementDetail.value.adjust_info.forEach(item => {
          amount = new Decimal(item.adjust_amount).add(amount);
        });
        return formatAmount(amount.toString(), 'None');
      },
      uploadFileHandler: async (value: HttpRequestOptions) => {
        const file = value.file;
        if (file.size > 30 * 1024 * 1024) {
          ctx.root.$message.error('上传文件大小不能超过 30MB!');
          return;
        }

        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);
        formData.append('type', 'settlement');
        methods.startLoading('upload');
        const res = await uploadFileService(formData);
        methods.stopLoading();
        if (res.data.success) {
          settlementDetail.value.settlement_files.push(res.data.data.source);
          ctx.root.$message.success('上传成功');
        } else {
          ctx.root.$message.error(res.data.message || '上传失败，稍后重试');
        }
      },
      handleRemoveFileClick: (index: number) => {
        settlementDetail.value.settlement_files.splice(index, 1);
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(true);
      },
      fillForm: (data?: Settlement) => {
        if (settlementDetail.value.id !== -1) {
          /** ID */
          settlementDetail.value.id = data?.id || -1;
          /** 总结算金额 */
          settlementDetail.value.total_settle_amount = data?.total_settle_amount ?? 0;
          /** 收入金额 */
          settlementDetail.value.income_amount = data?.income_amount ?? 0;
          /** 收入文件 */
          settlementDetail.value.income_file = data?.income_file ?? '';
          /** 结算单文件列表 */
          settlementDetail.value.settlement_files = data?.settlement_files
            ? [...data?.settlement_files]
            : [];
          /** 手工调账信息 */
          settlementDetail.value.adjust_info = data?.adjust_info ? [...data?.adjust_info] : [];
          settlementDetail.value.detail_file = data?.detail_file ?? '';
          settlementDetail.value.excel_data = data?.excel_data ? [...data?.excel_data] : [];
          DataForm.value.tax_rate = data?.tax_rate?.toString() ?? '';
          DataForm.value.is_include_tax = data?.is_include_tax === 0 ? 0 : 1;
          DataForm.value.invoice_type = data?.invoice_type;
          DataForm.value.company_name = data?.company_name ?? '';
          DataForm.value.seal_type = data?.seal_type ?? null;
          cooperation_link_contract_id.value = data?.contract_id ?? undefined;
        }
      },
      saveSettlementDataRequest: async (isClose: boolean) => {
        const params: SettlementDataUnionParams = {
          id: settlementDetail.value.id,
          step: SettlementStep.step_three,
          settlement_files: settlementDetail.value.settlement_files,
          contract_id: cooperation_link_contract_id.value,
          seal_type: DataForm.value.seal_type || null,
        };

        methods.startLoading('save');
        const res = await saveSettlementDataService(params, BusinessTypeEnum.mcn);
        methods.stopLoading();
        if (res.data.success) {
          if (isClose) {
            ctx.root.$message.success(res.data.message || '保存成功');
          } else {
            // ctx.root.$message.success(res.data.message || '保存成功');
            ctx.emit('prev', res.data.data);
          }

          return true;
        } else {
          ctx.root.$message.error(res.data.message || '保存失败');
          return false;
        }
      },
      submitSettlementDataRequest: async () => {
        if (
          injectSettlement.value?.is_estimate === 0 &&
          !settlementDetail.value.settlement_files.length
        ) {
          ctx.root.$message.warning('请上传结算单扫描件');
          return;
        }
        const params: SettlementSubmitParams = {
          id: settlementDetail.value.id,
          contract_id: cooperation_link_contract_id.value || 0,
          seal_type: DataForm.value.seal_type || null,
        };

        // if (injectSettlement.value?.is_estimate === 0) {
        params.settlement_files = settlementDetail.value.settlement_files;
        // }
        methods.startLoading('submit');
        const res = await submitSettlementDataService(params);
        methods.stopLoading();
        if (res.data.success) {
          ctx.root.$message.success(res.data.message || '提交结算成功');
          //  提交
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error(res.data.message || '提交失败');
        }
      },
      settlementTypeFun(type: number) {
        switch (type) {
          case 1:
            return '坑位费';
          case 2:
            return '团长服务费';
          case 3:
            return '抖音cps';
          case 4:
            return '星图';
          case 5:
            return '商广';
          case 6:
            return '其他';
          case 10:
            return 'CPS收入';
          default:
            return '';
        }
      },
      formatAmount,
    };
    const contract_id_list = ref<ContractSettlement[]>([]);
    // 关联客户合同输入值获取
    const { project_id } = useProjectBaseInfo();
    const getContract = async (kw?: string) => {
      const res = await GetContractUid({
        company_name: kw,
        only_main: 0,
        project_id: project_id.value,
        contract_status: 2,
        partner_type: 1,
        settlement_start_date: injectSettlement.value
          ? moment(injectSettlement.value.start_date * 1000).format('YYYY-MM-DD')
          : undefined,
        settlement_end_date: injectSettlement.value
          ? moment(injectSettlement.value.end_date * 1000).format('YYYY-MM-DD')
          : undefined,
      });
      if (res.data.success) {
        contract_id_list.value = res.data.data.data;
      } else {
        contract_id_list.value = [];
      }
    };
    getContract('');
    const cooperation_link_contract_id = ref<number | undefined>(undefined);
    // 选择关联框架合同
    const selectContractUidChange = (val: any) => {
      cooperation_link_contract_id.value = val;
    };
    onMounted(() => {
      originSettlementDetail.value = deepClone(settlementDetail.value) as SettlementPick;
    });
    return {
      contract_id_list,
      getContract,
      cooperation_link_contract_id,
      selectContractUidChange,
      loading,
      loadingText,
      DataForm,
      settlementDetail,
      injectSettlement,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <settlement-step3-layout
          leftItemExpand={true}
          amount={this.formatAmount(this.settlementDetail.total_settle_amount, 'None')}
          class={
            this.injectSettlement?.is_estimate === 1
              ? 'is_estimate tg-settlement-submit-form col-2-mcn'
              : 'tg-settlement-submit-form col-2-mcn'
          }
        >
          <top-card
            slot="top"
            is_cost={false}
            amount={`${this.settlementDetail.total_settle_amount.toString()}`}
            taxed={this.DataForm.is_include_tax}
            invoice_type={this.DataForm.invoice_type}
            tax_rate={this.DataForm.tax_rate}
            name={this.DataForm.company_name}
            type="value2"
          ></top-card>
          <card-layout slot="left" style="height: 100%" padding={[18, 0, 0]}>
            <span slot="title">收入信息</span>
            <div class="settlement-step3-taobao-other-detail">
              {this.settlementDetail.amount_info_list &&
              this.settlementDetail.amount_info_list.length > 0 ? (
                this.settlementDetail.amount_info_list.map((item, index) => {
                  return (
                    <div key={index}>
                      <div class="item">
                        {/* <p class="label">{this.settlementTypeFun(item.type)}：</p> */}
                        <p class="label">收入：</p>
                        <div class="detail">
                          <div class="amount">
                            <p class="fee">
                              {item.amount ? this.formatAmount(item.amount, 'None') + ' 元' : '--'}
                            </p>
                          </div>
                          {item.remark && <p class="text">{item.remark}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div class="empty">
                  <empty-common></empty-common>
                </div>
              )}
            </div>
          </card-layout>
          <card-layout slot="right" style="height: 100%">
            <span slot="title">手工调账</span>
            <fragments>
              <div class="adjust-account-amount">
                调账 {this.settlementDetail.adjust_info.length} 笔
              </div>
              <div class="adjust-account-money mgt-6">
                <span>共</span> {this.adjustTotalAmount()} 元
              </div>
              {this.settlementDetail.adjust_info.length > 0 && (
                <div class="content-dash-line"></div>
              )}
              {this.settlementDetail.adjust_info.map((item, index) => {
                return (
                  <div class="mgt-12 content-adjust-account-item" key="index">
                    <div style="display: flex">
                      <span style="flex-shrink: 1; white-space: pre">{`${index + 1}. `}</span>
                      {`调整金额 ${
                        item.adjust_amount ? formatAmount(item.adjust_amount, 'None') : '--'
                      } 元；调整原因：${item.adjust_reason ? item.adjust_reason : '--'}`}
                    </div>
                  </div>
                );
              })}
            </fragments>
          </card-layout>
          {/* {this.injectSettlement?.is_estimate !== 1 && ( */}
          <div slot="files" class="form-uploaded-file">
            <el-form size="mini">
              <el-form-item class="settlement-form-item" label-width="80px">
                <fragments slot="label">
                  {this.injectSettlement?.is_estimate !== 1 && <span class="star">*</span>}结算单：
                </fragments>
                <div style="display: flex; height: 28px; align-items: center">
                  <div>
                    <el-upload
                      // v-model={this.settlementDetail.settlement_files}
                      action="/"
                      multiple={false}
                      show-file-list={false}
                      http-request={this.uploadFileHandler}
                      accept=".docx,.pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                      disabled={this.settlementDetail.settlement_files.length >= 5 ? true : false}
                      style="width: 96px"
                    >
                      <tg-button
                        class="upload-btn"
                        icon="ico-btn-upload"
                        disabled={this.settlementDetail.settlement_files.length >= 5 ? true : false}
                      >
                        上传文件
                      </tg-button>
                    </el-upload>
                  </div>
                  <div class="upload-tips">
                    支持 .docx .pdf .jpg .png .xlsx .xls, 最多上传5个文件(单个文件大小不超过30M)
                  </div>
                </div>
              </el-form-item>
            </el-form>
            {this.settlementDetail.settlement_files.length > 0 && (
              <div
                // v-show="settlementDetail.settlement_files.length"
                class="fileList"
                style="padding-left: 80px; margin-bottom: 15px; margin-top: -5px"
              >
                {this.settlementDetail.settlement_files.map((item, index) => {
                  return (
                    <div key="index" style="height: 20px; line-height: 20px; margin-top: 4px">
                      <div style="display: inline-flex" class="line-clamp-1 uploaded-file">
                        <fileItem
                          showPreview={false}
                          key={index}
                          filepath={item}
                          onRemove={() => this.handleRemoveFileClick(index)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <el-form size="mini">
              {this.injectSettlement?.is_estimate !== 1 && (
                <el-form-item prop="seal_type" label="是否盖章：" label-width="80px">
                  <fragments slot="label">
                    {' '}
                    <span class="star">*</span>是否盖章：
                  </fragments>
                  <div>
                    <el-select
                      v-model={this.DataForm.seal_type}
                      placeholder="请选择"
                      style="width: 117px"
                    >
                      <el-option key="2" value={2} label="是"></el-option>
                      <el-option key="1" value={1} label="否"></el-option>
                    </el-select>
                    <div class="upload-tips" style="width: 350px; margin-left: 12px">
                      选"是"财务确认结算单后，系统自动发起结算单盖章流程。
                    </div>
                  </div>
                </el-form-item>
              )}
              <el-form-item
                label="关联合同："
                style="margin-bottom: 32px !important"
                label-width="80px"
              >
                <fragments slot="label">
                  {this.DataForm.seal_type === 2 && <span class="star">*</span>}关联合同：
                  {/* 关联合同： */}
                </fragments>
                <div style="display: flex; align-items: center">
                  <el-select
                    v-model={this.cooperation_link_contract_id}
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder={this.contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'}
                    remote-method={this.getContract}
                    style="width: 520px"
                    on-change={(val: any) => this.selectContractUidChange(val)}
                  >
                    {this.contract_id_list.map(item => {
                      return (
                        <el-option
                          key={item.contract_id}
                          label={
                            item.company_name +
                            '  (' +
                            item.sign_type_name +
                            ')  ' +
                            item.coop_start_date +
                            '-' +
                            item.coop_end_date
                          }
                          value={item.contract_id}
                        ></el-option>
                      );
                    })}
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
          </div>
          {/* )} */}
          <fragments slot="button">
            <tg-button on-click={this.prev}>上一步</tg-button>
            <tg-button type="primary" on-click={this.next}>
              提交
            </tg-button>
          </fragments>
        </settlement-step3-layout>
        <tg-mask-loading visible={this.loading} content={this.loadingText} />
      </div>
    );
  },
});
