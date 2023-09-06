/**
 * 新增/编辑合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:06:18
 */
import { computed, defineComponent, inject, Ref, ref, watch } from '@vue/composition-api';
import { contractTypeOptions, saleChances } from '@/const/options';
import { uploadContractAttachment, getContractUid, getContractShopUid } from '@/api/customer';
import { CONSTRACT_APPROVER } from '@/utils/config';
import {
  Contract,
  ContractForm,
  ContractSaveParams,
  ContractType,
  FormProceedsPlan,
} from '@/types/tiange/contract';
import { ElForm } from 'element-ui/types/form';
import { useContractShopAndCompany, useContractUid } from './useFormLogic';
import { getPositiveNumber } from '@/utils/string';
import {
  SaveContractCommonBusiness,
  SaveContractShop,
  SaveCoopContract,
} from '@/services/contract';
import lodash from '@/utils/lodash/custom';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { useRouter } from '@/use/vue-router';
import { BusinessTypeEnum, ProjectTypeEnum } from '@/types/tiange/common';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { GetCustomer } from '@/services/customers';
import { getFileExtension } from '@/utils/func';
import { Loading } from 'element-ui';
import { CompanyBase } from '@/types/tiange/customer';

const { debounce } = lodash;

const usePlan = () => {
  // * 计划部分

  /** 收款计划 */
  const proceeds_plan = ref<FormProceedsPlan[]>([]);

  /** 删除的收款计划，暂存变量 */
  const deletedPlans = ref<FormProceedsPlan[]>([]);

  // 计划默认值
  const defPlan = JSON.stringify({
    proceeds_plan_date: '',
    proceeds_amount: '',
    obtained_amount: '',
    to_obtain_amount: '',
    invoice_amount: '',
  });

  // 添加一条收款计划
  const addOnePlan = () => {
    proceeds_plan.value.push({
      proceeds_plan_date: '',
      proceeds_amount: '',
      obtained_amount: '',
      to_obtain_amount: '',
      invoice_amount: '',
    });
  };

  /** 明细是否为空 */
  const isEmptyDetail = (plan: FormProceedsPlan) => JSON.stringify(plan) === defPlan;

  /** 删除一条收款计划 */
  const removePlan = (index: number) => {
    if (proceeds_plan.value[index].id) {
      proceeds_plan.value[index].is_delete = 1;
      deletedPlans.value.push(proceeds_plan.value[index]);
    }
    proceeds_plan.value.splice(index, 1);

    if (proceeds_plan.value.length === 0) {
      addOnePlan();
    }
  };

  /** 是否仅有一条明细且为空 */
  const isOnlyEmpty = computed(
    () => proceeds_plan.value.length === 1 && isEmptyDetail(proceeds_plan.value[0]),
  );

  addOnePlan();

  return {
    proceeds_plan,
    deletedPlans,
    addOnePlan,
    removePlan,
    isOnlyEmpty,
  };
};

export default defineComponent({
  name: 'AddContract',
  props: {
    type: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      no_upload_click: false,
      isAddingEditing: false,
      // 选项
      contractTypeOptions,
      saleChances,
      planData: [],
      accountManager: [],
      approver: [],
      uploadAttachment: [],
      approverList: [
        { id: 6, username: '' }, // 文竹
        { id: 61, username: '' }, // 益智
        { id: 74, username: '' }, // 红掌
      ],
      // 客户(公司)名称 字段的提示文字显示标志
      companyNameIsShow: false,
    };
  },
  computed: {
    // 计算选中的销售渠道在合同明细里面显示
    selectedSaleChances(): { value: number; label: string }[] {
      const selectedSaleChances = this.saleChances.filter(item => {
        if (this.form.sale_chance.find(selectedItem => selectedItem === item.value)) {
          return true;
        } else {
          return false;
        }
      });
      return selectedSaleChances;
    },
  },
  setup(props, ctx) {
    // 新增弹窗显示标志
    const router = useRouter();
    const visible = ref(false);
    const formRef = ref<ElForm | null>(null);
    const project_add_id = inject<Ref<string>>('project_add_id');
    const project = inject<any>('project');
    const breadcrumb = useBreadcrumb();

    const is_mcn_type = computed(() => project.value?.business_type === 5);
    const mcn_company_options = computed<CompanyBase[]>(() => {
      const finder = useContractShopAndCompanys.allStoreName.value.find(
        el => el.shop_id === form.value.partner_id,
      );
      return finder?.companies ?? [];
    });

    /** 合同类型 */
    const project_contract_type = ref(ContractType.Sales);

    /** 店播项目 */
    // const project_type = ref(ProjectTypeEnum.live);
    const project_type = computed<ProjectTypeEnum | undefined>(() => {
      switch (project.value?.business_type) {
        case BusinessTypeEnum.marketing:
          return ProjectTypeEnum.marketing;
        case BusinessTypeEnum.base:
        case BusinessTypeEnum.mcn:
          return ProjectTypeEnum.common_business;
        case BusinessTypeEnum.douyin:
        case BusinessTypeEnum.taobao:
          return ProjectTypeEnum.live;
        case BusinessTypeEnum.locallife:
          return ProjectTypeEnum.local_life;
        case BusinessTypeEnum.supplyChain:
          return ProjectTypeEnum.supply_chain;
      }
      return undefined;
    });

    if (
      breadcrumb.isLegalSupplierContractDetail ||
      breadcrumb.isLegalCustomerContractDetail ||
      breadcrumb.isLegalStatisticsSupplierContractDetail ||
      breadcrumb.isLegalStatisticsCustomerContractDetail
    ) {
      project_contract_type.value = ContractType.Framework;
    } else if (
      breadcrumb.isCommonBusinessDetail ||
      breadcrumb.isCommonBusinessCustomerContractDetail ||
      breadcrumb.isCommonBusinessSupplierContractDetail
    ) {
      /** 通用业务类型 */
      project_contract_type.value = ContractType.Purchase;
      // project_type.value = ProjectTypeEnum.common_business;
    } else if (breadcrumb.isLiveDetail) {
      project_contract_type.value = ContractType.Purchase;
      // project_type.value = ProjectTypeEnum.live;
    } else if (breadcrumb.isCoopDetail) {
      project_contract_type.value = ContractType.SupplierFramework;
      // project_type.value = ProjectTypeEnum.marketing;
    }

    // 合同表单
    const form = ref<ContractForm>({
      company_id: undefined,
      shop_name: '',
      contract_uid: '',
      customer_company_name: '',
      contract_type: ContractType.Sales,
      sale_chance: [],
      num: '',
      price: '',
      unit: 1,
      discount: '',
      contract_amount: '',
      attachment_url: [],
      remark: '',
      proceeds_plan: [
        {
          proceeds_plan_date: '',
          proceeds_amount: '',
          obtained_amount: '',
          to_obtain_amount: '',
          invoice_amount: '',
        },
      ],
      partner_id: '',
      coop_date: [],
    });

    const useContractShopAndCompanys = useContractShopAndCompany(
      form,
      formRef as Ref<ElForm | null>,
    );

    const {
      clearContractInfoRecords,
      contract_uid_loading,
      contractInfoRecords,
      getCustmerByContractUid,
      resetContractUid,
      resetFrameContractUid,
      refillContractUid,
      contract_uid: frame_contract_uid,
    } = useContractUid(form, formRef as Ref<ElForm | null>, 1, ContractType.Framework);

    // * 合同类型变动清空关联合同编号
    watch(
      () => form.value.contract_type,
      (val, prevVal) => {
        if (val !== prevVal) {
          form.value.frame_contract_id = undefined;
          resetFrameContractUid();
        }
      },
    );

    // * 全选状态
    const saleChance = ref({
      checkAll: false,
      isIndeterminate: false,
    });

    // * 销售渠道全选
    const handleCheckAllChange = (val: boolean) => {
      form.value.sale_chance = val ? saleChances.map(item => item.value) : [];
      saleChance.value.isIndeterminate = false;
    };

    /** 选中的销售渠道 */
    const checkedChances = computed(() =>
      saleChances
        .filter(el => form.value.sale_chance.includes(el.value))
        .map(el => el.label)
        .join('、'),
    );

    const department = ref<any[]>([]);

    /** 是否销售合同 */
    const isSales = computed(() => form.value.contract_type === ContractType.Sales);

    const onContractUidChange = (value: number) => {
      formRef.value?.clearValidate();

      const customer = contractInfoRecords.value.find(item => item.contract_id === value);

      if (customer === undefined) {
        return;
      }

      const { contract_id } = customer;

      form.value.frame_contract_id = contract_id;
    };

    const customer_detail_company_name = ref<string>('');

    const getCustomerDetail = async (customer_id: number) => {
      try {
        const { data: response } = await GetCustomer({ customer_id });

        if (response.success) {
          const customer_detail = response.data.data[0];
          customer_detail_company_name.value = customer_detail.company_name;
        } else {
          ctx.root.$message.error(response.message);
        }
      } catch (err: any) {
        ctx.root.$message.error(err.message);
      }
    };

    watch(
      () => visible.value,
      async newVal => {
        if (newVal) {
          if (project.value) {
            const unifiedProjectId = project.value.id
              ? project.value.id
              : project.value.cooperation_id;

            form.value.current_project_id = unifiedProjectId;
            form.value.project_id = unifiedProjectId;
            form.value.project_type = project_type.value;

            form.value.customer_company_name =
              form.value.customer_company_name === '--' ? '' : form.value.customer_company_name;

            /** 没有找到 客户(公司)名称 数据的处理 */
            if (!form.value.customer_company_name) {
              /** 营销业务类型的项目 or 通用业务 客户类型 个人客户 */
              if (
                project.value.cooperation_id ||
                (project.value.customer_type && project.value.customer_type === 2)
              ) {
                /** 个人客户 没有公司名称 将个人 店铺所关联的公司带入 */
                await getCustomerDetail(project.value.customer_id);

                form.value.customer_company_name = customer_detail_company_name.value;
              }
            }

            if (
              project_type.value === ProjectTypeEnum.live ||
              project_type.value === ProjectTypeEnum.local_life ||
              project_type.value === ProjectTypeEnum.supply_chain
            ) {
              const contract_prefix =
                project.value.business_type === BusinessTypeEnum.taobao ? 'TDHT' : 'DDHT';
              getCustmerByContractUid(contract_prefix);
            } else if (project_type.value === ProjectTypeEnum.common_business) {
              /** 通用业务 */
              const contract_prefix =
                project.value.business_type === BusinessTypeEnum.base ? 'JDYW' : 'MCN';
              getCustmerByContractUid(contract_prefix);
            }
            if (!is_mcn_type.value) {
              form.value.partner_id = project.value.customer_id;
              useContractShopAndCompanys.shopNameSearchKey.value = project.value.shop_name;
              form.value.shop_name = project.value.shop_name;
              form.value.customer_company_name =
                project.value.customer_company_name ?? project.value.company_name;
              form.value.company_id = project.value.company_id;
              useContractShopAndCompanys.refillShopNameSearchKey(
                form.value.shop_name,
                is_mcn_type.value,
              );
            }
          }
        }
      },
    );

    /** 录入合同金额 */
    const inputContractAmount = (value: string) => {
      form.value.contract_amount = getPositiveNumber(value);

      form.value.discount = '';
    };

    /** 输入标准单价 */
    const inputPrice = (value: string) => {
      form.value.price = getPositiveNumber(value);
      computeContractAmount();
    };

    const inputNum = (value: string) => {
      form.value.num = getPositiveNumber(value);
      computeContractAmount();
    };

    const inputDiscount = (value: string) => {
      const num = getPositiveNumber(value);

      const val = (/^(?:10(?:\.0?)?|\d(?:\.\d?)?)/u.exec(num) ?? [''])[0];

      form.value.discount = val;

      computeContractAmount();
    };

    // 计算合同金额
    const computeContractAmount = () => {
      const { num, price, discount } = form.value;

      let amount;
      if (num !== '' && price !== '' && discount === '') {
        amount = Number(num) * Number(price);
      } else if (num !== '' && price !== '' && discount !== '') {
        amount = (Number(num) * Number(price) * Number(discount)) / 10;
      }

      form.value.contract_amount = amount ? amount.toFixed(0) : '';
    };

    const onlyPositiveInteger = (inputValue: string) => {
      const getPositiveInteger = (value: string) => {
        return value.replace(/\D/g, '').replace(REG_REMOVE_PREFIX_ZERO, '');
      };
      form.value.num = getPositiveInteger(inputValue);
    };

    const formRules = ref({
      contract_type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
      // shop_id: [{ required: true, message: '请选择关联店铺', trigger: ['blur', 'change'] }],
      // partner_id: [{ required: true, message: '请选择客户(公司)名称', trigger: ['change', 'blur'] }],
      partner_id: [{ required: true, message: '请选择关联店铺', trigger: ['blur', 'change'] }],
      company_id: [
        { required: true, message: '请选择客户(公司)名称', trigger: ['change', 'blur'] },
      ],
      coop_date: [{ required: true, message: '请选择合作期限', trigger: 'blur' }],
      sale_chance: [{ required: true, message: '请选择销售渠道', trigger: 'change' }],
      contract_amount: [{ required: true, message: '请输入合同金额', trigger: 'blur' }],
      attachment_url: [],
      proceeds_plan: [],
    });

    // 计划
    const plans = usePlan();

    const saveLoading = ref(false);

    /** 点击保存 */
    const submit = async () => {
      if (saveLoading.value) {
        return;
      }

      // ! 编辑时 合并已删除的数据
      if (props.type === 'edit') {
        form.value.proceeds_plan = plans.proceeds_plan.value.concat(plans.deletedPlans.value);
      } else {
        form.value.proceeds_plan = plans.proceeds_plan.value;
      }

      const result = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!result) {
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return;
      }

      const {
        contract_uid,
        contract_type,
        partner_id,
        company_id,
        sale_chance,
        coop_date: [coop_start_date, coop_end_date],
        ...rest
      } = form.value;

      // @ts-ignore
      const payload: ContractSaveParams =
        contract_type === ContractType.Sales
          ? {
              contract_uid,
              contract_type,
              // partner_id: partner_id === '' ? undefined : partner_id,
              sale_chance: sale_chance.map(el => `${el}`),
              coop_start_date,
              coop_end_date,
              shop_name: form.value.shop_name,
              remark: form.value.remark,
              customer_company_name: form.value.customer_company_name,
              partner_id,
              company_id,
              ...rest,
            }
          : {
              partner_id,
              company_id,
              id: rest.id,
              contract_uid,
              contract_type,
              // partner_id: partner_id === '' ? undefined : partner_id,
              sale_chance: sale_chance.map(el => `${el}`),
              coop_start_date,
              coop_end_date,
              remark: form.value.remark,
              shop_name: form.value.shop_name,
              attachment_url: form.value.attachment_url,
              customer_company_name: form.value.customer_company_name,
            };
      // @ts-ignore
      payload.project_id = form.value.project_id;

      // 提交保存
      saveLoading.value = true;

      let response: any;

      if (project_type.value === ProjectTypeEnum.common_business) {
        /** 通用业务的 合同保存 */
        const res = await SaveContractCommonBusiness({
          ...payload,
          project_id: payload.project_id,
        });

        response = res.data;
      } else if (project_type.value === ProjectTypeEnum.marketing) {
        /** 营销业务 **/
        const res = await SaveCoopContract({
          ...payload,
          project_id: payload.project_id,
          cooperation_id: payload.project_id,
        });
        response = res.data;
      } else {
        /** 店铺代播 **/
        const res = await SaveContractShop({
          ...payload,
          project_id: payload.project_id,
        });

        response = res.data;
      }
      saveLoading.value = false;

      if (response.success) {
        visible.value = false;
        plans.proceeds_plan.value = [
          {
            proceeds_plan_date: '',
            proceeds_amount: '',
            obtained_amount: '',
            to_obtain_amount: '',
            invoice_amount: '',
          },
        ];
        plans.deletedPlans.value = [];
        ctx.root.$message.success(response.message);
        ctx.emit(props.type === 'add' ? 'added' : 'edited');
      } else {
        ctx.root.$message.error(response.message ?? '合同保存失败，稍后重试');
      }
    };

    const onSaveBtnClick = debounce(submit, 200);
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

    const onShopChanged = (val: number) => {
      const finder = useContractShopAndCompanys.allStoreName.value.find(el => el.shop_id === val);
      // mcn_company_options.value = finder?.companies ?? [];
      useContractShopAndCompanys.shopNameSearchKey.value = finder?.shop_name;
      form.value.partner_id = finder?.shop_id;
      form.value.shop_name = finder?.shop_name;
      form.value.company_id = undefined;
      form.value.customer_company_name = undefined;
    };

    const onCompanyChanged = (val: number) => {
      const finder = mcn_company_options.value.find(el => el.company_id === val);
      form.value.company_id = finder?.company_id;
      form.value.customer_company_name = finder?.company_name;
    };

    const shop_type_str = (type: number) => {
      return type === 1 ? '淘宝' : type === 2 ? '天猫' : '抖音';
    };

    return {
      startLoading,
      closeLoading,
      onlyPositiveInteger,
      project,
      project_add_id,
      visible,
      /** 审批人id常量 */
      CONSTRACT_APPROVER,
      formRef,
      form,
      formRules,
      saleChance,
      checkedChances,
      handleCheckAllChange,
      department,
      isSales,
      resetContractUid,
      frame_contract_uid,
      refillContractUid,
      ...useContractShopAndCompanys,
      clearContractInfoRecords,
      contract_uid_loading,
      contractInfoRecords,
      getCustmerByContractUid,
      onContractUidChange,
      inputContractAmount,
      inputPrice,
      inputNum,
      inputDiscount,
      computeContractAmount,
      ...plans,
      saveLoading,
      onSaveBtnClick,
      project_contract_type,
      breadcrumb,
      router,
      project_type,
      is_mcn_type,
      mcn_company_options,
      onShopChanged,
      onCompanyChanged,
      shop_type_str,
    };
  },
  methods: {
    // 提供给父组件使用，勿删
    show(contractDetail: Contract) {
      this.no_upload_click = false;
      if (this.type === 'add') {
        this.getContractNumber();
      }

      this.resetForm();
      this.$nextTick(() => {
        this.formRef?.clearValidate();
      });

      // 如果是编辑 获取详情 写入表单
      if (this.type === 'edit') {
        if (!contractDetail) return false;
        this.saleChance.checkAll =
          contractDetail.contract_info.sale_chance.length === saleChances.length;
        this.saleChance.isIndeterminate =
          contractDetail.contract_info.sale_chance.length !== saleChances.length &&
          contractDetail.contract_info.sale_chance.length !== 0;
        (this.uploadAttachment as any).file = contractDetail.contract_detail.attachment_url
          ? {
              name: contractDetail.contract_detail.attachment_url.split('/')[
                contractDetail.contract_detail.attachment_url.split('/').length - 1
              ],
            }
          : null;

        const {
          contract_info: {
            id,
            company_id,
            contract_uid,
            contract_type,
            sale_chance,
            coop_start_date,
            coop_end_date,
            frame_contract_id,
            frame_contract_uid,
            company_name,
            shop_name,
          },
          contract_detail: { contract_amount, attachment_url, discount, num, price, unit, remark },
          proceeds_plan,
        } = contractDetail;
        const {
          contract_info: { partner_id },
        } = contractDetail;

        const isSales = contract_type === ContractType.Sales;

        this.form = {
          id,
          customer_company_name: company_name,
          company_id,
          contract_uid,
          contract_type,
          sale_chance: sale_chance.map(item => item.value),
          num: `${num}`,
          price,
          unit,
          discount: discount === '0.00' ? '' : discount,
          contract_amount,
          attachment_url: attachment_url.split(',').filter(el => el !== ''),
          remark,
          proceeds_plan,
          partner_id,
          shop_name,
          coop_date: [coop_start_date, coop_end_date],
          ...(isSales
            ? {
                frame_contract_id: frame_contract_id ?? undefined,
                frame_contract_uid: frame_contract_uid ?? undefined,
              }
            : {}),
          project_id: contractDetail.contract_info.project_id,
        };
        // * 回填关联店铺和客户(公司)名称
        this.refillShopNameSearchKey(shop_name, this.is_mcn_type);
        if (isSales && frame_contract_uid !== null) {
          this.refillContractUid(frame_contract_uid);
        }
        // if (this.is_mcn_type) {
        this.refillShopNameSearchKey(shop_name, this.is_mcn_type);
        // }
      } else {
        this.form.project_id = undefined;
      }
      this.visible = true;

      // 自动将滚动条滑到顶部
      setTimeout(() => {
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
      }, 100);
    },
    // 处理已选中的销售渠道变动（checkbox group）
    handleCheckedSaleChanceChange(value: any) {
      const checkedCount = value.length;
      this.saleChance.checkAll = checkedCount === saleChances.length;
      this.saleChance.isIndeterminate = checkedCount > 0 && checkedCount < saleChances.length;
    },
    beforeUpload(file: File) {
      if (file.size > 30 * 1024 * 1024) {
        this.$message.error(
          `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在30MB以内`,
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
        this.$message.warning('文件格式不正确，请使用  pdf / docx / doc / jpg / png / xlsx');

        return false;
      }

      return true;
    },
    // 上传附件
    uploadAttachmentFile(value: any) {
      const result = this.beforeUpload(value.file);
      if (!result) {
        return;
      }

      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract');

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
            // this.form.attachment_url = res.data.data.source;
            //   this.uploadAttachment.push({
            //   file: value.file.name,
            //   path: res.data.data.source
            // })
            this.form.attachment_url.push(res.data.data.source);
            if (this.form.attachment_url.length === 5) {
              this.no_upload_click = true;
              //  this.uploadAttachment.uploading = true;
            } else {
              this.no_upload_click = false;
            }
          }
          // this.uploadAttachment.uploading = false;
        })
        .catch(error => {
          this.closeLoading();
          this.$message({
            type: 'warning',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          // this.uploadAttachment.uploading = false;
          console.log(error.message);
        });
    },
    // 清除已上传的附件
    clearUploadedFile(index: number) {
      this.form.attachment_url.splice(index, 1);
      this.no_upload_click = false;
    },
    // 获取合同编号
    async getContractNumber() {
      Promise.resolve()
        .then(() => {
          if (this.project_contract_type === ContractType.Purchase)
            return getContractShopUid({
              business_type: this.project?.business_type,
            });
          else if (this.project_contract_type === ContractType.SupplierFramework)
            return getContractUid();
          return getContractUid();
        })
        .then(res => {
          if (res.data.success) {
            this.form.contract_uid = res.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '合同编号获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 重置表单
    resetForm() {
      this.form = {
        company_id: undefined,
        shop_name: '',
        customer_company_name: '',
        contract_uid: '',
        // customer_name: '',
        contract_type: ContractType.Sales,
        sale_chance: [],
        num: '',
        price: '',
        unit: 1,
        discount: '',
        contract_amount: '',
        attachment_url: [],
        remark: '',
        proceeds_plan: [
          {
            proceeds_plan_date: '',
            proceeds_amount: '',
            obtained_amount: '',
            to_obtain_amount: '',
            invoice_amount: '',
          },
        ],
        // department: '',
        // manager_id: '',
        // company_name: '',
        partner_id: '',
        // approver_id: undefined
        coop_date: [],
        current_project_id: this.project_add_id?.value,
        project_type: this.project_type,
      };
      this.saleChance.checkAll = false;
      this.saleChance.isIndeterminate = false;
      this.resetContractUid();
      this.resetShopName();
    },
    // 根据id获取审批人名称
    // getApproverUsername(id: number) {
    //   return this.approverList.find(item => item.id === id)?.username;
    // },
    // 当选择客户经理select处于焦点状态事件，检测选项是否为空，如果没有选项，再次请求
    // handleCustomerManagerSelectFocus() {
    //   if (this.accountManager.length === 0) {
    //     // this.getAccountManager();
    //   }
    // },
    // 补充公司信息
    handleAddCompanyNameClick() {
      this.visible = false;
      window.open('/customer/list');
      // this.$router.push({
      //   name: RouterNameCustomer.list,
      // });
    },
  },
});
