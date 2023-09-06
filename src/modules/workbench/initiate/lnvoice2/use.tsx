import { ref, SetupContext } from '@vue/composition-api';
import { Company, CompanyListQueryParams } from '@/types/tiange/company';
import { Settlement } from '@/types/tiange/finance/settlement';
import { GetAllProject, PostSaveInvoiceApplay } from '@/services/workbentch';
import { GetCompanyList } from '@/services/company';
import { GetSettlementList } from '@/services/finance/settlement';
import { BooleanType } from '@/types/base/advanced';
import { Invoice } from '@/types/tiange/workbench';
import { SaveProjectPrePayApply } from '@/services/common/project';

export const useInvoice = (ctx: SetupContext) => {
  const saveLoading = ref(false);
  const companyList = ref<Company[]>([]);
  const cooperationList: any = ref([]);
  const settlementList = ref<Settlement[]>([]);
  const companyQueryParams = ref<CompanyListQueryParams>({
    company_name: '',
    num: 100000,
    page_num: 1,
  });
  const companyForm: any = ref({
    collecting_company: '',
    seller: '',
    invoice_remark: '',
    tax_number: '',
    address: '',
    phone: '',
    bank_of_deposit: '',
    bank_card_number: '',
    approval_type: 4,
    remark: '',
    attachment: [],
    content_type: undefined,
    content_type_other: '',
    email_address: undefined,
  });
  const cooperationParams = {
    project_name: '',
  };
  const loadCooperation = async (queryString: string, cb: any) => {
    if (!(queryString + ''.trim())) {
      cooperationParams.project_name = '';
      cb([]);
      return;
    }
    if (cooperationParams.project_name === queryString) {
      cb(cooperationList.value);
      return;
    }
    cooperationParams.project_name = queryString;
    const { data: response } = await GetAllProject(cooperationParams);
    if (response.success) {
      cooperationList.value = response.data;
      cb(response.data);
    } else {
      cb([]);
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const loadCompany = async (queryString: string, cb: any) => {
    queryString = queryString || '';
    if (!queryString.trim()) {
      cb([]);
      companyQueryParams.value.company_name = '';
      companyForm.value.tax_number = '';
      companyForm.value.address = '';
      companyForm.value.phone = '';
      companyForm.value.bank_of_deposit = '';
      companyForm.value.bank_card_number = '';
      companyForm.value.email_address = '';
      return;
    }
    if (companyQueryParams.value.company_name === queryString) {
      cb(companyList.value);
      return;
    }
    companyQueryParams.value.company_name = queryString;
    const { data: response } = await GetCompanyList(companyQueryParams.value);
    if (response.success) {
      companyList.value = response.data.data;
      cb(response.data.data);
    } else {
      cb([]);
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const loadSettlementData = async (
    project_id: number,
    forEditInit = false,
    action: ((data: any) => void) | undefined = undefined,
  ) => {
    const { data } = await GetSettlementList('approval', {
      page_num: 1,
      num: 10000,
      no_confirmed_reverse: BooleanType.YES,
      project_id,
      is_estimate: 0,
      is_tmp: 0,
      is_confirmed: 1,
      no_unity_settlement: 1,
    } as any);
    if (data.success) {
      if (forEditInit) {
        action?.(data.data.data);
      } else {
        settlementList.value = data.data.data;
      }
    } else {
      if (!forEditInit) {
        ctx.root.$message({
          type: 'warning',
          message: data.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    }
  };
  const submit = async (invoice: Invoice | any) => {
    console.log('-----', invoice);
    const { email_address, ...rest } = invoice;
    const emailParams = invoice.invoice_type === 3 ? { email_address } : {};
    saveLoading.value = true;
    //是预收，重新提交
    if (invoice.record_id) {
      const { data } = await SaveProjectPrePayApply({
        address: invoice.address,
        attachment: invoice.attachment,
        bank_card_number: invoice.bank_card_number,
        bank_of_deposit: invoice.bank_of_deposit,
        company_id: invoice.company_id,
        content_type_other:
          invoice.content_type === 2
            ? '信息技术服务费'
            : invoice.content_type === 1
            ? '信息服务费'
            : invoice.content_type_other,
        department_id: invoice.department_id,
        invoice_amount: invoice.invoice_amount,
        invoice_send_type: invoice.invoice_send_type,
        invoice_type: invoice.invoice_type,
        is_received: invoice.is_received,
        phone: invoice.phone,
        received_date: invoice.received_date,
        record_id: invoice.record_id,
        remark: invoice.remark,
        tax_number: invoice.tax_number,
        contract_id: invoice.contract_id,
        seller: invoice.seller,
        invoice_remark: invoice.invoice_remark,
        ...emailParams,
      });
      saveLoading.value = false;
      if (data.success) {
        ctx.root.$message({
          type: 'success',
          message: '开票成功',
          duration: 2000,
          showClose: true,
        });
        return Promise.resolve();
      } else {
        ctx.root.$message({
          type: 'error',
          message: data.message ?? '申请失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
        return Promise.reject();
      }
      return;
    }
    const { data } = await PostSaveInvoiceApplay({
      ...rest,
      ...emailParams,
      content_type_other:
        invoice.content_type === 2
          ? '信息技术服务费'
          : invoice.content_type === 1
          ? '信息服务费'
          : invoice.content_type_other,
    });
    saveLoading.value = false;
    if (data.success) {
      ctx.root.$message({
        type: 'success',
        message: '开票成功',
        duration: 2000,
        showClose: true,
      });
      return Promise.resolve();
    } else {
      ctx.root.$message({
        type: 'error',
        message: data.message ?? '申请失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
      return Promise.reject();
    }
  };
  return {
    submit,
    companyList,
    loadCompany,
    saveLoading,
    companyForm,
    settlementList,
    loadCooperation,
    cooperationList,
    companyQueryParams,
    loadSettlementData,
  };
};
