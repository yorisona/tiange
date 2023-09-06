import { computed, ref } from '@vue/composition-api';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';

export default () => {
  // 自适应表格高度部分
  const buttonLineHeight = 32;
  const paginationLineHeight = 34;
  const rectPadding = 36;
  const otherHeight = 31;
  const topCardHeight = ref(0);
  const onTopCardRectUpdate = (rect: DOMRect) => {
    topCardHeight.value = rect.height;
  };
  const tableHeightLogic = useAutoTableHeightInCard({
    compensation: computed(
      () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
    ),
    fixedBlockHeightRefs: [topCardHeight, 15],
    tableMinHeight: 100,
  });
  return { tableHeightLogic, onTopCardRectUpdate };
};
