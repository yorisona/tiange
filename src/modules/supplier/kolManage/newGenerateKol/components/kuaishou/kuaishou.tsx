/*
 * @Author: 肖槿
 * @Date: 2021-07-23 16:39:56
 * @Description: 快手表单
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-03 14:14:33
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\generateKol\components\kuaishou\kuaishou.tsx
 */
import { defineComponent, ref, inject, watch } from '@vue/composition-api';
// import { platformForm } from '../index';
import platformForm from '../platformForm/platformForm';

import { getPositiveNumber } from '@/utils/string';
export default defineComponent({
  name: 'kolKuaishou',
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
    const companyList: any = inject('companyList');
    const kolKuaishouInfo = ref({});
    const formData = ref({
      kuaishou_name: '', // 昵称
      kuaishou_id: '', // 快手号
      fans_number: '', // 粉丝数
    });
    const liveFormData = ref({
      live_pit_price: '', // 坑位费成本价
      live_pit_publish_price: '', // 坑位费刊例价
      mix_min_commission_percent: '', // 混播佣金
      pure_min_commission_percent: '', // 纯佣金
      live_special_price: '', // 专场成本价
      live_special_publish_price: '', // 专场刊例价
      special_commission_min_percent: '', // 专场佣金
      avg_sales_amount: '', // 场均销售额
    });
    const formRules = ref({
      kuaishou_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      kuaishou_id: [{ required: true, message: '请输入快手号', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
    });
    const structData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'kuaishou_name',
        label: '昵称',
        children: {
          value: '',
          key: 'kuaishou_name',
          attrs: {
            placeholder: '请输入昵称',
            maxlength: 30,
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'kuaishou_id',
        label: '快手号',
        children: {
          value: '',
          key: 'kuaishou_id',
          attrs: {
            placeholder: '请输入快手号',
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
      live_pit_price: [{ required: true, message: '请输入坑位费成本价', trigger: 'blur' }],
      live_pit_publish_price: [{ required: true, message: '请输入坑位费刊例价', trigger: 'blur' }],
      mix_min_commission_percent: [{ required: true, message: '请输入混播佣金', trigger: 'blur' }],
      pure_min_commission_percent: [{ required: true, message: '请输入纯佣金', trigger: 'blur' }],
    });
    const liveStructData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'live_pit_price',
        label: '坑位费成本价',
        children: {
          value: '',
          key: 'live_pit_price',
          attrs: {
            maxlength: 11,

            placeholder: '请输入坑位费成本价',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'live_pit_publish_price',
        label: '坑位费刊例价',
        children: {
          value: '',
          key: 'live_pit_publish_price',
          attrs: {
            maxlength: 11,

            placeholder: '请输入坑位费刊例价',
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
        prop: 'live_special_price',
        label: '专场成本价',
        children: {
          value: '',
          key: 'live_special_price',
          attrs: {
            maxlength: 11,

            placeholder: '请输入专场成本价',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'live_special_publish_price',
        label: '专场刊例价',
        children: {
          value: '',
          key: 'live_special_publish_price',
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
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'avg_sales_amount',
        label: '场均销售额（万）',
        children: {
          value: '',
          key: 'avg_sales_amount',
          attrs: {
            maxlength: 11,

            placeholder: '请输入场均销售额（万）',
          },
        },
      },
    ]);
    const validate = async () => {
      try {
        const taobaoData = await (
          ctx.refs.ksPlatform as unknown as { validate: () => void }
        ).validate();
        const liveData = await (
          ctx.refs.ksLivePlatform as unknown as { validate: () => void }
        ).validate();
        return Promise.resolve({
          kuaishou: Object.assign({}, taobaoData, liveData),
        });
      } catch (error) {
        return Promise.reject();
      }
    };
    watch(
      () => editData,
      (val: any) => {
        const { kol_kuaishou_info } = val.value;
        if (kol_kuaishou_info) {
          kolKuaishouInfo.value = kol_kuaishou_info;
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
          } = kol_kuaishou_info;
          formData.value = {
            kuaishou_name, // 昵称
            kuaishou_id, // 快手号
            fans_number, // 粉丝数
          };
          liveFormData.value = {
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
      },
      {
        deep: true,
      },
    );
    watch(
      () => props.checked,
      val => {
        formRules.value = {
          kuaishou_name: [{ required: val, message: '请输入昵称', trigger: 'blur' }],
          kuaishou_id: [{ required: val, message: '请输入快手号', trigger: 'blur' }],
          fans_number: [{ required: val, message: '请输入粉丝数', trigger: 'blur' }],
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
      companyList,
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
          ref="ksPlatform"
          labelWidth="106px"
          rules={this.formRules}
          title="基础信息"
          formData={this.formData}
          structData={this.structData}
          required={this.props.checked}
        />
        <platformForm
          ref="ksLivePlatform"
          labelWidth="106px"
          title="直播"
          rules={this.liveFormRules}
          structData={this.liveStructData}
          formData={this.liveFormData}
        />
      </div>
    );
  },
});
