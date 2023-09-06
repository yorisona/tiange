/**
 * 对话框
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 17:43:52
 */
export interface DialogProperties {
  title: string;
  visible?: boolean;
  /** 确认按钮文本 */
  confirmText?: string;
  content?: string | (() => VNode);
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onConfirm?: (...args: any[]) => boolean | void | PromiseLike<boolean>;
  /** 取消回调 */
  onCancel?: () => void | PromiseLike<any>;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 是否可通过点击遮罩层关闭 */
  maskClosable?: boolean;
  /** 是否显示取消按钮 */
  showCancelBtn?: boolean;
}

export interface TDialogInstance {
  (options: DialogProperties | string): {
    show(): void;
    close(): void;
    remove(): void;
    component: TDialogInstance;
  };
}
