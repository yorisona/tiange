<template>
  <div class="finance-invoice-page">
    <tg-block class="flex-none" :bodyStyle="{ padding: '0' }" style="height: 48px">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" bottom />
    </tg-block>
    <component class="flex-auto" :is="tabPane" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import InvoiceManager from './index.vue';
import InvoiceApplication from './application/index.vue';
import shakeToneBilled from './shakeToneBilled/index.vue';
import { useTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';
import { RouterNameFinance } from '@/const/router';

const tabPaneMap = new Map([
  ['manager', 'InvoiceManager'],
  ['application', 'InvoiceApplication'],
  ['shakeToneBilled', 'shakeToneBilled'],
]);

export default defineComponent({
  props: {
    tab: {
      type: String,
      default: 'manager',
    },
  },
  components: {
    InvoiceManager,
    InvoiceApplication,
    shakeToneBilled,
  },
  setup(props, ctx) {
    const tabs = useTabs<string>(
      [
        { label: '发票管理', value: 'manager' },
        { label: '开票管理', value: 'application' },
        { label: '抖音开票', value: 'shakeToneBilled' },
      ],
      props.tab,
    );
    const onTabChange = (tab: Tab) => {
      tabs.checkedTab.value = tab.value;
      const newRouteConfig =
        tabs.tabs[0].value === tab.value
          ? { name: RouterNameFinance.invoice_manager }
          : {
              name: RouterNameFinance.invoice_application,
              params: { tab: tab.value },
            };
      ctx.root.$router.push(newRouteConfig);
    };

    /** 选中Tab名称 */
    const tabPane = computed(() => tabPaneMap.get(tabs.checkedTab.value) ?? 'InvoiceManager');
    return { ...tabs, tabPane, onTabChange };
  },
});
</script>
