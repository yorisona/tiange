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
import { ProjectTypeEnum, SettlementCycleTypeMap } from '@/types/tiange/common';
import moment from 'moment';
import formatData from '@/utils/formatData';
import addProject from '@/modules/live/project/dialog/addProject/index.vue';
import { useDialog } from '@/use/dialog';
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
    const info = ref();
    const show = (value: any) => {
      const newValue: any = {
        ...value,
      };
      const approval_detail = { ...newValue.approval_detail };
      newValue.approval_detail = approval_detail;

      approval_detail.start_date = moment(approval_detail.start_date * 1000).format('YYYY-MM-DD');
      approval_detail.end_date = moment(approval_detail.end_date * 1000).format('YYYY-MM-DD');
      approval_detail.estimated_data.estimated_data_list.forEach((item: any) => {
        item.date = moment(item.date).format('YYYY.MM');
        // item.gmv = formatData.formatPriceFormYuan(item.gmv, 2, true);
        // item.income = formatData.formatPriceFormYuan(item.income, 2, true);
        // item.cost = formatData.formatPriceFormYuan(item.cost, 2, true);
      });
      // approval_detail.estimated_data.total_gmv = formatData.formatPriceFormYuan(
      //   approval_detail.estimated_data.total_gmv,
      //   2,
      //   true,
      // );
      // approval_detail.estimated_data.total_income = formatData.formatPriceFormYuan(
      //   approval_detail.estimated_data.total_income,
      //   2,
      //   true,
      // );
      // approval_detail.estimated_data.total_cost = formatData.formatPriceFormYuan(
      //   approval_detail.estimated_data.total_cost,
      //   2,
      //   true,
      // );
      info.value = newValue;
      if (newValue.approval_status === 3) {
        ctx.emit('updateDialog', {
          disabledOK: true,
          okText: '重新提交',
        });
      }
    };

    const dialogSubmit = async () => {
      const result = await AsyncConfirm(ctx, '你确定重新申请吗?');
      if (result) {
        const addDialog = useDialog({
          component: addProject,
          title: '项目立项审批',
          footer: false,
          on: {
            submit() {
              ctx.emit('close');
            },
          },
        });
        addDialog.show(info.value.approval_detail);
        // ctx.emit('close');
      }
    };

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
      switch (info.value.business_type) {
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
          approval_id: info.value.approval_id,
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
        if (info.value.business_type !== 5) {
          paymentData.value = {
            project_name: info.value.project_name,
            project_id: info.value.project_id,
            business_type: info.value.business_type,
            brand_name: info.value.brand_name,
            brand_id: info.value.brand_id,
          };
        } else {
          paymentData.value = {
            project_name: info.value.project_name,
            project_id: info.value.id,
            business_type: info.value.business_type,
          };
        }
      }
    };

    const reClose = () => {
      emitClose();
      ctx.emit('reload:refund', true);
    };

    return {
      formatData,
      show,
      dialogSubmit,
      info,
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
      SettlementCycleTypeMap,
    };
  },
});
