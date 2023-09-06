/**
 * 财务管理 - 付款管理
 * ```
 * 代码初始从 src/modules/finance/payment/index.vue 内剥离出来
 * ! 需要持续优化
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-11 10:15:17
 */
import { computed, defineComponent, h, ref } from '@vue/composition-api';
import moment from 'moment';
import { numberMoneyFormat, numberFormat } from '@/utils/formatMoney';
import FinanceInvoiceDetailDialog from '@/modules/finance/dialog/finance.invoice.detail.vue';
import invoice from '@/modules/live/project/dialog/invoice';
import { BusinessTypeEnum, BusinessTypeMap } from '@/types/tiange/common';
import Invoicelist from '@/modules/live/project/dialog/invoice.list.vue';
import InvoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import LoanfinanceDetailModal from '@/modules/finance/components/loan/paydetail.vue';

import {
  ExportList,
  CostSplit,
  UploadInvoice,
  UploadFile,
  ConfirmPay,
  GetProjectList,
  SubmitLinkPayment,
} from '@/api/finance.payment';
import { ObjectFilterEmpty } from '@/utils/func';
import { getToken } from '@/utils/token';
import { usePermission } from '@/use/permission';
import { workbenchStore } from '@/modules/workbench/store';
import { GetApprovalInfo } from '@/services/workbentch';
import { ElForm } from 'element-ui/types/form';
import { fixFileToken } from '@/utils/http';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import WriteListPop from '@/modules/finance/components/WriteListPop/index.vue';
import reverseAuditDialog from '@/modules/finance//components/reverseAudit.vue';
import { ConfirmReverse } from '@/services/finance';
import { BooleanType } from '@/types/base/advanced';
import { ConfirmReverseParams, ReverseType } from '@/types/tiange/finance/settlement';
import { TableColumn } from '@/types/vendor/column';
import { CostTypeMap, FinancePayment } from '@/types/tiange/finance/finance';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { Decimal2String, get_length_of_string } from '@/utils/string';
import Decimal from 'decimal.js';
import PaymentDetailDialog from '@/modules/workbench/initiate/payment/detail.vue';
import RefundDetailDialog from '@/modules/marketing/project/dialog/refund/detail.vue';
import AdvanceDetailDialog from '@/modules/workbench/initiate/advance/detail.vue';
import { GetOurBankAccounts } from '@/services/finance';
import { getFileExtension } from '@/utils/func';
import { usePageJump } from '@/utils/pageJump';
import { GetMerchantRefundList } from '@/services/investment';

export default defineComponent({
  name: 'FinancePayment',
  setup(props, ctx) {
    const { jumpProjectDetail } = usePageJump();
    const permission = usePermission();
    const workbench = computed(() => ctx.root.$store.state.workbench);
    const approval = computed(() => workbench.value.approval);

    const urlList = ref<string[]>([]);
    const urlShowList = ref<string[]>([]);
    const reloadFunc = ref<() => void | undefined>();

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 46;
    const rectPadding = 30;
    const otherHeight = 12;
    const reverseAuditLoading = ref<boolean>(false);

    const row_is_pay = ref('');

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      fixedBlockHeightRefs: [topCardHeight],
    });

    const reverseAuditDialogRef = ref<{
      open: (
        msg: string,
        cb: (is_pass: BooleanType, reverse_back_reason: string) => Promise<boolean>,
      ) => void;
    } | null>(null);

    /** 冲销确认动作 */
    const onReverseAuditConfirm = async (
      row: any,
      is_pass: BooleanType,
      reverse_back_reason: string,
    ) => {
      reverseAuditLoading.value = true;

      const params: ConfirmReverseParams = {
        id: row.cost_id,
        reverse_type: ReverseType.payment,
        is_pass,
        reverse_back_reason,
      };
      const res = await ConfirmReverse(params);
      reverseAuditLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '确认成功');
        if (reloadFunc.value) {
          reloadFunc.value();
        }
      } else {
        ctx.root.$message.error(res.data.message ?? '确认失败');
      }

      return res.data.success;
    };

    const handleReverseAduit = (row: any) => {
      reverseAuditDialogRef.value?.open(row.reverse_reason, (is_pass, reverse_back_reason) =>
        onReverseAuditConfirm(row, is_pass, reverse_back_reason),
      );
    };

    // 查看冲销原因弹窗
    const reasonDialogVisible = ref(false);
    const reason = ref('');

    const onReasonViewBtnClick = (row: any) => {
      reason.value = row.reverse_reason;
      reasonDialogVisible.value = true;
    };

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    const search_link_payment = ref<FinancePayment[]>([]);
    const list = ref<FinancePayment[]>([]);

    /** 付款编号渲染函数 */
    const uid_render = <T extends boolean>(row: FinancePayment, text_only: T) =>
      text_only
        ? row.uid
        : (h('span', { class: row.reversed_id !== null ? 'reverse-red' : '' }, [
            row.uid,
          ]) as TableColumnRenderReturn<T>);

    /** 付款编号最大长度 */
    const uid_max_length = max_length_of_column(list, '付款编号', uid_render);

    /** 打款金额渲染函数 */
    const pay_amount_render = <T extends boolean>(row: FinancePayment, text_only: T) => {
      const data = `${Decimal2String(new Decimal(row.pay_amount))}`;
      return text_only
        ? data
        : (h('span', { class: row.reversed_id !== null ? 'reverse-red' : '' }, [
            data,
          ]) as TableColumnRenderReturn<T>);
    };

    /** 打款金额最大宽度 */
    const pay_amount_max_length = max_length_of_column(list, '付款金额（元）', pay_amount_render);

    /** 付款类型渲染函数 */
    const pay_type_render = <T extends boolean>(row: FinancePayment, text_only: T) => {
      const pay_type_text = row.pay_type === 1 ? '成本' : row.pay_type === 2 ? '退款' : '--';
      const new_cost_type_text =
        row.new_cost_type !== 9 ? CostTypeMap.get(row.new_cost_type) ?? '--' : '冲销';

      if (text_only) {
        return get_length_of_string(pay_type_text) > get_length_of_string(new_cost_type_text)
          ? pay_type_text
          : new_cost_type_text;
      }

      return [h('div', [pay_type_text])] as TableColumnRenderReturn<T>;
    };
    /** 付款类型最大宽度 */
    const pay_type_max_length = max_length_of_column(list, '付款类型', pay_type_render);

    /** 付款方式渲染函数 打款方式，((2, 'v任务'), (3, '对公银行'), (4, '支付宝'))*/
    const pay_way_render = <T extends boolean>(row: FinancePayment, text_only: T) => {
      const pay_type_text =
        row.pay_way === 1
          ? '银行卡'
          : row.pay_way === 2
          ? 'v任务'
          : row.pay_way === 3
          ? '对公银行'
          : row.pay_way === 4
          ? '支付宝'
          : '--';
      if (text_only) {
        return pay_type_text;
      }

      return [h('div', [pay_type_text])] as TableColumnRenderReturn<T>;
    };

    /** 付款方式最大宽度 */
    const pay_way_max_length = max_length_of_column(list, '付款方式', pay_way_render);

    const columns = computed<TableColumn<FinancePayment>[]>(() => [
      {
        label: '付款编号',
        fixed: 'left',
        align: 'center',
        minWidth: uid_max_length.value,
        formatter: row => uid_render(row, false),
      },
      {
        align: 'right',
        label: '付款金额 (元)',
        minWidth: pay_amount_max_length.value,
        formatter: row => pay_amount_render(row, false),
      },
      {
        label: '付款类型',
        align: 'center',
        minWidth: pay_type_max_length.value,
        formatter: row => pay_type_render(row, false),
      },
      {
        label: '付款方式',
        align: 'center',
        minWidth: pay_way_max_length.value,
        formatter: row => pay_way_render(row, false),
      },
    ]);
    const writeOffPopoverVisible = (row: FinancePayment) => {
      let popoverVisible = false;
      if (row.pay_type === 2) {
        popoverVisible = row.refund_write_off_infos && row.refund_write_off_infos.length > 0;
      } else {
        popoverVisible = row.write_off_infos && row.write_off_infos.length > 0;
      }
      return popoverVisible;
    };

    const writeOffPopoverInfo = (row: FinancePayment) => {
      let info = [];
      if (row.pay_type === 2) {
        info = (row.refund_write_off_infos ?? []).map(el => {
          const newEl = { ...el };
          newEl.write_off_amount = newEl.write_off_amount * -1;
          return newEl;
        });
      } else {
        info = row.write_off_infos ?? [];
      }
      return info;
    };

    const bank_account_list = ref<any>([]);

    const queryBankAccounts = () => {
      GetOurBankAccounts().then((res: any) => {
        if (res?.data?.success) {
          bank_account_list.value = res.data.data;
        } else {
          ctx.root.$message.error(res?.data?.message ?? '获取银行账号列表失败');
        }
      });
    };
    const loanDetailVisible = ref(false);
    const detail_data = ref({ name: '' });
    const onRowClick = (row: any) => {
      detail_data.value = row;
      loanDetailVisible.value = true;
    };
    const onLoanDetailClose = () => {
      loanDetailVisible.value = false;
    };
    return {
      BusinessTypeMap,
      jumpProjectDetail,
      search_link_payment,
      list,
      columns,
      permission,
      workbenchState: workbench,
      approval,
      urlList,
      urlShowList,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      onReasonViewBtnClick,
      onReasonDialogClose,
      onReverseAuditConfirm,
      reverseAuditDialogRef,
      reverseAuditLoading,
      reasonDialogVisible,
      reason,
      handleReverseAduit,
      reloadFunc,
      writeOffPopoverVisible,
      writeOffPopoverInfo,
      queryBankAccounts,
      bank_account_list,
      row_is_pay,
      onRowClick,
      loanDetailVisible,
      detail_data,
      onLoanDetailClose,
      numberFormat,
    };
  },
  components: {
    LoanfinanceDetailModal,
    FinanceInvoiceDetailDialog,
    Invoicelist,
    // ApplyDetail,
    // RefundDetail,
    // ApplicationDetail,
    InvoicesDetail,
    WriteListPop,
    reverseAuditDialog,
    PaymentDetailDialog,
    RefundDetailDialog,
    AdvanceDetailDialog,
  },
  data() {
    const isFormConsole = this.$router.currentRoute.query.source === 'console';
    return {
      link_payment_list: [],
      linkPaymentVisible: false,
      link_id: '',
      active_id: false,
      choose_radio: '',
      invoiceListItemActiveIndex: undefined,
      applyDetailDialogVisible: false,
      refundVisible: false,
      applicationVisible: false,
      invoicesVisible: false,
      total: 0,
      statistics: null,
      queryForm: {
        business_type: '',
        pay_type: '',
        new_cost_type: '',
        is_invoice: '',
        is_pay: isFormConsole ? 0 : '',
        pay_way: '',
        is_split: '',
        write_off_status: '',
        query_date_type: 3,
        pay_date: '',
        search_value: '',
        search_type: 1,
        page_num: 1,
        num: 20,
      },
      loading: false,
      financeInvoiceDetailVisible: false,
      invoiceList: [],
      paymentConfirmVisible: false,
      paymentConfirmFrom: {
        pay_date: '',
        bank_account_id: '',
      },
      paymentConfirmFromRules: {
        pay_date: { required: true, message: '请选择打款时间', trigger: ['change', 'blur'] },
        bank_account_id: {
          required: true,
          message: '请选择打款账号',
          trigger: ['blur', 'change'],
        },
      },
      fileList: [],
      // urlList: [],
      // urlShowList: [],
      uploadVisible: false,
      tax_point: '',
      uploadForm: {
        list: [
          {
            invoice_date: '',
            invoice_num: '',
            institution: '',
            amount: '',
            pic_url: '',
            show_url: '',
          },
        ],
      },
      costSplitVisible: false,
      costSplitForm: {},
      commonTitle: '',
      project_options: [],
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
  computed: {
    timeDefault() {
      const date = new Date();
      const defaultStartTime: string = moment(date.getTime() - 30 * 24 * 3600 * 1000).format(
        'YYYY-MM-DD',
      );
      const defaultEndTime: string = moment(date.getTime()).format('YYYY-MM-DD');
      return [defaultStartTime, defaultEndTime];
    },
  },
  created() {
    // @ts-ignore
    this.queryForm.pay_date = this.timeDefault;
    this.reloadFunc = () => {
      this.getList();
    };
    this.getList();
    this.costType(1);
    if (!this.$store.hasModule('workbench')) {
      this.$store.registerModule('workbench', workbenchStore);
    }
  },
  methods: {
    clearInvoiceListItemActiveIndex() {
      this.invoiceListItemActiveIndex = undefined;
    },
    onEnterPressLinkPayment() {
      this.getLinkPaymentList();
    },

    handlePushClick(item: any, index: number) {
      this.search_link_payment.splice(index, 1);
      // @ts-ignore
      this.link_payment_list.unshift(item);
      this.link_id = '';
    },

    handleRemoveClick(index: number, costId: number | string) {
      this.link_payment_list.splice(index, 1);
      if (costId === this.choose_radio) {
        this.choose_radio = '';
      }
    },

    async getLinkPaymentList() {
      if (this.link_id === '') {
        return false;
      }
      const res = await GetMerchantRefundList({
        cost_id: this.link_id,
      });
      if (res.data.success) {
        const data = res.data.data;
        if (data.data.length > 0) {
          if (JSON.stringify(data.data[0].associate_cost) === '{}') {
            const linkId = this.link_id;
            // @ts-ignore
            this.active_id = this.link_payment_list.some(
              // @ts-ignore
              item => item.cost_id.toString() === linkId,
            );
            this.search_link_payment = data.data;
          } else {
            this.$message.warning('该付款记录已完成关联!');
          }
        } else {
          this.$message.warning('请输入正确的付款ID!');
        }
      } else {
        this.$message.warning('请输入正确的付款ID!');
      }
    },

    showLinkPaymentBtnClick() {
      this.linkPaymentVisible = true;
    },
    linkPaymentCloseAction() {
      this.linkPaymentVisible = false;
      this.link_payment_list = [];
      this.search_link_payment = [];
      this.link_id = '';
      this.choose_radio = '';
    },
    async linkPaymentSubmitAction() {
      if (this.link_payment_list.length < 2) {
        this.$message.warning('请添加至少2条付款记录！');
        return false;
      }

      const list = this.link_payment_list;
      // @ts-ignore
      const allIsPay = list.every(item => item.is_pay === 0);

      if (!allIsPay && this.choose_radio === '') {
        this.$message.warning('请选择需要保留的凭证及发票！');
        return false;
      } else {
        const cost_ids: any[] = [];
        for (let index = 0; index < list.length; index++) {
          // @ts-ignore
          cost_ids.push(list[index].cost_id);
        }
        const res = await SubmitLinkPayment({
          cost_ids,
          reserve_id: this.choose_radio,
          confirm: false,
        });
        if (res.data.success) {
          this.$confirm('确认将这些付款记录进行关联? 关联成功后不可撤销', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(async () => {
              const res = await SubmitLinkPayment({
                cost_ids,
                reserve_id: this.choose_radio,
                confirm: true,
              });
              if (res.data.success) {
                this.$message({
                  type: 'success',
                  message: '关联成功!',
                });
                this.linkPaymentCloseAction();
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message,
                });
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消',
              });
            });
        } else {
          this.$message({
            type: 'error',
            message: res.data.message,
          });
        }
      }
    },

    handlePaste(event: ClipboardEvent, index: number) {
      if (index === -1) {
        if (this.urlList.length === 3) {
          return;
        }
      }
      const items = (event.clipboardData || (window as any).clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error('当前浏览器不支持本地');
        return;
      }

      // 搜索剪切板items
      for (let index = 0; index < items.length; index++) {
        if (items[index].type.indexOf('image') !== -1) {
          file = items[index].getAsFile();
          break;
        }
      }

      if (!file) {
        this.$message.error('粘贴内容非图片');
        return;
      }

      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      // const that = this;
      const reader = new FileReader();

      reader.onload = () => {
        // preview.innerHTML = `<img src="${event.target.result}" class="upload-image" id="upload-image">`;
        // 截图地址赋值给img
        // this.img_src_list.push(event.target.result);
      };
      //调用reader.readAsDataURL()方法，把图片转成base64
      reader.readAsDataURL(file);
      if (file) {
        if (this.beforeUpload(file)) {
          if (index === -1) {
            this.uploadConfirmImage(true, { file });
          } else {
            this.uploadImage(index, true, { file });
          }
        }
        // this.uploadPlans(index:number);
      }
    },
    getToken,
    numberMoneyFormat,
    /**
     *@description: 金额两位数限制
     *@author: 棠棣
     *@param: type=1: 上传/编辑发票开票金额 type=2: 上传/编辑发票税点金额 type=3: 成本拆分费用金额
     *@since: 2021/3/8 17:31
     */
    inputLoanAmountCost(index: number, value: string, type: number) {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      if (type === 1) {
        this.uploadForm.list[index].amount = result[0];
      } else if (type === 2) {
        this.tax_point = result[0];
      } else if (type === 3) {
        (this.costSplitForm as any).cost[index].price = result[0];
      }
    },
    async fetchApprovalInfo(approval_id: number | '', approval_uid?: string) {
      const { data: response } = await GetApprovalInfo({
        approval_id: approval_id === '' ? undefined : approval_id,
        approval_uid,
      });
      if (response.success) {
        this.$store.dispatch('workbench/setApproval', response.data);
      } else {
        this.$message.error(response.message ?? '获取审批详情失败');
      }
      return response.data;
    },
    async handleClickApprovalBtn(row: any) {
      if (row.pay_type === 2) {
        //退款点击
        this.jumpProjectDetail(row.business_type, {
          project_id: row.project_id,
          tab:
            row.business_type === BusinessTypeEnum.marketing
              ? 'achievement'
              : row.business_type === BusinessTypeEnum.mcn
              ? '/collection'
              : row.business_type === BusinessTypeEnum.locallife
              ? 'income'
              : row.business_type === BusinessTypeEnum.supplyChain
              ? 'income'
              : '/income',
          newWindow: true,
        });
        return;
      }
      const approval = await this.fetchApprovalInfo(row.approval_id);
      if (approval) {
        if (row.approval_type === 1) {
          // 用款申请详情
          this.applyDetailDialogVisible = true;
          // this.$nextTick(() => {
          //   (this.$refs.applyDetailDialog as any).show({
          //     approval_id: row.approval_id,
          //   });
          // });
        } else if (row.approval_type === 2) {
          // 退款申请详情
          this.refundVisible = true;
          // this.$nextTick(() => {
          //   (this.$refs.refundDetailDialog as any).show({
          //     approval_id: row.approval_id,
          //   });
          // });
        } else if (row.approval_type === 3) {
          // 垫款款申请详情
          this.applicationVisible = true;

          // this.$nextTick(() => {
          //   (this.$refs.applicationDetailDialog as any).show({
          //     approval_id: row.approval_id,
          //   });
          // });
        } else if (row.approval_type === 4) {
          // 开票申请详情
          this.invoicesVisible = true;
          this.$nextTick(() => {
            (this.$refs.invoicesDetailDialog as any).show({
              approval_id: row.approval_id,
            });
          });
        }
      }
    },
    async handleClickApplicationBtn(row: any) {
      if (!row.borrowing_approval_id) {
        return;
      }
      const approval = await this.fetchApprovalInfo(row.borrowing_approval_id);
      if (approval) {
        this.applicationVisible = true;
      }
      // 垫款申请详情
      // this.$nextTick(() => {
      //   (this.$refs.applicationDetailDialog as any).show({
      //     approval_id: row.borrowing_approval_id,
      //   });
      // });
    },

    costType(type: number) {
      return (
        new Map([
          [1, '人员工资'],
          [2, '主播服务费'],
          [3, '固定资产采购'],
          [4, '水电'],
          [5, '装修'],
          [6, '房租'],
          [7, '营销成本'],
          [8, '返点'],
        ]).get(type) ?? '--'
      );
    },
    /**
     *@description: 打款凭证弹框系列
     *@author: 棠棣
     *@since: 2021/2/2 10:50
     */
    checkoutCertificateBtn(link: string) {
      const list = link.split(',');
      if (list.length === 1) {
        invoice.showDetail(list[0] + '?Authorization=' + getToken());
      } else {
        (this.$refs.invoicelistRef as any).show({
          title: '打款凭证',
          list: list.map(val => val + '?Authorization=' + getToken()),
          type: 1,
        });
      }
    },

    /**
     *@description: 导出功能
     *@author: 棠棣
     *@since: 2021/2/2 14:00
     */
    exportBtnClick() {
      const params = this.getParams();
      ExportList({ ...ObjectFilterEmpty(params) });
    },

    async getCustmerByContractNo(param: any) {
      const res = await GetProjectList({
        project_uid: param,
        business_type: (this.costSplitForm as any).business_type,
      });
      if (res.data.success) {
        this.project_options = res.data.data;
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },

    /**
     *@description: 获取列表
     *@author: 棠棣
     *@since: 2021/1/29 14:16
     */
    async getList() {
      this.loading = true;
      const res = await GetMerchantRefundList({
        ...ObjectFilterEmpty({
          ...this.getParams(),
          page_num: this.queryForm.page_num,
          num: this.queryForm.num,
        }),
      });
      if (res.data.success) {
        const data = res.data.data;
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
        this.statistics = data.statistics_data;
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },
    /**
     *@description: 打开项目详情
     */
    async goProjectDetail(row: any) {
      this.jumpProjectDetail(row.business_type, {
        project_id: row.project_id,
        newWindow: true,
      });
    },
    /**
     *@description: 打开合同详情
     */
    async goContractDetail(contract_id: number | '', contract_type: number) {
      if (!contract_id) {
        return;
      }
      if (contract_type === 1 || contract_type === 2) {
        window.open('/legal/contract/customer/' + contract_id);
      } else if (contract_type === 3 || contract_type === 4) {
        window.open('/legal/contract/supplier/' + contract_id);
      } else if (contract_type === 5) {
        window.open('/legal/contract/customerTemplate/' + contract_id);
      } else if (contract_type === 6) {
        window.open('/legal/contract/supplierTemplate/' + contract_id);
      } else if (contract_type === 7) {
        window.open('/legal/contract/anchorTemplate/' + contract_id);
      } else {
        return;
      }
    },

    /**
     *@description: 相关参数
     *@author: 棠棣
     *@since: 2021/1/29 14:31
     */
    getParams() {
      const query = this.queryForm;
      return {
        search_type: query.search_type,
        search_value: query.search_value,
        business_type: query.business_type,
        pay_type: query.pay_type,
        new_cost_type: query.new_cost_type,
        is_invoice: query.is_invoice,
        is_pay: query.is_pay,
        pay_way: query.pay_way,
        is_split: query.is_split,
        write_off_status: query.write_off_status,
        query_date_type: query.query_date_type,
        start_date: query.pay_date ? query.pay_date[0] : '',
        end_date: query.pay_date ? query.pay_date[1] : '',
      };
    },

    onQuerySearchClick() {
      this.queryForm.page_num = 1;
      this.getList();
    },
    onQueryResetClick() {
      this.queryForm = {
        business_type: '',
        pay_type: '',
        new_cost_type: '',
        is_invoice: '',
        is_pay: '',
        pay_way: '',
        is_split: '',
        write_off_status: '',
        query_date_type: 3,
        pay_date: '',
        search_value: '',
        search_type: 1,
        page_num: 1,
        num: 20,
      };
      // @ts-ignore
      this.queryForm.pay_date = this.timeDefault;
      this.getList();
    },
    handleCurrentChange(num: number) {
      this.queryForm.page_num = num;
      this.getList();
    },
    handlePageSizeChange(num: number) {
      this.queryForm.page_num = 1;
      this.queryForm.num = num;
      this.getList();
    },

    /**
     *@description: 查看发票弹框系列
     *@author: 棠棣
     *@since: 2021/1/26 14:23
     */
    checkoutInvoiceDetailBtn(list: never[]) {
      this.invoiceList = list;
      this.financeInvoiceDetailVisible = true;
    },
    closeFinanceInvoiceDetailAction() {
      this.financeInvoiceDetailVisible = false;
    },
    /**
     *@description: 打款确认弹框系列
     *@author: 棠棣
     *@since: 2021/1/26 18:01
     */
    paymentConfirmClick(item: any) {
      this.commonTitle = '打款确认';
      this.row_is_pay = item.is_pay;
      (this as any).cost_id = item.cost_id;
      this.paymentConfirmVisible = true;
      this.queryBankAccounts();
    },

    editConfirmClick(item: any) {
      this.commonTitle = '编辑打款凭证';
      (this as any).cost_id = item.cost_id;
      this.paymentConfirmFrom.pay_date = item.pay_date;
      this.paymentConfirmFrom.bank_account_id = item.bank_account_id;
      this.row_is_pay = item.is_pay;
      const list = item.pay_certificate_pic.split(',');
      const showList = [];
      this.urlList = list;
      for (const item of list) {
        showList.push(item + `?Authorization=${getToken()}`);
      }
      (this as any).urlShowList = showList;
      this.paymentConfirmVisible = true;
    },
    paymentConfirmCloseAction() {
      this.paymentConfirmVisible = false;
      this.paymentConfirmFrom = {
        pay_date: '',
        bank_account_id: '',
      };
      this.urlList = [];
      this.urlShowList = [];
    },
    handlePaymentConfirmSaveAction(formName: string) {
      (this.$refs[formName] as ElForm).validate(async valid => {
        if (this.urlList.length < 1) {
          this.$message({
            message: '请上传打款凭证',
            type: 'warning',
          });
          return false;
        }
        if (valid) {
          const params = {
            cost_id: (this as any).cost_id,
            pay_certificate_pic: this.urlList,
            pay_date: this.paymentConfirmFrom.pay_date,
            bank_account_id: this.paymentConfirmFrom.bank_account_id,
          };
          const res = await ConfirmPay(params);
          if (res.data.success) {
            this.paymentConfirmVisible = false;
            this.urlList = [];
            this.urlShowList = [];
            this.paymentConfirmFrom = {
              pay_date: '',
              bank_account_id: '',
            };
            this.getList();
            this.$message({
              type: 'success',
              message: res.data.message,
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    },
    deleteConfirmItemBtn(index: number) {
      this.urlList.splice(index, 1);
      this.urlShowList.splice(index, 1);
    },
    async uploadConfirmImage(isPaste: boolean, params: Record<string, any>) {
      const cost_id = (this as any).cost_id;
      const form = new FormData();
      form.append('file', params.file);
      form.append('type', 'certificate/cost_pay_certificate');
      form.append('achievement_or_cost_id', cost_id);
      const { data: response } = await UploadFile(form);
      if (response.success) {
        this.urlShowList.push(response.data.source + `?Authorization=${getToken()}`);
        this.urlList.push(response.data.source);
        if (isPaste) {
          this.$message.success('粘贴成功！');
        }
      } else {
        this.$message.error('上传失败！');
      }
    },

    /**
     *@description: 成本拆分弹框系列
     *@author: 棠棣
     *@since: 2021/1/27 13:52
     */
    costSplitBtnClick(item: any) {
      this.costSplitForm = {
        pay_amount: item.pay_amount,
        business_type: item.business_type,
        new_cost_type: item.new_cost_type,
        cost_id: item.cost_id,
        cost: [
          {
            project_id: '',
            price: '',
          },
        ],
      };
      this.costSplitVisible = true;
    },
    costSplitCloseAction() {
      this.costSplitVisible = false;
    },
    costSplitSaveAction(formName: string) {
      (this.$refs[formName] as ElForm).validate(async valid => {
        if (valid) {
          const params = {
            cost_id: (this.costSplitForm as any).cost_id,
            cost: (this.costSplitForm as any).cost,
          };
          const res = await CostSplit(params);
          if (res.data.success) {
            this.costSplitVisible = false;
            this.costSplitForm = {};
            this.$message({
              type: 'success',
              message: res.data.message,
            });
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    },
    addCostSplitItemBtn() {
      (this.costSplitForm as any).cost.push({
        project_id: '',
        price: '',
      });
    },
    deleteCostSplitItemBtn(index: number) {
      (this.costSplitForm as any).cost.splice(index, 1);
    },

    // editBtnClick(item: any) {
    //   this.commonTitle = '编辑发票';
    //   (this as any).cost_id = item.cost_id;
    //   this.tax_point = item.tax_point;
    //   const list = JSON.parse(JSON.stringify(item.invoice_info));
    //   for (let index = 0; index < list.length; index++) {
    //     list[index].show_url = list[index].pic_url + `?Authorization=${getToken()}`;
    //   }
    //   this.uploadForm = { list };
    //   this.uploadVisible = true;
    // },

    // uploadBtnClick(item: any) {
    //   this.commonTitle = '上传发票';
    //   (this as any).cost_id = item.cost_id;
    //   this.tax_point = item.tax_point;
    //   this.uploadForm = {
    //     list: [
    //       {
    //         invoice_date: '',
    //         invoice_num: '',
    //         institution: '',
    //         amount: '',
    //         pic_url: '',
    //         show_url: '',
    //       },
    //     ],
    //   };
    //   this.uploadVisible = true;
    // },
    uploadCloseAction() {
      this.uploadVisible = false;
      this.clearInvoiceListItemActiveIndex();
      this.uploadForm = {
        list: [
          {
            invoice_date: '',
            invoice_num: '',
            institution: '',
            amount: '',
            pic_url: '',
            show_url: '',
          },
        ],
      };
    },
    uploadSaveAction(formName: string) {
      (this.$refs[formName] as ElForm).validate(async valid => {
        if (Number(this.tax_point) < 0) {
          this.$message({
            message: '税点金额不能小于0',
            type: 'warning',
          });
          return false;
        }
        const list = this.uploadForm.list;
        for (let listIndex = 0; listIndex < list.length; listIndex++) {
          if (Number(list[listIndex].amount) < 0) {
            this.$message({
              message: '开票金额不能小于0',
              type: 'warning',
            });
            return false;
          }
        }
        if (valid) {
          // for (let index = 0; index < list.length; index++) {
          //   delete list[index].show_url;
          // }
          const params = {
            cost_id: (this as any).cost_id,
            tax_point: this.tax_point,
            invoice_info: list,
          };
          const res = await UploadInvoice(params);
          if (res.data.success) {
            this.uploadVisible = false;
            this.uploadForm = {
              list: [
                {
                  invoice_date: '',
                  invoice_num: '',
                  institution: '',
                  amount: '',
                  pic_url: '',
                  show_url: '',
                },
              ],
            };
            this.getList();
            this.$message({
              type: 'success',
              message: res.data.message,
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    },
    beforeUpload(file: File) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (
        !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type) &&
        !['.jpg', '.jpeg', '.png'].includes(getFileExtension(file.name))
      ) {
        this.$message.warning('文件格式不正确，请使用 png / jpg / jpeg');
        return false;
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }
      return true;
    },

    async uploadImage(index: number, isPaste: boolean, params: Record<string, any>) {
      const list = JSON.parse(JSON.stringify(this.uploadForm.list));
      const form = new FormData();
      form.append('file', params.file);
      form.append('type', 'certificate/cost_invoice_certificate');
      const { data: response } = await UploadFile(form);
      if (response.success) {
        const url = response.data.source;
        list[index].show_url = fixFileToken(url, false);
        list[index].pic_url = url;
        this.uploadForm.list = list;
        if (isPaste) {
          this.$message.success('粘贴成功！');
        }
      } else {
        this.$message.error('上传失败！');
      }
    },
    addUploadItemBtn() {
      this.uploadForm.list.push({
        invoice_date: '',
        invoice_num: '',
        institution: '',
        amount: '',
        pic_url: '',
        show_url: '',
      });
    },
    deleteUploadItemBtn(index: number) {
      this.uploadForm.list.splice(index, 1);
    },
  },
});
