import { computed, defineComponent, ref } from '@vue/composition-api';
import { getToken } from '@/utils/token';
import { numberFormat } from '@/utils/formatMoney';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import PaymentDialog from '@/modules/marketing/project/dialog/payment/form.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { downloadFileFromBlob } from '@/utils/func';
import { sleep } from '@/utils/func';
import { UpdateApprovalStatus } from '@/services/workbentch';
import { Decimal } from 'decimal.js-light';
import { ProjectTypeEnum } from '@/types/tiange/common';
import moment from 'moment';

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

export default defineComponent({
  name: 'advanceDetailDialog',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Appendix,
    WorkbenchTimeLine,
    PaymentDialog,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const paymentData = ref({});

    const Auth = computed(() => getToken());
    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('dialog:close', success);
    };
    const businessType = (type: number) => {
      switch (type) {
        case 1:
          return '营销业务';
        case 2:
          return '淘宝店播';
        case 3:
          return '抖音店播';
        case 5:
          return '创新项目';
        case 6:
          return '区域店播';
        case 7:
          return '本地生活';
        case 8:
          return '淘宝甄选';
        case 9:
          return '供应链';
        default:
          return '未知';
      }
    };

    const projectType = computed(() => {
      switch (props.info.business_type) {
        case 1:
          return ProjectTypeEnum.marketing;
        case 5:
          return ProjectTypeEnum.common_business;
        case 2:
        case 3:
        case 6:
          return ProjectTypeEnum.live;
        default:
          return undefined;
      }
    });

    const noTaxAmount = (amount: number, rate: number) => {
      const addRateDecimal = new Decimal(rate).dividedBy(100).plus(1);
      const amountDecimal = new Decimal(amount);
      const noTaxDecimal = amountDecimal.dividedBy(addRateDecimal);
      return noTaxDecimal.toFixed(2);
    };

    const taxAmount = (amount: number, rate: number) => {
      const rateDecimal = new Decimal(rate).dividedBy(100);
      const amountDecimal = new Decimal(amount);
      const taxAmountDecimal = amountDecimal.dividedBy(rateDecimal.plus(1)).times(rateDecimal);
      return taxAmountDecimal.toFixed(2);
    };

    const downloadBtnClick = async (filepath: string) => {
      const filename = decodeURIComponent(filepath.split('/')[filepath.split('/').length - 1]);
      fetch(filepath, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            downloadFileFromBlob(data, filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    const handleSubmit = async () => {
      const result = await AsyncConfirm(ctx, '你确定撤销吗?');
      if (result) {
        saveLoading.value = true;
        const payload = {
          approval_id: props.info.approval_id,
          update_code: 4,
        };
        const [{ data: response }, _] = await Promise.all([
          await UpdateApprovalStatus(payload),
          await sleep(200),
        ]);
        saveLoading.value = false;
        if (response.success) {
          emitClose();
          ctx.emit('reload:refund', true);
          ctx.root.$message.success('撤销成功');
        } else {
          ctx.root.$message.error(response.message ?? '撤销失败');
        }
      }
    };
    const reSubmit = async () => {
      const result = await AsyncConfirm(ctx, '你确定重新提交吗?');
      if (result) {
        edit.value = true;
        if (props.info.business_type !== 5) {
          paymentData.value = {
            project_name: props.info.project_name,
            project_id: props.info.project_id,
            business_type: props.info.business_type,
            brand_name: props.info.brand_name,
            brand_id: props.info.brand_id,
          };
        } else {
          paymentData.value = {
            project_name: props.info.project_name,
            project_id: props.info.id,
            business_type: props.info.business_type,
          };
        }
      }
    };

    const reClose = () => {
      emitClose();
      ctx.emit('reload:refund', true);
    };
    const expenseTypeList = [
      {
        label: '主播成本',
        value: '999997',
      },
      {
        label: '投放成本',
        value: '999996',
      },
      {
        label: '营销/商广',
        value: '999995',
      },
      {
        label: '其它成本',
        value: '999994',
      },
    ];
    const getExpenseTypeStr = (code: string) => {
      const find = expenseTypeList.find(item => {
        console.log('----', code, item.value);
        return code + '' === item.value;
      });
      return find ? find.label : '--';
    };
    return {
      getExpenseTypeStr,
      Auth,
      emitClose,
      businessType,
      noTaxAmount,
      taxAmount,
      numberFormat,
      downloadBtnClick,
      saveLoading,
      handleSubmit,
      edit,
      reSubmit,
      paymentData,
      reClose,
      projectType,
      moment,
    };
  },
});
