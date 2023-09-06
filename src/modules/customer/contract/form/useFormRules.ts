/**
 * 表单校验规则
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 09:49:01
 */
import { computed, Ref, ref } from '@vue/composition-api';
import { ContractStatementsForm } from '@/types/tiange/contract';
import { ValidateCallback } from '@/types/vendor/form';
import { REG_NATURAL_NUMBER_STRICT, REG_ZERO } from '@/const/regexp';

/**
 * 结算单表单校验
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 10:19:50
 */
export const useStatementsFormRules = (_form: Ref<ContractStatementsForm>) => {
  const validatorPositiveNumber = (_: any, value: string, callback: ValidateCallback) => {
    if (REG_ZERO.test(value)) {
      callback(new Error('请输入正数'));
    } else {
      callback();
    }
  };

  const validatorNaturalNumber = (_: any, value: string, callback: ValidateCallback) => {
    if (REG_NATURAL_NUMBER_STRICT.test(value)) {
      callback();
    } else {
      callback(new Error('请输入金额'));
    }
  };

  const basicFormRules = ref<Record<string, any[]>>({
    /** 合同类型 */
    contract_type: [
      {
        required: true,
        message: '请选择合同类型',
        trigger: 'change',
      },
    ],
    /** 合同编号 */
    contract_id: [
      {
        required: true,
        message: '请搜索并选择关联合同编号',
        trigger: 'blur',
      },
    ],
    /** 客户（公司）名称 */
    partner_name: [
      {
        required: true,
        message: '请搜索并选择关联合同编号',
        trigger: 'blur',
      },
    ],
    /** 审批金额 */
    approval_amount: [
      {
        required: true,
        message: '请输入审批金额',
        trigger: 'blur',
      },
      {
        validator: validatorPositiveNumber,
        trigger: 'blur',
      },
    ],
    /** 用章情况 */
    seal_type: [
      {
        required: true,
        message: '请选择用章情况',
        trigger: 'blur',
      },
    ],
    /** 附件 */
    attachment_url: [
      {
        required: true,
        message: '请上传附件',
        trigger: 'blur',
      },
    ],
  });

  const settlementDetailRules = ref({
    /** 结算方式 1---对公银行 2---支付宝 3---V任务 4---淘宝联盟 5---巨量百应 */
    settle_way: [
      {
        required: true,
        message: '请选择结算方式',
        trigger: 'change',
      },
    ],
    /** 店铺名称 */
    shop_name: [
      {
        required: true,
        message: '请输入店铺名称',
        trigger: 'blur',
      },
    ],
    /** 旺旺号 */
    wangwang_num: [
      {
        required: true,
        message: '请输入下单旺旺名',
        trigger: 'blur',
      },
    ],
    /** 结算金额 */
    settle_amount: [
      {
        required: true,
        message: '请输入结算金额',
        trigger: 'blur',
      },
      {
        validator: validatorPositiveNumber,
        trigger: 'blur',
      },
    ],
    /** 开始日期 */
    start_date: [
      {
        required: true,
        message: '请选择开始日期',
        trigger: 'blur',
      },
    ],
    /** 结束日期 */
    end_date: [
      {
        required: true,
        message: '请选择结束日期',
        trigger: 'blur',
      },
    ],
    /** 已收金额/已付金额 */
    done_amount: [
      {
        required: true,
        message: '请输入已收金额',
        trigger: 'blur',
      },
      {
        validator: validatorNaturalNumber,
        trigger: 'blur',
      },
    ],
    /** 待收金额/待付金额 */
    wait_amount: [
      {
        required: true,
        message: '请输入待收金额',
        trigger: 'blur',
      },
      {
        validator: validatorNaturalNumber,
        trigger: 'blur',
      },
    ],
    /** 已开发票金额/已收发票金额 */
    invoice_amount: [
      {
        required: true,
        message: '请输入已开票金额',
        trigger: 'blur',
      },
      {
        validator: validatorNaturalNumber,
        trigger: 'blur',
      },
    ],
    /** 备注 */
    remark: [
      {
        message: '请输入备注',
        trigger: 'blur',
      },
      {
        validator: (_: any, value: string, callback: ValidateCallback) => {
          if (value.trim().length > 20) {
            callback(new Error('备注最多20个字'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  });

  const formRules = computed(() => ({
    ...basicFormRules.value,
    ...settlementDetailRules.value,
  }));

  return { formRules, settlementDetailRules };
};

/**
 * 新自动结算单表单校验
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 10:19:50
 */
export const useNewStatementsFormRules = (_form: Ref<ContractStatementsForm>) => {
  const validatorPositiveNumber = (_: any, value: string, callback: ValidateCallback) => {
    if (REG_ZERO.test(value)) {
      callback(new Error('请输入正数'));
    } else {
      callback();
    }
  };

  const validatorNaturalNumber = (_: any, value: string, callback: ValidateCallback) => {
    if (REG_NATURAL_NUMBER_STRICT.test(value)) {
      callback();
    } else {
      callback(new Error('请输入金额'));
    }
  };

  const basicFormRules = ref<Record<string, any[]>>({
    /** 合同类型 */
    contract_type: [
      {
        required: true,
        message: '请选择合同类型',
        trigger: 'change',
      },
    ],
    /** 合同编号 */
    contract_id: [
      {
        required: true,
        message: '请搜索并选择关联合同编号',
        trigger: 'blur',
      },
    ],
    /** 客户（公司）名称 */
    partner_name: [
      {
        required: true,
        message: '请搜索并选择关联合同编号',
        trigger: 'blur',
      },
    ],
    /** 审批金额 */
    approval_amount: [
      {
        required: true,
        message: '请输入审批金额',
        trigger: 'blur',
      },
      {
        validator: validatorPositiveNumber,
        trigger: 'blur',
      },
    ],
    /** 用章情况 */
    seal_type: [
      {
        required: true,
        message: '请选择用章情况',
        trigger: 'blur',
      },
    ],
    start_date: [
      {
        required: true,
        message: '请选择开始日期',
        trigger: 'blur',
      },
    ],
    /** 结束日期 */
    end_date: [
      {
        required: true,
        message: '请选择结束日期',
        trigger: 'blur',
      },
    ],
    /** 附件 */
    attachment_url: [
      {
        required: true,
        message: '请上传附件',
        trigger: 'blur',
      },
    ],
  });

  const settlementDetailRules = ref({
    /** 结算方式 1---对公银行 2---支付宝 3---V任务 4---淘宝联盟 5---巨量百应 */
    settle_way: [
      {
        required: true,
        message: '请选择结算方式',
        trigger: 'change',
      },
    ],
    /** 店铺名称 */
    shop_name: [
      {
        required: true,
        message: '请输入店铺名称',
        trigger: 'blur',
      },
    ],
    /** 旺旺号 */
    wangwang_num: [
      {
        required: true,
        message: '请输入下单旺旺名',
        trigger: 'blur',
      },
    ],
    /** 结算金额 */
    settle_amount: [
      {
        required: true,
        message: '请输入结算金额',
        trigger: 'blur',
      },
      {
        validator: validatorPositiveNumber,
        trigger: 'blur',
      },
    ],
    /** 开始日期 */
    start_date: [
      {
        required: true,
        message: '请选择开始日期',
        trigger: 'blur',
      },
    ],
    /** 结束日期 */
    end_date: [
      {
        required: true,
        message: '请选择结束日期',
        trigger: 'blur',
      },
    ],
    /** 已收金额/已付金额 */
    done_amount: [
      {
        required: true,
        message: '请输入已收金额',
        trigger: 'blur',
      },
      {
        validator: validatorNaturalNumber,
        trigger: 'blur',
      },
    ],
    /** 待收金额/待付金额 */
    wait_amount: [
      {
        required: true,
        message: '请输入待收金额',
        trigger: 'blur',
      },
      {
        validator: validatorNaturalNumber,
        trigger: 'blur',
      },
    ],
    /** 已开发票金额/已收发票金额 */
    invoice_amount: [
      {
        required: true,
        message: '请输入已开票金额',
        trigger: 'blur',
      },
      {
        validator: validatorNaturalNumber,
        trigger: 'blur',
      },
    ],
    /** 备注 */
    remark: [
      {
        message: '请输入备注',
        trigger: 'blur',
      },
      {
        validator: (_: any, value: string, callback: ValidateCallback) => {
          if (value.trim().length > 20) {
            callback(new Error('备注最多20个字'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  });

  const formRules = computed(() => ({
    ...basicFormRules.value,
    ...settlementDetailRules.value,
  }));

  return { formRules, settlementDetailRules };
};
