/**
 * 店铺代播 - 项目管理 - 列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 13:34:11
 */
import { computed, defineComponent, h, ref } from '@vue/composition-api';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { KolScheduleQuery } from '@/services/live';
import { KolSchedule } from '../../../types/tiange/live';
import qs from 'query-string';
import { getToken } from '../../../utils/token';
import { useProjectBaseInfo } from '../../settlement/use/project';

export default defineComponent({
  name: 'AnchorScheduling',
  setup(props, ctx) {
    const queryForm = ref<any>({
      project_name: '',
      kol_name: '',
      selectDates: [],
      page_num: 1,
      num: 20,
    });
    const disable_export_btn = ref(true);
    /** 查询 */
    const onQuerySearchClick = () => {
      reload();
    };

    /** 重置查询form */
    const resetQueryForm = () => {
      queryForm.value.project_name = '';
      queryForm.value.kol_name = '';
      queryForm.value.selectDates = [];
      queryForm.value.page_num = 1;
      queryForm.value.num = 20;
    };

    /** 重置查询 */
    const onQueryResetClick = () => {
      resetQueryForm();
      reload();
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      reload();
    };
    const list = ref<KolSchedule[]>([]);
    const total = ref(0);
    const loading = ref(false);
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }
      const queryData: any = {
        project_name: queryForm.value.project_name,
        kol_name: queryForm.value.kol_name,
        start_date:
          queryForm.value.selectDates && queryForm.value.selectDates.length > 1
            ? queryForm.value.selectDates[0]
            : undefined,
        end_date:
          queryForm.value.selectDates && queryForm.value.selectDates.length > 1
            ? queryForm.value.selectDates[1]
            : undefined,
      };
      const { data: response } = await KolScheduleQuery(
        { page_num: queryForm.value.page_num, num: queryForm.value.num },
        queryData,
      );
      if (response.success) {
        list.value = response.data.data || [];
        total.value = response.data.total || 0;
      } else {
        list.value = [];
        total.value = 0;
        ctx.root.$message.error(response.message || '获取主播排班失败');
      }
    };
    reload();
    /** 本地生活 */
    const { isFromLocalLife } = useProjectBaseInfo();
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_anchor_view)
        : HasPermission(RIGHT_CODE.live_project_anchor_view);
      const canExport = isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_anchor_export)
        : HasPermission(RIGHT_CODE.live_project_anchor_export);
      return { canExport, canViewList };
    });

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(() => 0),
      fixedBlockHeightRefs: [topCardHeight, -35],
      tableMinHeight: 100,
      pagename: 'live_project',
    });
    const columns = ref<any[]>([
      {
        label: '上播时间',
        minWidth: 124,
        formatter: (row: KolSchedule) => {
          return (row.start_time || '').replace(/-/g, '.') || '--';
        },
      },
      {
        label: '下播时间',
        minWidth: 124,
        formatter: (row: KolSchedule) => {
          return (row.end_time || '').replace(/-/g, '.') || '--';
        },
      },
      {
        label: '直播时长 (h)',
        minWidth: 68,
        align: 'right',
        formatter: (row: KolSchedule) => {
          return row.duration ? (parseInt(row.duration * 10 + '', 10) / 10).toFixed(1) : '--';
        },
      },
      {
        label: '主播',
        minWidth: 138,
        align: 'center',
        'show-overflow-tooltip': true,
        formatter: (row: KolSchedule) => {
          return row.kol_name || '--';
        },
      },
      {
        label: '场次名称',
        minWidth: 128,
        'show-overflow-tooltip': true,
        formatter: (row: KolSchedule) => {
          return row.studio_name || '--';
        },
      },
      {
        label: '项目名称',
        minWidth: 158,
        'show-overflow-tooltip': true,
        formatter: (row: KolSchedule) => {
          return row.project_name || '--';
        },
      },
    ]);
    const exportBtnClick = async () => {
      const queryData: any = {
        project_name: queryForm.value.project_name,
        kol_name: queryForm.value.kol_name,
        start_date:
          queryForm.value.selectDates && queryForm.value.selectDates.length > 1
            ? queryForm.value.selectDates[0]
            : undefined,
        end_date:
          queryForm.value.selectDates && queryForm.value.selectDates.length > 1
            ? queryForm.value.selectDates[1]
            : undefined,
      };
      const _paramsstr = qs.stringify(queryData);
      const token = getToken();
      const url = '/api/shop_live/export_kol_schedule_detail';
      window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
    };

    return {
      disable_export_btn,
      total,
      exportBtnClick,
      loading,
      list,
      columns,
      Permission,
      reload,
      queryForm,
      handlePageSizeChange,
      handleCurrentChange,
      onQueryResetClick,
      onQuerySearchClick,
      onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
  /*async mounted() {
    this.queryLiveProjectList();
  },
  methods: {
    async queryLiveProjectList() {
      await this.reload();
    },
  },*/
});
