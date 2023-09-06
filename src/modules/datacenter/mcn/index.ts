/*
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: 表格
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 10:38:45
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.ts
 */
import { defineComponent, ref, computed } from '@vue/composition-api';
import RelatedProject from '@/modules/datacenter/components/relatedProject/index.vue';
import { useRefTabs } from '@/use/tab';
import DouYin from './douyin/index.vue';
import DouYinSession from './douyin/session.vue';
import TaoBao from './taobao/index.vue';

export default defineComponent({
  components: {
    RelatedProject,
    DouYin,
    DouYinSession,
    TaoBao,
  },
  setup(_, ctx) {
    const activetabIndex = ref<string>('抖音日报');
    const defaultTab = ref<string>('DouYin');
    const tabs = useRefTabs(
      computed(() => {
        const tabList = [
          {
            label: '抖音日报',
            value: 'DouYin',
          },
        ];
        tabList.push({
          label: '抖音月报',
          value: 'DouYinSession',
        });
        tabList.push({
          label: '淘宝日报',
          value: 'TaoBao',
        });
        return tabList;
      }),
      defaultTab,
    );

    const onTabChange = (item: { label: string; value: string }) => {
      activetabIndex.value = item.label;
    };
    return {
      ...tabs,
      activetabIndex,
      onTabChange,
    };
  },
});
