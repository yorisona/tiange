<!--
 * @Author: 肖槿
 * @Date: 2020-04-27 14:59:40
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-30 14:35:23
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\kolPublic.vue
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
          key: 'bank_card_number',
          attrs: {
            placeholder: '请输入银行卡号',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '银行卡号：',
            prop: 'bank_card_number',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'bank_of_deposit',
          attrs: {
            placeholder: '请输入开户行',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '开户行：',
            prop: 'bank_of_deposit',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'collecting_company',
          attrs: {
            placeholder: '请输入公司名称',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '公司名称：',
            prop: 'collecting_company',
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
          resolve({ account_info: _data });
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
        return Promise.resolve({ account_info: _data });
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
