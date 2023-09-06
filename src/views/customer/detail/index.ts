/**
 * 客户管理 - 店铺管理 - 新增/编辑(抽屉)
 * @author  huci <huci@goumee.com>
 * @since   2021-09-26 15:35:49
 */
// import type { PropType } from '@vue/composition-api';
import { defineComponent, PropType, ref, watch } from '@vue/composition-api';
import { CustomerShop } from '@/types/tiange/customer';
import { BusinessTypeMap } from '@/types/tiange/common';
import { companyTypeList } from '@/utils/format';
import { areaStr as filterAreaStr } from '@/utils/filter';
import { shopTypeFormat } from '@/utils/format';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<CustomerShop>,
    },
  },
  setup(props, ctx) {
    const shopFormModalTitle = '店铺详情';
    const shopDrawerVisible = ref(false);

    /** 切换是否可见 */
    const changeVisible = (visible = false) => {
      shopDrawerVisible.value = visible;
    };
    const openDrawer = () => {
      changeVisible(true);
    };
    const closeDrawer = () => {
      changeVisible();
    };
    const rowDetail = props.data;

    watch(
      () => shopDrawerVisible.value,
      next => {
        next;
      },
    );

    return {
      shopDrawerVisible,
      closeDrawer,
      openDrawer,
      shopFormModalTitle,
      rowDetail,
      filterAreaStr,
      shopTypeFormat,
      BusinessTypeMap,
      companyTypeList,
    };
  },
});
