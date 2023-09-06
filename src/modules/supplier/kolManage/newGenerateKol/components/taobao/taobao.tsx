/*
 * @Author: 肖槿
 * @Date: 2021-07-23 16:37:51
 * @Description: 淘宝表单
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-03 14:14:38
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\generateKol\components\taobao\taobao.tsx
 */
import { defineComponent, ref, inject, watch } from '@vue/composition-api';
// import { platformForm } from '../index';
import platformForm from '../platformForm/platformForm';

import { getPositiveNumber } from '@/utils/string';

export default defineComponent({
  name: 'kolTaobao',
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
    const formData = ref({
      star_name: '',
      star_id: '',
      fans_number: '',
    });
    const starInfo: any = ref({});
    const liveFormData = ref({
      star_mix_cost: '', // 混播成本价
      star_mix_price: '', // 混播刊例价
      mix_min_commission_percent: '', // 混播比例
      pure_min_commission_percent: '', // 纯佣金
      star_special_cost: '', // 专场成本价
      star_special_price: '', // 专场刊例价
      special_commission_min_percent: '', // 专场佣金比例
    });
    const editData: any = inject('editData');
    const formRules = ref({
      star_name: [{ required: true, message: '请输入淘宝账号', trigger: 'blur' }],
      star_id: [{ required: true, message: '请输入淘宝ID', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
    });
    const structData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'star_name',
        label: '淘宝账号',
        children: {
          value: '',
          key: 'star_name',
          attrs: {
            placeholder: '请输入淘宝账号',
            maxlength: 30,
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'star_id',
        label: '淘宝ID',
        children: {
          value: '',
          key: 'star_id',
          attrs: {
            placeholder: '请输入淘宝ID',
            maxlength: 20,
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
    ]);
    const liveFormRules = ref({
      star_mix_cost: [{ required: true, message: '请输入混播成本价', trigger: 'blur' }],
      star_mix_price: [{ required: true, message: '请输入混播刊例价', trigger: 'blur' }],
      mix_min_commission_percent: [{ required: true, message: '请输入混播佣金', trigger: 'blur' }],
      pure_min_commission_percent: [{ required: true, message: '请输入纯佣金', trigger: 'blur' }],
    });
    const liveStructData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'star_mix_cost',
        label: '混播成本价',
        children: {
          value: '',
          key: 'star_mix_cost',
          attrs: {
            maxlength: 11,
            placeholder: '请输入混播成本价',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'star_mix_price',
        label: '混播刊例价',
        children: {
          value: '',
          key: 'star_mix_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入混播刊例价',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'mix_min_commission_percent',
        label: '混播佣金',
        children: {
          value: '',
          key: 'mix_min_commission_percent',
          attrs: {
            maxlength: 11,
            placeholder: '请输入混播佣金',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'pure_min_commission_percent',
        label: '纯佣金',
        children: {
          value: '',
          key: 'pure_min_commission_percent',
          attrs: {
            maxlength: 11,
            placeholder: '请输入纯佣金',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'star_special_cost',
        label: '专场成本价',
        children: {
          value: '',
          key: 'star_special_cost',
          attrs: {
            maxlength: 11,
            placeholder: '请输入专场成本价',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'star_special_price',
        label: '专场刊例价',
        children: {
          value: '',
          key: 'star_special_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入专场刊例价',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'special_commission_min_percent',
        label: '专场佣金',
        children: {
          value: '',
          key: 'special_commission_min_percent',
          attrs: {
            maxlength: 11,
            placeholder: '请输入专场佣金',
          },
        },
      },
    ]);
    const validate = async () => {
      try {
        const taobaoData = await (
          ctx.refs.taobaoPlatform as unknown as { validate: () => void }
        ).validate();
        const liveData = await (
          ctx.refs.taobaoLivePlatform as unknown as { validate: () => void }
        ).validate();
        return Promise.resolve({
          tb: Object.assign(starInfo.value, taobaoData, liveData),
        });
      } catch (error) {
        return Promise.reject();
      }
    };
    watch(
      () => editData,
      (val: any) => {
        const { star_info } = val.value;
        if (star_info) {
          starInfo.value = star_info;
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
          } = star_info;
          formData.value = {
            star_name,
            star_id,
            fans_number,
          };
          liveFormData.value = {
            star_mix_cost,
            star_mix_price,
            mix_min_commission_percent,
            pure_min_commission_percent,
            star_special_cost,
            star_special_price,
            special_commission_min_percent,
          };
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => props.checked,
      val => {
        formRules.value = {
          star_name: [{ required: val, message: '请输入淘宝账号', trigger: 'blur' }],
          star_id: [{ required: val, message: '请输入淘宝ID', trigger: 'blur' }],
          fans_number: [{ required: val, message: '请输入粉丝数', trigger: 'blur' }],
        };
        liveFormRules.value = {
          star_mix_cost: [{ required: val, message: '请输入混播成本价', trigger: 'blur' }],
          star_mix_price: [{ required: val, message: '请输入混播刊例价', trigger: 'blur' }],
          mix_min_commission_percent: [
            { required: val, message: '请输入混播佣金', trigger: 'blur' },
          ],
          pure_min_commission_percent: [
            { required: val, message: '请输入纯佣金', trigger: 'blur' },
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
      liveStructData,
      liveFormData,
      validate,
      liveFormRules,
      props,
    };
  },
  render() {
    return (
      <div class="base-info" style="padding:0px 18px 18px 3px;margin-top:0px">
        <platformForm
          ref="taobaoPlatform"
          labelWidth="106px"
          rules={this.formRules}
          title="基础信息"
          formData={this.formData}
          structData={this.structData}
          required={this.props.checked}
        />
        <platformForm
          ref="taobaoLivePlatform"
          labelWidth="106px"
          title="直播报价"
          rules={this.liveFormRules}
          structData={this.liveStructData}
          formData={this.liveFormData}
        />
      </div>
    );
  },
});
