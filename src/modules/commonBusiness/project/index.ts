import { computed, defineComponent, onBeforeMount, ref } from '@vue/composition-api';
import { RIGHT_CODE } from '@/const/rightCode';
import { RouterNameProjectManage } from '@/const/router';
import {
  CommonBusinessProject,
  CommonBusinessProjectQueryForm,
  ProjectTypeEnum,
  ProjectTypeEnumMap,
} from '@/types/tiange/commonBusiness/project';
import { HasPermission } from '@/use/permission';
import { useList } from './use/list';
import CommonBusinessProjectDialog from '@/modules/commonBusiness/project/dialog/project.form.vue';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { form_data_to_optional_params } from '@/utils/request.fn';
import { ProjectStatusEnum } from '@/types/tiange/common';

export default defineComponent({
  name: 'TgCommonBusinessProject',
  components: {
    CommonBusinessProjectDialog,
  },
  setup(props, ctx) {
    const QueryForm = ref<CommonBusinessProjectQueryForm>({
      search_type: 6,
      search_value: '',
      mcn_project_type: '',
      platform_type: '',
      project_status: '',
      page_num: 1,
      num: 20,
      data_type: 2,
    });

    const search_value_type = computed(() => {
      const typeMap = new Map([
        [6, '项目名称'],
        [1, '项目编码'],
        [5, '项目经理'],
        [9, '创建人'],
        [8, '团队成员'],
      ]);
      return QueryForm.value.search_type === ''
        ? ''
        : typeMap.get(QueryForm.value.search_type) ?? '';
    });

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.common_business_project_view);
      const canEdit = HasPermission(RIGHT_CODE.common_business_project_save);
      return { canEdit, canViewList };
    });

    /** 项目列表 logic */
    const listLogic = useList(ctx);

    // 行点击跳转详情页
    const onRowClick = (row: CommonBusinessProject) => {
      ctx.root.$router.push({
        name: RouterNameProjectManage.commonBusiness.project.detail,
        params: { id: `${row.id}` },
      });
    };

    /** 重置查询form */
    const resetQueryForm = () => {
      QueryForm.value.search_type = 6;
      QueryForm.value.search_value = '';
      QueryForm.value.mcn_project_type = '';
      QueryForm.value.platform_type = '';
      QueryForm.value.page_num = 1;
      QueryForm.value.project_status = '';
      QueryForm.value.num = 20;
    };

    /** 重置查询 */
    const onQueryResetClick = () => {
      resetQueryForm();
      reload();
    };

    /** 关闭表单弹窗 */
    const onProjectFormModalClose = async (success: boolean) => {
      toggleProjectModalVisible(false);
      if (success) {
        await reload();
      }
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      QueryForm.value.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      QueryForm.value.num = num;
      reload();
    };

    /** 查询 */
    const onQuerySearchClick = () => {
      reload();
    };

    const reload = async (clean = true) => {
      if (clean) {
        QueryForm.value.page_num = 1;
      }
      const { search_type, search_value, ...rest } = QueryForm.value;
      const form_search_type = form_data_to_optional_params(search_type);
      const QueryData: any = {
        ...rest,
      };

      if (search_value) {
        QueryData.search_type = form_search_type;
        QueryData.search_value = search_value;
      } else {
        QueryData.search_type = undefined;
        QueryData.search_value = '';
      }

      await listLogic.loadData(QueryData);
    };

    onBeforeMount(() => {
      reload();
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
      pagename: 'common_bussiness_project',
    });

    /** 新增/编辑 项目弹窗 */
    const ProjectFormVisible = ref<boolean>(false);
    const ProjectFormTitle = ref<string>('新增项目');
    const toggleProjectModalVisible = (visible = false) => {
      ProjectFormVisible.value = visible;
    };

    const projectTypeOptions = computed(() => {
      let options: { label: string | undefined; value: ProjectTypeEnum }[] = [];
      // 5, 6, 2, 1, 4, 3
      const types = [
        ProjectTypeEnum.taobao_cps,
        ProjectTypeEnum.v_task,
        ProjectTypeEnum.label,
        ProjectTypeEnum.clothing,
        ProjectTypeEnum.head,
        ProjectTypeEnum.makeups,
      ];
      options = types.map(el => {
        return {
          label: ProjectTypeEnumMap.get(el),
          value: el,
        };
      });
      return options;
    });

    return {
      ProjectStatusEnum,
      onProjectFormModalClose,
      onQuerySearchClick,
      onQueryResetClick,
      handleCurrentChange,
      handlePageSizeChange,
      ProjectFormVisible,
      ProjectFormTitle,
      toggleProjectModalVisible,
      ...listLogic,
      QueryForm,
      onRowClick,
      search_value_type,
      Permission,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      projectTypeOptions,
    };
  },
});
