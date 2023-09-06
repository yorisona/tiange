import { defineComponent, inject, ref } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { useParamsRouteTabs } from '@/use/tab';
import baseInfo from './baseinfo/index.vue';
import otherInfo from './otherInfo/index.vue';
import cooperationInfo from './cooperationInfo';
import { useRouter } from '@/use/vue-router';
import supplierService from '@/services/supplier';
import { IAnchorInfo } from '@/types/tiange/supplier';
import { is_creator_maintainer, supplier_permission_info } from '../common/utils/utils';
import { Tab } from '@/types/components/tabs';

export default defineComponent({
  components: {
    baseInfo,
    otherInfo,
    cooperationInfo,
  },
  setup() {
    const router = useRouter();
    const verifyStatus = ref<any>(null);
    const verify = ref<any>(null);
    const hasEdit = router.currentRoute.params.id !== undefined;
    const anchor_id = router.currentRoute.params.id;
    verifyStatus.value = router.currentRoute.params.verify_status + '';
    verify.value = router.currentRoute.params.verify;
    const anchorInfo = ref<IAnchorInfo | undefined>(undefined);

    const isCreatorMaintainer = is_creator_maintainer(anchorInfo);
    const resetTabs = () => {
      return useParamsRouteTabs(
        [
          (verifyStatus.value !== '2' || verify.value === 'success') &&
            (isCreatorMaintainer.value || !hasEdit) &&
            supplier_permission_info.supplier_anchor_detail && {
              label: '基本信息',
              value: 'baseInfo',
            },
          (verifyStatus.value !== '2' || verify.value === 'success') &&
            isCreatorMaintainer.value &&
            supplier_permission_info.supplier_anchor_detail && {
              label: '结算信息',
              value: 'otherInfo',
            },
          /*  verifyStatus.value === '2' &&
            verify.value !== 'success' &&
            supplier_permission_info.supplier_anchor_detail && {
              label: '合作信息',
              value: 'cooperationInfo',
            },*/
        ].filter(Boolean) as any,
      );
    };

    const tabs = ref<any>(resetTabs());

    const reload = () => {
      if (!hasEdit) {
        return;
      }
      supplierService.GetAnchorDetail(anchor_id).then((res: any) => {
        anchorInfo.value = res;
        tabs.value = resetTabs();
      });
    };

    reload();
    const routes = [
      // { title: '供应商管理' },
      { title: '主播管理', name: RouterNameSupplier.player },
      { title: hasEdit ? '修改主播' : '新增主播' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const onTabChange = async (sub_tab: Tab<string>) => {
      await tabs.value.onTabChange(sub_tab);
      showBackTitleHandle(routes);
    };
    return {
      hasEdit,
      tabs,
      onTabChange,
    };
  },
  render() {
    return (
      <div class="player-detail-page flex-auto">
        {this.hasEdit && (
          <div>
            <tg-tabs
              class="edit-tab-box"
              tabs={this.tabs.tabs}
              v-model={this.tabs.checkedTab}
              onChange={this.onTabChange}
            />
          </div>
        )}
        {!this.hasEdit && (
          <div class="tabs-add">
            <div class="active">基本信息</div>
            <div class="disabled">结算信息</div>
            <div class="disabled">合作信息 </div>
          </div>
        )}
        <div class="page-content-container">
          <this.tabs.checkedTab />
        </div>
      </div>
    );
  },
});
