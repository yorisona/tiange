import { defineComponent, computed, ref, PropType } from '@vue/composition-api';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import {
  Settlement,
  SettlementAmountInfo,
  SettlementIncomeType,
  SettlementType,
} from '@/types/tiange/finance/settlement';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { SetlementIncomeTypeMap } from '@/types/tiange/finance/settlement';
import { pit_fee_detail_url } from '@/modules/settlement/component/use/uilts';
import utils from '@/utils';
import moment from 'moment';
import use from '@/modules/customer/contract/list/use';

export default defineComponent({
  components: {
    TopCard,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabledMonth: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    accountDateVisible: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    iconName(fileName: string) {
      if (fileName.includes('xls')) {
        return 'ico-excel';
      } else if (fileName.includes('pdf')) {
        return 'ico-pdf';
      } else if (fileName.includes('docx')) {
        return 'ico-word';
      } else {
        return 'ico-picture';
      }
    },
  },
  setup(props, ctx) {
    const adjust_info_total = computed(() => {
      if (Array.isArray(props.item.adjust_info)) {
        const allAmount = props.item.adjust_info.map(item => Number(item.adjust_amount));
        return allAmount.reduce((total, currentValue) => {
          return total + currentValue;
        }, 0);
      } else {
        return 0;
      }
    });
    const fileName = (url: string) => {
      if (url) {
        const fils = url.split('/');
        return fils.pop();
      }
      return '';
    };
    const previewFile = (file: string) => {
      const url = `${file}?Authorization=${getToken()}`;
      if (
        file.includes('.png') ||
        file.includes('.jpg') ||
        file.includes('.jpeg') ||
        file.includes('.pdf')
      ) {
        window.open(url);
      } else {
        window.open('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url));
      }
    };
    const downFile = (urlString: string) => {
      if (!urlString) return false;
      const requestOptions = {
        headers: {
          Authorization: getToken() ?? '',
        },
      };
      fetch(urlString, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            const filename = decodeURIComponent(
              urlString.split('/')[urlString.split('/').length - 1],
            );
            downloadFileFromBlob(data, filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };
    // 如果是淘宝点播
    const isTbdb = computed(() => {
      // return props.item.settlement_type === 1;
      return props.item.settlement_type === SettlementType.live_taobao;
    });
    // 如果是抖音点播
    const isDydb = computed(() => {
      // return props.item.settlement_type === 2;
      return (
        props.item.settlement_type === SettlementType.live_douyin ||
        props.item.settlement_type === SettlementType.local_life ||
        props.item.settlement_type === SettlementType.supply_chain
      );
    });
    const isTbPick = computed(() => {
      return props.item.settlement_type === SettlementType.live_taobao_pick;
    });
    // 如果自营
    const isSelf = computed(() => {
      return props.item.cooperation_type === 1;
    });
    // MCN 类型
    const isMCNType = computed(() => {
      // return [4, 5, 6, 9].includes(props.item.settlement_type);
      return [
        SettlementType.common_mcn_taobao_cps,
        SettlementType.common_mcn_douyin_cps,
        SettlementType.common_mcn_vtask,
        SettlementType.s2b2c_taobao_other,
      ].includes(props.item.settlement_type);
    });
    // MCN-淘宝其他 类型
    const isMCNTaobaoOtherType = computed(() => {
      // return [9].includes(props.item.settlement_type);
      return [SettlementType.s2b2c_taobao_other].includes(props.item.settlement_type);
    });
    const isMCNDouyinType = computed(() => {
      // return props.item.settlement_type === 5;
      return props.item.settlement_type === SettlementType.common_mcn_douyin_cps;
    });

    const isDyCps = computed(() => {
      // return [8].includes(props.item.settlement_type);
      return [SettlementType.s2b2c_douyin_cps].includes(props.item.settlement_type);
    });

    const douyin_cps_income_type = (type: SettlementIncomeType) => {
      return SetlementIncomeTypeMap.get(type);
    };
    const douyin_cps_amount_info_list = computed(() => {
      const list = props.item?.json_data?.amount_info_list ?? [];
      list.sort((el1: SettlementAmountInfo, el2: SettlementAmountInfo) => el1.type - el2.type);
      return list;
    });
    // 新版整合营销 类型 isMarketingType
    const isNewMarketingType = computed(
      () => [3, 7].includes(props.item.settlement_type) && props.item.json_data?.amount_info_list,
    );
    // 老版整合营销 类型 isMarketingVTaskType
    const isOldMarketingType = computed(
      () => [3, 7].includes(props.item.settlement_type) && !props.item.json_data?.amount_info_list,
    );

    const isShopLiveType = computed(() => isTbdb.value || isDydb.value);

    // 区块高度样式
    const ItemHeightStyle = computed(() => {
      return isMCNType.value
        ? 'height: 327px'
        : isDydb.value && isSelf.value
        ? 'height: 240px'
        : '';
    });

    const downloadPitFeeDetail = () => {
      const url = pit_fee_detail_url(props.item.id, props.item.company_id);
      window.open(url);
    };

    // MCN收入数据列表 数据显示样式
    const getExcelDataStyle = (item: Settlement, index: number) => {
      const name = item.excel_data[index + 1] ? item.excel_data[index + 1].name : '';

      if (!['技术服务费', '服务费', '其他费用', '专项服务费'].includes(name)) {
        return 'margin-bottom: 18px; line-height: 18px; height: 18px';
      } else {
        return 'margin-bottom: 8px; line-height: 18px; height: 18px';
      }
    };
    const basename = (item: string) => {
      return utils.basename(item);
    };

    const accountDate = ref<string | undefined>(undefined);

    const pickerOptions = {
      disabledDate(time: any) {
        const minMoment = moment('2021-01');
        const maxMoment = moment();
        const date = moment(time);
        if (date.isBefore(minMoment, 'month') || date.isAfter(maxMoment, 'month')) {
          return true;
        }
        return props.disabledMonth.find(el => {
          if (el) {
            return moment(el * 1000).isSame(date, 'month');
          }
        });
      },
    };

    const onAccountDateChange = (date: string) => {
      ctx.emit('accountDateChange', date);
    };

    const contractClick = () => {
      /*   /!** 店铺代播 - 淘宝店播 *!/
      live_taobao = 1,
        /!** 店铺代播 - 抖音店播 *!/
        live_douyin,
        /!** 营销业务 - 营销 *!/
        marketing_marketing,
        /!** 通用业务 - MCN - 淘宝CPS *!/
        common_mcn_taobao_cps,
        /!** 通用业务 - MCN - 抖音CPS *!/
        common_mcn_douyin_cps,
        /!** 通用业务 - MCN - V任务 *!/
        common_mcn_vtask,
        /!** 营销业务 - V任务 *!/
        marketing_vtask,
        /!** 自动结算 **!/
        s2b2c_douyin_cps,*/
      const type_str =
        props.item.settlement_type === SettlementType.marketing_marketing ||
        props.item.settlement_type === SettlementType.marketing_vtask
          ? '1'
          : props.item.settlement_type === SettlementType.common_mcn_taobao_cps ||
            props.item.settlement_type === SettlementType.common_mcn_douyin_cps ||
            props.item.settlement_type === SettlementType.common_mcn_vtask ||
            props.item.settlement_type === SettlementType.s2b2c_taobao_other
          ? '3'
          : props.item.settlement_type === SettlementType.local_life
          ? '4'
          : props.item.settlement_type === SettlementType.supply_chain
          ? '5'
          : props.item.settlement_type === SettlementType.live_douyin
          ? '6'
          : '2';
      const contract = use.useContract(type_str, ctx);
      contract.contractClick(props.item.contract_id, true, props.item.project_id);
    };
    return {
      isTbPick,
      isSelf,
      basename,
      downloadPitFeeDetail,
      getToken,
      douyin_cps_amount_info_list,
      douyin_cps_income_type,
      getExcelDataStyle,
      isNewMarketingType,
      isOldMarketingType,
      isShopLiveType,
      ItemHeightStyle,
      formatAmountWithoutPrefix,
      adjust_info_total,
      previewFile,
      downFile,
      fileName,
      isTbdb,
      isDydb,
      isDyCps,
      isMCNType,
      isMCNDouyinType,
      isMCNTaobaoOtherType,
      contractClick,
      pickerOptions,
      accountDate,
      onAccountDateChange,
    };
  },
});
