import { defineComponent, ref, toRefs } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { sleep } from '@/utils/func';
import {
  Query_Design_Type_Fields,
  Query_Design_Type_Department,
  Save_Design_Type_Form,
} from '@/services/design';
type option_form = {
  id: number;
  name: string;
};
export default defineComponent({
  name: 'newTypeDialog',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {},
  setup(props, ctx) {
    const saveLoading = ref(false);
    // const department_name = computed(() => {
    //   return ctx.root.$store.getters['user/getUserInfo'].department_name;
    // })
    const orderFormRef = ref<ElForm | undefined>(undefined);
    const initOrderForm = () => {
      return {
        delivery_days: '',
        team_id: undefined,
        id: undefined,
        name: '',
        ...toRefs(props.data),
        fields: props.data
          ? (props.data.fields || []).map((item: option_form) => {
              return Number(item.id);
            })
          : [],
        addition_content: props.data
          ? (props.data.addition_content || []).map(
              (item: {
                delivery_content: string;
                delivery_days: number;
                file_extension_id: number;
                name: string;
                is_required: 0 | 1;
              }) => {
                return {
                  name: item.name,
                  delivery_days: item.delivery_days,
                  delivery_content: item.delivery_content,
                  file_extension: item.file_extension_id,
                  is_required: item.is_required,
                };
              },
            )
          : [],
        delivery_content: props.data
          ? (
              props.data.delivery_content || [
                {
                  name: '',
                  file_extension: undefined,
                },
              ]
            ).map((item: { file_extension_id: number; name: string }) => {
              return {
                name: item.name,
                file_extension: item.file_extension_id,
              };
            })
          : [
              {
                name: '',
                file_extension: undefined,
              },
            ],
      };
    };

    const orderForm = ref<any>(initOrderForm());
    const department_list = ref<option_form[]>([]);
    const deliveryDaysChances = [
      0.1, 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
      10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15,
    ];
    const deliveryTypeChances = ref<TG.OptionType<unknown>[]>([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ]);
    const setFieldChances = ref<option_form[]>([]);
    const Get_Design_Type_Fields_Department_List = async () => {
      const res = await Query_Design_Type_Fields();
      if (res.data.success) {
        const list = res.data.data;
        setFieldChances.value = list;
      }
      const res_d = await Query_Design_Type_Department();
      if (res_d.data.success) {
        const list = res_d.data.data;
        department_list.value = list;
        const item = (department_list.value || []).find((el: { id: number }) => {
          return String(el.id) === String(orderForm.value.team_id);
        });
        orderForm.value.team_id = item ? orderForm.value.team_id : undefined;
      }
    };
    Get_Design_Type_Fields_Department_List();
    const resetForm = () => {
      orderForm.value = initOrderForm();
    };

    const orderFormRules = ref({
      name: [{ required: true, message: '请输入类型名称', trigger: ['change'] }],
      team_id: [{ required: true, message: '请选择负责小组', trigger: ['change'] }],
      fields: [{ required: true, message: '请选择字段设置', trigger: ['change'] }],
      delivery_days: [{ required: true, message: '请选择交付天数', trigger: ['change'] }],
    });
    // 抛出关闭事件
    const emitClose = () => {
      ctx.emit('close');
    };

    // 提交form
    const handleDialogSubmit = async () => {
      const result = await new Promise(resolve =>
        (ctx.refs.orderFormRef as ElForm).validate(result => resolve(result)),
      );
      if (!result) {
        return;
      }

      const payload: any = {
        id: orderForm.value.id,
        delivery_days: orderForm.value.delivery_days,
        name: orderForm.value.name,
        team_id: orderForm.value.team_id,
        delivery_contents: orderForm.value.delivery_content,
        addition_contents: orderForm.value.addition_content.filter(
          (el: {
            name: string;
            file_extension: string;
            delivery_days: string;
            delivery_content: string;
          }) => {
            return el.name;
          },
        ),
        fields: orderForm.value.fields,
      };
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await Save_Design_Type_Form(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('submit');
        emitClose();
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    /* const onDeliveryWayChanged = (val: string, index: number) => {
      const findVal = deliveryTypeChances.find(el => el === val);
      orderForm.value.delivery_content.splice(index, 1, {
        ...deepClone(findVal),
      });
    };*/

    const onDeleteDelivery = (index: number) => {
      orderForm.value.delivery_content.splice(index, 1);
    };
    const onDeleteAddtion = (index: number) => {
      orderForm.value.addition_content.splice(index, 1);
    };
    const onAddDelivery = () => {
      orderForm.value.delivery_content.push({
        name: '',
        file_extension: '',
      });
    };
    const onAddAddtion = () => {
      orderForm.value.addition_content.push({
        name: '',
        delivery_days: '',
        delivery_content: '',
        file_extension: '',
      });
    };
    return {
      department_list,
      onAddAddtion,
      onDeleteAddtion,
      deliveryTypeChances,
      deliveryDaysChances,
      setFieldChances,
      saveLoading,
      emitClose,
      handleDialogSubmit,
      orderForm,
      orderFormRules,
      resetForm,
      onDeleteDelivery,
      onAddDelivery,
      orderFormRef,
    };
  },
});
