/**
 * 营销业务 - 项目管理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-07 16:36:57
 */
import { computed, defineComponent, h, onActivated, ref } from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';
import { GetMarketingProject } from '@/services/marketing.project';
import type {
  MarketingProject,
  MarketingProjectQueryForm,
  MarketingProjectQueryParams,
} from '@/types/tiange/marketing/project';
import { MarketingProjectCooperationStatusMap } from '@/types/tiange/marketing/project.enum';
import type { TableColumn } from '@/types/vendor/column';
import { sleep } from '@/utils/func';
import MarketingProjectDialog from '@/modules/marketing/project/dialog/project.form.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { useUserInfo } from '@/use/vuex';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { resize } from '@/utils/dom';
import { form_data_to_optional_params } from '@/utils/request.fn';
import { max_length_of_column } from '@/utils/table';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';

const useList = (ctx: SetupContext) => {
  /** 新增编辑 弹窗是否显示 */
  const ProjectFormVisible = ref<boolean>(false);

  const ProjectFormTitle = ref<string>('新增项目');

  const toggleProjectModalVisible = (visible = false) => {
    ProjectFormVisible.value = visible;
  };

  const data = ref<MarketingProject[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const loadDataList = async (payload: MarketingProjectQueryParams) => {
    loading.value = true;
    const [{ data: response }] = await Promise.all([
      await GetMarketingProject(payload),
      await sleep(500),
    ]);
    loading.value = false;

    if (response.success) {
      data.value = response.data.data;
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
  const project_uid_render = (row: MarketingProject) => row.cooperation_uid;

  /** 项目名称渲染函数 */
  const project_name_render = <T extends boolean>(row: MarketingProject, text_only: T) => {
    const data = row.cooperation_name || '--';

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

  /** 店铺名称渲染函数 */
  // const shop_name_render = <T extends boolean>(row: MarketingProject, text_only: T) => {
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
  const shop_brand_render = <T extends boolean>(row: MarketingProject, text_only: T) => {
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

  /** 店铺名称最大宽度 */
  const shop_brand_max_length = max_length_of_column(data, '品牌', shop_brand_render);
  /** 客户名称渲染函数 */
  const company_name_render = <T extends boolean>(row: MarketingProject, text_only: T) => {
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

  const feishu_department_name_render = <T extends boolean>(
    row: MarketingProject,
    text_only: T,
  ) => {
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

  /** 执行AE渲染函数 */
  const ae_render = <T extends boolean>(row: MarketingProject, text_only: T) => {
    const data = row.ae.length ? row.ae.map(el => el.ae_name).join('/') : '--';

    const { is_folded, folded_text } = get_limited_length_string(data, 12);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              // content: data,
            },
          },
          [
            h('div', { slot: 'reference', class: 'line-clamp-1' }, [folded_text]),
            h('div', { class: 'ae-popever-list' }, [
              row.ae.map(el => h('div', { class: 'item' }, [el.ae_name])),
            ]),
          ],
        ) as TableColumnRenderReturn<T>);
  };

  const ae_max_length = max_length_of_column(data, '执行AE', ae_render);

  const columns = computed<TableColumn<MarketingProject>[]>(() => [
    {
      label: '项目编号',
      property: 'cooperation_uid',
      fixed: 'left',
      minWidth: 150,
      formatter: project_uid_render,
    },
    {
      label: '项目名称',
      property: 'cooperation_name',
      fixed: 'left',
      minWidth: 180,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '公司名称',
      property: 'shop_name',
      minWidth: 180,
      formatter: row => company_name_render(row, false),
    },
    {
      label: '所属部门',
      align: 'left',
      property: 'shop_name',
      minWidth: 150,
      formatter: row => feishu_department_name_render(row, false),
    },
    // {
    //   label: '店铺名称',
    //   property: 'shop_name',
    //   minWidth: 180,
    //   formatter: row => shop_name_render(row, false),
    // },
    // {
    //   label: '店牌',
    //   property: 'brand_name',
    //   minWidth: shop_brand_max_length.value + 10,
    //   formatter: row => shop_brand_render(row, false),
    // },
    {
      label: '品牌',
      property: 'brand_name',
      minWidth: shop_brand_max_length.value + 10,
      formatter: row => shop_brand_render(row, false),
    },
    {
      label: '项目阶段',
      property: 'cooperation_status',
      minWidth: 110,
      align: 'center',
      formatter: row => MarketingProjectCooperationStatusMap.get(row.cooperation_status) ?? '',
    },
    {
      label: '客户经理',
      property: 'manager_name',
      minWidth: 100,
      align: 'center',
    },
    {
      label: '执行AE',
      property: 'ae',
      minWidth: ae_max_length.value,
      align: 'center',
      formatter: row => ae_render(row, false),
    },
  ]);

  const onRowClick = (row: any, column: any) => {
    ctx.root.$router.push({
      name: RouterNameProjectManage.marketing.project.detail,
      params: { id: `${row.cooperation_id}` },
    });
  };

  return {
    ProjectFormTitle,
    ProjectFormVisible,
    toggleProjectModalVisible,
    columns,
    data,
    total,
    loading,
    loadDataList,
    onRowClick,
  };
};

export default defineComponent({
  name: 'TgMarketingProject',
  components: { MarketingProjectDialog },
  setup(props, ctx) {
    const isFromConsole = ctx.root.$router.currentRoute.query.source === 'console';

    const userinfo = useUserInfo();

    const queryForm = ref<MarketingProjectQueryForm>({
      search_type: isFromConsole ? 5 : 1,
      search_value: isFromConsole ? userinfo.value.username : '',
      cooperation_status: isFromConsole ? 3 : '',
      cooperation_type: '',
      page_num: 1,
      num: 20,
    });

    const search_value_type = computed(() => {
      const typeMap = new Map([
        [1, '项目名称'],
        [2, '客户名称'],
        [3, '项目编号'],
        [4, '客户经理'],
        [5, 'AE名称'],
      ]);
      return queryForm.value.search_type !== ''
        ? typeMap.get(queryForm.value.search_type ?? 1)
        : '';
    });

    const listLogic = useList(ctx);

    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const { search_type, search_value, cooperation_status, cooperation_type, ...rest } =
        queryForm.value;

      const queryParams: MarketingProjectQueryParams = {
        search_type: form_data_to_optional_params(search_type),
        search_value: search_type === '' ? undefined : search_value,
        cooperation_status: form_data_to_optional_params(cooperation_status),
        cooperation_type: form_data_to_optional_params(cooperation_type),
        ...rest,
      };

      await listLogic.loadDataList(queryParams);
    };

    /** 查询 */
    const onQuerySearchClick = () => {
      reload();
    };

    /** 重置查询form */
    const resetQueryForm = () => {
      queryForm.value.search_type = 1;
      queryForm.value.search_value = '';
      queryForm.value.cooperation_status = '';
      queryForm.value.cooperation_type = '';
      queryForm.value.page_num = 1;
      queryForm.value.num = 20;
    };

    /** 关闭表单弹窗 */
    const onProjectFormModalClose = async (success: boolean) => {
      listLogic.toggleProjectModalVisible(false);
      if (success) {
        await reload();
      }
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

    /** 重置查询 */
    const onQueryResetClick = () => {
      resetQueryForm();

      reload();
    };

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.marketing_project_view);
      const canAdd = HasPermission(RIGHT_CODE.marketing_project_save);
      return { canAdd, canViewList };
    });

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
      pagename: 'marketing_project',
    });

    onActivated(() => {
      resize();
    });

    return {
      Permission,
      handleCurrentChange,
      handlePageSizeChange,
      onProjectFormModalClose,
      onQuerySearchClick,
      onQueryResetClick,
      queryForm,
      search_value_type,
      reload,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      ...listLogic,
    };
  },
  async mounted() {
    this.queryMarketingProjectList();
  },
  methods: {
    async queryMarketingProjectList() {
      await this.reload();
    },
  },
});
