import { defineComponent, ref } from '@vue/composition-api';
import QrcodeVue from 'qrcode.vue';

export default defineComponent({
  components: { QrcodeVue },
  setup() {
    const assTable = ref<any>(undefined);
    const show = (value: any) => {
      assTable.value = value;
    };
    return { show, assTable };
  },
  render() {
    const { assTable } = this;
    return (
      <div class="qrcode-box-202209021413">
        <div class="qrcode">
          <qrcode-vue
            value={`${process.env.VUE_APP_MOBILE_BASE_API}/design/detail/${assTable}/evaluate`}
            size="180"
            level="H"
            style="width: 100%; height:100%"
          />
        </div>
        <div class="text">请使用微信扫描二维码进行评价</div>
      </div>
    );
  },
});
