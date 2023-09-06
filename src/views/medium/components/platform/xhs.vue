<!--
 * @Author: 肖槿
 * @Date: 2020-04-23 15:38:47
 * @Description: 
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-18 14:00:30
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\xhs.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';
import { directOriginalList } from '@/const/kolConst';
import { setPositiveNumber } from './utils';

const isPersonal = [
  {
    label: '个人',
    value: 1,
  },
];
export default {
  name: 'xhs',
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
          key: 'xhs_name',
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
          key: 'xhs_id',
          attrs: {
            placeholder: '请输入小红书号',
          },

          options: {
            label: '小红书号：',
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
          key: 'praise_collection',
          attrs: {
            placeholder: '请输入获赞与收藏',
          },

          options: {
            label: '获赞与收藏(万)：',
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
          colStyle: 'height:70px;padding-right:0;',
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
              top: '35px',
            },
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'notes_number',
          attrs: {
            placeholder: '请输入笔记数',
          },

          options: {
            label: '笔记数：',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '篇',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'image_text_percent',
          attrs: {
            placeholder: '请输入占比',
          },

          options: {
            label: '近半年发布图文笔记占比：',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'video_percent',
          attrs: {
            placeholder: '请输入占比',
          },

          options: {
            label: '近半年发布图视频笔记占比：',
          },
          slot: {
            name: 'append',
            template: 'template',
            text: '%',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'percent_rebate',
          attrs: {
            placeholder: '请输入返点数',
          },

          options: {
            label: '返点数：',
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
          key: 'is_partner',

          options: {
            label: '是否品牌合作人：',
          },
        },
      ],
      liveData: [
        {
          components: 'el-input',
          span: 12,
          key: 'live_cost_price',
          attrs: {
            placeholder: '请输入直播成本价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          options: {
            label: '直播成本价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'live_publish_price',
          attrs: {
            placeholder: '请输入直播刊例价',
          },

          nativeOn: {
            keyup: (val, obj, key) => {
              setPositiveNumber(val, obj, key);
            },
          },
          options: {
            label: '直播刊例价：',
          },
        },
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
        {
          components: 'el-input',
          span: 12,
          key: 'brand_partner_video_price',
          attrs: {
            placeholder: '请输入品牌合作人后台视频报价',
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
            label: '品牌合作人后台视频报价：',
          },
        },
      ],
      pictureData: [
        {
          components: 'el-input',
          span: 12,
          key: 'photo_price',
          attrs: {
            placeholder: '请输入图文成本价',
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

          slot: {
            name: 'append',
            template: 'template',
            text: '元 / 篇',
          },
          options: {
            label: '图文刊例价：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'brand_partner_image_text_price',
          attrs: {
            placeholder: '请输入品牌合作人后台图文报价',
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
            label: '品牌合作人后台图文报价：',
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
            labelPosition: 'top',
            title: '基础信息',
            gutter: 40,
          },
          style: 'padding: 0 20px;',
          ref: 'BaseInfo',
        }),
        h('GoodAtPlatform', {
          props: {
            baseData: this.liveData,
            editForm: this.editForm,
            labelPosition: 'top',
            title: '直播',
            gutter: 40,
          },
          style: 'padding: 0 20px;',
          ref: 'LiveInfo',
        }),
        h('GoodAtPlatform', {
          props: {
            baseData: this.redioData,
            editForm: this.editForm,
            labelPosition: 'top',
            title: '视频',
            gutter: 40,
          },
          style: 'padding: 0 20px;',
          ref: 'RedioInfo',
        }),
        h('GoodAtPlatform', {
          props: {
            baseData: this.pictureData,
            editForm: this.editForm,
            labelPosition: 'top',
            title: '图文',
            gutter: 40,
          },
          style: 'padding: 0 20px;',
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
          const liveInfo = await this.$refs.LiveInfo.validate();
          const redioInfo = await this.$refs.RedioInfo.validate();
          const pictureInfo = await this.$refs.PictureInfo.validate();
          const _data = Object.assign(
            this.editForm || {},
            baseInfo,
            redioInfo,
            pictureInfo,
            liveInfo,
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
          ...redioInfo,
          ...pictureInfo,
          ...liveInfo,
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
