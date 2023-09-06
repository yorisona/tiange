<!--
 * @Author: 肖槿
 * @Date: 2020-04-21 15:33:26
 * @Description: 
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-24 16:56:55
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\taobao.vue
 -->

<script>
import GoodAtPlatform from '../goodAtPlatform';
import { salesPriceOptions } from '@/const/options';
import { setPositiveNumber } from './utils';

export default {
  name: 'taobao',
  components: {
    GoodAtPlatform,
  },
  props: {
    editForm: {
      type: Object,
      default: () => {
        /* do nth */
      },
    },
  },
  data() {
    return {
      // 基础信息组件json数据
      baseData: [
        {
          components: 'el-input',
          span: 12,
          key: 'star_name',
          attrs: {
            placeholder: '请输入昵称',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '昵称：',
            style: {
              marginBottom: '15px',
            },
            rules: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'star_id',
          attrs: {
            placeholder: '请输入淘宝ID',
          },
          props: {
            size: 'small',
          },
          options: {
            style: {
              marginBottom: '15px',
            },
            label: '淘宝ID：',
            rules: [{ required: true, message: '请输入淘宝ID', trigger: 'blur' }],
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'fans_number',
          attrs: {
            placeholder: '请输入粉丝数',
          },

          props: {
            size: 'small',
          },
          options: {
            label: '粉丝数(万)：',
          },
        },
        {
          components: 'el-select',
          selectOptions: {
            type: 'vuex',
            data: 'companyList',
            key: 'company_name',
            val: 'company_id',
          },
          attrs: {
            placeholder: '请选择所属机构',
          },
          props: {
            size: 'small',
            clearable: true,
          },
          span: 12,
          key: 'company_id',
          options: {
            style: {
              position: 'relative',
            },
            label: '所属机构：',
            slot: {
              VNode: h => {
                return h(
                  'p',
                  { class: 'mechanism-warning' },
                  '* 找不到相应的机构名称，请让媒介先到【供应商管理 → 公司库】添加公司(机构)',
                );
              },
            },
          },
        },
      ],
      // 直播组件json数据
      liveData: [
        {
          components: 'el-input',
          span: 12,
          key: 'live_price_per_hour',
          attrs: {
            placeholder: '请输入直播小时价',
          },
          props: {
            size: 'small',
          },
          nativeOn: {
            keyup: (event, obj, key) => {
              setPositiveNumber(event, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 小时',
          },
          options: {
            label: '直播小时价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'star_special_cost',
          attrs: {
            placeholder: '请输入专场成本价',
          },
          props: {
            size: 'small',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 场',
          },
          options: {
            label: '专场成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'star_special_price',
          attrs: {
            placeholder: '请输入专场刊例价',
          },
          props: {
            size: 'small',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 场',
          },
          options: {
            label: '专场刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'star_mix_cost',
          attrs: {
            placeholder: '请输入混播成本价',
          },
          props: {
            size: 'small',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 链接',
          },
          options: {
            label: '混播成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'star_mix_price',
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          attrs: {
            placeholder: '请输入混播刊例价',
          },
          props: {
            size: 'small',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 链接',
          },
          options: {
            label: '混播刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'pv_average',

          attrs: {
            placeholder: '请输入平均观看（pv）',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '平均观看（pv）：',
          },
        },
        {
          components: 'el-switch',
          span: 24,
          key: 'is_cooperation',
          value: 0,
          attrs: {
            placeholder: '请输入',
          },
          props: {
            size: 'small',
            activeValue: 1,
            inactiveValue: 0,
          },
          options: {
            label: '标记已合作：',
          },
        },
        {
          components: 'el-select',
          selectOptions: {
            type: 'prop',
            data: salesPriceOptions,
            key: 'label',
            val: 'value',
          },
          attrs: {
            placeholder: '请输入客单价',
          },
          related: {
            key: 'is_cooperation',
            value: 1,
            watch: 0,
          },
          props: {
            size: 'small',
            clearable: true,
          },

          span: 12,
          key: 'sales_price_period',
          options: {
            style: {
              position: 'relative',
            },
            label: '客单价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'wangwang_name',
          related: {
            key: 'is_cooperation',
            value: 1,
          },
          attrs: {
            placeholder: '请输入淘客ID',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '淘客ID：',
          },
        },
        {
          components: 'el-rate',
          span: 12,
          value: 0,
          related: {
            key: 'is_cooperation',
            value: 1,
          },
          style: {
            lineHeight: '50px',
          },
          key: 'responsivity',
          props: {
            size: 'small',
          },
          options: {
            label: '配合度：',
          },
        },
      ],
      // 视频组件json数据
      redioData: [
        {
          components: 'el-input',
          span: 12,
          key: 'video_price',
          attrs: {
            placeholder: '请输入视频成本价',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          props: {
            size: 'small',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '视频成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_publish_price',
          attrs: {
            placeholder: '请输入视频刊例价',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          props: {
            size: 'small',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '视频刊例价：',
          },
        },
      ],
      // 图文组件json数据
      pictureData: [
        {
          components: 'el-input',
          span: 12,
          key: 'photo_price',
          attrs: {
            placeholder: '请输入图文成本价',
          },
          props: {
            size: 'small',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 篇',
          },
          options: {
            label: '图文成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'photo_publish_price',
          attrs: {
            placeholder: '请输入图文刊例价',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          props: {
            size: 'small',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 篇',
          },
          options: {
            label: '图文刊例价：',
          },
        },
      ],
    };
  },
  render(h) {
    return h('div', {}, [
      h('GoodAtPlatform', {
        props: {
          baseData: this.baseData,
          editForm: this.editForm,
          title: '基础信息',
        },
        ref: 'BaseInfo',
      }),
      h('GoodAtPlatform', {
        props: {
          baseData: this.liveData,
          editForm: this.editForm,
          title: '直播',
        },
        ref: 'LiveInfo',
      }),
      h('GoodAtPlatform', {
        props: {
          baseData: this.redioData,
          editForm: this.editForm,
          title: '视频',
        },
        ref: 'RedioInfo',
      }),
      h('GoodAtPlatform', {
        props: {
          baseData: this.pictureData,
          editForm: this.editForm,
          title: '图文',
        },
        ref: 'PictureInfo',
      }),
    ]);
  },
  methods: {
    /*
    validate() {
      return new Promise(async (resolve, reject) => {
        try {
          const baseInfo = await this.$refs.BaseInfo.validate();
          const liveInfo = await this.$refs.LiveInfo.validate();
          const redioInfo = await this.$refs.RedioInfo.validate();
          const pictureInfo = await this.$refs.PictureInfo.validate();
          const _data = Object.assign(
            this.editForm || {},
            baseInfo,
            liveInfo,
            redioInfo,
            pictureInfo,
          );
          resolve(_data);
        } catch (err) {
          this.$message.warning('请确认主播信息完整');
          reject();
        }
      });
    },
    */
    async validate() {
      try {
        const baseInfo = await this.$refs.BaseInfo.validate();
        const liveInfo = await this.$refs.LiveInfo.validate();
        const redioInfo = await this.$refs.RedioInfo.validate();
        const pictureInfo = await this.$refs.PictureInfo.validate();
        const _data = {
          ...this.editForm,
          ...baseInfo,
          ...liveInfo,
          ...redioInfo,
          ...pictureInfo,
        };
        return Promise.resolve(_data);
      } catch (err) {
        this.$message.warning('请确认主播信息完整');
        return Promise.reject();
      }
    },
    resetForm() {
      this.$refs.BaseInfo.resetFields();
      this.$refs.LiveInfo.resetFields();
      this.$refs.RedioInfo.resetFields();
      this.$refs.PictureInfo.resetFields();
    },
  },
};
</script>
