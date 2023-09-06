import { defineComponent, PropType, reactive, ref, watch } from '@vue/composition-api';
import { FinanceInvoice } from '@/types/tiange/finance/invoice';
import { ElForm } from 'element-ui/types/form';
import { AsyncConfirm } from '@/use/asyncConfirm';
import InvoiceBase from '../comonents/invoice.base.vue';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { wait } from '@/utils/func';
import { RedInvoiceApproval } from '@/services/finance/invoice';
type FormType = {
  remark: string;
  is_certified: number;
  attachment: string[];
  department_id?: number | undefined;
};
export default defineComponent({
  props: {
    invoice: {
      type: Object as PropType<FinanceInvoice>,
      default: () => {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: { InvoiceBase },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const formRef = ref<ElForm | null>(null);
    const columnId = ref<any>(null);
    const form = reactive<FormType>({
      remark: '',
      is_certified: 1,
      attachment: [],
      department_id: undefined,
    });
    watch(
      () => visible.value,
      newVal => {
        if (newVal && props.isEdit) {
          form.remark = props.invoice.remark;
          form.is_certified = props.invoice.is_certified;
          form.department_id = props.invoice.department_id;
          form.attachment = props.invoice.red_invoice_attachment_url
            ? [props.invoice.red_invoice_attachment_url]
            : [];
        }
      },
    );
    const show = () => {
      visible.value = true;
    };

    watch(visible, newVal => {
      if (newVal) {
        columnId.value = props.invoice.id;
      }
    });

    const formRules = reactive({
      remark: [{ required: true, message: '请输入作废原因', trigger: 'blur' }],
      attachment: [
        {
          required: true,
          message: '请上传附件',
          trigger: 'change',
        },
      ],
    });
    watch(form.attachment, newVal => {
      if (newVal.length > 0) {
        (ctx.refs.formRef as ElForm).clearValidate('attachment');
      }
    });

    function resetForm() {
      form.remark = '';
      form.is_certified = 1;
      form.attachment = [];
    }
    function cancel() {
      visible.value = false;
      resetForm();
    }

    const beforeUpload = (config: any) =>
      ValidationFileUpload({ pdf: true, image: true, fileSize: 30 })(config);
    const successHandle = (res: { data: { source: string } }) => {
      form.attachment.push(res.data.source);
    };
    async function submit() {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }
      const result = await AsyncConfirm(ctx, {
        title: props.isEdit ? '确认重新开红票吗？' : '确认开红票吗？',
        content: '提交后将在飞书中进行审核',
        confirmText: '确认',
        cancelText: '取消',
      });
      if (result) {
        saveLoading.value = true;
        const params = {
          id: props.isEdit ? props.invoice.invoice_id : columnId.value,
          remark: form.remark,
          is_certified: form.is_certified,
          department_id: form.department_id,
          red_invoice_attachment_url: form.is_certified ? form.attachment[0] : '',
        };

        const [{ data }] = await wait(500, RedInvoiceApproval(params));
        saveLoading.value = false;
        if (data.success) {
          visible.value = false;
          ctx.root.$message.success('作废成功');
          ctx.emit('success');
          resetForm();
        } else {
          ctx.root.$message({
            type: 'warning',
            message: data.message ?? '作废失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
        }
      }
    }
    const ChangeDepartmentId = (val: number) => {
      form.department_id = val;
    };
    return {
      ChangeDepartmentId,
      visible,
      show,
      saveLoading,
      form,
      formRef,
      beforeUpload,
      successHandle,
      cancel,
      submit,
      formRules,
    };
  },
});
