import { computed, defineComponent, ref } from '@vue/composition-api';
import { SalesFollowQueryParams, CustomerFollowList } from '@/types/tiange/sales.follow';
import { useList } from './use/list';
import { RouterNameSales } from '@/const/router';
import salesFollowAddDialog from './dialog/add.vue';
import { useRouter } from '@/use/vue-router';
import { useUserInfo } from '@/use/vuex';
import { usePermission } from '@/use/permission';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { BusinessTypeOptions } from '@/types/tiange/common';

export default defineComponent({
  name: 'SalesFollowList',
  components: {
    salesFollowAddDialog,
  },
  setup(props, ctx) {
    const shouldEditing = ref<boolean>(false);
    const router = useRouter();
    const isFormConsole = router.currentRoute.query.source === 'console';
    const userinfo = useUserInfo();
    const queryForm = ref<SalesFollowQueryParams>({
      business_type: '',
      search_value: isFormConsole ? userinfo.value.username : '',
      search_type: 'customer_manager',
      status: isFormConsole ? 0 : '',
      customer_intention: '',
      page_num: 1,
      num: 10,
    });
    const listLogic = useList(ctx);

    /** 重置查询 */
    const onQueryResetClick = () => {
      resetQueryForm();
      reload();
    };
    /** 重置查询form */
    const resetQueryForm = () => {
      queryForm.value.business_type = '';
      queryForm.value.search_value = '';
      queryForm.value.search_type = 'customer_manager';
      queryForm.value.status = '';
      queryForm.value.customer_intention = '';
      queryForm.value.page_num = 1;
      queryForm.value.num = 10;
    };

    /** 查询 */
    const onQuerySearchClick = () => {
      queryForm.value.page_num = 1;
      reload();
    };

    const reload = async (
      page_num = queryForm.value.page_num,
      num = queryForm.value.num,
      business_type = queryForm.value.business_type,
      status = queryForm.value.status,
      customer_intention = queryForm.value.customer_intention,
    ) => {
      const params: SalesFollowQueryParams = {
        num: num,
        page_num: page_num,
        business_type: business_type,
        status: status,
        customer_intention: customer_intention,
      };
      if (queryForm.value.search_type === 'customer_manager') {
        params.customer_manager = queryForm.value.search_value;
      } else if (queryForm.value.search_type === 'customer_name') {
        params.customer_name = queryForm.value.search_value;
      } else if (queryForm.value.search_type === 'mission_no') {
        params.mission_no = queryForm.value.search_value;
      }
      await listLogic.loadData(params);
    };

    // 调转详情
    const jumpDetail = (row: CustomerFollowList) => {
      ctx.root.$router.push({
        name: RouterNameSales.detail,
        params: {
          id: `${row.id}`,
        },
      });
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      reload(page_num);
    };
    // 切换页码数
    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      reload(queryForm.value.page_num, num);
    };

    // 新增跟进任务
    const handleAddLiveDisplayAction = () => {
      shouldEditing.value = true;
    };
    // 弹框关闭事件
    const handleCloseAction = () => {
      shouldEditing.value = false;
    };

    // 弹框保存成功回调
    const handleSaveSucceedAction = () => {
      shouldEditing.value = false;
      reload();
    };
    const permission = usePermission();

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
      pagename: 'sales_follow',
    });

    return {
      BusinessTypeOptions,
      permission,
      shouldEditing,
      handleAddLiveDisplayAction,
      handleCloseAction,
      handleSaveSucceedAction,
      queryForm,
      reload,
      onQueryResetClick,
      onQuerySearchClick,
      jumpDetail,
      handleCurrentChange,
      handlePageSizeChange,
      ...listLogic,
      onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
  async mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      await this.reload();
    },
  },
});
