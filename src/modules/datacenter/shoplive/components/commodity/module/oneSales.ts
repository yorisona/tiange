/*
 * @Author       : yunie
 * @Date         : 2022-07-23 14:22:19
 * @LastEditTime : 2022-07-26 16:03:27
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\oneSales.ts
 * @Description  :
 */
import { defineComponent, ref, Ref, inject, watch } from '@vue/composition-api';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import switchs from './switch.vue';
import { GetProjectItemTopRelation } from '@/services/datacenter/shoplive';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { get_folded_text } from '@/utils/string';
import emptyGoods from '@/assets/img/goods-empty.png';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  components: { switchs },
  setup(props, ctx) {
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const loading = ref(false);
    const list = ref<any[]>([]);
    const color = ['#FF4D79', '#FF7F00', '#FFB600'];
    const itemRefs: any[] = [];
    const setItemRef = (el: any) => {
      if (el) {
        itemRefs.push(el);
      }
    };
    const { business_type } = useProjectBaseInfo();
    const getData = () => {
      loading.value = true;
      GetProjectItemTopRelation(
        {
          is_from_project: searchParams.value.is_from_project,
          start_date: searchParams.value.start_date,
          end_date: searchParams.value.end_date,
          project_id: searchParams.value.project_id,
        },
        business_type.value,
      ).then(res => {
        loading.value = false;
        if (res.data.data) list.value = res.data.data;
      });
    };
    const toShopDetail = (id: string) => {
      window.open('https://haohuo.jinritemai.com/views/product/item2?id=' + id);
    };
    const next = (v: string) => {
      //@ts-ignore
      ctx.refs[v][0].next();
    };
    const pre = (v: string) => {
      //@ts-ignore
      ctx.refs[v][0].pre();
    };
    watch(
      () => searchParams.value,
      async data => {
        if (data === undefined) return;
        await getData();
      },
      { deep: true, immediate: true },
    );
    return {
      emptyGoods,
      next,
      setItemRef,
      pre,
      loading,
      list,
      color,
      numberMoneyFormat,
      get_folded_text,
      toShopDetail,
    };
  },
});
