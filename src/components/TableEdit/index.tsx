import {
  defineComponent,
  provide,
  Ref,
  ref,
  watchEffect,
  PropType,
  computed,
  nextTick,
} from '@vue/composition-api';
import { ListResponse } from '@/types/base/http';

export type RequestFunc<T> = () => Promise<ListResponse<T>>;

export interface EditActions {
  addRow: (
    row?: Record<any, any>,
    param?: {
      isEditing: boolean;
      isToBottom?: boolean;
    },
  ) => void;
  deleteRow: (index: number) => void;
  startEditable: (index: number) => void;
  cancelEditable: (index: number) => void;
  saveEditable: (index: number) => void;
  saveEditableAll: () => void;
  cancelEditableAll: () => void;
}

export interface FormModelItem {
  isEditing: boolean;
  isNew: boolean;
  data: Record<string | number | symbol, any>;
  formData: Record<string | number | symbol, any>;
}

export interface FormModel {
  model: FormModelItem[];
}

export type FormProps = Set<string>;

export interface ExportData {
  tableData: Record<string | number | symbol, any>[];
  resultData: Record<string | number | symbol, any>[];
  editActions: EditActions;
  validate: () => Promise<boolean>;
}

export default defineComponent({
  name: 'TableEdit',
  props: {
    /**
     * @description: 请求方法
     * @type: Function
     */
    request: {
      type: Function as PropType<RequestFunc<any>>,
    },
    /**
     * @description: 数据源
     */
    dataSource: {
      type: Array,
      default: () => [],
    },
    isAutonomy: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const formModel = ref<FormModel>({
      model: [],
    });
    const form = ref<any>(null);
    const formProps = ref<FormProps>(new Set());
    const loading = ref(false);
    const tableData = computed(() =>
      formModel.value.model.map(({ data, formData }) => (props.isAutonomy ? formData : data)),
    );
    const resultData = computed(() => {
      return formModel.value.model.reduce((resultData: any[], model: FormModelItem) => {
        if (model.isNew) {
          return resultData;
        }
        resultData.push({
          ...model[props.isAutonomy ? 'formData' : 'data'],
        });
        return resultData;
      }, []);
    });
    const convertFormModel = (data: any[]): FormModelItem[] =>
      data.map((row: any): FormModelItem => {
        return {
          data: { ...row },
          formData: { ...row },
          isEditing: false,
          isNew: false,
        };
      });

    watchEffect(async () => {
      const model = [...props.dataSource];
      if (typeof props.request === 'function') {
        loading.value = true;
        const data = await Promise.resolve(props.request());
        loading.value = false;
        if (data.data.success) {
          model.push(...data.data.data.data);
        }
      }
      console.log('触发-------------------');
      formModel.value.model = convertFormModel(model);
    });
    const generateValidateFields = (index: number) =>
      Array.from(formProps.value).map(prop => {
        return `model.${index}.formData.${prop}`;
      });

    const startEditable = (index: number) => {
      formModel.value.model[index].isEditing = true;
    };

    const deleteRow = (index: number) => {
      formModel.value.model.splice(index, 1);
    };

    /**
     *
     * @param row 行数据
     * @param param
     * @param param.isEditing 是否编辑状态
     * @param param.isToBottom 是否滚动到底部
     */
    const addRow = async (
      row: Record<any, any> = {},
      param: {
        isEditing?: boolean;
        isToBottom?: boolean;
      } = {
        isEditing: true,
        isToBottom: true,
      },
    ) => {
      formModel.value.model.push({
        data: { ...row },
        formData: { ...row },
        isEditing: param.isEditing ?? true,
        isNew: param.isEditing ?? true,
      });
      if (param.isToBottom) {
        const tableEditEl = document.getElementById('TableEditEl');
        const elTableBody = tableEditEl!.querySelector('.el-table__body');
        const elTableBodyWrapper = tableEditEl!.querySelector('.el-table__body-wrapper');
        nextTick(() => {
          elTableBodyWrapper!.scrollTop = elTableBody!.scrollHeight;
        });
      }
    };

    const cancelEditable = (index: number) => {
      if (!form.value) {
        return;
      }

      // form.value.resetFields && form.value.resetFields(generateValidateFields(index));
      const formModelItem = formModel.value.model[index];
      formModelItem.formData = { ...formModelItem.data };
      if (formModelItem.isNew) {
        formModel.value.model.splice(index, 1);
      } else {
        formModelItem.isEditing = false;
      }
    };

    const cancelEditableAll = () => {
      formModel.value.model.forEach((item, index) => {
        item.isNew = false;
        cancelEditable(index);
      });
    };

    const saveEditable = (index: number) => {
      if (!form.value) {
        return;
      }
      let validateSucceedCount = 0;
      form.value.validateField &&
        form.value.validateField(generateValidateFields(index), (validated: boolean) => {
          if (validated) {
            return;
          }
          validateSucceedCount++;
          if (validateSucceedCount === generateValidateFields(index).length) {
            const formModelItem = formModel.value.model[index];
            formModelItem.data = { ...formModelItem.formData };
            formModelItem.isEditing = false;
            formModelItem.isNew = false;
          }
        });
    };

    const saveEditableAll = () => {
      formModel.value.model.forEach((item, index) => {
        saveEditable(index);
      });
    };

    //保存校验
    const validate = async (): Promise<boolean> => {
      return new Promise(resolve => {
        form.value.validate((validated: boolean) => {
          resolve(validated);
        });
      });
    };
    /** 公用操作方法-可自行拓展 */
    const editActions: EditActions = {
      addRow,
      deleteRow,
      startEditable,
      cancelEditable,
      saveEditable,
      cancelEditableAll,
      saveEditableAll,
    };

    provide<Ref<FormModel>>('formModel', formModel);

    provide<Ref<FormProps>>('formProps', formProps);

    provide<EditActions>('editActions', editActions);
    return {
      formModel,
      editActions,
      tableData,
      resultData,
      form,
      loading,
      validate,
    };
  },
  render() {
    const { formModel, tableData, loading } = this;

    const props = {
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      props: this.$props,
    };
    return (
      <div>
        <el-form id="TableEditEl" ref="form" v-loading={loading} attrs={{ model: formModel }}>
          <tg-table {...props} data={tableData}>
            {this.$slots.default}
          </tg-table>
          {this.$slots.addBtn}
        </el-form>
      </div>
    );
  },
});
