/**
 * 运营中心 - 人员管理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 11:11:21
 */
import { defineComponent, onBeforeMount } from '@vue/composition-api';
import { useTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';

const ROUTE_USER = '/operation-center/user-management/user';

const ROUTE_ROLE = '/operation-center/user-management/role';

export default defineComponent({
  name: 'TgOperationCenter',
  setup(props, ctx) {
    const tabs = useTabs([
      {
        label: '用户列表',
        value: 'user',
      },
      {
        label: '权限分配',
        value: 'role',
      },
    ]);

    const onTabChange = (tab: Tab) => {
      if (tab.value === 'user') {
        ctx.root.$router.push(ROUTE_USER);
      }
      if (tab.value === 'role') {
        ctx.root.$router.push(ROUTE_ROLE);
      }
    };

    onBeforeMount(() => {
      if (ctx.root.$route.path === ROUTE_USER) {
        tabs.checkedTab.value = 'user';
      }
      if (ctx.root.$route.path === ROUTE_ROLE) {
        tabs.checkedTab.value = 'role';
      }
    });

    return {
      ...tabs,
      onTabChange,
    };
  },
});
