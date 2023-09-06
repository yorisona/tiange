/**
 * 侧边栏菜单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-23 14:22:02
 */
import {
  computed,
  defineComponent,
  inject,
  onActivated,
  onBeforeMount,
  onUpdated,
  ref,
} from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import type { RouteConfig } from 'vue-router';
import Store from '@/store';
import { unique } from '@/utils/func';
import { HasPermission } from '@/use/permission';

// * 默认展开菜单
const defOpeneds: string[] = [
  // '/commonbusiness',
  // '/marketing',
  // '/live',
  // '/sales',
  // '/finance',
  // '/legal',
  // '/customer',
  // '/supplier',
  // '/public',
  // '/public',
  // '/system',
];

/** 是否禁用路由权限控制(显示全部路由) */
const isRouterAuthDisabled =
  process.env.NODE_ENV === 'development' && process.env.VUE_APP_DEV_ROUTER_AUTH_DISABLE === 'ON';

export default defineComponent({
  setup(props, ctx) {
    const userRoles = computed(() => Store.getters['user/getUserRole']);

    const userInfo = computed(() => Store.getters['user/getUserInfo']);

    /** 激活菜单 */
    const activePath = ref('/workbench');

    /** 激活的一级菜单 */
    const activeParentPath = ref('/workbench');

    const init = () => {
      if (!userInfo.value) {
        ctx.root.$router.push({ name: 'Login' });
      }
    };
    /** 经过过滤需要显示的一级带二级菜单 */
    const menus = computed<RouteConfig[]>(() =>
      (ctx.root.$router.options.routes?.find(el => el.name === 'Home')?.children ?? [])
        .filter(menu => !(menu.meta?.hidden ?? false))
        .map(menu => {
          const { children, ...rest } = menu;

          const filteredChildren = (children ?? []).filter(
            submenu => !(submenu.meta?.hidden ?? false),
          );

          return { ...rest, children: filteredChildren };
        }),
    );

    // 设置当前激活路由路径
    const setActiveRoute = () => {
      activePath.value = ctx.root.$route.meta?.activePath ?? ctx.root.$route.path;
      activeParentPath.value = ctx.root.$route.meta?.parentPath ?? ctx.root.$route.path;
    };

    onActivated(() => {
      init();
    });

    onBeforeMount(() => {
      init();

      setActiveRoute();
    });

    onUpdated(() => {
      setActiveRoute();
    });

    const menuIsMini = inject<Ref<boolean>>('menuIsMini') ?? ref(false);

    // 默认展开菜单
    const openeds = ref<string[]>([]);

    // 展开菜单的值
    const computedOpeneds = computed(() => (menuIsMini.value ? defOpeneds : openeds.value));

    // 菜单写入本地存储
    const writeMenuOpenedLocal = () => {
      localStorage.setItem('menu_openeds', JSON.stringify(unique(openeds.value)));
    };

    // 菜单展开回调
    const onMenuOpen = (path: string) => {
      openeds.value = [path];
      writeMenuOpenedLocal();
    };

    // 菜单收起回调
    const onMenuClose = (path: string) => {
      openeds.value = openeds.value.filter(el => el !== path);
      writeMenuOpenedLocal();
    };

    // 初始化菜单展开状态
    (() => {
      const openedsInLocal = localStorage.getItem('menu_openeds') ?? '[]';

      const openedsFromLocal: string[] = JSON.parse(openedsInLocal);

      openeds.value =
        openedsInLocal !== null
          ? openedsFromLocal.length > 0
            ? [openedsFromLocal[0]]
            : []
          : defOpeneds;
    })();

    /** 计算路由可见权限 */
    const getRouteAuth = ({ right, noauth }: { right: number | number[]; noauth?: boolean }) =>
      noauth ??
      (Array.isArray(right) ? right : [right])
        .map(el => isRouterAuthDisabled || HasPermission(el))
        .reduce((acc, cur) => acc || cur, false);
    // 收缩侧边栏
    const handleCollapse = () => {
      menuIsMini.value = !menuIsMini.value;
      localStorage.setItem('menu_mini', menuIsMini.value ? '1' : '0');
    };
    return {
      openeds,
      userRoles,
      activePath,
      activeParentPath,
      menus,
      menuIsMini,
      computedOpeneds,
      onMenuOpen,
      onMenuClose,
      getRouteAuth,
      handleCollapse,
    };
  },
});
