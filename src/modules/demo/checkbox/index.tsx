import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  setup() {
    const d1checked = ref(false);
    return {
      d1checked,
    };
  },
  // render() {
  //   return (
  //     <div class="demo">
  //       <h3>CheckBox 组件</h3>
  //       <div class="preview">
  //         <div>
  //           <div class="label">未选择</div>
  //           <tg-checkbox v-model={this.checked} />
  //         </div>
  //         <div>
  //           <div class="label">已选择</div>
  //           <tg-checkbox checked={true} />
  //         </div>
  //         <div>
  //           <div class="label">已选择</div>
  //           <tg-checkbox checked={true} />
  //         </div>
  //         <div>
  //           <div class="label">已选择</div>
  //           <tg-checkbox checked={true} />
  //         </div>
  //         <div>
  //           <div class="label">已选择</div>
  //           <tg-checkbox checked={true} />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // },
});
