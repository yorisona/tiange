/**
 * 系统角色管理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-25 16:39:37
 */
import { computed, defineComponent, provide } from '@vue/composition-api';
import { useTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';
import { RouterNameSystem } from '@/const/router';
import TabUser from './tabs/user.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';

const tabPaneMap = new Map([['user', 'TabUser']]);

export default defineComponent({
  name: 'TgUser',
  components: {
    TabUser,
  },
  props: {
    tab: {
      type: String,
      default: 'user',
    },
  },
  setup(props, ctx) {
    const tabs = useTabs<string>([{ label: '用户管理', value: 'user' }], props.tab);

    const onTabChange = (tab: Tab) => {
      tabs.checkedTab.value = tab.value;
      const newRouteConfig =
        tabs.tabs[0].value === tab.value
          ? { name: RouterNameSystem.user.list }
          : {
              name: RouterNameSystem.user.listWithTab,
              params: { tab: tab.value },
            };

      ctx.root.$router.push(newRouteConfig);
    };

    /** 选中Tab名称 */
    const tabPane = computed(() => tabPaneMap.get(tabs.checkedTab.value) ?? 'TabUser');

    /** 权限检查 */
    const Permission = computed(() => {
      /** 系统设置 用户管理 */
      // const canViewUserList = HasPermission(RIGHT_CODE.user_list);
      const canViewUserList = true;
      const canEditUser = HasPermission(RIGHT_CODE.userAuthorization);
      const canUserExport = HasPermission(RIGHT_CODE.user_list_export);
      const batchAuthorization_view = HasPermission(RIGHT_CODE.batchAuthorization_view);

      return {
        canEditUser,
        canViewUserList,
        batchAuthorization_view,
        canUserExport,
      };
    });

    provide('Permission', Permission);

    return { ...tabs, onTabChange, tabPane, Permission };
  },
});
