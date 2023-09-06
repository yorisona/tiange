<template>
  <div class="finance-invoice-page">
    <tg-block class="flex-none" :bodyStyle="{ padding: '0' }" style="height: 48px">
      <tg-tabs :tabs="tabs" v-model="checkedTab" bottom @change="onTabChange" />
    </tg-block>
    <component class="flex-auto" :is="tabPane" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import Estimated from './components/Estimated/index.vue';
import Automatic from './components/Automatic/index.vue';
import Withdrawal from './components/withdrawal/index.vue';
import Cost from './components/Cost/index.vue';
import CostFormal from './components/CostFormal/index.vue';
import { useTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';
import { RouterInvestment } from '@/const/router';

const tabPaneMap = new Map([
  ['estimated', 'Estimated'],
  ['automatic', 'Automatic'],
  ['withdrawal', 'Withdrawal'],
  ['cost', 'Cost'],
  ['costFormal', 'costFormal'],
]);

export default defineComponent({
  props: {
    tab: {
      type: String,
      default: 'estimated',
    },
  },
  components: {
    Estimated,
    Automatic,
    Withdrawal,
    Cost,
    CostFormal,
  },
  setup(props, ctx) {
    const tabs = useTabs<string>(
      [
        { label: '暂估收入结算', value: 'estimated' },
        { label: '收入结算', value: 'automatic' },
        { label: '暂估成本结算', value: 'cost' },
        { label: '成本结算', value: 'costFormal' },
        { label: '提现记录', value: 'withdrawal' },
      ],
      props.tab,
    );
    const tabPane = computed(() => tabPaneMap.get(tabs.checkedTab.value) ?? 'estimated');
    const onTabChange = (tab: Tab) => {
      tabs.checkedTab.value = tab.value;
      const newRouteConfig =
        tabs.tabs[0].value === tab.value
          ? { name: RouterInvestment.unite }
          : {
              name: RouterInvestment.withdrawal,
              params: { tab: tab.value },
            };
      ctx.root.$router.push(newRouteConfig);
    };

    /** 选中Tab名称 */

    return { ...tabs, tabPane, onTabChange };
  },
});
</script>
<style lang="less">
.unit-popover {
  padding: 16px !important;
}
</style>
