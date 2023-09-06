/**
 * 客户管理 - 客户合同 - 详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 23:17:30
 */
import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeMount as 挂载前,
  provide,
  ref,
  SetupContext,
} from '@vue/composition-api';
import {
  deleteContract,
  setContractRecycle,
  deleteContractAnnex,
  invalidContract,
  deleteContracts,
} from '@/api/customer';
import AddContract from '@/modules/customer/contract/form/contract.vue';
import ReviewDialog from '@/views/customer/components/reviewDialog.vue';
import ApproveProgress from '@/views/customer/components/approveProgress.vue';
import { getToken } from '@/utils/token';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { ROLE_CODE } from '@/const/roleCode';
import { fixFileToken } from '@/utils/http';
import { AsyncConfirm } from '@/use/asyncConfirm';
import {
  Contract,
  ContractScanSaveParams,
  ContractStatementsStatus,
  ContractType,
} from '@/types/tiange/contract';
import {
  DeleteContractScan,
  GetContract,
  GetContractApprovalFlow,
  PostVerify_contract_scan,
  SaveContractScan,
  SaveContractScanLegal,
} from '@/services/contract';
import { useTabs } from '@/use/tab';
import TabAnnex from './annex.vue';
import TabStatement from './statement.vue';
import { ApprovalFlow } from '@/types/oa/approval';
import { downloadFileFromLink, sleep } from '@/utils/func';
import OaFlows from '@/components/OAFlows/flows.vue';
import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { useRelatedContract } from '../useContractLogic';
import { DefText } from '@/components/DefText/dt';
import { useCache } from '@/use/cache';
import { Tab } from '@/types/components/tabs';
import AddAnnex from '@/modules/customer/contract/form/annex.vue';
import AddStatement from '@/modules/customer/contract/form/statement.vue';
import { ApprovalStatus, ApprovalStatusMap, UserInfo } from '@/types/tiange/system';
import { uploadFile } from '@/api/cooperative';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { MoneyAlign } from '@/use/money.align';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { RouterNameProjectManage, RouterLegal } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { GetMarketingProjectDetail } from '@/services/marketing.project';
import { GetLiveProjectDetail } from '@/services/live.project';
import { getFileExtension } from '@/utils/func';
import { Loading } from 'element-ui';
import { useDialog } from '@/use/dialog';
const moneyAlign = MoneyAlign.getColSetting();
import toExamineDialog from '@/modules/legal/contract/dialog/toExamineDialog';
import { usePermission } from '@/use/permission';
import { isExternal } from '@/router/routeGuard';
import { useBreadcrumbRouter } from '@/modules/customer/contract/template/detail/use';
const permission = usePermission();
const usePlanTable = () => {
  const planColumns = ref<TableColumn<any>[]>([
    {
      label: '序号',
      width: 63,
      headerAlign: 'center',
      align: 'center',
      formatter: (row, column, value, index) => index + 1,
    },
    {
      label: '收款金额',
      prop: 'proceeds_amount',
      minWidth: 130,
      ...moneyAlign,
      formatter: row => formatAmount(row.proceeds_amount),
    },
    {
      label: '计划收款日期',
      prop: 'proceeds_plan_date_str',
      headerAlign: 'center',
      align: 'center',
      formatter: (row, column, value) => value || DefText(),
    },
    {
      label: '已收金额',
      prop: 'obtained_amount',
      minWidth: 130,
      ...moneyAlign,
      formatter: row => formatAmount(row.obtained_amount),
    },
    {
      label: '待收金额',
      prop: 'to_obtain_amount',
      minWidth: 130,
      ...moneyAlign,
      formatter: row => formatAmount(row.to_obtain_amount),
    },
    {
      prop: 'invoice_amount',
      label: '已开票',
      minWidth: 130,
      ...moneyAlign,
      formatter: row => formatAmount(row.invoice_amount),
    },
  ]);

  return { planColumns };
};

const useDetailList = () => {
  const detailColumns = ref<TableColumn<any>[]>([
    {
      label: '产品(销售渠道)',
      property: 'sale_chance',
      align: 'left',
      headerAlign: 'left',
      formatter: (row: { sale_chance: { sale_chance_name: string; value: number }[] }) => {
        const sale_chance = row.sale_chance ?? [];
        if (sale_chance.length === 0) {
          return '';
        }

        return h(
          'el-popover',
          {
            props: {
              popperClass: 'contract-sale-chance-popover',
              placement: 'top',
              width: '364',
              trigger: 'hover',
            },
          },
          [
            h('div', { class: 'contract-sale-chance-all' }, [
              h('tg-tag-group', {
                props: {
                  theme: 'gray',
                  tags: sale_chance.map(({ sale_chance_name }) => sale_chance_name),
                },
              }),
            ]),
            h('div', { class: 'contract-sale-chance', slot: 'reference' }, [
              sale_chance
                .slice(0, 3)
                .map(({ sale_chance_name }) => sale_chance_name)
                .join('、'),
              sale_chance.length > 3 ? '...' : '',
            ]),
          ],
        );
      },
    },
    {
      label: '数量',
      property: 'num',
      align: 'center',
      headerAlign: 'center',
    },
    {
      label: '单位',
      property: 'unit_str',
      align: 'center',
      headerAlign: 'center',
    },
    {
      label: '标准单价',
      property: 'price',

      align: 'center',
      headerAlign: 'center',
      formatter: (row, column, value) => formatAmount(value),
    },
    {
      label: '折扣',
      property: 'discount',
      align: 'center',
      headerAlign: 'center',
    },
    {
      label: '合同金额',
      property: 'contract_amount',
      align: 'center',
      headerAlign: 'center',
      formatter: (row, column, value) => formatAmount(value),
    },
  ]);
  return { detailColumns };
};

const uploadScans = (ctx: SetupContext, uploadScanFileCb: (url: string) => void) => {
  const beforeUploadScanFiles = (file: File) => {
    if (
      ![
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(file.type) &&
      !['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'].includes(getFileExtension(file.name))
    ) {
      ctx.root.$message.warning(
        '文件格式不正确，请使用 pdf / doc / docx / xls / xlsx / csv 格式的文件',
      );
      return false;
    }

    if (file.size > 50 * 1024 * 1024) {
      ctx.root.$message.error(
        `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在50MB以内`,
      );
      return false;
    }

    return true;
  };
  /**
   * 上传文件成功时回调
   */
  let loading: any;
  const startLoading = () => {
    // 使用Element loading-start 方法
    loading = Loading.service({
      lock: true,
      text: '加载中……',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  };
  const uploadScanFiles = async (options: HttpRequestOptions) => {
    const 文件检查是否通过 = beforeUploadScanFiles(options.file);
    if (!文件检查是否通过) {
      return false;
    }

    const form = new FormData();
    form.append('file', options.file);
    form.append('type', 'contract/scan');
    startLoading(); // 开启加载
    const { data: response } = await uploadFile(form);
    loading.close(); // 关闭加载
    if (response.success) {
      uploadScanFileCb(response.data.source);
    } else {
      ctx.root.$message.error('上传失败！');
    }
  };

  return { uploadScanFiles };
};

/** 合同扫描件最大数量 */
const 合同扫描件最大数量 = 20;

export default defineComponent({
  name: 'TgContractDetail',
  props: {
    type: {
      type: String,
      default: 'add',
    },
  },
  components: {
    AddContract,
    ApproveProgress,
    ReviewDialog,
    TabAnnex,
    TabStatement,
    OaFlows,
    AddAnnex,
    AddStatement,
    toExamineDialog,
  },
  setup(props, ctx) {
    const approvalLoading = ref(false);
    /** 合同信息 */
    const detail = ref<Contract | null>(null);
    const ProjectDetailData = ref<any>();
    const project_add_id = ref<number>(-1);
    const breadcrumb = useBreadcrumb();

    // * tabs
    const tabs = useTabs([
      {
        label: '补充协议详情',
        value: 'annex',
      },
      {
        label: '结算单详情',
        value: 'statement',
      },
    ]);

    const onTabChange = (tab: Tab<string>) => {
      const $route = ctx.root.$route;

      if ('CustomerContractDetail' === $route.name) {
        ctx.root.$router.replace(
          {
            name: 'CustomerContractDetail',
            params: {
              id: $route.params.id,
              tab: tab.value,
            },
          },
          () => {
            // console.log(document.body.scrollTop);
          },
        );
      }
    };

    挂载前(() => {
      if (['annex', 'statement'].includes(ctx.root.$route.params.tab)) {
        tabs.checkedTab.value = ctx.root.$route.params.tab;
      }
    });

    // tab value => component name
    const compomentMap = new Map([
      ['annex', 'TabAnnex'],
      ['statement', 'TabStatement'],
    ]);

    // 当前激活组件
    const componentName = computed(
      () => compomentMap.get(tabs.checkedTab.value) ?? compomentMap.get('annex'),
    );

    // 销售合同不展示结算单tab
    const newTabs = computed(() =>
      ContractType.Sales === detail.value?.contract_info.contract_type
        ? tabs.tabs.filter((_, index) => index < 2)
        : tabs.tabs,
    );

    /** 是否销售合同 */
    const 是否销售合同 = computed(
      () => ContractType.Sales === detail.value?.contract_info.contract_type,
    );

    /** 是否框架合同 */
    const 是否框架合同 = computed(
      () => ContractType.Framework === detail.value?.contract_info.contract_type,
    );

    const ContractTypeMap = new Map([
      [ContractType.Sales, '销售'],
      [ContractType.Framework, '框架'],
      [ContractType.Purchase, '采买'],
      [ContractType.SupplierFramework, '框架'],
    ]);

    /** 合同类型标签 */
    const contract_type_label = computed(() =>
      ContractTypeMap.get(detail.value?.contract_info.contract_type ?? ContractType.Sales),
    );

    const contract_type_label_class = computed(() =>
      ContractType[detail.value?.contract_info.contract_type ?? ContractType.Sales].toLowerCase(),
    );

    provide('contract', detail);

    const loading = ref(false);

    /** 获取详情 */
    const 获取合同详情 = async () => {
      const id = ctx.root.$route.params.id;
      if (!id) {
        return false;
      }

      loading.value = true;
      const breadRouter = useBreadcrumbRouter();
      const router_project_id = ctx.root.$route.query.parent_id
        ? Number(ctx.root.$route.query.parent_id)
        : undefined;

      const payload = {
        id: parseInt(id, 10),
        project_id:
          breadRouter.breadcrumb.isCoopCustomerContractDetail ||
          breadRouter.breadcrumb.isCoopSupplierContractDetail
            ? undefined
            : router_project_id,
        cooperation_id:
          breadRouter.breadcrumb.isCoopCustomerContractDetail ||
          breadRouter.breadcrumb.isCoopSupplierContractDetail
            ? router_project_id
            : undefined,
        partner_type: 1,
      };
      let getType = 1;
      if (breadcrumb.isLegalSupplierContractDetail || breadcrumb.isLegalCustomerContractDetail) {
        getType = 2;
      } else if (
        breadcrumb.isTiktokLiveCustomerContractDetail ||
        breadcrumb.isTiktokSupplierContractDetail ||
        breadcrumb.isLiveCustomerContractDetail ||
        breadcrumb.isLiveSupplierContractDetail
      ) {
        getType = 3;
      } else if (
        breadcrumb.isSupplyChainCustomerContractDetail ||
        breadcrumb.isSupplyChainSupplierContractDetail
      ) {
        getType = 9;
      } else if (
        breadcrumb.isLocalLifeCustomerContractDetail ||
        breadcrumb.isLocalLifeSupplierContractDetail
      ) {
        getType = 8;
      } else if (
        breadcrumb.isCoopSupplierContractDetail ||
        breadcrumb.isCoopCustomerContractDetail
      ) {
        getType = 4;
      } else if (
        breadcrumb.isCommonBusinessCustomerContractDetail ||
        breadcrumb.isCommonBusinessSupplierContractDetail
      ) {
        /** 通用业务 */
        getType = 5;
      } else if (
        breadcrumb.isLegalStatisticsSupplierContractDetail ||
        breadcrumb.isLegalStatisticsCustomerContractDetail
      ) {
        getType = 6;
      }
      // const isExternal = router.currentRoute.query.source === 'external';
      const response = await GetContract(payload, getType, isExternal());

      loading.value = false;
      if (response.success && response.data) {
        detail.value = response.data;
        isRecycled.value = detail.value.contract_info.is_recycled === 1;
      } else {
        ctx.root.$message.warning(response.message ?? '合同详情获取失败，稍后重试');
      }

      project_add_id.value = detail.value?.contract_info.project_id
        ? detail.value?.contract_info.project_id
        : -1;

      const project_id = computed(() => detail.value?.contract_info.project_id);
      const fetchProjectDetailData = async (project_id: number) => {
        const queryService = getType === 4 ? GetMarketingProjectDetail : GetLiveProjectDetail;
        const [{ data: response }, _] = await Promise.all([
          await queryService(project_id.toString()),
          await sleep(200),
        ]);

        if (response.success) {
          return response.data;
        } else {
          return {};
        }
      };

      /** Get project detail data */
      const getProjectDetailData = async () => {
        const id = project_id.value ? project_id.value : detail.value?.cooperation_id;
        if (id) {
          const result = await fetchProjectDetailData(id);
          ProjectDetailData.value = result;
        }
      };

      getProjectDetailData();
    };

    provide('project', ProjectDetailData);

    /** 用户信息 */
    const currentUserInfo = computed(() => ctx.root.$store.getters['user/getUserInfo']);

    provide('currentUserInfo', currentUserInfo);
    /** 合同【收回】状态 */
    const isRecycled = ref(false);

    /**
     * 按钮是否可见
     * 当合同状态为【正常】时不可以删除，【审批中】不可删除，合同的客户经理id等于当前用户的时候可以删除，合同的创建者为当前用户可以删除
     */
    const oprateBtnVisiable = computed(() => {
      if (isExternal()) return false;
      return (
        ![ApprovalStatus.Normal, ApprovalStatus.Processing].includes(
          detail.value?.contract_info.contract_status ?? -1,
        ) &&
        (currentUserInfo.value.id === detail.value?.contract_info.manager_id ||
          currentUserInfo.value.id === detail.value?.contract_detail.add_by)
      );
    });

    const coop_date = computed(() =>
      [detail.value?.contract_info.coop_start_date, detail.value?.contract_info.coop_end_date]
        .filter(el => el?.trim() ?? '' !== '')
        .join('～'),
    );

    const isFlowFromOA = computed(
      () =>
        detail.value?.contract_info.feishu_request_id !== null ||
        detail.value?.contract_info.oa_request_id !== null,
    );

    const { getCache, setCache } = useCache<ApprovalFlow[]>();
    const flows = ref<ApprovalFlow[]>([]);
    const flowsLoading = ref(false);
    const flowsError = ref('');

    provide('flows', flows);

    const fetchContractApprovalFlow = async (id: number) => {
      flowsLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await GetContractApprovalFlow(id),
        await sleep(200),
      ]);
      flowsLoading.value = false;

      if (response.success) {
        setCache(id, response.data);
        flowsError.value = '';

        return response.data;
      } else {
        flowsError.value = response.message;
        return false;
      }
    };

    const onFlowsShow = async () => {
      const id = detail.value?.contract_info.id;
      if (id === undefined) {
        return;
      }

      const checkedFlow = getCache(id) ?? (await fetchContractApprovalFlow(id));

      if (checkedFlow !== false) {
        flows.value = checkedFlow;
      }
    };

    const token = getToken();

    /** 合同附件 */
    const attachment_list = computed(() =>
      (detail.value?.contract_detail.attachment_url_list ?? [])
        .map(el => [
          {
            filename: el.file_name,
            url: `${el.url}?Authorization=${token}`,
            originalUrl: el.url,
          },
        ])
        .flat(),
    );

    /** 下载 */
    const downloadFile = (file: { filename: string; url: string; originalUrl: string }) => {
      downloadFileFromLink(file.url);
    };

    /** 合同扫描件 */
    const contract_scan_urls = computed(() =>
      (detail.value?.contract_detail.contract_scan_urls ?? []).map(el => ({
        filename: el.file_name,
        url: `${el.url}?Authorization=${token}`,
        originalUrl: el.url,
      })),
    );

    const status = computed(() => detail.value?.contract_info.contract_status);

    const status_tag_class = computed(() =>
      `approval-status-label-circle ${
        ApprovalStatus[detail.value?.contract_info.contract_status ?? -1]
      }`.toLowerCase(),
    );

    /** 销售渠道名称数组 */
    const sale_chances_str_list = computed(
      () => detail.value?.contract_info.sale_chance?.map(el => el.sale_chance_name) ?? [],
    );

    /** 销售渠道拼接字符串 */
    const sale_chances = computed(() => sale_chances_str_list.value.join('、'));

    /** 客户名称 */
    const customer_name = computed(() => detail.value?.contract_info.company_name || '');

    /** 合同状态 */
    const contract_status_str = computed(
      () => ApprovalStatusMap.get(detail.value?.contract_info.contract_status ?? 2) ?? '',
    );

    /** 合同明细区块几个字段 */
    const contract_detail_fields = computed(() => {
      if (detail.value === null) {
        return [];
      }

      const { contract_amount, price, num, unit_str, discount } = detail.value.contract_detail;
      return [
        {
          name: '合同金额',
          value: formatAmount(contract_amount),
          prop: 'contract_amount',
        },
        { name: '标准单价', value: formatAmount(price), prop: 'price' },
        { name: '数量', value: num, prop: 'num' },
        { name: '单位', value: unit_str, prop: 'unit_str' },
        { name: '折扣', value: discount, prop: 'discount' },
      ];
    });

    const 补充协议结算单列表引用 = ref<{ reload: () => Promise<void> } | null>(null);
    /** 新增补充协议 */
    const 新增补充协议对话框 = ref<{ show: () => void } | null>(null);

    /** 点击新增补充协议按钮 */
    const 打开补充协议对话框 = () => {
      新增补充协议对话框.value?.show();
    };

    const 补充协议添加完成 = async () => {
      if (tabs.checkedTab.value !== tabs.tabs[0].value) {
        tabs.checkedTab.value = tabs.tabs[0].value;
        await new Promise(resolve => {
          ctx.root.$nextTick(() => {
            resolve(true);
          });
        });
      }

      await Promise.all([await 获取合同详情(), await 补充协议结算单列表引用.value?.reload()]);
    };

    // * 新增结算单
    /** 新增结算单对话框 */
    const 新增结算单对话框是否可见 = ref(false);

    const 切换新增结算单对话框是否可见 = (visible = false) => {
      新增结算单对话框是否可见.value = visible;
    };

    /**
     * 新增结算单关闭回调
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-11-27 17:31:37
     * @param  {boolean} success 是否保存成功后关闭
     */
    const 新增结算单关闭回调 = async (success: boolean) => {
      切换新增结算单对话框是否可见();
      if (success) {
        if (tabs.checkedTab.value !== tabs.tabs[1].value) {
          tabs.checkedTab.value = tabs.tabs[1].value;
          await new Promise(resolve => {
            ctx.root.$nextTick(() => {
              resolve(true);
            });
          });
        }

        await Promise.all([await 获取合同详情(), await 补充协议结算单列表引用.value?.reload()]);
      }
    };

    const 能否显示补充协议和结算单新增按钮 = computed(
      () => detail.value?.contract_info.contract_status === ApprovalStatus.Normal,
    );

    const isProject = computed(() => {
      return (
        !breadcrumb.isLegalStatisticsCustomerContractDetail &&
        !breadcrumb.isLegalCustomerContractDetail
      );
    });
    const 能否上传合同扫描件 = computed(() => {
      const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];
      const hasPermission = permission.upload_attachment;
      // const isProject =
      //   !breadcrumb.isLegalStatisticsCustomerContractDetail &&
      //   !breadcrumb.isLegalCustomerContractDetail;
      const inTeam =
        user.id === detail.value?.contract_info.add_by ||
        (detail.value?.allow_update_contract_scan_user_ids ?? []).includes(user.id);
      return (
        detail.value?.contract_info.contract_status === ApprovalStatus.Normal &&
        ((isProject.value && inTeam) || (!isProject.value && hasPermission))
      );
      if (
        breadcrumb.isTiktokLiveCustomerContractDetail ||
        breadcrumb.isLiveCustomerContractDetail ||
        breadcrumb.isLocalLifeCustomerContractDetail ||
        breadcrumb.isSupplyChainCustomerContractDetail ||
        breadcrumb.isCommonBusinessCustomerContractDetail ||
        user.id === detail.value?.contract_info.add_by ||
        (detail.value?.allow_update_contract_scan_user_ids ?? []).includes(user.id)
      ) {
        // return detail.value?.contract_info.contract_status === ApprovalStatus.Normal;
        return (
          (user.id === detail.value?.contract_info.add_by ||
            (detail.value?.allow_update_contract_scan_user_ids ?? []).includes(user.id)) &&
          detail.value?.contract_info.contract_status === ApprovalStatus.Normal
        );
      } else {
        return (
          // currentUserInfo.value?.user_rights.includes(
          // NEW_RIGHT_CODE.marketing_contract_scan_upload,
          // )
          (user.id === detail.value?.contract_info.add_by ||
            (detail.value?.allow_update_contract_scan_user_ids ?? []).includes(user.id)) &&
          detail.value?.contract_info.contract_status === ApprovalStatus.Normal
        );
      }
    });

    const 合同扫描件是否满额 = computed(
      () => contract_scan_urls.value.length >= 合同扫描件最大数量,
    );

    const 上传合同扫描件按钮是否显示 = computed(
      () => 能否上传合同扫描件.value && !合同扫描件是否满额.value,
    );

    // * 是否有作废按钮权限 - 权限
    const 是否有作废按钮权限 = computed(() =>
      isExternal()
        ? false
        : detail.value?.contract_info.contract_status === ApprovalStatus.Normal &&
          (currentUserInfo.value?.id === detail.value?.contract_info.manager_id ||
            currentUserInfo.value?.id === detail.value?.contract_info.add_by),
    );

    // * 作废按钮是否不可用 - 数据状态
    // * 补充协议/结算单审批中，则合同不允许被删除
    const 作废按钮是否禁用 = computed(
      () =>
        (detail.value?.contract_annex_info ?? []).some(
          el => ApprovalStatus.Processing === el.contract_annex_status,
        ) ||
        (detail.value?.contract_statements_list ?? []).some(
          el => el.contract_statements_status === ContractStatementsStatus.Processing,
        ),
    );

    const 是否有删除按钮权限 = computed(() => {
      if (isExternal()) return false;
      if (
        breadcrumb.isTiktokLiveCustomerContractDetail ||
        breadcrumb.isLiveCustomerContractDetail ||
        breadcrumb.isLocalLifeCustomerContractDetail ||
        breadcrumb.isSupplyChainCustomerContractDetail
      ) {
        return true;
      } else if (breadcrumb.isCommonBusinessCustomerContractDetail) {
        return true;
      } else {
        return true;
      }
    });

    const 删除按钮是否可用 = computed(
      () =>
        [ApprovalStatus.Invalid, ApprovalStatus.Failure].includes(
          detail.value?.contract_info.contract_status ?? -1,
        ) &&
        (currentUserInfo.value?.id === detail.value?.contract_info.manager_id ||
          currentUserInfo.value?.id === detail.value?.contract_detail.add_by),
    );

    const 删除合同 = async () => {
      if (detail.value === null) {
        return;
      }
      if (!删除按钮是否可用.value) {
        return;
      }

      const result = await AsyncConfirm(ctx, {
        title: '此操作将删除合同， 确认删除？',
        confirmText: '删除合同',
      });

      if (!result) {
        return;
      }
      const { data: response } = await deleteContracts({
        contract_id: [detail.value.contract_info.id],
      });

      if (response.success) {
        await 获取合同详情();
      } else {
        ctx.root.$message.error(response.message ?? '合同删除失败');
      }
    };

    // * 点击作废
    const 作废合同 = async () => {
      if (detail.value === null) {
        return;
      }

      const id = detail.value?.contract_info.id;
      if (!是否有作废按钮权限.value) {
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
        await 获取合同详情();
      } else {
        ctx.root.$message.error(response.message);
      }
    };

    const 上传扫描件逻辑 = uploadScans(ctx, async url => {
      if (detail.value === null) {
        return;
      }
      const payload: ContractScanSaveParams = {
        contract_id: detail.value?.contract_info.id,
        contract_scan_urls: [url],
        save_for_update: 1,
      };
      const { data: response } = isProject.value
        ? await SaveContractScan(payload)
        : await SaveContractScanLegal(payload);
      if (response.success) {
        await 获取合同详情();
      } else {
        ctx.root.$message.error(response.message ?? '上传扫描件失败');
      }
    });

    const 点击删除扫描件 = async (url: string) => {
      const result = await AsyncConfirm(ctx, '扫描件删除后无法恢复，是否继续操作？');
      if (!result) {
        return;
      }

      if (detail.value === null) {
        return;
      }

      const { data: response } = await DeleteContractScan({
        contract_id: detail.value.contract_info.id,
        contract_scan_urls: [url],
      });

      if (response.success) {
        await 获取合同详情();
      } else {
        ctx.root.$message.error(response.message ?? '删除失败');
      }
    };

    provide('project_add_id', project_add_id);
    const router = useRouter();
    let routes: { title: string; path?: string; name?: string; params?: any }[] = [
      {
        name: RouterNameProjectManage.marketing.project.list,
        title: '项目管理',
      },
      {
        name: RouterNameProjectManage.marketing.project.detail,
        params: {
          id: router.currentRoute.query.parent_id,
          tab: router.currentRoute.query.parent_tab,
        },
        title: '项目详情',
      },
      {
        path: '',
        title: '客户合同详情',
      },
    ];
    if (breadcrumb.isLiveCustomerContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.live.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.live.project.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
            liveType: 'calendar',
          },
        },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isTiktokLiveCustomerContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.live.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
            liveType: 'calendar',
          },
        },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isSupplyChainCustomerContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.supplyChain.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.supplyChain.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
            liveType: 'SupplyChainDetail',
          },
        },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isLocalLifeCustomerContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.localLife.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.localLife.detail.info,
          params: {
            id: router.currentRoute.query.parent_id,
          },
        },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isCommonBusinessCustomerContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.commonBusiness.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.commonBusiness.project.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
          },
        },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isCoopCustomerContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.marketing.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.marketing.project.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
          },
        },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isLegalCustomerContractDetail) {
      routes = [
        { title: '法务管理', name: RouterLegal.contact },
        { title: '合同管理', name: RouterLegal.contact },
        { title: '客户合同详情' },
      ];
    } else if (breadcrumb.isLegalStatisticsCustomerContractDetail) {
      routes = [
        { title: '法务管理', name: RouterLegal.contact },
        { title: '合同统计', name: RouterLegal.constatistics },
        { title: '客户合同详情' },
      ];
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const postVerify_contract_scan = async (v: any) => {
      v.status = 3;
      approvalLoading.value = true;
      const res = await PostVerify_contract_scan(v);
      approvalLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '驳回成功');
        // queryContract();
        获取合同详情();
      } else {
        ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
      }
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

    const onApprovalHandler = () => {
      dialogProject.show(detail.value?.contract_info?.id);
    };

    // 这里做一下 getContractLink方法提取,调用前拦截一下
    const _RelatedContractHook = useRelatedContract(computed(() => detail.value));
    return {
      approvalLoading,
      onApprovalHandler,
      approval_status: ApprovalStatus,
      ...tabs,
      breadcrumb,
      tabs: newTabs,
      componentName,
      isFlowFromOA,
      flows,
      flowsLoading,
      flowsError,
      onFlowsShow,
      routes,
      ROLE_CODE,
      CONSTRACT_APPROVER,
      detail,
      获取合同详情,
      是否销售合同,
      是否框架合同,
      getToken,
      loading,
      currentUserInfo,
      isRecycled,
      oprateBtnVisiable,
      contract_type_label,
      contract_type_label_class,
      coop_date,
      // * 关联合同相关
      ..._RelatedContractHook,
      getContractLink: (info: any) => {
        if (breadcrumb.isLiveCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterNameProjectManage.live.contract.customer.detailTemplate
                : RouterNameProjectManage.live.contract.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isTiktokLiveCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate
                : RouterNameProjectManage.tiktokLive.contract.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isSupplyChainCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterNameProjectManage.supplyChain.contract.customer.detailTemplate
                : RouterNameProjectManage.supplyChain.contract.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isLocalLifeCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterNameProjectManage.localLife.contract.customer.detailTemplate
                : RouterNameProjectManage.localLife.contract.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isCommonBusinessCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate
                : RouterNameProjectManage.commonBusiness.contract.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isCoopCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterNameProjectManage.marketing.contract.customer.detailTemplate
                : RouterNameProjectManage.marketing.contract.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isLegalCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterLegal.contracts.customer.detailTemplate
                : RouterLegal.contracts.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        } else if (breadcrumb.isLegalStatisticsCustomerContractDetail) {
          return router.resolve({
            name:
              info.template_info || info.frame_contract_type === 5
                ? RouterLegal.statistics.customer.detailTemplate
                : RouterLegal.statistics.customer.detail,
            params: {
              id: info.id,
            },
            query: router.currentRoute.query,
          }).href;
        }
        return _RelatedContractHook.getContractLink(info);
      },
      attachment_list,
      downloadFile,
      contract_scan_urls,
      ...usePlanTable(),
      ...useDetailList(),
      status,
      status_tag_class,
      sale_chances_str_list,
      sale_chances,
      customer_name,
      contract_status_str,
      onTabChange,
      contract_detail_fields,
      新增补充协议对话框,
      打开补充协议对话框,
      补充协议添加完成,
      新增结算单对话框是否可见,
      切换新增结算单对话框是否可见,
      新增结算单关闭回调,
      补充协议结算单列表引用,
      能否显示补充协议和结算单新增按钮,
      能否上传合同扫描件,
      是否有作废按钮权限,
      作废按钮是否禁用,
      作废合同,
      ...上传扫描件逻辑,
      点击删除扫描件,
      上传合同扫描件按钮是否显示,
      删除按钮是否可用,
      是否有删除按钮权限,
      删除合同,
      permission,
      isExternal,
    };
  },
  computed: {
    // 计算是否有审核权限
    hasApprovalRight() {
      if (this.currentUserInfo) {
        // if (this.currentUserInfo.id === CONSTRACT_APPROVER.xyx_manager || this.currentUserInfo.id === CONSTRACT_APPROVER.general_manager || this.currentUserInfo.id === CONSTRACT_APPROVER.risk_control_specialist) {
        if (Object.values(CONSTRACT_APPROVER).includes(this.currentUserInfo.id)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  async mounted() {
    this.获取合同详情();
  },
  methods: {
    preview(attachment_url: string) {
      const url = attachment_url;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        window.open(wrUrl);
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    preview2(contract_scan_urls: string) {
      const url = contract_scan_urls;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        window.open(wrUrl);
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    fixFileToken,
    // 表格1
    cellStyle({ columnIndex }: { columnIndex: number }) {
      if (columnIndex === 4 || columnIndex === 6) {
        //指定坐标
        return 'color-red';
      }
    },
    // 处理销售渠道
    processSaleChanceToStr(saleChance: { sale_chance_name: any }[]) {
      return saleChance.map(item => item.sale_chance_name).join('、');
    },
    // 删除合同
    async handleDeleteContractClick() {
      if (!this.detail) return false;
      const msg = '此操作将删除该合同, 是否继续？';
      const result = await AsyncConfirm({ root: this }, msg);

      if (result) {
        deleteContract({
          contract_id: this.detail.contract_info.id,
        })
          .then(res => {
            this.$message({
              type: res.data.success ? 'success' : 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
            if (res.data.success) {
              this.$router.back();
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '合同删除失败，稍后重试',
              duration: 2000,
              showClose: true,
            });
            console.log(error.message);
          });
      }
    },
    // 编辑合同
    handleEditContractClick() {
      (this.$refs.editContractDialog as any).show(this.detail);
    },
    // 合同附件删除权限
    // @ts-ignore
    attachmentDeleteRight(attachment) {
      const currentUserInfo = this.$store.getters['user/getUserInfo'];
      const visiable =
        attachment.contract_annex_status !== 4 && // 附件状态除审批中状态可以删除
        ((currentUserInfo && currentUserInfo.id === attachment.add_by) || // 创建人自己可以删除
          (currentUserInfo && currentUserInfo.id === attachment.manager_id)); // 创建时指定的客户经理可以删除
      return visiable;
    },
    // 点击审核按钮
    handleReviewBtnClick() {
      (this.$refs.reviewDialog as any).show(this.detail?.contract_info);
    },
    // 获取当前用户的角色码
    getCurrentUserRoleCode() {
      if (this.currentUserInfo && this.currentUserInfo.role_info.length > 0) {
        return this.currentUserInfo.role_info[0].role_code;
      } else {
        return false;
      }
    },
    // 点击设置合同收回状态
    handleContractRecycleChange() {
      setContractRecycle({
        id: this.detail?.contract_info.id,
        is_recycled: this.isRecycled ? 1 : 0,
      })
        .then(res => {
          if (res.data.success) {
            // this.queryContract()
            this.$message({
              type: 'success',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          } else {
            // 出错，恢复之前的状态
            this.isRecycled = !this.isRecycled;
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          // 出错，恢复之前的状态
          this.isRecycled = !this.isRecycled;
          this.$message({
            type: 'error',
            message: '设置合同收回状态失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 点击删除附件
    async handleAttachmentClick(row: Contract) {
      const msg = '此操作将永久删除该附件, 是否继续？';
      const result = await AsyncConfirm({ root: this }, msg);

      if (result) {
        deleteContractAnnex({
          // @ts-ignore
          contract_annex_id: row.id,
          // @ts-ignore
          attachment_url: row.attachment_url,
        })
          .then(res => {
            if (res.data.success) {
              this.$message.success({
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
              this.获取合同详情();
            } else {
              this.$message.warning({
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
            }
          })
          .catch(error => {
            this.$message.error({
              message: '删除附件失败，请稍后重试',
              duration: 2000,
              showClose: true,
            });

            console.error(error);
          });
      }
    },
  },
});
