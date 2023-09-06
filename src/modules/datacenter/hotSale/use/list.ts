import { h, ref, SetupContext } from '@vue/composition-api';
import { wait } from '@/utils/func';
import { GetHotProjectList } from '@/services/datacenter';
import { TableColumn } from '@/types/vendor/column';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import { VNode } from 'vue/types/umd';
import { RouterDataCenter } from '@/const/router';
import { IHotProjectSearchParams } from '@/types/tiange/datacenter';

export const useList = (ctx: SetupContext) => {
  const loading = ref(false);
  const total = ref(0);
  const list = ref<any[]>([]);
  const loadData = async (payload: IHotProjectSearchParams) => {
    loading.value = true;
    const [{ data: response }] = await wait(500, GetHotProjectList(payload));
    loading.value = false;
    if (response.success) {
      list.value = response.data.data;
      total.value = response.data.total;
    } else {
      list.value = [];
      total.value = 0;
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

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

  /** 项目名称渲染函数 */
  const project_name_render = <T extends boolean>(row: any, text_only: T) => {
    return popoverFun(row, 'project_name', 30, text_only);
  };
  /** 项目名称最大宽度 */
  const project_name_max_length = max_length_of_column(list, '项目名称', project_name_render);

  const columns = ref<TableColumn<any>[]>([
    {
      label: '项目名称',
      minWidth: project_name_max_length.value + 80,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '监控账号数',
      property: 'monitor_account_count',
      minWidth: 100,
      align: 'center',
    },
    {
      label: '今日热销款数',
      property: 'hot_sale_count',
      minWidth: 110,
      align: 'center',
    },
    {
      label: '操作',
      width: 92,
      align: 'left',
      headerAlign: 'left',
      fixed: 'right',
      formatter: row => {
        const ItemList: VNode[] = [];
        ItemList.push(h('a', { on: { click: () => viewClick(row) } }, ['查看']));
        return ItemList;
      },
    },
  ]);

  /** 查看 */
  const viewClick = (row: any) => {
    ctx.root.$router.push({
      name: RouterDataCenter.hotSaleMonitorDetail,
      params: { id: `${row.project_id}`, project_name: `${row.project_name}` },
    });
  };

  return {
    loading,
    total,
    list,
    loadData,
    columns,
    viewClick,
  };
};
