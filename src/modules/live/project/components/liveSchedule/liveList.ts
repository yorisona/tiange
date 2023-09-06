import { computed, defineComponent, h, onMounted, ref, watch } from '@vue/composition-api';
import { LiveDisplay, ProjectShopLive, ShopLiveProjectLiveQueryParams } from '@/types/tiange/live';
import { QueryShopLiveProjectLiveList } from '@/services/live';
import { useRouter } from '@/use/vue-router';
import { TableColumn } from '@/types/vendor/column';
import moment from 'moment';
import { wait } from '@/utils/func';
import { usePageJump } from '@/utils/pageJump';
import { RouterNameProjectManage } from '@/const/router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  props: {
    start_date: {
      type: String,
    },
    end_date: {
      type: String,
    },
  },
  setup(props, ctx) {
    const currentDate = moment();

    const router = useRouter();
    const project_id = router.currentRoute.params.id || router.currentRoute.query.id + '';
    const loading = ref(false);
    const total = ref(0);

    const QueryForm = ref<ShopLiveProjectLiveQueryParams>({
      page_num: 1,
      num: 20,
      project_id: project_id,
      live_start_date: props.start_date ?? '',
      live_end_date: props.end_date ?? '',
    });

    const ShopLiveDataList = ref<ProjectShopLive[]>([]);

    watch(
      () => [props.start_date, props.end_date],
      newVal => {
        if (newVal) {
          QueryForm.value.live_start_date = props.start_date ?? '';
          QueryForm.value.live_end_date = props.end_date ?? '';
          reload();
        }
      },
    );
    const reloadData = () => {
      reload();
    };
    const { business_type } = useProjectBaseInfo();
    /** 获取直播场次数据 */
    const GetProjectShopLive = async (params: ShopLiveProjectLiveQueryParams) => {
      loading.value = true;
      const [{ data: res }] = await wait(
        500,
        QueryShopLiveProjectLiveList(params, business_type.value),
      );
      loading.value = false;

      if (res.success) {
        ShopLiveDataList.value = res.data.data;
        total.value = res.data.total;
      } else {
        ShopLiveDataList.value = [];
        total.value = 0;
        ctx.root.$message.warning(res.message ?? '查询失败，稍后重试');
      }
    };

    // 行点击跳转详情页
    const onRowClick = (row: LiveDisplay) => {
      const { isFromLocalLife, isFromSupplyChain, isFromLiveDouyin } = useProjectBaseInfo();
      if (isFromLocalLife.value) {
        usePageJump().jumpLocalLifeDetail({
          project_id: `${project_id}`,
          live_id: `${row.id}`,
          liveType: 'list',
          pathName: RouterNameProjectManage.localLife.display.detail,
        });
        return;
      } else if (isFromSupplyChain.value) {
        usePageJump().jumpSupplyLifeDetail({
          project_id: `${project_id}`,
          live_id: `${row.id}`,
          liveType: 'list',
          pathName: RouterNameProjectManage.supplyChain.details.display,
        });
        return;
      }
      usePageJump().jumpLiveDisplayDetail(
        {
          project_id: `${project_id}`,
          live_id: `${row.id}`,
          liveType: 'list',
        },
        isFromLiveDouyin.value,
      );
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      QueryForm.value.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      QueryForm.value.num = num;
      reload();
    };

    const reload = async (clean = true) => {
      if (clean) {
        QueryForm.value.page_num = 1;
      }
      await GetProjectShopLive(QueryForm.value);
    };

    onMounted(() => {
      reload();
    });

    const methods = {
      is_before: (day: string) => {
        const liveDate = moment(day);
        return liveDate.isBefore(currentDate, 'd');
      },
    };

    const ShopLiveColumns = computed<TableColumn<ProjectShopLive>[]>(() => [
      {
        label: '直播标题',
        minWidth: 130,
        formatter: row => {
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
        label: '直播时间',
        minWidth: 186,
        align: 'left',
        formatter: row => {
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
        label: '人员排班',
        minWidth: 74,
        align: 'right',
        formatter: row => {
          const is_finished = row.is_kol_scheduled;
          const classNmae = methods.is_before(row.live_start_time) && !is_finished ? 'warning' : '';

          return h(
            'div',
            {
              class: 'live-status',
            },
            [
              h('span', {
                class: classNmae,
              }),
              h('span', [is_finished ? '已排班' : '未排班']),
            ],
          );
        },
      },
      {
        label: '数据录入',
        minWidth: 74,
        align: 'center',
        formatter: row => {
          const is_finished = row.is_entry_live_data;
          const classNmae = methods.is_before(row.live_start_time) && !is_finished ? 'warning' : '';

          return h(
            'div',
            {
              class: 'live-status',
              style: {
                justifyContent: 'center',
              },
            },
            [
              h('span', {
                class: classNmae,
              }),
              h('span', [is_finished ? '已录入' : '待录入']),
            ],
          );
        },
      },
      {
        label: '是否归档',
        minWidth: 74,
        align: 'right',
        formatter: row => {
          const is_finished = row.live_status === 4;
          const classNmae = methods.is_before(row.live_start_time) && !is_finished ? 'warning' : '';
          return h(
            'div',
            {
              class: 'live-status',
            },
            [
              h('span', {
                class: classNmae,
              }),
              h('span', [is_finished ? '已归档' : '未归档']),
            ],
          );
        },
      },
    ]);

    return {
      reloadData,
      QueryForm,
      onRowClick,
      handleCurrentChange,
      handlePageSizeChange,
      ShopLiveDataList,
      ShopLiveColumns,
      loading,
      total,
    };
  },
});
