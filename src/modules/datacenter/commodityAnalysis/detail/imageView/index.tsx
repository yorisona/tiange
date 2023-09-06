import { defineComponent, ref } from '@vue/composition-api';
import defaultImage from '@/assets/img/goods-empty.png';

export default defineComponent({
  setup() {
    const dialogImage = ref();
    const show = (url: string) => {
      dialogImage.value = url;
    };
    return {
      dialogImage,
      show,
    };
  },
  render() {
    return (
      <div class="dialog-wrapper">
        <img
          src={this.dialogImage || defaultImage}
          onerror={(e: any) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
    );
  },
});
