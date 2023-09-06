/*
 * @Author: 肖槿
 * @Date: 2021-07-23 16:40:14
 * @Description: 小红书表单
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-09-30 16:26:11
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\newGenerateKol\components\xiaohongshu\xiaohongshu.tsx
 */

import { defineComponent, ref, watch, inject } from '@vue/composition-api';
// import { platformForm } from '../index';
import platformForm from '../platformForm/platformForm';

import { getPositiveNumber } from '@/utils/string';
export default defineComponent({
  name: 'kolXiaohongshu',
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    platformForm,
  },
  setup(props, ctx) {
    const editData: any = inject('editData');
    const kolXhsInfo: any = ref({});
    const formData = ref({
      xhs_name: '', // 昵称
      fans_number: '', // 粉丝数
      praise_collection: '', // 获赞数
      homepage_link: '', // 主页链接
    });
    const kolFormData = ref({
      photo_filing_price: '', // 图文报备成本价
      video_filing_price: '', // 视频报备成本价
      photo_not_filing_price: '', // 图文不报备成本价
      video_not_filing_price: '', // 视频不报备成本价
    });
    const rulesChangeCondition = ref({
      checked: false, // 被选中
      photo_filing_price: '', // 图文报备成本价
      video_filing_price: '', // 视频报备成本价
      photo_not_filing_price: '', // 图文不报备成本价
      video_not_filing_price: '', // 视频不报备成本价
    });
    const formRules = ref({
      xhs_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
      praise_collection: [{ required: true, message: '请输入赞藏数', trigger: 'blur' }],
      homepage_link: [{ required: true, message: '主页链接', trigger: 'blur' }],
    });
    const kolFormRules = ref({
      photo_filing_price: [{ required: true, message: '至少填1项报价', trigger: 'blur' }],
      video_filing_price: [{ required: true, message: '至少填1项报价', trigger: 'blur' }],
      photo_not_filing_price: [{ required: true, message: '至少填1项报价', trigger: 'blur' }],
      video_not_filing_price: [{ required: true, message: '至少填1项报价', trigger: 'blur' }],
    });
    const structData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'xhs_name',
        label: '昵称',
        children: {
          value: '',
          key: 'xhs_name',
          attrs: {
            placeholder: '请输入昵称',
            maxlength: 30,
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'fans_number',
        label: '粉丝数',
        children: {
          value: '',
          key: 'fans_number',
          attrs: {
            maxlength: 11,
            placeholder: '请输入粉丝数',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            formData[key] = getPositiveNumber(val);
          },
        },
        unit: '万',
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'praise_collection',
        label: '赞藏数',
        children: {
          value: '',
          key: 'praise_collection',
          attrs: {
            maxlength: 11,
            placeholder: '请输入获赞数',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            formData[key] = getPositiveNumber(val);
          },
        },
        unit: '万',
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'homepage_link',
        label: '主页链接',
        children: {
          key: 'homepage_link',
          attrs: {
            placeholder: '请输入主页链接',
            maxlength: 255,
          },
        },
      },
    ]);
    const kolStructData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'photo_not_filing_price',
        label: '图文不报备成本价',
        children: {
          value: '',
          key: 'photo_not_filing_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入图文不报备成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.photo_not_filing_price = val;
            formData[key] = val;
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'photo_filing_price',
        label: '图文报备成本价',
        children: {
          value: '',
          key: 'photo_filing_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入图文报备成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.photo_filing_price = val;
            formData[key] = val;
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'video_not_filing_price',
        label: '视频不报备成本价',
        children: {
          value: '',
          key: 'video_not_filing_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入视频不报备成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.video_not_filing_price = val;
            formData[key] = val;
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'video_filing_price',
        label: '视频报备成本价',
        children: {
          value: '',
          key: 'video_filing_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入视频报备成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.video_filing_price = val;
            formData[key] = val;
          },
        },
      },
    ]);
    const validate = async () => {
      try {
        const taobaoData = await (
          ctx.refs.xhsPlatform as unknown as { validate: () => void }
        ).validate();
        const kolData = await (
          ctx.refs.xhsKolPlatform as unknown as { validate: () => void }
        ).validate();
        return Promise.resolve({
          xhs: Object.assign(kolXhsInfo.value, taobaoData, kolData),
        });
      } catch (error) {
        return Promise.reject();
      }
    };
    watch(
      () => props.checked,
      val => {
        rulesChangeCondition.value.checked = val;
        formRules.value = {
          xhs_name: [{ required: val, message: '请输入昵称', trigger: 'blur' }],
          fans_number: [{ required: val, message: '请输入粉丝数', trigger: 'blur' }],
          praise_collection: [{ required: val, message: '请输入赞藏数', trigger: 'blur' }],
          homepage_link: [{ required: val, message: '主页链接', trigger: 'blur' }],
        };
      },
      {
        deep: true,
      },
    );
    watch(
      () => editData,
      (val: any) => {
        const { kol_xhs_info } = val.value;
        if (kol_xhs_info) {
          kolXhsInfo.value = kol_xhs_info;
          const {
            xhs_name, // 昵称
            fans_number, // 粉丝数
            praise_collection, // 获赞数
            homepage_link, // 主页链接
            photo_filing_price, // 图文报备成本价
            video_filing_price, // 视频报备成本价
            photo_not_filing_price, // 图文不报备成本价
            video_not_filing_price, // 视频不报备成本价
          } = kol_xhs_info;
          formData.value = {
            xhs_name, // 昵称
            fans_number, // 粉丝数
            praise_collection, // 获赞数
            homepage_link, // 主页链接
          };
          kolFormData.value = {
            photo_filing_price, // 图文报备成本价
            video_filing_price, // 视频报备成本价
            photo_not_filing_price, // 图文不报备成本价
            video_not_filing_price, // 视频不报备成本价
          };
          rulesChangeCondition.value.photo_filing_price = photo_filing_price;
          rulesChangeCondition.value.photo_not_filing_price = photo_not_filing_price;
          rulesChangeCondition.value.video_filing_price = video_filing_price;
          rulesChangeCondition.value.video_not_filing_price = video_not_filing_price;
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => rulesChangeCondition.value,
      val => {
        const required =
          props.checked &&
          !(
            val.video_filing_price ||
            val.video_not_filing_price ||
            val.photo_filing_price ||
            val.photo_not_filing_price
          );
        kolFormRules.value = {
          video_filing_price: [{ required: required, message: '至少填1项报价', trigger: 'blur' }],
          video_not_filing_price: [
            { required: required, message: '至少填1项报价', trigger: 'blur' },
          ],
          photo_filing_price: [{ required: required, message: '至少填1项报价', trigger: 'blur' }],
          photo_not_filing_price: [
            { required: required, message: '至少填1项报价', trigger: 'blur' },
          ],
        };
      },
      {
        deep: true,
      },
    );
    return {
      formData,
      formRules,
      structData,
      kolStructData,
      kolFormData,
      validate,
      kolFormRules,
      props,
    };
  },
  render() {
    return (
      <div class="base-info" style="padding:0px 18px 18px 3px;margin-top:0px">
        <platformForm
          ref="xhsPlatform"
          labelWidth="106px"
          rules={this.formRules}
          title="基础信息"
          formData={this.formData}
          structData={this.structData}
          required={this.props.checked}
        />
        <platformForm
          ref="xhsKolPlatform"
          labelWidth="106px"
          title="种草"
          subTitle="formData"
          structData={this.kolStructData}
          formData={this.kolFormData}
          rules={this.kolFormRules}
        />
      </div>
    );
  },
});
