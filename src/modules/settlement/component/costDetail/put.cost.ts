/*
 * @Brief: 投放成本
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 17:45:37
 */
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { GetAdCost, GetYFAdCost } from '@/services/finance/settlement';
import { KolQuery } from '@/services/live';
import { GetCompanyList } from '@/services/supplier';
import { CompanyBase } from '@/types/tiange/customer';
import { CompanyInfoForMCNDouyin, Settlement } from '@/types/tiange/finance/settlement';
import { Kol } from '@/types/tiange/live';
import {
  defineComponent,
  PropType,
  ref,
  nextTick,
  inject,
  Ref,
  computed,
} from '@vue/composition-api';
import { ElSelect } from 'element-ui/types/select';
import { default_put_company_name, put_detail_url, put_yf_detail_url } from '../use/uilts';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  props: {
    feeDetail: {
      type: Object as PropType<CompanyInfoForMCNDouyin>,
    },
    isLiveDouyin: {
      type: Boolean,
      default: false,
    },
    isLiveTbPick: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const companySelectRef = ref<ElSelect | undefined>(undefined);
    const isLiveTbPickNew = computed<any>(() => props.isLiveTbPick);
    const dataForm = computed(() => {
      return props.feeDetail;
    });
    let isfirst = true;
    const dataFromCompanyList = computed(() => {
      if (!(dataForm.value?.company_list ?? []).length) {
        methods.onAdd();
        if (isfirst && isLiveTbPickNew.value === false) {
          isfirst = false;
          methods.getCompanyList(default_put_company_name);
        }
      }
      return dataForm.value?.company_list;
    });
    const isLiveDouyinNew = computed(() => {
      return props.isLiveDouyin;
    });
    const company_list = ref<CompanyBase[]>([]);
    const kol_list = ref<Kol[]>([]);

    const companyLoading = ref<boolean>(false);
    const kolLoading = ref<boolean>(false);

    const kol_ids_str = computed(() => {
      const ids: (string | number)[] = [];
      dataFromCompanyList.value?.forEach((company: any) => {
        if (company.company_name === default_put_company_name && company.kol_id) {
          ids.push(company.kol_id);
        }
      });
      return ids.length ? ids.join(',') : '';
    });

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
        if (
          isLiveDouyinNew.value &&
          dataForm.value?.company_list &&
          dataForm.value?.company_list.length === 1
        ) {
          const company = dataForm.value.company_list.find((item: any) =>
            isYuFengCompany(item.company_name),
          );
          if (company) {
            if (!company.income_amount) {
              methods.getYFAdCost(company);
            }
          }
        }
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
      getAdCost: async (
        kol_id: number | undefined,
        company: { income_amount: string | undefined },
      ) => {
        yufengloading.value = true;
        const res = await GetAdCost({
          kol_id: kol_id,
          start_date: settlement.value?.start_date,
          end_date: settlement.value?.end_date,
        });
        yufengloading.value = false;
        if (res.data.success) {
          company.income_amount = String(res.data.data?.sum_cost || 0);
          ctx.root.$message.success(res.data.message);
        } else {
          company.income_amount = '0';
          ctx.root.$message.error(res.data.message);
        }
      },
      getYFAdCost: async (company: { income_amount: string | undefined }) => {
        yufengloading.value = true;
        const router = useRouter();
        const project_id: any = router.currentRoute.params.id;
        const res = await GetYFAdCost({
          project_id: project_id,
          start_date: settlement.value?.start_date,
          end_date: settlement.value?.end_date,
        });
        yufengloading.value = false;
        if (res.data.success) {
          company.income_amount = String(res.data.data?.sum_cost || 0);
          ctx.root.$message.success(res.data.message);
        } else {
          company.income_amount = '0';
          ctx.root.$message.error(res.data.message);
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
          if (
            isLiveDouyinNew.value &&
            isYuFengCompany(company.company_name) &&
            isLiveTbPickNew.value === false
          ) {
            methods.getYFAdCost(company);
          } else if (isLiveDouyinNew.value) {
            company.income_amount = '';
          } else {
            company.income_amount = '';
            company.kol_id = '';
            company.kol_name = '';
          }
        }
      },
      onKolChanged: (val: string, index: number) => {
        if (dataForm.value?.company_list) {
          const company = dataForm.value.company_list[index];
          company.kol_name = val;
          const find = kol_list.value.find(el => el.kol_name === val);
          company.kol_id = find?.kol_id;
          if (company.company_name === default_put_company_name) {
            methods.getAdCost(company.kol_id, company);
          }
        }
      },
      reset: () => {
        if (dataForm.value) {
          dataForm.value.company_list = [];
        }
      },
      isCompanyOptionDisabled: (id: number, kol_id: number) => {
        const finder = dataFromCompanyList.value?.find((option: any) => {
          if (isLiveDouyinNew.value) {
            //只判断供应商是否已选中
            if (id && option.company_id) {
              return `${option.company_id}` === `${id}`;
            }
          }
          if (id && option.company_id && kol_id && option.kol_id) {
            return `${option.company_id}` === `${id}` && `${option.kol_id}` === `${kol_id}`;
          }
          return undefined;
        });
        return finder ? true : false;
      },
      isKolOptionDisabled: (id: number, company_id: number) => {
        const finder = dataForm.value?.company_list?.find((option: any) => {
          if (company_id && option.company_id && id && option.kol_id) {
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
      onDownloadDetail: (company: any) => {
        if (isLiveDouyinNew.value) {
          if (company.income_amount) {
            const router = useRouter();
            const project_id: any = router.currentRoute.params.id;
            window.open(
              put_yf_detail_url(
                project_id,
                settlement.value?.start_date ?? 0,
                settlement.value?.end_date ?? 0,
              ),
            );
          }
          return;
        }
        if (!kol_ids_str.value.length) {
          return;
        }
        if (company.income_amount) {
          window.open(
            put_detail_url(
              kol_ids_str.value,
              settlement.value?.start_date ?? 0,
              settlement.value?.end_date ?? 0,
            ),
          );
        }
      },
    };
    const isYuFengCompany = (company_name: string) => {
      return company_name === default_put_company_name;
    };
    const yufengloading = ref(false);
    return {
      isLiveTbPickNew,
      yufengloading,
      isYuFengCompany,
      isLiveDouyinNew,
      kol_ids_str,
      kol_list,
      dataFromCompanyList,
      company_list,
      companyLoading,
      kolLoading,
      dataForm,
      companySelectRef,
      ...methods,
    };
  },
});
