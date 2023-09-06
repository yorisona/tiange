/** @Author: 石斛 **/
import { defineComponent, onMounted, PropType, ref } from '@vue/composition-api';
import { getPositiveNumber } from '@/utils/string';

export default defineComponent({
  name: 'editKuaishou',
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
      kuaishou_name: '', // 昵称
      kuaishou_id: '', // 快手号
      fans_number: '', // 粉丝数
      live_pit_price: '', // 坑位费成本价
      live_pit_publish_price: '', // 坑位费刊例价
      mix_min_commission_percent: '', // 混播佣金
      pure_min_commission_percent: '', // 纯佣金
      live_special_price: '', // 专场成本价
      live_special_publish_price: '', // 专场刊例价
      special_commission_min_percent: '', // 专场佣金
      avg_sales_amount: '', // 场均销售额
    });
    const kuaishouInfo: any = ref({});
    const formRules = ref({
      kuaishou_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      kuaishou_id: [{ required: true, message: '请输入快手号', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
      live_pit_price: [{ required: true, message: '请输入坑位费成本价', trigger: 'blur' }],
      live_pit_publish_price: [{ required: true, message: '请输入坑位费刊例价', trigger: 'blur' }],
      mix_min_commission_percent: [{ required: true, message: '请输入混播佣金', trigger: 'blur' }],
      pure_min_commission_percent: [{ required: true, message: '请输入纯佣金', trigger: 'blur' }],
    });
    const validate = async () => {
      try {
        await (ctx.refs.kuaishouPlatform as unknown as { validate: () => void }).validate();
        return Promise.resolve(Object.assign(kuaishouInfo.value, formData.value));
      } catch (error) {
        return Promise.reject();
      }
    };
    const closeForm = () => {
      props.close('kuaishou');
    };
    const submitForm = async () => {
      const result = await validate();
      if (result) {
        props.submit('kuaishou', kuaishouInfo.value);
      }
    };
    onMounted(() => {
      if (props.data) {
        kuaishouInfo.value = props.data;
        const {
          kuaishou_name, // 昵称
          kuaishou_id, // 快手号
          fans_number, // 粉丝数
          live_pit_price, // 坑位费成本价
          live_pit_publish_price, // 坑位费刊例价
          mix_min_commission_percent, // 混播佣金
          pure_min_commission_percent, // 纯佣金
          live_special_price, // 专场成本价
          live_special_publish_price, // 专场刊例价
          special_commission_min_percent, // 专场佣金
          avg_sales_amount, // 场均销售额
        } = props.data;
        formData.value = {
          kuaishou_name, // 昵称
          kuaishou_id, // 快手号
          fans_number, // 粉丝数
          live_pit_price, // 坑位费成本价
          live_pit_publish_price, // 坑位费刊例价
          mix_min_commission_percent, // 混播佣金
          pure_min_commission_percent, // 纯佣金
          live_special_price, // 专场成本价
          live_special_publish_price, // 专场刊例价
          special_commission_min_percent, // 专场佣金
          avg_sales_amount, // 场均销售额
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
          <span class="info-title-left">快手平台</span>
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
          ref="kuaishouPlatform"
          label-position="top"
          size="small"
          label-width={this.labelWidth}
        >
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="昵称" prop="kuaishou_name">
                <el-input
                  v-model={this.formData.kuaishou_name}
                  size="small"
                  placeholder="请输入昵称"
                  maxlength={30}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="快手号" prop="kuaishou_id">
                <el-input
                  v-model={this.formData.kuaishou_id}
                  size="small"
                  placeholder="请输入快手号"
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
              <el-form-item label="坑位费成本价" prop="live_pit_price">
                <el-input
                  v-model={this.formData.live_pit_price}
                  size="small"
                  placeholder="请输入坑位费成本价"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="坑位费刊例价" prop="live_pit_publish_price">
                <el-input
                  v-model={this.formData.live_pit_publish_price}
                  size="small"
                  placeholder="请输入坑位费刊例价"
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
              <el-form-item label="专场成本价" prop="live_special_price">
                <el-input
                  v-model={this.formData.live_special_price}
                  size="small"
                  placeholder="请输入专场成本价"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="专场刊例价" prop="live_special_publish_price">
                <el-input
                  v-model={this.formData.live_special_publish_price}
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
            <div class="flex-line-item-3">
              <el-form-item label="场均销售额（万）" prop="avg_sales_amount">
                <el-input
                  v-model={this.formData.avg_sales_amount}
                  size="small"
                  placeholder="请输入场均销售额（万）"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3" />
          </div>
        </el-form>
      </div>
    );
  },
});
