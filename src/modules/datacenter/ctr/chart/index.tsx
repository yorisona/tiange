/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-23 13:23:52
 */
import { defineComponent, ref } from '@vue/composition-api';
import monthTrend from './monthTrend/index.vue';
import displayTrend from './displayTrend/index.vue';
import { CTRDetailQueryForm, CTRDetailRefType } from '../type';
// import { useRefTabs } from '@/use/tab';

export default defineComponent({
  name: 'crtChart',
  components: {
    monthTrend,
    displayTrend,
  },
  setup() {
    const currentIndex = ref(0);

    const chartRef = ref<CTRDetailRefType | undefined>(undefined);

    const refMethods: CTRDetailRefType = {
      reload(queryForm: CTRDetailQueryForm) {
        chartRef.value?.reload?.(queryForm);
      },
    };
    const methods = {
      onSwitch(index: number) {
        currentIndex.value = index;
      },
    };
    // const tabs = useRefTabs(
    //   [
    //     { label: '场次趋势', value: 'displayTrend' },
    //     { label: '月度趋势', value: 'monthTrend' },
    //   ],
    //   'displayTrend',
    // );
    return {
      chartRef,
      currentIndex,
      // ...tabs,
      ...methods,
      ...refMethods,
    };
  },
  render() {
    return (
      <div class="tg-crt-chart-page-container">
        {/* <div class="tab-area"> */}
        {/* <tg-tabs tabs={this.tabs} v-model={this.checkedTab}></tg-tabs> */}
        {/* <tg-button on-click={() => this.onSwitch(0)}>场次趋势</tg-button>
          <tg-button on-click={() => this.onSwitch(1)}>月度趋势</tg-button> */}
        {/* </div> */}
        {/* <div> */}
        {/* <this.checkedTab ref="chartRef" /> */}
        {/* {this.currentIndex === 0 ? (
            <displayTrend ref="chartRef"></displayTrend>
          ) : (
            <monthTrend ref="chartRef"></monthTrend>
          )} */}
        <displayTrend ref="chartRef"></displayTrend>
        {/* </div> */}
      </div>
    );
  },
});
