<!--
 * @Author: 肖槿
 * @Date: 2020-04-27 14:51:40
 * @Description: 
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-05-07 12:07:40
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\kolAli.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';

export default {
  name: 'kolAli',
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
    return {
      // 基础信息组件json数据
      baseData: [
        {
          components: 'el-input',
          span: 12,
          key: 'alipay_name',
          attrs: {
            placeholder: '请输入支付宝姓名',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '支付宝姓名：',
            prop: 'alipay_name',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'alipay_account',
          attrs: {
            placeholder: '请输入支付宝账号',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '支付宝账号：',
            prop: 'alipay_account',
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
          resolve({ alipay_info: _data });
        } catch (err) {
          this.$message.warning('请确认主播信息完整');
          reject();
        }
      });
    },*/
    async validate() {
      try {
        const baseInfo = await this.$refs.ContractInfo.validate();
        const _data = { ...this.editForm, ...baseInfo };
        return Promise.resolve({ alipay_info: _data });
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
