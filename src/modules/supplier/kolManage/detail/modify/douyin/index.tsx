/** @Author: 石斛 **/
import { defineComponent, onMounted, PropType, ref, watch } from '@vue/composition-api';
import { KolTagEnum } from '@/const/kolConst';
import { deepClone } from '@/utils/tools';
import { ElForm } from 'element-ui/types/form';
import { getPositiveNumber } from '@/utils/string';

export default defineComponent({
  name: 'editDouyin',
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
    kolTag: {
      type: Number,
      default: undefined,
    },
  },
  components: {},
  setup(props, ctx) {
    const formData = ref<any>({
      douyin_name: '', // 抖音名称
      douyin_id: '', // 抖音id
      baiying_id: '', // 百应ID
      qianchuan_uid: '', // UID
      fans_number: '', // 粉丝数
      praise_number: '', // 获赞数
      live_special_price: '', // 专场成本价
      live_special_publish_price: '', // 专场刊例价
      special_commission_min_percent: '', // 专场佣金比例
      avg_sales_amount: '', // 场均销售额
      live_pit_price: '', //坑位费成本价
      live_pit_publish_price: '', //坑位费刊例价
      mix_min_commission_percent: '', //混播佣金
      pure_min_commission_percent: '', //纯佣金
      video_1_20_star_map_price: '', // 星图20秒成本价
      video_21_60_star_map_price: '', // 星图20-60秒成本价
      video_gt_60_star_map_price: '', // 星图60秒以上成本价
      shopcart_without_fee_price: '', // 购物车费用（不含税）
      shopcart_min_commission_percent: '', // 购物车佣金
    });
    const douyinInfo: any = ref({});
    const rulesChangeCondition = ref<any>({
      kolTag: '', // 主播tag
      pure_min_commission_percent: '', // 纯佣金
      video_1_20_star_map_price: '', // 星图20秒成本价
      video_21_60_star_map_price: '', // 星图20-60秒成本价
      video_gt_60_star_map_price: '', // 星图60秒以上成本价
    });
    const formRules = ref({
      douyin_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      douyin_id: [{ required: true, message: '请输入抖音号', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
      praise_number: [{ required: true, message: '请输入获赞数', trigger: 'blur' }],
    });
    const setLiveRules = (required: boolean) => {
      formRules.value = Object.assign({}, formRules.value, {
        live_pit_price: [{ required: required, message: '坑位费成本价必填', trigger: 'blur' }],
        live_pit_publish_price: [
          { required: required, message: '坑位费刊例价必填', trigger: 'blur' },
        ],
        mix_min_commission_percent: [
          { required: required, message: '混播佣金必填', trigger: 'blur' },
        ],
      });
    };
    const setGrassRules = (required: boolean) => {
      formRules.value = Object.assign({}, formRules.value, {
        video_1_20_star_map_price: [
          {
            required: required,
            message: '种草达人星图报价至少填1项',
            trigger: 'blur',
          },
        ],
        video_21_60_star_map_price: [
          {
            required: required,
            message: '种草达人星图报价至少填1项',
            trigger: 'blur',
          },
        ],
        video_gt_60_star_map_price: [
          {
            required: required,
            message: '种草达人星图报价至少填1项',
            trigger: 'blur',
          },
        ],
      });
    };
    const validate = async () => {
      try {
        await (ctx.refs.douyinPlatform as unknown as { validate: () => void }).validate();
        return Promise.resolve(Object.assign(douyinInfo.value, formData.value));
      } catch (error) {
        return Promise.reject();
      }
    };
    const closeForm = () => {
      props.close('douyin');
    };
    const submitForm = async () => {
      const result = await validate();
      if (result) {
        props.submit('douyin', result);
      }
    };
    const textValueChange = (val: string, key: string) => {
      formData.value[key] = val;
      rulesChangeCondition.value[key] = val;
    };
    const numberValidator = (val: string, key: string) => {
      formData.value[key] = getPositiveNumber(val);
    };
    onMounted(() => {
      if (props.data) {
        douyinInfo.value = props.data;
        const {
          douyin_name,
          douyin_id,
          baiying_id,
          qianchuan_uid,
          fans_number,
          praise_number,
          live_pit_price,
          live_pit_publish_price,
          mix_min_commission_percent,
          pure_min_commission_percent,
          live_special_price,
          live_special_publish_price,
          special_commission_min_percent,
          avg_sales_amount,
          video_1_20_star_map_price,
          video_21_60_star_map_price,
          video_gt_60_star_map_price,
          shopcart_without_fee_price,
          shopcart_min_commission_percent,
        } = props.data;
        formData.value = {
          douyin_name,
          douyin_id,
          baiying_id,
          qianchuan_uid,
          fans_number,
          praise_number,
          live_pit_price,
          live_pit_publish_price,
          mix_min_commission_percent,
          pure_min_commission_percent,
          live_special_price,
          live_special_publish_price,
          special_commission_min_percent,
          avg_sales_amount,
          video_1_20_star_map_price,
          video_21_60_star_map_price,
          video_gt_60_star_map_price,
          shopcart_without_fee_price,
          shopcart_min_commission_percent,
        };
        Object.assign(rulesChangeCondition.value, {
          pure_min_commission_percent,
          video_1_20_star_map_price,
          video_21_60_star_map_price,
          video_gt_60_star_map_price,
        });
      }
      if (props.kolTag) {
        rulesChangeCondition.value.kolTag = props.kolTag;
      }
    });
    watch(
      () => rulesChangeCondition.value,
      val => {
        if (val.kolTag === KolTagEnum.GRASS_KOL) {
          const required = !(
            val.video_1_20_star_map_price ||
            val.video_21_60_star_map_price ||
            val.video_gt_60_star_map_price
          );
          setGrassRules(required);
          setLiveRules(false);
        } else if (val.kolTag === KolTagEnum.LIVE_KOL) {
          if (!val.pure_min_commission_percent) {
            setLiveRules(true);
          } else {
            setLiveRules(false);
          }
          setGrassRules(false);
        } else {
          setLiveRules(false);
          setGrassRules(false);
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => formRules.value,
      (val: any) => {
        const tmpData: any = deepClone(formData.value);
        (ctx.refs.douyinPlatform as ElForm).resetFields();
        formData.value = tmpData;
      },
      {
        deep: true,
      },
    );
    return {
      formData,
      formRules,
      validate,
      props,
      closeForm,
      submitForm,
      textValueChange,
      numberValidator,
    };
  },
  render() {
    return (
      <div class="edit-platform-wrapper">
        <div class="info-title">
          <span class="info-title-left">抖音平台</span>
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
          ref="douyinPlatform"
          label-position="top"
          size="small"
          label-width={this.labelWidth}
        >
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="昵称" prop="douyin_name">
                <el-input
                  v-model={this.formData.douyin_name}
                  size="small"
                  placeholder="请输入昵称"
                  maxlength={30}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="抖音号" prop="douyin_id">
                <el-input
                  v-model={this.formData.douyin_id}
                  size="small"
                  placeholder="请输入抖音号"
                  maxlength={20}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="百应ID">
                <el-input
                  v-model={this.formData.baiying_id}
                  size="small"
                  placeholder="请输入百应ID"
                  maxlength={20}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="UID">
                <el-input
                  v-model={this.formData.qianchuan_uid}
                  size="small"
                  placeholder="请输入UID"
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
            <div class="flex-line-item-3">
              <el-form-item label="获赞数" prop="praise_number">
                <el-input
                  v-model={this.formData.praise_number}
                  size="small"
                  placeholder="请输入获赞数"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.numberValidator(val, 'praise_number');
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
                  onInput={(val: string) => {
                    this.textValueChange(val, 'pure_min_commission_percent');
                  }}
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
              <el-form-item label="专场佣金比例" prop="special_commission_min_percent">
                <el-input
                  v-model={this.formData.special_commission_min_percent}
                  size="small"
                  placeholder="请输入专场佣金比例"
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
            <div class="flex-line-item-3">
              <el-form-item label="星图20秒成本价" prop="video_1_20_star_map_price">
                <el-input
                  v-model={this.formData.video_1_20_star_map_price}
                  size="small"
                  placeholder="请输入星图20秒成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'video_1_20_star_map_price');
                  }}
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="星图20-60秒成本价" prop="video_21_60_star_map_price">
                <el-input
                  v-model={this.formData.video_21_60_star_map_price}
                  size="small"
                  placeholder="请输入星图20-60秒成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'video_21_60_star_map_price');
                  }}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="星图60秒以上成本价" prop="video_gt_60_star_map_price">
                <el-input
                  v-model={this.formData.video_gt_60_star_map_price}
                  size="small"
                  placeholder="请输入星图60秒以上成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'video_gt_60_star_map_price');
                  }}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="购物车费用（不含税）" prop="shopcart_without_fee_price">
                <el-input
                  v-model={this.formData.shopcart_without_fee_price}
                  size="small"
                  placeholder="请输入购物车费用（不含税）"
                  maxlength={11}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="购物车佣金" prop="shopcart_min_commission_percent">
                <el-input
                  v-model={this.formData.shopcart_min_commission_percent}
                  size="small"
                  placeholder="请输入购物车佣金"
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
