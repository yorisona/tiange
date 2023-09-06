/**
 * 对话框
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 17:13:25
 */
import { createApp, defineComponent, h, PropType, reactive } from '@vue/composition-api';
import { CreateElement, PluginObject, VueConstructor } from 'vue';
import Dialog from './dialog';
import { DialogProperties } from '@/types/components/dialog';
import { isPromise } from '@/utils/promise';
import { emptyFunc, ObjectFilterEmpty } from '@/utils/func';
import { VNode } from 'vue';

const defProps: DialogProperties = {
  title: '',
  visible: false,
  content: undefined,
  confirmText: '确认',
  cancelText: '取消',
  onConfirm: () => true,
  onCancel: () => void 0,
  showCancelBtn: true,
};

const newInstance = (properties: DialogProperties) => {
  const DialogInstance = defineComponent({
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
      /** 内容:string/vnode */
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
      /** 确认回调 */
      onConfirm: {
        type: Function as PropType<() => boolean | void | PromiseLike<boolean>>,
      },
      /** 取消回调 */
      onCancel: {
        type: Function as PropType<() => void | PromiseLike<any>>,
      },
      /** 是否显示取消按钮 */
      showCancelBtn: {
        type: Boolean,
        default: true,
      },
      /** 是否显示关闭按钮 **/
      showClose: {
        type: Boolean,
        default: () => false,
      },
    },
    setup(props) {
      const state = reactive<DialogProperties>({
        ...defProps,
        ...ObjectFilterEmpty(props),
      });

      return { state };
    },
    methods: {
      toggleVisible(visible: boolean | undefined = false) {
        this.state.visible = visible;
      },
    },
    render() {
      const { state }: { state: DialogProperties } = this;
      return h('tg-dialog', { props: { ...state } });
    },
  });

  const instance = createApp({
    render(h: CreateElement) {
      const { onConfirm, onCancel, ...rest } = properties;

      const props = {
        props: {
          ...rest,
          onConfirm: async (value: any) => {
            if (value !== 'close') {
              const fn = onConfirm ?? emptyFunc;
              const result = fn();

              isPromise(result) ? await result.then() : result;
            }

            this.$children[0].toggleVisible();
            instance.$el.remove();
          },
          onCancel: async () => {
            const fn = onCancel ?? emptyFunc;
            const result = fn();

            isPromise(result) ? await result.then() : '';

            this.$children[0].toggleVisible();
            instance.$el.remove();
          },
        },
      };

      return h(DialogInstance, props);
    },
  }).mount();

  document.body.appendChild(instance.$el);
  const dialog = instance.$children[0];

  return {
    show() {
      dialog.toggleVisible(true);
    },
    close() {
      dialog.toggleVisible();
      dialog.$el.remove();
    },
    remove() {
      //
    },
    component: dialog,
  };
};

export const $TDialog = (options: DialogProperties | string) => {
  const DialogOptions =
    typeof options === 'string'
      ? {
          title: options,
          visible: false,
        }
      : options;

  const instance = newInstance(DialogOptions);

  instance.show();

  return instance;
};

const SIMPLE_DIALOG_CONFIRM_TEXT = '我知道了';

export default {
  install: (vue: VueConstructor) => {
    vue.component(Dialog.name, Dialog);
    vue.prototype.$TDialog = $TDialog;
    vue.prototype.$SimpleTDialog = (
      title: string,
      confirmText: string = SIMPLE_DIALOG_CONFIRM_TEXT,
    ) =>
      $TDialog({
        title,
        showCancelBtn: false,
        confirmText,
      });
  },
} as PluginObject<undefined>;
