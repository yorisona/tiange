import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  inject,
  Ref,
  nextTick,
} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { GetCompanyAccountList } from '@/services/company';
import { SaveRefundApplyDialog } from '@/services/marketing.project';
import { sleep } from '@/utils/func';
import { GetContractUid } from '@/services/contract';
import { ContractSettlement } from '@/types/tiange/contract';
import { SaveProjectPrePayRefundApply } from '@/services/common/project';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  name: 'refundDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    row: {
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
    info: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    isRealPay: {
      type: Boolean,
      required: false,
      default: false,
    },
    /** 项目结算退款、预收款退款 */
    isFromPrePay: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {},
  setup(props, ctx) {
    const saveLoading = ref(false);
    const accountList = ref<any[]>([]);
    const injectProject = inject<Ref<any>>('project');
    const department_name = computed(() => {
      return ctx.root.$store.getters['user/getUserInfo'].department_name;
    });
    const refundForm = ref<any>({
      department: department_name,
      project_name: '',
      achievement_id: '',
      refund_amount: '',
      refund_reason: '',
      refund_way: 3,
      company_name: '',
      company_id: undefined,
      bank_account: '',
      bank: '',
      bank_card_number: '',
      bank_card_name: '',
      bank_card_person: '',
      name: '',
      account: '',
      wangwang_name: '',
      v_task_id: '',
      remark: '',
      contract_id: undefined,
      contract_company_name: undefined,
      attachment: [],
      project_id: undefined,
      ...props.row,
    });
    const router = useRouter();
    if (!refundForm.value.project_id && router.currentRoute.params.id) {
      refundForm.value.project_id = router.currentRoute.params.id;
    }
    /** 所有公司 */
    const companyList = ref<any>([]);

    // const getCompanyList = async () => {
    //   const payload: any = {
    //     business_type: props.row.business_type,
    //     project_id: props.row.project_id,
    //   };
    //   const { data: response } = await GetCompanyAccount(payload);
    //   if (response.success) {
    //     const data: any = response.data;
    //     refundForm.value.company_name = data.bank_account;
    //     refundForm.value.bank = data.bank_of_deposit;
    //     refundForm.value.bank_account = data.bank_card_number;
    //   }
    // };
    // getCompanyList();
    const resetForm = () => {
      refundForm.value.department = '';
      refundForm.value.project_name = '';
      refundForm.value.achievement_id = '';
      refundForm.value.refund_amount = '';
      refundForm.value.refund_reason = '';
      refundForm.value.refund_way = '';
      refundForm.value.company_name = '';
      refundForm.value.company_id = undefined;
      refundForm.value.bank_account = '';
      refundForm.value.bank = '';
      refundForm.value.bank_card_number = '';
      refundForm.value.bank_card_name = '';
      refundForm.value.bank_card_person = '';
      refundForm.value.name = '';
      refundForm.value.account = '';
      refundForm.value.wangwang_name = '';
      refundForm.value.v_task_id = '';
      refundForm.value.remark = '';
      refundForm.value.attachment = [];
      refundForm.value.contract_id = props.row.contract_id || undefined;
    };

    const refundFormRules = ref({
      department: [{ required: true, message: '请输入部门名称', trigger: ['blur', 'change'] }],
      project_name: [{ required: true, message: '请输入项目名称', trigger: ['blur', 'change'] }],
      achievement_uid: [
        {
          required: true,
          message: props.isFromPrePay ? '请输入预收编号' : '请输入收款编号',
          trigger: ['blur', 'change'],
        },
      ],
      refund_amount: [
        { required: true, message: '请输入退款金额', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (Number(value) > refundForm.value.gather_amount) {
              if (props.isFromPrePay) {
                callback(new Error('不能超过未核销金额(' + refundForm.value.gather_amount + ')'));
              } else {
                callback(new Error('不能超过实收金额(' + refundForm.value.gather_amount + ')'));
              }
            } else if (value === '0') {
              callback(new Error('退款金额不能为0'));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
      refund_reason: [{ required: true, message: '请输入退款理由', trigger: ['blur', 'change'] }],
      refund_way: [{ required: true, message: '请选择退款方式', trigger: ['blur', 'change'] }],
      company_id: [{ required: true, message: '请输入公司名称', trigger: ['blur', 'change'] }],
      bank_account: [{ required: true, message: '请输入银行账号', trigger: ['blur', 'change'] }],
      bank: [{ required: true, message: '请输入开户行', trigger: ['blur', 'change'] }],
      bank_card_number: [{ required: true, message: '请输入卡号', trigger: ['blur', 'change'] }],
      bank_card_name: [{ required: true, message: '请输入开户行', trigger: ['blur', 'change'] }],
      bank_card_person: [{ required: true, message: '请输入户名', trigger: ['blur', 'change'] }],
      name: [{ required: true, message: '请输入收款人', trigger: ['blur', 'change'] }],
      account: [{ required: true, message: '请输入支付宝账号', trigger: ['blur', 'change'] }],
      wangwang_name: [{ required: true, message: '请输入旺旺名', trigger: ['blur', 'change'] }],
      v_task_id: [{ required: true, message: '请输入V任务ID', trigger: ['blur', 'change'] }],
    });

    const inputAmount = (value: string, type: string) => {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      if (type === 'refund_amount') {
        refundForm.value.refund_amount = result[0];
      }
    };

    const getAllCompanyName = async (keyword: string) => {
      const { data: response } = await GetCompanyAccountList({ keyword });
      companyList.value = response.success ? response.data : [];
      const one = companyList.value.find((item: any) => {
        return item.id === refundForm.value.company_id;
      });
      if (one) {
        accountList.value = one.company_account || [];
      }
    };

    const handleCompanySelect = (id: string) => {
      const one = companyList.value.find((item: any) => {
        return item.id === id;
      });
      accountList.value = one.company_account || [];
      refundForm.value.company_name = one.company_name;
      refundForm.value.company_id = one.id;
      refundForm.value.bank_account = undefined;
      refundForm.value.account = undefined;
      refundForm.value.bank = '';
      refundForm.value.contract_id = undefined;
      getContract(one.company_name);
      // refundForm.value.bank = one[0].bank_of_deposit;
      // refundForm.value.bank_account = one[0].bank_card_number;
    };

    // 抛出关闭事件
    const emitClose = (success = false) => ctx.emit('dialog:close', success);

    const handleDialogCancel = () => {
      emitClose();
    };

    const handleDialogSubmit = async () => {
      const result = await new Promise(resolve =>
        (ctx.refs.refundFormRef as ElForm).validate(result => resolve(result)),
      );
      if (!result) {
        return;
      }
      saveLoading.value = true;
      const payload: any = {
        record_id: refundForm.value.record_id || props.row.record_id || undefined,
        approval_type: props.isFromPrePay ? undefined : 2,
        achievement_id: props.row.achievement_id || undefined,
        business_type: props.row.business_type,
        refund_amount: refundForm.value.refund_amount + '',
        project_id: refundForm.value.project_id,
        level_two_types: 1,
        level_three_types: refundForm.value.refund_way,
        refund_reason: refundForm.value.refund_reason,
        remark: refundForm.value.remark,
        v_task_id: refundForm.value.refund_way === 1 ? refundForm.value.v_task_id : '',
        wangwang_name: refundForm.value.refund_way === 1 ? refundForm.value.wangwang_name : '',
        name: refundForm.value.refund_way === 2 ? refundForm.value.name : '',
        account: refundForm.value.refund_way === 2 ? refundForm.value.account : '',
        bank_card_number:
          refundForm.value.refund_way === 4
            ? refundForm.value.bank_card_number
            : refundForm.value.refund_way === 3
            ? refundForm.value.bank_account
            : '',
        bank_account: refundForm.value.refund_way === 4 ? refundForm.value.bank_card_person : '',
        bank_of_deposit:
          refundForm.value.refund_way === 4
            ? refundForm.value.bank_card_name
            : refundForm.value.refund_way === 3
            ? refundForm.value.bank
            : '',
        company_name: refundForm.value.refund_way === 3 ? refundForm.value.company_name : '',
        company_id: props.isFromPrePay ? refundForm.value.company_id : undefined,
        attachment: refundForm.value.attachment,
        contract_id: refundForm.value.contract_id,
      };
      const [{ data: response }, _] = await Promise.all(
        props.isFromPrePay || refundForm.value.record_id
          ? [await SaveProjectPrePayRefundApply(payload), await sleep(200)]
          : [await SaveRefundApplyDialog(payload), await sleep(200)],
      );
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message);
        emitClose();
        if (props.edit) {
          ctx.emit('dialog:reClose');
        }
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };

    const beforeUpload = (config: any) =>
      ValidationFileUpload({ file: true, image: true, fileSize: 30 })(config);
    const successHandle = (res: { data: { source: string } }) => {
      refundForm.value.attachment.push(res.data.source);
    };
    const blurFun = (type: string, event: any) => {
      if (type === 'bank_account') {
        refundForm.value.bank_account = event.target.value;
      } else if (type === 'bank_card_number') {
        refundForm.value.bank_card_number = event.target.value;
      }
    };

    onBeforeMount(() => {
      if (props.edit) {
        refundForm.value.refund_amount = props.info.refund_amount;
        refundForm.value.refund_reason = props.info.refund_reason;
        refundForm.value.remark = props.info.remark;
        refundForm.value.refund_way = props.info.level_three_types;
        refundForm.value.company_name =
          props.info.approval_detail && props.info.approval_detail.company_name
            ? props.info.approval_detail.company_name
            : props.info.company_name;
        refundForm.value.company_id =
          props.info.approval_detail && props.info.approval_detail.company_id
            ? props.info.approval_detail.company_id
            : props.info.company_id;
        refundForm.value.achievement_id =
          props.info.approval_detail && props.info.approval_detail.deposit_received_id
            ? props.info.approval_detail.deposit_received_id
            : props.info.achievement_id;
        refundForm.value.achievement_uid =
          props.info.approval_detail && props.info.approval_detail.deposit_received_uid
            ? props.info.approval_detail.deposit_received_uid
            : props.info.achievement_uid;
        refundForm.value.record_id =
          props.info.approval_detail && props.info.approval_detail.deposit_received_id
            ? props.info.approval_detail.deposit_received_id
            : refundForm.value.record_id;
        refundForm.value.contract_id =
          props.info.approval_detail && props.info.approval_detail.contract_id
            ? props.info.approval_detail.contract_id
            : refundForm.value.contract_id;
        refundForm.value.contract_company_name =
          props.info && props.info.contract_company_name
            ? props.info.contract_company_name
            : refundForm.value.contract_company_name;
        refundForm.value.project_id =
          props.info && props.info.project_id ? props.info.project_id : refundForm.value.project_id;

        if (props.info.level_three_types === 3) {
          refundForm.value.company_name =
            props.info.refund_way_detail.company_name || refundForm.value.company_name;
          refundForm.value.company_id =
            props.info.refund_way_detail.company_id || refundForm.value.company_id;
          refundForm.value.bank_account = props.info.refund_way_detail.bank_card_number;
          refundForm.value.bank = props.info.refund_way_detail.bank_of_deposit;
        } else if (props.info.level_three_types === 2) {
          refundForm.value.name = props.info.refund_way_detail.name;
          refundForm.value.account = props.info.refund_way_detail.account;
        } else if (props.info.level_three_types === 4) {
          refundForm.value.bank_card_number = props.info.refund_way_detail.bank_card_number;
          refundForm.value.bank_card_person = props.info.refund_way_detail.bank_account;
          refundForm.value.bank_card_name = props.info.refund_way_detail.bank_of_deposit;
        } else {
          refundForm.value.wangwang_name = props.info.refund_way_detail.wangwang_name;
          refundForm.value.v_task_id = props.info.refund_way_detail.v_task_id;
        }
        if (props.info.attachment && props.info.attachment.length > 0) {
          refundForm.value.attachment = props.info.attachment;
        }
      }
    });

    const contract_id_list = ref<ContractSettlement[]>([]);
    const getContract = async (kw?: string) => {
      const idObj =
        injectProject?.value?.business_type === 1
          ? { cooperation_id: refundForm.value.project_id }
          : { project_id: refundForm.value.project_id };
      const res = await GetContractUid({
        company_name: kw,
        only_main: 0,
        contract_status: 2,
        partner_type: 1,
        ...idObj,
      });
      if (res.data.success) {
        contract_id_list.value = res.data.data.data;
      } else {
        contract_id_list.value = [];
      }
    };

    const onBankAccountChange = (val: string) => {
      const finder = accountList.value.find(el => el.account_code === val);
      refundForm.value.bank = finder.bank_sub_name;
    };

    const onCollectionWayChange = () => {
      // refundForm.value.bank_account = undefined;
      // refundForm.value.bank = '';
    };

    onMounted(async () => {
      /** 获取相关合同 **/
      if (
        injectProject?.value?.company_name ||
        refundForm.value.company_name ||
        refundForm.value.contract_company_name
      ) {
        getContract(
          refundForm.value.contract_company_name ||
            injectProject?.value?.company_name ||
            refundForm.value.company_name,
        );
      }
      if (injectProject?.value?.company_name || refundForm.value.company_name) {
        await getAllCompanyName(
          injectProject?.value?.company_name || refundForm.value.company_name,
        );
        const find = companyList.value.find(
          (el: any) =>
            el.id === injectProject?.value?.company_id || el.id === refundForm.value.company_id,
        );
        if (find) {
          refundForm.value.company_id = find.id;
          // 从项目进来的
          injectProject?.value?.company_name && handleCompanySelect(find.id);
        }
        nextTick(() => {
          ctx.refs.refundFormRef && (ctx.refs.refundFormRef as ElForm).clearValidate();
        });
      }
    });

    return {
      saveLoading,
      refundForm,
      resetForm,
      refundFormRules,
      emitClose,
      beforeUpload,
      successHandle,
      handleDialogCancel,
      handleDialogSubmit,
      getAllCompanyName,
      handleCompanySelect,
      companyList,
      inputAmount,
      blurFun,
      getContract,
      contract_id_list,
      accountList,
      onBankAccountChange,
      onCollectionWayChange,
    };
  },
});
