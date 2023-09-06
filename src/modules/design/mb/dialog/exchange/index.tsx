import { defineComponent, reactive, ref, computed } from '@vue/composition-api';
import {
  Create_Integral_Goods_Exchange_Record,
  Query_Listed_Integral_Goods,
} from '@/services/integral';
import { ElForm } from 'element-ui/types/form';
import inputLimit from '@/utils/inputLimit';
import { useRequest } from '@gm/hooks/ahooks';
import { Loading, Message } from 'element-ui';
import { Confirm } from '@/use/asyncConfirm';
type GoodInfo = TG.HttpListResultType<typeof Query_Listed_Integral_Goods>;
export default defineComponent({
  setup(props, ctx) {
    const info = ref<GoodInfo>({
      images: [],
    } as any);
    const reqSave = useRequest(Create_Integral_Goods_Exchange_Record, { manual: true });

    const show = (value: GoodInfo) => {
      info.value = value;
    };
    const formData = reactive({
      exchange_num: 1,
    });
    const formRef = ref<ElForm>();
    const onSaveBtnClick = () => {
      formRef.value?.validate(err => {
        if (!err) return;
        const service = Loading.service({ background: 'rgba(0,0,0,0.1)' });
        Promise.resolve(Confirm('确定兑换吗?'))
          .then(() => {
            return reqSave.runAsync({
              exchange_num: formData.exchange_num,
              integral_goods_id: info.value.id,
            });
          })
          .then(() => {
            Message.success('兑换成功');
            ctx.emit('submit');
            ctx.emit('close');
          })
          .finally(() => {
            service.close();
          });
      });
    };
    const consume = computed(() => {
      if (info.value.cost_m === undefined) return;
      const result = Number(formData.exchange_num) * info.value.cost_m;
      return `${result}M`;
    });
    return {
      show,
      info,
      formRef,
      formData,
      onSaveBtnClick,
      consume,
    };
  },
  render() {
    const { info, formData } = this;
    return (
      <div class="exchangeGoods">
        <el-form
          ref="formRef"
          size="mini"
          label-width="100px"
          attrs={{ model: this.formData }}
          class="m-currency-edit-goods-dialog-content"
        >
          <div>
            <tg-image class="good-image" src={info.images[0]} />
          </div>
          <div class="good-info">
            <div class="good-name">{info.name}</div>
            <div class="good-desc">{info.comment}</div>
            <div class="good-prize">
              <tg-icon class="ico-Mbi" name="ico-Mbi" />
              {info.cost_m}
            </div>
          </div>

          <el-form-item
            prop="exchange_num"
            label="兑换数量："
            rules={{ required: true, message: '请输入兑换数量', trigger: 'blur' }}
          >
            <el-input
              v-model={formData.exchange_num}
              maxLength={5}
              onInput={(val: string) => {
                formData.exchange_num = inputLimit.Interger(val) as any;
              }}
            />
          </el-form-item>
          <el-form-item label="消耗M币：" class="noline">
            {this.consume}
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
