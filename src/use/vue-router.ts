import router from '@/router';
import { h, defineComponent } from '@vue/composition-api';
import Router, { RouteConfig } from 'vue-router';

export const useRouter = (): Router => {
  const _router: any = new Proxy(
    {},
    {
      get(target, name: string) {
        return Reflect.get(router, name);
      },
    },
  );
  return _router;
};
const defaultEmpty = defineComponent({
  render() {
    return h('router-view');
  },
});

const transformVueNodeToRouterConfig = (node: JSX.Element): RouteConfig => {
  const attrs = node.data?.attrs ?? {};
  if (node.tag === 'redirect')
    return {
      redirect: attrs.redirect,
      name: attrs.name,
      path: attrs.path || '',
      meta: { right: [] },
    };
  if (attrs.path === undefined) throw new Error('一个路由必须要有路径');
  const config = {} as RouteConfig;
  config.path = attrs.path;
  // 获取设置meta中的便捷属性
  const {
    title,
    right,
    menu,
    icon,
    component,
    activePath,
    parentPath,
    keep,
    meta: _meta,
    params,
    ...rest
  } = attrs;
  const meta = {
    ..._meta,
  };
  if (title) meta.name = title;
  if (right) meta.right = right;
  if (menu !== undefined) meta.hidden = !menu;
  if (meta.right === undefined) meta.right = [];
  if (icon !== undefined) meta.icon = icon;
  if (activePath) meta.activePath = activePath;
  if (parentPath) meta.parentPath = parentPath;
  if (params) meta.params = params;
  if (keep) meta.isKeepLive = keep;
  config.meta = meta;
  Object.assign(config, rest);
  if (component !== undefined) (config as any).component = component;
  else (config as any).component = defaultEmpty;
  // RouterViewEmptyPage
  if (node.children) {
    config.children = node.children.map(transformVueNodeToRouterConfig);
  }

  return config;
};
export const createRoute = (...nodes: JSX.Element[]): RouteConfig[] => {
  return nodes.map(node => {
    const config = transformVueNodeToRouterConfig(node);
    return config;
  });
};
