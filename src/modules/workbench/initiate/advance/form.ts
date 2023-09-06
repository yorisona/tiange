import { computed, defineComponent, onBeforeMount, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { GetAdvanceCustomerList, GetSupplierCustomerList } from '@/services/customers';
import { SaveAdvanceApply } from '@/services/workbentch';
import { sleep } from '@/utils/func';

export default defineComponent({
  name: 'advanceDialog',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    approval: {
      type: Object as PropType<ApprovalInfo>,
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
  },
  components: {},
  setup(props, ctx) {
    const saveLoading = ref(false);
    const department_name = computed(() => {
      return ctx.root.$store.getters['user/getUserInfo'].department_name;
    });
    const advanceForm = ref<any>({
      department: department_name,
      borrowing_amount: '',
      pay_back_amount: '',
      collecting_company: '',
      bank: '',
      bank_account: '',
      customer_id: '',
      project_id: '',
      brand_id: '',
      customer_manager_name: '',
      brand_name: '',
      business_type: '',
      supplier_id: '',
      borrowing_reason: '',
      remark: '',
      attachment: [],
    });
    // const validatorFun = (rule: any, value: any, callback: any) => {
    //   if (value !== '') {
    //     if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) === false) {
    //       callback(new Error('金额必须大于0'));
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback();
    //   }
    // };
    const advanceFormRules = ref({
      department: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      customer_id: [
        { required: true, message: '请输入并选择垫款客户', trigger: ['blur', 'change'] },
      ],
      project_id: [{ required: true, message: '请选择项目', trigger: ['blur', 'change'] }],
      brand_name: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
      borrowing_amount: [
        {
          required: true,
          message: '请输入垫款金额',
          trigger: ['blur', 'change'],
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === '0') {
              callback(new Error('垫款金额必须大于0'));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
      pay_back_amount: [
        { required: false, message: '请输入回款销售额', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === '0') {
              callback(new Error('回款销售额必须大于0'));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
      supplier_id: [{ required: true, message: '请输入并选择供应商', trigger: ['blur', 'change'] }],
      bank: [
        { required: true, message: '请至供应商管理功能完善信息', trigger: ['blur', 'change'] },
      ],
      bank_account: [
        { required: true, message: '请至供应商管理功能完善信息', trigger: ['blur', 'change'] },
      ],
      borrowing_reason: [{ required: true, message: '请输入垫款事由', trigger: 'blur' }],
    });

    /** 所有垫款客户 */
    const allCustomerName = ref<any>([]);
    /** 垫款客户下的所有项目 */
    const allProjectName = ref<any>([]);

    /** 所有供应商 */
    const allSupplierName = ref<any>([]);

    const resetForm = () => {
      advanceForm.value.department = '';
      advanceForm.value.customer_id = '';
      advanceForm.value.project_id = '';
      advanceForm.value.brand_id = '';
      advanceForm.value.brand_name = '';
      advanceForm.value.customer_manager_name = '';
      advanceForm.value.business_type = '';
      advanceForm.value.borrowing_amount = '';
      advanceForm.value.pay_back_amount = '';
      advanceForm.value.supplier_id = '';
      advanceForm.value.collecting_company = '';
      advanceForm.value.bank = '';
      advanceForm.value.bank_account = '';
      advanceForm.value.borrowing_reason = '';
      advanceForm.value.remark = '';
      advanceForm.value.attachment = [];
      allCustomerName.value = [];
      allProjectName.value = [];
      allSupplierName.value = [];
    };

    const inputAmount = (value: string, type: string) => {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      if (type === 'borrowing_amount') {
        advanceForm.value.borrowing_amount = result[0];
      } else if (type === 'pay_back_amount') {
        advanceForm.value.pay_back_amount = result[0];
      }
    };

    // 搜索获取垫款客户列表
    const getAllCustomerName = async (keyword: string) => {
      const { data: response } = await GetAdvanceCustomerList({ keyword });
      allCustomerName.value = response.success ? response.data : [];
      if (props.edit) {
        onCustomerIdChange(props.info.customer_id);
      }
    };

    // 选择具体垫款客户
    const onCustomerIdChange = (id: number) => {
      advanceForm.value.customer_id = id;
      advanceForm.value.project_id = '';
      advanceForm.value.brand_id = '';
      advanceForm.value.brand_name = '';
      advanceForm.value.customer_manager_name = '';
      advanceForm.value.business_type = '';
      getAllProjectName(id);
    };

    // 获取供应商下的所有项目列表
    const getAllProjectName = async (id: number) => {
      const projectList = allCustomerName.value.filter((item: any) => {
        if (item.id === id) {
          return item;
        }
      });
      allProjectName.value = projectList[0]?.projects ? projectList[0]?.projects : [];
      if (props.edit) {
        onProjectIdChange(props.info.project_id);
      }
    };

    // 选择具体供应商
    const onProjectIdChange = (project_id: number) => {
      const projectItem = allProjectName.value.filter((item: any) => {
        if (item.project_id === project_id) {
          return item;
        }
      });
      advanceForm.value.project_id = project_id;
      advanceForm.value.brand_id = projectItem[0]?.brand_id;
      advanceForm.value.brand_name = projectItem[0]?.brand_name;
      advanceForm.value.customer_manager_name = projectItem[0]?.customer_manager_name;
      advanceForm.value.business_type = projectItem[0]?.business_type;
    };

    const bankAccount = ref<any>([]);
    // 选择具体供应商
    const onSupplierIdChange = (id: string) => {
      const item = allSupplierName.value.filter((item: any) => {
        if (item.id === id) {
          return item;
        }
      });
      advanceForm.value.supplier_id = id;
      advanceForm.value.collecting_company = item[0].name;
      advanceForm.value.bank_account = '';
      advanceForm.value.bank = '';
      if (item[0].gather_account_list && item[0].gather_account_list.length > 0) {
        const bankList = item[0].gather_account_list.filter((item: any) => {
          if (item.account_type === 1) {
            return item;
          }
        });
        if (bankList.length > 0) {
          bankAccount.value = bankList;
          advanceForm.value.bank_account = bankList[0].bank_card_number;
          advanceForm.value.bank = bankList[0].bank_of_deposit;
        } else {
          ctx.root.$message.warning('请至供应商管理功能完善信息');
        }
      } else {
        ctx.root.$message.warning('请至供应商管理功能完善信息');
      }
    };

    const chooseBankAccount = (bank_card_number: string) => {
      const one = bankAccount.value.filter((item: any) => {
        if (item.bank_card_number === bank_card_number) {
          return item;
        }
      });
      advanceForm.value.bank = one[0].bank_of_deposit;
    };

    // 搜索获取供应商列表
    const getAllSupplierName = async (keyword: string) => {
      const { data: response } = await GetSupplierCustomerList({ keyword });
      allSupplierName.value = response.success ? response.data : [];
      if (props.edit) {
        onSupplierIdChange(props.info.company_id);
      }
    };

    // 抛出关闭事件
    const emitClose = (success = false) => ctx.emit('dialog:close', success);

    const handleDialogCancel = () => {
      emitClose();
    };
    const handleDialogSubmit = async () => {
      const result = await new Promise(resolve =>
        (ctx.refs.advanceFormRef as ElForm).validate(result => resolve(result)),
      );
      if (!result) {
        return;
      }
      saveLoading.value = true;
      const payload: any = {
        approval_type: 3,
        company_id: advanceForm.value.supplier_id,
        customer_id: advanceForm.value.customer_id,
        borrowing_amount: advanceForm.value.borrowing_amount + '',
        back_amount: advanceForm.value.pay_back_amount + '',
        borrowing_reason: advanceForm.value.borrowing_reason,
        remark: advanceForm.value.remark,
        collecting_company: advanceForm.value.collecting_company,
        bank_card_number: advanceForm.value.bank_account,
        bank_of_deposit: advanceForm.value.bank,
        attachment: advanceForm.value.attachment,
        project_id: advanceForm.value.project_id,
        business_type: advanceForm.value.business_type,
        brand_id: advanceForm.value.business_type !== 5 ? advanceForm.value.brand_id : '',
      };
      const [{ data: response }, _] = await Promise.all([
        await SaveAdvanceApply(payload),
        await sleep(200),
      ]);
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
      advanceForm.value.attachment.push(res.data.source);
    };

    onBeforeMount(() => {
      if (props.edit) {
        getAllCustomerName(props.info.company_name);
        getAllSupplierName(props.info.collecting_company);
        advanceForm.value.customer_id = props.info.customer_id;
        advanceForm.value.borrowing_amount = props.info.borrowing_amount;
        advanceForm.value.pay_back_amount = props.info.back_amount;
        advanceForm.value.bank_account = props.info.bank_card_number;
        advanceForm.value.bank = props.info.bank_of_deposit;
        advanceForm.value.supplier_id = props.info.company_id;
        advanceForm.value.borrowing_reason = props.info.borrowing_reason;
        advanceForm.value.remark = props.info.remark;
        if (props.info.attachment && props.info.attachment.length > 0) {
          advanceForm.value.attachment = props.info.attachment;
        }
      }
    });

    return {
      saveLoading,
      emitClose,
      handleDialogCancel,
      handleDialogSubmit,
      advanceForm,
      resetForm,
      advanceFormRules,
      allCustomerName,
      getAllCustomerName,
      onCustomerIdChange,
      allProjectName,
      onProjectIdChange,
      beforeUpload,
      successHandle,
      allSupplierName,
      getAllSupplierName,
      onSupplierIdChange,
      inputAmount,
      bankAccount,
      chooseBankAccount,
    };
  },
});
