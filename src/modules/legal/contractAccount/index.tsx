import { defineComponent } from '@vue/composition-api';
import supplierContract from './supplierContract/index.vue';
import customerContract from './customerContract/index.vue';
import { useRouteTabs } from '@/use/tab';
export default defineComponent({
  components: {
    supplierContract,
    customerContract,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(
      ctx,
      [
        { label: '客户合同', value: 'customer-contract' },
        { label: '供应商合同', value: 'supplier-contract' },
      ],
      'customer-contract',
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
