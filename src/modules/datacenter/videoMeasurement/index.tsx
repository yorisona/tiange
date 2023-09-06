import { defineComponent, reactive, provide, ref } from '@vue/composition-api';
import { useRouteNameTabs } from '@/use/tab';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';

export default defineComponent({
  watch: {
    $route: {
      handler(to) {
        this.checkDefault(to);
      },
      deep: true,
    },
  },
  setup() {
    const tabs = useRouteNameTabs(
      [
        {
          label: '短视频',
          value: RouterDataCenter.videoMeasurementVideos,
        },
        {
          label: '商品',
          value: RouterDataCenter.videoMeasurementGoods,
        },
        {
          label: '模特',
          value: RouterDataCenter.videoMeasurementModel,
        },
      ].filter(Boolean) as any,
      '',
      false,
    );

    const router = useRouter();
    const checkDefault = (to?: any) => {
      tabs.updateChecked(to.name);
    };
    checkDefault(router.currentRoute);
    const onTabChange = (value: any) => {
      if (tabs.checkedTab === value) return;
      tabs.onTabChange({ value } as any);
    };
    const dateStr = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const currentSelectDate = ref([dateStr, dateStr]);
    provide('currentSelectDate', currentSelectDate);
    // checkDefault();
    return reactive({ tabs, checkDefault, onTabChange });
  },
  render() {
    const { tabs, onTabChange } = this;
    return (
      <div class="exchangeMall-container">
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs.tabs}
          value={tabs.checkedTab}
          onInput={onTabChange}
        />
        <router-view class="context" />
      </div>
    );
  },
});
