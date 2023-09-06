// import { RouterDataCenter } from '@/const/router';
import { QueryProjectStatisticsDetailList } from '@/services/datacenter/shoplive';
import { TableColumn } from '@/types/vendor/column';
import { wait } from '@/utils/func';
import { formatAmount } from '@/utils/string';
// import { wait } from '@/utils/func';
import { computed, h, onMounted, ref, SetupContext, watch } from '@vue/composition-api';
import Decimal from 'decimal.js';
import moment from 'moment';
import GoodsEmpty from '@/assets/img/goods-empty.png';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

interface DailyDetailQueryForm {
  start_date: string | undefined;
  end_date: string | undefined;
  project_id: number | undefined;
}

type oneProjectCol = TableColumn<any>;

export const useData = (
  ctx: SetupContext,
  projectId: number,
  start_time: string,
  end_time: string,
  is_from_project = false,
) => {
  const departmentList = ref([]);

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
  const defaultMoment = moment().subtract(1, 'days');
  const queryForm = ref<DailyDetailQueryForm>({
    start_date: start_time,
    end_date: end_time,
    project_id: projectId || undefined,
  });
  const start_date_str = computed(
    () => queryForm.value.start_date || defaultMoment.format('yyyy-MM-DD'),
  );
  const end_date_str = computed(
    () => queryForm.value.end_date || defaultMoment.format('yyyy-MM-DD'),
  );

  const oldProjectsData = ref<any[]>([]);
  const projectsData = ref<any[]>([]);
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
            h('div', { style: 'color: #19231d;' }, [row.item_id]),
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
  const { business_type } = useProjectBaseInfo();
  const methods = {
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
    async queryDepartmentStatisticsDetail(isLoading = true) {
      loading.value = isLoading;
      const [res] = await wait(
        500,
        QueryProjectStatisticsDetailList(
          {
            project_id: queryForm.value.project_id,
            start_date: start_date_str.value,
            end_date: end_date_str.value,
            is_from_project: is_from_project,
          },
          business_type.value,
        ),
      );
      loading.value = false;
      if (res.data.success) {
        projectsData.value = res.data.data || [];
      } else {
        projectsData.value = [];
        ctx.root.$message.error(res.data.message || '请求失败');
      }
    },
  };

  watch(
    [
      () => queryForm.value.start_date,
      () => queryForm.value.end_date,
      () => queryForm.value.project_id,
    ],
    () => {
      methods.queryDepartmentStatisticsDetail();
    },
  );

  onMounted(() => {
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
