import { TgTableColumn } from '@/types/vendor/column';
import { defineComponent, ref } from '@vue/composition-api';
import { usePagination } from '@gm/hooks/ahooks';
import {
  Query_Integral_M_Exchange_Record,
  Query_Owner_Integral_M_Exchange_Record,
} from '@/services/integral';
import { IGPageQuery } from '@/types/tiange/general';

type Col = TgTableColumn<any>;

export default defineComponent({
  setup() {
    const columns = ref<Col[]>([
      {
        label: '时间',
        align: 'center',
        prop: 'gmt_create',
        minWidth: 140,
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
      },
      {
        label: '数量',
        align: 'right',
        prop: 'm_num',
        minWidth: 60,
        dataType: {
          type: 'number',
        },
      },
      {
        label: '发放/扣除原因',
        align: 'center',
        prop: 'reason_type',
        minWidth: 120,
        showOverflowTooltip: true,
        dataType: {
          type: 'enum',
          enum: E.mb.IntegralMReasonTypeMap,
        },
      },
      {
        label: '备注',
        prop: 'comment',
        showOverflowTooltip: true,
        minWidth: 200,
        dataType: {
          type: 'text',
        },
      },
      {
        label: '操作人',
        align: 'center',
        prop: 'add_by_name',
        minWidth: 90,
        dataType: {
          type: 'text',
        },
      },
    ]);
    const type = ref<'target' | 'self'>('target');
    const Service = (pager: IGPageQuery, ...args: any[]) => {
      let func: Function;
      if (type.value === 'target') {
        func = Query_Integral_M_Exchange_Record;
      } else {
        func = Query_Owner_Integral_M_Exchange_Record;
      }
      return func(pager, ...args);
    };
    const reqList = usePagination(Service, {
      manual: true,
    });

    const show = (value: any, _type: 'target' | 'self' = 'target') => {
      type.value = _type;
      reqList.pagination.reQuery({ user_id: value?.user_id });
    };
    return {
      show,
      columns,
      reqList,
    };
  },
  render() {
    return (
      <div class="m-currency-detail-dialog">
        <tg-table
          height={'300px'}
          class
          stripe
          border
          data={this.reqList.data}
          columns={this.columns}
          pagination={this.reqList.pagination}
        >
          <template slot="empty">
            <empty-common detial-text="暂无数据" />
          </template>
        </tg-table>
      </div>
    );
  },
});
