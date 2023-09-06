/**
 * Tab页 列表逻辑复用
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 09:49:31
 */
import { h, onActivated, onBeforeMount, watch, watch as 观察 } from '@vue/composition-api';
import { useTabs } from '@/use/tab';
import {
  ApprovalListQueryParams,
  ApprovalSearchType,
  // ApprovalRecord,
} from '@/types/tiange/workbench';
import { useWorkbenchFilterBlock } from './useFilter';
import { useTable } from './useTable';
// import { max_length_of_column } from '@/utils/table';
import { ApprovalStatus } from '@/types/tiange/system';
// import { get_limited_length_string } from '@/utils/string';
// import { TableColumnRenderReturn } from '@/types/tiange/utils';

/**
 * 筛选项区块+Tabs(审批状态参数)+表格数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 10:20:14
 */
export const useList = (type: ApprovalSearchType = 2) => {
  const { getQueryParams, ...filter } = useWorkbenchFilterBlock();
  /**
   * 获取最终请求参数
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-11-18 10:22:11
   */
  const getPayload = (): ApprovalListQueryParams => {
    return {
      // 基本参数
      ...getQueryParams(),
      // 工作台类型参数
      approval_search_type: type,
      // 审批状态
      approval_status: undefined,
    };
  };

  const tabs = useTabs<ApprovalStatus | ''>([
    {
      label: '全部',
      value: '',
    },
    {
      label: '审批中',
      value: 1,
    },
    {
      label: '审批成功',
      value: 2,
    },
    {
      label: '审批失败',
      value: 3,
    },
    {
      label: '已撤销',
      value: 4,
    },
  ]);
  /** 项目名称渲染函数 */
  // const project_name_render = <T extends boolean>(row: ApprovalRecord, text_only: T) => {
  //   const data = row.project_name || '--';
  //
  //   const { is_folded, folded_text } = get_limited_length_string(data, 12);
  //
  //   return text_only || !is_folded
  //     ? folded_text
  //     : (h(
  //         'el-popover',
  //         {
  //           props: {
  //             placement: 'right',
  //             trigger: 'hover',
  //             content: data,
  //           },
  //         },
  //         [h('span', { slot: 'reference' }, [folded_text])],
  //       ) as TableColumnRenderReturn<T>);
  // };
  // const { loadData, ...restTable } = useTable(formatter);
  const { loadData, data, columns, ...restTable } = useTable();
  // const project_name_max_length = max_length_of_column(data, '项目名称', project_name_render);
  // columns.value[0].minWidth = project_name_max_length.value;
  // columns.value[0].formatter = row => project_name_render(row, false);
  // 重载数据
  const reload = async (clean = true) => {
    if (clean) {
      filter.queryForm.page_num = 1;
    }

    const payload = getPayload();

    const approval_status = tabs.checkedTab.value;
    await loadData({
      ...payload,
      ...(approval_status !== '' && type !== 1 ? { approval_status } : {}),
    });
  };

  // 重置表单并重载数据
  const reset = async () => {
    filter.resetForm();

    await reload();
  };

  // 状态筛选重载数据
  watch(
    () => tabs.checkedTab.value,
    () => reload(),
  );

  // 分页 - 页长
  const onPageSizeChange = (pageSize: number) => {
    filter.queryForm.num = pageSize;
    reload();
  };

  // 分页 - 当前页
  const onPageChange = (page: number) => {
    filter.queryForm.page_num = page;
    reload(false);
  };

  // * 发起时间清空时重置为空数组
  观察(
    () => filter.queryForm.start_time,
    当前值 => {
      if (当前值 === null) {
        filter.queryForm.start_time = [];
      }
    },
  );

  // * 结束时间清空时重置为空数组
  观察(
    () => filter.queryForm.end_time,
    当前值 => {
      if (当前值 === null) {
        filter.queryForm.end_time = [];
      }
    },
  );

  onActivated(() => {
    reset();
  });

  onBeforeMount(() => {
    reset();
  });

  return {
    columns,
    data,
    ...filter,
    getPayload,
    ...tabs,
    ...restTable,
    reload,
    reset,
    onPageSizeChange,
    onPageChange,
  };
};
