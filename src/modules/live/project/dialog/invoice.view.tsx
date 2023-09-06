import { defineComponent, ref } from '@vue/composition-api';
import './invoice.view.less';
export default defineComponent({
  setup() {
    const img = ref(null);
    return {
      img,
    };
  },
  render(h) {
    return (
      <div class="invoice-view-container">
        <div class="content">
          <div class="img-wraper">
            <img src={this.img} />
          </div>
          <div
            class="close"
            onClick={() => {
              this.$emit('close');
            }}
          />
        </div>
      </div>
    );
  },
});
