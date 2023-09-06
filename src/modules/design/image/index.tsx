import { defineComponent, reactive } from '@vue/composition-api';
import { useRouteNameTabs } from '@/use/tab';
import { RouterNameDesign } from '@/const/router';

export default defineComponent({
  beforeRouteUpdate(to, form, next) {
    this.tabs.updateChecked(to.name);
    next();
  },
  setup: (props, ctx) => {
    const tabs = useRouteNameTabs([
      {
        label: '预约明细',
        value: RouterNameDesign.image.detail,
      },
      {
        label: '预约统计',
        value: RouterNameDesign.image.statistics,
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
