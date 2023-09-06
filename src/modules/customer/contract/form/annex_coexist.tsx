/**
 * 新增客户合同附件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 16:20:23
 */
import { uploadContractAttachment } from '@/api/customer';
import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { contractTypeOptions } from '@/const/options';
import {
  Contract,
  ContractAnnexForm,
  ContractAnnexSaveParams,
  ContractType,
  SealType,
  SealTypeOptions,
} from '@/types/tiange/contract';
import {
  SaveContractAnnex,
  SaveContractAnnexShop,
  SaveContractAnnexCoop,
  SaveContractAnnexCommonBusiness,
} from '@/services/contract';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { useContractUid } from './useFormLogic';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { getFileExtension } from '@/utils/func';
import { Loading } from 'element-ui';
export default defineComponent({
  name: 'AnnexFormDialog',
  props: {
    tabs: {},
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const annexFormRef = ref<ElForm | null>(null);
    const dialogVisible = ref(false);

    const 合同数据 = inject<Ref<Contract | undefined>>('contract');
    const project_add_id = inject<string>('project_add_id');
    const breadcrumb = useBreadcrumb();
    let project_type = 1;
    if (
      breadcrumb.isLiveDetail ||
      breadcrumb.isLocalLifeDetail ||
      breadcrumb.isSupplyChainDetail ||
      breadcrumb.isCommonBusinessDetail
    ) {
      project_type = 1;
    } else if (breadcrumb.isCoopDetail) {
      project_type = 2;
    }

    const annexForm = ref<ContractAnnexForm>({
      contract_id: '',
      approval_amount: '',
      comment: '',
      attachment_url: [],
      manager_id: '',
      department: '',
      partner_id: '',
      partner_name: '',
      contract_annex_type: 1,
      contract_type: -1,
      seal_type: SealType.Type2,
      current_project_id: project_add_id,
      project_type: project_type,
    });
    const lockContract = computed(() => 合同数据?.value !== undefined);
    const locked_contract_uid = ref('');
    const locked_partner_name = ref('');
    const initForm = () => {
      if (合同数据?.value === undefined) {
        return;
      }

      const {
        contract_info: { id, contract_type, partner_id, contract_uid },
        partner_info: { partner_name },
      } = 合同数据.value;

      annexForm.value.contract_id = id;
      locked_contract_uid.value = contract_uid;

      annexForm.value.partner_id = partner_id;
      annexForm.value.partner_name = partner_name;
      locked_partner_name.value = partner_name;
      annexForm.value.contract_type = contract_type;
    };

    /** 校验规则 */
    const contract_attachment_rules = ref({
      contract_id: [{ required: true, message: '请选择关联合同', trigger: 'change' }],
      approval_amount: [{ required: true, message: '请输入审批金额', trigger: 'blur' }],
      attachment_url: [{ required: true, message: '请上传附件', trigger: 'blur' }],
      department: [{ required: true, message: '请先选择客户经理', trigger: 'blur' }],
      partner_name: [{ required: true, message: '请选择关联合同', trigger: 'blur' }],
    });

    /** 重置表单 */
    const resetForm = () => {
      annexForm.value = {
        contract_id: '',
        approval_amount: '',
        comment: '',
        attachment_url: [],
        partner_id: '',
        partner_name: '',
        contract_annex_type: 1,
        contract_type: ContractType.Sales,
        seal_type: SealType.Type2,
        current_project_id: project_add_id,
        project_type: project_type,
      };

      contract_uid.value = '';

      annexFormRef.value?.resetFields();
    };

    const {
      contract_uid,
      contract_uid_loading,
      contractInfoRecords: custmerOption,
      getCustmerByContractUid: getCustmerByContractNo,
      ...rest
    } = useContractUid(annexForm, annexFormRef as Ref<ElForm | null>);

    /** 合同编号选中事件 */
    const onContractUidChange = (value: string) => {
      rest.onContractUidChange(value);
    };

    /** 审批金额输入 */
    const inputApprovalAmount = (value: string) => {
      const val = value
        .trim()
        .replace(/[^.\d]+/gu, '')
        // ! 此处是移除前导0，也就是前面一串0开头后面带非0值的场景
        // ! 比如 00000100 -> 100
        // ! 并不是禁止输入0
        // ! 比如 0.01 是允许的输入
        .replace(/^0+(?=\d+)/gu, '');

      annexForm.value.approval_amount = (/^\d+(\.\d{0,2})?/gu.exec(val) ?? [''])[0];
    };

    const uploadedAttachmentList = ref<{ file: string; path: string }[]>([]);

    /** 打开 */
    const show = () => {
      resetForm();

      initForm();

      dialogVisible.value = true;
    };
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
    return {
      saveLoading,
      startLoading,
      closeLoading,
      project_add_id,
      annexFormRef,
      lockContract,
      contractTypeOptions,
      dialogVisible,
      locked_contract_uid,
      locked_partner_name,
      initForm,
      show,
      annexForm,
      resetForm,
      contract_uid,
      // 验证规则
      contract_attachment_rules,
      // 客户经理
      accountManager: [],
      // 部门名称
      departmentName: '',
      // 客户名称选项
      // custmerOption: [],
      custmerOption,
      contract_uid_loading,
      getCustmerByContractNo,
      onContractUidChange,
      inputApprovalAmount,
      uploadAttachmentUploading: false,
      // 已上传的附件列表
      uploadedAttachmentList,
      SealTypeOptions,
      breadcrumb,
    };
  },
  methods: {
    tabsChange(e: number) {
      this.$emit('tabsChange', e);
    },
    async onSaveBtnClick() {
      return this.handleAttachmentSubmitClick();
    },
    // 提交合同附件
    async handleAttachmentSubmitClick() {
      if (this.lockContract) {
        this.initForm();
      }
      const result = await new Promise(resolve => {
        this.annexFormRef?.validate((pass: boolean) => {
          resolve(pass);
        });
      });

      if (!result) {
        return;
      }

      const { contract_id, manager_id, partner_id, partner_name, ...rest } = this.annexForm;

      if (contract_id === '' || partner_id === '') {
        this.$message.error('请选择关联合同');
        return;
      }

      const payload: ContractAnnexSaveParams = {
        contract_id,
        partner_id,
        partner_name: this.lockContract ? this.locked_partner_name : partner_name,
        ...rest,
      };

      const SwitchSave = () => {
        if (this.breadcrumb.isLiveDetail) {
          return SaveContractAnnexShop(payload);
        } else if (this.breadcrumb.isCommonBusinessDetail) {
          return SaveContractAnnexCommonBusiness(payload);
        } else if (this.breadcrumb.isCoopDetail) {
          return SaveContractAnnexCoop(payload);
        } else {
          return SaveContractAnnex(payload);
        }
        // return this.project_add_id ? SaveContractAnnexShop(payload) : SaveContractAnnex(payload);
      };
      this.saveLoading = true;
      const { data: response } = await SwitchSave();
      this.saveLoading = false;

      if (response.success) {
        this.$message.success({
          message: response.message,
          showClose: true,
          duration: 3000,
        });

        // 触发added事件，提供给父组件监听
        this.$emit('added');

        // 初始化表单
        this.resetForm();
        this.dialogVisible = false;
      } else {
        this.$message.error({
          message: response.message ?? '新增合同附件失败，请稍后重试',
          showClose: true,
          duration: 3000,
        });
      }
    },
    // 上传前对文件进行检查拦截
    beforeUpload(file: File) {
      this.loading = true;

      if (file.size > 30 * 1024 * 1024) {
        this.$message.error(
          `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在30MB以内`,
        );
        this.loading = false;
        return false;
      }
      if (
        ![
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(file.type) &&
        !['.jpeg', '.jpg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'].includes(
          getFileExtension(file.name),
        )
      ) {
        this.$message.warning('文件格式不正确，请使用 jpg / png / pdf / docx / xlsx');
        this.loading = false;

        return false;
      }

      return true;
    },
    // 上传方法
    async uploadAttachmentFile(value: HttpRequestOptions) {
      if (!this.beforeUpload(value.file)) {
        return;
      }

      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract_annex');
      this.startLoading();
      this.uploadAttachmentUploading = true;
      const res = await uploadContractAttachment(formData);
      this.uploadAttachmentUploading = false;
      this.closeLoading();
      if (res.data.success) {
        this.uploadedAttachmentList.push({
          file: value.file.name,
          path: res.data.data.source,
        });

        // 整理并赋值附件地址字段
        const urlList = this.uploadedAttachmentList.map(item => item.path);
        this.annexForm.attachment_url = urlList;
        // 由于按钮没有blur事件，所有要手动校验该字段，使提示文字消失
        this.annexFormRef?.validateField('attachment_url');
      } else {
        this.$message({
          type: 'warning',
          message: res.data.message ?? '上传失败，稍后重试',
          showClose: true,
          duration: 3000,
        });
      }
    },
    // 删除已上传的附件
    handleAttachmentClick(index: number) {
      this.uploadedAttachmentList.splice(index, 1);
    },
    // 弹窗关闭事件回调
    handleDialogClose() {
      this.dialogVisible = false;
      this.resetForm();
      this.custmerOption = [];
      this.uploadedAttachmentList = [];
    },
  },
});
