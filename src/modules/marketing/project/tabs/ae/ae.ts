/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-05-04 09:37:21
 */
/**
 * 营销业务 - 项目详情 - tab 跟单表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-08 09:56:32
 */
import { defineComponent, watch, computed, ref } from '@vue/composition-api';
import useDrawer from './drawer';
import useList from './list';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';

export default defineComponent({
  name: 'TgMarketingProjectTabAE',
  setup(props, ctx) {
    const { checkedRowIndex, clearCheckedRowIndex, ...listLogic } = useList(ctx);
    const { submitSuccess, ...drawerLogic } = useDrawer(ctx);

    watch(
      () => submitSuccess.value,
      (next, prev) => {
        if (next !== prev) {
          listLogic.reload();
          listLogic.getAmount();
        }
      },
    );

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
      const canViewList = HasPermission(RIGHT_CODE.marketing_project_documentary_view);

      const canChange = HasPermission(RIGHT_CODE.marketing_project_documentary_change);

      return { canChange, canViewList };
    });

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(285);
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
      Permission,
      ...listLogic,
      ...drawerLogic,
      ...tableHeightLogic,
    };
  },
});
