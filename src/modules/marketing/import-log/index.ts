/**
 * 营销业务 - 导入日志
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-04-12 14:02:57
 */
import { GetMarketingImportLog, GetQueryStarData } from '@/services/marketing.importlog';
import {
  ImportLogDetail,
  MarketingImportLog,
  MarketingImportLogQueryParams,
} from '@/types/tiange/marketing/importlog';
import { TableColumn } from '@/types/vendor/column';
import { HasPermission } from '@/use/permission';
import { addDateFormat } from '@/utils/format';
import { sleep } from '@/utils/func';
import { computed, defineComponent, h, ref, SetupContext } from '@vue/composition-api';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';

import MarketingImortLogDetail from '@/modules/marketing/import-log/detail.vue';

/** 权限 */
const Permission = computed(() => {
  const canViewImportLogList = HasPermission(NEW_RIGHT_CODE.import_logs_list);

  return { canViewImportLogList };
});

const useList = (ctx: SetupContext) => {
  const loading = ref(false);
  const ImportLogDetailVisible = ref(false);

  const toggleModalVisible = (visible = false) => {
    ImportLogDetailVisible.value = visible;
  };

  /** 数据列表 */
  const datalist = ref<MarketingImportLog[]>([]);
  const total = ref(0);

  const loadDataList = async (payload: MarketingImportLogQueryParams) => {
    loading.value = true;

    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetMarketingImportLog(payload),
    ]);

    loading.value = false;
    if (response.success) {
      datalist.value = response.data.data;
      total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  /** 下载 */
  const downloadLog = (log_id: number) => {
    const url = '/api/upload/download_upload_file?upload_log_id=' + log_id.toString();
    window.open(url);
  };

  /** 选中详情 */
  const checkedImportLogDetail = ref<ImportLogDetail>({
    add_item: [],
    update_item: [],
    failed_item: [],
  });

  /** 查看详情 */
  const toggleImportLogDetailModal = (row: MarketingImportLog) => {
    toggleModalVisible(true);

    if (row.result_detail && !Array.isArray(row.result_detail)) {
      checkedImportLogDetail.value = row.result_detail;
    }
  };

  const columns = computed<TableColumn<MarketingImportLog>[]>(() => [
    {
      label: '操作模块',
      property: 'operate',
      align: 'left',
      headerAlign: 'left',
      minWidth: 124,
    },
    {
      label: '文件名称',
      property: 'file_name',
      align: 'left',
      headerAlign: 'left',
      minWidth: 210,
      formatter: row => {
        if (row.file_name !== '') {
          return h('el-popover', { props: { trigger: 'hover', openDelay: 300 } }, [
            h('div', { class: 'line-clamp-1', style: { cursor: 'pointer' }, slot: 'reference' }, [
              row.file_name,
            ]),
            h('div', { style: { width: '210px' } }, [row.file_name]),
          ]);
        } else {
          return h('DefText', { props: { content: '' } });
        }
      },
    },
    {
      label: '状态',
      property: 'status',
      align: 'left',
      headerAlign: 'left',
      minWidth: 70,
      formatter: row => {
        return row.status === '成功'
          ? row.status
          : h('span', { style: { color: '#EC1E1E' } }, [row.status]);
      },
    },
    {
      label: '导入结果',
      property: 'result',
      align: 'left',
      headerAlign: 'left',
      minWidth: 274,
      formatter: row => {
        if (row.result !== '') {
          return h('el-popover', { props: { trigger: 'hover', openDelay: 300 } }, [
            h('div', { class: 'line-clamp-2', style: { cursor: 'pointer' }, slot: 'reference' }, [
              row.result,
            ]),
            h('div', { style: { width: '274px' } }, [row.result]),
          ]);
        } else {
          return h('DefText', { props: { content: '' } });
        }
      },
    },
    {
      label: '导入人',
      property: 'operator',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
    },
    {
      label: '导入时间',
      property: 'upload_date',
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      formatter: row => {
        return addDateFormat(row.upload_date);
      },
    },
    {
      label: '操作',
      align: 'center',
      headerAlign: 'center',
      minWidth: 92,
      formatter: row => {
        return h(
          'div',
          {
            class: 'operation',
          },
          [
            h(
              'a',
              {
                on: { click: () => downloadLog(row.id) },
              },
              ['下载'],
            ),
            row.status === '成功'
              ? h(
                  'a',
                  {
                    on: { click: () => toggleImportLogDetailModal(row) },
                  },
                  ['详情'],
                )
              : '',
          ],
        );
      },
    },
  ]);

  return {
    checkedImportLogDetail,
    ImportLogDetailVisible,
    toggleModalVisible,
    columns,
    datalist,
    total,
    loading,
    loadDataList,
  };
};

export default defineComponent({
  name: 'TgMarketingImportLog',
  components: {
    MarketingImortLogDetail,
  },
  setup(props, ctx) {
    const queryForm = ref<MarketingImportLogQueryParams>({
      date_range: '',
      operator: '',
      status: 0,
      page_num: 1,
      num: 10,
    });

    const listLogic = useList(ctx);
    const importUserList = ref([]);

    /** 导入人列表 */
    const loadImportUserList = async () => {
      const response: any = await GetQueryStarData({});
      const result = response.data;
      if (result.success) {
        importUserList.value = result.data.user_data;
      }
    };

    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const queryParams: MarketingImportLogQueryParams = {
        page_num: queryForm.value.page_num,
        num: queryForm.value.num,
      };

      if (queryForm.value.status !== 0) {
        queryParams.status = queryForm.value.status;
      }

      if (queryForm.value.date_range) {
        queryParams.start_time = queryForm.value.date_range[0];
        queryParams.end_time = queryForm.value.date_range[1];
      }
      if (queryForm.value.operator) {
        queryParams.operator = queryForm.value.operator;
      }
      await listLogic.loadDataList(queryParams);
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

    /** 查询 */
    const onQuerySearchClick = () => {
      reload();
    };

    /** 重置查询form */
    const resetQueryForm = () => {
      queryForm.value.status = 0;
      queryForm.value.page_num = 1;
      queryForm.value.num = 10;
      queryForm.value.date_range = '';
      queryForm.value.operator = '';
    };

    /** 重置查询 */
    const onQueryResetClick = () => {
      resetQueryForm();

      reload();
    };

    const onImportLogDetailModalClose = async () => {
      listLogic.toggleModalVisible(false);

      listLogic.checkedImportLogDetail.value = {
        add_item: [],
        update_item: [],
        failed_item: [],
      };
    };

    return {
      onImportLogDetailModalClose,
      importUserList,
      Permission,
      onQuerySearchClick,
      onQueryResetClick,
      queryForm,
      handleCurrentChange,
      handlePageSizeChange,
      reload,
      loadImportUserList,
      ...listLogic,
    };
  },
  async mounted() {
    this.queryImportUserList();
    this.queryImportLogList();
  },
  methods: {
    async queryImportLogList() {
      await this.reload();
    },
    async queryImportUserList() {
      await this.loadImportUserList();
    },
  },
});
