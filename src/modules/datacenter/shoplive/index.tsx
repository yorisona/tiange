/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-22 16:02:12
 */
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { useRefTabs } from '@/use/tab';
import dailyDetail from '@/modules/datacenter/shoplive/tabs/dailyDetail/index.vue';
import week from '@/modules/datacenter/shoplive/tabs/week/index.vue';
import month from '@/modules/datacenter/shoplive/tabs/month/index.vue';
import year from '@/modules/datacenter/shoplive/tabs/year/index.vue';
import { GetLastUpdateTime } from '@/services/datacenter';

export default defineComponent({
  components: {
    dailyDetail,
    week,
    month,
    year,
  },
  setup(_, ctx) {
    const tabs = useRefTabs(
      [
        { label: '每日明细', value: 'dailyDetail' },
        { label: '周分析', value: 'week' },
        { label: '月分析', value: 'month' },
        { label: '年度分析', value: 'year' },
      ],
      'dailyDetail',
    );
    const updateTime = ref<string | undefined>(undefined);
    const updateTimeStr = computed(() => updateTime.value?.replace(/-/g, '.') ?? '--');
    const methods = {
      async getLastUpdateTime() {
        const res = await GetLastUpdateTime();
        if (res.data.success) {
          updateTime.value = res.data.data;
        }
      },
    };
    onMounted(() => {
      methods.getLastUpdateTime();
    });
    return {
      updateTimeStr,
      ...tabs,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-datacenter-shoplive">
        <tg-tabs tabs={this.tabs} v-model={this.checkedTab} class="tabs">
          <div class="update-time">数据更新时间：{this.updateTimeStr}</div>
        </tg-tabs>
        <this.checkedTab style="height: calc(100% - 50px);"></this.checkedTab>
      </div>
    );
  },
});
