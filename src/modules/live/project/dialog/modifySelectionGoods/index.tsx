import { defineComponent, ref } from '@vue/composition-api';
import InputLimit from '@/utils/inputLimit';
import { useRequest } from '@gm/hooks/ahooks';
import { deepClone } from '@/utils/tools';
import { FD } from '@/utils/formatData';
import { modify_store_product } from '@/services/live';
import { Message } from 'element-ui';

// interface FormData {
//   price?: number | string;
//   up_sort?: number | string;
//   sale_point?: string;
// }
export default defineComponent({
  setup(props, ctx) {
    const initFormData = () => ({
      amount: undefined,
      sell_point: undefined,
      listed_index: undefined,
    });
    // const reqDisplay = useRequest(GetBrandList);
    const reqSave = useRequest(modify_store_product, { manual: true });
    const formData = ref<any>(initFormData());
    const methods = {
      show(data: any) {
        if (data) {
          formData.value = deepClone(data);
        }
      },
      async onSaveBtnClick() {
        const res = await reqSave.runAsync({
          amount: formData.value.amount, // FD.isEmpty(formData.value?.amount) ? undefined : +formData.value.amount * 100,
          id: formData.value?.id,
          sell_point: formData.value?.sell_point,
          listed_index: formData.value?.listed_index,
        });
        if (res.data.success) {
          Message.success(res.data.message);
          ctx.emit('close');
          ctx.emit('submit');
        } else {
          Message.error(res.data.message);
        }
      },
    };
    return { formData, reqSave, ...methods };
  },
  render() {
    const { formData } = this;
    return (
      <div class="tg-modify-selection-goods-page-container">
        <div class="goods-info-container">
          <div>
            <el-image src={formData?.product_pic?.[0]}></el-image>
          </div>
          <div class="goods-info">
            <div class="name line-clamp-1">{FD.formatEmpty(formData?.product_name)}</div>
            <div class="detail-info">
              <div>款号：{FD.formatEmpty(formData?.sn)}</div>
              <div>品类：{FD.formatEmpty(formData?.first_name)}</div>
              <div>吊牌价：{FD.formatPriceFormYuan(formData?.reference_price, 2, true)}</div>
              <div>昨日直播价：{FD.formatPriceFormYuan(formData?.discoount_price, 2, true)}</div>
              <div>当前库存：{FD.formatEmpty(formData?.stock_num)}</div>
            </div>
          </div>
        </div>
        <el-form props={{ model: formData }} label-width="62px" size="mini">
          <el-form-item label="直播售价：">
            <el-input
              v-model={formData.amount}
              placeholder="请输入直播售价"
              style="width: 216px"
              on-input={(value: string) => {
                if (formData.amount) {
                  formData.amount = InputLimit.EightIntergerAndDecimals(value);
                }
              }}
            >
              <template slot="suffix">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="上架顺序：">
            <el-input
              v-model={formData.listed_index}
              placeholder="请输入上架顺序"
              maxlength={8}
              style="width: 216px"
              on-input={(value: string) => {
                if (formData.listed_index) {
                  formData.listed_index = InputLimit.Interger(value);
                }
              }}
            />
          </el-form-item>
          <el-form-item label="卖点：">
            <el-input
              maxlength={15}
              type="textarea"
              v-model={formData.sell_point}
              placeholder="请输入卖点"
            />
          </el-form-item>
        </el-form>
        <tg-mask-loading visible={this.reqSave.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
