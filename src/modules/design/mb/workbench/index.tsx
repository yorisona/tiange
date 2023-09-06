import { defineComponent } from '@vue/composition-api';
import { useRouteNameTabs } from '@/use/tab';
import { RouterNameMB } from '@/const/router';

export default defineComponent({
  setup() {
    const tabs = useRouteNameTabs([
      {
        label: '兑换商城',
        value: RouterNameMB.workbench.mall,
      },
      {
        label: '我的兑换',
        value: RouterNameMB.workbench.my,
      },
      // {
      //   label: '赠送明细',
      //   value: RouterNameMB.workbench.giftDetails,
      // },
    ]);
    return { tabs };
  },
  render() {
    const { tabs } = this;
    return (
      <div class="exchangeMall-container">
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs.tabs}
          v-model={tabs.checkedTab}
          onChange={tabs.onTabChange}
        />
        <router-view class="context" />
      </div>
    );
  },
});
