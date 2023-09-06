<!--
 * @Author: 肖槿
 * @Date: 2020-04-21 15:40:42
 * @Description:
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-18 13:58:20
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\douyin.vue
 -->

<script>
import GoodAtPlatform from '../goodAtPlatform';
import { redioType } from '@/const/options';
import { directOriginalList } from '@/const/kolConst';
import { setPositiveNumber } from './utils';

const isPersonal = [
  {
    label: '个人',
    value: 1,
  },
];
export default {
  name: 'douyin',
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
          key: 'douyin_name',
          attrs: {
            placeholder: '请输入昵称',
          },

          options: {
            label: '昵称：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'douyin_id',
          attrs: {
            placeholder: '请输入抖音号',
          },

          options: {
            label: '抖音号：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'fans_number',
          attrs: {
            placeholder: '请输入粉丝数',
          },

          options: {
            label: '粉丝数(万)：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'praise_number',
          attrs: {
            placeholder: '请输入获赞数',
          },

          options: {
            label: '获赞数(万)：',
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
            style: 'width: 100%;',
          },
          props: {
            clearable: true,
          },
          watchFun: {
            key: 'baseForm.company_id',
            callback: (n, o, obj) => {
              if (n && obj.is_personal) {
                obj.is_personal = '';
              }
            },
          },
          colStyle: 'height:75px;padding-right:0;',
          span: 9,
          key: 'company_id',
          labelSlot: {
            slot: 'label',
            VNode: h => {
              return h('div', {}, [
                h('span', {}, '所属机构:'),
                h(
                  'el-tooltip',
                  {
                    props: {
                      content:
                        '找不到相应的机构名称，请让媒介先到【供应商管理 → 公司库】添加公司(机构)',
                      placement: 'top',
                      effect: 'light',
                    },
                  },
                  [h('i', { class: 'el-icon-question' })],
                ),
              ]);
            },
          },
          options: {
            style: {
              position: 'relative',
            },
          },
        },
        {
          components: 'el-radio-group',
          span: 3,
          selectOptions: {
            type: 'prop',
            data: isPersonal,
            key: 'label',
            val: 'value',
          },
          watchFun: {
            key: 'baseForm.is_personal',
            callback: (n, o, obj) => {
              if (n && obj.company_id) {
                obj.company_id = '';
              }
            },
          },
          key: 'is_personal',

          options: {
            label: '',
            style: {
              position: 'relative',
              top: '32px',
            },
          },
        },
        {
          components: 'el-checkbox-group',
          span: 12,
          value: [],
          selectOptions: {
            type: 'prop',
            data: redioType,
            key: 'label',
            val: 'value',
          },
          key: 'douyin_type',

          componentsClass: 'redio-type-checked',
          options: {
            label: '类型：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'short_video_liver_price',
          attrs: {
            placeholder: '请输入打包坑位费',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          options: {
            label: '短视频 + 直播打包坑位费：',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'package_price_min_percent',
          attrs: {
            placeholder: '请输入打包最低佣金比例',
          },

          options: {
            label: '打包最低佣金比例：',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
        },
        {
          components: 'el-radio-group',
          span: 12,
          selectOptions: {
            type: 'prop',
            data: directOriginalList,
            key: 'text',
            val: 'value',
          },
          key: 'is_shopwindow',
          watchFun: {
            key: 'baseForm.is_shopwindow',
            callback: (n, o, obj) => {
              this.baseData[12].offset = obj.is_shopwindow === 1 ? 0 : 12;
            },
          },
          options: {
            label: '是否可以挂商品橱窗：',
          },
        },
        {
          components: 'el-radio-group',
          span: 12,
          selectOptions: {
            type: 'prop',
            data: directOriginalList,
            key: 'text',
            val: 'value',
          },
          key: 'is_pure_commission',
          watchFun: {
            key: 'baseForm.is_pure_commission',
            callback: (n, o, obj) => {
              this.baseData[12].offset = obj.is_shopwindow === 1 ? 0 : 12;
            },
          },
          options: {
            label: '是否接受纯佣：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'shopwindow_price',
          related: {
            key: 'is_shopwindow',
            value: 1,
            watch: 0,
          },
          attrs: {
            placeholder: '请输入',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元',
          },
          options: {
            label: '商品橱窗上架价格：',
            style: {
              background: 'rgba(248,250,252,1)',
              borderRadius: '10px',
              padding: '5px 10px',
            },
          },
        },
        {
          components: 'el-input',
          span: 12,
          offset: 0,
          key: 'pure_commission_min_percent',
          related: {
            key: 'is_pure_commission',
            value: 1,
            watch: 0,
          },
          attrs: {
            placeholder: '请输入',
          },

          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
          options: {
            label: '纯佣最低佣金比例：',
            style: {
              background: 'rgba(248,250,252,1)',
              borderRadius: '10px',
              padding: '5px 10px',
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
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
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
          key: 'live_special_price',
          attrs: {
            placeholder: '请输入专场成本价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / h',
          },
          options: {
            label: '专场成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'live_special_publish_price',
          attrs: {
            placeholder: '请输入专场刊例价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / h',
          },
          options: {
            label: '专场刊例价：',
          },
        },
        {
          components: 'el-radio-group',
          span: 12,
          selectOptions: {
            type: 'prop',
            data: directOriginalList,
            key: 'text',
            val: 'value',
          },
          key: 'is_special_commission',

          options: {
            label: '专场是否需要佣金：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'special_max_url',
          attrs: {
            placeholder: '请输入专场最高链接数',
          },

          slot: {
            name: 'append',
            template: 'template',
            text: '条',
          },
          options: {
            label: '专场最高链接数：',
          },
        },
        {
          components: 'el-input',
          span: 24,
          key: 'special_commission_min_percent',
          related: {
            key: 'is_special_commission',
            value: 1,
            watch: 0,
          },
          attrs: {
            placeholder: '请输入专场最低佣金比例',
          },

          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
          options: {
            label: '专场最低佣金比例：',
            style: {
              width: '330px',
              background: 'rgba(248,250,252,1)',
              position: 'relative',
              borderRadius: '10px',
              padding: '5px 10px',
              marginBottom: '40px',
            },
            componentsClass: 'douyin-divider',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'live_mix_price',
          attrs: {
            placeholder: '请输入混播单链接成本价',
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
          colStyle: 'height:70px',
          options: {
            label: '混播单链接成本价：',
          },
        },
        {
          components: 'el-radio-group',
          span: 12,
          selectOptions: {
            type: 'prop',
            data: directOriginalList,
            key: 'text',
            val: 'value',
          },
          key: 'is_mix_commission',

          options: {
            label: '混播场是否需要佣金：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'live_mix_publish_price',
          attrs: {
            placeholder: '请输入混播单链接刊例价',
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
            label: '混播单链接刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'mix_min_commission_percent',
          related: {
            key: 'is_mix_commission',
            value: 1,
            watch: 0,
          },
          attrs: {
            placeholder: '请输入混播场最低佣金比例',
          },

          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
          options: {
            label: '混播场最低佣金比例：',
            style: {
              background: 'rgba(248,250,252,1)',
              borderRadius: '10px',
              padding: '5px 10px',
            },
          },
        },
      ],
      // 视频组件json数据
      redioData: [
        {
          components: 'el-input',
          span: 12,
          key: 'video_1_20_price',
          attrs: {
            placeholder: '请输入1-20s视频成本价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '1-20s视频成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_21_60_price',
          attrs: {
            placeholder: '请输入20-60s视频成本价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '20-60s视频成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_1_20_publish_price',
          attrs: {
            placeholder: '请输入1-20s视频刊例价',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },

          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '1-20s视频刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_21_60_publish_price',
          attrs: {
            placeholder: '请输入20-60s视频刊例价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '20-60s视频刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_1_20_star_map_price',
          attrs: {
            placeholder: '请输入1-20s星图后台价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '1-20s星图后台价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_21_60_star_map_price',
          attrs: {
            placeholder: '请输入20-60s星图后台价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 条',
          },
          options: {
            label: '20-60s星图后台价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'star_map_rebate_percent',
          attrs: {
            placeholder: '请输入星图返点比',
          },

          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
          options: {
            label: '星图返点比：',
          },
        },
      ],
    };
  },
  watch: {
    editForm: {
      deep: true,
      immediate: true,
      handler(v) {
        if (v !== null) {
          this.baseData[12].offset = v.is_shopwindow === 1 ? 0 : 12;
        }
      },
    },
  },
  mounted() {
    /* do nth */
  },
  render(h) {
    return h('div', {}, [
      h('GoodAtPlatform', {
        props: {
          baseData: this.baseData,
          editForm: this.editForm,
          title: '基础信息',
          labelPosition: 'top',
          gutter: 40,
        },
        style: 'padding: 0 20px;',
        ref: 'BaseInfo',
      }),
      h('GoodAtPlatform', {
        props: {
          baseData: this.liveData,
          editForm: this.editForm,
          title: '直播',
          labelPosition: 'top',
          gutter: 40,
        },
        style: 'padding: 0 20px;',
        ref: 'LiveInfo',
      }),
      h('GoodAtPlatform', {
        props: {
          baseData: this.redioData,
          editForm: this.editForm,
          title: '视频',
          labelPosition: 'top',
          gutter: 40,
        },
        style: 'padding: 0 20px;',
        ref: 'RedioInfo',
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
          const _data = Object.assign(this.editForm || {}, baseInfo, liveInfo, redioInfo);
          _data.douyin_type = _data.douyin_type.length ? _data.douyin_type.join(',') : '';
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
        const _data = { ...this.editForm, ...baseInfo, ...liveInfo, ...redioInfo };
        _data.douyin_type = _data.douyin_type.length ? _data.douyin_type.join(',') : '';
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
    },
  },
};
</script>
<style lang="scss">
.redio-type-checked {
  position: relative !important;
  left: 10px !important;
}
.douyin-divider:after {
  content: '';
  position: absolute;
  width: 715px;
  height: 1px;
  bottom: 1px;
  left: 1px;
  bottom: -20px;
  background: #dfdfdf;
}
</style>
