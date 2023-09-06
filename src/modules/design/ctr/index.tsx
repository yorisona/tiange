import { defineComponent } from '@vue/composition-api';
import Ctr from '@/modules/datacenter/ctr/index.vue';
import liveScreenMonitoring from '@/modules/datacenter/ctr/liveScreenMonitoring/index.vue';
import { useRouteTabs } from '@/use/tab';
export default defineComponent({
  components: {
    Ctr,
    liveScreenMonitoring,
  },
  setup(props, ctx) {
    const tabs = useRouteTabs(
      ctx,
      [
        { label: 'CTR数据分析', value: 'ctr' },
        { label: '直播画面监控', value: 'live-screen-monitoring' },
      ],
      'ctr',
    );
    return { ...tabs };
  },
  render(h) {
    const { tabs, checkedTab, onTabChange } = this;
    return (
      <div>
        <tg-tabs tabs={tabs} v-model={this.checkedTab} onChange={onTabChange} class="mgb-10" />
        {h(checkedTab)}
      </div>
    );
  },
});
