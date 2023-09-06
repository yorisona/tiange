/**
 * 客户合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 19:57:54
 */
import { computed, defineComponent, provide, ref } from '@vue/composition-api';
// import { TableColumnFormatter } from '@/types/vendor/column';
import { ContractStatementsStatus, SignTypeOptions } from '@/types/tiange/contract';
import { Contract, ContractQueryForm } from '@/types/tiange/contract';
import { supplierContractTypeOptions, partnerTypeOptions } from '@/const/options';
import { ROLE_CODE } from '@/const/roleCode';
import AddContractCopyDialog from '@/views/customer/components/addContractCopyDialog.vue';
import ReviewDialog from '@/views/customer/components/reviewDialog.vue';
import { queryUserNames, invalidContract } from '@/api/customer';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { fixFileToken } from '@/utils/http';
import { useList } from './useList';
import { emptyFunc } from '@/utils/func';
import AnnexDialog from '@/modules/customer/contract/annex.dialog.vue';
import {
  ApprovalStatus,
  ApprovalStatusOptions,
  ContractScanFlagOptions,
} from '@/types/tiange/system';
import { UserInfo } from '@/types/tiange/system';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterLegal } from '@/const/router';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { useRouter } from '@/use/vue-router';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { useDialog } from '@/use/dialog';
import toExamineDialog from './dialog/toExamineDialog';
import { PostVerify_contract_scan } from '@/services/contract';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { RawLocation } from 'vue-router';

const isDev = process.env.NODE_ENV === 'development';

export default defineComponent({
  name: 'ContractApproval',
  components: {
    ReviewDialog,
    AddContractCopyDialog,
    AnnexDialog,
  },
  setup(props, ctx) {
    const router = useRouter();
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewContractList = HasPermission(RIGHT_CODE.law_contract_view);
      const canEditContract = HasPermission(RIGHT_CODE.marketing_contract_edit);
      return { canEditContract, canViewContractList };
    });
    provide('Permission', Permission);

    const contractId = ref<number | null>(null);

    const recycledStatusList = ref<{ status: boolean; loading: boolean }[]>([]);
    const partner_select_type = ref(1);
    const parther_select_placeholder = computed(() => {
      let text = '';
      switch (partner_select_type.value) {
        case 1:
          text = '客户名称';
          break;
        case 2:
          text = '供应商名称';
          break;
        case 3:
          text = '合同编号';
          break;
        case 4:
          text = '创建人';
          break;
        case 5:
          text = '项目名称';
          break;
        case 6:
          text = '项目编号';
          break;
      }
      return `请输入${text}`;
    });
    const queryForm = ref<ContractQueryForm>({
      sign_type: undefined,
      contract_status: router.currentRoute.query.source === 'console' ? 2 : undefined,
      manager_id: undefined,
      is_recycled: router.currentRoute.query.source === 'console' ? 0 : undefined,
      contract_uid: '',
      partner_type: undefined,
      last_annex_status: undefined,
      partner_name: '',
      page_num: 1,
      num: 20,
      coop_end_date: '',
      business_type: undefined,
      contract_scan_flag: undefined,
      project_name: undefined,
      project_uid: undefined,
    });

    /** 重置筛选项表单 */
    const resetForm = () => {
      queryForm.value = {
        contract_sign_type: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        contract_uid: '',
        partner_type: undefined,
        last_annex_status: undefined,
        partner_name: '',
        page_num: 1,
        num: 20,
        coop_end_date: '',
        business_type: undefined,
        contract_scan_flag: undefined,
        project_name: undefined,
        project_uid: undefined,
      };
      partner_select_type.value = 1;
    };

    const dialogProject = useDialog({
      component: toExamineDialog,
      title: '扫描件审核',
      okText: '驳回',
      width: '400px',
      on: {
        submit: (v: { contract_id: number; message?: string }) => {
          postVerify_contract_scan(v);
        },
      },
    });

    const listLogic = useList(ctx, { dialogProject });

    // 查询合同
    const queryContract = async (clean = true) => {
      await reload(clean);

      // 处理合同收回状态
      recycledStatusList.value = listLogic.list.value.map((item: any) => ({
        status: item.contract_info.is_recycled === 1,
        loading: false,
      }));
    };

    const approvalLoading = ref(false);
    const postVerify_contract_scan = async (v: any) => {
      v.status = 3;
      approvalLoading.value = true;
      const res = await PostVerify_contract_scan(v);
      approvalLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '驳回成功');
        queryContract();
      } else {
        ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
      }
    };

    // const indexFormatter: TableColumnFormatter<Contract> = (row, column, value, index) =>
    //   (queryForm.value.page_num - 1) * 10 + (index + 1);

    /** 新增合同复印件弹窗ref */
    const addContractCopyDialogRef = ref<{ show: (row: Contract) => void } | null>(null);

    /** 新增合同复印件弹窗显示 */
    // const showAddContractCopyDialog = (row: Contract) => {
    //   contractId.value = row.contract_detail.contract_id;
    //   addContractCopyDialogRef.value?.show(row);
    // };

    const currentUserInfo = ref<UserInfo | null>(null);

    // * 作废按钮是否可见 - 权限
    // const hasInvalidRight = (row: Contract) =>
    //   row.contract_info.contract_status === 2 &&
    //   (currentUserInfo.value?.id === row.contract_info.manager_id ||
    //     currentUserInfo.value?.id === row.contract_info.add_by);

    // * 作废按钮是否不可用 - 数据状态
    // * 补充协议/结算单审批中，则合同不允许被删除
    const invalidBtnDisabled = (row: Contract) =>
      row.contract_annex_info.some(el => ApprovalStatus.Processing === el.contract_annex_status) ||
      row.contract_statements_list.some(
        el => el.contract_statements_status === ContractStatementsStatus.Processing,
      );

    // const handleInvalidClickInner = async (row: Contract) => {
    //   await handleInvalidClick(row);
    // };

    // const listLogic = useList(ctx, {
    //   indexFormatter,
    //   currentUserInfo,
    //   showAddContractCopyDialog,
    //   hasInvalidRight,
    //   invalidBtnDisabled,
    //   handleInvalidClick: handleInvalidClickInner,
    // });

    // 点击按条件查询
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const { ...rest } = queryForm.value;
      const payload = { ...rest };

      const name: any = payload.partner_name;
      payload.partner_name = undefined;
      switch (partner_select_type.value) {
        case 1:
          payload.partner_name = name;
          break;
        case 2:
          payload.provider_name = name;
          break;
        case 3:
          payload.contract_uid = name;
          break;
        case 4:
          payload.add_by_name = name;
          break;
        case 5:
          payload.project_name = name;
          break;
        case 6:
          payload.project_uid = name;
      }

      await listLogic.loadData(payload);
    };

    const reset = async () => {
      resetForm();
      await reload();
    };
    // 点击作废
    const handleInvalidClick = async (row: Contract) => {
      const id = row.contract_info.id;
      if (invalidBtnDisabled(row)) {
        return;
      }

      const result = await AsyncConfirm(ctx, {
        title: '此操作将作废合同, 是否继续',
        confirmText: '作废合同',
      });
      if (!result) {
        return;
      }
      const { data: response } = await invalidContract({
        contract_id: id,
        invalid_code: 5,
      });

      if (response.success) {
        ctx.root.$message.success(response.message);
        await reset();
      } else {
        ctx.root.$message.error(response.message);
      }
    };

    const hasApprovalRight = computed(() =>
      Object.values(CONSTRACT_APPROVER).includes((currentUserInfo.value ?? { id: -1 }).id),
    );

    // ! 这是一个开发用的拉取数据的函数
    // ! 不要删除
    // ! 仅在开发环境暴露给测试按钮
    const fetchStatements = async () => {
      queryForm.value.contract_status = 2;
      queryForm.value.num = 200;
      await reload();
    };

    /** 表单项排序 */
    const formItemOrder = ref({
      contract_sign_type: 2, // 合同类型
      contract_status: 3, // 合同状态
      is_recycled: 5, // 是否收回
      coop_end_date: 7, // 合作结束时间
      add_by_name: 6, // 创建人
      partner_name: 1, // 客户名称
      contract_uid: 0, // 合同编号
    });

    // 点击进入合同详情
    const handleRowClick = (row: Contract, column: any) => {
      if (column) {
        if (column.label === '操作') return;
        if (column.label === '项目信息' && row.project_infos.length > 0) return;
      }
      let jumpParams: RawLocation;
      if (
        row.contract_info.contract_type === 1 ||
        row.contract_info.contract_type === 2 ||
        row.contract_info.contract_type === 5
      ) {
        // 客户合同
        jumpParams = {
          name: row.template_info
            ? RouterLegal.contracts.customer.detailTemplate
            : RouterLegal.contracts.customer.detail,
          params: { id: `${row.contract_info.id}` },
        };
      } else if (
        row.contract_info.contract_type === 3 ||
        row.contract_info.contract_type === 4 ||
        row.contract_info.contract_type === 6
      ) {
        // 供应商
        jumpParams = {
          name: row.template_info
            ? RouterLegal.contracts.supplier.detailTemplate
            : RouterLegal.contracts.supplier.detail,
          params: { id: `${row.contract_info.id}` },
          query: {
            contract_type: `${row.contract_info.contract_type}`,
          },
        };
      } else {
        // 主播
        jumpParams = {
          name: RouterLegal.contracts.anchor.detailTemplate,
          params: { id: `${row.contract_info.id}` },
          query: {
            contract_type: `${row.contract_info.contract_type}`,
          },
        };
      }
      const { href } = router.resolve(jumpParams);
      window.open(href, '_blank');
    };

    // * 注入null防止报错
    provide('contract', ref(undefined));
    provide('project_add_id', undefined);

    // 自适应表格高度部分
    const buttonLineHeight = 0;
    const paginationLineHeight = 46;
    const rectPadding = 30;
    const otherHeight = 4;

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      fixedBlockHeightRefs: [topCardHeight],
      pagename: 'legal_contract',
      delay: 100,
    });

    return {
      approvalLoading,
      Permission,
      contractId,
      recycledStatusList,
      partner_select_type,
      parther_select_placeholder,
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      contractTypeOptions: [{ value: undefined, label: '全部' }, ...partnerTypeOptions],
      ApprovalStatusOptions: [{ value: undefined, label: '全部' }, ...ApprovalStatusOptions],
      ContractScanFlagOptions: [{ value: undefined, label: '全部' }, ...ContractScanFlagOptions],
      businessTypeOptions: [{ value: undefined, label: '全部' }, ...BusinessTypeOptions],
      saleContractTypeOptions: [{ value: undefined, label: '全部' }, ...SignTypeOptions],
      supplierContractTypeOptions,
      accountManager: [],
      queryForm,
      ...listLogic,
      reload,
      reset,
      currentUserInfo,
      hasApprovalRight,
      recycled: false,
      whitespace: '　',
      fetchStatements: isDev ? fetchStatements : emptyFunc,
      formItemOrder,
      addContractCopyDialogRef,
      handleRowClick,
      // 下面是优化表格高度和滚动条呈现的
      onTopCardRectUpdate,
      queryContract,
      ...tableHeightLogic,
    };
  },
  async mounted() {
    await this.getAccountManager();
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
    this.queryContract();
  },
  activated() {
    // debugger
    // this.queryContract();
  },
  methods: {
    // 新增合同复印件弹窗显示
    showAddContractCopyDialog(row: Contract) {
      this.contractId = row.contract_detail.contract_id;
      (this.$refs.addContractCopyDialogRef as any).show(row);
    },
    // 获取客户经理
    getAccountManager() {
      return new Promise((resolve, reject) => {
        queryUserNames({
          role: ROLE_CODE.customer_manager,
        })
          .then(res => {
            if (res.data.success) {
              this.accountManager = res.data.data.user_data;
              resolve(true);
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
              reject(res.data.message);
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '客户经理获取失败，稍后重试',
              duration: 2000,
              showClose: true,
            });
            reject(error);
          });
      });
    },
    // 表格多选发生改变
    handleSelectionChange(selection: Contract[]) {
      this.selection = selection;
    },
    // 点击审核合同
    handleReviewContractClick(contractInfo: Contract) {
      (this.$refs.reviewDialog as any).show(contractInfo);
    },
    // 翻页
    handleCurrentChange(page_num: number) {
      this.queryForm.page_num = page_num;
      this.queryContract(false);
    },
    handlePageSizeChange(pageSize: number) {
      this.queryForm.num = pageSize;
      this.queryContract();
    },
    fixFileToken,
  },
  watch: {
    $route: {
      // 从别处进入触发刷新，详情页返回不触发
      handler(val, oldval) {
        if (
          val.name === 'StatisticsContact' &&
          oldval.name !== 'StatisticSupplierContractDetailTemplate' &&
          oldval.name !== 'StatisticCustomerContractDetailTemplate' &&
          oldval.name !== 'StatisticSupplierContractDetail' &&
          oldval.name !== 'StatisticCustomerContractDetail'
        ) {
          this.reset();
        }
      },
    },
  },
});
