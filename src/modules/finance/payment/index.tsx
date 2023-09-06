import { defineComponent } from '@vue/composition-api';
import detailList from '@/modules/finance/payment/detailList/index.vue';
import approvalRecord from '@/modules/finance/payment/approvalRecord/index.vue';
import { useRouteTabs } from '@/use/tab';
export default defineComponent({
  components: {
    detailList,
    approvalRecord,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(
      ctx,
      [
        { label: '审批记录', value: 'approval-record' },
        { label: '付款明细', value: 'detail-list' },
      ],
      'approval-record',
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
