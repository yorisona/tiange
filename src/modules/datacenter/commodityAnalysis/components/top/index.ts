import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  Ref,
  ref,
  watch,
} from '@vue/composition-api';
import { useRefTabs } from '@/use/tab';
import { GetDouyinItemReport } from '@/services/datacenter';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { wait } from '@/utils/func';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
const { formatPriceFormYuan } = formatPriceForm;

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    catId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const loading = ref(false);
    const activeIndex = ref<string>('gmv_desc');
    const defaultTab = ref<string>('gmv_desc');
    const checkedTab = ref<string>('gmv_desc');
    const list = ref([]);
    const { business_type } = useProjectBaseInfo();
    const getTop = async () => {
      const payload = {
        ...searchParams.value,
        page_num: 1,
        num: 10,
        tiange_cat_id: props.catId,
        sort: activeIndex.value,
      };
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetDouyinItemReport(payload, business_type.value),
      );
      loading.value = false;
      if (response.success) {
        list.value = response.data.items;
      } else {
        list.value = [];
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    onBeforeMount(() => {
      if (props.visible) {
        getTop();
      }
    });

    watch(
      () => props.visible,
      val => {
        if (val) {
          checkedTab.value = 'gmv_desc';
          activeIndex.value = 'gmv_desc';
          getTop();
        }
      },
    );

    const tabs = useRefTabs(
      computed(() => {
        const tabList = [
          {
            label: '销售额top10',
            value: 'gmv_desc',
          },
          {
            label: '点击率top10',
            value: 'click_rate_desc',
          },
          {
            label: '转化率top10',
            value: 'pay_rate_desc',
          },
        ];
        return tabList;
      }),
      defaultTab,
    );
    const onTabChange = (item: { label: string; value: string }) => {
      activeIndex.value = item.value;
      getTop();
    };

    return {
      activeIndex,
      ...tabs,
      onTabChange,
      list,
      formatPriceFormYuan,
      numberFormat,
      checkedTab,
      loading,
    };
  },
});
