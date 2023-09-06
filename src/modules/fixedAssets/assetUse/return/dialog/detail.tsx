import { ref, defineComponent, h } from '@vue/composition-api';
import { comonColumn } from '@/modules/fixedAssets/use';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>({});
    const show = (val: any) => {
      formData.value = val;
      console.log(formData.value);
    };
    const close = () => {
      ctx.emit('close');
    };
    const onSaveBtnClick = async () => {
      const validate = formData.value.return_relation_list.some((i: any) => {
        return i.return_status === E.fixedassets.ReturnStatusEnum.not_returned;
      });
      if (validate) {
        ctx.root.$message.warning('请处理领用状态');
        return;
      }
      const params = formData.value.return_relation_list.map(
        ({ relation_id, return_status }: any) => ({
          relation_id,
          return_status,
        }),
      );
      ctx.emit('submit', {
        id: formData.value.id,
        asset_relation_list: params,
      });
    };
    return {
      formData,
      show,
      onSaveBtnClick,
      close,
    };
  },
  render() {
    const { formData } = this;
    const columns: any = [
      ...comonColumn,
      {
        label: '归还状态',
        align: 'center',
        prop: 'return_status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.ReturnStatusEnumMap,
        },
      },
    ];
    if (formData.return_status === E.fixedassets.ReturnStatusEnum.not_returned) {
      columns.push({
        label: '操作',
        align: 'center',
        formatter: (row: any) => {
          if (row.return_status === E.fixedassets.ReturnStatusEnum.not_returned) {
            return (
              <div>
                <tg-button
                  type="link"
                  onClick={() => {
                    row.return_status = E.fixedassets.ReturnStatusEnum.returned;
                  }}
                >
                  签收
                </tg-button>
                <tg-button
                  type="link"
                  class="mgl-6"
                  onClick={() => {
                    row.return_status = E.fixedassets.ReturnStatusEnum.rejected;
                  }}
                >
                  拒收
                </tg-button>
              </div>
            );
          } else {
            return (
              <tg-button
                type="link"
                class="mgl-6"
                onClick={() => {
                  row.return_status = E.fixedassets.ReturnStatusEnum.not_returned;
                }}
              >
                取消
              </tg-button>
            );
          }
        },
      });
    }
    return (
      <el-form class="from-wrap" model={formData}>
        <el-form-item label="申请人：">
          <span style="color:var(--text-color)">{formData.add_by_name}</span>
        </el-form-item>
        <el-form-item>
          <div class="mgb-6">归还明细：</div>
          <tg-table border data={formData.return_relation_list} columns={columns}>
            <template slot="empty">
              {/* <span>暂无数据</span> */}
              <fragments></fragments>
            </template>
          </tg-table>
        </el-form-item>
        <el-form-item label="备注：">
          <span>{formData.remark ?? '--'}</span>
        </el-form-item>
      </el-form>
    );
  },
});
