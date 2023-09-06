/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-01-21 13:14:53
 */

import { computed, defineComponent, inject, Ref, ref, h } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import TopCard from '@/modules/settlement/component/top.card.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import {
  AdjustInfo,
  Settlement,
  SettlementDataUnionParams,
  SettlementProjectType,
  SettlementStep,
} from '@/types/tiange/finance/settlement';
import Decimal from 'decimal.js';
import { formatAmount, formatAmountWithoutPrefix } from '@/utils/string';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GenSubMerchantIncomeSettlement, SaveMerchantSettlementData } from '@/services/investment';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';

type SettlementPick = Pick<
  Settlement,
  | 'id'
  | 'total_settle_amount'
  // | 'settlement_files'
  | 'adjust_info'
  | 'json_data'
  | 'is_include_tax'
  | 'invoice_type'
  | 'tax_rate'
  | 'company_name'
>;

export default defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TopCard,
    Appendix,
    CardLayout,
    SettlementStep3Layout,
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const initSettlementData = (): SettlementPick => {
      return {
        /** ID */
        id: settlement.value?.id ?? -1,
        /** 总结算金额 */
        total_settle_amount: settlement.value?.total_settle_amount ?? 0,
        /** 结算单文件列表 */
        // settlement_files: settlement.value?.settlement_files
        //   ? [...settlement.value?.settlement_files]
        //   : [],
        /** 手工调账信息 */
        adjust_info: settlement.value?.adjust_info ? [...settlement.value?.adjust_info] : [],
        company_name: settlement.value?.company_name ? settlement.value?.company_name : '--',
        is_include_tax: settlement.value?.is_include_tax,
        invoice_type: settlement.value?.invoice_type || undefined,
        tax_rate: settlement.value?.tax_rate ?? 0,
        json_data: settlement.value?.json_data,
      };
    };
    const settlementDetail = ref<SettlementPick>(initSettlementData());

    const loading = ref<boolean>(false);
    const loadingText = ref<string | undefined>(undefined);

    const isFileUploaderDisabled = computed(() => settlement_files.value.length >= 5);

    const settlement_files = ref<string[]>(
      settlement.value?.settlement_files ? [...settlement.value?.settlement_files] : [],
    );
    const originSettlementFiles = ref<string[]>([...settlement_files.value]);

    const merchants_project = computed(() => {
      return json_data.value?.company_info_list?.find(
        el => el.type === SettlementProjectType.merchant_project,
      );
    });
    const execute_project = computed(() => {
      return json_data.value?.company_info_list?.find(
        el => el.type === SettlementProjectType.execute_project,
      );
    });
    const amountInfoList = computed(() => {
      return json_data.value?.amount_info_list ?? [];
    });
    const isAmountInfoList = computed(
      () => amountInfoList.value && [11, 12, 13].includes(amountInfoList.value[0]?.type),
    );
    const json_data = computed(() => {
      return settlementDetail.value.json_data;
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
        if (!settlement_files.value.length) {
          ctx.root.$message.warning('请上传结算单扫描件');
          return;
        }
        const result = await AsyncConfirm(ctx, {
          title: '确定生成结算单吗?',
          content: () =>
            h('div', [h('div', '将对本次结算生成对应的结算单'), h('div', '是否需要生成？')]),
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
          loadingText.value = '正在生成结算单，请稍候...';
        }
        loading.value = true;
      },
      stopLoading: () => {
        loading.value = false;
        loadingText.value = undefined;
      },
      isModified: () => {
        const originDetailData = JSON.stringify(originSettlementFiles.value);
        const newDetailData = JSON.stringify(settlement_files.value);
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
      adjustProjectDesc: (adjustInfo: AdjustInfo) => {
        if (adjustInfo.type === SettlementProjectType.merchant_project) {
          return '招商项目收入结算';
        } else if (adjustInfo.type === SettlementProjectType.execute_project) {
          return '执行项目结算收入';
        }
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(true);
      },
      saveSettlementDataRequest: async (isClose: boolean) => {
        const params: SettlementDataUnionParams = {
          id: settlementDetail.value.id,
          step: SettlementStep.step_three,
          settlement_files: settlement_files.value,
        };

        methods.startLoading('save');
        const res = await SaveMerchantSettlementData(params);
        methods.stopLoading();
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
      submitSettlementDataRequest: async () => {
        if (!settlement_files.value.length) {
          ctx.root.$message.warning('请上传结算单扫描件');
          return;
        }

        methods.startLoading('submit');
        const res = await GenSubMerchantIncomeSettlement(
          settlementDetail.value.id,
          settlement_files.value,
        );
        methods.stopLoading();
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '生成结算单成功');
          //  提交
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error(res.data.message ?? '生成结算单失败');
        }
      },
      beforeUpload: (config: any) =>
        ValidationFileUpload({ pdf: true, image: true, excel: true, doc: true, fileSize: 30 })(
          config,
        ),
      successHandle: (res: { data: { source: string } }) => {
        settlement_files.value.push(res.data.source);
      },
      formatAmountWithoutPrefix,
    };
    const typeMap = new Map([
      [11, '佣金'],
      [12, '佣金(服务费)'],
      [13, '技术服务费'],
    ]);
    return {
      settlementDetail,
      merchants_project,
      isAmountInfoList,
      execute_project,
      typeMap,
      loading,
      loadingText,
      settlement_files,
      isFileUploaderDisabled,
      json_data,
      amountInfoList,
      ...methods,
    };
  },
});
