/**
 * 公共管理 - 品牌管理 - 列表逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 00:29:38
 */
import { computed, h, ref, SetupContext } from '@vue/composition-api';
import { Brand, BrandQueryParams } from '@/types/tiange/brand';
import { DeleteBrand, GetBrandList } from '@/services/brand';
import { TableColumn } from '@/types/vendor/column';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RIGHT_CODE } from '@/const/rightCode';
import { VNode } from 'vue/types/umd';
import { HasPermission } from '@/use/permission';

export const useList = (ctx: SetupContext) => {
  /** 权限检查 */
  const Permission = computed(() => {
    const canDelete = HasPermission(RIGHT_CODE.brand_delete);
    const canEdit = HasPermission(RIGHT_CODE.brand_save);
    return { canEdit, canDelete };
  });

  const AddBrandVisible = ref(false);
  const currentBrand = ref<Brand | undefined>(undefined);
  const loading = ref(false);

  const toggleAddBrandModalVisible = (visible = false) => {
    AddBrandVisible.value = visible;
  };

  /** 数据列表 */
  const list = ref<Brand[]>([]);
  const total = ref(0);

  const loadData = async (payload: BrandQueryParams) => {
    loading.value = true;

    const [{ data: response }] = await Promise.all([await GetBrandList(payload)]);

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

  /** 编辑品牌 */
  const editBrandData = (row: Brand) => {
    currentBrand.value = row;
    toggleAddBrandModalVisible(true);
  };

  /** 删除品牌 */
  const delBrandData = async (ctx: SetupContext, row: Brand) => {
    const confirm = await AsyncConfirm(ctx, '确认删除该品牌？');

    if (confirm) {
      const { data: response } = await DeleteBrand(row.id);

      if (response.success) {
        ctx.root.$message.success('删除成功');
        await loadData({ page_num: 1, num: 1000 });
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '删除失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    }
  };

  const columns = ref<TableColumn<Brand>[]>([
    {
      label: '品牌名称',
      property: 'brand_name',
      align: 'left',
      headerAlign: 'left',
    },
    {
      label: '操作',
      width: 92,
      align: 'left',
      headerAlign: 'left',
      formatter: row => {
        const ItemList: VNode[] = [];

        if (Permission.value.canEdit) {
          ItemList.push(h('a', { on: { click: () => editBrandData(row) } }, ['编辑']));
        }
        if (Permission.value.canDelete) {
          ItemList.push(h('a', { on: { click: () => delBrandData(ctx, row) } }, ['删除']));
        }

        return h('div', { class: 'operation' }, ItemList);
      },
    },
  ]);

  return {
    columns,
    list,
    total,
    currentBrand,
    loadData,
    loading,
    toggleAddBrandModalVisible,
    AddBrandVisible,
    delBrandData,
    editBrandData,
  };
};
