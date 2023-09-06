import { computed, defineComponent, h, onMounted, reactive, ref } from '@vue/composition-api';
import { wait } from '@/utils/func';
import MakeInvoiceDialog from '@/modules/workbench/initiate/lnvoice2/index.vue';
import InvoiceUpload from '@/modules/finance/invoice/dialog/invoice.upload.vue';
import InvoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import RedDetail from '@/modules/finance/invoice/dialog/invoice.red.detail.vue';
import { GetApprovalInfo, GetApprovalList, DeleteInvoiceApproval } from '@/services/workbentch';
import getRectHeightData from '@/utils/autoHeight';
import { InvoiceCol, useColumns } from '../use/applicationColumns';
import { FinanceInvoiceUploadList } from '@/types/tiange/finance/invoice';
import InvoiceRedDialog from '@/modules/finance/invoice/dialog/invoice.red.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue';
import { getToken } from '@/utils/token';
import Store from '@/store';
const JWT_TOKEN = getToken();
import { usePermission } from '@/use/permission';
import ImageViewer from '@/components/Image/ImageViewer';
export default defineComponent({
  components: {
    MakeInvoiceDialog,
    InvoiceUpload,
    InvoicesDetail,
    RedDetail,
    InvoiceRedDialog,
    ElImageViewer,
  },
  setup(_, ctx) {
    const permission = usePermission();
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const loading = ref(false);
    const detailLoading = ref(false);
    const MakeInvoiceDialogRef = ref<{ show(): void } | null>(null);
    const InvoiceDetailDialogRef = ref<{ show(): void } | null>(null);
    const InvoiceUploadRef = ref<{ show(): void } | null>(null);
    const RedDetailDialogRef = ref<{ show(): void } | null>(null);
    const invoiceRedDialogRef = ref<{ show(): void } | null>(null);
    const invoiceRed = ref<any>(null);
    const showViewer = ref(false);
    const ImageUrlList = ref<string[]>([]);
    const userInfo = computed(() => Store.getters['user/getUserInfo']);

    const queryForm = reactive<any>({
      total: 0,
      page_num: 1,
      num: 20,
      project_name: '',
      approval_num: '',
      company_name: '',
      add_by_name: '',
      start_time: '',
      approval_status: '',
      invoiced: '',
    });
    const list = ref<FinanceInvoiceUploadList[]>([]);

    async function loadDataList(payload: any) {
      loading.value = true;
      const [{ data: response }] = await wait(500, GetApprovalList(payload));
      loading.value = false;
      if (response.success) {
        list.value = response.data.data;
        queryForm.total = response.data.total;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    }

    async function reload(clean = true) {
      if (clean) {
        queryForm.page_num = 1;
      }
      const params = {
        approval_search_type: 4,
        approval_type: 4,
        invoiced: queryForm.invoiced,
        add_by_name: queryForm.add_by_name,
        approval_uid: queryForm.approval_num,
        approval_status: queryForm.approval_status,
        page_num: queryForm.page_num,
        num: queryForm.num,
        company_name: queryForm.company_name,
        project_name: queryForm.project_name,
        start_time_min: queryForm.start_time ? queryForm.start_time[0] : '',
        start_time_max: queryForm.start_time ? queryForm.start_time[1] : '',
      };
      await loadDataList(params);
    }
    async function reset() {
      queryForm.page_num = 1;
      queryForm.num = 20;
      queryForm.project_name = '';
      queryForm.approval_num = '';
      queryForm.company_name = '';
      queryForm.add_by_name = '';
      queryForm.start_time = '';
      queryForm.approval_status = '';
      queryForm.invoiced = '';
      await reload();
    }

    const currentPageChange = async (num: number) => {
      queryForm.page_num = num;
      await reload(false);
    };
    const pageSizeChange = async (size: number) => {
      queryForm.num = size;
      await reload();
    };

    const closeViewer = () => {
      showViewer.value = false;
    };

    const getColumns = (list: any) => {
      const {
        approve_code_column,
        company_name_column,
        invoice_amount_column,
        username_column,
        start_time_column,
        approval_status_column,
        invoiced_column,
      } = useColumns(list);

      const uploadInvoice = (row: FinanceInvoiceUploadList) => {
        (InvoiceUploadRef.value as any).show({
          id: row.approval_id,
          company: row.collecting_company,
          total_amount: row.approval_content.invoice_amount,
          deposit_received_id: row.approval_detail.deposit_received_id || undefined,
          approval_id: row.approval_id,
        });
      };
      const viewInvoice = (urllist: string[]) => {
        showViewer.value = true;
        ImageUrlList.value = urllist;
      };
      const rewriteInvoice = async (approval_id: number, approval_type: number) => {
        const { data: response } = await GetApprovalInfo({ approval_id: approval_id });
        if (response.success) {
          if (approval_type === 12) {
            invoiceRed.value = response.data.approval_detail;
            (invoiceRedDialogRef.value as any).show();
          } else {
            (InvoiceDetailDialogRef.value as any).show(response.data);
          }
        } else {
          ctx.root.$message.error(response.message ?? '获取审批详情失败');
        }
      };
      const deleteInvoice = async (approval_id: number) => {
        const result = await AsyncConfirm(ctx, '你确定删除吗?');
        if (result) {
          const { data: response } = await DeleteInvoiceApproval(approval_id);
          if (response.success) {
            ctx.root.$message.success('删除成功');
            await reload(false);
          } else {
            ctx.root.$message.error(response.message ?? '操作失败');
          }
        }
      };

      const invoiceColumns = computed<InvoiceCol[]>(() => [
        approve_code_column.value,
        company_name_column.value,
        invoice_amount_column.value,
        username_column.value,
        start_time_column.value,
        approval_status_column.value,
        invoiced_column.value,
        {
          label: '操作',
          width: 160,
          formatter: row => {
            if (permission.upload_invoice && row.approval_status === 2 && row.invoiced === 0) {
              const arr = [];
              arr.push(
                h(
                  'a',
                  {
                    style: {
                      marginRight: '12px',
                    },
                    on: {
                      click: (e: any) => {
                        e.stopPropagation();
                        uploadInvoice(row);
                      },
                    },
                  },
                  '上传发票',
                ),
              );
              if (row.invoice_pic_url_list.length > 0) {
                arr.push(
                  h(
                    'a',
                    {
                      style: {
                        marginRight: '12px',
                      },
                      on: {
                        click: (e: any) => {
                          e.stopPropagation();
                          const urls = row.invoice_pic_url_list.map(item => {
                            return `${item}?Authorization=${JWT_TOKEN}`;
                          });
                          ImageViewer.show(urls);
                          if (location.href) return;
                          viewInvoice(urls);
                        },
                      },
                    },
                    '查看发票',
                  ),
                );
              }
              return h('div', { class: 'table-column-edit' }, arr);
            } else if (row.approval_status === 2 && row.invoiced === 1) {
              return h('div', { class: 'table-column-edit' }, [
                h(
                  'a',
                  {
                    style: {
                      marginRight: '12px',
                    },
                    on: {
                      click: (e: any) => {
                        e.stopPropagation();
                        const urls = row.invoice_pic_url_list.map(item => {
                          return `${item}?Authorization=${JWT_TOKEN}`;
                        });
                        // ImageVier.show(urls);
                        viewInvoice(urls);
                      },
                    },
                  },
                  '查看发票',
                ),
              ]);
            } else if (row.approval_status === 3) {
              return h('div', { class: 'table-column-edit' }, [
                userInfo.value.id === row.approval_content.create_id &&
                  h(
                    'a',
                    {
                      style: {
                        marginRight: '12px',
                      },
                      on: {
                        click: (e: any) => {
                          e.stopPropagation();
                          rewriteInvoice(row.approval_id, row.approval_type);
                        },
                      },
                    },
                    '重新编辑提交',
                  ),
                h(
                  'a',
                  {
                    style: {
                      marginRight: '12px',
                    },
                    on: {
                      click: (e: any) => {
                        e.stopPropagation();
                        deleteInvoice(row.approval_id);
                      },
                    },
                  },
                  '删除',
                ),
              ]);
            }
          },
        },
      ]);
      return invoiceColumns;
    };

    const invoiceColumns = getColumns(list);

    const showMakeInvoiceDailog = () => {
      MakeInvoiceDialogRef.value?.show();
    };

    const onRowClick = async (row: any) => {
      const { data: response } = await GetApprovalInfo({ approval_id: row.approval_id });
      if (response.success) {
        if (row.approval_type === 4) {
          (InvoiceDetailDialogRef.value as any).show(response.data);
        } else {
          (RedDetailDialogRef.value as any).show(response.data);
        }
      } else {
        ctx.root.$message.error(response.message ?? '获取审批详情失败');
      }
    };

    onMounted(() => {
      reload();
    });

    return {
      ...tableHeightLogic,
      onTopCardRectUpdate,
      queryForm,
      loading,
      reload,
      reset,
      list,
      invoiceColumns,
      currentPageChange,
      pageSizeChange,
      showMakeInvoiceDailog,
      MakeInvoiceDialogRef,
      InvoiceDetailDialogRef,
      InvoiceUploadRef,
      detailLoading,
      onRowClick,
      RedDetailDialogRef,
      invoiceRedDialogRef,
      invoiceRed,
      showViewer,
      closeViewer,
      ImageUrlList,
    };
  },
});
