/**
 * 冲销确认对话框
 * ```
 * 附带确认结果和一个文本信息
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
import { computed, defineComponent, ref } from '@vue/composition-api';
import useVisible from '@/use/visible';

/** 发起冲销对话框 */
export interface ReverseOrderDialog {
  /** 打开 */
  open: (
    /** 确认回调 */
    cb: (msg: string, reverseReceive?: boolean) => Promise<boolean>,
    /** 冲销原因 */
    reverse_reason?: string,
    /** 是否关联实收 */
    related_receive?: boolean,
  ) => void;
  close: () => void;
}

export default defineComponent({
  setup(props, ctx) {
    /** 冲销原因 */
    const reverse_reason = ref('');
    const reverseReceive = ref<boolean>();
    const callback = ref<null | ((msg: string, reverseReceive?: boolean) => Promise<boolean>)>(
      null,
    );
    const related_receive_ref = ref<boolean>();
    const { visible, setVisible } = useVisible();

    const close = () => {
      reverse_reason.value = '';
      reverseReceive.value = undefined;
      setVisible();
    };

    /** 当冲销原因为空时禁止提交 */
    const isConfirmButtonDisabled = computed(
      () =>
        reverse_reason.value.trim() === '' ||
        (related_receive_ref.value &&
          (reverseReceive.value === undefined || reverseReceive.value === null)),
    );

    const onConfirm = async () => {
      if (reverse_reason.value.trim() === '') {
        ctx.root.$message.warning('请填写冲销原因');
        return;
      }
      if (
        related_receive_ref.value &&
        (reverseReceive.value === undefined || reverseReceive.value === null)
      ) {
        ctx.root.$message.warning('请选择是否冲销实收记录');
        return;
      }

      const result = await callback.value?.(reverse_reason.value, reverseReceive.value);

      if (result) {
        reverse_reason.value = '';
        setVisible();
      }
    };

    const open = (
      cb: (msg: string, reverseReceive?: boolean) => Promise<boolean>,
      msg = '',
      related_receive?: boolean,
    ) => {
      reverse_reason.value = msg;
      callback.value = cb;
      related_receive_ref.value = related_receive;
      setVisible(true);
    };

    return {
      visible,
      open,
      reverse_reason,
      reverseReceive,
      related_receive_ref,
      close,
      onConfirm,
      isConfirmButtonDisabled,
    };
  },
});
