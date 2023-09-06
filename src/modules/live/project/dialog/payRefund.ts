/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-15 15:45:46
 */
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { UploadCertificate } from '@/services/common/other';
import { CreatePayRefund } from '@/services/live';
import { PayRefundParams } from '@/types/tiange/live';
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { ElForm } from 'element-ui/types/form';
import { HttpRequestOptions } from 'element-ui/types/upload';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
import { AccountType, FlowStatus, RevenueFlowModel } from '@/types/tiange/finance/finance';
import { QuerySettlementRevenueFlow } from '@/services/finance';

const fileTypeIconMap = new Map([
  ['image/jpeg', 'picture'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
  ['application/msword', 'word'],
  ['application/pdf', 'pdf'],
  ['xlsx', 'excel'],
  ['docx', 'word'],
  ['doc', 'word'],
  ['pdf', 'pdf'],
  ['jpeg', 'picture'],
]);

type DataForm = Omit<PayRefundParams, 'raw_cost_id'>;

const initDataForm = (): DataForm => {
  return {
    /** 退款金额 */
    refund_amount: undefined,
    /** 收款时间 */
    gather_date: '',
    /** 收款账户，2-支付宝 ，3-对公银行 */
    gather_way: 3,
    register_way: 1,
    /** 银行卡号 */
    bank_card_number: '',
    /** 开户行 */
    bank_of_deposit: '',
    /** 公司名称 */
    company_name: '',
    /** 收款人 */
    name: '',
    /** 支付宝账号 */
    account: '',
    /** 退款原因 */
    refund_reason: '',
    /** 凭证 */
    certificate_file: '',
    /** 流水id */
    capital_revenue_flow_id: '',
  };
};

export default defineComponent({
  name: 'PayRefund',
  props: {
    visible: {
      type: Boolean,
    },
    costId: {
      type: Number,
    },
    rawAmount: {
      type: Number,
      default: 0,
    },
    dialogData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    businessType: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const dataForm = ref<DataForm>(initDataForm());
    const formRef = ref<ElForm | undefined>(undefined);

    const saveLoading = ref<boolean>(false);

    const rules = computed(() => {
      const baseRules = {
        refund_amount: [
          { required: true, message: '请输入退款金额', trigger: ['blur', 'change'] },
          { required: true, validator: methods.amountValidator, trigger: ['blur', 'change'] },
        ],
        gather_date: [{ required: true, message: '请选择收款日期', trigger: 'change' }],
        gather_way: [{ required: true, message: '', trigger: 'change' }],
        refund_reason: [{ required: true, message: '请填写退款原因', trigger: 'blur' }],
        certificate_file: [{ required: true, message: '请上传凭证', trigger: 'change' }],
        name: [{ required: true, message: '请输入收款人姓名', trigger: 'blur' }],
        account: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
        bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        bank_of_deposit: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
      };
      return baseRules;
    });

    const methods = {
      handleCloseAction: () => {
        ctx.emit('cancel');
        ctx.emit('update:visible', false);
      },
      handleSaveAction: () => {
        formRef.value?.validate(valid => {
          if (valid) {
            methods.createPayRefundRequest();
          }
        });
      },
      uploadFileHandler: async (value: HttpRequestOptions) => {
        const file = value.file;
        if (file.size > 5 * 1024 * 1024) {
          ctx.root.$message.error('上传文件大小不能超过 5MB!');
          return;
        }
        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);
        formData.append('type', 'certificate/achievement_gather_certificate');

        const res = await UploadCertificate(formData);
        if (res.data.success) {
          ctx.root.$message.success('上传成功');
          dataForm.value.certificate_file = res.data.data.source;
          formRef.value?.clearValidate('certificate_file');
        } else {
          ctx.root.$message.error(res.data.message ?? '上传失败，稍后重试');
        }
      },
      getFileName: (fileUrl: string) => {
        if (fileUrl && fileUrl.length) {
          const urlArr = fileUrl.split('/');
          return urlArr[urlArr.length - 1] ?? '--';
        }
        return '--';
      },
      getPositivePriceNumber: (value: string, intNum = 8) => {
        const re = new RegExp(`(?:0|[1-9]\\d{0,${intNum - 1}})(?:\\.\\d{0,2})?`, 'u');
        const result = (re.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        return result;
      },
      refundAmountChange: (value: string) => {
        const newVal = methods.getPositivePriceNumber(value);
        dataForm.value.refund_amount = newVal;
      },
      getFileIcon: (fileUrl: string) => {
        // const filename = fileUrl.split('/')[fileUrl.split('/').length - 1];
        const fileSpliceList = fileUrl.split('.');
        const filename_suffix = fileSpliceList[fileSpliceList.length - 1];
        const fileType = fileTypeIconMap.get(filename_suffix) ?? 'picture';
        return `ico-${fileType}`;
      },
      gatherWayChange: (val: number) => {
        if (val === 2) {
          //  支付宝
          formRef.value?.clearValidate(['name', 'account']);
        } else if (val === 3) {
          //  对公银行
          formRef.value?.clearValidate(['bank_card_number', 'bank_of_deposit', 'company_name']);
        }
      },
      registerWayChange: () => {
        formRef.value?.clearValidate();
      },
      handleRemoveFileClick: () => {
        dataForm.value.certificate_file = '';
      },
      amountValidator: (rule: any, value: any, callback: any) => {
        if (value === '' || value === undefined) {
          callback(new Error('请输入退款金额'));
        } else {
          if (new Decimal(value ? value : 0).lessThanOrEqualTo(new Decimal(props.rawAmount))) {
            // formRef.value?.validateField('refund_amount')
            callback();
          } else {
            callback(new Error('不可以超过原付款金额-已退款金额'));
          }
        }
      },
      //    request
      createPayRefundRequest: async () => {
        const params: any = {
          raw_cost_id: props.costId,
          ...dataForm.value,
        };
        if (props.businessType === 1 && dataForm.value.register_way === 1) {
          delete params.capital_revenue_flow_id;
        }

        if (dataForm.value.register_way === 2) {
          delete params.refund_amount;
          delete params.gather_date;
        }

        saveLoading.value = true;
        const res = await CreatePayRefund(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.emit('save');
          ctx.root.$message.success(res.data.message ?? '保存成功');
          if (!(res.data?.data as any).write_off_result) {
            ctx.root.$alert(
              '因该退款对应多张结算单，系统无法自动进行拆分，若原结算单因该退款无法最终完成全部核销，请冲销原结算单，并建立新结算单与原收款和该退款进行手动核销。',
            );
          }
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
      },
    };
    // 关联流水
    const queryRevenueFlow = async (accountType: AccountType) => {
      // console.log(props, accountType, 'props.dialogData.cost_company_name');
      const res = await QuerySettlementRevenueFlow({
        num: 1000,
        page_num: 1,
        status: FlowStatus.watigingClaim,
        account_type: accountType,
        payer: accountType === AccountType.bank ? props.dialogData.cost_company_name : undefined,
      });
      if (res.data.success) {
        flowList.value = res.data.data.data ?? [];
      }
    };
    const search_revenueFlow = async (payer: string) => {
      const res = await QuerySettlementRevenueFlow({
        num: 1000,
        page_num: 1,
        status: FlowStatus.watigingClaim,
        account_type: dataForm.value.gather_way === 2 ? AccountType.zfb : AccountType.bank,
        payer: payer ? payer : props.dialogData.cost_company_name,
      });
      if (res.data.success) {
        flowList.value = res.data.data.data ?? [];
      }
    };
    const flowList = ref<RevenueFlowModel[]>([]);
    const revenueDate = (date: string | undefined) => {
      return date ? moment(date).format('M.D') : '--';
    };
    const getLabel = (item: any) => {
      return `${revenueDate(item.revenue_date)} ${
        dataForm.value.gather_way === 3 ? item.payer ?? '' : item.payment_account ?? ''
      }: ${formatAmount((item.income ?? 0) / 100, 'None')}元`;
    };
    watch(
      () => dataForm.value.gather_way,
      newWay => {
        dataForm.value.capital_revenue_flow_id = '';
        if (newWay === 2) {
          // 支付宝
          queryRevenueFlow(AccountType.zfb);
        } else if (newWay === 3) {
          // 银行
          queryRevenueFlow(AccountType.bank);
        }
      },
      { immediate: true },
    );
    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) {
          dataForm.value = initDataForm();
          setTimeout(() => {
            formRef.value?.clearValidate();
          }, 300);
        } else {
          if (dataForm.value.gather_way === 2) {
            // 支付宝
            queryRevenueFlow(AccountType.zfb);
          } else if (dataForm.value.gather_way === 3) {
            // 银行
            queryRevenueFlow(AccountType.bank);
          }
        }
      },
    );

    return {
      saveLoading,
      dataForm,
      ...methods,
      rules,
      formRef,
      search_revenueFlow,
      revenueDate,
      formatAmount,
      getLabel,
      flowList,
    };
  },
});
