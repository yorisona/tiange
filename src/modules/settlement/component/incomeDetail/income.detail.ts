/*
 * @Brief: 结算明细
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:34:35
 */

import { defineComponent, PropType, computed, ref } from '@vue/composition-api';
import PitFee from './pit.fee.vue';
import DouyinCPS from './douyin.income.vue';
import OtherIncome from './other.income.vue';
import {
  CompanyInfoForMCNDouyin,
  SetlementIncomeTypeMap,
  SettlementIncomeType,
} from '@/types/tiange/finance/settlement';

export interface IncomeTypeItem {
  label: string | undefined;
  value: number | undefined;
}

export default defineComponent({
  emits: ['delSettlementDetail'],
  props: {
    // incomeOptions: {
    //     type: Array as PropType<IncomeTypeItem[]>,
    //     default: []
    // },
    // selectedOptions: {
    //   type: Object as PropType<IncomeTypeItem>,
    // },
    disabledTypeList: {
      type: Array as PropType<SettlementIncomeType[]>,
    },
    incomeDetail: {
      type: Object as PropType<CompanyInfoForMCNDouyin>,
    },
  },
  components: {
    PitFee,
    DouyinCPS,
    OtherIncome,
  },
  setup(props, ctx) {
    const incomeOptions = computed<IncomeTypeItem[]>(() => {
      const options: IncomeTypeItem[] = [];
      SetlementIncomeTypeMap.forEach((value, key) => {
        options.push({
          label: value,
          value: key,
        });
      });
      return options;
    });

    const currentRef = ref<{ reset: () => void } | undefined>(undefined);

    // const dataForm = ref<CompanyInfoForMCNDouyin | undefined>(deepClone(props.incomeDetail) as CompanyInfoForMCNDouyin);
    const dataForm = computed<CompanyInfoForMCNDouyin | undefined>(
      () => props.incomeDetail,
      // get() {
      //   return props.incomeDetail;
      // },
      // set(val) {
      //   // debugger
      // },
    );
    // const dataForm = ref<CompanyInfoForMCNDouyin | undefined>(props.incomeDetail);

    const current = computed(() => {
      if (dataForm.value) {
        switch (dataForm.value.type) {
          case SettlementIncomeType.pit_fee:
            return PitFee;
          case SettlementIncomeType.head_service_fee:
          case SettlementIncomeType.douyin_cps:
          case SettlementIncomeType.xingtu:
            return DouyinCPS;
          case SettlementIncomeType.shangguang:
          case SettlementIncomeType.other:
            return OtherIncome;
        }
      }
      return undefined;
    });

    const desc = computed(() => {
      if (!dataForm.value) {
        return undefined;
      }
      switch (dataForm.value.type) {
        case SettlementIncomeType.pit_fee:
          return '坑位费 = 结算周期内全部场次商品收入坑位费总和';
        case SettlementIncomeType.head_service_fee:
          return '团长服务费 = 周期内达人通过团长活动产生的服务费';
        case SettlementIncomeType.douyin_cps:
          return 'CPS收入 = 上传文件中所有收入金额合计';
        case SettlementIncomeType.xingtu:
          return '星图收入 = 上传文件中所有收入金额合计';
        case SettlementIncomeType.shangguang:
          return '商广收入 = 填写的所有收入金额合计';
        case SettlementIncomeType.other:
          return '其他收入 = 填写的所有收入金额合计';
      }
      return undefined;
    });

    const methods = {
      incomeTypeChanged: (value: number) => {
        // console.log('current ->', dataForm.value?.type, ', changedType -> ', value);
        currentRef.value?.reset();
        if (dataForm.value) {
          dataForm.value.type = value;
          let company_name = '';
          switch (dataForm.value.type) {
            case SettlementIncomeType.head_service_fee:
              company_name = '北京巨量引擎网络技术有限公司';
              break;
            case SettlementIncomeType.douyin_cps:
              company_name = '北京巨量引擎网络技术有限公司';
              break;
            case SettlementIncomeType.xingtu:
              company_name = '武汉巨量星图科技有限公司';
              break;
          }
          dataForm.value.company_name = company_name;
        }
        ctx.emit('incomeTypeChanged', value);
      },
      delSettlementDetail: () => {
        ctx.emit('delSettlementDetail');
      },
      itemDisabled: (type: SettlementIncomeType) => {
        return (props.disabledTypeList ?? []).includes(type);
      },
    };

    // watch(
    //     () => props.incomeDetail,
    //     (val) => {
    //         dataForm.value = deepClone(val) as CompanyInfoForMCNDouyin
    //     }
    // )

    return {
      currentRef,
      desc,
      incomeOptions,
      current,
      dataForm,
      ...methods,
    };
  },
});
