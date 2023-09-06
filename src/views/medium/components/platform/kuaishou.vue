<!--
 * @Author: 肖槿
 * @Date: 2020-04-23 16:22:19
 * @Description: 
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-18 13:59:00
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\kuaishou.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';
import { setPositiveNumber } from './utils';

export default {
  name: 'kuaishou',
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
          key: 'kuaishou_name',
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
          key: 'kuaishou_id',
          attrs: {
            placeholder: '请输入快手号',
          },

          options: {
            label: '快手号：',
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
            text: '元 / 场',
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
            text: '元 / 场',
          },
          options: {
            label: '专场刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'live_mix_price',
          attrs: {
            placeholder: '请输入混播成本价',
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
          key: 'live_mix_publish_price',
          attrs: {
            placeholder: '请输入混播刊例价',
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
            label: '混播刊例价：',
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
    };
  },
  render(h) {
    return h(
      'div',
      {
        class: '',
      },
      [
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
      ],
    );
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
