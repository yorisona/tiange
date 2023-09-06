<!--
 * @Author: 肖槿
 * @Date: 2020-04-23 16:53:15
 * @Description: 
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-30 15:29:06
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\wechat.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';
import { directOriginalList } from '@/const/kolConst';
import { setPositiveNumber } from './utils';

export default {
  name: 'wechat',
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
          key: 'wechat_id',
          attrs: {
            placeholder: '请输入微信公众号',
          },

          options: {
            label: '微信公众号：',
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
        {
          components: 'el-radio-group',
          span: 12,
          selectOptions: {
            type: 'prop',
            data: directOriginalList,
            key: 'text',
            val: 'value',
          },
          key: 'is_original',

          options: {
            label: '是否原创：',
          },
        },
        {
          components: 'el-radio-group',
          span: 24,
          selectOptions: {
            type: 'prop',
            data: directOriginalList,
            key: 'text',
            val: 'value',
          },
          key: 'is_certification',

          options: {
            label: '是否认证：',
            style: {
              marginTop: '30px',
            },
          },
        },
      ],
      pictureData: [
        {
          components: 'el-input',
          span: 12,
          key: 'photo_headline_price',
          attrs: {
            placeholder: '请输入头条成本价',
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
            label: '头条成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'photo_headline_publish_price',
          attrs: {
            placeholder: '请输入头条刊例价',
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
            label: '头条刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'photo_second_price',
          attrs: {
            placeholder: '请输入次条成本价',
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
            label: '次条成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'photo_second_publish_price',
          attrs: {
            placeholder: '请输入次条刊例价',
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
            label: '次条刊例价：',
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
            baseData: this.pictureData,
            editForm: this.editForm,
            title: '图文',
          },
          ref: 'PictureInfo',
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
          const pictureInfo = await this.$refs.PictureInfo.validate();
          const _data = Object.assign(this.editForm || {}, baseInfo, pictureInfo);
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
        const pictureInfo = await this.$refs.PictureInfo.validate();
        const _data = { ...this.editForm, ...baseInfo, ...pictureInfo };
        return Promise.resolve(_data);
      } catch (err) {
        this.$message.warning('请确认主播信息完整');
        return Promise.reject();
      }
    },
    resetForm() {
      this.$refs.BaseInfo.resetFields();
      this.$refs.PictureInfo.resetFields();
    },
  },
};
</script>
