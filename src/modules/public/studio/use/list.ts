/**
 * 公共管理 - 直播间管理 - 列表逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 09:43:53
 */
import { computed, h, ref, SetupContext } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { Studio, StudioQueryParams } from '@/types/tiange/studio';
import { sleep } from '@/utils/func';
import { GetStudioList } from '@/services/studio';
import { BusinessTypeMap } from '@/types/tiange/common';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';

export const useList = (ctx: SetupContext) => {
  /** 权限检查 */
  const Permission = computed(() => {
    const canEdit = HasPermission(RIGHT_CODE.live_studio_modify);
    return { canEdit };
  });

  const AddStudioVisible = ref(false);
  const loading = ref(false);
  const currentStudio = ref<Studio | undefined>(undefined);

  const toggleAddStudioModalVisible = (visible = false) => {
    AddStudioVisible.value = visible;
  };

  /** 数据列表 */
  const list = ref<Studio[]>([]);
  const total = ref(0);

  const loadData = async (payload: StudioQueryParams) => {
    loading.value = true;

    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetStudioList(payload),
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

  /** 编辑直播间 */
  const editFormData = (row: Studio) => {
    currentStudio.value = row;
    toggleAddStudioModalVisible(true);
  };

  const name_render = <T extends boolean>(
    row: Studio,
    field: 'studio_name',
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row[field] || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 12);
    if (text_only) {
      return folded_text;
    }

    return is_folded
      ? (h(
          'el-popover',
          {
            props: {
              placement: 'right',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>)
      : folded_text;
  };

  /** 直播间名称渲染函数 */
  const studio_name_render = <T extends boolean>(
    row: Studio,
    text_only: T,
  ): TableColumnRenderReturn<T> => name_render(row, 'studio_name', text_only);

  /** 直播间名称最大宽度 */
  const studio_name_max_length = max_length_of_column(list, '直播间名称', studio_name_render);

  /** 业务类型渲染函数 */
  const business_type_render = (row: Studio) =>
    row.business_type.map(el => BusinessTypeMap.get(el) ?? '').join('、');

  /** 业务类型最大长度 */
  // const business_type_max_length = max_length_of_column(list, '业务类型', business_type_render);

  const columns = computed<TableColumn<Studio>[]>(() => [
    {
      label: '直播间名称',
      property: 'studio_name',
      minWidth: studio_name_max_length.value,
      formatter: row => studio_name_render(row, false),
    },
    {
      label: '业务类型',
      property: 'business_type',
      minWidth: 300,
      formatter: business_type_render,
    },
    {
      label: '直播间地址',
      minWidth: 200,
      property: 'studio_address',
      formatter: row => {
        if (row.studio_address && row.studio_address !== '' && row.studio_address!.length > 12) {
          return h(
            'el-popover',
            {
              props: {
                palcement: 'top',
                trigger: 'hover',
              },
            },
            [
              h('div', { class: 'line-clamp-2', slot: 'reference' }, [row.studio_address]),
              h('div', { style: { minWidth: '20px', maxWidth: '400px' } }, [row.studio_address]),
            ],
          );
        } else {
          return h('DefText', { props: { content: row.studio_address } });
        }
      },
    },
    {
      label: '操作',
      width: 86,
      formatter: row =>
        Permission.value.canEdit
          ? h('a', { on: { click: () => editFormData(row) } }, ['编辑'])
          : '',
    },
  ]);

  return {
    currentStudio,
    list,
    total,
    columns,
    toggleAddStudioModalVisible,
    AddStudioVisible,
    loading,
    loadData,
  };
};
