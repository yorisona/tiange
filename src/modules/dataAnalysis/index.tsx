import { RouterDataCenter } from '@/const/router';
import { useRouteNameTabs } from '@/use/tab';
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  beforeRouteUpdate(to, form, next) {
    this.tabs.updateChecked(to.name);
    next();
  },
  setup(props, ctx) {
    const tabs = useRouteNameTabs([
      {
        label: '商品培训管理',
        value: RouterDataCenter.trainingManage,
      },
      {
        label: '商品搭配管理',
        value: RouterDataCenter.matchingManage,
      },
    ]);
    const methods = {};
    return {
      tabs,
      ...methods,
    };
  },
  render() {
    const { tabs } = this;
    return (
      <div>
        <tg-tabs
          tabs={tabs.tabs}
          v-model={tabs.checkedTab}
          onChange={tabs.onTabChange}
          style="border-bottom: 1px solid #e5e5e5"
        />
        <router-view />
      </div>
    );
  },
});
