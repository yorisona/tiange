/**
 * 公共管理 - 品牌管理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 00:23:46
 */
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useList } from './use/list';
import AddBrand from '@/modules/customer/brand/form/brand.vue';
import BrandItemCard from '@/modules/customer/brand/components/brandItemCard.vue';
import { Brand, BrandQueryParams } from '@/types/tiange/brand';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';

export default defineComponent({
  name: 'TgCustomerBrand',
  components: {
    AddBrand,
    BrandItemCard,
  },
  setup(props, ctx) {
    /** 新增弹窗显示 */

    const queryForm = ref<BrandQueryParams>({
      brand_name: '',
      page_num: 1,
      num: 1000,
    });

    const listLogic = useList(ctx);
    const onAddBrandModalClose = async (success: boolean) => {
      listLogic.toggleAddBrandModalVisible();
      listLogic.currentBrand.value = undefined;

      if (success) {
        await reload();
      }
    };

    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const queryData: BrandQueryParams = {
        page_num: queryForm.value.page_num,
        num: queryForm.value.num,
      };

      if (queryForm.value.brand_name) {
        queryData.brand_name = queryForm.value.brand_name;
      }

      await listLogic.loadData(queryData);
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

    /** 重置查询 */
    const onQueryResetClick = () => {
      queryForm.value.brand_name = '';
      reload();
    };

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.brand_list);
      const canEdit = HasPermission(RIGHT_CODE.brand_save);
      const canDelete = HasPermission(RIGHT_CODE.brand_delete);
      return { canEdit, canViewList, canDelete };
    });

    const handleBrandDelete = (item: Brand) => {
      listLogic.delBrandData(ctx, item);
    };

    const handleBrandEdit = (item: Brand) => {
      listLogic.editBrandData(item);
    };

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    return {
      Permission,
      reload,
      handleCurrentChange,
      handlePageSizeChange,
      onQuerySearchClick,
      onQueryResetClick,
      queryForm,
      onAddBrandModalClose,
      ...listLogic,
      handleBrandDelete,
      handleBrandEdit,
      onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
  async mounted() {
    this.queryBrandList();
  },
  methods: {
    async queryBrandList() {
      await this.reload();
    },
  },
});
