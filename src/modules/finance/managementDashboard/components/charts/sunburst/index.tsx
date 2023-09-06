/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-02 16:32:09
 */
/** 旭日图 */
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
import { formatAmount } from '@/utils/string';
import Decimal from 'decimal.js';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    series: {
      type: Object as PropType<{ data: [] }>,
      default: () => {},
    },
    itemName: {
      type: String,
    },
    // totalAmount: {
    //   type: Decimal,
    //   default: () => new Decimal(1),
    // },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const item_name = computed(() => props.itemName);
    const baseOptions = ref({
      tooltip: {
        trigger: 'item',
        // borderWidth: 0,
        formatter(params: any) {
          const data = params.data;
          const title = data.name;
          const totalAmount = params.treePathInfo?.[0]?.value;
          if (!title || !totalAmount) {
            return undefined;
          }
          const radio = new Decimal(data.value ?? 0)
            .mul(new Decimal(100))
            .div(new Decimal(totalAmount))
            .toFixed(2);
          const listItem = `
            <div style="font-size: 12px; line-height: 16px;">
              <span style="display: inline-block; font-weight: 400; color: #606974;">${
                item_name.value
              }：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
            data.value,
            'None',
          )}</span>
            </div>
            <div style="font-size: 12px; line-height: 16px; margin-top: 12px;">
              <span style="display: inline-block; font-weight: 400; color: #606974;">占比：</span><span style="font-weight: 400; color: var(--text-color);">${radio}%</span>
            </div>
            `;

          return `
            <div style="margin: 8px; text-align: left;">
              <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${
                title ? title : '--'
              }</div>
              <div style="margin-top: 18px;">
                ${listItem}
              </div>
            </div>
          `;
        },
      },
      label: {
        fontSize: 10,
      },
      series: {
        type: 'sunburst',
        radius: [0, '95%'],
        sort: undefined,
        label: {
          minAngle: 8,
          width: 50,
          overflow: 'truncate',
        },
        emphasis: {
          focus: 'ancestor',
        },
        levels: [
          {
            // itemStyle: {
            //   color: '#667ad5'
            // }
          },
          {
            r0: '21.27%',
            r: '46.80%',
            itemStyle: {
              borderWidth: 2,
            },
            label: {
              rotate: 'tangential',
            },
          },
          {
            r0: '46.80%',
            r: '100%',
            label: {
              align: 'right',
            },
          },
        ],
        data: [],
      },
    });
    const methods = {
      reloadData() {
        const options = baseOptions.value;
        baseOptions.value.series = { ...options.series, ...props.series };
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch(
      () => props.series,
      () => {
        methods.reloadData();
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
        {(this.series.data?.length ?? 0) > 0 ? (
          <base-echarts options={this.baseOptions}></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
