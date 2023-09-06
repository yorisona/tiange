import { defineComponent, ref } from '@vue/composition-api';
import QrcodeVue from 'qrcode.vue';
import { VueInstance } from '@vueuse/core';
import { Message } from 'element-ui';

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob as Blob);
    }, 'image/png');
  });
};
enum EQRCODE_TYPE {
  // 签到
  CHECKIN = 1,
  // 评价
  EVALUATE = 2,
}
export default defineComponent({
  components: { QrcodeVue },
  setup() {
    const type = ref<EQRCODE_TYPE>(EQRCODE_TYPE.CHECKIN);
    const id = ref<number>();
    const show = (showType: EQRCODE_TYPE, value: number) => {
      type.value = showType;
      id.value = value;
    };
    const qrcodeRef = ref<VueInstance>();
    const onCopy = async () => {
      const canvas = qrcodeRef.value?.$el.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return;
      if (location.protocol === 'http:') {
        Message.error('复制失败: 请在https域名中复制');
        return;
      }
      try {
        const blob = await canvasToBlob(canvas);
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        Message.success('复制成功');
      } catch (e) {
        Message.error('复制失败');
        console.error(e);
      }
    };
    return { show, type, qrcodeRef, onCopy, id };
  },
  render() {
    const { type, onCopy, id } = this;
    const typeText = type === EQRCODE_TYPE.CHECKIN ? '签到' : '评价';
    const urlType = type === EQRCODE_TYPE.CHECKIN ? 'sign' : 'evaluate';
    return (
      <div class="qrcode-box-202209021413">
        <div class="qrcode">
          <qrcode-vue
            ref="qrcodeRef"
            value={`${process.env.VUE_APP_MOBILE_BASE_API}/training/${urlType}?id=${id}`}
            size="180"
            level="H"
            style="width: 100%; height:100%"
          />
        </div>
        <div class="copy" onClick={onCopy}>
          复制二维码
        </div>
        <div class="text">请使用飞书扫码{typeText}</div>
      </div>
    );
  },
});
