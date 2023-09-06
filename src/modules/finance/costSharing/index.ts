import { defineComponent, onMounted, ref } from '@vue/composition-api';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { usePermission } from '@/use/permission';
import CostImport from './dialog/costImport.vue';
import EditCostData from './dialog/editCostData.vue';
import {
  GetCostShareList,
  DeleteCostShare,
  getProjectids,
  ExportCostSharingReport,
} from '@/services/finance/costshare';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { formatAmount } from '@/utils/string';
import { wait } from '@/utils/func';
import { MaycurListExpenseTypes } from '@/services/maycur';
import { AccountingSubjects } from '@/types/tiange/spendingCategory';
import newCostSharing from '@/modules/finance/costSharing/dialog/newCostSharing/index.vue';
import { useDialog } from '@/use/dialog';
import TgButton from '@/components/Button/button';
import { GetUser } from '@/services/system';
import { UserInfo } from '@/types/tiange/system';
import moment from 'moment';

type query_form = {
  feishu_department_id: number[];
  feishu_department_name: string;
  project_relevancy_id: string | undefined;
  project_relevancy_name: string;
  pay_date: string;
  page_num: number | undefined;
  num: number | undefined;
  modified_by?: string;
  expense_type_biz_code?: number;
};
export default defineComponent({
  name: 'FinancePayment',
  components: {
    TgButton,
    CostImport,
    EditCostData,
  },
  setup(props, ctx) {
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
    });
    const permission = usePermission();
    const loading = ref(false);
    const queryForm = ref<query_form>({
      feishu_department_id: [],
      feishu_department_name: '',
      project_relevancy_id: undefined,
      project_relevancy_name: '',
      pay_date: '',
      page_num: 1,
      num: 20,
      modified_by: undefined,
      expense_type_biz_code: undefined,
    });
    const total = ref(10);
    const handleCurrentChange = (num: number) => {
      queryForm.value.page_num = num;
      getCostList();
    };
    const handlePageSizeChange = (num: number) => {
      queryForm.value.page_num = 1;
      queryForm.value.num = num;
      getCostList();
    };
    const project_ids = ref<any[]>([]);
    const selectProjrctIDChange = (val: any) => {
      queryForm.value.project_relevancy_id = val;
      project_ids.value.map((item: any) => {
        if (item.project_uid === val) {
          queryForm.value.project_relevancy_name = item.project_name;
        }
      });
    };
    // 关联项目
    const getProjectIds = (val: any) => {
      getProjectids({
        project_name: val,
      }).then(({ data }) => {
        const arr: any = [];
        let oproject_ids = data.data || [];
        if (
          oproject_ids.length < 1 &&
          queryForm.value.project_relevancy_name &&
          queryForm.value.project_relevancy_id
        ) {
          oproject_ids = [
            {
              project_name: queryForm.value.project_relevancy_name,
              project_uid: queryForm.value.project_relevancy_id,
            },
          ];
        }
        arr.push(...oproject_ids);
        project_ids.value = arr;
      });
    };
    const cost_import_visiable = ref(false);
    const edit_cost_visiable = ref(false);
    const select_row = ref<any>({});
    const openCostImport = () => {
      cost_import_visiable.value = true;
    };
    const openEditCost = (row: any) => {
      select_row.value = row || {};
      select_row.value.allocated_time = select_row.value.allocated_time.replace('.', '-');
      edit_cost_visiable.value = true;
    };
    const hideCostImport = (isRefresh = false) => {
      cost_import_visiable.value = false;
      edit_cost_visiable.value = false;
      if (isRefresh) {
        getCostList();
      }
    };
    const resetDepartment = () => {
      queryForm.value = {
        feishu_department_id: [],
        feishu_department_name: '',
        project_relevancy_id: undefined,
        project_relevancy_name: '',
        pay_date: '',
        page_num: 1,
        num: 20,
        modified_by: undefined,
        expense_type_biz_code: undefined,
      };
      getCostList();
    };
    const list = ref<any[]>([]);
    const statistics_data = ref<any>({});
    // 获取数据
    const getCostList = async () => {
      const { pay_date } = queryForm.value;
      const date_format = 'yyyy-MM-DD';
      const start_moment = pay_date ? moment(pay_date).startOf('month') : undefined;
      const end_moment = start_moment?.clone()?.endOf('month');
      loading.value = true;
      const [res] = await wait(
        500,
        GetCostShareList({
          department_id_list: queryForm.value.feishu_department_id.join(','),
          project_uid: queryForm.value.project_relevancy_id,
          num: queryForm.value.num,
          page_num: queryForm.value.page_num,
          start_date: start_moment?.format(date_format),
          end_date: end_moment?.format(date_format),
          expense_type_biz_code: queryForm.value.expense_type_biz_code,
          modified_by: queryForm.value.modified_by,
        }),
      );
      loading.value = false;
      if (res.data.success) {
        list.value = res.data.data.data || [];
        total.value = res.data.data.total || 0;
        // @ts-ignore
        statistics_data.value = res.data.data.statistics || [];
      } else {
        ctx.root.$message.error(res.data.message || '数据获取失败！');
      }
    };
    getCostList();
    const summaryMethod = ({ columns }: any) => {
      if (!list.value?.length) return [];
      const TOTAL_FIELD_MAP = new Map([['金额 (元)', 'allocated_amount']]);
      const res: Array<string | number> = [];

      columns.map((column: any) => {
        if (column.type === 'selection') {
          res.push('合计');
        } else if (TOTAL_FIELD_MAP.has(column.label)) {
          const key = TOTAL_FIELD_MAP.get(column.label);
          const value = statistics_data.value[key as any];
          res.push(formatAmount(value || 0, 'None'));
        } else {
          res.push('--');
        }
      });
      return res;
    };
    const deleteClick = async (row: any) => {
      if (row === '' && multipleSelection.value.length === 0) {
        ctx.root.$message.warning('请选择你要删除的数据');
        return;
      }
      const result = await AsyncConfirm(
        ctx,
        `是否确认删除【${row === '' ? '选中的数据' : '这条数据'}】？`,
      );
      if (!result) {
        return;
      }
      let selectarr = <any[]>[];
      multipleSelection.value.map((item: any) => {
        // const index = Number(list.value.indexOf(item));
        selectarr.push(Number(item.id));
      });
      if (row !== '') {
        // const index = Number(list.value.indexOf(row));
        //  list.value.splice(index, 1);
        const arr = [row.id];
        selectarr = arr;
      }
      DeleteCostShare({
        ids: selectarr,
      }).then(({ data }) => {
        if (data.success) {
          getCostList();
          ctx.root.$message.success(data.message || '数据删除成功！');
        } else {
          ctx.root.$message.error(data.message || '数据删除失败！');
        }
      });
    };
    const multipleSelection = ref([]);
    const handleSelectionChange = (val: any) => {
      multipleSelection.value = val;
    };
    const checkSelect = (row: any) => {
      const isChecked = true;
      // if (row.is_lock === 0 && permission.cost_share_edit) {
      //   // 判断里面是否存在某个参数
      //   isChecked = true;
      // } else {
      //   isChecked = false;
      // }
      return isChecked;
    };
    const searchListClick = () => {
      queryForm.value.page_num = 1;
      getCostList();
    };
    const expense_category_list = ref<AccountingSubjects[]>([]);
    // 费用类别
    const getExpenseIds = async () => {
      const res = await MaycurListExpenseTypes({ num: 1000, page_num: 1, is_active: 1 });
      if (res.data.success) {
        expense_category_list.value = res.data.data.data;
      }
    };
    onMounted(() => {
      getExpenseIds();
    });

    const newCostSharingDialog = useDialog({
      component: newCostSharing,
      title: '分摊数据录入',
      width: 346,
      okText: '确定',
      cancelText: '取消',
      on: {
        submit() {
          searchListClick();
        },
      },
    });

    const onNewHandler = () => {
      newCostSharingDialog.show();
    };

    const userLoading = ref(false);
    const userList = ref<UserInfo[]>([]);
    const queryUserList = async (keyword: string) => {
      if (!keyword) {
        userList.value = [];
        return;
      }
      userLoading.value = true;
      const res = await GetUser({
        page_num: 1,
        num: 1000,
        search_type: 2,
        is_checked: 1,
        search_value: keyword,
      });
      userLoading.value = false;
      if (res.data.success) {
        userList.value = res.data.data.data;
      }
    };

    const departmentLevelHidden = (level: number) => {
      return level > 2;
    };
    const deprtmentLevelDisabled = () => {
      // return level > 2;
      return false;
    };

    const exportBtnClick = () => {
      const { pay_date } = queryForm.value;
      const date_format = 'yyyy-MM-DD';
      const start_moment = pay_date ? moment(pay_date).startOf('month') : undefined;
      const end_moment = start_moment?.clone()?.endOf('month');
      ExportCostSharingReport({
        department_id: queryForm.value.feishu_department_id,
        project_uid: queryForm.value.project_relevancy_id,
        start_date: start_moment?.format(date_format),
        end_date: end_moment?.format(date_format),
        expense_type_biz_code: queryForm.value.expense_type_biz_code,
        modified_by: queryForm.value.modified_by,
      });
    };
    return {
      exportBtnClick,
      userLoading,
      queryUserList,
      userList,
      searchListClick,
      formatAmount,
      checkSelect,
      select_row,
      getCostList,
      handleSelectionChange,
      multipleSelection,
      deleteClick,
      resetDepartment,
      hideCostImport,
      cost_import_visiable,
      edit_cost_visiable,
      openCostImport,
      openEditCost,
      project_ids,
      selectProjrctIDChange,
      getProjectIds,
      handleCurrentChange,
      handlePageSizeChange,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      total,
      queryForm,
      list,
      permission,
      loading,
      expense_category_list,
      onNewHandler,
      departmentLevelHidden,
      deprtmentLevelDisabled,
      summaryMethod,
    };
  },
  filters: {
    emptyData(data: string | null | undefined) {
      if (data === '' || data === undefined || data === null) {
        return '--';
      } else {
        return data;
      }
    },
  },
});
