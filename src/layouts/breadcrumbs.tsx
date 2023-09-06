/**
 * 面包屑(带一个可自定义内容的插槽)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 15:51:19
 */
import { defineComponent, PropType } from '@vue/composition-api';
import { BreadcrumbsRoutes } from '@/types/components/breadcrumbs';
// import TgIcon from '@/components/IconFont/tg.vue';
import { VNode } from 'vue';

export default defineComponent({
  name: 'TgBreadcrumbs',
  props: {
    routes: {
      type: Array as PropType<BreadcrumbsRoutes[]>,
      required: true,
    },
    showBackLeft: {
      type: Boolean,
      default: false,
    },
  },
  setup(prop, ctx) {
    const backClick = () => {
      const pathArr: any = [...(prop.routes || [])];
      pathArr.pop();
      if (pathArr.length > 0) {
        const backRoute = pathArr[pathArr.length - 1];
        ctx.root.$router.push({
          name: backRoute.name,
          path: backRoute.path || '/',
          params: backRoute.params || {},
          query: backRoute.query || {},
        });
      }
    };
    return {
      backClick,
    };
  },
  render() {
    const breadcrumbsRoutes: VNode[] = [];
    if (this.routes) {
      this.routes.forEach((route, index) => {
        const { title, ..._props } = route;
        if (index < this.routes.length - 1) {
          const props = {
            props: {
              to: _props,
            },
          };
          if (_props.name === undefined && _props.path === undefined) {
            breadcrumbsRoutes.push(<a class="breakcrumb-no-link">{title}</a>);
          } else {
            breadcrumbsRoutes.push(
              <router-link class="breadcrumb-link" {...props}>
                {route.title}
              </router-link>,
            );
          }
          // breadcrumbsRoutes.push(<TgIcon name="ico-arrow-right" />);
          breadcrumbsRoutes.push(<span> / </span>);
        } else {
          breadcrumbsRoutes.push(<a class="breakcrumb-no-link">{route.title}</a>);
        }
      });
    }
    return (
      <div class="tg-breadcrumbs pdl-16">
        {this.showBackLeft && <tg-icon on-click={this.backClick} name="ico-arrow-left" />}
        {breadcrumbsRoutes}
        <div class="tg-breadcrumbs-extra">{this.$slots.default}</div>
      </div>
    );
  },
});
