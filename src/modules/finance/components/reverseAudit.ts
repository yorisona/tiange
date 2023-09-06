/**
 * 冲销审核确认对话框
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import useVisible from '@/use/visible';
import { BooleanType } from '@/types/base/advanced';
import billPeriod from '@/modules/finance/settlement_income/components/billPeriod/index.vue';
import { BillingPeriodType } from '../settlement_income/components/billPeriod';
import { QueryAccountPeriod } from '@/services/finance';
import moment from 'moment';

export default defineComponent({
  components: {
    billPeriod,
  },
  setup(props, ctx) {
    const billPeriodRef = ref<BillingPeriodType | undefined>(undefined);
    const reverse_reason = ref('');
    const reverse_back_reason = ref('');
    const is_pass = ref<BooleanType>(BooleanType.YES);
    const shouldAccoiuntPeriod = ref(false);
    const callback = ref<
      null | ((isPass: BooleanType, reverse_back_reason: string, date?: string) => Promise<boolean>)
    >(null);

    const isConfirmBtnDisabled = computed(
      () => is_pass.value === BooleanType.NO && reverse_back_reason.value.trim() === '',
    );

    const { visible, setVisible } = useVisible();

    watch(
      () => visible.value,
      next => {
        console.log({ next });
      },
    );

    const onRefuse = () => {
      reverse_reason.value = '';
      setVisible();
    };

    const onConfirm = async () => {
      if (is_pass.value === BooleanType.YES) {
        if (shouldAccoiuntPeriod.value) {
          // billPeriodRef.value?.show();
          if (!accountDate.value) {
            ctx.root.$message.error('请选择账期');
          } else {
            onBillPeriodHaandler(accountDate.value);
          }
          return;
        }
      } else if (isConfirmBtnDisabled.value) {
        ctx.root.$message.warning('请填写不通过原因');
        return;
      }

      const result = await callback.value?.(is_pass.value, reverse_back_reason.value);

      if (result) {
        reverse_reason.value = '';
        setVisible();
      }
    };

    const open = (
      msg: string,
      cb: (is_pass: BooleanType, msg: string, date?: string) => Promise<boolean>,
      accoiuntPeriod = false,
    ) => {
      if (accoiuntPeriod) {
        queryAccountPeriod();
      }
      accountDate.value = undefined;
      shouldAccoiuntPeriod.value = accoiuntPeriod;
      reverse_reason.value = msg;
      reverse_back_reason.value = '';
      is_pass.value = BooleanType.YES;
      callback.value = cb;
      setVisible(true);
    };

    const close = () => {
      reverse_reason.value = '';
      reverse_back_reason.value = '';
      callback.value = null;
      setVisible(false);
    };
    const billPeriodSaveLoading = ref(false);
    const onBillPeriodHaandler = async (date: string) => {
      billPeriodSaveLoading.value = true;
      const result = await callback.value?.(is_pass.value, reverse_back_reason.value, date);
      billPeriodSaveLoading.value = false;
      if (result) {
        reverse_reason.value = '';
        billPeriodRef.value?.close();
        setVisible();
      }
    };

    const accountDate = ref<string | undefined>(undefined);
    const disabledMonth = ref<number[] | undefined>(undefined);

    const queryAccountPeriod = async () => {
      const res = await QueryAccountPeriod({
        num: 1000,
        page_num: 1,
        account_month: undefined,
        effective_month: '2021-01',
        // effective_month: moment().subtract(1, 'year').format('yyyy-MM'),
      });
      if (res.data.success) {
        disabledMonth.value =
          res.data.data.data.map(el => {
            return el.period_date_start || 0;
          }) || [];
      }
    };

    const pickerOptions = {
      disabledDate(time: any) {
        const minMoment = moment('2021-01');
        const maxMoment = moment();
        const date = moment(time);
        if (date.isBefore(minMoment, 'month') || date.isAfter(maxMoment, 'month')) {
          return true;
        }
        return disabledMonth.value?.find(el => {
          if (el) {
            return moment(el * 1000).isSame(date, 'month');
          }
        });
      },
    };

    const onAccountDateChange = (date: string) => {
      ctx.emit('accountDateChange', date);
    };

    return {
      visible,
      billPeriodRef,
      open,
      close,
      is_pass,
      reverse_reason,
      reverse_back_reason,
      onRefuse,
      onConfirm,
      isConfirmBtnDisabled,
      onBillPeriodHaandler,
      accountDate,
      onAccountDateChange,
      pickerOptions,
      shouldAccoiuntPeriod,
      billPeriodSaveLoading,
    };
  },
});
