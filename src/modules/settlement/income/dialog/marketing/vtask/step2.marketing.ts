/**
 * 财务 - 项目发起收入结算 - 第二步结算数据 - 营销(营销/V任务)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-19 13:19:54
 */
import { computed, defineComponent, inject, ref } from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import { SaveSettlementStep2Marketing } from '@/services/finance/settlement';
import type {
  AdjustInfo,
  Settlement,
  SettlementStep2MakettingFrm,
  SettlementStep2MakettingParams,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { SettlementStep } from '@/types/tiange/finance/settlement';
import type { ElForm } from 'element-ui/types/form';
import SettlementStep2Layout from '@/modules/settlement/component/step2.layout';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import AdjustAccount from '@/modules/settlement/component/AdjustAccount.vue';
import { wait } from '@/utils/func';
import { Decimal } from 'decimal.js';
import type { FormRule } from '@/types/vendor/form';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { ElFormRef, validate } from '@/utils/form';
import TopCard from '@/modules/settlement/component/top.card.vue';

type FormRuels = {
  [prop in keyof SettlementStep2MakettingFrm]?: FormRule<SettlementStep2MakettingFrm[prop]>[];
};

const emptyOrZero = (str: string) => (['', '-', '-.'].includes(str) ? '0.00' : str);

export default defineComponent({
  components: {
    SettlementStep2Layout,
    CardLayout,
    TopCard,
    AdjustAccount,
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    /** 表单引用 */
    const step2FrmRef = ref<ElForm | null>(null);
    /** 表单 */
    const step2Frm = ref<SettlementStep2MakettingFrm>({
      income_amount: '',
      adjust_info: [],
    });
    const TaxDataForm = ref<TaxAmountInfo>({
      invoice_type: undefined,
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      tax_amount: '',
    });

    /** 手工调账金额汇总 */
    const adjust_info_amount_total = computed(() =>
      step2Frm.value.adjust_info
        .filter(el => el.adjust_reason !== '' && el.adjust_amount !== '')
        .reduce((acc, cur) => acc.add(new Decimal(cur.adjust_amount)), new Decimal(0)),
    );

    /** 表单校验规则 */
    const step2FrmRules = ref<FormRuels>({
      income_amount: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback();
            } else if (/^\d+(?:\.\d{0,2})?$/u.test(value)) {
              if (!new Decimal(value).eq(0) || !adjust_info_amount_total.value.eq(0)) {
                callback();
              } else {
                callback(new Error('请填写收入或者手工调账'));
              }
            } else {
              callback(new Error('请输入正确的数字'));
            }
          },
          trigger: 'blur',
        },
      ],
    });

    const originalFrmData = ref<SettlementStep2MakettingFrm>({
      income_amount: '',
      adjust_info: [],
    });

    /** 重置表单数据 */
    const resetFrm = () => {
      step2Frm.value.income_amount = '';
      step2Frm.value.adjust_info = [];
    };

    /** 重置表单原始数据 */
    const resetOriginalFrmData = () => {
      originalFrmData.value.income_amount = '';
      originalFrmData.value.adjust_info = [];
    };

    /** 编辑模式下有数据变化 */
    const isEditModeChanged = computed(
      () => JSON.stringify(originalFrmData.value) !== JSON.stringify(step2Frm.value),
    );

    const OriginTaxForm = ref<TaxAmountInfo>({
      invoice_type: undefined,
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      tax_amount: '',
    });

    const ShowAdjustInfo = ref(false);
    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      resetFrm();
      resetOriginalFrmData();

      ShowAdjustInfo.value = true;
      const fill_tax_rate = data.tax_rate?.toString() ? data.tax_rate?.toString() : '0';

      const { income_amount, total_settle_amount, adjust_info, ...rest } = data;
      TaxDataForm.value.invoice_type = data.invoice_type;
      TaxDataForm.value.tax_rate = fill_tax_rate;
      TaxDataForm.value.tax_included_amount = data.tax_included_amount?.toString();
      TaxDataForm.value.tax_excluded_amount = data.tax_excluded_amount?.toString();
      TaxDataForm.value.tax_amount = data.tax_amount?.toString();
      OriginTaxForm.value.invoice_type = data.invoice_type;
      OriginTaxForm.value.tax_rate = fill_tax_rate;
      OriginTaxForm.value.tax_included_amount = data.tax_included_amount?.toString();
      OriginTaxForm.value.tax_excluded_amount = data.tax_excluded_amount?.toString();
      OriginTaxForm.value.tax_amount = data.tax_amount?.toString();

      step2Frm.value.income_amount = `${income_amount}`;
      step2Frm.value.adjust_info = adjust_info.map(el => ({ ...el }));

      originalFrmData.value.income_amount = `${income_amount}`;
      originalFrmData.value.adjust_info = adjust_info.map(el => ({ ...el }));
    };

    /** 总结算金额(计算版本) */
    const amount = computed(() =>
      Decimal.add(
        new Decimal(emptyOrZero(step2Frm.value.income_amount)),
        step2Frm.value.adjust_info
          .map(el => new Decimal(emptyOrZero(el.adjust_amount)))
          .reduce((acc, cur) => acc.add(cur), new Decimal(0)),
      ),
    );

    /** 总结算金额(显示版本) */
    const total_settle_amount = computed(() => amount.value.toString());

    /** 输入收入 */
    const inputIncomeAmount = (value: string) => {
      const result = /(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''];
      step2Frm.value.income_amount = result[0];
    };

    /** 手工调账数据变更 */
    const onAdjustAccountDataChange = (adjust_info: AdjustInfo[]) => {
      step2Frm.value.adjust_info = adjust_info.map(el => ({ ...el }));
    };

    /** 保存加载中 */
    const saveLoading = ref(false);

    /** 是否填充了足够的表单项(至少一项) */
    const isFilledFormItemAtLeastOne = computed(
      () =>
        step2Frm.value.income_amount !== '' ||
        step2Frm.value.adjust_info.filter(el => el.adjust_amount !== '' && el.adjust_reason !== '')
          .length > 0,
    );

    /** tax有数据变化 */
    const taxValueHasChange = computed(
      () =>
        JSON.stringify({
          tax_amount: TaxDataForm.value.tax_amount,
          tax_rate: TaxDataForm.value.tax_rate,
          invoice_type: TaxDataForm.value.invoice_type,
        }) !==
        JSON.stringify({
          tax_amount: OriginTaxForm.value.tax_amount,
          tax_rate: OriginTaxForm.value.tax_rate,
          invoice_type: OriginTaxForm.value.invoice_type,
        }),
    );

    /** 保存 */
    const saveStep2Data = async (next: boolean) => {
      if (settlement.value === undefined) {
        console.warn('不存在结算数据');
        return;
      }

      if (!isFilledFormItemAtLeastOne.value) {
        ctx.root.$message.warning('请填写至少一项结算项');
        return;
      }

      const result = await validate(step2FrmRef as Ref<ElFormRef>);

      if (!result) {
        return;
      }

      const { adjust_info, income_amount } = step2Frm.value;

      const filtered_adjust_info = adjust_info.filter(
        el => !(el.adjust_amount === '' && el.adjust_reason === ''),
      );

      if (
        filtered_adjust_info.find(el => el.adjust_reason !== '' && el.adjust_amount === '') !==
        undefined
      ) {
        ctx.root.$message.warning('请输入调整金额');
        return;
      }

      if (
        filtered_adjust_info.find(
          el => el.adjust_reason !== '' && new Decimal(el.adjust_amount).eq(0),
        ) !== undefined
      ) {
        ctx.root.$message.warning('调整金额不能为0');
        return;
      }

      if (
        filtered_adjust_info.find(el => el.adjust_amount !== '' && el.adjust_reason === '') !==
        undefined
      ) {
        ctx.root.$message.warning('请输入调整原因');
        return;
      }
      if (amount.value.lessThanOrEqualTo(new Decimal(0))) {
        ctx.root.$message.warning('总结算金额不能小于等于0');
        return;
      }

      const total_settle_amount = amount.value.toString();

      const payload: SettlementStep2MakettingParams = {
        id: settlement.value.id,
        income_amount: income_amount === '' ? '0' : income_amount,
        total_settle_amount,
        adjust_info: filtered_adjust_info,
        step: next ? SettlementStep.step_three : settlement.value.step,
        invoice_type: TaxDataForm.value.invoice_type,
        tax_rate: TaxDataForm.value.tax_rate === '' ? '0' : TaxDataForm.value.tax_rate ?? '0',
        tax_included_amount: TaxDataForm.value.tax_included_amount,
        tax_excluded_amount: TaxDataForm.value.tax_excluded_amount,
        tax_amount: TaxDataForm.value.tax_amount,
      };

      saveLoading.value = true;
      const [{ data: response }] = await wait(500, SaveSettlementStep2Marketing(payload));
      saveLoading.value = false;

      return response;
    };

    /** 上一步 */
    const prev = async () => {
      // 编辑模式但无数据变更 则直接上一步
      if (
        !taxValueHasChange.value &&
        !isEditModeChanged.value &&
        isFilledFormItemAtLeastOne.value
      ) {
        ctx.emit('prev');
        return;
      }

      const response = await saveStep2Data(false);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('prev', response.data);
        return true;
      } else {
        return false;
      }
    };

    /** 下一步 */
    const next = async () => {
      if (!(TaxDataForm.value?.invoice_type || TaxDataForm.value?.invoice_type === 0)) {
        ctx.root.$message.warning('请选择发票类型');
        return;
      }
      // 编辑模式但无数据变更 则直接下一步
      if (
        !taxValueHasChange.value &&
        !isEditModeChanged.value &&
        isFilledFormItemAtLeastOne.value
      ) {
        ctx.emit('next');
        return;
      }

      const response = await saveStep2Data(true);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
      } else if (response?.success === false) {
        ctx.root.$message.error(response.message ?? '保存失败');
      } else {
        // do nth
      }
    };

    /** 关闭前保存 */
    const saveBeforeClose = async () => {
      const response = await saveStep2Data(false);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
        return true;
      } else {
        return false;
      }
    };

    /** 判断关闭前是否需要弹窗确认 */
    const confirmBeforeClose = async () => {
      return taxValueHasChange.value || isEditModeChanged.value;
    };

    const invoiceTypeChangedHandler = (val: number) => {
      TaxDataForm.value.invoice_type = val;
      TaxDataForm.value.tax_rate = val === 0 ? '0' : TaxDataForm.value.tax_rate;
    };
    const taxRateChanged = (val: any) => {
      // const value = (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
      //   val.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      // ) ?? [''])[0];
      TaxDataForm.value.tax_rate = val;
    };

    const taxValueChangeHandler = (item: TaxAmountInfo) => {
      TaxDataForm.value.tax_included_amount = item.tax_included_amount;
      TaxDataForm.value.tax_excluded_amount = item.tax_excluded_amount;
      TaxDataForm.value.tax_amount = item.tax_amount;
      TaxDataForm.value.invoice_type = item.invoice_type;
      TaxDataForm.value.tax_rate =
        item.invoice_type === 0 ? '0' : item.tax_rate || TaxDataForm.value.tax_rate;
    };

    return {
      taxValueChangeHandler,
      invoiceTypeChangedHandler,
      taxRateChanged,
      ShowAdjustInfo,
      amount,
      total_settle_amount,
      step2FrmRef,
      step2Frm,
      step2FrmRules,
      originalFrmData,
      inputIncomeAmount,
      onAdjustAccountDataChange,
      prev,
      next,
      confirmBeforeClose,
      saveBeforeClose,
      saveLoading,
      fillForm,
      TaxDataForm,
    };
  },
});
