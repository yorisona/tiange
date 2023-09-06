import { computed, defineComponent, h, onBeforeMount, ref } from '@vue/composition-api';
import moment from 'moment';
import { TableColumn } from '@/types/vendor/column';
import { useRouter } from '@/use/vue-router';
import { QueryProjectMcnShopLive } from '@/services/commonBusiness/project';
import { QueryShopLiveMerchantgoods } from '@/services/live';
import { max_length_of_column } from '@/utils/table';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';

export default defineComponent({
  props: {
    platform: {
      type: Number,
      default: 1,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const currentDate = moment();
    const liveDatas = ref<any>([]);
    const is_before = (day: string) => {
      const liveDate = moment(day);
      return liveDate.isBefore(currentDate, 'd');
    };

    const liveColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '场次类型',
        minWidth: 70,
        formatter: (row: any) => {
          let text = '--';
          if (row.live_type === 60) {
            text = '直播';
          } else if (row.live_type === 61) {
            text = '短视频';
          } else if (row.live_type === 62) {
            text = '图文';
          }
          return h('div', [text]);
        },
      },
      {
        label: '场次名称',
        minWidth: 200,
        formatter: (row: any) => {
          return h(
            'div',
            {
              class: 'line-clamp-1',
            },
            [row.live_title ? row.live_title : '--'],
          );
        },
      },
      {
        label: '场次时间',
        minWidth: 156,
        align: 'center',
        formatter: (row: any) => {
          if (row.live_start_time && row.live_end_time) {
            const startDate = moment(row.live_start_time);
            const endDate = moment(row.live_end_time);
            const isSameDay = startDate.isSame(endDate, 'd');
            let live_time = `${startDate.format('MM.DD HH:mm')} ~ ${endDate.format('HH:mm')}`;
            if (!isSameDay) {
              const dateOfStartDate = startDate.date();
              const dateOfEndDate = endDate.date();
              const tomorrowDate = startDate.clone().date(dateOfStartDate + 1);
              const sameOfTomorrow = tomorrowDate.isSame(endDate, 'd');
              if (sameOfTomorrow) {
                live_time = `${live_time}(次日)`;
              } else {
                live_time = `${live_time}(${dateOfEndDate}日)`;
              }
            }
            return live_time;
          }
          return '--';
        },
      },
      {
        label: '招商商品数',
        minWidth: 150,
        align: 'right',
        property: 'merchant_goods_count',
      },
      {
        label: '执行结果',
        minWidth: 135,
        align: 'center',
        formatter: (row: any) => {
          const is_finished = row.live_status === 4;
          const className = is_before(row.live_start_time) && !is_finished ? 'warning' : '';
          return h(
            'div',
            {
              class: 'live-status',
            },
            [
              h('span', {
                class: className,
              }),
              h('span', [is_finished ? '已归档' : '未完成']),
            ],
          );
        },
      },
    ]);
    const withoutLiveDisplayPermission = ref<boolean>(false);
    const liveParams = ref<any>({
      project_id,
      num: 20,
      page_num: 1,
      total: 0,
    });
    const queryProjectShopLive = async () => {
      const baseDate = currentDate;
      const time_format = 'yyyy-MM-DD';
      const start_day = baseDate.clone().startOf('month');
      const end_day = baseDate.clone().endOf('month');
      const params: any = {
        live_start_date: start_day.format(time_format),
        live_end_date: end_day.format(time_format),
        ...liveParams.value,
      };
      const res = await QueryProjectMcnShopLive(params);
      if (res.data.success) {
        withoutLiveDisplayPermission.value = false;
        liveDatas.value = res.data.data.data;
        liveParams.value.total = res.data.data.total;
      } else {
        if (res.data.error_code === 200) {
          withoutLiveDisplayPermission.value = true;
        } else {
          withoutLiveDisplayPermission.value = false;
        }
      }
    };

    const liveCurrentChange = (page_num: number) => {
      liveParams.value.page_num = page_num;
      queryProjectShopLive();
    };
    const livePageSizeChange = (num: number) => {
      liveParams.value.num = num;
      queryProjectShopLive();
    };

    const shop_live_id = ref<any>(null);
    const shop_live_name = ref('');

    const onLiveRowClick = (row: any) => {
      shop_live_id.value = row.id;
      shop_live_name.value = row.live_title;
      getMerchantGoodsList();
    };

    /** 招商商品 */
    const goodsDatas = ref<any>([]);

    const popoverFun = <T extends boolean>(row: any, text: string, num: number, text_only: T) => {
      const data = row[text] || '--';
      const { is_folded, folded_text } = get_limited_length_string(data, num);
      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [
              h('span', { slot: 'reference' }, [folded_text]),
              h('DefText', { props: { content: row[text] } }),
            ],
          ) as TableColumnRenderReturn<T>);
    };

    /** 商品ID渲染函数 */
    const product_code_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'product_code', 8, text_only);
    };
    /** 商品ID最大宽度 */
    const product_code_max_length = max_length_of_column(goodsDatas, '商品ID', product_code_render);

    /** 商品名称渲染函数 */
    const product_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'product_name', 8, text_only);
    };
    /** 商品名称最大宽度 */
    const product_name_max_length = max_length_of_column(
      goodsDatas,
      '商品名称',
      product_name_render,
    );

    /** 所属公司渲染函数 */
    const company_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'company_name', 8, text_only);
    };
    /** 所属公司最大宽度 */
    const company_name_max_length = max_length_of_column(
      goodsDatas,
      '所属公司',
      company_name_render,
    );

    /** 所属店铺渲染函数 */
    const shop_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'shop_name', 8, text_only);
    };
    /** 所属店铺最大宽度 */
    const shop_name_max_length = max_length_of_column(goodsDatas, '所属店铺', shop_name_render);

    /** 所属品牌渲染函数 */
    const brand_name_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'brand_name', 5, text_only);
    };
    /** 所属品牌最大宽度 */
    const brand_name_max_length = max_length_of_column(goodsDatas, '品牌', brand_name_render);

    /** 场次名称渲染函数 */
    const live_title_render = <T extends boolean>(row: any, text_only: T) => {
      return popoverFun(row, 'live_title', 10, text_only);
    };
    /** 场次名称最大宽度 */
    const live_title_max_length = max_length_of_column(goodsDatas, '场次名称', live_title_render);

    const goodsColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '商品ID',
        headerAlign: 'left',
        minWidth: product_code_max_length.value,
        formatter: row => product_code_render(row, false),
      },
      {
        label: '商品名称',
        minWidth: product_name_max_length.value,
        formatter: row => product_name_render(row, false),
      },
      {
        label: '所属公司',
        minWidth: company_name_max_length.value,
        formatter: row => company_name_render(row, false),
      },
      {
        label: '所属店铺',
        minWidth: shop_name_max_length.value,
        formatter: row => shop_name_render(row, false),
      },
      {
        label: '品牌',
        minWidth: brand_name_max_length.value,
        formatter: row => brand_name_render(row, false),
      },
      {
        label: '日期',
        minWidth: 100,
        align: 'center',
        formatter: (row: any) => {
          return h(
            'div',
            {
              class: 'line-clamp-1',
            },
            [row.live_start_time ? row.live_start_time.replace(/-/g, '.') : '--'],
          );
        },
      },
      {
        label: '场次名称',
        minWidth: live_title_max_length.value,
        formatter: row => live_title_render(row, false),
      },
      {
        label: '场次类型',
        minWidth: 80,
        align: 'center',
        formatter: (row: any) => {
          let text = '--';
          if (row.live_type === 60) {
            text = '直播';
          } else if (row.live_type === 61) {
            text = '短视频';
          } else if (row.live_type === 62) {
            text = '图文';
          }
          return h('span', [text]);
        },
      },
      {
        label: '招商人员',
        minWidth: 70,
        align: 'center',
        formatter: (row: any) => {
          return h('div', [row.add_by_name ? row.add_by_name : '--']);
        },
      },
    ]);
    const merchantGoodsParams = ref<any>({
      num: 20,
      page_num: 1,
      total: 0,
    });
    const getMerchantGoodsList = async () => {
      const baseDate = currentDate;
      const time_format = 'yyyy-MM-DD';
      const start_day = baseDate.clone().startOf('month');
      const end_day = baseDate.clone().endOf('month');
      const params: any = {
        live_start_time: start_day.format(time_format),
        live_end_time: end_day.format(time_format),
        live_id: shop_live_id.value,
        project_id: project_id,
        ...merchantGoodsParams.value,
      };
      const res = await QueryShopLiveMerchantgoods(params);
      if (res.data.success) {
        goodsDatas.value = res.data.data.data;
        merchantGoodsParams.value.total = res.data.data.total;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    const closeShopName = () => {
      shop_live_id.value = null;
      shop_live_name.value = '';
      getMerchantGoodsList();
    };

    const merchantCurrentChange = (page_num: number) => {
      merchantGoodsParams.value.page_num = page_num;
      getMerchantGoodsList();
    };
    const merchantPageSizeChange = (num: number) => {
      merchantGoodsParams.value.num = num;
      getMerchantGoodsList();
    };

    onBeforeMount(() => {
      if (props.platform === 1) {
        queryProjectShopLive();
        getMerchantGoodsList();
      }
    });

    return {
      liveDatas,
      liveColumns,
      withoutLiveDisplayPermission,
      liveParams,
      liveCurrentChange,
      livePageSizeChange,
      onLiveRowClick,
      shop_live_name,
      goodsDatas,
      goodsColumns,
      merchantGoodsParams,
      closeShopName,
      merchantCurrentChange,
      merchantPageSizeChange,
    };
  },
});
