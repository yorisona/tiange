/*
 * @Brief: 达人成本
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 17:46:12
 */

import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { CompanyInfoForMCNDouyin } from '@/types/tiange/finance/settlement';
import { defineComponent, PropType, computed, ref, nextTick } from '@vue/composition-api';
import { ElSelect } from 'element-ui/types/select';
import { Kol } from '@/types/tiange/live';
import { KolQuery } from '@/services/live';
import { GetCompanyList } from '@/services/supplier';
import { CompanyBase } from '@/types/tiange/customer';

export default defineComponent({
  props: {
    feeDetail: {
      type: Object as PropType<CompanyInfoForMCNDouyin>,
    },
    isKolVerifyApproved: {
      type: Boolean,
      default: () => undefined,
    },
  },
  setup(props, ctx) {
    const companySelectRef = ref<ElSelect | undefined>(undefined);

    const dataForm = computed(() => {
      return props.feeDetail;
    });
    const dataFromCompanyList = computed(() => {
      if (!(dataForm.value?.company_list ?? []).length) {
        methods.onAdd();
      }
      return dataForm.value?.company_list;
    });

    const company_list = ref<CompanyBase[]>([]);
    const kol_list = ref<Kol[]>([]);

    const companyLoading = ref<boolean>(false);
    const kolLoading = ref<boolean>(false);

    const methods = {
      onAdd: () => {
        dataForm.value?.company_list?.push({
          company_id: '',
          company_name: '',
          income_amount: '',
          remark: '',
          kol_id: '',
          kol_name: '',
        });
        //  自动获取第一响应
        nextTick(() => {
          const companyRefs = companySelectRef.value as any;
          if (companyRefs instanceof Array) {
            const companyRef = companyRefs[0];
            if ('focus' in companyRef) {
              companyRef.focus();
            }
          } else {
            if ('focus' in companyRefs) {
              companyRefs.focus();
            }
          }
        });
      },
      delCompany: (index: number) => {
        dataForm.value?.company_list?.splice(index, 1);
      },
      getCompanyList: async (kw: string) => {
        if (!kw) {
          company_list.value = [];
          return;
        }
        companyLoading.value = true;
        const res = await GetCompanyList({
          company_name: kw,
          verify_status: 1,
        });
        companyLoading.value = false;
        if (res.data.success) {
          company_list.value = res.data.data ?? [];
        } else {
          company_list.value = [];
        }
      },
      queryKolList: async (kw: string) => {
        if (!kw) {
          kol_list.value = [];
          return;
        }
        kolLoading.value = true;
        const res = await KolQuery({
          kol_name: kw,
          is_verify_approved:
            props.isKolVerifyApproved === true
              ? 1
              : props.isKolVerifyApproved === false
              ? 0
              : undefined,
        });
        kolLoading.value = false;
        if (res.data.success) {
          kol_list.value = res.data.data ?? [];
        } else {
          kol_list.value = [];
        }
      },
      onCompanyChanged: (val: string, index: number) => {
        if (dataForm.value?.company_list) {
          const company = dataForm.value.company_list[index];
          company.company_name = val;
          const find = company_list.value.find(el => el.company_name === val);
          company.company_id = find?.company_id;
        }
      },
      onKolChanged: (val: string, index: number) => {
        if (dataForm.value?.company_list) {
          const company = dataForm.value.company_list[index];
          company.kol_name = val;
          const find = kol_list.value.find(el => el.kol_name === val);
          company.kol_id = find?.kol_id;
          if (find?.kol_company_id && find?.kol_id) {
            if (!methods.isCompanyOptionDisabled(find.kol_company_id, find.kol_id)) {
              company.company_name = find?.kol_company_name;
              company.company_id = find?.kol_company_id;
              return;
            }
          }
          company.company_name = undefined;
          company.company_id = undefined;
        }
      },
      reset: () => {
        if (dataForm.value) {
          dataForm.value.company_list = [];
        }
      },
      isCompanyOptionDisabled: (id: number, kol_id: number) => {
        const finder = dataForm.value?.company_list?.find(option => {
          if (id && option.company_id && kol_id && option.kol_id) {
            return `${option.company_id}` === `${id}` && `${option.kol_id}` === `${kol_id}`;
          }
          return undefined;
        });
        return finder ? true : false;
      },
      isKolOptionDisabled: (id: number, company_id: number) => {
        const finder = dataForm.value?.company_list?.find(option => {
          if (id && option.company_id && company_id && option.kol_id) {
            return `${option.company_id}` === `${company_id}` && `${option.kol_id}` === `${id}`;
          }
          return undefined;
        });
        return finder ? true : false;
      },
      onCostAmountChanged: (value: string, index: number) => {
        const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        if (dataForm.value?.company_list) {
          dataForm.value.company_list[index].income_amount = result;
        }
      },
    };

    return {
      dataFromCompanyList,
      company_list,
      kol_list,
      companyLoading,
      kolLoading,
      dataForm,
      companySelectRef,
      ...methods,
    };
  },
});
