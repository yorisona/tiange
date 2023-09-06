import { defineComponent } from '@vue/composition-api';
import registerList from '@/modules/finance/prePay/register/index.vue';
import verificationList from '@/modules/finance/prePay/verification/index.vue';
import { useRouteTabs } from '@/use/tab';
export default defineComponent({
  components: {
    registerList,
    verificationList,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(
      ctx,
      [
        { label: '预收登记', value: 'register-list' },
        { label: '预收核销', value: 'verification-list' },
      ],
      'register-list',
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
