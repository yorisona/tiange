import { reactive, ref, provide, nextTick, onUnmounted } from '@vue/composition-api';
import Vue, { Component } from 'vue';
import store from '@/store';

export interface IUseDialogConfig extends Record<string, any> {
  props?: Record<string, any>;
  on?: Record<string, any>;
  provide?: Record<string, any>;
  component?: Component | string;
  width?: string;
  class?: string;
  footer?: boolean;
  title?: string;
  okText?: string;
  cancelText?: string;
  disabledOK?: boolean;
  data?: any;
}

type IUseDialogResult<T> = {
  show: TG.anyFunc;
  class?: string;
  close: TG.emptyFunc;
  update: (config: T) => IUseDialogResult<T>;
  props: (value: any) => IUseDialogResult<T>;
  config: T;
  on: (eventName: string, fn: TG.anyFunc, rewrite: boolean) => IUseDialogResult<T>;
  emit: (eventName: string, ...args: any[]) => void;
};
export type IUseDialog<T extends IUseDialogConfig = Record<string, any>> = (
  config: T,
) => IUseDialogResult<T>;

let useDialogId = 1;
const createDialogContainer = () => {
  const div = document.createElement('div');
  div.id = `dialog_${useDialogId++}`;
  document.body.appendChild(div);
  return div;
};

const empty = new Function();
const appendEvents = (
  _uEvents: Record<string, any> | undefined,
  appendEvents: Record<string, any>,
) => {
  let uEvents = _uEvents as NonNullable<typeof _uEvents>;
  if (uEvents === undefined) uEvents = {};
  Object.keys(appendEvents).forEach(key => {
    const oriEvent = uEvents[key] || empty;
    const appendEvent = appendEvents[key];
    uEvents[key] = (...args: any) => {
      if (appendEvent(...args) !== false) {
        return oriEvent(...args);
      }
    };
  });
  return uEvents;
};

// 弹框
export const useDialog: IUseDialog = (config = {}) => {
  const vm = ref();

  const dialogProps = reactive({
    visible: false,
    title: undefined,
    width: undefined,
    footer: true,
    okText: '提交',
    cancelText: '取消',
    disabledOK: true,
  });
  const destroyed = ref(true);
  if (typeof config.width === 'number') {
    config.width = `${config.width}px`;
  }

  const transformConfig = (config: IUseDialogConfig) => {
    Object.keys(config).forEach(key => {
      if (dialogProps.hasOwnProperty.call(dialogProps, key)) {
        // @ts-ignore
        dialogProps[key] = config[key];
      }
    });
  };
  transformConfig(config);

  const onBind = ref<any>(
    appendEvents(config.on, {
      close() {
        dialogProps.visible = false;
      },
      updateDialog(config = {}) {
        transformConfig(config);
      },
    }),
  );

  const onSaveBtnClick = () => {
    const dialogRef = (vm.value.$refs && vm.value.$refs.dialogRef) || {};
    if (dialogRef.dialogSubmit) dialogRef.dialogSubmit();
    else if (dialogRef.onSaveBtnClick) dialogRef.onSaveBtnClick();
    else {
      console.log('子组件没有dialogSubmit或onSaveBtnClick');
    }
  };

  vm.value = new Vue({
    el: createDialogContainer(),
    store,
    setup() {
      if (config.provide !== undefined) {
        Object.keys(config.provide).forEach(key => {
          provide(key, (config.provide as any)[key]);
        });
      }
    },
    render(h) {
      if (!destroyed.value) return undefined as any;
      if (!dialogProps.visible) return undefined as any;
      // 这里很多弹框属性没封装,后期自行扩展
      return (
        <el-dialog
          class={`customer-dialog el-dialog-center-rewrite tg-body-container ${config.class}`}
          props={dialogProps}
          append-to-body={true}
          close-on-click-modal={false}
          close-on-press-escape={false}
          wrapperClosable={false}
          on={onBind.value}
          isDialog={true}
        >
          {dialogProps.visible &&
            h(config.component, {
              ref: 'dialogRef',
              props: {
                ...config.props,
                isDialog: true,
              },
              on: onBind.value,
            })}
          {dialogProps.footer && (
            <fragments slot="footer">
              <tg-button onClick={() => (dialogProps.visible = false)}>
                {dialogProps.cancelText}
              </tg-button>
              {dialogProps.disabledOK && (
                <tg-button type="primary" onClick={onSaveBtnClick}>
                  {dialogProps.okText}
                </tg-button>
              )}
            </fragments>
          )}
        </el-dialog>
      );
    },
  });

  const show = (...args: any) => {
    if (dialogProps.visible) return;
    dialogProps.visible = true;
    nextTick(() => {
      const dialogRef = vm.value.$refs && vm.value.$refs.dialogRef;
      if (!dialogRef) {
        console.log('未找到子组件请检查代码');
        return;
      }
      if (dialogRef.dialogShow) dialogRef.dialogShow(...args);
      else if (dialogRef.show) dialogRef.show(...args);
    });
  };

  const update = (config: IUseDialogConfig) => {
    transformConfig(config);
    return result;
  };

  const props = (value: any) => {
    config.props = value;
    return result;
  };

  const close = () => {
    dialogProps.visible = false;
  };

  /**
   * 侦听弹框事件
   * @param eventName 事件名
   * @param fn 侦听函数
   * @param rewrite 是否覆盖
   */
  const on = (eventName: string, fn: any, rewrite = false) => {
    if (rewrite === true) {
      onBind.value[eventName] = fn;
    } else {
      appendEvents(onBind.value, { [eventName]: fn });
    }
    return result;
  };

  onUnmounted(() => {
    destroyed.value = false;
    dialogProps.visible = false;
    // vm.value.$destroy();
  });

  const emit = (event: string, ...args: any[]) => {
    onBind.value[event] && onBind.value[event](...args);
  };
  const result = reactive({
    show,
    update,
    on,
    close,
    props,
    config,
    emit,
    data: config.data,
  });

  return result;
};

// 弹框
export const useDrawer: IUseDialog = (config = {}) => {
  const vm = ref();
  const dialogProps = reactive({
    visible: false,
    title: undefined,
    width: undefined,
    footer: true,
    okText: '提交',
    cancelText: '取消',
    disabledOK: true,
    props: {},
    'destroy-on-close': true,
  });
  const destroyed = ref(true);

  const transformConfig = (config: IUseDialogConfig) => {
    Object.keys(config).forEach(key => {
      if (dialogProps.hasOwnProperty.call(dialogProps, key)) {
        // @ts-ignore
        dialogProps[key] = config[key];
      }
    });
  };
  transformConfig(config);

  const onBind = ref<any>(
    appendEvents(config.on, {
      close() {
        dialogProps.visible = false;
      },
      updateDialog(config = {}) {
        transformConfig(config);
      },
      closed() {
        destroyed.value = true;
        dialogProps.visible = false;
      },
    }),
  );

  const onSaveBtnClick = () => {
    const dialogRef = (vm.value.$refs && vm.value.$refs.dialogRef) || {};
    if (dialogRef.dialogSubmit) dialogRef.dialogSubmit();
    else if (dialogRef.onSaveBtnClick) dialogRef.onSaveBtnClick();
    else {
      console.log('子组件没有dialogSubmit或onSaveBtnClick');
    }
  };

  vm.value = new Vue({
    el: createDialogContainer(),
    store,
    setup() {
      if (config.provide !== undefined) {
        Object.keys(config.provide).forEach(key => {
          provide(key, (config.provide as any)[key]);
        });
      }
    },
    render(h) {
      if (!destroyed.value) return undefined as any;
      // if (!dialogProps.visible) return undefined as any;
      // 这里很多弹框属性没封装,后期自行扩展
      const { width, ...nProps } = dialogProps;

      return (
        <el-drawer
          class={`tg-drawer-rewrite tg-drawer-use ${config.class}`}
          props={{
            ...nProps,
            size: width,
          }}
          append-to-body={true}
          close-on-click-modal={false}
          close-on-press-escape={false}
          wrapperClosable={false}
          on={onBind.value}
          isDialog={true}
        >
          <div class="tg-drawer-content">
            {dialogProps.visible &&
              h(config.component, {
                ref: 'dialogRef',
                props: {
                  ...config.props,
                  isDialog: true,
                },
                on: onBind.value,
              })}
          </div>

          {dialogProps.footer && (
            <div class="tg-drawer-footer">
              <tg-button onClick={() => (dialogProps.visible = false)}>
                {dialogProps.cancelText}
              </tg-button>
              {dialogProps.disabledOK && (
                <tg-button type="primary" onClick={onSaveBtnClick}>
                  {dialogProps.okText}
                </tg-button>
              )}
            </div>
          )}
        </el-drawer>
      );
    },
  });

  const show = (...args: any) => {
    if (dialogProps.visible) return;
    dialogProps.visible = true;
    nextTick(() => {
      const dialogRef = vm.value.$refs && vm.value.$refs.dialogRef;
      if (!dialogRef) {
        console.log('未找到子组件请检查代码');
        return;
      }
      if (dialogRef.dialogShow) dialogRef.dialogShow(...args);
      else if (dialogRef.show) dialogRef.show(...args);
    });
  };

  const update = (config: IUseDialogConfig) => {
    transformConfig(config);
    return result;
  };

  const close = () => {
    dialogProps.visible = false;
  };

  const emit = () => {};
  /**
   * 侦听弹框事件
   * @param eventName 事件名
   * @param fn 侦听函数
   * @param rewrite 是否覆盖
   */
  const on = (eventName: string, fn: any, rewrite = false) => {
    if (rewrite === true) {
      onBind.value[eventName] = fn;
    } else {
      appendEvents(onBind.value, { [eventName]: fn });
    }
    return result;
  };

  onUnmounted(() => {
    destroyed.value = false;
    dialogProps.visible = false;
    // vm.value.$destroy();
  });

  const props = (value: any) => {
    config.props = value;
    return result;
  };

  const result = reactive({
    show,
    emit,
    update,
    on,
    close,
    config,
    props,
  });

  return result;
};
