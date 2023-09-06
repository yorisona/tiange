/**
 * 对话框
 * 简单的固定场景的模态框
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 17:09:51
 */
import { VNode } from 'vue';
import { computed, defineComponent, onMounted, PropType, ref, watch } from '@vue/composition-api';
import { isPromise } from '@/utils/promise';
import store from '@/store';
import type { ConfirmDialogSetting } from '@/store/modules/global';

export default defineComponent({
  name: 'TgDialog',
  props: {
    /** 是否可见 */
    visible: {
      type: Boolean,
      default: false,
    },
    /** 标题 */
    title: {
      type: String,
      default: '',
    },
    content: {
      type: [String, Function] as PropType<string | (() => VNode)>,
    },
    /** 确认按钮文本 */
    confirmText: {
      type: String,
    },
    /** 取消按钮文本 */
    cancelText: {
      type: String,
    },
    /** 是否显示关闭按钮 **/
    showClose: {
      type: Boolean,
      default: () => false,
    },
    /** 确认回调 */
    onConfirm: {
      type: Function as PropType<(...args: any[]) => boolean | void | PromiseLike<boolean>>,
      default: () => () => void 0,
    },
    /** 取消回调 */
    onCancel: {
      type: Function as PropType<() => void | PromiseLike<any>>,
      default: () => () => void 0,
    },
    /** 是否显示取消按钮 */
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    /** 取消按钮加载中 */
    const cancelLoading = ref(false);
    /** 确认按钮加载中 */
    const confirmLoading = ref(false);

    /** 全局确认对话框设置 */
    const confirmDialogSetting = computed<ConfirmDialogSetting>(
      () => store.getters['global/confirmDialogSetting'],
    );

    /** 启用快捷键且显示在按钮上 */
    const enableConfirmDialogHotkeyShowInButton = computed(
      () =>
        confirmDialogSetting.value.enableConfirmDialogHotkey &&
        confirmDialogSetting.value.enableConfirmDialogHotkeyShowInButton,
    );

    /** 最终的确认按钮文本 */
    const finalConfirmText = computed(() =>
      enableConfirmDialogHotkeyShowInButton.value ? `${props.confirmText}(Y)` : props.confirmText,
    );

    /** 最终的取消按钮文本 */
    const finalCancelText = computed(() =>
      enableConfirmDialogHotkeyShowInButton.value ? `${props.cancelText}(N)` : props.cancelText,
    );

    return {
      cancelLoading,
      confirmLoading,
      confirmDialogSetting,
      finalConfirmText,
      finalCancelText,
    };
  },
  render(h) {
    const VNodeDialogMask = h('div', { class: 'tg-dialog-mask' });

    /** 取消按钮点击回调 */
    const onCancelBtnClick = async () => {
      const result = this.onCancel();

      this.cancelLoading = true;
      isPromise(result) ? await result.then() : '';
      this.cancelLoading = false;
    };

    /** 确认按钮点击回调 */
    const onConfirmBtnClick = async () => {
      const result = this.onConfirm();

      this.confirmLoading = true;
      isPromise(result) ? await result.then() : '';
      this.confirmLoading = false;
    };
    /** 点击关闭 */
    const onCloseBtnClick = async () => {
      const result = this.onConfirm('close');
      isPromise(result) ? await result.then() : '';
    };
    const cancelBtn = this.showCancelBtn
      ? [
          h('tg-button', {
            domProps: {
              innerText: this.finalCancelText,
            },
            on: {
              click: onCancelBtnClick,
            },
          }),
        ]
      : [];

    const dialogInnerNodes = [<div class="tg-dialog-title">{this.title}</div>];

    if (this.content !== undefined && this.content !== '') {
      const content = typeof this.content === 'string' ? this.content : this.content();
      dialogInnerNodes.push(<div class="tg-dialog-content">{content}</div>);
    }

    dialogInnerNodes.push(
      h('div', { class: 'tg-dialog-btns' }, [
        ...cancelBtn,
        h('tg-button', {
          attrs: {
            type: 'primary',
          },
          domProps: {
            innerText: this.finalConfirmText,
          },
          on: {
            click: onConfirmBtnClick,
          },
        }),
      ]),
    );

    const VNodeDialog = (
      <div
        class={[
          'tg-dialog',
          this.content !== undefined && this.content !== '' ? 'title-content-both' : 'title-only',
        ]}
      >
        {this.showClose && (
          <button type="button" class="el-dialog__headerbtn" onClick={onCloseBtnClick}>
            <i class="el-dialog__close el-icon el-icon-close" />
          </button>
        )}
        {dialogInnerNodes}
      </div>
    );

    const onWindowKeyup = (event: KeyboardEvent) => {
      if (!this.confirmDialogSetting.enableConfirmDialogHotkey) {
        return;
      }

      if (event.code === 'KeyY') {
        // Y键确认(Yes)
        onConfirmBtnClick();
      } else if (event.code === 'KeyN') {
        // N键取消(No)
        onCancelBtnClick();
      }
    };

    watch(
      () => this.visible,
      next => {
        if (!next) {
          window.document.removeEventListener('keyup', onWindowKeyup);
        }
      },
    );

    onMounted(() => {
      window.document.addEventListener('keyup', onWindowKeyup);
    });

    return (
      <div class="tg-dialog-wrapper" style={this.visible ? {} : { display: 'none' }}>
        {[VNodeDialog, VNodeDialogMask]}
      </div>
    );
  },
});
