import { RouterFixedAssets } from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { createRoute } from '@/use/vue-router';

export const fixedAssets = createRoute(
  <route
    path="/fixedAssets"
    title={'固定资产'}
    icon={'ico-menu-gudingzichan'}
    menu={true}
    right={[
      RIGHT_CODE.fixedAssetManage_view,
      RIGHT_CODE.fixedAssetUse,
      RIGHT_CODE.fixedAssetTypeSetting_view,
    ]}
    component={RouterViewEmptyPage}
  >
    <route
      title="我的资产"
      path="/fixedAssets/workbench"
      name={RouterFixedAssets.workbench.myAssets}
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.workbench" */ '../modules/fixedAssets/workbench/myAssets.vue'
        )
      }
      activePath="/workbench"
      parentPath="/workbench"
    />
    <route
      title="资产管理"
      path="/fixedAssets/management"
      name={RouterFixedAssets.fixedAssetsManagement}
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.management" */ '../modules/fixedAssets/management/index.vue'
        )
      }
      activePath="/fixedAssets/management"
      parentPath="/fixedAssets"
      menu
      right={[RIGHT_CODE.fixedAssetManage_view]}
    />
    <route
      title="资产使用"
      path="/fixedAssets/assetsUse"
      name={RouterFixedAssets.fixedAssetsUse}
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.assetsUse" */ '../modules/fixedAssets/assetUse/index.vue'
        )
      }
      activePath="/fixedAssets/assetsUse"
      parentPath="/fixedAssets"
      menu
      keep={true}
      right={[RIGHT_CODE.fixedAssetUse]}
    />
    <route
      title="资产管理设置"
      path="/fixedAssets/setup"
      name={RouterFixedAssets.fixedAssetsManagementSetting}
      component={() =>
        import(/* webpackChunkName: "fixedAssets.setup" */ '../modules/fixedAssets/setup/index.vue')
      }
      activePath="/fixedAssets/setup"
      parentPath="/fixedAssets"
      menu
      keep={true}
      right={[RIGHT_CODE.fixedAssetTypeSetting_view]}
    />
    <route
      title="资产费用"
      path="/fixedAssets/fixedAssetsCost"
      name={RouterFixedAssets.fixedAssetsCost}
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.fixedAssetsCost" */ '../modules/fixedAssets/fixedAssetsCost/index.vue'
        )
      }
      activePath="/fixedAssets/fixedAssetsCost"
      parentPath="/fixedAssets"
      menu
      // keep={true}
      right={[RIGHT_CODE.fixedAssetCost_view]}
    />
    <route
      title="费用明细"
      name={RouterFixedAssets.fixedAssetsCostDetail}
      path="/fixedAssets/fixedAssetsCost/detail/:id"
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.fixedAssetsCost.detail" */ '../modules/fixedAssets/fixedAssetsCost/detail/index.vue'
        )
      }
      parentPath="/fixedAssets/fixedAssetsCost"
      activePath="/fixedAssets/fixedAssetsCost"
      meta={{ hidden: true }}
    />
    <route
      title="资产盘点"
      path="/fixedAssets/fixedAssetsInventory"
      name={RouterFixedAssets.fixedAssetsInventory}
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.fixedAssetsInventory" */ '../modules/fixedAssets/fixedAssetsInventory/index.vue'
        )
      }
      activePath="/fixedAssets/fixedAssetsInventory"
      parentPath="/fixedAssets"
      menu
      // keep={true}
      right={[RIGHT_CODE.fixedAssetInventory_view]}
    />
    <route
      title="盘点详情"
      name={RouterFixedAssets.fixedAssetsInventoryDetail}
      path="/fixedAssets/fixedAssetsInventory/detail/:id"
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.fixedAssetsInventory.detail" */ '../modules/fixedAssets/fixedAssetsInventory/detail/index.vue'
        )
      }
      parentPath="/fixedAssets/fixedAssetsInventory"
      activePath="/fixedAssets/fixedAssetsInventory"
      meta={{ hidden: true }}
    />
    <route
      title="资产统计"
      path="/fixedAssets/fixedAssetsStatistics"
      name={RouterFixedAssets.fixedAssetsStatistics}
      component={() =>
        import(
          /* webpackChunkName: "fixedAssets.fixedAssetsStatistics" */ '../modules/fixedAssets/fixedAssetsStatistics/index.vue'
        )
      }
      activePath="/fixedAssets/fixedAssetsStatistics"
      parentPath="/fixedAssets"
      menu
      // keep={true}
      right={[RIGHT_CODE.fixedAssetStatistics_view]}
    />
  </route>,
);
