import { computed, defineComponent, h, inject, onMounted, Ref, ref } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import TopCard from '@/modules/settlement/component/top.card.vue';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import {
  SetlementCostTypeMap,
  Settlement,
  SettlementDataUnionParams,
  SettlementIncomeType,
  SettlementStep,
  SettlementSubmitParams,
} from '@/types/tiange/finance/settlement';
import { deepClone } from '@/utils/tools';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { Decimal2String, formatAmount } from '@/utils/string';
import {
  saveSettlementDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import Decimal from 'decimal.js';
import {
  default_put_company_name,
  pit_fee_detail_url,
  put_detail_url,
} from '@/modules/settlement/component/use/uilts';
import { feeTypeItem } from '@/modules/settlement/component/costDetail/cost.detail';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import use from '@/modules/customer/contract/list/use';
import { ContractSettlement } from '@/types/tiange/contract';
import moment from 'moment';

export default defineComponent({
  name: 'Step3MCNDouYinAfter',
  components: {
    CardLayout,
    SettlementStep3Layout,
    TgAdjustAccountForm,
    TopCard,
    Appendix,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const seal_type = ref<number | null>(null);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const cloneSettlement = computed(() => {
      const newSettlement = deepClone(settlement.value) as Settlement;
      return newSettlement;
    });
    const settlementFiles = ref<string[]>(cloneSettlement.value?.settlement_files ?? []);
    const originSettlementFiles = ref<string[]>([...settlementFiles.value]);
    const old_contract_id = ref(undefined);
    const old_seal_type = ref<number | null>(null);
    const contract_info = ref<ContractSettlement>({
      contract_uid: undefined,
      coop_start_date: undefined,
      coop_end_date: undefined,
      sign_type_name: undefined,
      contract_company_name: undefined,
    });
    const adjust_info = computed(() => {
      return (settlement.value?.adjust_info ?? []).map(el => {
        return {
          adjust_amount: Decimal2String(new Decimal(el.adjust_amount)),
          adjust_reason: el.adjust_reason,
        };
      });
    });

    /** 手工调账总额 */
    const adjust_info_amount_total = computed(() => {
      const total = (settlement.value?.adjust_info ?? []).reduce(
        (acc, cur) => Decimal.add(acc, new Decimal(cur.adjust_amount)),
        new Decimal(0),
      );
      return Decimal2String(total);
    });

    const DataForm = computed(() => {
      return settlement.value?.json_data?.amount_info_list ?? [];
    });

    const methods = {
      amountDetail: (type: SettlementIncomeType) => {
        return DataForm.value.find((el: any) => el.type === type);
      },
      downDetail: (type: SettlementIncomeType) => {
        if (type === SettlementIncomeType.pit_fee) {
          window.open(pit_fee_detail_url(settlement.value?.id, settlement.value?.company_id, 2));
        } else if (type === SettlementIncomeType.put) {
          const detail = methods.amountDetail(type);
          const ids_str = (detail?.kol_ids ?? []).join(',');
          window.open(
            put_detail_url(
              ids_str,
              settlement.value?.start_date ?? 0,
              settlement.value?.end_date ?? 0,
            ),
          );
        }
      },

      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(false);
        } else {
          ctx.emit('prev');
        }
      },
      next: async () => {
        if (settlement.value?.is_estimate === 0 && !settlementFiles.value.length) {
          ctx.root.$message.warning('请上传结算单扫描件');
          return;
        }
        if (settlement.value?.is_estimate === 0 && !seal_type.value) {
          ctx.root.$message.warning('请选择是否盖章');
          return;
        }
        if (settlement.value?.is_estimate === 0 && !cooperation_link_contract_id.value) {
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
      isModified: () => {
        const originDetailData = JSON.stringify(originSettlementFiles.value);
        const newDetailData = JSON.stringify(settlementFiles.value);
        if (
          old_contract_id.value !== cooperation_link_contract_id.value ||
          old_seal_type.value !== seal_type.value
        ) {
          return true;
        }
        if (originDetailData !== newDetailData) {
          return true;
        }
        return false;
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(true);
      },
      fillForm: (data?: Settlement) => {
        if (data) {
          settlementFiles.value = data.settlement_files ? [...data.settlement_files] : [];
          const contract_id: any = data.contract_id ? data.contract_id : undefined;
          cooperation_link_contract_id.value = contract_id;
          seal_type.value = data.seal_type || null;
          old_contract_id.value = contract_id;
          old_seal_type.value = data.seal_type || null;
          contract_info.value.contract_uid = data.contract_uid;
          contract_info.value.sign_type_name = data.sign_type_name;
          contract_info.value.coop_start_date = data.coop_start_date;
          contract_info.value.coop_end_date = data.coop_end_date;
          contract_info.value.contract_company_name = data.contract_company_name;
        }
      },
      formatAmount: (amount: string | number) => {
        return formatAmount(amount, 'None');
      },
      saveSettlementDataRequest: async (isClose: boolean) => {
        if (!cloneSettlement.value?.id) {
          return;
        }
        const params: SettlementDataUnionParams = {
          id: cloneSettlement.value?.id,
          contract_id: cooperation_link_contract_id.value,
          step: SettlementStep.step_three,
          settlement_files: settlementFiles.value,
          seal_type: seal_type.value || null,
        };

        saveLoading.value = true;
        const res = await saveSettlementDataService(params, BusinessTypeEnum.mcn);
        saveLoading.value = false;
        if (res.data.success) {
          if (isClose) {
            ctx.root.$message.success(res.data.message ?? '保存成功');
          } else {
            // ctx.root.$message.success(res.data.message ?? '保存成功');
            ctx.emit('prev', res.data.data);
          }

          return true;
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
          return false;
        }
      },
      //  提交保存数据
      submitSettlementDataRequest: async () => {
        if (!cloneSettlement.value?.id) {
          return;
        }
        // if (settlement.value?.is_estimate === 0 && !settlementFiles.value.length) {
        //   ctx.root.$message.warning('请上传结算单扫描件');
        //   return;
        // }
        if (settlement.value?.is_estimate === 0 && !seal_type.value) {
          ctx.root.$message.warning('请选择是否盖章');
          return;
        }
        if (
          settlement.value?.is_estimate === 0 &&
          seal_type.value === 2 &&
          !cooperation_link_contract_id.value
        ) {
          ctx.root.$message.warning('请选择合同');
          return;
        }
        const params: SettlementSubmitParams = {
          id: cloneSettlement.value?.id,
          contract_id: cooperation_link_contract_id.value,
          seal_type: seal_type.value || null,
        };

        // if (settlement.value?.is_estimate === 0) {
        params.settlement_files = settlementFiles.value;
        // }

        saveLoading.value = true;
        const res = await submitSettlementDataService(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '提交结算成功');
          //  提交
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error(res.data.message ?? '提交失败');
        }
      },
    };

    const isFileUploaderDisabled = computed(() => settlementFiles.value.length >= 5);
    const beforeUpload = (config: any) =>
      ValidationFileUpload({ pdf: true, image: true, excel: true, doc: true, fileSize: 30 })(
        config,
      );
    const successHandle = (res: { data: { source: string } }) => {
      settlementFiles.value.push(res.data.source);
    };

    const costOptions = computed<feeTypeItem[]>(() => {
      const options: feeTypeItem[] = [];
      SetlementCostTypeMap.forEach((value, key) => {
        options.push({
          label: value,
          value: key,
        });
      });
      return options;
    });

    const typeMap = computed<number[]>(() => {
      const options: number[] = [];
      SetlementCostTypeMap.forEach((value, key) => {
        options.push(key);
      });
      return options;
    });

    DataForm.value.sort((a: any, b: any) => {
      return costOptions.value.indexOf(a.type) - typeMap.value.indexOf(b.type);
    });

    const settlementTypeFun = (type: number) => {
      for (let index = 0; index < costOptions.value.length; index++) {
        if (costOptions.value[index].value === type) {
          return costOptions.value[index].label;
        }
      }
    };

    const isYuFengCompany = computed(
      () => settlement.value?.company_name === default_put_company_name,
    );

    onMounted(() => {
      originSettlementFiles.value = deepClone(settlementFiles.value) as string[];
    });

    const contract_id_list = ref<any>([]);
    // 关联客户合同输入值获取
    const { project_id } = useProjectBaseInfo();
    const getContract = async (kw?: string) => {
      const res = await GetContractUid({
        company_name: kw,
        only_main: 0,
        project_id: project_id.value,
        contract_status: 2,
        partner_type: 2,
        exclude_sign_types: -3,
        settlement_start_date: settlement.value
          ? moment(settlement.value.start_date * 1000).format('YYYY-MM-DD')
          : undefined,
        settlement_end_date: settlement.value
          ? moment(settlement.value.end_date * 1000).format('YYYY-MM-DD')
          : undefined,
      });
      if (res.data.success) {
        contract_id_list.value = res.data.data.data;
      } else {
        contract_id_list.value = [];
      }
    };
    if (props.readonly === false) {
      getContract('');
    }
    const cooperation_link_contract_id = ref<number | undefined>(undefined);
    // 选择关联框架合同
    const selectContractUidChange = (val: any) => {
      cooperation_link_contract_id.value = val;
    };
    const contractClick = () => {
      const contract = use.useContract('3', ctx);
      contract.contractClick(
        cooperation_link_contract_id.value as number,
        true,
        project_id.value || settlement.value?.project_id,
      );
    };
    return {
      contractClick,
      seal_type,
      contract_info,
      contract_id_list,
      getContract,
      cooperation_link_contract_id,
      selectContractUidChange,
      saveLoading,
      settlement,
      cloneSettlement,
      isYuFengCompany,
      costOptions,
      settlementFiles,
      settlementTypeFun,
      DataForm,
      adjust_info,
      adjust_info_amount_total,
      beforeUpload,
      successHandle,
      isFileUploaderDisabled,
      ...methods,
    };
  },
});
