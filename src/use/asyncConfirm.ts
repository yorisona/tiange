/**
 * 异步的二次确认封装
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-11 15:39:51
 */
import { ComponentRenderProxy, SetupContext } from '@vue/composition-api';
import { VNode } from 'vue';
import { $TDialog } from '@/components/Dialog';

/**
 * @deprecated
 * 二次确认(参数调整更新版)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-19 15:48:14
 */
export const AsyncConfirm = (
  ctx: SetupContext | { root: ComponentRenderProxy },
  options:
    | string
    | {
        title: string;
        confirmText?: string;
        cancelText?: string;
        content?: string | (() => VNode);
      },
): Promise<boolean> => {
  const dialogOptions = typeof options === 'string' ? { title: options } : options;

  return new Promise(resolve => {
    ctx.root.$TDialog({
      ...dialogOptions,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
};

export const Confirm = (
  options:
    | string
    | {
        title: string;
        confirmText?: string;
        cancelText?: string;
        content?: string | (() => VNode);
        showClose?: boolean;
        showCancelBtn?: boolean;
      },
) => {
  const dialogOptions = typeof options === 'string' ? { title: options } : options;
  return new Promise<boolean>((resolve, reject) => {
    $TDialog({
      ...dialogOptions,
      onConfirm: () => resolve(true),
      onCancel: () => reject(),
    });
  });
};
