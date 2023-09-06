import { defineComponent, ref } from '@vue/composition-api';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import refundDialog from '@/modules/marketing/project/dialog/refund/form.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { numberFormat } from '@/utils/formatMoney';
import { UpdateApprovalStatus } from '@/services/workbentch';
import { sleep } from '@/utils/func';

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
    refundDialog,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const refundRow = ref({
      achievement_id: props.info.achievement_id,
      achievement_uid: props.info.achievement_uid,
      project_name: props.info.project_name,
      gather_amount: props.info.gather_amount,
      project_id: props.info.project_id,
      business_type: props.info.business_type,
    });
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

    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('dialog:close', success);
    };

    const reSubmit = async () => {
      const result = await AsyncConfirm(ctx, '你确定重新提交吗?');
      if (result) {
        edit.value = true;
      }
    };

    const reClose = () => {
      emitClose();
      ctx.emit('reload:refund', true);
    };

    return {
      saveLoading,
      emitClose,
      handleSubmit,
      numberFormat,
      edit,
      reClose,
      reSubmit,
      refundRow,
    };
  },
});
