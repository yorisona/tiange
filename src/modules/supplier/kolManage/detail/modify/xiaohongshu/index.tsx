/** @Author: 石斛 **/
import { defineComponent, ref, onMounted, PropType, watch } from '@vue/composition-api';
import { deepClone } from '@/utils/tools';
import { ElForm } from 'element-ui/types/form';
import { getPositiveNumber } from '@/utils/string';

export default defineComponent({
  name: 'editXiaohongshu',
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
      xhs_name: '', // 昵称
      fans_number: '', // 粉丝数
      praise_collection: '', // 获赞数
      homepage_link: '', // 主页链接
      photo_filing_price: '', // 图文报备成本价
      video_filing_price: '', // 视频报备成本价
      photo_not_filing_price: '', // 图文不报备成本价
      video_not_filing_price: '', // 视频不报备成本价
    });
    const xiaohongshuInfo: any = ref({});
    const formRules = ref({
      xhs_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
      praise_collection: [{ required: true, message: '请输入赞藏数', trigger: 'blur' }],
      homepage_link: [{ required: true, message: '主页链接', trigger: 'blur' }],
    });
    const rulesChangeCondition = ref<any>({
      photo_filing_price: '', // 图文报备成本价
      video_filing_price: '', // 视频报备成本价
      photo_not_filing_price: '', // 图文不报备成本价
      video_not_filing_price: '', // 视频不报备成本价
    });
    const validate = async () => {
      try {
        await (ctx.refs.xiaohongshuPlatform as unknown as { validate: () => void }).validate();
        return Promise.resolve(Object.assign(xiaohongshuInfo.value, formData.value));
      } catch (error) {
        return Promise.reject();
      }
    };
    const textValueChange = (val: string, key: string) => {
      formData.value[key] = val;
      rulesChangeCondition.value[key] = val;
    };
    const numberValidator = (val: string, key: string) => {
      formData.value[key] = getPositiveNumber(val);
    };
    const closeForm = () => {
      props.close('xhs');
    };
    const submitForm = async () => {
      const result = await validate();
      if (result) {
        props.submit('xhs', result);
      }
    };
    onMounted(() => {
      if (props.data) {
        xiaohongshuInfo.value = props.data;
        const {
          xhs_name, // 昵称
          fans_number, // 粉丝数
          praise_collection, // 获赞数
          homepage_link, // 主页链接
          photo_filing_price, // 图文报备成本价
          video_filing_price, // 视频报备成本价
          photo_not_filing_price, // 图文不报备成本价
          video_not_filing_price, // 视频不报备成本价
        } = props.data;
        formData.value = {
          xhs_name, // 昵称
          fans_number, // 粉丝数
          praise_collection, // 获赞数
          homepage_link, // 主页链接
          photo_filing_price, // 图文报备成本价
          video_filing_price, // 视频报备成本价
          photo_not_filing_price, // 图文不报备成本价
          video_not_filing_price, // 视频不报备成本价
        };
        Object.assign(rulesChangeCondition.value, {
          photo_filing_price,
          video_filing_price,
          photo_not_filing_price,
          video_not_filing_price,
        });
      }
    });
    watch(
      () => rulesChangeCondition.value,
      val => {
        console.log(rulesChangeCondition.value);
        const required = !(
          val.video_filing_price ||
          val.video_not_filing_price ||
          val.photo_filing_price ||
          val.photo_not_filing_price
        );
        formRules.value = Object.assign({}, formRules.value, {
          video_filing_price: [{ required: required, message: '至少填1项报价', trigger: 'blur' }],
          video_not_filing_price: [
            { required: required, message: '至少填1项报价', trigger: 'blur' },
          ],
          photo_filing_price: [{ required: required, message: '至少填1项报价', trigger: 'blur' }],
          photo_not_filing_price: [
            { required: required, message: '至少填1项报价', trigger: 'blur' },
          ],
        });
      },
      {
        deep: true,
      },
    );
    watch(
      () => formRules.value,
      (val: any) => {
        console.log('111111', formRules.value);
        const tmpData: any = deepClone(formData.value);
        (ctx.refs.xiaohongshuPlatform as ElForm).resetFields();
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
          <span class="info-title-left">小红书平台</span>
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
          ref="xiaohongshuPlatform"
          label-position="top"
          size="small"
          label-width={this.labelWidth}
        >
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="昵称" prop="xhs_name">
                <el-input
                  v-model={this.formData.xhs_name}
                  size="small"
                  placeholder="请输入昵称"
                  maxlength={30}
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
              <el-form-item label="赞藏数" prop="praise_collection">
                <el-input
                  v-model={this.formData.praise_collection}
                  size="small"
                  placeholder="请输入赞藏数"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.numberValidator(val, 'praise_collection');
                  }}
                >
                  <span slot="append">万</span>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="主页链接" prop="homepage_link">
                <el-input
                  v-model={this.formData.homepage_link}
                  size="small"
                  placeholder="请输入主页链接"
                  maxlength={255}
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="图文不报备成本价" prop="photo_not_filing_price">
                <el-input
                  v-model={this.formData.photo_not_filing_price}
                  size="small"
                  placeholder="请输入图文不报备成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'photo_not_filing_price');
                  }}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="图文报备成本价" prop="photo_filing_price">
                <el-input
                  v-model={this.formData.photo_filing_price}
                  size="small"
                  placeholder="请输入图文报备成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'photo_filing_price');
                  }}
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-line-box">
            <div class="flex-line-item-3">
              <el-form-item label="视频不报备成本价" prop="video_not_filing_price">
                <el-input
                  v-model={this.formData.video_not_filing_price}
                  size="small"
                  placeholder="请输入视频不报备成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'video_not_filing_price');
                  }}
                />
              </el-form-item>
            </div>
            <div class="flex-line-item-3">
              <el-form-item label="视频报备成本价" prop="video_filing_price">
                <el-input
                  v-model={this.formData.video_filing_price}
                  size="small"
                  placeholder="请输入视频报备成本价"
                  maxlength={11}
                  show-word-limit={true}
                  onInput={(val: string) => {
                    this.textValueChange(val, 'video_filing_price');
                  }}
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
