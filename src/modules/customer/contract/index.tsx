import { computed, defineComponent, provide, ref } from '@vue/composition-api';
import { TableColumnFormatter } from '@/types/vendor/column';
import { Contract, ContractQueryForm, ContractStatementsStatus } from '@/types/tiange/contract';
import { PlatformCodes } from '@/types/tiange/kol';
import { contractTypeOptions, saleChances } from '@/const/options';
import { ROLE_CODE } from '@/const/roleCode';
import AddContractCopyDialog from '@/views/customer/components/addContractCopyDialog.vue';
import AddContract from '@/modules/customer/contract/form/contract.vue';
import ReviewDialog from '@/views/customer/components/reviewDialog.vue';
import AddAttachmentDialog from './form/annex.vue';
import { queryUserNames, invalidContract } from '@/api/customer';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { fixFileToken } from '@/utils/http';
import { useList } from './useList';
import AddStatement from '@/modules/customer/contract/form/statement.vue';
import { GetContractStatements } from '@/services/contract';
import { emptyFunc } from '@/utils/func';
import AnnexDialog from './annex.dialog.vue';
import { ApprovalStatus, ApprovalStatusOptions, UserInfo } from '@/types/tiange/system';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterNameProjectManage } from '@/const/router';
import { HasPermission, usePermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';

const isDev = process.env.NODE_ENV === 'development';

export default defineComponent({
  name: 'ContractApproval',
  components: {
    AddContract,
    ReviewDialog,
    AddAttachmentDialog,
    AddContractCopyDialog,
    AddStatement,
    AnnexDialog,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewContractList = HasPermission(RIGHT_CODE.marketing_contract_list);
      const canEditContract = HasPermission(RIGHT_CODE.marketing_contract_edit);
      return { canEditContract, canViewContractList };
    });
    const permission = usePermission();
    provide('Permission', Permission);

    const contractId = ref<number | null>(null);

    const recycledStatusList = ref<{ status: boolean; loading: boolean }[]>([]);

    const queryForm = ref<ContractQueryForm>({
      sale_chance: '',
      contract_type: undefined,
      contract_status: undefined,
      manager_id: undefined,
      is_recycled: undefined,
      contract_uid: '',
      partner_type: 1,
      last_annex_status: undefined,
      partner_name: '',
      page_num: 1,
      num: 10,
      coop_end_date: '',
    });

    /** 重置筛选项表单 */
    const resetForm = () => {
      queryForm.value = {
        sale_chance: '',
        contract_type: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        contract_uid: '',
        partner_type: 1,
        last_annex_status: undefined,
        partner_name: '',
        page_num: 1,
        num: 10,
        coop_end_date: '',
      };
    };

    const indexFormatter: TableColumnFormatter<Contract> = (row, column, value, index) =>
      (queryForm.value.page_num - 1) * 10 + (index + 1);

    /** 新增合同复印件弹窗ref */
    const addContractCopyDialogRef = ref<{ show: (row: Contract) => void } | null>(null);

    /** 新增合同复印件弹窗显示 */
    const showAddContractCopyDialog = (row: Contract) => {
      contractId.value = row.contract_detail.contract_id;
      addContractCopyDialogRef.value?.show(row);
    };

    const currentUserInfo = ref<UserInfo | null>(null);

    // * 作废按钮是否可见 - 权限
    const hasInvalidRight = (row: Contract) =>
      row.contract_info.contract_status === 2 &&
      (currentUserInfo.value?.id === row.contract_info.manager_id ||
        currentUserInfo.value?.id === row.contract_info.add_by);

    // * 作废按钮是否不可用 - 数据状态
    // * 补充协议/结算单审批中，则合同不允许被删除
    const invalidBtnDisabled = (row: Contract) =>
      row.contract_annex_info.some(el => ApprovalStatus.Processing === el.contract_annex_status) ||
      row.contract_statements_list.some(
        el => el.contract_statements_status === ContractStatementsStatus.Processing,
      );

    const handleInvalidClickInner = async (row: Contract) => {
      await handleInvalidClick(row);
    };

    const listLogic = useList(ctx, {
      indexFormatter,
      currentUserInfo,
      showAddContractCopyDialog,
      hasInvalidRight,
      invalidBtnDisabled,
      handleInvalidClick: handleInvalidClickInner,
    });

    // 点击按条件查询
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const { sale_chance, ...rest } = queryForm.value;
      const payload: any = { sale_chance, ...rest };

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

    // * 被选中的数据
    // const selection = ref<Contract[]>([]);

    // * 选中数据数量
    // const selectionCount = computed(() => selection.value.length);

    // * 删除按钮是否禁用
    // const deleteBtnDisabled = computed(() => selectionCount.value === 0);

    const hasApprovalRight = computed(() =>
      Object.values(CONSTRACT_APPROVER).includes((currentUserInfo.value ?? { id: -1 }).id),
    );

    const AddStatementVisible = ref(false);

    const toggleAddStatementModalVisible = (visible = false) => {
      AddStatementVisible.value = visible;
    };

    /**
     * 新增结算单关闭回调
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-11-27 17:31:37
     * @param  {boolean} success 是否保存成功后关闭
     */
    const onAddStatementModalClose = async (success: boolean) => {
      toggleAddStatementModalVisible();
      if (success) {
        await reset();
      }
    };

    // ! 这是一个开发用的拉取数据的函数
    // ! 不要删除
    // ! 仅在开发环境暴露给测试按钮
    const fetchStatements = async () => {
      queryForm.value.contract_status = 2;
      queryForm.value.num = 200;
      await reload();
      const ss = (
        await Promise.all(
          listLogic.list.value
            .map(el => el.contract_info.id)
            .map(async contract_id => {
              const { data: response } = await GetContractStatements({ contract_id });

              return {
                data: response.data,
                contract_id,
              };
            }),
        )
      )
        .filter(el => el.data.total > 0)
        .map(el => {
          const operation = el.data.data
            .map(
              row =>
                [2, 3, 5].includes(row.contract_statements_status) &&
                currentUserInfo.value?.id === row.add_by,
            )
            .some(el => el);

          return {
            ...el,
            operation,
          };
        });

      console.table(ss);
    };

    const addContractDialogRef = ref<{ show: () => void } | null>(null);

    /** 新增合同弹窗显示 */
    const showAddContractDialog = () => {
      addContractDialogRef.value?.show();
    };

    const addAttachmentDialogRef = ref<{ show: () => void } | null>(null);

    /** 点击新增补充协议按钮 */
    const showAddContractAnnexDialog = () => {
      addAttachmentDialogRef.value?.show();
    };

    /** 表单项排序 */
    const formItemOrder = ref({
      contract_type: 2, // 合同类型
      contract_status: 3, // 合同状态
      is_recycled: 5, // 是否收回
      coop_end_date: 7, // 合作结束时间
      add_by_name: 6, // 创建人
      partner_name: 1, // 客户名称
      contract_uid: 0, // 合同编号
    });

    // 点击进入合同详情
    const handleRowClick = (row: Contract) => {
      if ('MarketingCustomerContract' === ctx.root.$route.name) {
        // 客户合同
        ctx.root.$router.push({
          name: RouterNameProjectManage.marketing.contract.customer.detail,
          params: { id: `${row.contract_info.id}` },
        });
      }
    };

    // * 注入null防止报错
    provide('contract', ref(undefined));

    return {
      Permission,
      permission,
      contractId,
      recycledStatusList,
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      contractTypeOptions,
      ApprovalStatusOptions,
      saleChances: [
        {
          value: '',
          label: '全部',
        },
        ...saleChances,
      ],
      accountManager: [],
      queryForm,
      ...listLogic,
      reload,
      reset,
      // selection,
      currentUserInfo,
      hasApprovalRight,
      recycled: false,
      whitespace: '　',
      AddStatementVisible,
      toggleAddStatementModalVisible,
      onAddStatementModalClose,
      fetchStatements: isDev ? fetchStatements : emptyFunc,
      isDev,
      // selectionCount,
      // deleteBtnDisabled,
      addContractDialogRef,
      showAddContractDialog,
      addAttachmentDialogRef,
      showAddContractAnnexDialog,
      formItemOrder,
      addContractCopyDialogRef,
      handleRowClick,
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
    this.queryContract();
  },
  methods: {
    // 新增合同复印件弹窗显示
    showAddContractCopyDialog(row: Contract) {
      this.contractId = row.contract_detail.contract_id;
      (this.$refs.addContractCopyDialogRef as any).show(row);
    },
    // 选择销售渠道
    handleSelectSaleChance(chanceValue: PlatformCodes) {
      this.queryForm.sale_chance = chanceValue;
      this.queryForm.page_num = 1;
      this.queryContract();
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
    // 查询合同
    async queryContract(clean = true) {
      await this.reload(clean);

      // 处理合同收回状态
      this.recycledStatusList = this.list.map(item => ({
        status: item.contract_info.is_recycled === 1,
        loading: false,
      }));
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
        if (val.name === '客户合同' && oldval.name !== '合同详情') {
          this.reset();
        }
      },
    },
  },
});
