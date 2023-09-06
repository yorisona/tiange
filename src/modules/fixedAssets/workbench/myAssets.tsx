import { defineComponent } from '@vue/composition-api';
import my from './my/index.vue';
import { useRouteTabs } from '@/use/tab';
import collarApplication from './collarApplication/index.vue';
import myApplication from './myApplication/index.vue';
import myDepartment from './myDepartment/index.vue';
export default defineComponent({
  components: {
    my,
    myDepartment,
    collarApplication,
    myApplication,
  },
  setup(props, ctx) {
    const routes = [
      {
        title: '工作台',
        name: 'Workbench',
      },
      {
        title: '我的资产',
      },
    ];
    const tabs = useRouteTabs(
      ctx,
      [
        { label: '我的资产', value: 'my' },
        { label: '部门资产', value: 'myDepartment' },
        { label: '领用申请', value: 'collarApplication' },
        { label: '我的申请', value: 'myApplication' },
      ],
      'my',
    );
    return { ...tabs, routes };
  },
  render(h) {
    const { tabs, checkedTab, onTabChange } = this;
    return (
      <div>
        <tg-breadcrumbs routes={this.routes} />
        <tg-tabs
          class="tg-tabs-bottom-line"
          tabs={tabs}
          v-model={this.checkedTab}
          onChange={onTabChange}
        />
        {h(checkedTab)}
      </div>
    );
  },
});
