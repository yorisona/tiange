import { defineComponent, ref, computed } from '@vue/composition-api';
import {
  Save_Monitor_Product_Stock_Setting,
  GET_Monitor_Product_Stock_Setting,
} from '@/services/live.project';
import { useRouter } from '@/use/vue-router';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { FunctionSelect } from '@gm/component/select';
import { Message } from 'element-ui';
export default defineComponent({
  name: 'TgTabSetting',
  components: { FunctionSelect },
  setup(props, ctx) {
    const DataForm = ref<any>({
      max_increase_stock: 0,
      receiver_list: [],
      is_enable: 0,
      default_receiver_list: [],
    });
    const router = useRouter();
    const formRef = ref<IFormRef>();
    const project_id = router.currentRoute.params.id;
    const onSaveClick = () => {
      formRef.value?.validate(err => {
        if (!err) return;
        submit();
      });
    };
    const submit = () => {
      Save_Monitor_Product_Stock_Setting({ project_id: project_id, ...DataForm.value }).then(
        ({ data }) => {
          if (data.success) {
            //通知刷新数据
            ctx.emit('editProjectReload');
            ctx.root.$message.success(data.message);
          } else {
            ctx.root.$message.error(data.message ?? '保存库存设置失败');
          }
        },
      );
    };
    const SaleAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,12})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.max_increase_stock = result;
    };
    GET_Monitor_Product_Stock_Setting({ project_id }).then(res => {
      if (res.data.success) {
        const data = res.data.data;
        DataForm.value.max_increase_stock = data.max_increase_stock;
        DataForm.value.is_enable = data.is_enable ? 1 : 0;
        const receiver_list = data.receiver_list;
        if (receiver_list) {
          DataForm.value.default_receiver_list = receiver_list.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          DataForm.value.receiver_list = receiver_list.map((item: any) => item.id);
        }
        console.log('re', DataForm.value.default_receiver_list);
      } else {
        Message.error(res.data.message);
      }
    });
    /** 表单校验规则 */
    const FormRules = computed(() => {
      let result = {};
      if (DataForm.value.is_enable === 1) {
        result = {
          max_increase_stock: [{ required: true, message: '请输入库存阈值', trigger: ['change'] }],
          receiver_list: [{ required: true, message: '请选择消息接收人', trigger: ['change'] }],
        };
      }
      return result;
    });
    return {
      formRef,
      FormRules,
      SaleAmountInput,
      onSaveClick,
      DataForm,
      costOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
});
