import { ref, defineComponent, h, nextTick } from '@vue/composition-api';
import QrcodeVue from 'qrcode.vue';
export default defineComponent({
  components: { QrcodeVue },
  setup(props, ctx) {
    const formData = ref<any>({
      asset_code: '',
      asset_name: '',
    });
    const show = (val: any | any[]) => {
      formData.value = Array.isArray(val) ? val : [val];
      console.log(formData.value, 'formData.value');
    };
    const close = () => {
      ctx.emit('close');
    };
    const iframeRef = ref<HTMLIFrameElement>(null as any);
    // const qrcodeRef = ref<any>(null as any);
    const qrcodeRefs = ref<Array<Element | null>>(null as any);
    const onSaveBtnClick = async () => {
      await nextTick();
      const iframe = iframeRef.value;
      const iframeWindow = iframe.contentWindow as any;
      iframeWindow.document.body.innerHTML = '';
      // iframeWindow.document.body.appendChild(
      //   document.querySelector('.print-wrap_card_box')!.cloneNode(true),
      // );

      const printWrapCardBoxes = document.querySelectorAll('.print-wrap_card_box');
      for (let i = 0; i < printWrapCardBoxes.length; i++) {
        const printWrapCardBox = printWrapCardBoxes[i];
        const qrcodeRef = ctx.refs['qrcodeRefs' + i] as any;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        div.style.height = '100%';
        div.appendChild(printWrapCardBox.cloneNode(true));
        iframeWindow.document.body.appendChild(div);
        //插入分页符
        // if (i !== printWrapCardBoxes.length - 1) {
        //   const pageBreak = document.createElement('div');
        //   pageBreak.style.pageBreakAfter = 'always';
        //   iframeWindow.document.body.appendChild(pageBreak);
        // }

        const qrcode = iframeWindow.document.querySelectorAll('.qrcode') as any;
        console.log(qrcode, 'qrcode');

        qrcode[i].innerHTML = '';
        // base64图片
        const img = new Image();
        img.src = qrcodeRef.querySelector('canvas').toDataURL('image/png');
        qrcode[i].appendChild(img);
      }
      // const qrcode = iframeWindow.document.querySelector('.qrcode') as any;
      // qrcode.innerHTML = '';
      //样式
      const style = document.createElement('style');
      style.innerHTML = `
      html,
      body {
      margin: 0;
      }
      .main {
        font-size: 6pt;
        /*border: solid 1px red;*/
      }
      .print-wrap_card_box {
        box-sizing: border-box;
        border: 0.5px solid #19232d;
        display: flex;
        overflow: hidden;
        height: 14mm;
        width: 46mm;
      }
      .print-wrap_card_box .text_box {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        flex: 1 1 0;
      }
      .print-wrap_card_box .text_box span {
        font-weight: 600;
        font-size: 8px;
        color: #19232d;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 30mm;
        text-align: center;
      }
      .qrcode {
        border-left: 0.5px solid #19232d;
        flex: 0 0 10mm;
        padding: 1mm;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img{
        width: 10mm;
        height: 10mm;
      }
      .print-wrap_card_box {
        page-break-after: always;
      }
      `;
      iframeWindow.document.head.appendChild(style);
      // // base64图片
      // const img = new Image();
      // img.src = qrcodeRef.value.querySelector('canvas').toDataURL('image/png');
      // qrcode.appendChild(img);

      setTimeout(() => {
        iframeWindow.print();
      }, 0);
    };
    return {
      formData,
      show,
      close,
      iframeRef,
      qrcodeRefs,
      onSaveBtnClick,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="print-wrap">
        <iframe ref="iframeRef" style="display: none;"></iframe>
        <div class="print-wrap_card">
          {formData.map((v: any, index: any) => (
            <div key={index} class="print-wrap_card_box">
              <div class="text_box">
                <span>GOUMEE 构美</span>
                <span>{v.asset_name}</span>
                <span>{v.asset_code}</span>
              </div>
              <div class="qrcode" ref={`qrcodeRefs${index}`}>
                <qrcode-vue
                  value={`${v.asset_code}`}
                  size="80"
                  level="H"
                  style="width: 100%; height:100%"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
