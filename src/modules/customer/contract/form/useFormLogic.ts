/**
 * 一些比较大块的可复用的表单处理逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 10:18:16
 */
import { GetCustomer, QueryShopAndCompany } from '@/services/customers';
import { ContractType, GetPartnerByUidRecord } from '@/types/tiange/contract';
import { QueryShopAndCompanyRecord } from '@/types/tiange/customer';
import { computed, Ref, ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { GetContractUid } from '@/services/contract';
/**
 * 输入合同编号搜索获取合同ID/合作方ID/合作方名称
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 10:28:27
 * @param   {Ref<T>}
 */
export const useContractUid = <
  T extends {
    contract_type: ContractType;
    partner_name?: string;
    contract_id?: number | '';
    partner_id: number | '' | undefined;
    current_project_id?: string;
    project_type?: number;
  },
>(
  form: Ref<T>,
  formRef: Ref<ElForm | null>,
  partner_type = 1,
  _contract_type?: ContractType,
) => {
  /** 合同编号(表单内用contract_id) */
  const contract_uid = ref('');
  /** 合同编号搜索中 */
  const contract_uid_loading = ref(false);

  /** 合同相关数据列表 */
  const contractInfoRecords = ref<GetPartnerByUidRecord[]>([]);

  /**
   * 清空合同相关数据列表
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-11-28 10:25:19
   */
  const clearContractInfoRecords = () => {
    contractInfoRecords.value = [];
  };
  // const contract_type = computed(() => _contract_type ?? form.value.contract_type);

  /**
   * 根据合同编号获取数据
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-11-28 10:36:35
   * @contract_type_param 后期补充的参数, contract_type更改为下拉框可动态变化,
   * 但之前又多处在使用, 这里根据是否传递新参数来切换使用 contract_type
   */
  const getCustmerByContractUid = async (
    contract_uid: string,
    contract_type_param?: ContractType,
  ) => {
    if (contract_uid === '') {
      contractInfoRecords.value = [];
      return;
    }
    const _contract_type = contract_type_param;

    contract_uid_loading.value = true;
    const { data: response } = await GetContractUid({
      partner_type,
      contract_status: 2,
      only_main: 0,
      search: contract_uid,
      contract_type: _contract_type,
      project_type: form.value.project_type,
    });

    contract_uid_loading.value = false;

    if (response.success) {
      // 判断该合同的状态的状态
      // 合同未正常状态才可以提交附件
      contractInfoRecords.value = response.data.data.filter(el => el.contract_status === 2);

      // console.table(contractInfoRecords.value.map(el => ({ ...el })));
    } else {
      contractInfoRecords.value = [];
    }
  };

  /** 合同编号选中事件 */
  const onContractUidChange = (value: string) => {
    const customer = contractInfoRecords.value.find(item => item.contract_uid === value);
    form.value.partner_name = customer?.partner_name ?? '';
    form.value.contract_id = customer?.contract_id ?? '';
    form.value.partner_id = customer?.partner_id ?? '';
    form.value.contract_type = (customer?.contract_type ?? '') as any;

    formRef.value?.clearValidate();
  };

  /** 回填合同编号 */
  const refillContractUid = (key: string) => {
    contract_uid.value = key;
    getCustmerByContractUid(key);
  };

  const resetContractUid = () => {
    clearContractInfoRecords();
    contract_uid.value = '';
    contract_uid_loading.value = false;
    form.value.partner_name = '';
    form.value.contract_id = '';
    form.value.partner_id = '';
  };

  const resetFrameContractUid = () => {
    clearContractInfoRecords();
    contract_uid.value = '';
    contract_uid_loading.value = false;
  };

  return {
    contract_uid,
    contract_uid_loading,
    contractInfoRecords,
    clearContractInfoRecords,
    getCustmerByContractUid,
    onContractUidChange,
    resetContractUid,
    refillContractUid,
    resetFrameContractUid,
  };
};

export const useContractShopAndCompany = <
  T extends {
    contract_type: ContractType;
    partner_id: number | '' | undefined;
  },
>(
  form: Ref<T>,
  formRef: Ref<ElForm | null>,
) => {
  const shopNameSearchKey = ref<string | undefined>('');

  watch(
    () => shopNameSearchKey.value,
    val => {
      if (val === '') {
        allStoreName.value = [];
      }
    },
  );

  // 所有店铺选项
  const allStoreName = ref<QueryShopAndCompanyRecord[]>([]);

  // 获取所有店铺，关联店铺select使用
  const getAllStoreName = async (shop_name: string | undefined, is_mcn_type = false) => {
    let data = [];
    let succees = true;
    if (is_mcn_type) {
      const res = (
        await GetCustomer({
          shop_name,
          num: 1000,
          page_num: 1,
        })
      ).data;
      data = res.data.data;
      succees = res.success;
    } else {
      const res = (await QueryShopAndCompany({ shop_name })).data;
      data = res.data;
      succees = res.success;
    }

    allStoreName.value = (succees ? data : []) as QueryShopAndCompanyRecord[];
  };

  const checkedItem = computed(() =>
    allStoreName.value.find(item => item.id === form.value.partner_id),
  );

  /** 选中的公司 */
  const company_name = computed(() => checkedItem.value?.company_name ?? '');

  /** 选中的店铺 */
  const shop_name = computed(() => checkedItem.value?.shop_name ?? '');

  const onPartnerIdChange = (value: number) => {
    form.value.partner_id = value;
    formRef.value?.clearValidate();
  };

  /** 回填关联店铺和客户(公司)名称 */
  const refillShopNameSearchKey = (key?: string, is_mcn_type = false) => {
    shopNameSearchKey.value = key;
    getAllStoreName(key, is_mcn_type);
  };

  const resetShopName = () => {
    form.value.partner_id = '';
    shopNameSearchKey.value = '';
  };

  return {
    allStoreName,
    shopNameSearchKey,
    getAllStoreName,
    shop_name,
    company_name,
    onPartnerIdChange,
    refillShopNameSearchKey,
    resetShopName,
  };
};
