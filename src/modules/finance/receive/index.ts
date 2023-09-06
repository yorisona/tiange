/**
 * 财务管理 - 收款管理
 * ```
 * 代码初始从 src/modules/finance/receive/index.vue 内剥离出来
 * ! 需要持续优化
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-10 16:36:25
 */
import { computed, defineComponent, h, onMounted, ref } from '@vue/composition-api';
import FinanceInvoiceDetailDialog from '../dialog/finance.invoice.detail.vue';
import { numberMoneyFormat, numberFormat } from '@/utils/formatMoney';
import { ReceiveConfirm, ExportList, UploadInvoice } from '@/api/finance.receive';
import { UploadFile } from '@/api/finance.payment';
import { usePermission } from '@/use/permission';
import Invoicelist from '@/modules/live/project/dialog/invoice.list.vue';
import { BusinessTypeEnum, BusinessTypeMap, BusinessTypeOptions } from '@/types/tiange/common';
import InvoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import WriteListPop from '../components/WriteListPop/index.vue';
import { workbenchStore } from '@/modules/workbench/store';
import { GetApprovalInfo } from '@/services/workbentch';
import { fillEmptyStr } from '@/utils/string';
import { sleep, wait } from '@/utils/func';
import { ElForm } from 'element-ui/types/form';
import { FormRule } from '@/types/vendor/form';
import { fixFileToken } from '@/utils/http';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import reverseAuditDialog from '@/modules/finance/components/reverseAudit.vue';
import { ConfirmReverseParams, ReverseType } from '@/types/tiange/finance/settlement';
import { BooleanType } from '@/types/base/advanced';
import useVisible from '@/use/visible';
import { ConfirmReverse } from '@/services/finance';
import { FinanceReceive, ReverseStatus } from '@/types/tiange/finance/finance';
import { TableColumn } from '@/types/vendor/column';
import { GetReceiveList, GetBankAccountList } from '@/services/finance/receive';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import LoanfinanceDetailModal from '@/modules/finance/components/loan/receivedetail.vue';
import { getFileExtension } from '@/utils/func';
import { usePageJump } from '@/utils/pageJump';
import moment from 'moment';
import ImageViewer from '@/components/Image/ImageViewer';

export default defineComponent({
  name: 'FinanceReceive',
  setup(props, ctx) {
    const permission = usePermission();

    const isFormConsole = computed(() => ctx.root.$router.currentRoute.query.source === 'console');

    const isFormConsoleKaiPiao = computed<any>(
      () => ctx.root.$router.currentRoute.query.source === 'console_kaipiao',
    );
    const isFormDialog = computed(() => ctx.root.$router.currentRoute.query.source === 'dialog');
    const achievement = computed(() => ctx.root.$router.currentRoute.query.achievement);

    const invoiceListItemActiveIndex = ref<number | undefined>(undefined);
    const invoicesVisible = ref(false);
    const queryForm = ref({
      business_type: '',
      gather_type: '',
      query_date_type: 2,
      pay_date: '',
      gather_way: '',
      write_off_status: '',
      is_invoice: isFormConsoleKaiPiao.value ? 1 : '',
      has_invoice_certificate: isFormConsoleKaiPiao.value ? 0 : '',
      is_gather: isFormConsole.value ? 0 : '',
      gather_date: '',
      gmt_create: '',
      search_value: isFormDialog.value ? achievement.value : '',
      search_type: 1,
      page: 1,
      size: 20,
      account_month: '',
    });
    const timeDefault = computed(() => {
      const date = new Date();
      const defaultStartTime: string = moment(date.getTime() - 30 * 24 * 3600 * 1000).format(
        'YYYY-MM-DD',
      );
      const defaultEndTime: string = moment(date.getTime()).format('YYYY-MM-DD');
      return [defaultStartTime, defaultEndTime];
    });
    // @ts-ignore
    queryForm.value.pay_date = timeDefault.value;

    const list = ref<FinanceReceive[]>([]);
    const statistics = ref<any>(null);
    const total = ref(0);
    const loading = ref(true);
    const receiveConfirmVisible = ref(false);
    const receiveConfirm = ref({
      order_date: '',
      receive_account: '',
      pay_company_name: '',
      account: '',
      bank_of_deposit: '',
    });
    const achievement_id = ref<number | ''>('');
    const gather_way = ref<number | ''>('');
    const receiveConfirmRules = ref({
      order_date: { required: true, message: '请选择收款时间', trigger: ['change', 'blur'] },
      receive_account: { required: true, message: '请选择收款账号', trigger: ['change', 'blur'] },
    });
    const uploadVisible = ref(false);
    interface UploadForm {
      invoice_date: string;
      invoice_num: string | number;
      institution: string;
      amount: string | number;
      pic_url: string;
      show_url: string;
    }

    const uploadForm = ref<{ list: UploadForm[] }>({
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
    });

    const uploadFormRules = ref<{ [prop in keyof UploadForm]?: FormRule<UploadForm[prop]>[] }>({
      amount: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback();
            } else if (Number(value) < 0) {
              callback(new Error('开票金额不能小于0'));
            } else {
              callback();
            }
          },
        },
      ],
    });
    const financeInvoiceDetailVisible = ref(false);
    const invoiceList = ref([]);
    const commonTitle = ref('');

    const workbench = computed(() => ctx.root.$store.state.workbench);
    const approval = computed(() => workbench.value.approval);

    const clearInvoiceListItemActiveIndex = () => {
      invoiceListItemActiveIndex.value = undefined;
    };

    const beforeAvatarUpload = (file: File) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (
        !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type) &&
        !['.jpg', '.jpeg', '.png'].includes(getFileExtension(file.name))
      ) {
        ctx.root.$message.warning('文件格式不正确，请使用 png / jpg / jpeg');
        return false;
      }

      if (!isLt5M) {
        ctx.root.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }

      return true;
    };

    const uploadImage = async (index: number, isPaste: boolean, params: Record<string, any>) => {
      const list = uploadForm.value.list.map(el => ({ ...el }));
      const form = new FormData();
      form.append('file', params.file);
      form.append('type', 'certificate/achievement_invoice_certificate');
      form.append('achievement_or_cost_id', `${achievement_id.value}`);
      const [{ data: response }] = await Promise.all([await UploadFile(form), await sleep(500)]);
      if (response.success) {
        const url = response.data.source;
        list[index].show_url = fixFileToken(url, false);
        list[index].pic_url = url;
        uploadForm.value.list = list;
        if (isPaste) {
          ctx.root.$message.success('粘贴成功！');
        }
      } else {
        ctx.root.$message.error('上传失败！');
      }
    };

    const handlePaste = (event: ClipboardEvent, index: number) => {
      const items = (event.clipboardData || (window as any).clipboardData)?.items;
      let file = null;
      if (!items || items.length === 0) {
        ctx.root.$message.error('当前浏览器不支持本地');
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
        ctx.root.$message.error('粘贴内容非图片');
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
        if (beforeAvatarUpload(file)) {
          uploadImage(index, true, { file });
        }
      }
    };

    const inputLoanAmountCost = (value: string, index: number) => {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      uploadForm.value.list[index].amount = result[0];
    };
    const fetchApprovalInfo = async (approval_id: number | '', approval_uid?: string) => {
      const { data: response } = await GetApprovalInfo({
        approval_id: approval_id === '' ? undefined : approval_id,
        approval_uid,
      });
      if (response.success) {
        ctx.root.$store.dispatch('workbench/setApproval', response.data);
      } else {
        ctx.root.$message.error(response.message ?? '获取审批详情失败');
      }
      return response.data;
    };

    /**
     * 相关参数
     * @author 棠棣
     * @since 2021-01-29 14:31
     */
    const getParams = () => {
      const query = queryForm.value;
      return {
        achievement_uid: query.search_type === 1 ? query.search_value : '',
        achievement_name: query.search_type === 2 ? query.search_value : '',
        project_uid: query.search_type === 3 ? query.search_value : '',
        manager_name: query.search_type === 4 ? query.search_value : '',
        shop_or_company_name: query.search_type === 5 ? query.search_value : '',
        project_name: query.search_type === 6 ? query.search_value : '',
        business_type: query.business_type,
        gather_type: query.gather_type,
        gather_way: query.gather_way,
        write_off_status: query.write_off_status,
        is_invoice: query.is_invoice,
        has_invoice_certificate: query.has_invoice_certificate,
        is_gather: query.is_gather,
        gather_date_min:
          query.query_date_type === 1 ? (query.pay_date ? query.pay_date[0] : '') : undefined,
        gather_date_max:
          query.query_date_type === 1 ? (query.pay_date ? query.pay_date[1] : '') : undefined,
        gmt_create_min:
          query.query_date_type === 2 ? (query.pay_date ? query.pay_date[0] : '') : undefined,
        gmt_create_max:
          query.query_date_type === 2 ? (query.pay_date ? query.pay_date[1] : '') : undefined,
        account_month: query.account_month,
      };
    };
    /**
     * 获取列表
     * @author 棠棣
     * @since 2021-01-29 14:16
     */
    const getList = async () => {
      loading.value = true;
      const payload = {
        ...getParams(),
        page: queryForm.value.page,
        size: queryForm.value.size,
      };
      // ! 该函数需要迁移
      const res = await GetReceiveList(payload);
      if (res.data.success) {
        const data = res.data.data;
        list.value = data.data;
        total.value = data.total;
        loading.value = false;
        statistics.value = data.statistics_data;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const onQueryResetClick = () => {
      queryForm.value.business_type = '';
      queryForm.value.gather_type = '';
      queryForm.value.gather_way = '';
      queryForm.value.write_off_status = '';
      queryForm.value.is_invoice = '';
      queryForm.value.has_invoice_certificate = '';
      queryForm.value.is_gather = '';
      queryForm.value.gather_date = '';
      queryForm.value.gmt_create = '';
      queryForm.value.search_value = '';
      queryForm.value.search_type = 1;
      queryForm.value.page = 1;
      queryForm.value.size = 20;
      queryForm.value.query_date_type = 2;
      // @ts-ignore
      queryForm.value.pay_date = timeDefault.value;
      queryForm.value.account_month = '';
      getList();
    };

    /**
     * 导出功能
     * @author 棠棣
     * @since 2021-01-29 14:15
     */
    const exportBtnClick = () => {
      ExportList(getParams());
    };

    /**
     * 查询功能
     * @author 棠棣
     * @since 2021-01-29 14:16
     */
    const onQuerySearchClick = async () => {
      queryForm.value.page = 1;
      getList();
    };

    const handleCurrentChange = (num: number) => {
      queryForm.value.page = num;
      getList();
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.value.page = 1;
      queryForm.value.size = num;
      getList();
    };

    /**
     * 确认收款弹框系列
     * @author 棠棣
     * @since 2021-01-25 16:18
     */
    const bankAccounts = ref<any>([]);
    const collectionInformation = ref<any>({
      receive_account: '',
      pay_company_name: '',
      account: '',
      bank_of_deposit: '',
    });
    const business_type_str = ref<number>();
    const confirmRow = ref<any | undefined>(undefined);
    const receiveConfirmBtnClick = async (item: any) => {
      achievement_id.value = item.achievement_id;
      gather_way.value = item.gather_way;
      business_type_str.value = item.business_type_str;
      if (item.gather_way === 2 || item.gather_way === 3) {
        const bank_account_res = await GetBankAccountList(item.gather_way);
        if (bank_account_res.data.success) {
          bankAccounts.value = bank_account_res.data.data;
        }
      } else {
        bankAccounts.value = [];
      }
      if (item.revenue_flow_id) {
        console.log(item.capital_revenue_flow, '11');

        receiveConfirm.value.order_date = item.order_date?.replace(/-/g, '.');
        // receiveConfirm.value.receive_account = item.receive_account;
        // receiveConfirm.value.pay_company_name = item?.capital_revenue_flow?.account_name;
        // receiveConfirm.value.account = item?.capital_revenue_flow?.account_number;
        collectionInformation.value = {
          receive_account: item.receive_account,
          pay_company_name: item?.capital_revenue_flow?.account_name,
          account: item?.capital_revenue_flow?.account_number,
          bank_of_deposit: item?.capital_revenue_flow?.bank_name,
        };
        // receiveConfirm.value.bank_of_deposit = item?.capital_revenue_flow?.bank_name;

        receiveConfirm.value.receive_account = item.receive_account;
        receiveConfirm.value.pay_company_name = item?.capital_revenue_flow?.payer;
        receiveConfirm.value.account = item?.capital_revenue_flow?.payment_account;
      }
      confirmRow.value = item;
      receiveConfirmVisible.value = true;
    };

    const receiveAccountChange = (account_id: any) => {
      const bankAccount = bankAccounts.value.find((item: any) => item.id === account_id);
      if (bankAccount) {
        receiveConfirm.value.pay_company_name = bankAccount.account_name;
        receiveConfirm.value.account = bankAccount.account_number;
        receiveConfirm.value.bank_of_deposit = bankAccount.bank_name;
      } else {
        receiveConfirm.value.pay_company_name = '';
        receiveConfirm.value.account = '';
        receiveConfirm.value.bank_of_deposit = '';
      }
    };

    const receiveConfirmCloseAction = () => {
      receiveConfirmVisible.value = false;
      receiveConfirm.value = {
        order_date: '',
        receive_account: '',
        pay_company_name: '',
        account: '',
        bank_of_deposit: '',
      };
      collectionInformation.value = receiveConfirm.value;
    };

    /**
     * 上传、编辑发票弹框系列
     * @author 棠棣
     * @since 2021-01-25 17:48
     */
    // const uploadBtnClick = (item: any) => {
    //   commonTitle.value = '上传发票';
    //   achievement_id.value = item.achievement_id;
    //   uploadVisible.value = true;
    // };
    // const editBtnClick = (item: any) => {
    //   commonTitle.value = '编辑发票';
    //   achievement_id.value = item.achievement_id;
    //   const list = JSON.parse(JSON.stringify(item.invoice_info));
    //   for (let index = 0; index < list.length; index++) {
    //     list[index].show_url = fixFileToken(list[index].pic_url, false);
    //   }
    //   uploadForm.value = { list };
    //   uploadVisible.value = true;
    // };
    const uploadCloseAction = () => {
      clearInvoiceListItemActiveIndex();
      uploadVisible.value = false;
      uploadForm.value = {
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
    };

    const deleteUploadItemBtn = (index: number) => {
      uploadForm.value.list.splice(index, 1);
    };

    /**
     * 打开项目详情
     */
    const { jumpProjectDetail } = usePageJump();
    const goProjectDetail = async (row: any) => {
      jumpProjectDetail(row.business_type, {
        project_id: row.project_id,
        newWindow: true,
      });
    };

    /**
     * 打开合同详情
     */
    const goContractDetail = async (contract_id: number, contract_type: number) => {
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
    };

    const invoicesDetailDialogRef = ref<null | { show: (config: { approval_id: number }) => void }>(
      null,
    );

    //开票审批点击
    const handleClickApprovalBtn = async (row: any) => {
      //退款
      if (row.gather_type === 5) {
        jumpProjectDetail(row.business_type, {
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
      if (!row.approval_id) {
        return;
      }
      const approval = await fetchApprovalInfo(row.approval_id);
      invoicesDetailDialogRef.value?.show(approval);
    };

    const invoicelistRef = ref<null | {
      show: (config: { title: string; list: any[]; type: number }) => void;
    }>(null);

    /**
     * 查看收款凭证弹框系列
     * @author 棠棣
     * @since 2021-01-26 14:23
     */
    const checkoutPaymentBtn = (link: string) => {
      const list = link.split(',');
      ImageViewer.show(list);
    };
    const receiveConfirmRef = ref<null | ElForm>(null);

    const handleReceiveConfirmSaveAction = async () => {
      const result = await new Promise(resolve => {
        receiveConfirmRef.value?.validate(async valid => {
          resolve(valid);
        });
      });

      if (!result) {
        return;
      }
      const params = {
        achievement_id: achievement_id.value,
        gather_confirm_detail:
          business_type_str.value === 1
            ? receiveConfirm.value
            : { ...collectionInformation.value, order_date: receiveConfirm.value.order_date },
      };
      const res = await ReceiveConfirm(params);
      if (res.data.success) {
        receiveConfirmVisible.value = false;
        receiveConfirm.value = {
          order_date: '',
          receive_account: '',
          pay_company_name: '',
          account: '',
          bank_of_deposit: '',
        };
        collectionInformation.value = receiveConfirm.value;
        console.log(params, collectionInformation.value, receiveConfirm.value);
        ctx.root.$message.success(res.data.message);
        getList();
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const uploadRef = ref<null | ElForm>(null);
    const uploadSaveAction = async () => {
      const result = await new Promise(resolve => {
        uploadRef.value?.validate(valid => {
          resolve(valid);
        });
      });
      if (!result) {
        return;
      }

      const list = uploadForm.value.list;
      const params = {
        achievement_id: achievement_id.value,
        invoice_info: list.map(el => {
          const { show_url, ...rest } = el;
          return { ...rest };
        }),
      };

      const res = await UploadInvoice(params);
      if (res.data.success) {
        uploadVisible.value = false;
        uploadForm.value = {
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
        getList();
        ctx.root.$message({
          type: 'success',
          message: res.data.message,
        });
      } else {
        ctx.root.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    };

    onMounted(() => {
      getList();
      if (!ctx.root.$store.hasModule('workbench')) {
        ctx.root.$store.registerModule('workbench', workbenchStore);
      }
    });

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
      tableMinHeight: 100,
      delay: 20,
    });

    const reverseAuditDialogRef = ref<{
      open: (
        msg: string,
        cb: (is_pass: BooleanType, reverse_back_reason: string) => Promise<boolean>,
      ) => void;
    } | null>(null);

    const { visible: reverseAuditLoading, toggleVisible: toggleReverseAuditLoading } = useVisible();

    /** 冲销确认动作 */
    const onReverseAuditConfirm = async (
      achievement_id: number,
      is_pass: BooleanType,
      reverse_back_reason: string,
    ) => {
      toggleReverseAuditLoading();

      const params: ConfirmReverseParams = {
        id: achievement_id,
        reverse_type: ReverseType.receive,
        is_pass,
        reverse_back_reason,
      };
      const [{ data: response }] = await wait(500, ConfirmReverse(params));

      toggleReverseAuditLoading();

      if (response.success) {
        ctx.root.$message.success(response.message ?? '提交成功');
      } else {
        ctx.root.$message.error(response.message ?? '提交失败');
      }

      getList();

      return response.success;
    };

    const onReverseAuditBtnClick = (achievement_id: number, reverse_reason: string) => {
      reverseAuditDialogRef.value?.open(reverse_reason, (is_pass, reverse_back_reason) =>
        onReverseAuditConfirm(achievement_id, is_pass, reverse_back_reason),
      );
    };

    // 查看冲销原因弹窗
    const reasonDialogVisible = ref(false);
    const reason = ref('');

    const onReasonViewBtnClick = (reverse_reason: string) => {
      reason.value = reverse_reason;
      reasonDialogVisible.value = true;
    };

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    /** 收款编号渲染函数 */
    const achievement_uid_render = <T extends boolean>(
      row: FinanceReceive,
    ): TableColumnRenderReturn<T> => {
      const { achievement_uid, reversed_id, reverse_id } = row;
      return h(
        'div',
        {
          class: 'number-div',
        },
        [
          h(
            'span',
            {
              class: `number-span ${
                reversed_id !== null || reverse_id !== null ? 'reverse-red' : ''
              }`,
            },
            achievement_uid,
          ),
        ],
      ) as TableColumnRenderReturn<T>;
    };

    /** 收款金额渲染函数 */
    const gather_amount_render = <T extends boolean>(
      row: FinanceReceive,
      text_only: T,
    ): TableColumnRenderReturn<T> =>
      text_only
        ? `${row.gather_amount_str}`
        : (h(
            'span',
            {
              class: row.reverse_id !== null || row.reversed_id !== null ? 'reverse-red' : '',
            },
            [`${row.gather_amount_str}`],
          ) as any);

    /** 收款金额最大宽度 */
    const gather_amount_max_length = max_length_of_column(
      list,
      '收款金额 (元)',
      gather_amount_render,
    );

    /** 操作列渲染函数 */
    const op_render = <T extends boolean>(row: FinanceReceive, text_only: T) => {
      const btns = [];
      if (permission.gathering_confirm || permission.gathering_upload_edit_invoice) {
        if (row.reversed_id !== null && row.reverse_status !== ReverseStatus.wait_confirm) {
          const btn = text_only
            ? '查看'
            : h(
                'a',
                {
                  on: {
                    click: (e: any) => {
                      e.stopPropagation();
                      onReasonViewBtnClick(row.reverse_reason);
                    },
                  },
                },
                ['查看'],
              );
          btns.push(btn);
        }
        if (row.reversed_id !== null && row.reverse_status === ReverseStatus.wait_confirm) {
          const btn = text_only
            ? '冲销确认'
            : h(
                'a',
                {
                  class: 'reverse-red',
                  on: {
                    click: (e: any) => {
                      e.stopPropagation();
                      onReverseAuditBtnClick(row.achievement_id, row.reverse_reason);
                    },
                  },
                },
                ['冲销确认'],
              );

          btns.push(btn);
        }
        if (permission.gathering_confirm && row.is_gather === 0) {
          const btn = text_only
            ? '收款确认'
            : h(
                'a',
                {
                  on: {
                    click: (e: any) => {
                      e.stopPropagation();
                      receiveConfirmBtnClick(row);
                    },
                  },
                },
                ['收款确认'],
              );
          btns.push(btn);
        }
        // if (
        //   permission.gathering_upload_edit_invoice &&
        //   row.is_invoice === BooleanType.YES &&
        //   row.invoice_info.length < 1
        // ) {
        //   const btn = text_only
        //     ? '上传发票'
        //     : h(
        //         'a',
        //         {
        //           on: {
        //             click: (e: any) => {
        //               e.stopPropagation();
        //               uploadBtnClick(row);
        //             },
        //           },
        //         },
        //         ['上传发票'],
        //       );
        //   btns.push(btn);
        // }

        // if (
        //   permission.gathering_upload_edit_invoice &&
        //   row.is_invoice === BooleanType.YES &&
        //   row.invoice_info.length >= 1
        // ) {
        //   const btn = text_only
        //     ? '编辑发票'
        //     : h(
        //         'a',
        //         {
        //           on: {
        //             click: (e: any) => {
        //               e.stopPropagation();
        //               editBtnClick(row);
        //             },
        //           },
        //         },
        //         ['编辑发票'],
        //       );
        //   btns.push(btn);
        // }
      }
      return text_only
        ? btns.join('  ')
        : (h('div', { class: 'operation' }, btns) as TableColumnRenderReturn<T>);
    };

    /** 操作列最大宽度 */
    const op_max_length = max_length_of_column(list, '操作', op_render);

    // 列设置
    const columns = computed<TableColumn<FinanceReceive>[]>(() => [
      {
        label: '收款编号',
        property: 'achievement_uid',
        fixed: 'left',
        minWidth: 170,
        formatter: row => achievement_uid_render(row),
      },
      {
        align: 'right',
        label: '收款金额 (元)',
        fixed: 'left',
        minWidth: gather_amount_max_length.value,
        formatter: row => gather_amount_render(row, false),
      },
    ]);

    // 操作列列设置
    const op_columns = computed<TableColumn<FinanceReceive>[]>(() => [
      {
        label: '操作',
        fixed: 'right',
        align: 'center',
        minWidth: op_max_length.value,
        formatter: row => op_render(row, false),
      },
    ]);

    const writeOffPopoverVisible = (row: FinanceReceive) => {
      let popoverVisible = false;
      if (Number(row.gather_type) === 5) {
        popoverVisible =
          row.refund_write_off_info_items && row.refund_write_off_info_items.length > 0;
      } else {
        popoverVisible = row.write_off_infos && row.write_off_infos.length > 0;
      }
      return popoverVisible;
    };
    const writeOffPopoverInfo = (row: FinanceReceive) => {
      let info = [];
      if (Number(row.gather_type) === 5) {
        info = row.refund_write_off_info_items ?? [];
        info = (row.refund_write_off_info_items ?? []).map((el: any) => {
          const newEl = { ...el };
          newEl.write_off_amount = newEl.write_off_amount * -1;
          return newEl;
          // return {
          //   receivable_uid: el.payable_uid,
          //   write_off_amount: el.write_off_amount * -1,
          //   write_off_user: el.write_off_user,
          //   write_off_time: el.write_off_time,
          // };
        });
      } else {
        info = row.write_off_infos ?? [];
      }
      return info;
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

    const accountDate = (row: FinanceReceive) => {
      return row.account_detail_date
        ? moment(row.account_detail_date * 1000).format('YYYY.MM.DD')
        : '--';
    };

    return {
      BusinessTypeMap,
      BusinessTypeOptions,
      confirmRow,
      columns,
      op_columns,
      reason,
      onReasonViewBtnClick,
      onReasonDialogClose,
      reasonDialogVisible,
      ReverseStatus,
      onReverseAuditBtnClick,
      reverseAuditLoading,
      reverseAuditDialogRef,
      onReverseAuditConfirm,
      invoiceListItemActiveIndex,
      invoicesVisible,
      queryForm,
      list,
      total,
      statistics,
      loading,
      receiveConfirmVisible,
      receiveConfirm,
      achievement_id,
      gather_way,
      receiveConfirmRules,
      uploadVisible,
      uploadForm,
      uploadFormRules,
      financeInvoiceDetailVisible,
      invoiceList,
      commonTitle,
      fillEmptyStr,
      permission,
      workbenchState: workbench,
      approval,
      clearInvoiceListItemActiveIndex,
      beforeAvatarUpload,
      uploadImage,
      handlePaste,
      inputLoanAmountCost,
      fetchApprovalInfo,
      onQueryResetClick,
      getList,
      exportBtnClick,
      onQuerySearchClick,
      handleCurrentChange,
      handlePageSizeChange,
      receiveConfirmBtnClick,
      receiveConfirmCloseAction,
      // uploadBtnClick,
      // editBtnClick,
      uploadCloseAction,
      deleteUploadItemBtn,
      goProjectDetail,
      goContractDetail,
      invoicesDetailDialogRef,
      handleClickApprovalBtn,
      invoicelistRef,
      checkoutPaymentBtn,
      receiveConfirmRef,
      handleReceiveConfirmSaveAction,
      uploadRef,
      uploadSaveAction,
      ...tableHeightLogic,
      onTopCardRectUpdate,
      writeOffPopoverVisible,
      writeOffPopoverInfo,
      bankAccounts,
      receiveAccountChange,
      onRowClick,
      loanDetailVisible,
      detail_data,
      onLoanDetailClose,
      numberFormat,
      accountDate,
    };
  },
  components: {
    LoanfinanceDetailModal,
    reverseAuditDialog,
    FinanceInvoiceDetailDialog,
    Invoicelist,
    InvoicesDetail,
    WriteListPop,
  },
  methods: {
    numberMoneyFormat,
    /**
     * 收款方式
     * @author 棠棣
     * params: type --> Number
     * @since 2021-01-28 13:35
     */
    receiveType(type: number) {
      if (type === 1) {
        return 'V任务';
      } else if (type === 2) {
        return '支付宝';
      } else if (type === 3) {
        return '对公银行';
      } else if (type === 4) {
        return '阿里妈妈';
      } else if (type === 5) {
        return '巨量百应';
      } else {
        return '--';
      }
    },
    addUploadItemBtn() {
      if (this.uploadForm.list.length >= 3) {
        this.$message.error('最多上传3个!');
        return false;
      }
      this.uploadForm.list.push({
        invoice_date: '',
        invoice_num: '',
        institution: '',
        amount: '',
        pic_url: '',
        show_url: '',
      });
    },
    /**
     * 查看发票弹框系列
     * @author 棠棣
     * @since 2021-01-26 14:23
     */
    checkoutInvoiceDetailBtn(list: never[]) {
      this.invoiceList = list;
      this.financeInvoiceDetailVisible = true;
    },
    closeFinanceInvoiceDetailAction() {
      this.financeInvoiceDetailVisible = false;
    },
  },
});
