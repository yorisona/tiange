/** 经营看板 */
import { useRefTabs } from '@/use/tab';
import { defineComponent } from '@vue/composition-api';

import dashboard from './tabs/dashboard/index.vue';
import gmv from './tabs/gmv/index.vue';
import income from './tabs/income/index.vue';
import cost from './tabs/cost/index.vue';
import profit from './tabs/profit/index.vue';

export default defineComponent({
  components: {
    dashboard,
    gmv,
    income,
    cost,
    profit,
  },
  setup() {
    const tabs = useRefTabs(
      [
        { label: '看板首页', value: 'dashboard' },
        { label: 'GMV', value: 'gmv' },
        { label: '收入', value: 'income' },
        { label: '成本', value: 'cost' },
        { label: '利润', value: 'profit' },
      ],
      'dashboard',
    );
    const methods = {};
    return {
      ...tabs,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <tg-tabs tabs={this.tabs} v-model={this.checkedTab}></tg-tabs>
        <this.checkedTab></this.checkedTab>
      </div>
    );
  },
});
