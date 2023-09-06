import { computed, defineComponent, inject, provide, ref } from '@vue/composition-api';
import type { TableColumnFormatter } from '@/types/vendor/column';
import type { Contract } from '@/types/tiange/contract';
import { ROLE_CODE } from '@/const/roleCode';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { fixFileToken } from '@/utils/http';
import { useTemplateList } from './useList';
import { emptyFunc } from '@/utils/func';
import type { UserInfo } from '@/types/tiange/system';
import { RouterLegal } from '@/const/router';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import tempalteContractDialog from './dialog/templateContractDialog.vue';
const isDev = process.env.NODE_ENV === 'development';
import { businessNewTypeOptions } from '@/const/options';
import { UploadTemplateContractDetail } from '@/services/contract';
import { getToken } from '@/utils/token';
export default defineComponent({
  name: 'ContractApproval',
  components: {
    tempalteContractDialog,
  },
  setup(props, ctx) {
    const myToken = getToken();
    const isFromContract = ctx.root.$route.params.isFromContract || 'false';
    if (isFromContract === 'true') {
      const routes: { title: string; path?: string; name?: string; params?: any }[] = [
        { title: '法务管理', name: RouterLegal.contact },
        { title: '合同管理', name: RouterLegal.contact },
        { title: '模板管理' },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewContractList = HasPermission(RIGHT_CODE.law_contract_template_view);
      const canEditContract = HasPermission(RIGHT_CODE.law_contract_template_retrieve);
      return { canEditContract, canViewContractList };
    });
    provide('Permission', Permission);

    const queryForm = ref<any>({
      page_num: 1,
      num: 20,
      business_type: undefined,
      name: undefined,
      project_uid: undefined,
      status: undefined,
      template_type: undefined,
    });

    /** 重置筛选项表单 */
    const resetForm = () => {
      queryForm.value = {
        name: '',
        page_num: 1,
        num: 20,
        business_type: undefined,
        status: undefined,
        template_type: undefined,
      };
    };

    const indexFormatter: TableColumnFormatter<Contract> = (row, column, value, index) =>
      (queryForm.value.page_num - 1) * 10 + (index + 1);

    const currentUserInfo = ref<UserInfo | null>(null);

    const listLogic = useTemplateList(ctx, {
      indexFormatter,
      currentUserInfo,
    });

    // 点击按条件查询
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }
      const { ...rest } = queryForm.value;
      const payload = { ...rest };
      await listLogic.loadData(payload);
    };

    const reset = async () => {
      resetForm();
      await reload();
    };

    const hasApprovalRight = computed(() =>
      Object.values(CONSTRACT_APPROVER).includes((currentUserInfo.value ?? { id: -1 }).id),
    );

    const AddStatementVisible = ref(false);

    // ! 这是一个开发用的拉取数据的函数
    // ! 不要删除
    // ! 仅在开发环境暴露给测试按钮
    const fetchStatements = async () => {
      queryForm.value.contract_status = 2;
      queryForm.value.num = 200;
      await reload();
    };

    const addContractDialogRef = ref<{ show: (obj: any) => void } | null>(null);

    /** 新增合同弹窗显示 */
    const showAddContractDialog = () => {
      addContractDialogRef.value?.show('');
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

    const uploadrowClick = async (payload: any) => {
      const { data: response } = await UploadTemplateContractDetail(payload);
      if (response.success) {
        reload();
        ctx.root.$message.success(response.message);
      } else {
        ctx.root.$message.warning(response.message);
      }
    };
    return {
      myToken,
      uploadrowClick,
      isFromContract,
      Permission,
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      ApprovalStatusOptions: [
        { value: 1, label: '启用' },
        { value: 0, label: '停用' },
      ],
      contractTypeOptions: [
        { value: 1, label: '客户合同' },
        { value: 2, label: '供应商合同' },
      ],
      businessTypeOptions: businessNewTypeOptions,
      accountManager: [],
      queryForm,
      ...listLogic,
      reload,
      reset,
      currentUserInfo,
      hasApprovalRight,
      recycled: false,
      whitespace: '　',
      AddStatementVisible,
      showAddContractDialog,
      fetchStatements: isDev ? fetchStatements : emptyFunc,
      // 下面是优化表格高度和滚动条呈现的
      onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
  async mounted() {
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
    this.queryContract();
  },
  activated() {
    // debugger
    // this.queryContract();
  },
  methods: {
    changeStatusClick(row: any) {
      const payload: any = {
        contract_template_id: row.id,
        status: row.status === 1 ? 0 : 1,
      };
      this.uploadrowClick(payload);
    },
    editClick(row: any) {
      (this.$refs.editContractDialog as any).show(row);
    },
    downClick(row: any) {
      window.open(row.file_url + '?Authorization=' + this.myToken);
    },
    async deleteClick(row: any) {
      const titlestr = '你确定要删除 ' + row.name + ' 模板合同吗?';
      this.$confirm(titlestr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const payload: any = {
            contract_template_id: row.id,
            flag: 1,
          };
          this.uploadrowClick(payload);
        })
        .catch(() => {
          return false;
        });
    },
    saveClick() {
      this.reload();
    },
    // 编辑合同
    uploadClick() {
      (this.$refs.editContractDialog as any).show('');
    },
    // 查询合同
    async queryContract(clean = true) {
      await this.reload(clean);
    },
    // 表格多选发生改变
    handleSelectionChange(selection: Contract[]) {
      this.selection = selection;
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
