import { defineComponent, ref } from '@vue/composition-api';
import { useRequest } from '@gm/hooks/ahooks';
import { GetBrandList } from '@/services/brand';
import shopItem from '@/modules/live/project/tabs/liveTool/shopGoodsList/shopItem.vue';
import { submit_smart_select_product } from '@/services/live';
import { Message } from 'element-ui';

export default defineComponent({
  components: {
    shopItem,
  },
  setup(props, ctx) {
    const reqDisplay = useRequest(GetBrandList);
    const reqSave = useRequest(submit_smart_select_product, { manual: true });
    const formData = ref<any>({
      project_id: undefined,
      add_type: undefined,
      datas: [],
    });
    const methods = {
      show(data: { project_id: string; add_type: E.project.SmartSelectionLibAddWay; datas: any }) {
        formData.value = data;
      },
      async onSaveBtnClick() {
        const { datas, ...rest } = formData.value;
        const res = await reqSave.runAsync({
          ...rest,
          datas: datas.map((el: any) => ({
            amount: el.amount,
            product_id: el.product_id,
            sell_point: el.sell_point,
          })),
        });
        if (res.data.success) {
          ctx.emit('close');
          ctx.emit('submit');
          Message.success(res.data.message);
        }
      },
    };
    return { formData, reqDisplay, reqSave, ...methods };
  },
  render() {
    return (
      <div class="tg-selection-goods-preview-page-container">
        <div class="header">预览效果</div>
        <div class="list">
          {this.formData.datas?.map((el: any) => (
            <shopItem class="goods-item" readonly showRank data={el} key={el.product_id}></shopItem>
          ))}
        </div>
        <tg-mask-loading visible={this.reqSave.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
