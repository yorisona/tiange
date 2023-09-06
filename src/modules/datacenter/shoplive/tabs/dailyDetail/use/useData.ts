// import { RouterDataCenter } from '@/const/router';
import { useSunburstColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import {
  QueryDepartmentStatisticsDetail,
  QueryProjectFlowBurst,
  QueryProjectTopProducts,
  QueryProjectTradeFunnel,
} from '@/services/datacenter';
import { GetShopLiveProjectGroundList } from '@/services/datacenter/shoplive';
import { TableColumn } from '@/types/vendor/column';
import { wait } from '@/utils/func';
import { formatAmount } from '@/utils/string';
// import { wait } from '@/utils/func';
import { computed, h, onMounted, ref, SetupContext, watch } from '@vue/composition-api';
import Decimal from 'decimal.js';
import moment from 'moment';
import GoodsEmpty from '@/assets/img/goods-empty.png';

// export enum ProfitLossKeyType {
//   /** 项目组 */
//   department_name = 'department_name',
//   /** 目标gmv */
//   goal_gmv = 'goal_gmv',
//   /** 完成gmv */
//   gmv = 'gmv',
//   /** 目标完成度 */
//   gmv_completion_rate = 'gmv_completion_rate',
//   /** 直播时长 */
//   live_duration = 'live_duration',
//   /** 总UV */
//   uv = 'uv',
//   /** 单UV价值 */
//   gmv_per_uv = 'gmv_per_uv',
//   /** 最高在线 */
//   max_uv = 'max_uv',
//   /** 平均停留时长 */
//   avg_stay = 'avg_stay',
//   /** 直播增粉 */
//   new_fans_count = 'new_fans_count',
//   /** 曝光进入绿 */
//   watch_cnt_show_ratio = 'watch_cnt_show_ratio',
//   /** 进入购买率 */
//   watch_pay_ucnt_ratio = 'watch_pay_ucnt_ratio',
//   /** 投放金额 */
//   cost = 'cost',
//   /** 广告ROI */
//   ad_live_roi = 'ad_live_roi',
//   /** 整体ROI */
//   roi = 'roi',
//   /** 当前退款率 */
//   refund_order_rate = 'refund_order_rate',
//   /** 当前退款金额 */
//   refund_order_amount = 'refund_order_amount',
//   /** 当前净销额 */
//   net_sales_amount = 'net_sales_amount',
// }

interface DailyDetailQueryForm {
  date: string | undefined;
  department_id: number | undefined;
  business_type?: number | undefined;
}

// interface SortForm {
//   key: ProfitLossKeyType | undefined;
//   type: 'ascending' | 'descending' | undefined;
// }

// interface ProjectItemModel {
//   key: string;
//   name: string;
//   // value: (number | string)[];
//   formatter?: (val: any) => any;
// }

// type ProjectsCol = TableColumn<any>;
type oneProjectCol = TableColumn<any>;

export const useData = (ctx: SetupContext) => {
  const departmentList = ref<{ id: number | undefined; name: string | undefined }[]>([]);

  const loading = ref(false);
  const sunBurstLoading = ref(false);
  const funnelLoading = ref(false);
  const topGoodsLoading = ref(false);
  // const selectedColIndex = ref<number>(1);

  const sunBurstData = ref<any[]>([]);
  const funnelData = ref<any[]>([]);

  const sunBurstSeries = computed(() => {
    return {
      data: sunBurstData.value,
    };
  });

  // const sortForm = ref<SortForm>({
  //   key: undefined,
  //   type: undefined,
  // });
  const defaultMoment = moment().subtract(1, 'days');
  const queryForm = ref<DailyDetailQueryForm>({
    date: defaultMoment.format('yyyy-MM-DD'),
    department_id: undefined,
    business_type: undefined,
  });
  const date_str = computed(() => queryForm.value.date ?? defaultMoment.format('yyyy-MM-DD'));

  // const projectItems = ref<ProjectItemModel[]>([
  //   {
  //     key: ProfitLossKeyType.department_name,
  //     name: '项目组',
  //     // value: [],
  //     formatter: val => {
  //       return val ? val : '--';
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.goal_gmv,
  //     name: '目标GMV (元)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None') : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.gmv,
  //     name: '完成GMV (元)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None') : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.gmv_completion_rate,
  //     name: '目标完成度',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? `${val}%` : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.live_duration,
  //     name: '直播时长 (分钟)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? (val / 60).toFixed(2) : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.uv,
  //     name: '总UV',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None', true) : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.gmv_per_uv,
  //     name: '单UV价值 (元)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None') : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.max_uv,
  //     name: '最高在线',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None', true) : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.avg_stay,
  //     name: '平均停留时长 (秒)',
  //     // value: [],
  //     formatter: val => {
  //       return val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.new_fans_count,
  //     name: '直播增粉',
  //     // value: [],
  //     formatter: val => {
  //       return val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.watch_cnt_show_ratio,
  //     name: '曝光进入率',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? `${val}%` : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.watch_pay_ucnt_ratio,
  //     name: '进入购买率',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? `${val}%` : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.cost,
  //     name: '投放金额 (元)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None') : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.ad_live_roi,
  //     name: '广告ROI',
  //     // value: [],
  //     formatter: val => {
  //       return val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.roi,
  //     name: '整体ROI',
  //     // value: [],
  //     formatter: val => {
  //       return val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.refund_order_rate,
  //     name: '当前退款率',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? `${val}%` : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.refund_order_amount,
  //     name: '当前退款金额 (元)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None') : val;
  //     },
  //   },
  //   {
  //     key: ProfitLossKeyType.net_sales_amount,
  //     name: '当前净销额 (元)',
  //     // value: [],
  //     formatter: val => {
  //       return val !== null && val !== undefined ? formatAmount(val, 'None') : val;
  //     },
  //   },
  // ]);

  const oldProjectsData = ref<any[]>([]);
  // const originProjectsData = ref<any[]>([]);
  const projectsData = ref<any[]>([]);
  // const sortedProjectsData = computed(() => {
  //   let sortedArr = [...projectsData.value];
  //   const type = sortForm.value.type;
  //   const key = sortForm.value.key;
  //   if (key && type) {
  //     sortedArr = sortedArr.sort((el1: any, el2: any) => {
  //       return type === 'ascending' ? el1[key] - el2[key] : el2[key] - el1[key];
  //     });
  //   }
  //   return sortedArr;
  // });
  // const projectsColumns = computed<ProjectsCol[]>(() => {
  //   return [{}, ...projectsData.value].map((item, itemIdx) => {
  //     if (itemIdx === 0) {
  //       return {
  //         label: '项目',
  //         width: 135,
  //         align: 'left',
  //         fixed: 'left',
  //         formatter: (row: any, col: any, val: any, index: number) => {
  //           if (index === 0) {
  //             return row.name;
  //           }
  //           return h(
  //             'div',
  //             {
  //               style: 'display: flex; cursor: pointer; justify-content: space-between;',
  //               on: {
  //                 click: () => {
  //                   const type = sortForm.value.type;
  //                   if (type === undefined) {
  //                     sortForm.value.key = row.key;
  //                     sortForm.value.type = 'ascending';
  //                   } else if (type === 'ascending') {
  //                     sortForm.value.key = row.key;
  //                     sortForm.value.type = 'descending';
  //                   } else {
  //                     sortForm.value.key = undefined;
  //                     sortForm.value.type = undefined;
  //                   }
  //                 },
  //               },
  //             },
  //             [
  //               h('div', [row.name]),
  //               h(
  //                 'div',
  //                 {
  //                   class: 'sort-container',
  //                 },
  //                 [
  //                   h('i', {
  //                     class: 'el-icon-caret-left',
  //                     style:
  //                       sortForm.value.key === row.key && sortForm.value.type === 'descending'
  //                         ? 'color: #2877ff'
  //                         : '',
  //                   }),
  //                   h('i', {
  //                     class: 'el-icon-caret-right',
  //                     style:
  //                       sortForm.value.key === row.key && sortForm.value.type === 'ascending'
  //                         ? 'color: #2877ff'
  //                         : '',
  //                   }),
  //                 ],
  //               ),
  //             ],
  //           );
  //         },
  //       };
  //     }
  //     return {
  //       label: item.project_name,
  //       minWidth: 130,
  //       index: itemIdx,
  //       align: 'center',
  //       rest: item.is_rest,
  //       formatter: (row: any, column: any, cellValue: any, index: number) => {
  //         if (item.rest && index > 0) {
  //           return h(
  //             'div',
  //             {
  //               style: 'font-size: 56px; color: rgba(60,82,105,0.20); line-height: 78px;',
  //             },
  //             ['休'],
  //           );
  //         }
  //         // return row.value[itemIdx - 1];
  //         return row.formatter(sortedProjectsData.value[itemIdx - 1]?.[row.key]);
  //       },
  //     };
  //   });
  // });

  // const currentProject = computed(() => projectsData.value[selectedColIndex.value - 1]);
  const currentProject = ref<any>(undefined);

  const oneProjectData = ref<any[]>([]);
  const oneProjectColumns = ref<oneProjectCol[]>([
    {
      label: '排行',
      type: 'index',
      align: 'center',
      width: 52,
    },
    {
      label: '商品信息',
      minWidth: 260,
      formatter: row => {
        return h('div', { class: 'product-info' }, [
          h(
            'el-image',
            {
              props: {
                src: row.image_url,
                'preview-src-list': row.image_url ? [row.image_url] : [],
              },
              style: { width: '70px', height: '70px', borderRadius: '2px' },
            },
            [
              h(
                'div',
                {
                  slot: 'placeholder',
                },
                [
                  h('img', {
                    style: { height: '70px', width: '70px' },
                    domProps: {
                      src: GoodsEmpty,
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
                    style: { height: '70px', width: '70px' },
                    domProps: {
                      src: GoodsEmpty,
                    },
                  }),
                ],
              ),
            ],
          ),
          h('div', { class: 'product-items' }, [
            h('div', { style: 'color: var(--text-color);' }, [row.item_id]),
            h(
              'div',
              {
                class: 'line-clamp-2 goods-name',
                on: {
                  click: () => {
                    // ctx.root.$router.push({
                    //   name: RouterDataCenter.commodityAnalysisPreSale,
                    //   query: {
                    //     project_name: searchProjectName.value,
                    //     project_id: searchParams.value.project_id,
                    //   },
                    // });
                    window.open(
                      `https://haohuo.jinritemai.com/views/product/item2?id=${row.item_id}`,
                    );
                  },
                },
              },
              [row.title],
            ),
            h('div', [row.item_sn]),
          ]),
        ]);
      },
    },
    {
      label: '价格折扣',
      minWidth: 160,
      formatter: row => {
        return h('div', { class: 'price-items' }, [
          h('div', [
            h('span', { class: 'price-label' }, ['吊牌价：']),
            h('span', [row.market_price ? formatAmount(row.market_price / 100) : row.market_price]),
          ]),
          h('div', [
            h('span', { class: 'price-label' }, ['销售单价：']),
            h('span', [
              row.unit_sale_price ? formatAmount(row.unit_sale_price / 100) : row.unit_sale_price,
            ]),
          ]),
          h('div', [
            h('span', { class: 'price-label' }, ['折扣率：']),
            h('span', [row.discount_percent ? `${row.discount_percent}%` : row.discount_percent]),
          ]),
        ]);
      },
    },
    {
      label: '销量',
      align: 'right',
      minWidth: 100,
      formatter: row => (row.order_cnt ? formatAmount(row.order_cnt, 'None', true) : row.order_cnt),
    },
    {
      label: '销售额 (元)',
      align: 'right',
      minWidth: 128,
      formatter: row => (row.gmv ? formatAmount(row.gmv / 100, 'None') : row.gmv),
    },
    {
      label: '讲解次数',
      align: 'right',
      minWidth: 80,
      formatter: row =>
        row.talk_times ? formatAmount(row.talk_times, 'None', true) : row.talk_times,
    },
    {
      label: '曝光人数',
      align: 'right',
      minWidth: 100,
      formatter: row =>
        row.watch_ucnt ? formatAmount(row.watch_ucnt, 'None', true) : row.watch_ucnt,
    },
    {
      label: '点击率',
      align: 'right',
      minWidth: 81,
      formatter: row => (row.click_rate ? `${row.click_rate}%` : row.click_rate),
    },
    {
      label: '转化率',
      align: 'right',
      minWidth: 81,
      formatter: row => (row.pay_rate ? `${row.pay_rate}%` : row.pay_rate),
    },
    {
      label: '退款比例',
      align: 'right',
      minWidth: 81,
      formatter: row => (row.refund_rate ? `${row.refund_rate}%` : row.refund_rate),
    },
    {
      label: '退款金额 (元)',
      align: 'right',
      minWidth: 113,
      formatter: row =>
        row.refund_gmv ? formatAmount(row.refund_gmv / 100, 'None') : row.refund_gmv,
    },
  ]);

  const methods = {
    // onCellClick(_: any, column: any) {
    //   if (!column.index) {
    //     return;
    //   }
    //   selectedColIndex.value = column.index;
    // },
    // onHeaderClick(column: any) {
    //   if (!column.index) {
    //     return;
    //   }
    //   selectedColIndex.value = column.index;
    // },
    resetProjectsDataAndColumns() {
      // if ((projectsData.value?.length ?? 0) === 0) {
      //   projectsData.value = [];
      //   return;
      // }
      // projectsColumns.value = [{}, ...projectsData.value].map((item, itemIdx) => {
      //   if (itemIdx === 0) {
      //     return {
      //       label: '项目',
      //       width: 135,
      //       align: 'left',
      //       fixed: 'left',
      //       formatter: (row: any) => {
      //         return row.name;
      //       },
      //     };
      //   }
      //   return {
      //     label: item.project_name,
      //     minWidth: 116,
      //     index: itemIdx,
      //     align: 'center',
      //     rest: item.is_rest,
      //     formatter: (row: any, column: any, cellValue: any, index: number) => {
      //       if (item.rest && index > 0) {
      //         return h(
      //           'div',
      //           {
      //             style: 'font-size: 56px; color: rgba(60,82,105,0.20); line-height: 78px;',
      //           },
      //           ['休'],
      //         );
      //       }
      //       // return row.value[itemIdx - 1];
      //       return row.formatter(row.value[itemIdx - 1]);
      //     },
      //   };
      // });
      // projectsData.value = projectItems.map(item => {
      // item.value = originProjectsData.value.map(el => {
      //   return el[item.key];
      // });
      //   return item;
      // });
    },
    selectClick() {},
    transformFenToYuan(val: number | null | undefined) {
      if (!val) {
        return val;
      }
      return +new Decimal(val).div(new Decimal(100)).toNumber().toFixed(2);
    },
    objSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: any;
      column: any;
      rowIndex: number;
      columnIndex: number;
    }) {
      const col = projectsData.value[columnIndex] as any;
      if (col.rest) {
        if (rowIndex === 0) {
          return {
            rowspan: 1,
            colspan: 1,
          };
        } else if (rowIndex === 1) {
          return {
            rowspan: 17,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    async queryProjectFlowBurst(project_id: number) {
      sunBurstLoading.value = true;
      const [res] = await wait(
        500,
        QueryProjectFlowBurst({
          project_id: `${project_id}`,
          start_date: date_str.value,
          end_date: date_str.value,
          // project_id: '191',
          // start_date: '2022-01-01',
          // end_date: '2022-12-31',
        }),
      );
      sunBurstLoading.value = false;
      if (res.data.success) {
        const datas = res.data.data;
        sunBurstData.value = (datas || [])
          .filter((el: any) => {
            return el.children?.find((subEl: any) => (subEl.value || 0) > 0);
          })
          .map((el: any, index: number) => {
            return {
              name: el.name,
              itemStyle: {
                color: useSunburstColors[index]?.color,
              },
              value: el.value,
              children: (el.children || [])
                .filter((subEl: any) => {
                  return (subEl.value ?? 0) > 0;
                })
                .map((subEl: any, subElIndex: any) => {
                  return {
                    name: subEl.name,
                    itemStyle: {
                      color: useSunburstColors[index]?.children[subElIndex],
                    },
                    value: subEl.value,
                    // value: 10
                  };
                }),
            };
          });
      } else {
        ctx.root.$message.error(res.data.message || '数据获取失败');
      }
    },
    async queryProjectTradeFunnel(project_id: number) {
      funnelLoading.value = true;
      const [res] = await wait(
        500,
        QueryProjectTradeFunnel({
          project_id: `${project_id}`,
          start_date: date_str.value,
          end_date: date_str.value,
          // project_id: '191',
          // start_date: '2022-01-01',
          // end_date: '2022-12-31',
        }),
      );
      funnelLoading.value = false;
      if (res.data.success) {
        funnelData.value = res.data.data;
      }
    },
    async queryDepartmentStatisticsDetail() {
      loading.value = true;
      const [res] = await wait(
        500,
        QueryDepartmentStatisticsDetail({
          third_department_id: queryForm.value.department_id,
          business_type: queryForm.value.business_type,
          start_date: date_str.value,
          end_date: date_str.value,
        }),
      );
      loading.value = false;
      // const res = await QueryDepartmentStatisticsDetail({
      //   third_department_id: queryForm.value.department_id,
      //   start_date: date_str.value,
      //   end_date: date_str.value,
      // });
      if (res.data.success) {
        // oldProjectsData.value = projectsData.value ?? [];
        // selectedColIndex.value = 1;
        projectsData.value = res.data.data ?? [];
        // methods.resetProjectsDataAndColumns();
      } else {
        ctx.root.$message.error(res.data.message ?? '请求失败');
      }
    },
    async getMyShopLiveProjectGroundList(start_date: string, end_date: string) {
      const res = await GetShopLiveProjectGroundList({
        end_date: end_date,
        start_date: start_date,
      });
      if (res.data.success) {
        departmentList.value = res.data.data.data;
        const find = departmentList.value.find(item => item.id === queryForm.value.department_id);
        queryForm.value.department_id = find ? queryForm.value.department_id : undefined;
      }
    },
    async queryProjectTopProducts(project_id: number) {
      topGoodsLoading.value = true;
      const [res] = await wait(
        500,
        QueryProjectTopProducts({
          project_id: `${project_id}`,
          start_date: date_str.value,
          end_date: date_str.value,
          // project_id: 191,
          // start_date: '2022-01-01',
          // end_date: '2022-12-31',
          page_num: 1,
          num: 10,
        }),
      );
      topGoodsLoading.value = false;
      if (res.data.success) {
        oneProjectData.value = res.data.data;
      }
    },
    // onColClick(index: number, el: any) {
    //   selectedColIndex.value =
    //     projectsData.value.findIndex(item => el.project_id === item.project_id) + 1;
    // },
    onSelectChanged(data: any) {
      currentProject.value = data;
      const project_id = data?.project_id;
      if (project_id) {
        methods.queryProjectFlowBurst(project_id);
        methods.queryProjectTradeFunnel(project_id);
        methods.queryProjectTopProducts(project_id);
      } else {
        sunBurstData.value = [];
        funnelData.value = [];
      }
    },
  };

  watch(
    [
      () => queryForm.value.date,
      () => queryForm.value.department_id,
      () => queryForm.value.business_type,
    ],
    async () => {
      await methods.getMyShopLiveProjectGroundList(
        queryForm.value.date || '',
        queryForm.value.date || '',
      );
      methods.queryDepartmentStatisticsDetail();
    },
  );
  // watch([() => selectedColIndex.value, () => projectsData.value], () => {
  //   const project_id = projectsData.value[selectedColIndex.value - 1]?.project_id;
  //   if (project_id) {
  //     methods.queryProjectFlowBurst(project_id);
  //     methods.queryProjectTradeFunnel(project_id);
  //     methods.queryProjectTopProducts(project_id);
  //   } else {
  //     sunBurstData.value = [];
  //     funnelData.value = [];
  //   }
  // });

  onMounted(() => {
    methods.getMyShopLiveProjectGroundList(queryForm.value.date || '', queryForm.value.date || '');
    methods.queryDepartmentStatisticsDetail();
  });

  return {
    loading,
    sunBurstLoading,
    funnelLoading,
    topGoodsLoading,
    sunBurstData,
    sunBurstSeries,
    funnelData,
    // selectedColIndex,
    queryForm,
    oldProjectsData,
    // projectsColumns,
    // projectItems,
    // originProjectsData,
    projectsData,
    // sortedProjectsData,
    oneProjectColumns,
    oneProjectData,
    departmentList,
    currentProject,
    ...methods,
  };
};
