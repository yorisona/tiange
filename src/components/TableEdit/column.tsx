import { inject, defineComponent, h, PropType, Ref, watchEffect } from '@vue/composition-api';
import { EditActions, FormModel, FormModelItem, FormProps } from './index';

interface ColumnScope {
  row?: any;
  column: any;
  $index: number;
  [key: string]: any;
}

export default defineComponent({
  name: 'EditTableColumn',
  props: {
    /**
     * @description: 字段名
     */
    prop: {
      type: String,
      default: '',
    },
    /**
     * @description: 标题
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * @description: 宽度
     */
    width: {
      type: String,
    },
    /**
     * @description: 校验规则
     */
    rules: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    /**
     * @description: 表单项属性
     */
    formItemProps: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const defaultEditActions: EditActions = {
      addRow: () => {},
      deleteRow: () => {},
      startEditable: () => {},
      cancelEditable: () => {},
      saveEditable: () => {},
      cancelEditableAll: () => {},
      saveEditableAll: () => {},
    };

    const editActions = inject<EditActions | undefined>('editActions');

    const formModel = inject<Ref<FormModel | undefined>>('formModel');

    const formProps = inject<Ref<FormProps | undefined>>('formProps');
    watchEffect(() => {
      if (props.prop) {
        formProps?.value?.add(props.prop);
      }
    });

    const getEditModel = (index: number): FormModelItem => {
      if (!formModel || !formModel.value?.model) {
        return {
          isEditing: false,
          isNew: false,
          formData: {},
          data: {},
        };
      }
      return formModel.value.model[index];
    };

    const getEditRow = (index: number): any => getEditModel(index).formData;

    const isEditing = (index: number): boolean => getEditModel(index).isEditing ?? false;

    const calculateColumnDefaultValue = (scope: ColumnScope) => {
      return scope.row?.[props.prop];
    };
    return {
      isEditing,
      getEditRow,
      calculateColumnDefaultValue,
      editActions,
      defaultEditActions,
      formModel,
    };
  },
  render() {
    const { isEditing, calculateColumnDefaultValue } = this;

    // const props = {
    //   props: {
    //     label: this.label,
    //     width: this.width,
    //     prop: this.prop,
    //   },
    // };
    const props = {
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      props: this.$props,
    };

    return (
      <el-table-column
        {...props}
        scopedSlots={{
          default: (scope: ColumnScope) => {
            const params = {
              $index: scope.$index,
              row: this.getEditRow(scope.$index),
              column: scope.column,
              actions: this.editActions ?? this.defaultEditActions,
            };

            if (this.$attrs.hasFormItem) {
              return (
                <el-form-item
                  {...this.$props.formItemProps}
                  style="margin: 0"
                  prop={`model.${scope.$index}.formData.${this.prop}`}
                  rules={this.rules}
                >
                  {this.$scopedSlots.default?.(params) ?? calculateColumnDefaultValue(scope)}
                </el-form-item>
              );
            }
            return isEditing(scope.$index) ? (
              <el-form-item
                style="margin: 0"
                {...this.$props.formItemProps}
                prop={`model.${scope.$index}.formData.${this.prop}`}
                rules={this.rules}
              >
                {this.$scopedSlots.edit?.(params) ?? calculateColumnDefaultValue(scope)}
              </el-form-item>
            ) : (
              <fragments>
                {this.$scopedSlots.default?.({
                  $index: scope.$index,
                  row: scope.row,
                  column: scope.column,
                  actions: this.editActions ?? this.defaultEditActions,
                }) ?? calculateColumnDefaultValue(scope)}
              </fragments>
            );
          },
        }}
      >
        {/* 执行所有插槽 */}
        {Object.keys(this.$slots).map(slot => {
          return <template slot={slot}>{this.$slots[slot]}</template>;
        })}
      </el-table-column>
    );
  },
});
