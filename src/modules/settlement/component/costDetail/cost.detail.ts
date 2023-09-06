/*
 * @Brief: 结算明细
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:34:35
 */

import { defineComponent, PropType, computed, ref } from '@vue/composition-api';
import PitFee from '../incomeDetail/pit.fee.vue';
import OtherIncome from '../incomeDetail/other.income.vue';
import TalentCost from './talent.cost.vue';
import PutCost from './put.cost.vue';
import {
  CompanyInfoForMCNDouyin,
  SetlementCostTypeMap,
  SetlementLiveCostTypeMap,
  SettlementIncomeType,
} from '@/types/tiange/finance/settlement';

export interface feeTypeItem {
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
    isLiveDouyin: {
      type: Boolean,
      default: false,
    },
    isLiveTbPick: {
      type: Boolean,
      default: false,
    },
    disabledTypeList: {
      type: Array as PropType<SettlementIncomeType[]>,
    },
    feeDetail: {
      type: Object as PropType<CompanyInfoForMCNDouyin>,
    },
    isKolVerifyApproved: {
      type: Boolean,
      default: () => undefined,
    },
  },
  components: {
    PitFee,
    OtherIncome,
    TalentCost,
    PutCost,
  },
  setup(props, ctx) {
    const costOptions = computed<feeTypeItem[]>(() => {
      const options: feeTypeItem[] = [];
      if (props.isLiveDouyin) {
        SetlementLiveCostTypeMap.forEach((value, key) => {
          options.push({
            label: value,
            value: key,
          });
        });
      } else {
        SetlementCostTypeMap.forEach((value, key) => {
          options.push({
            label: value,
            value: key,
          });
        });
      }
      return options;
    });

    const currentRef = ref<{ reset: () => void } | undefined>(undefined);

    // const dataForm = ref<CompanyInfoForMCNDouyin | undefined>(deepClone(props.incomeDetail) as CompanyInfoForMCNDouyin);
    const dataForm = computed<CompanyInfoForMCNDouyin | undefined>(
      () => props.feeDetail,
      // get() {
      //   return props.incomeDetail;
      // },
      // set(val) {
      //   // debugger
      // },
    );
    const isLiveDouyinNew = computed<any>(() => props.isLiveDouyin);
    const isLiveTbPickNew = computed<any>(() => props.isLiveTbPick);
    // const dataForm = ref<CompanyInfoForMCNDouyin | undefined>(props.incomeDetail);

    const current = computed(() => {
      if (dataForm.value) {
        switch (dataForm.value.type) {
          case SettlementIncomeType.pit_fee:
            return PitFee;
          case SettlementIncomeType.put:
            return PutCost;
          case SettlementIncomeType.shangguang:
          case SettlementIncomeType.xingtu:
          case SettlementIncomeType.other:
          case SettlementIncomeType.marketing_advertising:
            return OtherIncome;
          case SettlementIncomeType.talent_cost:
            return TalentCost;
          case SettlementIncomeType.anchor:
            return 'anchor';
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
          return '坑位费 = 结算周期内全部场次商品支出坑位费总和';
        case SettlementIncomeType.talent_cost:
          return '投放成本 = 填写的所有成本金额合计';
        case SettlementIncomeType.put:
          return '投放成本 = 接口获取对应投放帐号的消耗金额';
        case SettlementIncomeType.xingtu:
          return '星图成本 = 填写的所有成本金额合计';
        case SettlementIncomeType.shangguang:
          return '商广成本 = 填写的所有成本金额合计';
        case SettlementIncomeType.other:
          return '其他成本 = 填写的所有成本金额合计';
        case SettlementIncomeType.anchor:
          return '主播成本 = 填写的所有主播成本金额合计';
      }
      return undefined;
    });

    const methods = {
      costTypeChanged: (value: number) => {
        // console.log('current ->', dataForm.value?.type, ', changedType -> ', value);
        currentRef.value?.reset();
        if (dataForm.value) {
          dataForm.value.type = value;
          dataForm.value.company_list = [];
        }
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
      isLiveTbPickNew,
      isLiveDouyinNew,
      SettlementIncomeType,
      currentRef,
      desc,
      costOptions,
      current,
      dataForm,
      ...methods,
    };
  },
});
