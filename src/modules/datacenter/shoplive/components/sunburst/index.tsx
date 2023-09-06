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
      type: Object as PropType<{ data: []; children: [] }>,
      default: () => {
        return { data: [], children: [] };
      },
    },
    itemName: {
      type: String,
    },
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
        position: 'top',
        // formatter: '{b}:<br/> {c} ({d}%)',
        formatter: (params: any) => {
          const data = params.data;
          const title = data.name;
          let totalAmount = 0;
          props.series.data.map((item: any) => {
            totalAmount = (item.value || 0) + totalAmount;
          });
          if (!title || !totalAmount) {
            return undefined;
          }
          const radio = new Decimal(data.value || 0)
            .mul(new Decimal(100))
            .div(new Decimal(totalAmount))
            .toFixed(2);

          const amount_str =
            item_name.value === '直播间观看次数'
              ? formatAmount(Number(data.value).toFixed(0), 'None', true)
              : '¥' + formatAmount(data.value, 'None');
          const listItem = `
            <div style="font-size: 12px; line-height: 16px;">
              <span style="display: inline-block; font-weight: 400; color: #606974;">${item_name.value}：</span><span style="font-weight: 400; color: var(--text-color);"> ${amount_str}</span>
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
      legend: {
        show: false,
        // type: 'scroll',
        itemGap: 20,
        width: 130,
        itemWidth: 20,
        top: 10,
        left: 310,
      },
      label: {
        fontSize: 10,
      },
      series: [
        {
          type: 'pie',
          // selectedMode: 'single',
          data: [] as any[],
          label: {
            show: false,
            minAngle: 8,
            width: 50,
            overflow: 'truncate',
            position: 'inside',
            formatter: (params: any) => {
              const data = params.data;
              const title = data.name;
              let totalAmount = 0;
              props.series.data.map((item: any) => {
                totalAmount = (item.value || 0) + totalAmount;
              });
              if (!title || !totalAmount) {
                return '';
              }
              const radio = new Decimal(data.value || 0)
                .mul(new Decimal(100))
                .div(new Decimal(totalAmount))
                .toFixed(2);
              return Number(radio) > 5 ? params.data.name : '';
            },
          },
          radius: ['30%', '58%'],
          itemStyle: {
            borderWidth: 1,
            borderColor: '#FFFFFF',
            color: '#91c7ae',
          },
          clockwise: true,
          animation: true,
        },
        {
          type: 'pie',
          data: [] as any[],
          // selectedMode: 'single',
          // selectedOffset: 5,
          radius: ['58%', '86%'],
          label: {
            show: false,
            minAngle: 8,
            width: 50,
            overflow: 'truncate',
            position: 'inside',
            formatter: (params: any) => {
              const data = params.data;
              const title = data.name;
              let totalAmount = 0;
              props.series.data.map((item: any) => {
                totalAmount = (item.value || 0) + totalAmount;
              });
              if (!title || !totalAmount) {
                return '';
              }
              const radio = new Decimal(data.value || 0)
                .mul(new Decimal(100))
                .div(new Decimal(totalAmount))
                .toFixed(2);
              return Number(radio) > 5 ? params.data.name : '';
            },
          },
          emphasis: {
            focus: 'ancestor',
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#FFFFFF',
            color: '#91c7ae',
          },
          clockwise: true,
          animation: true,
        },
      ],
    });
    const methods = {
      reloadData() {
        const options = baseOptions.value;
        baseOptions.value.series[0] = {
          ...options.series[0],
          data: [...props.series.data],
        };
        baseOptions.value.series[1] = {
          ...options.series[1],
          data: [...props.series.children],
        };
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
    const selectClick = (param: any) => {
      ctx.emit('selectParamClick', param);
    };
    return {
      selectClick,
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;" v-loading={this.loading}>
        {(this.series.data.length || 0) > 0 ? (
          <base-echarts options={this.baseOptions} onSelectClick={this.selectClick}></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
