/**
 * 班次设置
 */
import { defineComponent, PropType, ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ValidateCallback } from '@/types/vendor/form';
import { EditCostShare, getProjectids } from '@/services/finance/costshare';
import { MaycurListExpenseTypes } from '@/services/maycur';
import { getPositiveNumber } from '@/utils/string';

type form_type = {
  project_uid: string | undefined;
  project_name: string;
  allocated_time: string;
  allocated_amount: string | undefined;
  expense_type_biz_code: number | undefined;
  expense_type_name: string;
  multistage_department_name: string | undefined;
  id: number | string | undefined;
};
export default defineComponent({
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    costData: {
      type: Object as PropType<form_type>,
      required: true,
      require: true,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const formRef = ref<ElForm | null>(null);
    const form = ref<form_type>({
      project_uid: undefined,
      project_name: '',
      allocated_time: '',
      allocated_amount: '',
      expense_type_biz_code: undefined,
      expense_type_name: '',
      multistage_department_name: undefined,
      id: undefined,
    });
    const formRules = ref({
      // project_uid: [{ required: true, message: '请选择归属项目', trigger: 'change' }],
      // allocated_time: [{ required: true, message: '请选择日期', trigger: 'change' }],
      // expense_type_biz_code: [
      //   { required: true, message: '请输入名称搜索费用类别', trigger: 'blur' },
      // ],
      allocated_amount: [
        { required: true, message: '请输入分摊金额', trigger: 'blur' },
        {
          validator: (_: any, value: any, callback: ValidateCallback) => {
            const value_str = String(value);
            if (value === '0' || Number(value) === 0) {
              callback(new Error('分摊金额不能为0'));
            } else if (value_str.indexOf('.') !== -1 && value_str.split('.').length > 2) {
              callback(new Error('请输入正确格式的金额')); //防止输入多个小数点
            } else if (value_str.indexOf('.') !== -1 && value_str.split('.')[1].length > 2) {
              callback(new Error('请输入两位小数')); //小数点后两位
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
    });
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    // 保存
    const handleSaveAction = async () => {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }
      saveLoading.value = true;
      const res = await EditCostShare({
        allocated_amount: Number(form.value.allocated_amount),
        // allocated_time: form.value.allocated_time,
        // expense_type_biz_code: form.value.expense_type_biz_code,
        id: form.value.id || undefined,
        // project_uid: form.value.project_uid,
      });
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message || '保存成功');
        ctx.emit('closeAction', true);
      } else {
        ctx.root.$message.error(res.data.message || '保存失败');
      }
    };
    watch(
      () => props.visiable,
      () => {
        if (props.visiable) {
          form.value = {
            project_uid: props.costData.project_uid ? props.costData.project_uid : undefined,
            project_name: props.costData.project_name || '',
            allocated_time: props.costData.allocated_time
              ? props.costData.allocated_time.replace('.', '-')
              : '',
            allocated_amount: props.costData.allocated_amount || undefined,
            expense_type_biz_code: props.costData.expense_type_biz_code || undefined,
            expense_type_name: props.costData.expense_type_name || '',
            multistage_department_name: props.costData.multistage_department_name,
            id: props.costData.id || '',
          };
          getProjectIds(form.value.project_name);
          getExpenseIds('');
        }
      },
    );
    const project_ids = ref<any[]>([]);
    const selectProjrctIDChange = (val: any) => {
      form.value.project_uid = val;
      project_ids.value.map((item: any) => {
        if (item.project_uid === val) {
          form.value.project_name = item.project_name;
        }
      });
    };
    // 关联项目
    const getProjectIds = (val: any) => {
      getProjectids({
        project_name: val,
      }).then(({ data }) => {
        if (data.success) {
          const arr: any = [];
          let oproject_ids = data.data || [];
          if (oproject_ids.length < 1 && form.value.project_name && form.value.project_uid) {
            oproject_ids = [
              {
                project_name: form.value.project_name,
                project_uid: form.value.project_uid,
              },
            ];
          }
          arr.push(...oproject_ids);
          project_ids.value = arr;
        }
      });
    };
    const expense_category_ids = ref<any[]>([]);
    const selectExpenseIDChange = (val: any) => {
      form.value.expense_type_biz_code = val;
      expense_category_ids.value.map((item: any) => {
        if (item.expense_type_biz_code === val) {
          form.value.expense_type_name = item.expense_type_name;
        }
      });
    };
    // 费用类别
    const getExpenseIds = (val: any) => {
      MaycurListExpenseTypes({ num: 1000, page_num: 1, is_active: 1 }).then(({ data }) => {
        if (data.success) {
          const arr: any = [];
          const expense_category: any = data.data || { data: [] };
          let expense_category_arr: any = expense_category.data || [];
          if (
            expense_category_arr.length < 1 &&
            form.value.expense_type_name &&
            form.value.expense_type_biz_code
          ) {
            expense_category_arr = [
              {
                expense_type_biz_code: form.value.expense_type_biz_code,
                expense_type_name: form.value.expense_type_name,
              },
            ];
          }
          arr.push(...expense_category_arr);
          expense_category_ids.value = arr;
        }
      });
    };
    return {
      expense_category_ids,
      selectExpenseIDChange,
      getExpenseIds,
      formRef,
      formRules,
      project_ids,
      selectProjrctIDChange,
      getProjectIds,
      form,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
  methods: {
    getfixPositiveNumber(value: any) {
      if (value >= 0) {
        if (value > 100000000) {
          const arr = String(this.form.allocated_amount).split('');
          arr.pop();
          this.form.allocated_amount = arr.join('');
          this.form.allocated_amount = getPositiveNumber(this.form.allocated_amount);
        } else {
          const arr = String(value).split('.');
          if (arr.length > 1 && String(arr[1]).length > 2) {
            this.form.allocated_amount = arr[0] + '.' + String(arr[1]).substring(0, 2);
          } else {
            this.form.allocated_amount = value;
          }
        }
      } else if (value < 0) {
        if (value < -100000000) {
          const arr = String(this.form.allocated_amount).split('');
          arr.pop();
          this.form.allocated_amount = arr.join('');
        } else {
          const arr = String(value).split('.');
          if (arr.length > 1 && String(arr[1]).length > 2) {
            this.form.allocated_amount = arr[0] + '.' + String(arr[1]).substring(0, 2);
          } else {
            this.form.allocated_amount = value;
          }
        }
      }
    },
    blurPositiveNumber(value: any) {
      const arr = String(this.form.allocated_amount).split('');
      if (arr.length > 0 && arr[arr.length - 1] === '.') {
        arr.pop();
        this.form.allocated_amount = arr.join('');
      }
      if (arr.length > 0 && arr[0] === '.') {
        this.form.allocated_amount = undefined;
      }
    },
  },
});
