/**
 * 客户管理 - 客户列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 13:27:15
 */
import { computed, defineComponent } from '@vue/composition-api';
import { useRefTabs } from '@/use/tab';
// 原本的客户列表 => 改名店铺列表
// 尽量不大改不迁移
import shop from '@/views/customer/index.vue';
// 新增的公司列表
import company from './company/list.vue';
import { useCompanyRight } from './company/useRight';
import { Tab } from '@/types/components/tabs';
import { RouterNameCustomer } from '@/const/router';

export default defineComponent({
  name: 'TgCustomerList',
  components: {
    shop,
    company,
  },
  setup(props, ctx) {
    const { hasRightViewCompany } = useCompanyRight(ctx);

    const { checkedTab, tabs } = useRefTabs(
      computed(() => [
        {
          label: '店铺管理',
          value: 'shop',
        },
        ...(hasRightViewCompany.value
          ? [
              {
                label: '公司管理',
                value: 'company',
              },
            ]
          : []),
      ]),
      ctx.root.$route.params.tab ?? 'shop',
    );

    const onTabChange = (tab: Tab) => {
      const option =
        tab.value === 'company'
          ? {
              name: RouterNameCustomer.listTab,
              params: {
                tab: 'company',
              },
            }
          : { name: RouterNameCustomer.list };
      ctx.root.$router.replace(option);
    };

    return {
      tabs,
      checkedTab,
      onTabChange,
    };
  },
});
