/**
 * 客户合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 19:57:54
 */
import { computed, defineComponent, provide, ref } from '@vue/composition-api';
import type { TableColumnFormatter } from '@/types/vendor/column';
import type { Contract, ContractQueryForm } from '@/types/tiange/contract';
import { supplierContractTypeOptions, partnerTypeOptions } from '@/const/options';
import { ROLE_CODE } from '@/const/roleCode';
import { queryUserNames } from '@/api/customer';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { fixFileToken } from '@/utils/http';
import { useList } from './useStatisticsList';
import { emptyFunc } from '@/utils/func';
import type { UserInfo } from '@/types/tiange/system';
import { RouterLegal } from '@/const/router';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { useRouter } from '@/use/vue-router';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { SignTypeOptions } from '@/types/tiange/contract';
import { RawLocation } from 'vue-router';

const isDev = process.env.NODE_ENV === 'development';

export default defineComponent({
  name: 'ContractApproval',
  setup(props, ctx) {
    const router = useRouter();
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewContractList = HasPermission(RIGHT_CODE.law_statistics_contract_view);
      const canEditContract = HasPermission(RIGHT_CODE.law_statistics_contract_list);
      return { canEditContract, canViewContractList };
    });
    provide('Permission', Permission);

    const contractId = ref<number | null>(null);

    const recycledStatusList = ref<{ status: boolean; loading: boolean }[]>([]);
    const partner_select_type = ref(5);
    const parther_select_placeholder = computed(() => {
      let text = '';
      switch (partner_select_type.value) {
        case 1:
          text = '公司名称';
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
      project_name: undefined,
      project_uid: undefined,
      pay_type: undefined,
      execute_status: undefined,
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
        project_name: undefined,
        project_uid: undefined,
        pay_type: undefined,
        execute_status: undefined,
      };
      partner_select_type.value = 5;
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

    const listLogic = useList(ctx, {
      indexFormatter,
      currentUserInfo,
      showAddContractCopyDialog,
    });

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
          payload.company_name = name;
          break;
        case 2:
          payload.company_name = name;
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
    const handleRowClick = (row: any, column: any) => {
      if (column.label === '操作') return;
      if (column.label === '项目名称' && row.project_name) return;
      let jumpParams: RawLocation;
      if (row.contract_type === 1 || row.contract_type === 2 || row.contract_type === 5) {
        // 客户合同
        jumpParams = {
          name:
            row.contract_type === 5
              ? RouterLegal.statistics.customer.detailTemplate
              : RouterLegal.statistics.customer.detail,
          params: { id: `${row.id}` },
        };
      } else if (row.contract_type === 3 || row.contract_type === 4 || row.contract_type === 6) {
        // 客户合同
        jumpParams = {
          name:
            row.contract_type === 6
              ? RouterLegal.statistics.supplier.detailTemplate
              : RouterLegal.statistics.supplier.detail,
          params: { id: `${row.id}` },
          query: {
            contract_type: `${row.contract_type}`,
          },
        };
      } else {
        // 主播
        jumpParams = {
          name: RouterLegal.statistics.anchor.detailTemplate,
          params: { id: `${row.id}` },
          query: {
            contract_type: `${row.contract_type}`,
          },
        };
      }
      const { href } = router.resolve(jumpParams);
      window.open(href, '_blank');
    };

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
      Permission,
      contractId,
      recycledStatusList,
      partner_select_type,
      parther_select_placeholder,
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      contractTypeOptions: [{ value: undefined, label: '全部' }, ...partnerTypeOptions],
      ExecuteFlagOptions: [
        { value: undefined, label: '全部' },
        { value: 1, label: '执行中' },
        { value: 2, label: '正常结束' },
        { value: 3, label: '提前终止' },
        { value: 4, label: '暂未开始' },
      ],
      PayConditionOptions: [
        { value: undefined, label: '全部' },
        { value: 1, label: '固定服务费' },
        { value: 2, label: '服务费+佣金' },
        { value: 3, label: '纯佣金' },
        { value: -1, label: '其它' },
      ],
      businessTypeOptions: [{ value: undefined, label: '全部' }, ...BusinessTypeOptions],
      saleContractTypeOptions: [{ value: undefined, label: '全部' }, ...SignTypeOptions],
      supplierContractTypeOptions,
      accountManager: [],
      queryForm,
      ...listLogic,
      reload,
      reset,
      currentUserInfo,
      recycled: false,
      whitespace: '　',
      fetchStatements: isDev ? fetchStatements : emptyFunc,
      formItemOrder,
      addContractCopyDialogRef,
      handleRowClick,
      // 下面是优化表格高度和滚动条呈现的
      onTopCardRectUpdate,
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
    // 查询合同
    async queryContract(clean = true) {
      await this.reload(clean);
      // 处理合同收回状态
      this.recycledStatusList = this.list.map((item: any) => ({
        status: item.is_recycled === 1,
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
