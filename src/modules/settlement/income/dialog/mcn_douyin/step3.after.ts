import {
  Settlement,
  SettlementDataUnionParams,
  SettlementStep,
  SettlementSubmitParams,
} from '@/types/tiange/finance/settlement';
import { defineComponent, inject, ref, Ref, onMounted, h } from '@vue/composition-api';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TopCard from '@/modules/settlement/component/top.card.vue';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import { deepClone } from '@/utils/tools';
import { AsyncConfirm } from '@/use/asyncConfirm';
import Decimal from 'decimal.js';
import { formatAmount } from '@/utils/string';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import {
  saveSettlementDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import { getToken } from '@/utils/token';
import { ContractSettlement } from '@/types/tiange/contract';
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
>;

export default defineComponent({
  components: {
    SettlementStep3Layout,
    CardLayout,
    TopCard,
  },
  setup(props, ctx) {
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
        amount_info_list: injectSettlement.value?.json_data?.amount_info_list,
        detail_file: injectSettlement.value?.detail_file || '',
        excel_data: injectSettlement.value?.excel_data
          ? [...injectSettlement.value?.excel_data]
          : [],
        contract_id: injectSettlement.value?.contract_id ?? undefined,
      };
    };

    const settlementDetail = ref<SettlementPick>(initSettlementData());
    const originSettlementDetail = ref<SettlementPick>(initSettlementData());
    const loading = ref<boolean>(false);
    const loadingText = ref<string | undefined>(undefined);
    const DataForm = ref<{
      is_include_tax: 0 | 1;
      invoice_type: undefined | number;
      company_name: string;
      tax_rate: string;
      seal_type: null | number;
    }>({
      company_name: '',
      tax_rate: '',
      is_include_tax: 0,
      seal_type: null,
      invoice_type: undefined,
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
        // if (
        //   injectSettlement.value?.is_estimate === 0 &&
        //   !settlementDetail.value.settlement_files.length
        // ) {
        //   ctx.root.$message.warning('请上传结算单扫描件');
        //   return;
        // }
        const params: SettlementSubmitParams = {
          id: settlementDetail.value.id,
          contract_id: cooperation_link_contract_id.value,
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
      formatAmount,
    };

    onMounted(() => {
      originSettlementDetail.value = deepClone(settlementDetail.value) as SettlementPick;
    });
    const settlementTypeFun = (type: number) => {
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
    return {
      getToken,
      contract_id_list,
      getContract,
      cooperation_link_contract_id,
      selectContractUidChange,
      loading,
      loadingText,
      DataForm,
      settlementDetail,
      settlementTypeFun,
      numberMoneyFormat,
      injectSettlement,
      ...methods,
    };
  },
});
