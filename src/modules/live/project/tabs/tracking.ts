/**
 * 店铺代播 - 项目管理 - 项目详情 - 跟踪事项
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 15:49:13
 */

import {
  defineComponent,
  onMounted,
  Ref,
  ref,
  SetupContext,
  onUnmounted,
  computed,
  h,
} from '@vue/composition-api';
import trackingEventDialog from '../dialog/tracking.event.vue';
import { TrackMatter } from '@/types/tiange/live';
import { TrackMasterQuery } from '@/services/live';
import { TableColumn } from '@/types/vendor/column';
import { get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { BooleanType } from '@/types/base/advanced';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';

export default defineComponent({
  name: 'TgLiveProjectDetailTabTracking',
  props: {},
  components: {
    trackingEventDialog,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = false;
      const canEdit = false;

      return { canViewList, canEdit };
    });

    return { ...tableDataList(ctx), Permission };
  },
});

// 列表数据
function tableDataList(ctx: SetupContext) {
  const mastterRef = ref<any | undefined>(undefined);
  const popoverEnable = ref(false);
  const project_id = parseInt(ctx.root.$router.currentRoute.params['id'], 10);

  const shouldEditing = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const tableData = ref<TrackMatter[]>([]);

  const track_matter_render = <T extends boolean>(row: TrackMatter, text_only: T) => {
    const { is_folded, folded_text } = get_limited_length_string(row.track_matter);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'right',
              trigger: 'hover',
            },
          },
          [
            h('span', { slot: 'reference' }, [folded_text]),
            h('div', { style: { width: '300px' } }, [row.track_matter]),
          ],
        ) as TableColumnRenderReturn<T>);
  };

  const track_matter_max_length = max_length_of_column(tableData, '跟踪事项', track_matter_render);

  const columns = computed<TableColumn<TrackMatter>[]>(() => [
    {
      label: '跟踪事项',
      minWidth: track_matter_max_length.value,
      formatter: row => track_matter_render(row, false),
    },
    {
      label: '预计完成',
      minWidth: 172,
      formatter: row => (row.expect_complete_date ? getFormatDate(row.expect_complete_date) : '--'),
    },
    {
      label: '是否完成',
      minWidth: 56,
      align: 'center',
      formatter: row => (row.is_complete ? '是' : '否'),
    },
    {
      label: '完成时间',
      minWidth: 172,
      formatter: row => (row.complete_date ? getFormatDate(row.complete_date) : '--'),
    },

    {
      label: '操作',
      width: 78,
      formatter: (row, col, val, index) => {
        return h(
          'a',
          {
            attrs: { disabled: row.is_complete === BooleanType.YES },
            on: {
              click: () => {
                if (row.is_complete === BooleanType.NO) {
                  handleEditEventAction(index);
                }
              },
            },
          },
          ['编辑'],
        );
      },
    },
  ]);

  const popoverEnabldFunc = () => {
    ctx.root.$nextTick(() => {
      if (mastterRef.value) {
        popoverEnable.value = mastterRef.value.clientHeight + 3 < mastterRef.value.scrollHeight;
      }
    });
  };

  const editingTrackMaster = ref<TrackMatter | undefined>(undefined);
  // 新增事项 点击事件
  const handleAddEventAction = () => {
    editingTrackMaster.value = undefined;
    shouldEditing.value = !shouldEditing.value;
  };
  // 编辑事项 点击事件
  const handleEditEventAction = (index: number) => {
    if (tableData.value[index].is_complete) {
      return;
    }
    editingTrackMaster.value = tableData.value[index];
    shouldEditing.value = !shouldEditing.value;
  };
  // 编辑事项成功回调
  const handleEditingSucceedAction = () => {
    shouldEditing.value = !shouldEditing.value;
    // 发送 获取事项列表请求
    getTrackMasterList(project_id, tableData, loading, popoverEnabldFunc);
  };
  // 弹框关闭事件
  const handleCloseAction = () => {
    editingTrackMaster.value = undefined;
    shouldEditing.value = false;
  };

  const getFormatDate = (date: string) => {
    if (!date) {
      return '--';
    }
    return date.replace(/-/g, '.');
  };

  onMounted(() => {
    popoverEnabldFunc();
    window.addEventListener('resize', popoverEnabldFunc);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', popoverEnabldFunc);
  }),
    // 发送 获取事项列表请求
    getTrackMasterList(project_id, tableData, loading, popoverEnabldFunc);

  // 自适应表格高度部分
  const buttonLineHeight = 32;
  const paginationLineHeight = 0;
  const rectPadding = 36;
  const otherHeight = 31 + 76;

  const tableHeightLogic = useAutoTableHeightInCard({
    compensation: computed(
      () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
    ),
    fixedBlockHeightRefs: [],
    tableMinHeight: 100,
  });

  return {
    columns,
    mastterRef,
    popoverEnable,
    shouldEditing,
    tableData,
    loading,
    getFormatDate,
    editingTrackMaster,
    handleAddEventAction,
    handleEditEventAction,
    handleEditingSucceedAction,
    handleCloseAction,
    project_id,
    ...tableHeightLogic,
  };
}

// 获取事项列表请求
async function getTrackMasterList(
  id: number | undefined,
  tableData: Ref<TrackMatter[]>,
  loading: Ref<boolean>,
  callBack: () => void,
) {
  if (!id) {
    return;
  }
  loading.value = true;
  const res = await TrackMasterQuery({
    num: 1000,
    page_num: 1,
    project_id: id,
  });
  loading.value = false;
  tableData.value = res.data.data.data;
  callBack();
}
