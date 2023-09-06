import { ref, reactive } from '@vue/composition-api';
import supplierService from '@/services/supplier';
export interface ICate {
  label: string;
  value: number;
}
export interface IFormData {
  id?: number;
  settlement_company_id?: number;
  anchor_platform?: number;
  hourly_wage?: number;
  salary?: number;
  bank_card_front: string;
  bank_card_back: string;
  collection_bank_name?: string;
  collection_bank_no: string;
  collection_phone: string;
  collection_bank_account: string;
  id_card: string;
  id_card_front: string;
  id_card_back: string;
  verify_status: number;
  verify_message: string;
  contracts: string[];
}
const defaultFormData = {
  id: '',
  anchor_platform: '',
  hourly_wage: '',
  salary: '',
  settlement_company_id: '',
  bank_card_front: '',
  bank_card_back: '',
  collection_bank_name: '',
  collection_bank_no: '',
  collection_phone: '',
  collection_bank_account: '',
  id_card: '',
  id_card_front: '',
  id_card_back: '',
  verify_message: '',
  verify_status: 0,
  contracts: [],
};
export const useFormData = () => {
  // 表单数据
  const formData = ref<IFormData>({
    ...defaultFormData,
  } as any);

  const company_list = ref<{ company_name: string; id: number }[]>([]);
  const queryCompanies = (company_name: string) => {
    supplierService.GetListSettlementCompanies(company_name, 1).then((res: any) => {
      company_list.value = res;
    });
  };

  const saveAnchor = async () => {
    const postData: any = {
      ...formData.value,
    };

    console.log('postData', postData);
    return supplierService.PostAnchorOther(postData);
  };

  const getEditInfo = (anchor_id: string) => {
    supplierService.GetAnchorDetail(anchor_id).then((res: any) => {
      const editValue: any = {};
      Object.keys(defaultFormData).forEach(item => {
        let value: any = res[item];
        if (value === null || value === undefined) value = (defaultFormData as any)[item];
        editValue[item] = value;
      });
      if (res.settlement_company_id !== null) {
        company_list.value = [
          { company_name: res.settlement_company_name, id: res.settlement_company_id },
        ];
      }
      formData.value = editValue;
    });
  };

  return reactive({
    company_list,
    queryCompanies,
    formData,
    saveAnchor,
    getEditInfo,
  });
};
