import { defineComponent, ref } from '@vue/composition-api';
import { Query_Indicator_Tag, Export_Indicator_File } from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
export default defineComponent({
  setup(props, ctx) {
    const reqTag = useRequest(Query_Indicator_Tag, {
      transform(data) {
        return data.map(it => ({
          label: it.name,
          value: it.tag_id,
        }));
      },
    });
    const reqSubmit = useRequest(Export_Indicator_File, { manual: true });
    const tag_id = ref<number>();
    const indicators = ref<NPerformance.Indicators[]>([]);
    const show = (value: NPerformance.Indicators[]) => {
      indicators.value = value;
    };
    const onSaveBtnClick = (file: string) => {
      reqSubmit.runAsync(file).then(() => {
        Message.success('批量导入成功');
        ctx.emit('close');
        ctx.emit('submit');
      });
    };
    return { reqTag, tag_id, onSaveBtnClick, show };
  },
  render() {
    return (
      <div class="dialog-container">
        <div>
          <a
            href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/%E6%8C%87%E6%A0%87%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
            target="_blank"
          >
            <tg-button>下载模板</tg-button>
          </a>
        </div>
        <div>
          <tg-upload
            action="/api/medium/upload_file"
            show-file-list={false}
            beforeUpload={ValidationFileUpload({
              fileSize: 5,
              extensions: ['.xls', '.xlsx'],
            })}
            success={(res: any) => {
              this.onSaveBtnClick(res.data.source);
            }}
          >
            <tg-button>上传文件</tg-button>
          </tg-upload>
        </div>
        <div style="color:var(--text-third-color);font-size:12px">
          仅支持xlsx、xls文件格式上传，文件大小不超过5MB
        </div>
      </div>
    );
  },
});
