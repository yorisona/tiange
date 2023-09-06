/**
 * 新增/编辑合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:06:18
 */
import { computed, defineComponent, ref } from '@vue/composition-api';
import { getFileExtension } from '@/utils/func';
import { Loading } from 'element-ui';
import { businessNewTypeOptions } from '@/const/options';
import { ElForm } from 'element-ui/types/form';
import { PostTemplateContractDetail, uploadContractAttachment } from '@/services/contract';
export default defineComponent({
  name: 'TemplateContract',
  props: {
    type: {
      type: String,
      default: 'add',
    },
    rowobj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    let loading: any;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const closeLoading = () => {
      // 使用Element loading-start 方法
      loading.close();
    };
    const formRules = ref({
      template_type: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
      name: [{ required: true, message: '请上传合同模板', trigger: 'change' }],
      business_types: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
      priority: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
      status: [{ required: true, message: '请选择模板状态', trigger: 'change' }],
      proceeds_plan: [],
    });
    const form = ref<any>({
      attachment_url: '',
      business_types: [],
      priority: undefined,
      status: 1,
      name: undefined,
      id: undefined,
      template_type: undefined,
    });
    const saveLoading = ref(false);
    // * 全选状态
    const saleChance = ref({
      checkAll: false,
      isIndeterminate: false,
    });
    const saleChances = businessNewTypeOptions;
    // * 业务类型全选
    const handleCheckAllChange = (val: boolean) => {
      form.value.sale_chance = val ? saleChances.map(item => item.value) : [];
      saleChance.value.isIndeterminate = false;
    };
    /** 选中的业务类型 */
    const checkedChances = computed(() =>
      saleChances
        .filter(el => form.value.business_types.includes(el.value))
        .map(el => el.label)
        .join('、'),
    );
    const no_upload_click = ref(false);
    const visible = ref(false);
    const uploadAttachment = ref([]);
    const resetrefrashform = async () => {
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 10);
    };
    const onSaveBtnClick = async () => {
      const result = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (result) {
        form.value.business_types.sort((a: any, b: any) => {
          return a - b; //降序排列，return a-b; —>升序排列
        });
        const payload: any = {
          contract_template_id: form.value.id,
          status: form.value.status,
          file_url: form.value.file_url,
          priority: form.value.priority,
          business_types: form.value.business_types,
          name: form.value.name,
          template_type: form.value.template_type,
        };
        const { data: response } = await PostTemplateContractDetail(payload);
        if (response.success) {
          visible.value = false;
          ctx.root.$message.success(response.message);
          ctx.emit('saveClick');
        } else {
          ctx.root.$message.warning(response.message);
        }
      }
    };
    return {
      resetrefrashform,
      no_upload_click,
      visible,
      uploadAttachment,
      onSaveBtnClick,
      formRef,
      form,
      startLoading,
      closeLoading,
      formRules,
      saveLoading,
      handleCheckAllChange,
      checkedChances,
      saleChance,
      saleChances,
    };
  },
  methods: {
    saveClick() {
      this.onSaveBtnClick();
      // this.$emit('saveClick', '');
    },
    // 提供给父组件使用，勿删
    show(obj: any) {
      this.resetrefrashform();
      if (obj && obj !== '') {
        this.form = obj;
      } else {
        this.form = {
          attachment_url: '',
          business_types: [],
          priority: undefined,
          status: 1,
          name: undefined,
          id: undefined,
          template_type: undefined,
        };
      }
      this.no_upload_click = true;
      this.visible = true;
      this.$nextTick(() => {});
    },
    // 处理已选中的销售渠道变动（checkbox group）
    handleCheckedSaleChanceChange(value: any) {
      const checkedCount = value.length;
      this.saleChance.checkAll = checkedCount === this.saleChances.length;
      this.saleChance.isIndeterminate = checkedCount > 0 && checkedCount < this.saleChances.length;
    },
    beforeUpload(file: File) {
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error(
          `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在10MB以内`,
        );
        return false;
      }
      if (
        ![
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          '.sheet',
        ].includes(file.type) &&
        !['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xlsx'].includes(
          getFileExtension(file.name),
        )
      ) {
        this.$message.warning('文件格式不正确，请使用  docx / doc');

        return false;
      }

      return true;
    },
    // 上传附件
    async uploadAttachmentFile(value: any) {
      const result = this.beforeUpload(value.file);
      if (!result) {
        return;
      }
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      (this.uploadAttachment as any).file = value.file;
      this.startLoading();
      uploadContractAttachment(formData)
        .then(res => {
          this.closeLoading();
          if (!res.data.success) {
            (this.uploadAttachment as any).file = null;
            this.$message({
              type: 'warning',
              message: res.data.message,
              showClose: true,
              duration: 2000,
            });
          } else {
            this.form.file_url = res.data.data.source;
            this.form.name = value.file.name;
          }
        })
        .catch(() => {
          this.closeLoading();
          this.$message({
            type: 'warning',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          // this.uploadAttachment.uploading = false;
        });
    },
    // 清除已上传的附件
    clearUploadedFile(index: number) {
      this.form.file_url = '';
    },
    inputPrice() {
      if (this.form.priority) {
        this.form.priority = parseInt(this.form.priority, 10);
      }
    },
  },
});
