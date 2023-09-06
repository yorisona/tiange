<!--
 * @Author: 肖槿
 * @Date: 2020-04-26 15:01:32
 * @Description: 
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-30 16:53:42
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\kolContact.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';
import { onlyNumber } from '@/utils/tools';

export default {
  name: 'kolContact',
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
          key: 'contacts',
          attrs: {
            placeholder: '请输入联系人姓名',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '联系人：',
            prop: 'contacts',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'contact_phone',
          attrs: {
            placeholder: '请输入联系人电话',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '联系人电话：',
            prop: 'contact_phone',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'contact_wechat',
          attrs: {
            placeholder: '请输入微信',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '微信号：',
            prop: 'contact_wechat',
          },
        },
        {
          components: 'el-input',
          span: 12,
          key: 'contact_qq',
          attrs: {
            placeholder: '请输入QQ号',
          },
          nativeOn: {
            keyup: (val, obj, key) => {
              onlyNumber(val, obj, key);
            },
          },
          props: {
            size: 'small',
          },
          options: {
            label: 'QQ号：',
            prop: 'contact_qq',
          },
        },
        {
          components: 'add-addr',
          span: 24,
          key: 'areaObj',
          componentsClass: 'add-addr-select',
          value: {
            county: '',
            province: '',
            city: '',
          },
          props: {
            size: 'small',
          },
          options: {
            label: '所在地区：',
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
          const { province, city, county } = _data.areaObj;
          _data.province = province;
          _data.city = city;
          _data.county = county;
          delete _data.areaObj;
          resolve(_data);
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
        const { province, city, county } = _data.areaObj;
        _data.province = province;
        _data.city = city;
        _data.county = county;
        delete _data.areaObj;
        return Promise.resolve(_data);
      } catch (err) {
        this.$message.warning('请确认主播信息完整');
        return Promise.reject();
      }
    },
    resetForm() {
      this.$refs.ContractInfo.resetFields();
      this.$refs.ContractInfo.resetFiled('areaObj', {
        county: '',
        province: '',
        city: '',
      });
    },
  },
};
</script>
<style lang="scss">
.add-addr-select {
  .el-select {
    width: 195px !important;
  }
}
</style>
