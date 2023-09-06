import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  setup(props, ctx) {
    const visible = ref(false);
    const emitClose = (value: string = '') => {
      if (value === '') {
        visible.value = false;
      }

      setTimeout(() => {
        ctx.emit('close', value);
      }, 170);
    };
    const show = (value = true) => {
      visible.value = value;
    };
    return {
      emitClose,
      visible,
      show,
    };
  },
  render(h) {
    return (
      <el-dialog
        class="customer-dialog project-dialog"
        width="460px"
        visible={this.visible}
        title="新增项目"
        onClose={this.emitClose}
      >
        <div class="dialog-project-container">
          <div
            class="block"
            onclick={() => {
              this.emitClose('1');
            }}
          >
            <div class={`icon-contract icon-contract-0`}></div>
            <span class="text">常规直播项目</span>
          </div>
          <div
            class="block"
            onclick={() => {
              this.emitClose('2');
            }}
          >
            <div class={`icon-contract icon-contract-1`}></div>
            <span class="text">单次营销大场</span>
          </div>
        </div>
      </el-dialog>
    );
  },
});
