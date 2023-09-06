import { defineComponent } from '@vue/composition-api';
import { useRouteTabs } from '@/use/tab';
import collected from './collected/index.vue';
import returnAsset from './return/index.vue';
import allocation from './allocation/index.vue';
import repair from './repair/index.vue';
import scrap from './scrap/index.vue';

export default defineComponent({
  components: {
    collected,
    returnAsset,
    allocation,
    repair,
    scrap,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(
      ctx,
      [
        { label: '资产领用', value: 'collected' },
        { label: '资产归还', value: 'returnAsset' },
        { label: '分配', value: 'allocation' },
        { label: '维修', value: 'repair' },
        { label: '报废', value: 'scrap' },
      ],
      'collected',
    );
    return { ...tabs };
  },
  render(h) {
    const { tabs, checkedTab, onTabChange } = this;
    return (
      <div>
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
