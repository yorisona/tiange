<!--
 * @Author: 肖槿
 * @Date: 2020-04-26 15:12:20
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-05-07 12:07:51
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\kolBank.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';
import { uploadKolImage } from '@/api/medium';
import { getToken } from '@/utils/token';
export default {
  name: 'kolBank',
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
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    const descriptionAccepts = ['jpg', 'jpeg'];
    return {
      // 基础信息组件json数据
      baseData: [
        {
          components: 'el-input',
          span: 12,
          key: 'bank_card_num',
          attrs: {
            placeholder: '请输入银行卡号',
          },
          options: {
            label: '银行卡号：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'id_number',
          attrs: {
            placeholder: '请输入身份证号',
          },

          options: {
            label: '身份证号：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'bank_name',
          attrs: {
            placeholder: '请输入开户行',
          },

          options: {
            label: '开户行：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'real_name',
          attrs: {
            placeholder: '请输入真实姓名',
          },

          options: {
            label: '真实姓名：',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'phone',
          attrs: {
            placeholder: '请输入手机号',
          },

          options: {
            label: '手机号：',
          },
        },
        {
          components: 'upload-picture',
          span: 12,
          key: 'id_card_pic',
          props: {
            keyData: {
              key: 'id_card_pic',
            },
            accept: descriptionAccepts,
            token: getToken(),
          },
          on: {
            success: uploadKolImage,
          },
          options: {
            label: '身份证照片：',
          },
        },
        {
          components: 'upload-picture',
          span: 12,
          key: 'bank_card_pic',
          props: {
            keyData: {
              key: 'bank_card_pic',
            },
            accept: descriptionAccepts,
            token: getToken(),
          },
          on: {
            success: uploadKolImage,
          },
          options: {
            label: '银行卡照片：',
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
            title: this.title,
            titleClass: 'content-header',
            labelWidth: '120px',
          },
          class: 'kol-content-body',
          ref: 'ContractInfo',
        }),
      ],
    );
  },
  methods: {
    /*
    validate() {
      return new Promise(async (resolve, reject) => {
        try {
          const baseInfo = await this.$refs.ContractInfo.validate();
          const _data = Object.assign(this.editForm || {}, baseInfo);
          resolve({ bank_info: _data });
        } catch (err) {
          this.$message.warning('请确认主播信息完整');
          reject();
        }
      });
    },
    */
    async validate() {
      try {
        const baseInfo = await this.$refs.ContractInfo.validate();
        const _data = { ...this.editForm, ...baseInfo };
        return Promise.resolve({ bank_info: _data });
      } catch (err) {
        this.$message.warning('请确认主播信息完整');
        return Promise.reject();
      }
    },
    resetForm() {
      this.$refs.ContractInfo.resetFields();
    },
  },
};
</script>
