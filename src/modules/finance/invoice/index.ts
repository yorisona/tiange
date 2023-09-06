/*
 * 财务管理 / 发票管理
 * @Date: 2021-08-19 16:09:35
 */

import { FinanceInvoice, FinanceInvoiceListQueryParams } from '@/types/tiange/finance/invoice';
// import { AsyncConfirm } from '@/use/asyncConfirm';
import {
  computed,
  defineComponent,
  h,
  onMounted,
  reactive,
  Ref,
  ref,
  SetupContext,
} from '@vue/composition-api';
import { FinanceInvoiceCol, useColumns } from './use/columns';
import InvoiceReverseDialog from './dialog/invoice.reverse.vue';
import InvoiceRedDialog from './dialog/invoice.red.vue';
import {
  // AbolishFinancialInvoice,
  GetFinanceInvoiceList,
  GetFinanceInvoiceStatistics,
} from '@/services/finance/invoice';
import { wait } from '@/utils/func';
import { getToken } from '@/utils/token';
import { usePermission } from '@/use/permission';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue';
import getRectHeightData from '@/utils/autoHeight';
import moment from 'moment';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { GetFeishuDepartmentList } from '@/services/live';
import { departmentFilterDisabled } from '@/utils/filter';
import { exportReport } from '@/modules/finance/report/useReport';
import invoiceApproval from '@/modules/finance/invoice/dialog/invoiceApproval/index.vue';
import { useDialog } from '@/use/dialog';
import { useRouter } from '@/use/vue-router';
import { formatAmount } from '@/utils/string';
import invoiceCancel from '@/modules/finance/invoice/dialog/invoiceCancel/index.vue';

const JwtToken = getToken();

const useList = (ctx: SetupContext) => {
  const DataList = ref<FinanceInvoice[]>([]);
  const statisticsData = ref<any>();
  const total_count = ref<number>(0);
  const loading = ref(false);

  const loadStatisticsData = async (payload: FinanceInvoiceListQueryParams) => {
    const res = await GetFinanceInvoiceStatistics(payload);
    if (res.data.success) {
      statisticsData.value = res.data.data;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: res.data.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  const loadDataList = async (payload: FinanceInvoiceListQueryParams) => {
    loading.value = true;
    loadStatisticsData(payload);
    const [{ data: response }] = await wait(500, GetFinanceInvoiceList(payload));
    loading.value = false;

    if (response.success) {
      DataList.value = response.data.data;
      total_count.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  return { DataList, statisticsData, total_count, loadDataList, loading };
};

export default defineComponent({
  components: {
    InvoiceReverseDialog,
    ElImageViewer,
    InvoiceRedDialog,
  },
  data() {
    const InvoiceUploadAPIURL = '/api/financial/save_invoice';
    const InvoiceUploadHeaders = {
      Authorization: JwtToken,
    };
    return {
      InvoiceUploadAPIURL,
      InvoiceUploadHeaders,
    };
  },
  setup(_, ctx) {
    const router = useRouter();
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const invoiceReverseDialogVisible = ref<boolean>(false);
    const invoiceRedDialogRef = ref<{ show(): void } | null>(null);
    const permission = usePermission();
    const uploadLoading = ref(false);
    const currentMonth = moment().format('YYYY.MM');

    const BeforeInvoiceUploadHandler = () => {
      uploadLoading.value = true;
    };

    const InvoiceUploadResponseHandler = async (
      resp: { success: boolean; message: string },
      _: any,
    ) => {
      uploadLoading.value = false;
      if (resp.success) {
        ctx.root.$message.success(resp.message);
        await reload();
      } else {
        ctx.root.$message.error(resp.message);
      }
    };

    const QueryForm = ref<any>({
      page_num: 1,
      num: 20,
      write_off_status: '',
      invoice_status: '',
      invoice_type: '',
      invoice_number: router.currentRoute.query.invoice_number || '',
      buyer_name: '',
      seller_name: '',
      is_special: '',
      settlement_uid: '',
      project_name: '',
      is_real: '',
      invoice_month: '',
      business_type: '',
      feishu_department_id: '',
      settlement_month: '',
      account_month: '',
    });
    const QueryFormCopy = ref<any>({});

    const invoiceReverseHandle = () => {
      invoiceReverseDialogVisible.value = true;
    };

    const { DataList, statisticsData, total_count, loadDataList, loading } = useList(ctx);

    const currentInvoice = ref<FinanceInvoice | undefined>(undefined);
    const invoiceApprovalDialog = useDialog({
      title: '发票归档确认',
      width: '400px',
      footer: false,
      component: invoiceApproval,
      on: {
        submit() {
          console.log('submit');
          reload();
        },
      },
    });

    const getColumns = (
      ctx: SetupContext,
      data: Ref<FinanceInvoice[]>,
      reverseHandle: () => void,
      showPreviewViewer: (urllist: string[]) => void,
    ) => {
      const {
        invoice_number_column,
        invoice_date_column,
        invoice_amount_column,
        seller_name_column,
        buyer_name_column,
        tax_rate_column,
        tax_amount_column,
        tax_excluded_amount_column,
        invoice_type_column,
        invoice_status_column,
        invoice_content_column,
        invoice_archive_column,
        invoice_real_type_column,
        invoice_Special_Ticket_column,
        add_by_name_column,
        writeoff_status_column,
        // settlement_circle_column,
        // billing_date_column,
        invoice_picture_column,
      } = useColumns(data, showPreviewViewer);

      const invoiceCancelDialog = useDialog({
        title: '发票作废',
        width: 300,
        component: invoiceCancel,
        on: {
          async submit() {
            await reload();
          },
        },
      });
      /** 作废操作 */
      const doCancelAction = async (ctx: SetupContext, row: FinanceInvoice) => {
        invoiceCancelDialog.show(row.id);
        // const confirm = await AsyncConfirm(ctx, {
        //   title: '确认发票作废吗？',
        //   content: '发票作废后相关发票核销记录将被冲销。',
        // });
        //
        // if (confirm) {
        //   const [{ data }] = await wait(500, AbolishFinancialInvoice({ id: row.id }));
        //   if (data.success) {
        //     ctx.root.$message.success('作废成功');
        //     await reload();
        //   } else {
        //     ctx.root.$message({
        //       type: 'warning',
        //       message: data.message ?? '作废失败，稍后重试',
        //       duration: 2000,
        //       showClose: true,
        //     });
        //   }
        // }
      };

      function redSaleInvoice(row: FinanceInvoice) {
        currentInvoice.value = row;
        invoiceRedDialogRef.value?.show();
      }

      const columns = computed<FinanceInvoiceCol[]>(() => [
        buyer_name_column.value,
        seller_name_column.value,
        invoice_number_column.value,
        invoice_date_column.value,
        invoice_amount_column.value,
        tax_rate_column.value,
        tax_amount_column.value,
        tax_excluded_amount_column.value,
        invoice_type_column.value,
        invoice_Special_Ticket_column.value,
        invoice_status_column.value,
        invoice_content_column.value,
        invoice_real_type_column.value,
        invoice_archive_column.value,
        add_by_name_column.value,
        writeoff_status_column.value,
        // settlement_circle_column.value,
        // billing_date_column.value,
        invoice_picture_column.value,
        permission.write_off_invoice || permission.void_invoice
          ? {
              label: permission.write_off_invoice || permission.void_invoice ? '操作' : '',
              fixed: permission.write_off_invoice || permission.void_invoice ? 'right' : false,
              width: permission.write_off_invoice || permission.void_invoice ? 160 : 1,
              formatter: row => {
                const invoiceDate = moment(row.invoice_date * 1000).format('YYYY.MM');
                /** 已作废 不展示操作按钮 */
                if (row.invoice_status === 2) {
                  return;
                }
                const btns = [];

                const style =
                  row.write_off_status !== 2 && row.archive_status === 1
                    ? 'visibility: visible'
                    : 'visibility: hidden';
                if (permission.write_off_invoice && row.invoice_status === 1) {
                  btns.push(
                    h(
                      'a',
                      {
                        style: style,
                        on: {
                          click: () => {
                            if (row.write_off_status !== 2) {
                              currentInvoice.value = row;
                              reverseHandle();
                            }
                          },
                        },
                      },
                      ['核销'],
                    ),
                  );
                }
                /** 合拼两个作废弹窗，判断条件合并 invoice_type 1-销售发票, 2-采购发票*/
                if (
                  permission.void_invoice &&
                  row.invoice_status === 1 &&
                  (row.invoice_type !== 1 ||
                    (row.invoice_type === 1 && currentMonth === invoiceDate))
                ) {
                  btns.push(
                    h(
                      'a',
                      {
                        on: {
                          click: () => {
                            doCancelAction(ctx, row);
                          },
                        },
                      },
                      ['作废'],
                    ),
                  );
                }

                if (
                  permission.void_invoice &&
                  row.invoice_type === 1 &&
                  row.invoice_status === 1 &&
                  currentMonth !== invoiceDate
                ) {
                  btns.push(
                    h(
                      'a',
                      {
                        on: {
                          click: () => {
                            redSaleInvoice(row);
                          },
                        },
                      },
                      ['开红票'],
                    ),
                  );
                }
                if (permission.invoice_archive_approval_ && !row.archive_status) {
                  btns.push(
                    h(
                      'a',
                      {
                        on: {
                          click: () => {
                            invoiceApprovalDialog.show(row.id);
                          },
                        },
                      },
                      ['审核'],
                    ),
                  );
                }
                return h('div', { class: 'operation' }, btns);
              },
            }
          : {
              label: '操作',
              fixed: 'right',
              width: 50,
            },
      ]);
      return columns;
    };

    const showViewer = ref(false);
    const ImageUrlList = ref<string[]>([]);

    const closeViewer = () => {
      showViewer.value = false;
    };

    const showPreviewViewer = (urllist: string[]) => {
      showViewer.value = true;
      ImageUrlList.value = urllist;
    };

    const columns = getColumns(ctx, DataList, invoiceReverseHandle, showPreviewViewer);

    const reload = async (clean = true, isExport = false) => {
      if (clean) {
        QueryForm.value.page_num = 1;
      }
      let payload: any;
      if (!isExport) {
        payload = JSON.parse(JSON.stringify(QueryForm.value));
        QueryFormCopy.value = { ...payload };
      } else {
        payload = JSON.parse(JSON.stringify(QueryFormCopy.value));
      }

      /* if (payload.is_real === 1) {
        payload.is_real = true;
      } else if (payload.is_real === 0) {
        payload.is_real = false;
      }*/
      if (payload.invoice_month) {
        const invoice_month = moment(payload.invoice_month).startOf('month');
        payload.invoice_month = invoice_month.format('YYYY-MM');
      }
      if (payload.settlement_month) {
        const settlement_month = moment(payload.settlement_month).startOf('month');
        payload.settlement_month = settlement_month.format('YYYY-MM');
      }
      if (payload.account_month) {
        const account_month = moment(payload.account_month).startOf('month');
        payload.account_month = account_month.format('YYYY-MM');
      }
      if (isExport) {
        payload.num = 4000;
        exportReport(payload, '/api/financial/export_invoice');
        return;
      }

      await loadDataList(payload);
    };
    const resetQueryForm = () => {
      QueryForm.value.write_off_status = '';
      QueryForm.value.invoice_status = '';
      QueryForm.value.invoice_type = '';
      QueryForm.value.invoice_number = '';
      QueryForm.value.is_special = '';
      QueryForm.value.buyer_name = '';
      QueryForm.value.seller_name = '';
      QueryForm.value.settlement_uid = '';
      QueryForm.value.invoice_month = '';
      QueryForm.value.invoice_status = '';
      QueryForm.value.is_real = '';
      QueryForm.value.business_type = '';
      QueryForm.value.feishu_department_id = '';
      QueryForm.value.project_name = '';
      QueryForm.value.settlement_month = '';
      QueryForm.value.account_month = '';
      treeData.input = '';
    };
    const reset = async () => {
      resetQueryForm();
      await reload();
    };

    onMounted(() => {
      reload();
    });

    const reverseSuccess = async () => {
      invoiceReverseDialogVisible.value = false;
      await reload();
    };

    const handleCurrentChange = async (num: number) => {
      QueryForm.value.page_num = num;
      await reload(false);
    };

    const handlePageSizeChange = async (size: number) => {
      QueryForm.value.num = size;
      await reload();
    };

    const initDepartment = async () => {
      const res = await GetFeishuDepartmentList();
      const list = res.data.data.data;
      departmentFilterDisabled(list, false, 3);
      treeData.data = list as any;
    };
    const treeRef = ref<{ setCheckedKeys: (...args: any[]) => void }>();
    const treeData = reactive({
      data: [],
      show: false,
      input: '',
      check: (value: any) => {
        treeRef.value?.setCheckedKeys([value.department_id]);
        QueryForm.value.feishu_department_id = value.id;
        treeData.input = value.name;
        treeData.show = false;
      },
    });
    initDepartment();
    const exportData = () => {
      reload(false, true);
    };
    const isDisabled = computed(() => {
      if (QueryFormCopy.value.write_off_status) return false;
      else if (QueryFormCopy.value.buyer_name) return false;
      else if (QueryFormCopy.value.seller_name) return false;
      else if (QueryFormCopy.value.invoice_number) return false;
      else if (QueryFormCopy.value.invoice_month) return false;
      else if (QueryFormCopy.value.invoice_type) return false;
      else if (QueryFormCopy.value.invoice_status) return false;
      else if (QueryFormCopy.value.is_real) return false;
      else if (QueryFormCopy.value.business_type) return false;
      else if (QueryFormCopy.value.feishu_department_id) return false;
      else if (QueryFormCopy.value.settlement_uid) return false;
      else if (QueryFormCopy.value.settlement_month) return false;
      else if (QueryFormCopy.value.account_month) return false;
      return true;
    });
    const summaryMethod = ({ columns }: any) => {
      return columns.map((el: any, index: any) => {
        if (!index) return '合计';
        if (['tax_amount', 'tax_excluded_amount', 'total_amount'].includes(el.property)) {
          const amount = statisticsData.value?.[el.property];
          if (amount === null || amount === undefined || amount === '') return '--';
          return formatAmount(+amount / 100, 'None');
        }
        return '';
      });
    };
    return {
      exportData,
      treeData,
      treeRef,
      isDisabled,
      BusinessTypeOptions,
      permission,
      closeViewer,
      showViewer,
      ImageUrlList,
      uploadLoading,
      handleCurrentChange,
      handlePageSizeChange,
      BeforeInvoiceUploadHandler,
      InvoiceUploadResponseHandler,
      invoiceReverseDialogVisible,
      invoiceRedDialogRef,
      QueryForm,
      loading,
      resetQueryForm,
      currentInvoice,
      reload,
      reset,
      DataList,
      columns,
      total_count,
      ...tableHeightLogic,
      onTopCardRectUpdate,
      reverseSuccess,
      summaryMethod,
    };
  },
});
