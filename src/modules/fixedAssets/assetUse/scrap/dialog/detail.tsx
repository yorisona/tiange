import { ref, defineComponent, h } from '@vue/composition-api';
import { comonColumn } from '@/modules/fixedAssets/use';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>({});
    const show = (val: any) => {
      formData.value = val;
    };
    const close = () => {
      ctx.emit('close');
    };
    return {
      formData,
      show,
      close,
      columns: comonColumn.slice(0, 3),
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form class="from-wrap" model={this.formData}>
        <el-form-item label="报废原因：">
          <span style="color:var(--text-color)">
            {E.fixedassets.reasonForScrappingMap.get(formData.scrapped_reason)}
          </span>
        </el-form-item>
        <el-form-item label="报废说明：">
          <span style="color:var(--text-color)">{formData.scrapped_explai ?? '--'}</span>
        </el-form-item>
        <el-form-item>
          <div class="mgb-6">报废明细：</div>
          <tg-table
            border
            class="mgb-6"
            data={formData.scrapped_relation_list}
            columns={[
              ...this.columns,
              {
                label: '报废金额 (元)',
                align: 'right',
                prop: 'scrapped_amount',
                dataType: {
                  type: 'money',
                  unit: 100,
                  toFixed: 2,
                },
              },
              {
                label: '报废类型',
                align: 'center',
                prop: 'scrapped_type',
                dataType: {
                  type: 'enum',
                  enum: E.fixedassets.ScrappedTypeEnumMap,
                },
              },
            ]}
          >
            <template slot="empty">
              {/* <span>暂无数据</span> */}
              <fragments></fragments>
            </template>
          </tg-table>
        </el-form-item>
        <el-form-item label="附件：" class="label-start">
          <div class="file-box">
            {formData.file_urls?.length > 0
              ? formData.file_urls.map((i: any) => (
                  <file-item
                    limitNameWidth={80}
                    // showPreview={false}
                    filepath={i}
                    readonly={true}
                  />
                ))
              : '--'}
          </div>
        </el-form-item>
        <el-form-item label="备注：">
          <span>{formData.remark ?? '--'}</span>
        </el-form-item>
      </el-form>
    );
  },
});
