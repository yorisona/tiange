import { TgTableColumn } from '@/types/vendor/column';
import { Confirm } from '@/use/asyncConfirm';
import { usePagination } from '@gm/hooks/ahooks';
import { ListGenerallyTemplate, ITemplateConfig } from '@gm/templates/list';
import { defineComponent, h, ref } from '@vue/composition-api';
import {
  Edit_Integral_Goods_Exchange_Record,
  Query_Integral_Goods_Exchange_Record,
} from '@/services/integral';
import { Message } from 'element-ui';
import { Select } from '@gm/component';
import { usePermission } from '@/use/permission';

type Col = TgTableColumn<any>;
interface QueryForm {
  integral_goods_id: string | undefined;
  exchange_status: string | undefined;
  exchange_user_name: number | undefined;
  integral_goods_name: string | undefined;
}

export default defineComponent({
  setup: (props, ctx) => {
    const permission = usePermission();
    const initQueryForm = () => ({} as any);
    const queryForm = ref<QueryForm>(initQueryForm());
    const columns = ref<Col[]>([
      {
        label: '兑换时间',
        align: 'center',
        minWidth: 130,
        prop: 'gmt_create',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
      },
      {
        label: '兑换人',
        align: 'center',
        minWidth: 80,
        prop: 'exchange_user_name',
      },
      {
        label: '商品编码',
        align: 'center',
        minWidth: 80,
        prop: 'integral_goods_id',
      },
      {
        label: '商品名称',
        align: 'left',
        minWidth: 180,
        prop: 'integral_goods_name',
        'show-overflow-tooltip': true,
      },
      {
        label: '兑换数量',
        align: 'center',
        minWidth: 80,
        prop: 'exchange_num',
      },
      {
        label: '消耗M币',
        align: 'center',
        minWidth: 90,
        prop: 'exchange_total_cost',
      },
      {
        label: '兑换状态',
        align: 'center',
        minWidth: 80,
        prop: 'status',
        dataType: {
          type: 'enum',
          enum: E.mb.RedemptionStatusMap,
        },
      },
      {
        label: '操作时间',
        align: 'center',
        minWidth: 140,
        prop: 'gmt_modified',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
        formatter(row) {
          if (row.operator_name === null) return '--';
          return row.gmt_modified.replace(/-/g, '.');
        },
      },
      {
        label: '操作人',
        align: 'center',
        minWidth: 80,
        prop: 'operator_name',
      },
      {
        label: '操作',
        align: 'center',
        width: 100,
        formatter: row => {
          const creatBtn = (text: string, callBack: (...args: any) => void) => {
            return h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click() {
                    callBack();
                  },
                },
              },
              text,
            );
          };

          const completeBtn = creatBtn('完成', async () => {
            await Confirm('确定完成此次兑换记录吗?');
            Edit_Integral_Goods_Exchange_Record({
              id: row.id,
              status: E.mb.RedemptionStatus.COMPLETED,
            })
              .then(res => {
                if (!res.data.success) throw new Error(res.data.message);
                Message.success('操作成功');
              })
              .then(() => {
                reqList.reload();
              })
              .catch(e => {
                Message.error(e.message);
              });
          });

          const sendBackBtn = creatBtn('退回', async () => {
            await Confirm('确定退回此次兑换记录吗？');
            Edit_Integral_Goods_Exchange_Record({
              id: row.id,
              status: E.mb.RedemptionStatus.RETURNED,
            })
              .then(res => {
                if (!res.data.success) throw new Error(res.data.message);
                Message.success('操作成功');
              })
              .then(() => {
                reqList.reload();
              })
              .catch(e => {
                Message.error(e.message);
              });
          });
          const isOrder = E.mb.RedemptionStatus.ORDERED === row.status;
          const hasEdit = permission.mb_goodexchange_record_edit_;
          return h(
            'div',
            {
              class: 'operator-btns',
            },
            [isOrder && hasEdit && completeBtn, isOrder && hasEdit && sendBackBtn],
          );
        },
      },
    ]);

    const reqList = usePagination(Query_Integral_Goods_Exchange_Record);

    const config: ITemplateConfig = {
      reset() {
        queryForm.value = initQueryForm();
      },
      emptyText: '暂无兑换记录~',
      showExport: true,
      exportURL: '/api/integral_m/export_integral_goods_exchange_record',
      table: {
        border: true,
      },
      onKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          reqList.run(reqList.params[0], queryForm.value as any);
        }
      },
    };
    return {
      reqList,
      queryForm,
      columns,
      config,
    };
  },
  render() {
    const { config } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        v-model={this.queryForm}
        config={this.config}
        service={this.reqList}
      >
        <el-form-item label="商品编码：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={this.queryForm.integral_goods_id}
            placeholder="请输入商品编码"
          />
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={this.queryForm.integral_goods_name}
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="兑换人：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={this.queryForm.exchange_user_name}
            placeholder="请输入兑换人"
          />
        </el-form-item>
        <el-form-item label="兑换状态：">
          <Select
            // onChange={() => {
            //   reqList.run(reqList.params[0], queryForm as any);
            // }}
            v-model={this.queryForm.exchange_status}
            options={E.mb.RedemptionStatusOption}
            placeholder="请选择兑换状态"
          />
        </el-form-item>
        {/*<div slot="btnLine">*/}
        {/*  <tg-button>导出</tg-button>*/}
        {/*</div>*/}
      </ListGenerallyTemplate>
    );
  },
});
