/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-31 18:36:13
 */
import { reactive } from '@vue/composition-api';
import { RouterNameSystem } from '@/const/router';
import { defineComponent } from '@gm/react';
import { useRefTabs } from '@/use/tab';
import { useRouter } from '@/use/vue-router';
import { Tab } from '@/types/components/tabs';
import spendingCategory from './spendingCategory/index.vue';
import accountingSubjects from './accountingSubjects/index.vue';
import reportSubject from '@/modules/system/spendingCategory/reportSubject/index.vue';

export default defineComponent({
  components: {
    spendingCategory,
    accountingSubjects,
    reportSubject,
  },
  setup() {
    // const breadcrumbs = ref([
    //   {
    //     name: RouterNameProjectManage.commonBusiness.project.list,
    //     title: '项目管理',
    //   },
    //   {
    //     path: '',
    //     title: '项目详情',
    //   },
    // ]);
    const tabs = useTabs();

    return {
      // breadcrumbs,
      tabs,
    };
  },
  render() {
    return (
      <div class="tg-page-container">
        <tg-tabs
          tabs={this.tabs.tabs}
          v-model={this.tabs.checkedTab}
          onChange={this.tabs.jump}
          className="flex-none"
        />
        <div class="flex-fill tg-card mgt-10 pdl-16 pdr-16">
          <this.tabs.checkedTab />
        </div>
      </div>
    );
  },
});

const useTabs = () => {
  const router = useRouter();

  const type = router.currentRoute.params.type;
  const { tabs, checkedTab } = useRefTabs(
    [
      { label: '会计科目', value: 'accountingSubjects' },
      { label: '费用类别', value: 'spendingCategory' },
      { label: '管报科目', value: 'reportSubject' },
    ],
    type,
  );
  if (router.currentRoute.params.type === undefined) {
    router.replace({
      name: RouterNameSystem.spendingCategory,
      params: {
        type: checkedTab.value,
      },
    });
  }
  const jump = (tab: Tab) => {
    router.push({
      name: RouterNameSystem.spendingCategory,
      params: {
        type: tab.value,
      },
    });
  };
  return reactive({
    tabs: tabs.value,
    checkedTab,
    jump,
  });
};
