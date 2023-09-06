/** @Author: 石斛 **/
import { defineComponent, onMounted, PropType, ref } from '@vue/composition-api';
import { getPositiveNumber } from '@/utils/string';

export default defineComponent({
  name: 'editTaobao',
  props: {
    close: {
      type: Function as PropType<any>,
      default: Function,
    },
    submit: {
      type: Function as PropType<any>,
      default: Function,
    },
    data: {
      type: Object,
      default: undefined,
    },
  },
  components: {},
  setup(props, ctx) {
    const formData = ref<any>({
      star_name: '',
      star_id: '',
      fans_number: '',
      star_mix_cost: '', // 混播成本价
      star_mix_price: '', // 混播刊例价
      mix_min_commission_percent: '', // 混播比例
      pure_min_commission_percent: '', // 纯佣金
      star_special_cost: '', // 专场成本价
      star_special_price: '', // 专场刊例价
      special_commission_min_percent: '', // 专场佣金比例
    });
    const starInfo: any = ref({});
    const formRules = ref({
      star_name: [{ required: true, message: '请输入淘宝账号', trigger: 'blur' }],
      star_id: [{ required: true, message: '请输入淘宝ID', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
      star_mix_cost: [{ required: true, message: '请输入混播成本价', trigger: 'blur' }],
      star_mix_price: [{ required: true, message: '请输入混播刊例价', trigger: 'blur' }],
      mix_min_commission_percent: [{ required: true, message: '请输入混播佣金', trigger: 'blur' }],
      pure_min_commission_percent: [{ required: true, message: '请输入纯佣金', trigger: 'blur' }],
    });
    const validate = async () => {
      try {
        await (ctx.refs.taobaoPlatform as unknown as { validate: () => void }).validate();
        return Promise.resolve(Object.assign(starInfo.value, formData.value));
      } catch (error) {
        return Promise.reject();
      }
    };
    const closeForm = () => {
      props.close('tb');
    };
    const submitForm = async () => {
      const result = await validate();
      if (result) {
        props.submit('tb', result);
      }
    };
    onMounted(() => {
      if (props.data) {
        starInfo.value = props.data;
        const {
          star_name,
          star_id,
          fans_number,
          star_special_cost,
          star_special_price,
          special_commission_min_percent,
          star_mix_cost,
          star_mix_price,
          mix_min_commission_percent,
          pure_min_commission_percent,
        } = props.data;
        formData.value = {
          star_name,
          star_id,
          fans_number,
          star_mix_cost,
          star_mix_price,
          mix_min_commission_percent,
          pure_min_commission_percent,
          star_special_cost,
          star_special_price,
          special_commission_min_percent,
        };
      }
    });
    const numberValidator = (val: string, key: string) => {
      formData.value[key] = getPositiveNumber(val);
    };
    return {
      numberValidator,
      formData,
      formRules,
      validate,
      props,
      closeForm,
      submitForm,
    };
  },
  render() {
    return (
      <div class="edit-platform-wrapper">
        <div class="info-title">
          <span class="info-title-left">淘宝平台</span>
          <div class="info-title-right">
            <tg-button size="mini" onClick={this.closeForm}>
              取消
            </tg-button>
            <tg-button size="mini" type="primary" onClick={this.submitForm}>
              保存
            </tg-button>
          </div>
        </div>
        <el-form
          attrs={{ model: this.formData }}
          rules={this.formRules}
          ref="taobaoPlatform"
          label-position="top"
          size="small"
          label-width={this.labelWidth}
        >
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="淘宝账号" prop="star_name">
                <el-input
                  v-model={this.formData.star_name}
                  size="small"
                  placeholder="请输入淘宝账号"
                  maxlength={30}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="淘宝ID" prop="star_id">
                <el-input
                  v-model={this.formData.star_id}
                  size="small"
                  placeholder="请输入淘宝ID"
                  maxlength={20}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="粉丝数" prop="fans_number">
                <el-input
                  v-model={this.formData.fans_number}
                  size="small"
                  placeholder="请输入粉丝数"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.numberValidator(val, 'fans_number');
                  }}
                >
                  <span slot="append">万</span>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="混播成本价" prop="star_mix_cost">
                <el-input
                  v-model={this.formData.star_mix_cost}
                  size="small"
                  placeholder="请输入混播成本价"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="混播刊例价" prop="star_mix_price">
                <el-input
                  v-model={this.formData.star_mix_price}
                  size="small"
                  placeholder="请输入混播刊例价"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="混播佣金" prop="mix_min_commission_percent">
                <el-input
                  v-model={this.formData.mix_min_commission_percent}
                  size="small"
                  placeholder="请输入混播佣金"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="纯佣金" prop="pure_min_commission_percent">
                <el-input
                  v-model={this.formData.pure_min_commission_percent}
                  size="small"
                  placeholder="请输入纯佣金"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="专场成本价" prop="star_special_cost">
                <el-input
                  v-model={this.formData.star_special_cost}
                  size="small"
                  placeholder="请输入专场成本价"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="专场刊例价" prop="star_special_price">
                <el-input
                  v-model={this.formData.star_special_price}
                  size="small"
                  placeholder="请输入专场刊例价"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="专场佣金" prop="special_commission_min_percent">
                <el-input
                  v-model={this.formData.special_commission_min_percent}
                  size="small"
                  placeholder="请输入专场佣金"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3" />
            <div class="flex-line-item-3" />
          </div>
        </el-form>
      </div>
    );
  },
});
