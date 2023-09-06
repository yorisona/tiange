/**
 * 退款申请表单弹窗
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 17:39:09
 */
import { computed, defineComponent, nextTick, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ApprovalInfo, RefundForm, RefundParams } from '@/types/tiange/workbench';
import { GetAchievementUid } from '@/services/coop';
import { AchievementUid } from '@/types/tiange/coop';
import { SaveRefundApply } from '@/services/workbentch';
import { ValidateCallback } from '@/types/vendor/form';
import { ElSelect } from 'element-ui/types/select';

/** 10万 */
const ONE_MILLION = 100_000;
/** 50万 */
const FIVE_MILLION = 500_000;

// * 输入字符限制 - 中英文数字
// const __RegCharCnOrEn =
// /^(?:[a-zA-Z\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/u;

export default defineComponent({
  name: 'refundDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    approval: {
      type: Object as PropType<ApprovalInfo>,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const autoFocuseRef = ref<ElSelect | undefined>(undefined);

    const level_three_types_options = ref([
      { label: 1, name: 'V任务' },
      { label: 2, name: '支付宝' },
      { label: 3, name: '对公银行' },
    ]);
    /** 退款表单 */
    const refundForm = ref<RefundForm>({
      approval_type: 2,
      level_two_types: 1,
      level_three_types: 1,
      achievement_id: '',
      achievement_uid: '',
      refund_amount: '',
      name: '',
      account: '',
      v_task_id: '',
      wangwang_name: '',
      bank_card_number: '',
      bank_of_deposit: '',
      company_name: '',
      refund_reason: '',
      remark: '',
      approval_stream: [],
      gather_amount: '--',
    });

    const resetForm = () => {
      refundForm.value.approval_type = 2;
      refundForm.value.level_two_types = 1;
      refundForm.value.level_three_types = 1;
      refundForm.value.achievement_id = '';
      refundForm.value.achievement_uid = '';
      refundForm.value.refund_amount = '';
      refundForm.value.name = '';
      refundForm.value.account = '';
      refundForm.value.v_task_id = '';
      refundForm.value.wangwang_name = '';
      refundForm.value.bank_card_number = '';
      refundForm.value.bank_of_deposit = '';
      refundForm.value.company_name = '';
      refundForm.value.refund_reason = '';
      refundForm.value.remark = '';
      refundForm.value.approval_stream = [];
      refundForm.value.gather_amount = '--';
    };

    const inputVTaskId = (value: string) => {
      refundForm.value.v_task_id = value.replace(/\D+/gu, '');
    };

    const input_bank_card_number = (value: string) => {
      refundForm.value.bank_card_number = value.replace(/\D+/gu, '');
    };

    /** 用款金额是否低于 10 万 */
    const isLessThanOneMillion = computed(
      () => Number(refundForm.value.refund_amount) < ONE_MILLION,
    );

    /** 用款金额是否大于等于 50 万 */
    const isMoreThanFiveMillion = computed(
      () => Number(refundForm.value.refund_amount) >= FIVE_MILLION,
    );

    // 业绩uid集合
    const achievement_uids = ref<string[]>([]);
    // 关联业绩所有数据的集合
    const list_uid = ref<AchievementUid[]>([]);

    // 获取当前安排的成本编号
    const getAchievementUIds = async (search: string) => {
      const { data: response } = await GetAchievementUid({
        search,
      });

      if (response.success) {
        achievement_uids.value = response.data.data.map(uids => uids.achievement_uid);
        list_uid.value = response.data.data;
      } else {
        clearAchievementUIds();
      }
    };

    const clearAchievementUIds = () => {
      achievement_uids.value = [];
      list_uid.value = [];
    };

    // 验证规则
    const refundFormRules = ref({
      level_two_types: [{ required: true, message: '请选择退款类型', trigger: 'change' }],
      achievement_uid: [{ required: true, message: '请选择关联业绩', trigger: 'change' }],
      refund_amount: [
        {
          required: true,
          message: '请输入退款金额',
          trigger: 'blur',
        },
        {
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            if (value !== '' && Number(value) <= 0) {
              callback(new Error('退款金额必须大于0'));
            } else if (value === '' || Number(value) <= Number(refundForm.value.gather_amount)) {
              callback();
            } else {
              callback(new Error('退款金额不得大于业绩收款金额'));
            }
          },
          trigger: 'change',
        },
      ],
      level_three_types: [{ required: true, message: '请选择退款方式', trigger: 'change' }],
      v_task_id: [{ required: true, message: '请输入v任务id', trigger: 'blur' }],
      wangwang_name: [{ required: true, message: '请输入旺旺名', trigger: 'blur' }],
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      account: [
        { required: true, message: '请输入支付宝账号', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            const RegEmail = /^([\w\-.])+@([\w_\-.])+\.([A-Za-z]{2,4})$/u;
            if (/^1\d{10}$/gu.test(value)) {
              callback();
            } else if (RegEmail.test(value)) {
              callback();
            } else {
              callback(new Error('请输入正确的支付宝账号'));
            }
          },
          trigger: 'blur',
        },
      ],
      bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
      bank_of_deposit: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
      refund_reason: [{ required: true, message: '请输入退款理由', trigger: 'blur' }],
      company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    });

    // 抛出关闭事件
    const emitClose = (success = false) => ctx.emit('dialog:close', success);

    return {
      autoFocuseRef,
      saveLoading,
      level_three_types_options,
      refundForm,
      resetForm,
      achievement_uids,
      list_uid,
      getAchievementUIds,
      clearAchievementUIds,
      emitClose,
      isLessThanOneMillion,
      isMoreThanFiveMillion,
      refundFormRules,
      inputVTaskId,
      input_bank_card_number,
    };
  },
  methods: {
    // 显示
    show(approval?: ApprovalInfo) {
      this.resetForm();

      this.$nextTick(() => {
        (this.$refs.refundFormRef as ElForm).clearValidate();
      });

      if (approval === undefined) {
        nextTick(() => {
          this.autoFocuseRef?.focus();
        });
        return;
      }

      const {
        level_three_types,
        refund_way_detail: {
          v_task_id,
          wangwang_name,
          name,
          account,
          bank_card_number,
          bank_of_deposit,
          company_name,
        },
        gather_amount,
        achievement_id,
        achievement_uid,
        refund_amount_str,
        refund_reason,
        remark,
      } = approval;

      this.refundForm.gather_amount = gather_amount ?? ''; // 该业绩收款金额
      this.refundForm.achievement_id = achievement_id ?? ''; // 收款编号
      this.refundForm.achievement_uid = achievement_uid; // 业绩uid
      this.refundForm.refund_amount = refund_amount_str; // 退款金额
      this.refundForm.level_three_types = level_three_types; // 退款方式 1:v任务 2:支付宝 3:对公银行

      if (level_three_types === 1) {
        this.refundForm.v_task_id = v_task_id; //v任务id
        this.refundForm.wangwang_name = wangwang_name; //旺旺名
      } else if (level_three_types === 2) {
        this.refundForm.name = name; //姓名
        this.refundForm.account = account; //账户
      } else if (level_three_types === 3) {
        this.refundForm.bank_card_number = bank_card_number; //银行卡号
        this.refundForm.bank_of_deposit = bank_of_deposit; //开户行
        this.refundForm.company_name = company_name; //公司名称
      }
      this.refundForm.refund_reason = refund_reason; //退款理由
      this.refundForm.remark = remark; //备注
    },
    // 选择收款编号
    selectAchievementUid(val: string) {
      // 业绩对应的金额
      for (const item of this.list_uid) {
        if (item.achievement_uid === val) {
          this.refundForm.gather_amount = item.gather_amount;
          this.refundForm.achievement_id = item.achievement_id;
          this.refundForm.achievement_uid = val;
        }
      }
    },
    // 退款方式选择回调
    onLevelThreeTypesChange() {
      (this.$refs.refundFormRef as ElForm).clearValidate();
    },
    // 弹窗确认操作
    async handledialogSubmit() {
      const result = await new Promise(resolve =>
        (this.$refs.refundFormRef as ElForm).validate(result => resolve(result)),
      );

      if (!result) {
        return;
      }

      if (Number(this.refundForm.refund_amount) <= 0) {
        this.$message.error('金额不得小于等于0');
        return;
      }

      const {
        achievement_id,
        level_three_types,
        v_task_id,
        wangwang_name,
        account,
        name,
        bank_card_number,
        bank_of_deposit,
        company_name,
        ...rest
      } = this.refundForm;

      if (achievement_id === '') {
        return;
      }

      const payload: RefundParams =
        level_three_types === 1
          ? { ...rest, level_three_types, achievement_id, v_task_id, wangwang_name }
          : level_three_types === 2
          ? { ...rest, level_three_types, achievement_id, account, name }
          : {
              ...rest,
              level_three_types,
              achievement_id,
              bank_card_number,
              bank_of_deposit,
              company_name,
            };

      this.saveLoading = true;
      const { data: response } = await SaveRefundApply(payload);
      this.saveLoading = false;

      if (response.success) {
        this.$message.success('保存成功');
        this.emitClose(true);
        this.$emit('reload:refund');
      } else {
        this.$message.error(response.message ?? '保存失败');
      }
    },
    // 关闭弹窗
    handledialogCancel() {
      this.resetForm();
      this.refundForm.gather_amount = '--';
      this.emitClose();
    },
    // 新增部分
    inputRefundAmount(value: string) {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=[1-9])/gu, '') ?? '';

      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];

      this.refundForm.refund_amount = result[0];
    },
  },
  watch: {
    visible(val, oldVal) {
      if (val && val !== oldVal) {
        this.show(this.approval);
      }
    },
  },
});
