/**
 * 店铺代播 - 直播场次 - 列表逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 11:26:10
 */
import { ref, SetupContext, h, computed } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { LiveDisplay, LiveDisplayQueryParams, LiveDisplayStatusMap } from '@/types/tiange/live';
import { LiveDisplayQuery } from '@/services/live';
import { LiveDisplayStatus } from '@/types/tiange/live';
import { RouterNameProjectManage } from '@/const/router';
import { BusinessTypeMap } from '@/types/tiange/common';
import { wait } from '@/utils/func';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';

export const useList = (ctx: SetupContext) => {
  const loading = ref(false);
  const total = ref(0);
  const list = ref<LiveDisplay[]>([]);

  const loadData = async (
    payload: LiveDisplayQueryParams,
    business_type: number | undefined = E.project.BusinessType.douyin,
  ) => {
    loading.value = true;
    const [{ data: response }] = await wait(500, LiveDisplayQuery(payload, business_type));
    loading.value = false;

    if (response.success) {
      list.value = response.data.data;
      total.value = response.data.total;
    } else {
      list.value = [];
      total.value = 0;
      ctx.root.$message.warning(response.message ?? '查询失败，稍后重试');
    }
  };

  // 直播时间生成
  const liveTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return '';
    }
    const newLiveTime = `${startTime} ~ ${endTime}`;
    return newLiveTime.replace(/-/g, '.');
  };

  const statusColor = (status?: LiveDisplayStatus) => {
    switch (status) {
      case LiveDisplayStatus.lived:
        return 'color: #A4B2C2';
      case LiveDisplayStatus.waitingLive:
        return 'color: var(--success-color)';
      default:
        return 'color: #FF7A36';
    }
  };

  const handleProjectUidAction = (liveDisplay: LiveDisplay) => {
    const { href } = ctx.root.$router.resolve({
      name: RouterNameProjectManage.live.project.detail,
      params: {
        id: `${liveDisplay.project_id}`,
        type: '1',
        step: '2',
      },
    });
    window.open(href, '_blank');
  };

  /** 直播标题渲染函数 */
  const live_title_render = <T extends boolean>(row: LiveDisplay, text_only: T) => {
    const { is_folded, text, folded_text } = get_limited_length_string(row.live_title, 12);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'bottom',
              trigger: 'hover',
              content: text,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  /** 直播标题最大宽度 */
  const live_title_min_length = max_length_of_column(list, '直播标题', live_title_render);

  /** 直播时间渲染函数 */
  const live_time_render = (row: LiveDisplay) => liveTime(row.live_start_time, row.live_end_time);

  /** 品牌渲染函数 */
  const brand_name_render = (row: LiveDisplay) => (row.brand_name ? row.brand_name : '--');

  /** 品牌最大宽度 */
  const brand_name_min_length = max_length_of_column(list, '品牌', brand_name_render);

  /**
   * 直播间渲染函数
   * @param {LiveDisplay} row 数据
   * @param {boolean} text_only 是否纯文本模式，默认 false 纯文本模式仅返回纯文本用于计算长度
   */
  const studio_name_render = <T extends boolean>(
    row: LiveDisplay,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const { is_folded, folded_text } = get_limited_length_string(
      row.studio_name ? row.studio_name : '--',
    );

    if (text_only) {
      return folded_text;
    }

    return is_folded
      ? (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: row.studio_name,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>)
      : folded_text;
  };

  /** 直播间最大宽度 */
  const studio_name_min_length = max_length_of_column(list, '直播间', studio_name_render);

  const columns = computed<TableColumn<LiveDisplay>[]>(() => [
    {
      label: '直播标题',
      property: 'live_title',
      minWidth: live_title_min_length.value,
      formatter: row => live_title_render(row, false),
    },
    {
      label: '直播时间',
      property: 'live_start_time',
      minWidth: 290,
      formatter: live_time_render,
    },
    {
      label: '品牌',
      property: 'brand_name',
      minWidth: brand_name_min_length.value,
      formatter: brand_name_render,
    },
    {
      label: '直播间',
      property: 'studio_name',
      minWidth: studio_name_min_length.value,
      formatter: row => studio_name_render(row, false),
    },
    {
      label: '项目信息',
      property: 'project_uid',
      align: 'left',
      minWidth: 163,
      headerAlign: 'left',
      formatter: row =>
        h(
          'a',
          {
            class: 'project-info',
            on: {
              click: (event: MouseEvent) => {
                handleProjectUidAction(row);
                event.stopPropagation();
              },
            },
          },
          [
            h('div', { class: 'line-clamp-1' }, row.project_name ?? '--'),
            h('div', { class: 'line-clamp-1' }, row.project_uid),
          ],
        ),
    },
    {
      label: '业务类型',
      property: 'business_type',
      align: 'center',
      minWidth: 80,
      headerAlign: 'center',
      formatter: row => h('span', BusinessTypeMap.get(row.business_type)),
    },
    {
      label: '直播状态',
      property: 'live_status',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
      formatter: row =>
        h(
          'span',
          { style: statusColor(row.live_status) },
          LiveDisplayStatusMap.get(<LiveDisplayStatus>row.live_status),
        ),
    },
  ]);

  return { columns, list, total, loading, loadData };
};
