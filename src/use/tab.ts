/**
 * tabs
 * 可复用的选项卡逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-15 19:56:44
 *   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
 *  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
 *  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 *  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 *           ░     ░ ░      ░  ░
 */
import { isRef, onBeforeMount, reactive, ref, unref } from '@vue/composition-api';
import type { Ref, SetupContext, UnwrapRef } from '@vue/composition-api';
import { ComponentValue } from '@/types/base/component';
import { Tab } from '@/types/components/tabs';
import type { MaybeRef } from '@vueuse/core';
import { useRouter } from '@/use/vue-router';

/**
 * tabs 逻辑
 * ```
 * 推荐使用 useRefTabs 以支持响应式数据
 * ```
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-17 20:55:00
 * @param {Tab[]} tabs
 * @deprecated
 */
export const useTabs = <T = ComponentValue>(tabs: Tab<T>[], defaultTab?: T) => ({
  tabs: reactive([...tabs]),
  checkedTab: ref<T | ''>(defaultTab ?? (tabs.length < 1 ? '' : tabs[0].value)),
});

/**
 * tabs 逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-23 00:09:42
 */
export const useRefTabs = <T = ComponentValue>(
  tabs: MaybeRef<Tab<T>[]>,
  defaultTab?: Ref<T> | T,
) => {
  const innerTabs = isRef(tabs) ? tabs : ref(tabs);

  const unrefDefTab = isRef(defaultTab) ? unref(defaultTab) : defaultTab;

  const tabVal = innerTabs.value.length < 1 ? '' : innerTabs.value[0].value;

  const checkedTab = ref<T | UnwrapRef<T> | ''>(unrefDefTab ?? tabVal);

  return {
    tabs: innerTabs,
    checkedTab,
  };
};

/**
 * 带路由处理的 tabs 逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 10:26:08
 * @param {SetupContext} ctx --- setup context 从组件内setup注入，用来获取页面路由
 * @param {Tab<string>[]} tabs
 * @param {string} defaultTab
 */
export const useRouteTabs = (ctx: SetupContext, tabs: Tab<string>[], defaultTab?: string) => {
  /** tabs数据 */
  const reactiveTabs = reactive([...tabs]);
  /** 选中 tab */
  const checkedTab = ref<string>(defaultTab ?? (tabs.length < 1 ? '' : `${tabs[0].value}`));

  /**
   * ```
   * 点击回调
   * 仅处理主动的点击操作，给路由追加切换Tab历史
   * 由其他原因导致 Tab 变动不予处理
   * ```
   */
  const onTabChange = (tab: Tab<string>) => {
    ctx.root.$router.push({ path: ctx.root.$route.path, query: { tab: `${tab.value}` } });
  };

  /** 根据 query 参数设置选中 tab */
  onBeforeMount(() => {
    const tabName = ctx.root.$route.query.tab;

    checkedTab.value =
      typeof tabName === 'string'
        ? tabName
        : defaultTab ?? (tabs.length < 1 ? '' : `${tabs[0].value}`);
  });

  return {
    tabs: reactiveTabs,
    checkedTab,
    onTabChange,
  };
};

/** params路由 tabs处理**/
export const useParamsRouteTabs = (tabs: Tab<string>[], defaultTab?: string) => {
  const reactiveTabs = reactive([...tabs]);
  const checkedTab = ref<string>(defaultTab ?? (tabs.length < 1 ? '' : `${tabs[0].value}`));
  const router = useRouter();
  const onTabChange = (tab: Tab<string>) => {
    const currentRoute = router.currentRoute;
    const params = {
      ...currentRoute.params,
      tab: tab.value,
    };
    router.push({ name: currentRoute.name as string, params });
    //router.push({ path: ctx.root.$route.path, query: { tab: `${tab.value}` } });
  };
  checkedTab.value = router.currentRoute.params.tab || defaultTab || checkedTab.value;
  return {
    tabs: reactiveTabs,
    checkedTab,
    onTabChange,
  };
};

/**
 * 根据路由名处理tab
 * @param {SetupContext} ctx --- setup context 从组件内setup注入，用来获取页面路由
 * @param {Tab<string>[]} tabs
 * @param {string} defaultTab
 */
export const useRouteNameTabs = (
  tabs: Tab<string>[],
  defaultTab?: string,
  isAutoUpdateChecked = true,
) => {
  /** tabs数据 */
  const reactiveTabs = reactive([...tabs]);
  const router = useRouter();
  /** 选中 tab */
  const checkedTab = ref<string>(defaultTab ?? (tabs.length < 1 ? '' : `${tabs[0].value}`));

  /**
   * ```
   * 点击回调
   * 仅处理主动的点击操作，给路由追加切换Tab历史
   * 由其他原因导致 Tab 变动不予处理
   * ```
   */
  const onTabChange = (tab: Tab<string>, options: Record<string, unknown> = {}) => {
    router.push({ name: tab.value, ...options });
  };

  const updateChecked = (_tabName?: string | undefined | null) => {
    let tabName: string | undefined | null = _tabName;
    if (tabName === undefined) {
      tabName = router.currentRoute.name;
    }
    checkedTab.value = tabName as any;
  };
  if (isAutoUpdateChecked) {
    /** 根据 query 参数设置选中 tab */
    onBeforeMount(updateChecked);
  }

  return {
    tabs: reactiveTabs,
    checkedTab,
    onTabChange,
    updateChecked,
  };
};
