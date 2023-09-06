import { defineComponent, reactive } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import { RouterNamePerformance } from '@/const/router';
import { useUserInfo } from '@/use/vuex';
import {
  Query_With_Me_Performance,
  Query_Subordinate_Performance,
  query_report_details,
} from '@/services/performance';

export default defineComponent({
  watch: {
    $route: {
      handler(to, form) {
        console.log('触发routerChange', to.fullPath, form.fullPath);
        this.tabs.active = to.name;
      },
      deep: true,
    },
  },
  setup: () => {
    const router = useRouter();
    const user = useUserInfo();

    const tabs = reactive({
      tabs: [
        {
          label: '我的绩效',
          value: RouterNamePerformance.my.own.list,
        },
        user.value.has_subordinate && {
          label: '下级考核',
          value: RouterNamePerformance.my.underling.list,
        },
        {
          label: '我的述职',
          value: RouterNamePerformance.debriefing.mine,
        },
        user.value.has_subordinate && {
          label: '下级述职',
          value: RouterNamePerformance.debriefing.underling,
        },
      ].filter(Boolean),
      active: router.currentRoute.name,
    });

    // Query_With_Me_Performance({ num: 20, page_num: 1 }, {}).then(res => {
    //   Query_Subordinate_Performance({ num: 20, page_num: 1 }, {}).then(ress => {
    //     tabs.tabs = [
    //       {
    //         label: '我的绩效',
    //         value: RouterNamePerformance.my.own.list,
    //       },
    //       res.data.data.total > 0 && {
    //         label: '与我相关',
    //         value: RouterNamePerformance.my.related.list,
    //       },
    //       (user.value.has_subordinate || ress.data.data.total > 0) && {
    //         label: '下级考核',
    //         value: RouterNamePerformance.my.underling.list,
    //       },
    //     ].filter(Boolean);
    //   });
    // });

    const fetchData = async () => {
      const [myPerformanceRes, subordinatePerformanceRes, subordinateDebriefing] =
        await Promise.all([
          Query_With_Me_Performance({ num: 20, page_num: 1 }, {}),
          Query_Subordinate_Performance({ num: 20, page_num: 1 }, {}),
          query_report_details({ num: 20, page_num: 1 }, { is_sub: true }),
        ]);
      const tabsData = [
        {
          label: '我的绩效',
          value: RouterNamePerformance.my.own.list,
        },
        myPerformanceRes.data.data.total > 0 && {
          label: '与我相关',
          value: RouterNamePerformance.my.related.list,
        },
        (user.value.has_subordinate || (subordinatePerformanceRes.data?.data?.total || 0) > 0) && {
          label: '下级考核',
          value: RouterNamePerformance.my.underling.list,
        },
        {
          label: '我的述职',
          value: RouterNamePerformance.debriefing.mine,
        },
        (user.value.has_subordinate || (subordinateDebriefing.data?.data?.total || 0) > 0) && {
          label: '下级述职',
          value: RouterNamePerformance.debriefing.underling,
        },
      ].filter(Boolean);
      tabs.tabs = tabsData;
    };

    fetchData();

    return {
      tabs,
    };
  },
  render() {
    return (
      <div class="tg-page-container container">
        <tg-tabs
          style="margin-bottom: 10px;"
          tabs={this.tabs.tabs}
          v-model={this.tabs.active}
          onChange={(val: any) => {
            this.$router.push({
              name: val.value,
            });
          }}
        />
        <router-view />
      </div>
    );
  },
});
