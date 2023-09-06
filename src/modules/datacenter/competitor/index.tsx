import { defineComponent, reactive } from '@vue/composition-api';
import { useRouteNameTabs } from '@/use/tab';
import { RouterDataCenter } from '@/const/router';

export default defineComponent({
  beforeRouteUpdate(to, form, next) {
    this.tabs.updateChecked(to.name);
    next();
  },
  setup: (props, ctx) => {
    const tabs = useRouteNameTabs([
      {
        label: '按日期',
        value: RouterDataCenter.commoditySalesAnalysisByDate,
      },
      {
        label: '按月度',
        value: RouterDataCenter.commoditySalesAnalysisByMonth,
      },
    ]);
    return reactive({ tabs });
  },
  render() {
    const { tabs } = this;
    return (
      <div class="design-image-detail">
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs.tabs}
          v-model={tabs.checkedTab}
          onChange={tabs.onTabChange}
        />
        <router-view />
      </div>
    );
  },
});
