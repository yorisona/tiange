/**
 * 营销业务 - 项目详情 - tab 业绩登记表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-08 09:57:43
 */
import { defineComponent, watch, computed, ref } from '@vue/composition-api';
import { gatherTypeOptions, gatherWayOptions } from '@/const/options';
import Upp from '@/components/Uploader/uploader';
import useDrawer from './drawer';
import useList from './achievement_receivable_list';
import InvoiceDetail from '@/modules/workbench/initiate/invoice/detail.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import firstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';

export default defineComponent({
  name: 'TgMarketingProjectTabAchievement',
  data() {
    return {
      gatherTypeOptions,
      gatherWayOptions,
    };
  },
  components: {
    Upp,
    InvoiceDetail,
    firstStep,
  },
  setup(props, ctx) {
    const { checkedRowIndex, clearCheckedRowIndex, ...listLogic } = useList(ctx);
    const { submitSuccess, ...drawerLogic } = useDrawer(ctx);
    const isHideReversed = ref(true);
    watch(
      () => submitSuccess.value,
      (next, prev) => {
        if (next !== prev) {
          reloadData();
        }
      },
    );
    const reloadData = () => {
      listLogic.reload(isHideReversed.value ? 1 : undefined);
    };

    watch(
      () => checkedRowIndex.value,
      next => {
        if (next === -1) {
          // 关闭
        } else {
          drawerLogic.fillForm(listLogic.data.value[next]);
          drawerLogic.openDrawer();
        }
      },
    );

    watch(
      () => drawerLogic.drawerVisible.value,
      next => {
        if (!next) {
          clearCheckedRowIndex();
        }
      },
    );

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.marketing_project_achievement_view);
      const canChange = HasPermission(RIGHT_CODE.marketing_project_achievement_change);

      return { canChange, canViewList };
    });

    // 自适应表格高度部分
    const buttonLineHeight = 0;
    const paginationLineHeight = 0;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(200);
    // const onTopCardRectUpdate = (rect: DOMRect) => {
    //   topCardHeight.value = rect.height;
    // };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    return {
      reloadData,
      isHideReversed,
      Permission,
      ...listLogic,
      ...drawerLogic,
      // onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
});
