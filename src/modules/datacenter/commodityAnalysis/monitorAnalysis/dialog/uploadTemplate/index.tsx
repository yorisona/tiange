import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
export default defineComponent({
  setup(props, ctx) {
    const indicators = ref<NPerformance.Indicators[]>([]);
    const show = (value: NPerformance.Indicators[]) => {
      indicators.value = value;
    };
    const onSaveBtnClick = (val: any) => {
      if (val.success) {
        Message.success(val.message || '导入成功');
        ctx.emit('close');
        ctx.emit('submit');
      } else {
        Message.error(val.message || '导入失败');
      }
    };
    const downTemplateUrl =
      process.env.VUE_APP_TARGET_ENV !== 'production'
        ? 'http://tiange-oss.goumee.com/dev/excel_template/商品信息导入模板.xlsx'
        : 'https://tiange-oss.goumee.com/prod/excel_template/商品信息导入模板.xlsx';
    return { onSaveBtnClick, show, downTemplateUrl };
  },
  render() {
    return (
      <div class="dialog-container">
        <div>
          <a href={this.downTemplateUrl} target="_blank">
            <tg-button>下载模板</tg-button>
          </a>
        </div>
        <div>
          <tg-upload
            action="/api/shop_live/import_sku_analysis"
            show-file-list={false}
            beforeUpload={ValidationFileUpload({
              fileSize: 100,
              extensions: ['.xls', '.xlsx'],
            })}
            success={(res: any) => {
              this.onSaveBtnClick(res);
            }}
          >
            <tg-button>上传文件</tg-button>
          </tg-upload>
        </div>
        <div style="color:var(--text-third-color);font-size:12px">
          仅支持xlsx、xls文件格式上传，文件大小不超过100MB
        </div>
      </div>
    );
  },
});
