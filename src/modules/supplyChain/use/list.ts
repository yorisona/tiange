/**
 * 店铺代播 - 项目管理 - 列表 - 列表逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 13:34:11
 */

import { computed, h, ref, SetupContext } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { LiveProject, LiveProjectQueryParams } from '@/types/tiange/live.project';
import { sleep } from '@/utils/func';
import { GetquerySupplyChainProject } from '@/services/live.project';
import { CooperationTypeMap, ProjectStatusMap, BusinessTypeMap } from '@/types/tiange/common';
import { max_length_of_column } from '@/utils/table';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';

export const useList = (ctx: SetupContext) => {
  const AddProjectVisible = ref(false);
  const loading = ref(false);

  /** 数据列表 */
  const list = ref<LiveProject[]>([]);
  const total = ref(0);

  const toggleAddProjectModalVisible = (visible = false) => {
    AddProjectVisible.value = visible;
  };

  const loadData = async (payload: LiveProjectQueryParams) => {
    loading.value = true;

    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetquerySupplyChainProject(payload),
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
  const project_uid_render = (row: LiveProject) => row.project_uid;

  /** 项目名称渲染函数 */
  const project_name_render = <T extends boolean>(row: LiveProject, text_only: T) => {
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
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  /** 项目名称最大宽度 */
  const project_name_max_length = max_length_of_column(list, '项目名称', project_name_render);

  /** 客户名称渲染函数 */
  // const shop_name_render = <T extends boolean>(row: LiveProject, text_only: T) => {
  //   const data = row.shop_name || '--';
  //   const { is_folded, folded_text } = get_limited_length_string(data, 12);
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
  const brand_name_render = <T extends boolean>(row: LiveProject, text_only: T) => {
    const data = row.brand_name || '--';
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
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  /** 客户名称渲染函数 */
  const company_name_render = <T extends boolean>(row: LiveProject, text_only: T) => {
    const data = row.company_name || '--';
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
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };
  const department_name_render = <T extends boolean>(row: LiveProject, text_only: T) => {
    const data = row.feishu_department_name || '--';
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
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  /** 公司名称最大宽度 */
  const company_name_max_length = max_length_of_column(list, '公司名称', company_name_render);

  /** 店铺最大宽度 */
  // const shop_name_max_length = max_length_of_column(list, '店铺名称', shop_name_render);

  const brand_name_max_length = max_length_of_column(list, '店铺名称', brand_name_render);

  const columns = computed<TableColumn<LiveProject>[]>(() => [
    {
      label: '项目编号',
      property: 'project_uid',
      fixed: 'left',
      minWidth: max_length_of_column(list, '项目编号', project_uid_render).value,
      formatter: project_uid_render,
    },
    {
      label: '项目名称',
      property: 'project_name',
      fixed: 'left',
      minWidth: project_name_max_length.value,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '所属部门',
      align: 'center',
      'show-overflow-tooltip': true,
      property: 'feishu_department_name',
      minWidth: 120,
      formatter: row => department_name_render(row, false),
    },
    {
      label: '公司名称',
      property: 'company_name',
      minWidth: company_name_max_length.value,
      formatter: row => company_name_render(row, false),
    },
    // {
    //   label: '店铺名称',
    //   property: 'shop_name',
    //   minWidth: shop_name_max_length.value,
    //   formatter: row => shop_name_render(row, false),
    // },
    {
      label: '品牌',
      property: 'brand_name',
      minWidth: brand_name_max_length.value,
      formatter: row => brand_name_render(row, false),
    },
    {
      label: '合作类型',
      minWidth: 90,
      property: 'cooperation_type',
      align: 'center',
      formatter: row => CooperationTypeMap.get(row.cooperation_type) ?? '',
    },
    {
      label: '项目阶段',
      minWidth: 98,
      align: 'center',
      property: 'project_status',
      formatter: row => ProjectStatusMap.get(row.project_status) ?? '',
    },
    {
      label: '业务类型',
      minWidth: 115,
      property: 'business_type',
      formatter: row => {
        BusinessTypeMap.get(row.business_type) ?? '';
        const str = BusinessTypeMap.get(row.business_type ?? 0);
        return str;
      },
    },
    {
      label: '客户经理',
      minWidth: 80,
      'show-overflow-tooltip': true,
      align: 'center',
      property: 'customer_manager',
      formatter: row => {
        if (row.customer_manager !== '') {
          return h('el-popover', {}, [
            h('div', { class: 'line-clamp-1', slot: 'reference' }, [row.customer_manager]),
            h('div', { style: { width: '80px' } }, [row.customer_manager]),
          ]);
        } else {
          return h('DefText', { props: { content: '' } });
        }
      },
    },
    {
      label: '项目经理',
      minWidth: 80,
      'show-overflow-tooltip': true,
      align: 'center',
      property: 'project_manager',
      formatter: row => {
        if (row.project_manager !== '') {
          return h('el-popover', {}, [
            h('div', { class: 'line-clamp-1', slot: 'reference' }, [row.project_manager]),
            h('div', { style: { width: '80px' } }, [row.project_manager]),
          ]);
        } else {
          return h('DefText', { props: { content: '' } });
        }
      },
    },
  ]);

  return {
    loadData,
    list,
    loading,
    total,
    columns,
    toggleAddProjectModalVisible,
    AddProjectVisible,
  };
};
