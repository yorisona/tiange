/**
 * 公司管理列表页
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 00:54:23
 */
import { computed, defineComponent, onActivated, onBeforeMount, ref } from '@vue/composition-api';
import { BatchDeleteCompany } from '@/services/company';
import type { Company, CompanyListQueryParams } from '@/types/tiange/company';
import { useFilter } from './useFilter';
import { useList } from './useList';
import { downloadFileFromLink, ObjectFilterEmpty, URLSearchMaker } from '@/utils/func';
import { useCompanyRight } from './useRight';
import { CUST_EXPORT_COMPANY } from '@/apis/customer';
import { getToken } from '@/utils/token';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterNameCustomer } from '@/const/router';
import formDrawer from './form/drawer.vue';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { useRouter } from '@/use/vue-router';
import { customerCompanyVerifyStatusEnum } from '@/const/companyConst';

export default defineComponent({
  name: 'TgCustomerCompany',
  components: {
    formDrawer,
  },
  setup(props, ctx) {
    const router = useRouter();
    /**
     * ```
     * 是否显示 新增店铺 导出 删除 按钮
     * 营销业务/客户列表 不显示
     * 客户管理/客户列表 显示
     * 这两个菜单 共用当前文件
     * ```
     */
    const showOperationButton = computed(() =>
      [RouterNameCustomer.list, RouterNameCustomer.listTab].includes(ctx.root.$route.name ?? ''),
    );

    const rights = useCompanyRight(ctx);
    const { filterForm, resetForm, getParams } = useFilter();
    const { loadData, ...list } = useList(ctx, rights);

    const submit = async (payload: CompanyListQueryParams) => {
      await loadData(payload);
    };

    // 重载数据
    const reload = async (clean = true) => {
      if (clean) {
        filterForm.page_num = 1;
      }

      const payload: any = {
        ...getParams(),
      };

      submit(payload);
    };

    // 重置筛选表单并重载数据
    const reset = async () => {
      resetForm();
      await reload();
    };

    // 分页 - 页长
    const onPageSizeChange = (pageSize: number) => {
      filterForm.num = pageSize;
      reload();
    };

    // 分页 - 当前页
    const onPageChange = (page: number) => {
      filterForm.page_num = page;
      reload(false);
    };

    // 响应表单默认触发的提交事件
    const onFilterFormSubmit = () => {
      reload(true);
    };

    onActivated(() => {
      // reset();
      const payload: any = {
        ...getParams(),
      };

      submit(payload);
    });

    onBeforeMount(() => {
      reset();
    });

    /**
     * 批量删除公司
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-10-31 11:12:33
     */
    const onDeleteBtnClick = async () => {
      if (list.selectionCount.value === 0) {
        return false;
      }

      // 若包含导出权限
      // 需要检查选中数据是否包含不可删除公司(有关联店铺)
      if (
        !rights.hasOnlyDeleteRight.value &&
        list.selectionList.value.filter(row => (row.brands?.length || 0) > 0).length > 0
      ) {
        ctx.root.$SimpleTDialog('选择的公司中包含关联店铺的数据，不允许删除');
        return;
      }

      const result = await AsyncConfirm(ctx, '删除后数据无法恢复，是否继续操作？');

      if (!result) {
        return false;
      }

      const { data: response } = await BatchDeleteCompany({
        ids: list.selectionList.value.map(el => el.id),
      });

      if (response.success) {
        ctx.root.$message.success('删除成功');
        await reload();
      } else {
        ctx.root.$message.error(response.message ?? '删除失败');
      }
    };

    /**
     * 导出
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-11-06 14:56:35
     */
    const exportCompany = () => {
      const params = URLSearchMaker(
        ObjectFilterEmpty({
          ids: list.selectionList.value.map(el => el.id).join(','),
          company_name: filterForm.company_name,
          Authorization: getToken(),
        }),
      ).toString();

      const url = CUST_EXPORT_COMPANY + '?' + params;

      downloadFileFromLink(process.env.VUE_APP_BASE_API + url);
    };

    /** 是否显示按钮(任一按钮具备显示权限即可) */
    const button_show_all = computed(
      () =>
        showOperationButton.value &&
        (rights.hasRightAddCompany.value ||
          rights.hasRightExportCompany.value ||
          rights.hasRightDelCompany.value),
    );

    const formDrawerRef = ref<null | { open: (data?: Company) => void }>(null);

    const onCreateBtnClick = () => {
      formDrawerRef.value?.open();
    };
    const onCreateBtnClickNew = () => {
      router.push({ name: RouterNameCustomer.companyAdd });
    };

    // 自适应表格高度部分

    const buttonLineHeight = 32;
    const paginationLineHeight = 46;
    const rectPadding = 30;
    const otherHeight = 12;

    const topCardHeight = ref(0);

    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      fixedBlockHeightRefs: [topCardHeight],
      pagename: 'customer_company',
    });

    const companyVerifyStatusFilter = [
      {
        label: '审核中',
        value: String(customerCompanyVerifyStatusEnum.PENDING),
      },
      {
        label: '已通过',
        value: String(customerCompanyVerifyStatusEnum.APPROVED),
      },
      {
        label: '未通过',
        value: String(customerCompanyVerifyStatusEnum.NOT_APPROVED),
      },
      {
        label: '未提交',
        value: String(customerCompanyVerifyStatusEnum.NOT_COMMIT),
      },
    ];

    return {
      showOperationButton,
      filterForm,
      reload,
      reset,
      onPageSizeChange,
      onPageChange,
      onFilterFormSubmit,
      ...list,
      onDeleteBtnClick,
      onCreateBtnClick,
      onCreateBtnClickNew,
      exportCompany,
      ...rights,
      button_show_all,
      formDrawerRef,
      ...tableHeightLogic,
      onTopCardRectUpdate,
      companyVerifyStatusFilter,
    };
  },
});
