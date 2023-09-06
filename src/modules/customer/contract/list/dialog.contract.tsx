import { defineComponent, ref } from '@vue/composition-api';
export interface IContractDialogOption {
  title: string;
  items: { name: string; id: any }[];
}
export default defineComponent({
  setup(props, ctx) {
    const visible = ref(false);
    const title = ref('');
    const items = ref<any[]>([]);
    const emitClose = (value: any) => {
      visible.value = false;
      setTimeout(() => {
        ctx.emit('close', value);
      }, 170);
    };
    const show = (options: IContractDialogOption) => {
      title.value = options.title;
      items.value = options.items;
      visible.value = true;
    };
    return {
      emitClose,
      title,
      visible,
      items,
      show,
    };
  },
  render(h) {
    return (
      <el-dialog
        class="customer-dialog"
        width="460px"
        visible={this.visible}
        title={this.title}
        onClose={this.emitClose}
      >
        <div class="dialog-contact-container">
          {this.items.map((item, key) => {
            return (
              <div
                class="block"
                key={key}
                onclick={() => {
                  this.emitClose(item);
                }}
              >
                <div class={`icon-contract icon-contract-${key}`}></div>
                <span class="text">{item.name}</span>
              </div>
            );
          })}
        </div>
      </el-dialog>
    );
  },
});
