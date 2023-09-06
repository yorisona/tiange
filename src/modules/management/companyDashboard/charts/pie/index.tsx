/** 折线图 */
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch,
} from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { usePieColors } from '@/modules/finance/fundStatement/use/useColors';
import { getAmountFormatUnion, ratioFormat } from '@/modules/management/use';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    series: {
      type: Array as PropType<{ data: [] }[]>,
      default: () => [{ data: [] }],
    },
    originDatas: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    /* const pieDateType = [
      {
        name: 'GMV',
        prop: 'gmv',
      },
      {
        name: '营收',
        prop: 'income',
      },
      {
        name: '利润',
        prop: 'revenue',
      },
    ];*/
    const computedOriginDatas = computed<any[]>(() => props.originDatas || []);
    const baseOptions = ref({
      color: usePieColors,
      tooltip: {
        // trigger: 'axis',
        borderWidth: 0,
        formatter(params: any) {
          // console.log({
          //   params,
          //   computedOriginDatas,
          // });
          const { seriesIndex, dataIndex, color, name, value } = params || {};
          // const seriesName = pieDateType[seriesIndex].name;
          const getListItem = (items: any[]) => {
            let listItem = '';
            for (let i = 0; i < items.length; i++) {
              const element = items[i];
              const item = `<span style="font-weight: 400; color: var(--text-color);">${
                element.type === 'money'
                  ? '<span style="font-weight: 400">' +
                    getAmountFormatUnion(element.value).amountStr +
                    '</span>' +
                    '<span>' +
                    (getAmountFormatUnion(element.value).unit || '') +
                    '</span>'
                  : '<span style="font-weight: 400; margin-right: 6px">' +
                    ratioFormat(element.percent) +
                    '</span>'
              }</span>`;
              listItem += `
                  <div style=" color: var(--text-color);display: flex;justify-content: space-between;font-size: 12px; line-height: 16px; margin-top: ${
                    i > 0 ? '12px' : 0
                  }; align-items: center;">
                    <span style=" color: var(--text-color);display: flex;">
                      <span style="background: ${
                        element.color
                      }; display: inline-block; width: 6px; height: 6px; border-radius: 4px;margin-top: 5px"></span>
                      <span style="display: inline-block; margin-left: 4px; font-weight: 400; ">${
                        element.name
                      }：</span>${item}
                    </span>
                    <span style="display: inline-block; font-weight: 400; margin-left: 10px">${
                      (element.percent || '--') + '%'
                    }</span>
                  </div>
                  `;
            }
            return listItem;
          };
          const originData = computedOriginDatas.value?.[seriesIndex]?.[dataIndex];
          const listItem =
            originData && originData.children
              ? getListItem(
                  (originData.children || [])
                    .filter((el: any) => el.value > 0)
                    .map((item: any) => {
                      return {
                        name: item.name,
                        color: color,
                        value: item.value,
                        type: 'money',
                        percent: item.percent,
                      };
                    }),
                )
              : '';
          return listItem
            ? `
              <div style="margin: 8px;">
               <div style="display: flex;justify-content: space-between;color: var(--text-color); font-weight: 400; line-height: 18px;">
                <span>
                  ${
                    (name || '--') +
                    '：' +
                    getAmountFormatUnion(value * 100).amountStr +
                    (getAmountFormatUnion(value * 100).unit || '')
                  }
                </span>
                </div>
                <div style="margin-top: 12px;font-size: 12px">
                  ${listItem}
                </div>
              </div>
            `
            : `
              <div style="margin: 8px;">
               <div style="display: flex;justify-content: space-between;color: var(--text-color); font-weight: 400; line-height: 18px;">
                <span>
                  ${
                    (name || '--') +
                    '：' +
                    getAmountFormatUnion(value * 100).amountStr +
                    (getAmountFormatUnion(value * 100).unit || '')
                  }
                </span>
                 <span style="margin-left: 15px">
                   ${originData.percent}%
                 </span>
                </div>
              </div>
            `;
        },
      },
      grid: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      legend: {
        show: true,
        type: 'scroll',
        width: 342,
        // data: props.xData ?? [],
        right: 51,
        top: -4,
        itemGap: 18,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
        // borderRadius: 5,
        // data: ['预算目标'],
      },
      // grid: {
      //   left: 43,
      //   right: 54,
      //   bottom: 28,
      //   top: 38,
      //   containLabel: false,
      // },
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        baseOptions.value.series = props.series ?? [];
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch(
      [() => props.series],
      () => {
        methods.reloadData();
      },
      {
        deep: true,
      },
    );
    return {
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;" v-loading={this.loading}>
        {this.series.find(el => el.data.length !== 0) ? (
          <base-echarts options={this.baseOptions}></base-echarts>
        ) : (
          <empty chartHeight={200} />
        )}
      </div>
    );
  },
});
