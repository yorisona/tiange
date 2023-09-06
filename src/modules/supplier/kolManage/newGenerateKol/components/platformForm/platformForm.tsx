/*
 * @Author: 肖槿
 * @Date: 2021-07-23 17:53:33
 * @Description: kol创建通用表单
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-05 18:10:02
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\generateKol\components\platformForm\platformForm.tsx
 */
import { defineComponent, ref, onMounted, watch } from '@vue/composition-api';
import { deepClone } from '@/utils/tools';
import { ElForm } from 'element-ui/types/form';

export default defineComponent({
  name: 'platformForm',
  props: {
    labelWidth: {
      type: String,
      default: '106px',
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    structData: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '基础信息',
    },
    tips: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  setup(prop, ctx) {
    const commonObj: any = ref({
      douyin_type: [],
    });
    const validate = async () => {
      try {
        const result = await (ctx.refs.formRef as ElForm).validate();
        if (result) {
          return Promise.resolve(commonObj.value);
        } else {
          return Promise.reject();
        }
      } catch (error) {
        return Promise.reject();
      }
    };
    watch(
      () => prop.formData,
      (val: any) => {
        commonObj.value = val;
      },
    );
    watch(
      () => prop.rules,
      (val: any) => {
        const formData: any = deepClone(commonObj.value);
        (ctx.refs.formRef as ElForm).resetFields();
        commonObj.value = formData;
      },
      {
        deep: true,
      },
    );
    onMounted(() => {
      commonObj.value = deepClone(prop.formData);
    });
    return {
      commonObj,
      validate,
      prop,
    };
  },
  render() {
    const arr = this.structData;
    const arrSlice = [];
    for (let i = 0; i < arr.length / 4; i++) {
      const arrSplice = arr.slice(i * 4, (i + 1) * 4);
      arrSlice.push(arrSplice);
    }
    return (
      <div class="border-card-base-info">
        <el-form
          attrs={{ model: this.commonObj }}
          rules={this.prop.rules}
          ref="formRef"
          label-position="top"
          size="mini"
          label-width={this.labelWidth}
        >
          <div class="form-container">
            {this.title ? (
              <div class="base-item-title">
                {this.required ? <span class="star">* </span> : ''}
                <span class="title">{this.title}</span>
                {this.tips ? <span class="tips">{this.tips}</span> : ''}
              </div>
            ) : (
              ''
            )}
            {arrSlice
              ? arrSlice.map((subArr: any) => {
                  return (
                    <div class="flex-line-box">
                      {subArr.map((item: any) => {
                        if (item.component === 'el-input') {
                          const { label, prop, children, unit, on } = item;
                          return (
                            <div class="flex-line-item-4">
                              <el-form-item label={label} prop={prop}>
                                <el-input
                                  v-model={this.commonObj[children.key]}
                                  show-word-limit={true}
                                  {...children}
                                  onInput={(val: string) => {
                                    on?.input?.apply(this, [val, this.commonObj, children.key]);
                                  }}
                                >
                                  {unit && <span slot="append">{unit}</span>}
                                </el-input>
                              </el-form-item>
                            </div>
                          );
                        } else if (item.component === 'el-select') {
                          const { label, prop, children, selectOptions, on, labelSlot } = item;
                          return (
                            <div class="flex-line-item-4">
                              <el-form-item prop={prop}>
                                <span slot="label">
                                  {label}
                                  {labelSlot && (
                                    <el-tooltip
                                      popper-class="sales-popper-class"
                                      content={labelSlot}
                                      placement="top"
                                      effect="light"
                                    >
                                      <tg-icon style="margin-left:5px" name="ico-question" />
                                    </el-tooltip>
                                  )}
                                </span>
                                <el-select
                                  popper-class="el-select-popper-mini"
                                  v-model={this.commonObj[children.key]}
                                  attrs={{ ...children.attrs }}
                                  on={{ ...on }}
                                >
                                  {selectOptions.data.map((item: any) => {
                                    return (
                                      <el-option
                                        key={item[selectOptions.key]}
                                        label={item[selectOptions.key]}
                                        value={item[selectOptions.val]}
                                      />
                                    );
                                  })}
                                </el-select>
                              </el-form-item>
                            </div>
                          );
                        } else if (item.component === 'el-radio-group') {
                          const { label, prop, children, selectOptions, on } = item;
                          return (
                            <div class="flex-line-item-4">
                              <el-form-item label={label} prop={prop}>
                                <el-radio-group
                                  v-model={this.commonObj[children.key]}
                                  attrs={{ ...children.attrs }}
                                  on={{ ...on }}
                                >
                                  {selectOptions.data.map((item: any) => {
                                    return (
                                      <el-radio label={item[selectOptions.val]}>
                                        {item[selectOptions.key]}
                                      </el-radio>
                                    );
                                  })}
                                </el-radio-group>
                              </el-form-item>
                            </div>
                          );
                        } else if (item.component === 'el-checkbox-group') {
                          const { label, prop, children, selectOptions, on } = item;
                          return (
                            <div class="flex-line-item-4">
                              <el-form-item label={label} prop={prop}>
                                <el-checkbox-group
                                  v-model={this.commonObj[children.key]}
                                  attrs={{ ...children.attrs }}
                                  on={{ ...on }}
                                >
                                  {selectOptions.data.map((item: any) => {
                                    return (
                                      <el-checkbox
                                        label={item[selectOptions.val]}
                                        key={item[selectOptions.val]}
                                      >
                                        {item[selectOptions.key]}
                                      </el-checkbox>
                                    );
                                  })}
                                </el-checkbox-group>
                              </el-form-item>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })
              : ''}
          </div>
        </el-form>
      </div>
    );
  },
});
