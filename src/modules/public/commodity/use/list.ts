import { h, ref, SetupContext } from '@vue/composition-api';
import { CommodityQueryParams, CommodityItem } from '@/types/tiange/public';
import { wait } from '@/utils/func';
import { GetCommodityList, DeleteCommodity } from '@/services/public';
import { TableColumn } from '@/types/vendor/column';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import { VNode } from 'vue/types/umd';
import { $TDialog } from '@/components/Dialog';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { numberFormat } from '@/utils/formatMoney';

export const useList = (ctx: SetupContext) => {
  const canEdit = HasPermission(RIGHT_CODE.commodity_information_manager_edit);
  const canDelete = HasPermission(RIGHT_CODE.commodity_information_manager_delete);
  const editVisible = ref(false);
  const loading = ref(false);
  const currentCommodity = ref<CommodityItem | undefined>(undefined);
  const total = ref(0);
  const list = ref<CommodityItem[]>([]);
  const params = ref({});
  const loadData = async (payload: CommodityQueryParams) => {
    params.value = payload;
    loading.value = true;
    const [{ data: response }] = await wait(500, GetCommodityList(payload));
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
    console.log(folded_text, is_folded);
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
    return popoverFun(row, 'project_name', 11, text_only);
  };
  /** 所属公司最大宽度 */
  const project_name_max_length = max_length_of_column(list, '项目名称', project_name_render);

  /** 商品编码渲染函数 */
  const product_code_render = <T extends boolean>(row: any, text_only: T) => {
    return popoverFun(row, 'item_id', 20, text_only);
  };

  /** 商品款号渲染函数 */
  const product_num_render = <T extends boolean>(row: any, text_only: T) => {
    return popoverFun(row, 'item_sn', 12, text_only);
  };

  const columns = ref<TableColumn<any>[]>([
    {
      label: '项目名称',
      minWidth: project_name_max_length.value + 80,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '商品编码',
      minWidth: 162,
      align: 'center',
      formatter: row => product_code_render(row, false),
    },
    {
      label: '商品款号',
      minWidth: 160,
      formatter: row => product_num_render(row, false),
    },
    {
      label: '自定义一级类目',
      property: 'first_tiange_cat_name',
      minWidth: 140,
      align: 'center',
    },
    {
      label: '自定义三级类目',
      property: 'third_tiange_cat_name',
      minWidth: 140,
      align: 'center',
    },
    {
      label: '商品年度',
      property: 'year',
      minWidth: 90,
      align: 'center',
    },
    {
      label: '商品季度',
      property: 'season',
      minWidth: 90,
      align: 'center',
      formatter: row => {
        switch (row.season) {
          case 1:
            return '春季';
          case 2:
            return '夏季';
          case 3:
            return '秋季';
          case 4:
            return '冬季';
          default:
            return '--';
        }
      },
    },
    {
      label: '重点款',
      property: 'season',
      minWidth: 90,
      align: 'center',
      formatter: row => {
        switch (row.is_key) {
          case 1:
            return '是';
          case 0:
            return '否';
          default:
            return '--';
        }
      },
    },
    {
      label: '目标销量',
      property: 'season',
      align: 'right',
      minWidth: 120,
      formatter: row => {
        return row.target_sale_count !== null
          ? numberFormat(Number(row.target_sale_count), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '创建人',
      property: 'add_by',
      align: 'center',
      width: 100,
    },
    {
      label: '创建时间',
      align: 'center',
      property: 'gmt_create',
      width: 120,
    },
    {
      label: '操作',
      width: 92,
      align: 'left',
      headerAlign: 'left',
      fixed: 'right',
      formatter: row => {
        const ItemList: VNode[] = [];
        if (canEdit) {
          ItemList.push(h('a', { on: { click: () => editClick(row) } }, ['编辑']));
        }
        if (canDelete) {
          ItemList.push(h('a', { on: { click: () => delClick(ctx, row) } }, ['删除']));
        }
        return h('div', { class: 'operation' }, ItemList);
      },
    },
  ]);

  /** 编辑商品 */
  const editClick = (row: any) => {
    editVisible.value = true;
    currentCommodity.value = row;
  };

  /** 删除商品 */
  const delClick = async (ctx: SetupContext, row: any) => {
    const result = await new Promise(resolve => {
      $TDialog({
        title: '确认删除本条商品信息吗',
        onConfirm: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
    if (!result) {
      return;
    }
    const res: any = await DeleteCommodity(row.id);
    if (res.data.success) {
      ctx.root.$message.success('删除成功');
      loadData({ ...params.value, page_num: 1, num: 20 });
    } else {
      ctx.root.$message.error(res.data.message);
    }
  };

  return {
    loading,
    total,
    list,
    loadData,
    columns,
    editVisible,
    currentCommodity,
  };
};
