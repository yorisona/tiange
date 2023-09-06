import { ElNotification as BaseNotification } from 'element-ui';
import { TDialogInstance } from '@/types/components/dialog';

declare module 'vue/types/vue' {
  type ElNotification = BaseNotification & {
    closeAll(): void;
  };

  interface Vue {
    $notify: ElNotification;
    $TDialog: TDialogInstance;
    $SimpleTDialog: (title: string, confirmText?: string) => TDialogInstance;
    toggleVisible(visible?: boolean): void;
  }
}
