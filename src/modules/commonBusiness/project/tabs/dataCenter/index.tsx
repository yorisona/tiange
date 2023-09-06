import { computed, defineComponent, h, inject, Ref, ref } from '@vue/composition-api';
import DailyData from '@/modules/commonBusiness/project/tabs/dataCenter/switch/dailyData/index.vue';
import DisplayData from '@/modules/commonBusiness/project/tabs/dataCenter/switch/displayData/index.vue';
import monthSession from '@/modules/commonBusiness/project/tabs/dataCenter/switch/monthSession/index.vue';

import moment from 'moment';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';

export default defineComponent({
  name: 'dataCenter',
  components: {
    // DailyData: defineAsyncComponent(() => import('@/modules/commonBusiness/project/tabs/dataCenter/switch/dailyData/index.vue')),
    // DisplayData: defineAsyncComponent(() => import('@/modules/commonBusiness/project/tabs/dataCenter/switch/displayData/index.vue')),
    DailyData,
    DisplayData,
    monthSession,
  },
  setup(props, ctx) {
    const formatStr = 'yyyy年MM月';

    const selectIndex = ref<number>(0);
    const selectedDate = ref<moment.Moment>(moment().startOf('M'));
    const showDateStr = computed(() => selectedDate.value.format(formatStr));
    const dataUpdateStr = ref<string | undefined>(undefined);
    const preMonthEnable = computed<boolean>(
      () => !selectedDate.value.isSameOrBefore(moment('2022-01'), 'M'),
    );
    const nextMonthEnable = computed<boolean>(
      () => !selectedDate.value.isSameOrAfter(moment(), 'M'),
    );
    const switchComponents = [DailyData.name, monthSession.name, DisplayData.name];
    const methods = {
      onSwitch(index: number) {
        dataUpdateStr.value = undefined;
        if (selectIndex.value !== index) {
          selectedDate.value = moment().startOf('M');
        }
        selectIndex.value = index;
      },
      onPreMonth() {
        if (!preMonthEnable.value) {
          return;
        }
        methods.resetDate(-1);
      },
      onNextMonth() {
        if (!nextMonthEnable.value) {
          return;
        }
        methods.resetDate(1);
      },
      resetDate(step: number) {
        dataUpdateStr.value = undefined;
        selectedDate.value = selectedDate.value.clone().add(step, 'M');
      },
    };

    return {
      selectedDate,
      preMonthEnable,
      nextMonthEnable,
      showDateStr,
      selectIndex,
      switchComponents,
      dataUpdateStr,
      ...methods,
    };
  },
  render() {
    const {
      selectIndex,
      showDateStr,
      preMonthEnable,
      nextMonthEnable,
      selectedDate,
      switchComponents,
    } = this;
    const project =
      inject<Ref<CommonBusinessProjectDetail>>('project') ?? ref<CommonBusinessProjectDetail>();
    // 4: 基地业务 5: 创新项目
    const business_type = computed(() => project.value?.business_type);
    const componentObj = {
      name: switchComponents[selectIndex],
      props: {
        currentDate: selectedDate,
        business_type: business_type.value,
      },
    };
    return (
      <div class="data-center-page-container">
        <div class="data-center-switch">
          <tg-button selected={selectIndex === 0} type="link" on-click={() => this.onSwitch(0)}>
            项目日报
          </tg-button>
          <span class="mgl-18 mgr-18 line-ver">|</span>
          <tg-button selected={selectIndex === 1} type="link" on-click={() => this.onSwitch(1)}>
            项目月报
          </tg-button>
          <span class="mgl-18 mgr-18 line-ver">|</span>
          <tg-button selected={selectIndex === 2} type="link" on-click={() => this.onSwitch(2)}>
            场次明细
          </tg-button>
        </div>
        {selectIndex !== 1 && (
          <div class="data-center-operation">
            <div class="data-center-operation-date">
              <tg-button disabled={!preMonthEnable} type="link" on-click={this.onPreMonth}>
                <tg-icon name="ico-arrow-left"></tg-icon>
              </tg-button>
              <span class="mgl-12 mgr-12 data-center-date">{showDateStr}</span>
              <tg-button disabled={!nextMonthEnable} type="link" on-click={this.onNextMonth}>
                <tg-icon name="ico-arrow-right"></tg-icon>
              </tg-button>
            </div>
            {(this.dataUpdateStr?.length ?? 0) > 0 && (
              <div class="data-center-operation-update-date-desc">
                最后更新时间：{this.dataUpdateStr}
              </div>
            )}
          </div>
        )}
        <div class="data-center-template">
          {h(componentObj.name, {
            props: componentObj.props,
            on: {
              dataUpdate: (data: { date: number | undefined }) => {
                if (data.date) {
                  const date_moment = moment(data.date * 1000);
                  this.dataUpdateStr = date_moment.format('yyyy.MM.DD');
                } else {
                  this.dataUpdateStr = undefined;
                }
              },
            },
          })}
          {/* <component is={switchComponents[selectIndex]} currentDate={selectedDate}></component> */}
          {/* {selectIndex === 0 && <daily-data currentDate={selectedDate}></daily-data>}
          {selectIndex === 1 && <display-data currentDate={selectedDate}></display-data>} */}
        </div>
      </div>
    );
  },
});
