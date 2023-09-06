/*
 * @Brief: 坑位费
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:31:38
 */
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { GetCompanyPitFee } from '@/services/finance/settlement';
// import { Settlement } from '@/types/tiange/';
import { CompanyInfoForMCNDouyin, Settlement } from '@/types/tiange/finance/settlement';
import { pit_fee_detail_url } from '../use/uilts';
import { CompanyBase } from '@/types/tiange/customer';

import {
  defineComponent,
  PropType,
  computed,
  onMounted,
  inject,
  Ref,
  ref,
  nextTick,
} from '@vue/composition-api';
import { GetCompanyList } from '@/services/supplier';
import { ElSelect } from 'element-ui/types/select';
import Decimal from 'decimal.js';

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
    const dataForm = computed(() => props.feeDetail);

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const company_list = computed(() => {
      if (!(dataForm.value?.company_list ?? []).length && props.feeType === 2) {
        methods.onAdd();
      }
      return dataForm.value?.company_list;
    });
    const companyLoading = ref<boolean>(false);
    const company_options = ref<CompanyBase[]>([]);

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
      onPitFeeChanged: (value: string, index: number) => {
        const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        if (company_list.value) {
          company_list.value[index].income_amount = result;
        }
      },
      getPitFee: async () => {
        const res = await GetCompanyPitFee({
          project_id: settlement.value?.project_id ?? 0,
          start_date: settlement.value?.start_date ?? 0,
          end_date: settlement.value?.end_date ?? 0,
          fee_type: props.feeType,
        });
        if (res.data.success) {
          if (dataForm.value?.company_list) {
            if (props.feeType === 1) {
              dataForm.value.company_list =
                res.data.data.data.map(el => {
                  return {
                    company_id: el.company_id,
                    company_name: el.company_name,
                    income_amount: el.sum_fee,
                    remark: undefined,
                  };
                }) ?? [];
            } else if (props.feeType === 2) {
              if (dataForm.value?.company_list.length === 1) {
                const company = dataForm.value.company_list[0];
                const companies = res.data.data?.data ?? [];
                if (companies.length) {
                  company.income_amount = companies
                    .reduce((acc, cur) => acc.add(cur.sum_fee ? cur.sum_fee : 0), new Decimal(0))
                    .toFixed(2);
                } else {
                  company.income_amount = '';
                }
              }
            }
          }
          if ((dataForm.value?.company_list ?? []).length === 0) {
            ctx.root.$message.warning('该场次未归档或商品未维护坑位费，请先进行归档或坑位费维护哦');
          } else {
            ctx.root.$message.success(res.data.message ?? '获取坑位费成功');
          }
        } else {
          ctx.root.$message.error(res.data.message ?? '获取坑位费失败');
        }
      },
      onDownloadDetail: () => {
        if (!company_list.value?.length) {
          return;
        }
        window.open(pit_fee_detail_url(settlement.value?.id, undefined, props.feeType));
      },
      reset: () => {
        // console.log('reset')
        if (dataForm.value) {
          dataForm.value.company_list = [];
        }
      },
      getCompanyList: async (kw: string) => {
        if (!kw) {
          company_options.value = [];
          return;
        }
        companyLoading.value = true;

        const res = await GetCompanyList({
          company_name: kw,
          verify_status: 1,
        });
        if (res.data.success) {
          company_options.value = res.data.data ?? [];
        } else {
          company_options.value = [];
        }
        companyLoading.value = false;
      },
      onCompanyChanged: (val: string, index: number) => {
        if (dataForm.value?.company_list) {
          const company = dataForm.value.company_list[index];
          company.company_name = val;
          const find = company_options.value.find(el => el.company_name === val);
          company.company_id = find?.company_id;
          if (dataForm.value?.company_list.length === 1) {
            methods.getPitFee();
          }
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
      delCompany: (index: number) => {
        dataForm.value?.company_list?.splice(index, 1);
      },
    };

    onMounted(() => {
      if (!dataForm.value?.company_list?.length && props.feeType === 1) {
        methods.getPitFee();
      }
    });

    return {
      dataForm,
      company_list,
      companyLoading,
      company_options,
      companySelectRef,
      ...methods,
    };
  },
});
