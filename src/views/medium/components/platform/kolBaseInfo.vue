<!--
 * @Author: 肖槿
 * @Date: 2020-04-23 17:58:40
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-24 17:02:43
 * @FilePath: \goumee-star-frontend\src\views\medium\components\platform\kolBaseInfo.vue
 -->
<script>
import GoodAtPlatform from '../goodAtPlatform';
import { directOriginalList, kolTag, areaType } from '@/const/kolConst';
import { BusinessTypeOptions } from '@/types/tiange/common';

import { uploadCase } from '@/api/medium';

export default {
  name: 'kolBaseInfo',
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
    const descriptionAccepts = ['docx', 'pdf', 'jpg', 'xlsx'];
    const isAll = this.editForm ? areaType.length === this.editForm.areas.length : false;
    let isIsIndeterminate = false;
    if (this.editForm) {
      isIsIndeterminate =
        areaType.length === this.editForm.areas.length
          ? false
          : this.editForm.areas.length !== 0
          ? true
          : false;
    }
    return {
      // 基础信息组件json数据
      baseData: [
        {
          components: 'el-input',
          span: 24,
          key: 'kol_name',
          attrs: {
            placeholder: '请输入KOL名称',
          },
          props: {
            size: 'small',
          },
          ref: 'autoFocuseRef',
          options: {
            label: 'KOL名称：',
            prop: 'kol_name',
            rules: [{ required: true, message: '请输入KOL名称', trigger: 'blur' }],
          },
        },
        {
          components: 'el-radio-group',
          span: 24,
          selectOptions: {
            type: 'prop',
            data: kolTag,
            key: 'value',
            val: 'key',
          },
          key: 'kol_tag',
          props: {
            size: 'small',
          },
          options: {
            label: 'KOL标签：',
            prop: 'kol_tag',
            rules: [{ required: true, message: '请选择kol标签', trigger: 'change' }],
          },
        },
        {
          components: 'el-checkbox-group',
          span: 24,
          value: [],
          selectOptions: {
            type: 'prop',
            data: BusinessTypeOptions,
            key: 'label',
            val: 'value',
          },
          key: 'business_type',
          props: {
            size: 'small',
          },
          options: {
            label: '业务类型：',
            prop: 'business_type',
            rules: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
            style: {
              marginTop: '15px',
            },
          },
        },
        {
          components: 'el-checkbox-group',
          span: 24,
          value: [],
          selectOptions: {
            type: 'prop',
            data: areaType,
            key: 'value',
            val: 'key',
          },
          key: 'areas',
          props: {
            size: 'small',
          },
          hasAll: {
            checkAll: isAll,
            isIndeterminate: isIsIndeterminate,
            class: 'kol-check-all',
          },
          options: {
            label: '擅长领域：',
            prop: 'areas',
            style: {
              marginTop: '15px',
            },
          },
        },
        {
          components: 'brand',
          span: 24,
          key: 'cooperation_brand',
          value: [],
          options: {
            label: '已合作品牌：',
            prop: 'cooperation_brand',
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
          key: 'special_ticket',
          props: {
            size: 'small',
          },
          options: {
            label: '是否可以专票：',
            prop: 'special_ticket',
          },
        },
        {
          components: 'upload-file',
          span: 24,
          key: 'case',
          value: [],
          props: {
            size: 'small',
            accept: descriptionAccepts,
          },
          on: {
            success: uploadCase,
          },
          options: {
            label: 'KOL案例：',
            prop: 'case',
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
          ref: 'BaseInfo',
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
          const _data = Object.assign(this.editForm || {}, baseInfo);
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
        const _data = { ...this.editForm, ...baseInfo };
        return Promise.resolve(_data);
      } catch (err) {
        this.$message.warning('请确认主播信息完整');
        return Promise.reject();
      }
    },
    resetForm() {
      this.$refs.BaseInfo.resetFields();
      this.$refs.BaseInfo.resetFiled('areas', []);
      this.$refs.BaseInfo.resetFiled('cooperation_brand', []);
      this.$refs.BaseInfo.resetFiled('case', []);

      this.$refs.BaseInfo.resetFiled('business_type', []);
    },
  },
};
</script>
<style lang="less">
.kol-info-container {
  margin-bottom: 10px;
  & .el-checkbox-group {
    background-color: #f6f6f6;
    padding: 0 0 10px 13px;
    line-height: 26px;
    & .el-checkbox {
      margin: 8px 5px 0 0;
      min-width: 78px;
    }
  }
  .kol-check-all {
    display: block;
    width: 98%;
    background: #f6f6f6;
    padding: 5px 0 0 12px;
    line-height: 1px;
  }
}
</style>
