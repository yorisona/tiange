/** 业务结算 提交 阶段 */
import { computed, defineComponent, h, inject, Ref, ref } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import { GetSubIncomeSettlement } from '@/services/finance/settlement';
import { Settlement, SettlementShopLiveDataForm } from '@/types/tiange/finance/settlement';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import Decimal from 'decimal.js';
import { BusinessTypeEnum } from '@/types/tiange/common';
import lodash from '@/utils/lodash/custom';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { ElForm } from 'element-ui/types/form';
import { AsyncConfirm } from '@/use/asyncConfirm';
const { debounce } = lodash;

export default defineComponent({
  name: 'TgSettlementDataForm',
  components: {
    SettlementStep3Layout,
    TopCard,
  },
  props: {},
  setup(props, ctx) {
    /** 总结算金额 */
    const total_amount = ref('0.00');
    const saveLoading = ref(false);
    const format_total_amout = computed(() => Decimal2String(new Decimal(total_amount.value)));
    const injectSettlement =
      inject<Ref<Settlement | undefined>>('settlement') ?? ref<undefined>(undefined);
    const isTaobaoShopLiveType = computed(
      () => injectSettlement.value?.business_type === BusinessTypeEnum.taobao,
    );
    const newProject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(newProject);
    const cooperation_type = ref(
      jsonProject.value?.cooperation_type === 2 ||
        inject('cooperation_type', {
          value: 1,
        }).value === 2
        ? 2
        : 1,
    );

    const elFormRef = ref<ElForm | undefined>(undefined);
    const DisplayForm = ref({
      id: -1,
      service_amount: '',
      marketing_advertising_amount: '',
      commission: '',
      recommend_amount: '',
      total_duration: '',
      total_live_num: '',
      record_count: 0,
      company_name: '--',
      business_type: 3,
    });

    const DataForm = ref<SettlementShopLiveDataForm>({
      adjust_info: [],
      refund_rate: '',
      commission_rate: '',
      unit_price: '',
      recommend_file: '',
      tax_amount: '0',
      tax_rate: '',
      is_include_tax: 0,
      invoice_type: undefined,
      tax_included_amount: '0',
      tax_excluded_amount: '0',
      service_amount: '',
      marketing_advertising_amount: '',
      business_type: 3,
      commission: '',
    });

    const prev = async () => {
      ctx.emit('prev');
    };
    const next = async () => {
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
      onSaveHandler();
    };

    /** 点击保存 */
    const submit = async () => {
      if (saveLoading.value) {
        return;
      }
      if (!DisplayForm.value.id) {
        return;
      }
      saveLoading.value = true;
      const res = await GetSubIncomeSettlement({ settlement_id: DisplayForm.value.id });
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '生成结算单成功');
        ctx.emit(
          'submit:success',
          res.data.data && res.data.data.length === 1 ? res.data.data[0] : null,
        );
      } else {
        ctx.root.$message.error(res.data.message ?? '生成结算单失败');
      }
    };

    /** 保存 */
    const onSaveHandler = debounce(submit, 200);

    const live_file_str = ref('');
    const recommend_file_str = ref('');
    /** 抖音店播 订单文件 */
    const order_file_str = ref('');
    /** 佣金 展示  */
    const commission_str = ref('');

    const recommend_amount_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.recommend_amount && DisplayForm.value.recommend_amount !== ''
            ? DisplayForm.value.recommend_amount
            : '0.00',
        ) + ' 元',
    );
    const total_adjust_amount = ref('0');
    const commission_formula_str = ref('');

    /** 服务费 */
    const service_amount_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.service_amount && DisplayForm.value.service_amount !== ''
            ? DisplayForm.value.service_amount
            : '0.00',
        ) + ' 元',
    );

    const raw_settlement_files = ref<string[]>([]);
    const old_contract_id = ref<any>(undefined);
    const old_seal_type = ref<number | null>(null);
    const RawFillForm = ref<Settlement | undefined>(undefined);
    /** 填充表单数据 */
    const fillForm = (data?: Settlement) => {
      if (data) {
        RawFillForm.value = data;
        DataForm.value.adjust_info = data.adjust_info;
        if (DataForm.value.adjust_info) {
          const _adjust_info_amount = DataForm.value.adjust_info
            .reduce(
              (sum, item) =>
                new Decimal(
                  item.adjust_amount && item.adjust_amount !== '' ? item.adjust_amount : '0',
                ).add(sum),
              new Decimal('0'),
            )
            .toFixed(2)
            .toString();

          total_adjust_amount.value = formatAmountWithoutPrefix(_adjust_info_amount);
        }

        /** 佣金计算公式 */
        if (isTaobaoShopLiveType.value) {
          commission_formula_str.value = `${formatAmountWithoutPrefix(
            data.recommend_amount ?? '0',
          )} * (1 - ${data.refund_rate}%) * ${data.commission_rate}%`;
        } else {
          commission_formula_str.value = `${formatAmountWithoutPrefix(
            data.sale_amount ?? '0.00',
          )} * ${data.commission_rate}%`;
        }
        commission_str.value = formatAmountWithoutPrefix(data.commission ?? '0') + ' 元';

        DisplayForm.value.id = data.id;
        cooperation_type.value = data.cooperation_type
          ? data.cooperation_type
          : cooperation_type.value;
        DisplayForm.value.recommend_amount = data.recommend_amount.toString();
        DisplayForm.value.service_amount = data.service_amount.toString();
        DisplayForm.value.marketing_advertising_amount = data.marketing_advertising_amount
          ? data.marketing_advertising_amount.toString()
          : '';
        DisplayForm.value.commission = data.commission.toString();
        DisplayForm.value.record_count = data.record_count;
        DisplayForm.value.company_name = data.company_name ? data.company_name : '--';

        DataForm.value.sale_amount = data.sale_amount.toString();
        DataForm.value.tax_amount = `${data.tax_amount ?? 0}`;
        DataForm.value.tax_rate = String(`${data.tax_rate ?? 6}`);
        DataForm.value.is_include_tax = data.is_include_tax === 0 ? 0 : 1;
        DataForm.value.invoice_type = data.invoice_type;
        DataForm.value.tax_excluded_amount = `${data.tax_excluded_amount ?? 0}`;
        DataForm.value.tax_included_amount = `${data.tax_included_amount ?? 0}`;
        DataForm.value.service_amount = data.service_amount.toString();
        DataForm.value.marketing_advertising_amount = data.marketing_advertising_amount
          ? data.marketing_advertising_amount.toString()
          : '';
        DataForm.value.seal_type = data.seal_type;
        DataForm.value.commission = data.commission.toString();
        DataForm.value.business_type = data.business_type ?? null;
        if (data.live_file) {
          live_file_str.value = data.live_file;
        }
        if (data.recommend_file) {
          recommend_file_str.value = data.recommend_file;
        }
        if (data.order_file) {
          order_file_str.value = data.order_file;
        }
        old_contract_id.value = data.contract_id || undefined;
        old_seal_type.value = data.seal_type || null;
        total_amount.value = `${data.total_settle_amount}`;
      }
      return true;
    };

    /** 保存并退出 */
    const saveBeforeClose = async () => {
      return true;
    };

    /** 表单有数据变化 */
    const isEditModeChanged = computed(
      () =>
        old_seal_type.value !== DataForm.value.seal_type ||
        JSON.stringify(raw_settlement_files.value) !==
          JSON.stringify(DataForm.value.settlement_files),
    );

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    return {
      RawFillForm,
      Decimal2String,
      cooperation_type,
      confirmBeforeClose,
      isTaobaoShopLiveType,
      saveBeforeClose,
      commission_formula_str,
      total_adjust_amount,
      formatAmountWithoutPrefix,
      commission_str,
      DisplayForm,
      DataForm,
      live_file_str,
      order_file_str,
      recommend_file_str,
      service_amount_str,
      recommend_amount_str,
      fillForm,
      total_amount,
      format_total_amout,
      saveLoading,
      prev,
      next,
      injectSettlement,
      elFormRef,
    };
  },
});
