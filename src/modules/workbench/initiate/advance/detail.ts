import { defineComponent, ref } from '@vue/composition-api';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import AdvanceDialog from '@/modules/workbench/initiate/advance/form.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { UpdateApprovalStatus } from '@/services/workbentch';
import { sleep } from '@/utils/func';
import { numberFormat } from '@/utils/formatMoney';

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
    AdvanceDialog,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const edit = ref<boolean>(false);
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
          ctx.emit('reload:application', true);
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
      ctx.emit('reload:application', true);
    };

    return {
      saveLoading,
      emitClose,
      handleSubmit,
      numberFormat,
      edit,
      reSubmit,
      reClose,
    };
  },
});
