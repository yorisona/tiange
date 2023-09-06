/*
 * @Author       : yunie
 * @Date         : 2022-07-15 15:18:12
 * @LastEditTime : 2022-07-26 16:31:54
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\index.tsx
 * @Description  :
 */
import { ref, defineComponent, watch, h, Ref, inject } from '@vue/composition-api';
import commodityAnalysisList from './module/commodityAnalysisList.vue';
import hotMoney from './module/hotMoney.vue';
import priceAnalysis from './module/priceAnalysis.vue';
import shopDetail from './module/shopDetail.vue';
import setSales from './module/setSales.vue';
import oneSales from './module/oneSales.vue';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
export default defineComponent({
  components: {
    commodityAnalysisList,
    hotMoney,
    priceAnalysis,
    shopDetail,
    setSales,
    oneSales,
  },
  setup(props, ctx) {
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const catId = ref();
    const catName = ref('合计');
    const isSecond = ref(true);
    const changeCatId = (id: any, cat_name: string, isSeconds: boolean) => {
      catId.value = id.value;
      catName.value = cat_name;
      isSecond.value = isSeconds;
    };
    const data = ref();
    watch(
      () => searchParams.value,
      async () => {
        catName.value = '合计';
        catId.value = undefined;
      },
      { deep: true },
    );
    return {
      changeCatId,
      data,
      catId,
      catName,
      isSecond,
    };
  },
  render() {
    return (
      <div>
        <div class="bor">
          <commodityAnalysisList on-changeCatId={this.changeCatId}></commodityAnalysisList>
          <hotMoney catId={this.catId} catName={this.catName} isSecond={this.isSecond}></hotMoney>
        </div>
        <div class="type-box">
          <h3 class="main-item-title">价格带分析</h3>
          <div style="display: flex; justify-content: space-between">
            <priceAnalysis visible={true} catId={this.catId} />
            <priceAnalysis visible={true} catId={this.catId} is_table={false} />
          </div>
        </div>
        <div class="type-box-noBor">
          <h3 class="main-item-title">成套销售排行</h3>
          <div>
            <set-sales></set-sales>
          </div>
        </div>
        <div class="type-box-noBor">
          <h3 class="main-item-title">单款连带排行</h3>
          <div>
            <one-sales></one-sales>
          </div>
        </div>
        <div class="type-box-noBor">
          <h3 class="main-item-title" style="margin-bottom:18px;">
            商品销售详情
          </h3>
          <shopDetail></shopDetail>
        </div>
      </div>
    );
  },
});
