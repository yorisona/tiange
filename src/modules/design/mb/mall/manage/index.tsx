import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { defineComponent, h, ref } from '@vue/composition-api';
import addGoods from '../../dialog/addGoods/index.vue';
import { useDialog } from '@/use/dialog';
import { Query_Integral_Goods } from '@/services/integral';
import { Select } from '@gm/component';
import { usePermission } from '@/use/permission';
type Col = TgTableColumn<any>;
interface QueryForm {
  id?: string;
  name?: string;
  order_by_cost: number;
  is_listed: E.mb.ListingStatus;
}

export default defineComponent({
  setup: () => {
    const permission = usePermission();
    const initQueryForm = () =>
      ({
        id: undefined,
        name: undefined,
        status: undefined,
      } as any);
    const queryForm = ref<QueryForm>(initQueryForm());
    const columns = ref<Col[]>([
      {
        label: '编码',
        align: 'center',
        minWidth: 70,
        prop: 'id',
      },
      {
        label: '商品名称',
        minWidth: 190,
        prop: 'name',
      },
      {
        label: '兑换所需M币',
        align: 'center',
        minWidth: 90,
        prop: 'cost_m',
      },
      {
        label: '图片',
        align: 'center',
        minWidth: 90,
        prop: 'images',
        className: 'goods',
        formatter: row => {
          if (row.images && row.images.length === 0) return null;
          return <tg-image class="good" src={row.images[0]} />;
        },
      },
      {
        label: '商品库存',
        align: 'center',
        minWidth: 90,
        prop: 'stock_num',
        // formatter: row => {
        //   return <span>{row.stock_num + row.exchange_num}</span>;
        // },
      },
      {
        label: '已兑换数量',
        align: 'center',
        minWidth: 90,
        prop: 'exchanged_num',
      },
      {
        label: '上架状态',
        align: 'center',
        minWidth: 90,
        prop: 'is_listed',
        dataType: {
          type: 'enum',
          enum: E.mb.ListingStatusMap,
        },
      },
      {
        label: '操作',
        align: 'center',
        width: 120,
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

          const editBtn = creatBtn('编辑', () => {
            dialogEditGoods.update({ title: '编辑商品' });
            dialogEditGoods.show(row);
          });
          return h(
            'div',
            {
              class: 'operator-btns',
            },
            [permission.mb_good_edit && editBtn].filter(Boolean),
          );
        },
      },
    ]);

    const reqList = usePagination(Query_Integral_Goods);

    const dialogEditGoods = useDialog({
      component: addGoods,
      title: '新增商品',
      width: '560px',
      okText: '提交',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });

    const methods = {
      config: {
        reset() {
          queryForm.value = initQueryForm();
        },
        emptyText: '商城兑换窗口暂时关闭，请耐心等待哦~',
        table: {
          border: true,
        },
        onKeyup(event: KeyboardEvent) {
          if (event.key === 'Enter') {
            reqList.run(reqList.params[0], queryForm.value as any);
          }
        },
      },
    };
    return {
      reqList,
      queryForm,
      columns,
      dialogEditGoods,
      permission,
      ...methods,
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
        class="mall-manage"
      >
        <el-form-item label="商品编码：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={this.queryForm.id}
            placeholder="请输入商品编码"
          />
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input
            nativeOnKeyup={config.onKeyup}
            v-model={this.queryForm.name}
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="上架状态：">
          <Select
            showAll
            // onChange={() => {
            //   reqList.run(reqList.params[0], queryForm as any);
            // }}
            v-model={this.queryForm.is_listed}
            options={E.mb.ListingStatusOption}
            placeholder="请选择上架状态"
          />
        </el-form-item>
        {this.permission.mb_good_edit && (
          <div slot="btnLine">
            <tg-button
              type="primary"
              on-click={() => {
                this.dialogEditGoods.update({ title: '新增商品' });
                this.dialogEditGoods.show();
              }}
            >
              新增商品
            </tg-button>
          </div>
        )}
      </ListGenerallyTemplate>
    );
  },
});
