/**
 * 客户合同结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 15:12:16
 */
import { computed, defineComponent, inject, Ref, ref, watch } from '@vue/composition-api';
import {
  Contract,
  ContractStatementsForm,
  ContractType,
  SealType,
  SealTypeOptions,
  SettlementDetail,
  SettleWay,
  SettleWayOptions,
} from '@/types/tiange/contract';
import { ElForm } from 'element-ui/types/form';
import { useContractUid } from './useFormLogic';
import { useStatementsFormRules } from './useFormRules';
import { getPositiveNumber } from '@/utils/string';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadContractAttachment } from '@/api/customer';
import {
  SaveContractStatements,
  SaveContractStatementsShop,
  SaveContractStatementsCoop,
  SaveContractStatementsCommonBusiness,
  SaveContractStatementsLocalLife,
  SaveContractStatementsSupplyChain,
} from '@/services/contract';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { getFileExtension } from '@/utils/func';
import { Loading } from 'element-ui';

/** 结算明细数量上限 */
const DETAIL_MAX = 12;

export default defineComponent({
  name: 'StatementFormDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    isfromworkbench: {
      type: Boolean,
      required: false,
    },
    editData: {
      type: Object,
      required: false,
    },
    isMerchant: {
      type: Boolean,
      default: false,
    },
    isRelaunch: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const formRef = ref<ElForm | null>(null);
    const contract = inject<Ref<Contract | undefined>>('contract');

    const lockContract = computed(() => contract?.value !== undefined);
    const locked_contract_uid = ref('');
    const locked_partner_name = ref('');
    const project_add_id = inject<string>('project_add_id');
    const project = inject('project');
    const breadcrumb = useBreadcrumb(props.isMerchant);
    let project_type = 1;
    if (props.editData && props.editData.isEdit) {
      if (props.editData.business_type === BusinessTypeEnum.marketing) {
        project_type = 2;
      } else {
        project_type = 1;
      }
    } else {
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
    }
    const form = ref<ContractStatementsForm>({
      contract_id: '',
      approval_amount: '',
      comment: '',
      attachment_url: [],
      partner_id: '',
      partner_name: '',
      contract_type: undefined as any,
      seal_type: SealType.Type2,
      settlement_detail: [],
      current_project_id: project_add_id,
      project_type: project_type,
    });
    const initForm = () => {
      if (contract?.value === undefined) {
        return;
      }

      const {
        contract_info: { id, partner_id, contract_uid },
        partner_info: { partner_name },
      } = contract.value;

      form.value.contract_id = id;
      locked_contract_uid.value = contract_uid;

      form.value.partner_id = partner_id;
      form.value.partner_name = partner_name;
      locked_partner_name.value = partner_name;
    };

    watch(
      () => props.visible,
      (nowVal, originVal) => {
        if (nowVal && nowVal !== originVal) {
          initForm();
        }
      },
    );

    const { clearContractInfoRecords, ...restUseContractUid } = useContractUid(
      form,
      formRef as Ref<ElForm | null>,
      1,
      ContractType.Framework,
    );

    const { formRules, settlementDetailRules } = useStatementsFormRules(form);

    const defSettlementDetail = JSON.stringify({
      settle_way: SettleWay.Auto,
      shop_name: '',
      wangwang_num: '',
      settle_amount: '',
      start_date: '',
      end_date: '',
      done_amount: '',
      wait_amount: '',
      invoice_amount: '',
      remark: '',
    });

    const addSettlement = () => {
      form.value.settlement_detail.push({
        settle_way: SettleWay.Auto,
        shop_name: '',
        wangwang_num: '',
        settle_amount: '',
        start_date: '',
        end_date: '',
        done_amount: '',
        wait_amount: '',
        invoice_amount: '',
        remark: '',
      });
    };

    /** 明细是否为空 */
    const isEmptyDetail = (detail: SettlementDetail) =>
      JSON.stringify(detail) === defSettlementDetail;

    /** 删除 */
    const removeSettlement = (index: number) => {
      form.value.settlement_detail.splice(index, 1);

      if (form.value.settlement_detail.length === 0) {
        addSettlement();
      }
    };

    /** 是否仅有一条明细且为空 */
    const isOnlyEmpty = computed(
      () =>
        form.value.settlement_detail.length === 1 && isEmptyDetail(form.value.settlement_detail[0]),
    );

    /** 是否V任务类型的明细 */
    const isVTask = ({ settle_way }: SettlementDetail) => settle_way === SettleWay.VTask;

    addSettlement();

    /** 明细数量是否已到上限 */
    const isFullSettlementDetail = computed(
      () => form.value.settlement_detail.length >= DETAIL_MAX,
    );

    /** 开始日期变化处理 */
    const onStartDateChange = (index: number, value: any) => {
      if (value === null) {
        ctx.root.$nextTick(() => {
          form.value.settlement_detail[index].start_date = '';
        });
      }
    };

    /** 结束日期变化处理 */
    const onEndDateChange = (index: number, value: any) => {
      if (value === null) {
        ctx.root.$nextTick(() => {
          form.value.settlement_detail[index].end_date = '';
        });
      }
    };

    /** 输入审批金额 */
    const inputApprovalAmount = (value: string) => {
      const val = getPositiveNumber(value);
      form.value.settlement_detail[0].settle_amount = val;
      form.value.approval_amount = val;
    };

    const inputAmount = (
      index: number,
      key: 'settle_amount' | 'done_amount' | 'wait_amount' | 'invoice_amount',
      value: string,
    ) => {
      form.value.settlement_detail[index][key] = getPositiveNumber(value);
    };

    /** 重置表单 */
    const resetForm = () => {
      formRef.value?.clearValidate();
      formRef.value?.resetFields();
      if (props.editData && props.editData.isEdit) {
        form.value = Object.assign({}, form.value, {
          contract_uid: props.editData.contract_no,
          partner_name: props.editData.partner_name,
          contract_id: props.editData.contract_id,
          partner_id: props.editData.partner_id,
          approval_amount: props.editData.approval_amount,
          comment: props.editData.comment,
          attachment_url: props.editData.attachment_url?.split(',') || [],
          current_project_id: props.editData.project_id,
          settlement_detail: props.editData.settlement_detail.map((item: any) => {
            return {
              settle_amount: item.settle_amount,
              settle_way: item.settle_way,
              start_date: item.start_date,
              end_date: item.end_date,
              done_amount: item.done_amount,
              wait_amount: item.wait_amount,
              invoice_amount: item.invoice_amount,
              remark: item.remark,
              shop_name: item.shop_name,
              wangwang_num: item.wangwang_num,
            };
          }),
        });
        restUseContractUid.contract_uid.value = props.editData.contract_no;
        uploadedAttachmentList.value = props.editData.attachment_url?.split(',') || [];
        if (props.editData.business_type === BusinessTypeEnum.marketing) {
          project_type = 2;
        } else {
          project_type = 1;
        }
        form.value.project_type = project_type;
      } else {
        form.value.contract_id = '';
        form.value.approval_amount = '';
        form.value.comment = '';
        form.value.attachment_url = [];
        form.value.partner_id = '';
        form.value.partner_name = '';
        form.value.contract_type = ContractType.Framework;
        form.value.seal_type = SealType.Type2;
        form.value.settlement_detail = [];

        restUseContractUid.contract_uid.value = '';

        uploadedAttachmentList.value = [];
        clearContractInfoRecords();

        addSettlement();
      }
    };

    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
      resetForm();
    };

    const getPayload = async () => {
      const { contract_id, attachment_url, partner_id, settlement_detail, ...rest } = form.value;

      if (contract_id === '' || partner_id === '') {
        return Promise.reject(new Error('请关联客户合同'));
      }

      if (attachment_url.length === 0) {
        return Promise.reject(new Error('请上传附件'));
      }

      const filteredSettlementDetail = settlement_detail.filter(detail => !isEmptyDetail(detail));

      const payload = {
        contract_id,
        attachment_url: attachment_url.join(','),
        partner_id,
        settlement_detail: filteredSettlementDetail,
        ...rest,
      };

      return Promise.resolve(payload);
    };

    /** 确定保存提交 */
    const onConfirmBtnClick = async () => {
      if (!props.isfromworkbench) {
        initForm();
      }
      const result = await new Promise(resolve => {
        formRef.value?.validate(pass => {
          resolve(pass);
        });
      });

      if (!result) {
        return;
      }

      const payload = await getPayload();

      function SwitchSave() {
        return Promise.resolve().then(() => {
          if (props.editData && props.editData.isEdit) {
            if (props.editData.business_type === BusinessTypeEnum.marketing) {
              return SaveContractStatementsCoop(payload);
            } else if (props.editData.business_type === BusinessTypeEnum.mcn) {
              return SaveContractStatementsCommonBusiness(payload);
            } else if (props.editData.business_type === BusinessTypeEnum.locallife) {
              return SaveContractStatementsLocalLife(payload);
            } else if (props.editData.business_type === BusinessTypeEnum.supplyChain) {
              return SaveContractStatementsSupplyChain(payload);
            } else {
              return SaveContractStatementsShop(payload);
            }
          } else {
            if (breadcrumb.isLiveDetail) {
              return SaveContractStatementsShop(payload);
            } else if (breadcrumb.isCommonBusinessDetail) {
              return SaveContractStatementsCommonBusiness(payload);
            } else if (breadcrumb.isCoopDetail) {
              return SaveContractStatementsCoop(payload);
            } else if (breadcrumb.isLocalLifeDetail) {
              return SaveContractStatementsLocalLife(payload);
            } else if (breadcrumb.isSupplyChainDetail) {
              return SaveContractStatementsSupplyChain(payload);
            } else {
              return SaveContractStatements(payload);
            }
          }
          // return project_add_id
          //   ? SaveContractStatementsShop(payload)
          //   : SaveContractStatements(payload);
        });
      }
      saveLoading.value = true;
      const { data: response } = await SwitchSave();
      saveLoading.value = false;

      if (response.success) {
        ctx.emit('dialog:close', true);
      } else {
        ctx.root.$message.error(response.message ?? '新增结算单失败');
      }
    };

    const settlement_detail = computed(() => form.value.settlement_detail);

    const uploadedAttachmentList = ref<string[]>([]);

    watch(
      () => props.editData,
      val => {
        if (val) {
          console.log(val, 'val');

          form.value = Object.assign({}, form.value, {
            approval_type: val.approval_type,
            contract_uid: val.contract_no,
            partner_name: val.partner_name,
            contract_id: val.contract_id,
            partner_id: val.partner_id,
            contract_type: val.contract_type,
            approval_amount: val.approval_amount,
            comment: val.comment,
            attachment_url: val.attachment_url?.split(',') || [],
            current_project_id: val.project_id,
            // start_date: val.settlement_detail[0].start_date,
            // end_date: val.settlement_detail[0].end_date,
            settlement_detail: val.settlement_detail.map((item: any) => {
              return {
                settle_amount: item.settle_amount,
                settle_way: item.settle_way,
                start_date: item.start_date,
                end_date: item.end_date,
                done_amount: item.done_amount,
                wait_amount: item.wait_amount,
                invoice_amount: item.invoice_amount,
                remark: item.remark,
                shop_name: item.shop_name,
                wangwang_num: item.wangwang_num,
              };
            }),
          });
          restUseContractUid.contract_uid.value = val.contract_no;
          uploadedAttachmentList.value = val.attachment_url?.split(',') || [];
          if (val.business_type === BusinessTypeEnum.marketing) {
            project_type = 2;
          } else {
            project_type = 1;
          }
          form.value.project_type = project_type;
        }
      },
      {
        deep: true,
      },
    );
    let loadnewing: any;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loadnewing = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const closeLoading = () => {
      // 使用Element loading-start 方法
      loadnewing.close();
    };
    const getCustmerByContractUid_extend = (value: string) => {
      return restUseContractUid.getCustmerByContractUid(value);
    };
    return {
      saveLoading,
      startLoading,
      closeLoading,
      loadnewing,
      project,
      project_add_id,
      ContractType,
      formRef,
      form,
      formRules,
      lockContract,
      locked_contract_uid,
      locked_partner_name,
      settlementDetailRules,
      SettleWayOptions,
      ...restUseContractUid,
      getCustmerByContractUid_extend,
      SealTypeOptions,
      addSettlement,
      removeSettlement,
      isVTask,
      isFullSettlementDetail,
      isOnlyEmpty,
      onStartDateChange,
      onEndDateChange,
      inputApprovalAmount,
      inputAmount,
      onCancelBtnClick,
      onConfirmBtnClick,
      labelWidth: '78px',
      settlement_detail,
      uploadedAttachmentList,
    };
  },
  methods: {
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
        !['.jpg', '.jpeg', '.png', '.docx', '.doc', '.xls', '.xlsx'].includes(
          getFileExtension(file.name),
        )
      ) {
        this.$message.warning('文件格式不正确，请使用 jpg / png / pdf / docx / xlsx');
        this.loading = false;

        return false;
      }

      return true;
    },
    /**
     * 上传附件
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-11-28 17:25:49
     */
    async uploadAttachmentFile(value: HttpRequestOptions) {
      if (!this.beforeUpload(value.file)) {
        return;
      }

      this.isAddingEditing = false;
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract_annex');

      this.uploadAttachmentUploading = true;
      this.startLoading();
      const res = await uploadContractAttachment(formData);
      this.uploadAttachmentUploading = false;
      this.closeLoading();
      if (res.data.success) {
        this.uploadedAttachmentList.push(res.data.data.source);
        this.form.attachment_url = this.uploadedAttachmentList;
        this.formRef?.validateField('attachment_url');
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
      this.form.attachment_url = this.uploadedAttachmentList;
    },
  },
});
