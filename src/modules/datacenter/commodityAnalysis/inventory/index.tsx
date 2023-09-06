import { defineComponent, ref, h } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { GetQueryDouyinReportProjects } from '@/services/datacenter';
import emptyGoods from '@/assets/img/goods-empty.png';
import addDialog from './dialog/add.vue';
import inventoryDetails from './dialog/inventoryDetails.vue';
import salesDetails from './dialog/salesDetails.vue';
import {
  AddShopLiveDouyinItemPlaceOrder,
  QueryShopLiveDouyinItemPlaceOrderReport,
  QueryShopLiveDouyinItemPlaceOrderRecord,
} from '@/services/datacenter';

const orderQuantityTable = defineComponent({
  setup(props, ctx) {
    const pageServe = ref<any>({});
    const show = (serve: any) => {
      console.log(serve, 'serve');
      serve.pagination.layout = 'total, prev, pager, next';
      pageServe.value = serve;
    };
    return {
      pageServe,
      show,
    };
  },
  render() {
    const { pageServe } = this;
    return (
      <div style="padding:16px 16px 0;">
        <tg-table
          border
          v-loading={pageServe.loading}
          max-height={'360px'}
          data={pageServe.data || []}
          pagination={pageServe.pagination}
          columns={[
            {
              label: '日期',
              prop: 'gmt_create',
              align: 'center',
              dataType: {
                type: 'date',
              },
            },
            {
              label: '下单量',
              prop: 'order_num',
              align: 'right',
            },
            {
              label: '下单人',
              prop: 'add_by_name',
              align: 'center',
            },
          ]}
        />
      </div>
    );
  },
});

export default defineComponent({
  setup: (props, ctx) => {
    const pageServe = usePagination(QueryShopLiveDouyinItemPlaceOrderRecord, {
      manual: true,
      defaultPageSize: 10,
    });
    const columns: TgTableColumn<any>[] = [
      {
        label: '商品主图',
        prop: 'product_img',
        width: 104,
        align: 'center',
        fixed: 'left',
        formatter: (col: any) => {
          return h(
            'div',
            {
              class: 'competitor-goods-info',
              style: { height: '80px' },
            },
            [
              h(
                'el-image',
                {
                  props: {
                    src: col.product_img,
                  },
                  on: {
                    click: function () {
                      window.open(
                        'https://haohuo.jinritemai.com/views/product/item2?id=' + col.product_id,
                      );
                    },
                  },
                  class: 'goods-image',
                },
                [
                  h(
                    'div',
                    {
                      slot: 'placeholder',
                    },
                    [
                      h('img', {
                        style: { height: '80px', width: '80px', verticalAlign: 'middle' },
                        domProps: {
                          src: emptyGoods,
                        },
                        on: {
                          click: function () {
                            window.open(
                              'https://haohuo.jinritemai.com/views/product/item2?id=' +
                                col.product_id,
                            );
                          },
                        },
                      }),
                    ],
                  ),
                  h(
                    'div',
                    {
                      slot: 'error',
                    },
                    [
                      h('img', {
                        style: { height: '80px', width: '80px' },
                        domProps: {
                          src: emptyGoods,
                        },
                        on: {
                          click: function () {
                            window.open(
                              'https://haohuo.jinritemai.com/views/product/item2?id=' +
                                col.product_id,
                            );
                          },
                        },
                      }),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      },
      {
        label: '款号',
        prop: 'product_sn',
        minWidth: 120,
        fixed: 'left',
        // formatter: `{?ids}% {project_name}`,
      },
      {
        label: '项目名称',
        prop: 'project_name',
        minWidth: 140,
        'show-overflow-tooltip': true,
      },
      {
        align: 'center',
        label: '分类',
        prop: 'product_class',
        minWidth: 80,
        dataType: {
          type: 'enum',
          enum: E.datacenter.CommodityTypeMap,
        },
      },
      {
        align: 'right',
        label: '下单量',
        minWidth: 70,
        prop: 'order_num',
        formatter: row => {
          return (
            <tg-button
              type="link"
              onClick={() => {
                pageServe.runAsync(
                  {
                    num: 10,
                    page_num: 1,
                  },
                  {
                    product_sn: row.product_sn,
                    project_id: row.project_id,
                  },
                );
                orderQuantityTableDialog.show(pageServe);
              }}
            >
              {row.order_num}
            </tg-button>
          );
          // return (
          //   <el-popover
          //     key={row.id}
          //     width="400"
          //     trigger="click"
          //     popper-class="el-popover-width"
          //     popper-options={{
          //       gpuAcceleration: true,
          //       positionFixed: true,
          //       preventOverflow: true,
          //       boundary: document.documentElement,
          //       fallbackPlacements: ['left', 'top', 'bottom', 'right'],
          //     }}
          //     onShow={() => {
          //       pageServe.runAsync(
          //         {
          //           num: 10,
          //           page_num: 1,
          //         },
          //         {
          //           product_sn: row.product_sn,
          //           project_id: row.project_id,
          //         },
          //       );
          //     }}
          //   >
          //     <tg-table
          //       border
          //       v-loading={pageServe.loading}
          //       max-height={'360px'}
          //       data={pageServe.data || []}
          //       pagination={pageServe.pagination}
          //       columns={[
          //         {
          //           label: '日期',
          //           prop: 'gmt_create',
          //           align: 'center',
          //           dataType: {
          //             type: 'date',
          //           },
          //         },
          //         {
          //           label: '下单量',
          //           prop: 'order_num',
          //           align: 'right',
          //         },
          //         {
          //           label: '下单人',
          //           prop: 'add_by_name',
          //           align: 'center',
          //         },
          //       ]}
          //     />
          //     <tg-button type="link" slot="reference">
          //       {row.order_num}
          //     </tg-button>
          //   </el-popover>
          // );
        },
      },
      {
        align: 'center',
        label: '首次销售时间',
        minWidth: 100,
        prop: 'first_sale_date',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '销售时长 (天)',
        minWidth: 100,
        prop: 'sale_days',
      },
      {
        align: 'right',
        label: '总销量',
        minWidth: 70,
        prop: 'sale_count',
      },
      {
        align: 'right',
        label: '净销量',
        minWidth: 70,
        prop: 'net_sale_count',
      },
      {
        align: 'right',
        label: 'GMV (元)',
        minWidth: 110,
        prop: 'gmv',
        dataType: {
          type: 'money',
          toFixed: 2,
          unit: 100,
        },
      },
      {
        align: 'right',
        label: '平均单价 (元)',
        minWidth: 100,
        prop: 'avg_unit_price',
        dataType: {
          type: 'money',
          toFixed: 2,
          unit: 100,
        },
      },
      {
        align: 'right',
        label: '售罄率',
        minWidth: 70,
        prop: 'sell_through_rate',
        dataType: {
          suffix: '%',
        },
        // formatter: row => {
        //   if (!row.sell_through_rate) return '--';
        //   return <span>{row.sell_through_rate}%</span>;
        // },
      },
      {
        align: 'right',
        label: '在仓库存',
        minWidth: 70,
        prop: 'warehouse_stock_num',
      },
      {
        align: 'right',
        label: '退货库存',
        minWidth: 70,
        prop: 'refund_stock_num',
      },
      {
        align: 'right',
        label: '发货前退货',
        minWidth: 130,
        prop: 'refund_before_sent_out_num',
        // formatter: row => {
        //   if (!row.refund_before_sent_out_num) return '--';
        //   return (
        //     <span>
        //       {row.refund_before_sent_out_num} ({row.refund_before_sent_out_ratio}%)
        //     </span>
        //   );
        // },
        formatter: `{?A} ({refund_before_sent_out_ratio}%)`,
      },
      {
        align: 'right',
        label: '发货后退货',
        minWidth: 130,
        prop: 'refund_after_sent_out_num',
        formatter: `{?A} ({refund_after_sent_out_ratio}%)`,
      },
      {
        label: '库存明细',
        align: 'center',
        prop: 'reservation_status',
        formatter: row => {
          if (!row.product_id) return '--';
          return (
            <tg-button type="link" onClick={() => inventoryDetailsDialog.show(row)}>
              查看
            </tg-button>
          );
        },
      },
      {
        label: '销售明细',
        align: 'center',
        prop: 'reservation_status',
        formatter: row => {
          if (!row.product_id) return '--';
          return (
            <tg-button type="link" onClick={() => salesDetailsDialog.show(row)}>
              查看
            </tg-button>
          );
        },
      },
      {
        label: '操作',
        width: 80,
        fixed: 'right',
        align: 'center',
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          addButns('下单', () => {
            console.log(row);
            isEdit.value = true;
            AddDialog.show({
              ...row,
              project_options,
            });
          });
          return <div>{btns}</div>;
        },
      },
    ];
    const initQueryForm = (): any => {
      return {
        project_id: undefined,
        product_sn: undefined,
        product_class: undefined,
      };
    };
    const isEdit = ref<boolean>(false);
    const AddDialog = useDialog({
      component: addDialog,
      props: {
        isEdit,
      },
      width: '350px',
      title: '新增下单',
      on: {
        submit({ file_urls, order_num, product_class, product_sn, project_id }: any) {
          const AddShopLiveDouyinItemPlaceOrderSmb = useRequest(AddShopLiveDouyinItemPlaceOrder, {
            manual: true,
            onSuccess(data, odata: any) {
              if (odata.success) {
                ctx.root.$message.success('操作成功');
                AddDialog.close();
                query.reload();
              } else {
                ctx.root.$message.error(odata.message);
              }
            },
          });
          AddShopLiveDouyinItemPlaceOrderSmb.runAsync({
            file_url: file_urls[0],
            order_num,
            product_class,
            product_sn,
            project_id,
          });
        },
      },
    });
    const inventoryDetailsDialog = useDialog({
      component: inventoryDetails,
      width: 'fit-content',
      title: '库存明细',
      footer: false,
    });
    const salesDetailsDialog = useDialog({
      component: salesDetails,
      width: '650px',
      title: '销售明细',
      footer: false,
    });
    const orderQuantityTableDialog = useDialog({
      component: orderQuantityTable,
      width: '400px',
      title: '下单明细',
      footer: false,
    });
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryShopLiveDouyinItemPlaceOrderReport, {
      defaultParams: [
        {
          num: 20,
          page_num: 1,
        },
        queryForm.value,
      ],
    });
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      table: {
        border: true,
        rowClick(row: any, column: any) {
          // if (column.label === '操作') return;
          // dialogRecruitmentFeedback.show(row, true);
        },
      },
    };
    const project_options = ref<TG.OptionType<any>[]>([]);
    const loadProjectOptions = () => {
      GetQueryDouyinReportProjects().then(res => {
        const list = res.data.data.projects || [];
        project_options.value = list.map((it: any) => {
          return {
            label: it.project_name,
            value: it.project_id,
          };
        });
      });
    };
    loadProjectOptions();
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      project_options,
      AddDialog,
      isEdit,
    };
  },
  render() {
    const { queryForm } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="项目名称：">
          <Select
            options={this.project_options}
            v-model={queryForm.project_id}
            style="width:100%"
            v-auto-placeholder
            filterable={true}
          />
        </el-form-item>
        <el-form-item label="商品款号：">
          <el-input placeholder="请输入商品款号" v-model={queryForm.product_sn} />
        </el-form-item>
        <el-form-item label="分类：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.product_class}
            v-auto-placeholder
            options={E.datacenter.CommodityTypeOption}
          />
        </el-form-item>
        <div slot="btnLine">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            on-click={() => {
              this.isEdit = false;
              this.AddDialog.show({
                project_options: this.project_options,
              });
            }}
          >
            新增下单
          </tg-button>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
