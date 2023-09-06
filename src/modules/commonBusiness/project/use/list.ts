/**
 * 通用业务 - 项目管理 - 列表 - 列表逻辑
 * @author  Wuyou <wuyou@goumee.com>
 * @since   2021-05-06 14:13:53
 */

import { computed, h, ref, SetupContext } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { CommonBusinessProject, ProjectTypeEnumMap } from '@/types/tiange/commonBusiness/project';
import { sleep } from '@/utils/func';
import { GetCommonBusinessProjectList } from '@/services/commonBusiness/project';
import { CommonBusinessProjectQueryParams } from '@/types/tiange/commonBusiness/project';
import moment from 'moment';
import { max_length_of_column } from '@/utils/table';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { ProjectStatusEnum } from '@/types/tiange/common';

export const useList = (ctx: SetupContext) => {
  const loading = ref(false);
  /** 数据列表 */
  const list = ref<CommonBusinessProject[]>([]);
  const total = ref(0);

  const loadData = async (payload: CommonBusinessProjectQueryParams) => {
    loading.value = true;

    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetCommonBusinessProjectList(payload),
    ]);

    loading.value = false;
    if (response.success) {
      list.value = response.data.data;
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

  /** 项目编号渲染函数 */
  const project_uid_render = (row: CommonBusinessProject) => row.project_uid ?? '--';

  /** 项目名称渲染函数 */
  const project_name_render = <T extends boolean>(row: CommonBusinessProject, text_only: T) => {
    const data = row.project_name || '--';

    const { is_folded, folded_text } = get_limited_length_string(data, 12);

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
            h('DefText', { props: { content: row.project_name } }),
          ],
        ) as TableColumnRenderReturn<T>);
  };
  /** 项目名称最大宽度 */
  const project_name_max_length = max_length_of_column(list, '项目名称', project_name_render);

  const columns = computed<TableColumn<CommonBusinessProject>[]>(() => [
    {
      label: '项目编码',
      property: 'project_uid',
      fixed: 'left',
      minWidth: max_length_of_column(list, '项目编码', project_uid_render).value,
      formatter: project_uid_render,
    },
    {
      label: '项目名称',
      property: 'project_name',
      'show-show-overflow-tooltip': true,
      fixed: 'left',
      minWidth: project_name_max_length.value,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '所属部门',
      minWidth: 118,
      'show-overflow-tooltip': true,
      align: 'left',
      formatter: row => {
        return row.feishu_department_name ? row.feishu_department_name : '--';
      },
    },
    {
      label: '业务平台',
      minWidth: 98,
      align: 'center',
      property: 'platform_type',
      formatter: row => {
        let platform_type = '--';
        if (row.platform_type === 1) {
          platform_type = '抖音平台';
        } else if (row.platform_type === 2) {
          platform_type = '淘宝平台';
        }
        return h('div', {}, [platform_type]);
      },
    },
    {
      label: '项目类型',
      minWidth: 98,
      align: 'center',
      formatter: row => {
        const project_type = ProjectTypeEnumMap.get(row.mcn_project_type) ?? '--';

        // if (row.mcn_project_type === 1) {
        //   project_type = '达人项目';
        // } else if (row.mcn_project_type === 2) {
        //   project_type = '明星项目';
        // } else if (row.mcn_project_type === 3) {
        //   project_type = '美妆项目';
        // } else if (row.mcn_project_type === 4) {
        //   project_type = '团长项目';
        // } else if (row.mcn_project_type === 5) {
        //   project_type = '淘宝CPS';
        // } else if (row.mcn_project_type === 6) {
        //   project_type = 'V任务';
        // }
        return h('div', {}, [project_type]);
      },
    },
    {
      label: '项目经理',
      minWidth: 88,
      'show-overflow-tooltip': true,
      align: 'center',
      formatter: row => {
        return row.project_manager || '--';
      },
    },
    {
      label: '项目阶段',
      minWidth: 88,
      align: 'center',
      formatter: row => {
        return h('div', {}, [
          row.project_status === ProjectStatusEnum.execution
            ? '执行中'
            : row.project_status === ProjectStatusEnum.executionEnd
            ? '执行结束'
            : '已完结',
        ]);
      },
    },
    {
      label: '创建人',
      minWidth: 98,
      align: 'center',
      'show-overflow-tooltip': true,
      property: 'add_by_username',
      formatter: row => {
        return row.add_by_username || '--';
      },
    },
    {
      label: '创建日期',
      minWidth: 110,
      align: 'center',
      property: 'add_by_username',
      formatter: row => {
        return h('div', {}, [moment(row.gmt_create).format('YYYY.MM.DD')]);
      },
    },
  ]);

  return {
    loadData,
    list,
    loading,
    total,
    columns,
  };
};
