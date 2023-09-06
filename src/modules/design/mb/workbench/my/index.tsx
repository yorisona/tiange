import { defineComponent, ref } from '@vue/composition-api';
import { ITemplateConfig, ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component';
import { Query_Owner_Integral_Goods_Exchange_Record } from '@/services/integral';
type Params = TG.PaginationParams<typeof Query_Owner_Integral_Goods_Exchange_Record>;
type List = TG.HttpListResultType<typeof Query_Owner_Integral_Goods_Exchange_Record>;
export default defineComponent({
  setup() {
    const columns: TgTableColumn<List>[] = [
      {
        label: '兑换时间',
        minWidth: 130,
        prop: 'gmt_create',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
      },
      {
        label: '商品编码',
        minWidth: 80,
        prop: 'integral_goods_id',
        align: 'center',
      },
      {
        label: '商品名称',
        minWidth: 160,
        prop: 'integral_goods_name',
        'show-overflow-tooltip': true,
      },
      {
        label: '兑换数量',
        minWidth: 80,
        prop: 'exchange_num',
        align: 'center',
      },
      {
        label: '消耗M币',
        minWidth: 100,
        prop: 'exchange_total_cost',
        align: 'center',
      },
      {
        label: '兑换状态',
        minWidth: 80,
        prop: 'status',
        align: 'center',
        dataType: {
          type: 'enum',
          enum: E.mb.RedemptionStatusMap,
        },
      },
      {
        label: '操作时间',
        minWidth: 140,
        prop: 'gmt_modified',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
        align: 'center',
        formatter(row) {
          if (row.operator_name === null) return '--';
          return row.gmt_modified.replace(/-/g, '.');
        },
      },
      {
        label: '操作人',
        minWidth: 80,
        prop: 'operator_name',
      },
    ];
    const formDataInit = () => {
      return {
        integral_goods_id: undefined,
        integral_goods_name: undefined,
        exchange_status: undefined,
      } as any;
    };
    const formData = ref<Params>(formDataInit());
    const reqList = usePagination(Query_Owner_Integral_Goods_Exchange_Record);
    const config: ITemplateConfig = {
      reset() {
        formData.value = formDataInit();
      },
      emptyText: '暂无兑换记录，快去商城看看吧～',
      onKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          reqList.run(reqList.params[0], formData.value);
        }
      },
    };
    return { columns, reqList, formData, config };
  },
  render() {
    const { columns, reqList, formData, config } = this;
    return (
      <ListGenerallyTemplate columns={columns} service={reqList} v-model={formData} config={config}>
        <el-form-item label="商品编码：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={formData.integral_goods_id}
            placeholder="请输入商品编码"
          />
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={formData.integral_goods_name}
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="兑换状态：">
          <Select
            showAll
            // onChange={() => {
            //   reqList.run(reqList.params[0], formData);
            // }}
            placeholder="请选择兑换状态"
            v-model={formData.exchange_status}
            options={E.mb.RedemptionStatusOption}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
