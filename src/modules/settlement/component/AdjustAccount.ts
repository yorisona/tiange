/** 手工调账 */
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';
import {
  AdjustInfo,
  SetlementLiveCostTypeMap,
  SettlementIncomeType,
} from '@/types/tiange/finance/settlement';
import CardLayout from './card.layout.vue';
import { parse } from '@/utils/func';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import lodash from '@/utils/lodash/custom';
const { debounce } = lodash;

export enum ExtendItemEnum {
  /** 选择机构 */
  company = 'company',
  /** 主播 */
  anchor = 'anchor',
  /** 客户 */
  customer = 'customer',
  /** 供应商 */
  supplier = 'supplier',
  project = 'project',
  LiveDouyinSelf = 'LiveDouyinSelf',
  LiveDouyinSelfAfter = 'LiveDouyinSelfAfter',
}
export interface feeTypeItem {
  label: string | undefined;
  value: number | undefined;
}
export interface Item {
  id: string;
  name: string;
  type?: number;
  real_name?: string;
}
export default defineComponent({
  name: 'TgAdjustAccountForm',
  components: {
    CardLayout,
  },
  props: {
    height: {
      type: Number,
      default: 320,
    },
    ExtendItem: {
      type: String,
      default: '',
    },
    ExtendItemSelectOptions: {
      type: Array as PropType<Item[]>,
      required: false,
    },
    adjust_info: {
      type: Array as PropType<AdjustInfo[]>,
      required: false,
    },
    ExtendItemDpAllTypeOptionsObj: {
      type: Object as PropType<{ kol: Item[]; put: Item[]; other: Item[]; advert: Item[] }>,
      required: false,
    },
  },
  setup(props, ctx) {
    const total_height = computed(() => props.height);
    const ShowCompany = computed(
      () =>
        props.ExtendItem === ExtendItemEnum.company ||
        props.ExtendItem === ExtendItemEnum.customer ||
        props.ExtendItem === ExtendItemEnum.supplier,
    );
    const ShowAnchor = computed(() => props.ExtendItem === ExtendItemEnum.anchor);
    const ShowProject = computed(() => props.ExtendItem === ExtendItemEnum.project);
    const ShowLiveDouyinSelf = computed(() => props.ExtendItem === ExtendItemEnum.LiveDouyinSelf);
    const ShowLiveDouyinSelfAfter = computed(
      () => props.ExtendItem === ExtendItemEnum.LiveDouyinSelfAfter,
    );
    /** 手工调账最大数量 */
    const MaxAdjustSize = computed(() => (props.ExtendItem && props.ExtendItem !== '' ? 100 : 10));

    const filterOption = ref('');
    const title = '手工调账';

    const DefaultItemData = computed(() => {
      if (
        props.ExtendItem === ExtendItemEnum.company ||
        props.ExtendItem === ExtendItemEnum.customer ||
        props.ExtendItem === ExtendItemEnum.supplier
      ) {
        return {
          adjust_amount: '',
          adjust_reason: '',
          company_id: '',
          company_name: '',
          hidden_name: undefined,
        } as AdjustInfo;
      } else if (props.ExtendItem === ExtendItemEnum.anchor) {
        return {
          adjust_amount: '',
          adjust_reason: '',
          kol_id: '',
          kol_name: '',
          real_name: undefined,
          hidden_name: undefined,
        };
      } else if (props.ExtendItem === ExtendItemEnum.project) {
        return {
          adjust_amount: '',
          adjust_reason: '',
          company_id: undefined,
          company_name: undefined,
          type: undefined,
          hidden_name: undefined,
        };
      } else if (props.ExtendItem === ExtendItemEnum.LiveDouyinSelf) {
        return {
          adjust_amount: '',
          adjust_reason: '',
          kol_id: '',
          kol_name: '',
          real_name: undefined,
          company_id: '',
          company_name: '',
          type: undefined,
          hidden_name: undefined,
        };
      } else {
        return { adjust_amount: '', adjust_reason: '' };
      }
    });

    const defaultInfo = (
      (props.adjust_info ?? []).length ? props.adjust_info : [parse(DefaultItemData.value)]
    ) as AdjustInfo[];

    const getTagAdjustInfoList = (adjust_infos: AdjustInfo[]) => {
      adjust_infos.forEach(el => {
        if (ShowAnchor.value) {
          el.hidden_name = el.real_name || el.kol_name;
        } else if (ShowCompany.value) {
          el.hidden_name = el.company_name;
        } else if (ShowProject.value) {
          el.hidden_name = el.project_name;
        } else if (ShowLiveDouyinSelf.value || ShowLiveDouyinSelfAfter.value) {
          if (el.type === 9) {
            el.hidden_name = el.real_name || el.kol_name;
            el.company_name = undefined;
          } else {
            el.hidden_name = el.company_name || el.hidden_name;
            el.kol_name = undefined;
          }
        } else {
          el.hidden_name = el.hidden_name || undefined;
        }
      });
      return adjust_infos;
    };

    const getFirstInitData = (adjust_infos: AdjustInfo[]) => {
      return getTagAdjustInfoList(adjust_infos);
    };

    const AdjustInfoList = ref<AdjustInfo[]>(getFirstInitData([...defaultInfo]));

    const getValidData = (adjust_info_list: AdjustInfo[]) => {
      const result: AdjustInfo[] = [];
      adjust_info_list.map(el => {
        const { hidden_name, ...rest } = el;
        result.push(rest);
      });
      return result;
    };

    const UpdataEmitData = () => {
      return getValidData(AdjustInfoList.value);
    };

    const _EmitDataChange = () => {
      ctx.emit('dataChange', UpdataEmitData());
    };

    const EmitDataChange = debounce(_EmitDataChange, 200);

    watch(
      () => JSON.stringify(AdjustInfoList.value),
      newVal => {
        if (newVal) {
          EmitDataChange();
        }
      },
    );

    watch(
      () => filterOption.value,
      newVal => {
        if (newVal || newVal === '') {
          AdjustInfoList.value = getTagAdjustInfoList(AdjustInfoList.value);
        }
      },
    );

    /** 添加一栏 */
    const addItemHandler = () => {
      const item = parse(DefaultItemData.value);
      if (filterOption.value) {
        item.hidden_name = filterOption.value;
      }
      AdjustInfoList.value.unshift(item);
      EmitDataChange();
    };

    /** 删除一栏 */
    const removeItemHandler = (index: number) => {
      if (AdjustInfoList.value.length > 1) {
        AdjustInfoList.value.splice(index, 1);
      }
      EmitDataChange();
    };

    const _getAdjustInputNumber = (value: string) => {
      return (/-?(?:(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?)?/u.exec(
        value.replace(/[^-.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
    };

    const getAdjustAmountNumber = (value: string, index: number) => {
      const result = _getAdjustInputNumber(value);
      AdjustInfoList.value[index].adjust_amount = result;
    };

    const allSelectData = computed(() => {
      return props.ExtendItemSelectOptions;
    });
    const allKolSelectData = computed(() => {
      return ShowLiveDouyinSelf.value &&
        props.ExtendItemDpAllTypeOptionsObj &&
        props.ExtendItemDpAllTypeOptionsObj.kol
        ? props.ExtendItemDpAllTypeOptionsObj.kol
        : props.ExtendItemSelectOptions;
    });
    const allCompanySelectData = computed(() => {
      return ShowLiveDouyinSelf.value &&
        props.ExtendItemDpAllTypeOptionsObj &&
        props.ExtendItemDpAllTypeOptionsObj.put
        ? props.ExtendItemDpAllTypeOptionsObj.put
        : props.ExtendItemSelectOptions;
    });
    const allOtherSelectData = computed(() => {
      return ShowLiveDouyinSelf.value &&
        props.ExtendItemDpAllTypeOptionsObj &&
        props.ExtendItemDpAllTypeOptionsObj.other
        ? props.ExtendItemDpAllTypeOptionsObj.other
        : props.ExtendItemSelectOptions;
    });
    const allAdvertSelectData = computed(() => {
      return ShowLiveDouyinSelf.value &&
        props.ExtendItemDpAllTypeOptionsObj &&
        props.ExtendItemDpAllTypeOptionsObj.advert
        ? props.ExtendItemDpAllTypeOptionsObj.advert
        : props.ExtendItemSelectOptions;
    });
    /** 显示调账列表 */
    const DisplayAdjustInfoList = computed(() => {
      if (filterOption.value !== '') {
        if (ShowCompany.value) {
          return AdjustInfoList.value.filter(
            el => el.company_name === filterOption.value || el.hidden_name === filterOption.value,
          );
        }
        if (ShowAnchor.value) {
          return AdjustInfoList.value.filter(
            el => el.kol_name === filterOption.value || el.hidden_name === filterOption.value,
          );
        }
        if (ShowLiveDouyinSelf.value || ShowLiveDouyinSelfAfter.value) {
          const anchorList = AdjustInfoList.value.filter(
            el =>
              el.company_name === filterOption.value ||
              el.kol_name === filterOption.value ||
              el.hidden_name === filterOption.value,
          );
          return anchorList || [];
        }
        if (ShowProject.value) {
          return AdjustInfoList.value.filter(
            el => el.project_name === filterOption.value || el.hidden_name === filterOption.value,
          );
        }
      }
      return AdjustInfoList.value;
    });

    const handlerSelectChange = (name: string, index: number) => {
      const find = allSelectData.value?.find(el => el.real_name === name || el.name === name);
      if (ShowCompany.value) {
        AdjustInfoList.value[index].company_id = find?.id;
      } else if (ShowAnchor.value) {
        AdjustInfoList.value[index].kol_id = find?.id;
        AdjustInfoList.value[index].kol_name = find?.name;
        AdjustInfoList.value[index].real_name = find?.real_name;
      } else if (ShowLiveDouyinSelf.value || ShowLiveDouyinSelfAfter.value) {
        if (AdjustInfoList.value[index].type === 9) {
          AdjustInfoList.value[index].kol_id = find?.id;
          AdjustInfoList.value[index].kol_name = find?.name;
          AdjustInfoList.value[index].real_name = find?.real_name;
        } else {
          AdjustInfoList.value[index].company_id = find?.id;
        }
      } else if (ShowProject.value) {
        AdjustInfoList.value[index].type = find?.type;
      }
      /** 将空字符串转换为null */
      AdjustInfoList.value[index].company_id = AdjustInfoList.value[index].company_id || null;
      AdjustInfoList.value[index].hidden_name = name;
    };
    const costOptions = computed<feeTypeItem[]>(() => {
      const options: feeTypeItem[] = [];
      SetlementLiveCostTypeMap.forEach((value, key) => {
        options.push({
          label: value,
          value: key,
        });
      });
      return options;
    });
    const handlerSelectWayChange = (item: any, index: number) => {
      //切换结算方式
      item.company_name = '';
      item.kol_name = '';
      AdjustInfoList.value[index] = item;
    };
    const itemDisabled = (type: any, namestr: any) => {
      if (ShowLiveDouyinSelf.value || ShowLiveDouyinSelfAfter.value) {
        //判断选择状态
        let isDisable: any = false;
        AdjustInfoList.value.map((item: any) => {
          if (
            item.type === type &&
            (item.real_name === namestr ||
              item.kol_name === namestr ||
              item.company_name === namestr)
          ) {
            isDisable = true;
          }
        });
        return isDisable;
      } else {
        let isDisable: any = false;
        AdjustInfoList.value.map((item: any) => {
          if (
            item.real_name === namestr ||
            item.kol_name === namestr ||
            item.company_name === namestr
          ) {
            isDisable = true;
          }
        });
        return isDisable;
      }
    };
    const itemTyepDisabled = (type: any) => {
      if (ShowLiveDouyinSelfAfter.value) {
        //判断选择状态
        let isDisable: any = false;
        AdjustInfoList.value.map((item: any) => {
          if (item.type === type) {
            isDisable = true;
          }
        });
        return isDisable;
      } else {
        return false;
      }
    };
    return {
      itemTyepDisabled,
      itemDisabled,
      allAdvertSelectData,
      allOtherSelectData,
      allCompanySelectData,
      allKolSelectData,
      handlerSelectWayChange,
      ShowLiveDouyinSelfAfter,
      ShowLiveDouyinSelf,
      SettlementIncomeType,
      costOptions,
      total_height,
      title,
      ShowCompany,
      ShowAnchor,
      ShowProject,
      DisplayAdjustInfoList,
      filterOption,
      allSelectData,
      MaxAdjustSize,
      handlerSelectChange,
      getAdjustAmountNumber,
      AdjustInfoList,
      addItemHandler,
      removeItemHandler,
    };
  },
});
