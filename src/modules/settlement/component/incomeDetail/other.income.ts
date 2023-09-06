/*
 * @Brief: 商广和其他收入
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:32:11
 */
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { GetSettlementCompanyList } from '@/services/finance/settlement';
import { GetCompanyList } from '@/services/supplier';
// import { Company } from '@/types/tiange/company';
import { CompanyInfoForMCNDouyin } from '@/types/tiange/finance/settlement';
import { defineComponent, PropType, computed, ref, nextTick } from '@vue/composition-api';
import { ElSelect } from 'element-ui/types/select';

interface Company {
  id: number | undefined;
  company_name: string | undefined;
}

export default defineComponent({
  props: {
    feeDetail: {
      type: Object as PropType<CompanyInfoForMCNDouyin>,
    },
    feeType: {
      /** 1-收入，2-成本 */
      type: Number as PropType<1 | 2>,
      default: 1,
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

    const company_list = ref<Company[]>([]);

    const companyLoading = ref<boolean>(false);

    const methods = {
      onAdd: () => {
        dataForm.value?.company_list?.push({
          company_id: '',
          company_name: '',
          income_amount: '',
          remark: '',
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

        if (props.feeType === 2) {
          const res = await GetCompanyList({
            company_name: kw,
            verify_status: 1,
          });
          if (res.data.success) {
            company_list.value = (res.data.data ?? []).map(el => {
              return {
                id: el.company_id,
                company_name: el.company_name,
              };
            });
          } else {
            company_list.value = [];
          }
        } else {
          const res = await GetSettlementCompanyList({
            company_name: kw,
            page_num: 1,
            num: 10000,
          });
          if (res.data.success) {
            company_list.value = res.data.data.data ?? [];
          } else {
            company_list.value = [];
          }
        }
        companyLoading.value = false;
      },
      onCompanyChanged: (val: string, index: number) => {
        if (dataForm.value?.company_list) {
          const company = dataForm.value.company_list[index];
          company.company_name = val;
          const find = company_list.value.find(el => el.company_name === val);
          company.company_id = find?.id;
        }
      },
      reset: () => {
        if (dataForm.value) {
          dataForm.value.company_list = [];
        }
      },
      isOptionDisabled: (id: number) => {
        const finder = dataForm.value?.company_list?.find(option => {
          if (id && option.company_id) {
            return `${option.company_id}` === `${id}`;
          }
          return undefined;
        });
        return finder ? true : false;
      },
      onIncomeAmountChanged: (value: string, index: number) => {
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
      companyLoading,
      dataForm,
      companySelectRef,
      ...methods,
    };
  },
});
