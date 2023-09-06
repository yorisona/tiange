/*
 * @Author: 肖槿
 * @Date: 2021-07-23 16:39:27
 * @Description: 抖音表单
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-04 10:13:54
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\generateKol\components\douyin\douyin.tsx
 */
import { defineComponent, ref, inject, watch } from '@vue/composition-api';
// import { platformForm } from '../index';
import platformForm from '../platformForm/platformForm';
import { KolTagEnum } from '@/const/kolConst';
import { getPositiveNumber } from '@/utils/string';
export default defineComponent({
  name: 'kolDouyin',
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
      douyin_name: '', // 抖音名称
      douyin_id: '', // 抖音id
      baiying_id: '', // 百应ID
      qianchuan_uid: '', // 千川uid
      fans_number: '', // 粉丝数
      praise_number: '', // 获赞数
    });
    const kolDouyinInfo = ref({});
    const editData: any = inject('editData');
    const companyList: any = inject('companyList');
    const liveFormData = ref({
      live_special_price: '', // 专场成本价
      live_special_publish_price: '', // 专场刊例价
      special_commission_min_percent: '', // 专场佣金比例
      avg_sales_amount: '', // 场均销售额
      live_pit_price: '', //坑位费成本价
      live_pit_publish_price: '', //坑位费刊例价
      mix_min_commission_percent: '', //混播佣金
      pure_min_commission_percent: '', //纯佣金
    });
    const kolFormData = ref({
      video_1_20_star_map_price: '', // 星图20秒成本价
      video_21_60_star_map_price: '', // 星图20-60秒成本价
      video_gt_60_star_map_price: '', // 星图60秒以上成本价
      shopcart_without_fee_price: '', // 购物车费用（不含税）
      shopcart_min_commission_percent: '', // 购物车佣金
    });
    const rulesChangeCondition = ref<any>({
      checked: false, // 被选中
      kolTag: '', // 主播tag
      pure_min_commission_percent: '', // 纯佣金
      video_1_20_star_map_price: '', // 星图20秒成本价
      video_21_60_star_map_price: '', // 星图20-60秒成本价
      video_gt_60_star_map_price: '', // 星图60秒以上成本价
    });
    const setLiveRules = (required: boolean) => {
      liveFormRules.value = {
        live_pit_price: [{ required: required, message: '坑位费成本价必填', trigger: 'blur' }],
        live_pit_publish_price: [
          { required: required, message: '坑位费刊例价必填', trigger: 'blur' },
        ],
        mix_min_commission_percent: [
          { required: required, message: '混播佣金必填', trigger: 'blur' },
        ],
      };
    };
    const setGrassRules = (required: boolean) => {
      kolFormRules.value = {
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
      };
    };
    const formRules = ref({
      douyin_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      douyin_id: [{ required: true, message: '请输入抖音号', trigger: 'blur' }],
      fans_number: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
      praise_number: [{ required: true, message: '请输入获赞数', trigger: 'blur' }],
    });
    const liveFormRules = ref<any>({});
    const kolFormRules = ref<any>({});
    const structData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'douyin_name',
        label: '昵称',
        children: {
          value: '',
          key: 'douyin_name',
          attrs: {
            placeholder: '请输入昵称',
            maxlength: 30,
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'douyin_id',
        label: '抖音号',
        children: {
          value: '',
          key: 'douyin_id',
          attrs: {
            placeholder: '请输入抖音号',
            maxlength: 20,
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'baiying_id',
        label: '百应ID',
        children: {
          value: '',
          key: 'baiying_id',
          attrs: {
            placeholder: '请输入百应ID',
            maxlength: 20,
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'qianchuan_uid',
        label: 'UID',
        children: {
          value: '',
          key: 'qianchuan_uid',
          attrs: {
            placeholder: '请输入UID',
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
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'praise_number',
        label: '获赞数',
        children: {
          value: '',
          key: 'praise_number',
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
    ]);
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
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.pure_min_commission_percent = val;
            formData[key] = val;
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
        label: '专场佣金比例',
        children: {
          value: '',
          key: 'special_commission_min_percent',
          attrs: {
            maxlength: 11,
            placeholder: '请输入专场佣金比例',
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
    const kolStructData = ref([
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'video_1_20_star_map_price',
        label: '星图20秒成本价',
        children: {
          value: '',
          key: 'video_1_20_star_map_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入星图20秒成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.video_1_20_star_map_price = val;
            formData[key] = val;
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'video_21_60_star_map_price',
        label: '星图20-60秒成本价',
        children: {
          value: '',
          key: 'video_21_60_star_map_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入星图20-60秒成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.video_21_60_star_map_price = val;
            formData[key] = val;
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'video_gt_60_star_map_price',
        label: '星图60秒以上成本价',
        children: {
          value: '',
          key: 'video_gt_60_star_map_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入星图60秒以上成本价',
          },
        },
        on: {
          input: function (val: string, formData: any, key: string) {
            rulesChangeCondition.value.video_gt_60_star_map_price = val;
            formData[key] = val;
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'shopcart_without_fee_price',
        label: '购物车费用（不含税）',
        children: {
          value: '',
          key: 'shopcart_without_fee_price',
          attrs: {
            maxlength: 11,
            placeholder: '请输入购物车费用（不含税）',
          },
        },
      },
      {
        component: 'el-input',
        className: 'common-input',
        prop: 'shopcart_min_commission_percent',
        label: '购物车佣金',
        children: {
          value: '',
          key: 'shopcart_min_commission_percent',
          attrs: {
            maxlength: 11,
            placeholder: '请输入购物车佣金',
          },
        },
      },
    ]);
    const kolTag: any = inject('kolTag');
    const kolTips = ref<any>('');
    const validate = async () => {
      try {
        const douyinData = await (
          ctx.refs.douyinPlatform as unknown as { validate: () => void }
        ).validate();
        const liveData = await (
          ctx.refs.douyinLivePlatform as unknown as { validate: () => void }
        ).validate();
        const kolData = await (
          ctx.refs.kolPlatform as unknown as { validate: () => void }
        ).validate();
        const obj = Object.assign(kolDouyinInfo.value, douyinData, liveData, kolData);
        return Promise.resolve({
          douyin: obj,
        });
      } catch (error) {
        return Promise.reject();
      }
    };
    watch(
      () => kolTag,
      val => {
        rulesChangeCondition.value.kolTag = val.value;
      },
      {
        deep: true,
      },
    );
    watch(
      () => editData,
      (val: any) => {
        const { kol_douyin_info } = val.value;
        if (kol_douyin_info) {
          kolDouyinInfo.value = kol_douyin_info;
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
          } = kol_douyin_info;
          formData.value = {
            douyin_name,
            douyin_id,
            baiying_id,
            qianchuan_uid,
            fans_number,
            praise_number,
          };
          liveFormData.value = {
            live_pit_price,
            live_pit_publish_price,
            mix_min_commission_percent,
            pure_min_commission_percent,
            live_special_price,
            live_special_publish_price,
            special_commission_min_percent,
            avg_sales_amount,
          };
          kolFormData.value = {
            video_1_20_star_map_price,
            video_21_60_star_map_price,
            video_gt_60_star_map_price,
            shopcart_without_fee_price,
            shopcart_min_commission_percent,
          };
          rulesChangeCondition.value.pure_min_commission_percent = pure_min_commission_percent;
          rulesChangeCondition.value.video_1_20_star_map_price = video_1_20_star_map_price;
          rulesChangeCondition.value.video_21_60_star_map_price = video_21_60_star_map_price;
          rulesChangeCondition.value.video_gt_60_star_map_price = video_gt_60_star_map_price;
        }
      },
      {
        deep: true,
      },
    );
    watch(
      () => props.checked,
      val => {
        rulesChangeCondition.value.checked = val;
        formRules.value = {
          douyin_name: [{ required: val, message: '请输入昵称', trigger: 'blur' }],
          douyin_id: [{ required: val, message: '请输入抖音号', trigger: 'blur' }],
          fans_number: [{ required: val, message: '请输入粉丝数', trigger: 'blur' }],
          praise_number: [{ required: val, message: '请输入获赞数', trigger: 'blur' }],
        };
      },
      {
        deep: true,
      },
    );
    watch(
      () => rulesChangeCondition.value,
      val => {
        if (val.kolTag === KolTagEnum.GRASS_KOL) {
          const required =
            rulesChangeCondition.value.checked &&
            !(
              val.video_1_20_star_map_price ||
              val.video_21_60_star_map_price ||
              val.video_gt_60_star_map_price
            );
          setGrassRules(required);
          setLiveRules(false);
          kolTips.value = '(种草达人星图报价至少填1项)';
        } else if (val.kolTag === KolTagEnum.LIVE_KOL) {
          if (rulesChangeCondition.value.checked && !val.pure_min_commission_percent) {
            setLiveRules(true);
          } else {
            setLiveRules(false);
          }
          setGrassRules(false);
          kolTips.value = '';
        } else {
          setLiveRules(false);
          setGrassRules(false);
          kolTips.value = '';
        }
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
      kolFormData,
      validate,
      kolStructData,
      kolTips,
      liveFormRules,
      kolFormRules,
      props,
    };
  },
  render() {
    return (
      <div class="base-info" style="padding:0px 18px 18px 3px;margin-top:0px">
        <platformForm
          ref="douyinPlatform"
          labelWidth="106px"
          rules={this.formRules}
          title="基础信息"
          formData={this.formData}
          structData={this.structData}
          required={this.props.checked}
        />
        <platformForm
          ref="douyinLivePlatform"
          labelWidth="106px"
          title="直播报价"
          structData={this.liveStructData}
          formData={this.liveFormData}
          rules={this.liveFormRules}
        />
        <platformForm
          ref="kolPlatform"
          labelWidth="106px"
          title="种草成本"
          tips={this.kolTips}
          structData={this.kolStructData}
          formData={this.kolFormData}
          rules={this.kolFormRules}
        />
      </div>
    );
  },
});
