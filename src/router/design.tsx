import { RouterDataCenter, RouterNameDesign, RouterNameMB } from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { createRoute } from '@/use/vue-router';

export const design = createRoute(
  <route
    path="/design"
    title={'企业中台'}
    icon={'ico-menu-qiyezhongtai'}
    menu={true}
    right={[
      RIGHT_CODE.image_design_view,
      RIGHT_CODE.view_shop_live_ctr,
      RIGHT_CODE.design_order_view,
      RIGHT_CODE.design_order_setting_type_view,
      RIGHT_CODE.live_screen_monitoring_view,
    ]}
    component={RouterViewEmptyPage}
  >
    <route
      title="形象设计预约"
      path="/design/workbench"
      name={RouterNameDesign.workbench.list}
      component={() =>
        import(/* webpackChunkName: "design.workbench" */ '../modules/design/workbench/index.vue')
      }
      activePath="/workbench"
      parentPath="/workbench"
      meta={{ hidden: true }}
    />
    <route
      title="CTR数据分析"
      path="/design/ctr"
      component={() =>
        import(/* webpackChunkName: "design.ctr" */ '../modules/datacenter/ctr/index.vue')
      }
      name={RouterDataCenter.ctrDataAnalysis}
      right={[RIGHT_CODE.view_shop_live_ctr]}
      menu
      parentPath="/design"
      activePath="/design/ctr"
    />
    <route
      title="直播画面监控"
      path="/design/ctr/liveScreenMonitoring"
      component={() =>
        import(
          /* webpackChunkName: "design.ctr.liveScreenMonitoring" */ '../modules/datacenter/ctr/liveScreenMonitoring/index.vue'
        )
      }
      name={RouterNameDesign.ctr.liveScreenMonitoring}
      right={[RIGHT_CODE.live_screen_monitoring_view]}
      menu
      parentPath="/design"
      activePath="/design/ctr/liveScreenMonitoring"
    />
    <route
      title="项目明细"
      name={RouterDataCenter.ctrDataAnalysisDetail}
      path="/design/ctr/project/:id"
      component={() =>
        import(/* webpackChunkName: "design.ctr.project" */ '../modules/datacenter/ctr/detail.vue')
      }
      parentPath="/design"
      activePath="/design/ctr"
      meta={{ hidden: true }}
    />
    <route
      path="/design/image"
      title="形象设计"
      menu
      right={[RIGHT_CODE.image_design_view]}
      component={() => import('../modules/design/image/index.vue')}
    >
      <route
        title="形象设计"
        name={RouterNameDesign.image.detail}
        path="/design/image/detail"
        component={() =>
          import(
            /* webpackChunkName: "design.image.detail" */ '../modules/design/image/detail/index.vue'
          )
        }
        parentPath="/design"
        activePath="/design/image"
      />
      <route
        title="形象设计"
        path="/design/image/statistics"
        name={RouterNameDesign.image.statistics}
        component={() =>
          import(
            /* webpackChunkName: "design.image.statistics" */ '../modules/design/image/statistics/index.vue'
          )
        }
        parentPath="/design"
        activePath="/design/image"
      />
      <redirect redirect="/design/image/detail" path="/design/image" />
    </route>
    <route
      title="视觉设计"
      path="/design/order"
      name={RouterNameDesign.design_order_list}
      menu
      keep={true}
      right={[RIGHT_CODE.design_order_view]}
      component={() =>
        import(/* webpackChunkName: "design.order" */ '../modules/design/order/index.vue')
      }
    />
    <route
      title="视觉设计统计"
      path="/design/statistics"
      name={RouterNameDesign.design_order_statistics}
      menu
      keep={true}
      right={[RIGHT_CODE.design_order_statistics]}
      component={() =>
        import(/* webpackChunkName: "design.statistics" */ '../modules/design/statistics/index.vue')
      }
    />
    {/* 部门 */}
    <route
      title="设计统计"
      path="/design/statistics/detail"
      name={RouterNameDesign.design_order_statistics_detail}
      component={() =>
        import(
          /* webpackChunkName: "design.statistics.detail" */ '../modules/design/statistics/detail.vue'
        )
      }
      parentPath="/design"
      activePath="/design/statistics"
      meta={{ hidden: true }}
    />
    {/* 个人 */}
    <route
      title="设计统计"
      path="/design/statistics/detail_personal"
      name={RouterNameDesign.design_order_statistics_detail_personal}
      component={() =>
        import(
          /* webpackChunkName: "design.statistics.detail_personal" */ '../modules/design/statistics/detail_personal.vue'
        )
      }
      parentPath="/design"
      activePath="/design/statistics"
      meta={{ hidden: true }}
    />
    <route
      title="视觉设计明细"
      path="/design/order/detail"
      name={RouterNameDesign.design_order_detail}
      component={() =>
        import(
          /* webpackChunkName: "design.order.detail" */ '../modules/design/order/workbench/detailIndex.vue'
        )
      }
      parentPath="/design"
      activePath="/design/order"
      meta={{ hidden: true }}
    />
    <route
      title="下单统计"
      path="/design/orderStatistics/workbench"
      name={RouterNameDesign.workbench.design_order_orderStatistics}
      component={() =>
        import(
          /* webpackChunkName: "design.orderStatistics.workbench" */ '../modules/design/order/workbench/orderStatistics/index.vue'
        )
      }
      activePath="/workbench"
      parentPath="/design/order/workbench"
      meta={{ hidden: true }}
    />
    <route
      title="视觉设计"
      path="/design/order/workbench"
      keep={false}
      name={RouterNameDesign.workbench.design_order_list}
      component={() =>
        import(
          /* webpackChunkName: "design.order.workbench" */ '../modules/design/order/workbench/index.vue'
        )
      }
      activePath="/workbench"
      parentPath="/workbench"
      meta={{ hidden: true }}
    />
    <route
      title="视觉设计明细"
      path="/design/order/workbench/detail"
      name={RouterNameDesign.workbench.design_order_detail}
      component={() =>
        import(
          /* webpackChunkName: "design.order.workbench.detail" */ '../modules/design/order/workbench/detailIndex.vue'
        )
      }
      parentPath="/workbench"
      activePath="/design/order/workbench"
      meta={{ hidden: true }}
    />
    <route
      title="设计统计"
      path="/design/order/workbench/statistics"
      name={RouterNameDesign.workbench.statistics}
      component={() =>
        import(
          /* webpackChunkName: "design.workbench.statistics" */ '../modules/design/order/workbench/statistics/index.vue'
        )
      }
      parentPath="/workbench"
      activePath="/design/order/workbench"
      meta={{ hidden: true }}
    />
    <route
      title="视觉设计设置"
      path="/design/order/setting"
      menu
      right={[RIGHT_CODE.design_order_setting]}
      component={() =>
        import(
          /* webpackChunkName: "design.order.setting" */ '../modules/design/order/setting/index.vue'
        )
      }
    />
    <route
      path="/design/mb/workbench"
      title="M币兑换"
      menu={false}
      component={() => import('../modules/design/mb/workbench/index.vue')}
    >
      <route
        name={RouterNameMB.workbench.mall}
        path="/design/mb/workbench/mall"
        title="M币兑换"
        component={() => import('@/modules/design/mb/workbench/mall/index.vue')}
        parentPath="/workbench"
        activePath="/design/mcurrency/exchangemall/mall"
      />
      <route
        name={RouterNameMB.workbench.my}
        path="/design/mb/workbench/my"
        title="我的兑换"
        component={() => import('@/modules/design/mb/workbench/my/index.vue')}
        parentPath="/workbench"
        activePath="/design/mcurrency/exchangemall/my"
      />
      <redirect redirect="/design/mb/workbench/mall/" path="/design/mb/workbench" />
    </route>
  </route>,
);
