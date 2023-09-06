/**
 * 店铺代播 - 项目管理 - 跳转详情逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 14:47:38
 */
import { SetupContext } from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';
import { props2RouteParams } from '@/router/func';
import { ObjectFilterEmpty } from '@/utils/func';

export interface RouterDetailProps {
  id?: number;
  tab?: string;
  liveType?: string;
}

interface RouterJumpProps extends RouterDetailProps {
  id?: number;
  tab?: string;
  query?: Record<string, any>;
  liveType?: string;
}

export const useJump = (props: RouterDetailProps, ctx: SetupContext) => {
  const getNewRouterConfig = (params: RouterJumpProps, type = 'live') => {
    const { query, ...restParams } = params;
    const newParams = props2RouteParams({
      ...props,
      ...restParams,
    });

    // TODO: lj重定向
    const { tab, liveType, ...rest } = newParams;
    if (type === 'localLife' || type === 'local_life') {
      return {
        name: RouterNameProjectManage.localLife.detail.info,
        query: query,
        params:
          tab === 'tracking'
            ? ObjectFilterEmpty({ tab, ...rest })
            : ObjectFilterEmpty({ tab, liveType, ...rest }),
      };
    } else if (liveType === 'SupplyChainDetail' || type === 'SupplyChain') {
      return {
        name: RouterNameProjectManage.supplyChain.detail,
        query: query,
        params:
          tab === 'tracking'
            ? ObjectFilterEmpty({ tab, ...rest })
            : ObjectFilterEmpty({ tab, liveType, ...rest }),
      };
    } else {
      return {
        name: RouterNameProjectManage.live.project.detail,
        query: query,
        params:
          tab === 'tracking'
            ? ObjectFilterEmpty({ tab, ...rest })
            : ObjectFilterEmpty({ tab, liveType, ...rest }),
      };
    }
  };
  /**
   * 接受参数并跳转
   * @author  Jerry <jerry.hz.china@gmail.com>
   * @since   2020-12-26 14:50:12
   */
  const jump = (params: RouterDetailProps, type = 'live') => {
    ctx.root.$router.push(getNewRouterConfig(params, type)).catch(_err => {
      // console.error(err);
    });
  };

  const replace = (params: RouterJumpProps, type = 'live') => {
    ctx.root.$router.replace(getNewRouterConfig(params, type)).catch(_err => {
      // console.error(err);
    });
  };

  // 返回上级菜单
  const backMap = {
    [RouterNameProjectManage.supplyChain.detail]: RouterNameProjectManage.supplyChain.list,
    calendar: RouterNameProjectManage.live.project.list,
  };
  const back = () => {
    return ctx.root.$route.params.liveType
      ? backMap[ctx.root.$route.params.liveType]
      : RouterNameProjectManage.supplyChain.list;
  };

  return { jump, replace, back };
};
