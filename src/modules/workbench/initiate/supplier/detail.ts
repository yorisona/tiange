import { defineComponent, ref } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
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
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('dialog:close', success);
    };

    const handleSubmit = async () => {
      const result = await new Promise(resolve => {
        ctx.root.$TDialog({
          title: '你确定撤销吗',
          onConfirm: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });
      if (!result) {
        return;
      }
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
    };

    return {
      emitClose,
      numberFormat,
      saveLoading,
      handleSubmit,
    };
  },
});
