import { LiveProject, LiveProjectForm } from '@/types/tiange/live.project';
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch,
} from '@vue/composition-api';
import lodash from '@/utils/lodash/custom';
import { QueryShopAndBrandRecord } from '@/types/tiange/customer';
import { QueryShopAndBrand } from '@/services/customers';
import { ElForm } from 'element-ui/types/form';
import {
  BusinessTypeEnum,
  BusinessTypeMap,
  CooperationTypeEnum,
  CustomerCategoryMAP,
} from '@/types/tiange/common';
import { ValidateCallback } from '@/types/vendor/form';
import { GetStudioList } from '@/services/studio';
import { queryUserNamesByRoles } from '@/api/customer';
import { SaveLiveProject } from '@/services/live.project';
import { sleep } from '@/utils/func';
import { getPositiveNumber } from '@/utils/string';
import { GetUserBusinessTypes } from '@/use/permission';
const { debounce } = lodash;

const REG_COMMISSION_RATE = /100|[1-9]\d?/;

const useForm = (newForm: boolean, defaultBusinessType: number) => {
  const UserBusinessTypeList = GetUserBusinessTypes();

  const ProjectBusinessTypeChoices = [BusinessTypeEnum.taobao, BusinessTypeEnum.douyin];

  const ProjectBusinessTypeList = newForm
    ? ProjectBusinessTypeChoices.filter(item => UserBusinessTypeList.includes(item))
    : ProjectBusinessTypeChoices;

  /** 业务类型选项 */
  const BusinessTypeOptions = ProjectBusinessTypeList.map(id => {
    return { value: id, label: BusinessTypeMap.get(id) };
  });

  const projectForm = ref<LiveProjectForm>({
    id: -1,
    project_name: '',
    company_id: '',
    business_type: defaultBusinessType,
    cooperation_type: -1,
    studio_id: '',
    start_date: '',
    end_date: '',
    commission_rate: '',
    customer_manager_id: '',
    live_num_per_month: '',
    duration_per_live: '',
    month_duration: '',
    other_requirement: '',
    remark: '',
    settlement_cycle_type: -1,
    price_per_hour: '',
    project_manager_id: '',
    live_account_ids: [],
    feishu_department_id: undefined,
    feishu_department_name: undefined,
    brand_id: undefined,
  });

  const formRules = ref({
    company_id: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
    project_name: [{ required: true, message: '请选择项目名称', trigger: 'blur' }],
    business_type: [
      { required: true, message: '请选择业务类型', trigger: 'change' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value === -1) {
            callback(new Error('请选择业务类型'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    commission_rate: [{ required: true, message: '请输入佣金比例', trigger: 'change' }],
    settlement_cycle_type: [
      { required: true, message: '请选择结算周期', trigger: 'change' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value === -1) {
            callback(new Error('请选择结算周期'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    price_per_hour: [
      { required: true, message: '请输入小时报价', trigger: 'change' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value <= 0) {
            callback(new Error('只能是正数'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    customer_manager_id: [{ required: true, message: '请选择客户经理', trigger: 'change' }],
    project_manager_id: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
    cooperation_type: [
      { required: true, message: '请选择合作类型', trigger: 'change' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value === -1) {
            callback(new Error('请选择合作类型'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    studio_id: [{ required: false, message: '请选择直播间', trigger: 'change' }],
    start_date: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
    end_date: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  });

  /** 小时报价 */
  const getPricePerHour = (value: string) => {
    projectForm.value.price_per_hour = getPositiveNumber(value);
  };

  const getPositiveInteger = (value: string) =>
    (/[1-9]\d{0,8}/.exec(value.replace(/\D+/gu, '')) ?? [''])[0];

  const getCommissionRate = (value: string) =>
    (REG_COMMISSION_RATE.exec(value.replace(/\D+/gu, '')) ?? [''])[0];

  const inputPositiveInteger = (
    value: string,
    field: 'live_num_per_month' | 'duration_per_live' | 'month_duration' | 'commission_rate',
  ) => {
    if (field === 'commission_rate') {
      projectForm.value[field] = getCommissionRate(value);
    } else {
      projectForm.value[field] = getPositiveInteger(value);
    }
  };

  /** 直播间列表 */
  const allStudioName = ref<any>([]);
  const getAllStudioName = async (studio_name?: string) => {
    const { data: response } = await GetStudioList({
      page_num: 1,
      num: 100,
      studio_name: studio_name,
      business_type: projectForm.value.business_type.toString(),
    });

    allStudioName.value = response.success ? response.data.data : [];
  };

  const onStudioIdChange = (studio_id: string) => {
    projectForm.value.studio_id = studio_id;
  };

  /** 客户经理搜索 */
  const allCustomerName = ref<any>([]);

  const getAllCustomerName = async () => {
    const { data: response } = await queryUserNamesByRoles({
      roles: '1008',
      business_type: projectForm.value.business_type,
    });

    allCustomerName.value = response.success ? response.data : [];
  };

  /** 项目经理 */
  const allManagerName = ref<any>([]);
  const getAllManagerName = async () => {
    const { data: response } = await queryUserNamesByRoles({
      roles: '1003',
      business_type: projectForm.value.business_type,
    });

    allManagerName.value = response.success ? response.data : [];
  };

  /** 所有店铺选项 */
  const allStoreName = ref<QueryShopAndBrandRecord[]>([]);

  /** reload表单选中项 */
  const reloadFormItems = (project: LiveProject) => {
    getAllStoreName(project.shop_name);
    getAllStudioName(project.studio_name);
  };

  /** 客户名称 下拉选择 */
  const getAllStoreName = async (shop_name: string) => {
    const { data: response } = await QueryShopAndBrand({ shop_name });

    allStoreName.value = response.success ? response.data : [];
  };

  /** 选中的客户名称 */
  const selectedShopItem = computed(() =>
    allStoreName.value.find(item => {
      return item.id.toString() === projectForm.value.company_id.toString();
    }),
  );

  const brand_name = computed(() => {
    return selectedShopItem.value?.brand_name ?? '';
  });

  /** 店铺类目 */
  const shop_cateogry_name = computed(() => {
    return CustomerCategoryMAP.get(selectedShopItem.value?.category ?? -1) ?? '';
  });

  const onCustomerIdChange = (company_id: string) => {
    projectForm.value.company_id = company_id;
  };

  if (!newForm) {
    getAllCustomerName();
    getAllManagerName();
  }

  /** 业务类型选择 关联变动 */
  const onBusinessTypeChange = () => {
    /** 项目经理 客户经理 直播间 需要重新选择 */
    projectForm.value.customer_manager_id = '';
    projectForm.value.project_manager_id = '';
    projectForm.value.studio_id = '';

    getAllCustomerName();
    getAllManagerName();
    if (projectForm.value.cooperation_type === CooperationTypeEnum.selfSupport) {
      getAllStudioName();
    }
  };

  // 淘宝直播账号
  const taobaoLiveBindAccounts = ref([{ account: '' }, { account: '' }, { account: '' }]);

  return {
    getPositiveInteger,
    taobaoLiveBindAccounts,
    projectForm,
    formRules,
    getPricePerHour,
    inputPositiveInteger,
    getAllStudioName,
    onStudioIdChange,
    getAllCustomerName,
    getAllManagerName,
    onCustomerIdChange,
    onBusinessTypeChange,
    BusinessTypeOptions,
    shop_cateogry_name,
    brand_name,
    allStoreName,
    reloadFormItems,
    allCustomerName,
    allManagerName,
    allStudioName,
    getAllStoreName,
  };
};

export default defineComponent({
  name: 'AddLiveProject',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    isEditForm: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Object as PropType<LiveProject>,
      required: false,
    },
  },

  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const saveLoading = ref(false);
    const formTitle = ref<string>('新增项目');

    const {
      getPositiveInteger,
      taobaoLiveBindAccounts,
      projectForm,
      formRules,
      getPricePerHour,
      inputPositiveInteger,
      getAllStudioName,
      onStudioIdChange,
      getAllCustomerName,
      getAllManagerName,
      shop_cateogry_name,
      brand_name,
      allStoreName,
      reloadFormItems,
      allCustomerName,
      allManagerName,
      allStudioName,
      getAllStoreName,
      onCustomerIdChange,
      onBusinessTypeChange,
      BusinessTypeOptions,
    } = useForm(props.project === undefined, props.project?.business_type ?? -1);

    onBeforeMount(() => {
      getAllCustomerName();
      getAllManagerName();
    });

    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
    };

    watch(
      () => taobaoLiveBindAccounts.value,
      newVal => {
        if (newVal) {
          const account_ids = taobaoLiveBindAccounts.value.map(el => el.account);
          projectForm.value.live_account_ids = account_ids ?? [];
        }
      },
      {
        deep: true,
      },
    );

    watch(
      () => projectForm.value.cooperation_type,
      newVal => {
        if (newVal === CooperationTypeEnum.region) {
          projectForm.value.studio_id = '';
        }
      },
    );

    watch(
      () => props.visible,
      newVal => {
        if (newVal) {
          resetForm();
          // formRef.value?.clearValidate();
          formRef.value?.resetFields();
          formTitle.value = props.project === undefined ? '新增项目' : '编辑项目';

          if (props.project !== undefined) {
            projectForm.value.id = props.project.id;
            projectForm.value.project_name = props.project.project_name;
            projectForm.value.company_id = props.project.company_id;
            projectForm.value.business_type = props.project.business_type;
            projectForm.value.cooperation_type = props.project.cooperation_type;
            projectForm.value.studio_id = props.project.studio_id;
            projectForm.value.start_date = props.project.start_date;
            projectForm.value.end_date = props.project.end_date;
            projectForm.value.commission_rate = props.project.commission_rate;
            projectForm.value.customer_manager_id = props.project.customer_manager_id;
            projectForm.value.live_num_per_month = props.project.live_num_per_month;
            projectForm.value.duration_per_live = props.project.duration_per_live;
            projectForm.value.month_duration = props.project.month_duration;
            projectForm.value.other_requirement = props.project.other_requirement;
            projectForm.value.remark = props.project.remark;
            projectForm.value.settlement_cycle_type = props.project.settlement_cycle_type;
            projectForm.value.price_per_hour = props.project.price_per_hour;
            projectForm.value.project_manager_id = props.project.project_manager_id;

            if (props.project.live_account_ids) {
              projectForm.value.live_account_ids = props.project.live_account_ids
                .toString()
                .split(',');

              const account_arr: any = [];
              projectForm.value.live_account_ids.forEach((id, _) => {
                account_arr.push({ account: id });
              });
              taobaoLiveBindAccounts.value = account_arr;
            }
            reloadFormItems(props.project);
          }
        }
      },
    );

    /** 重置表单 */
    const resetForm = () => {
      projectForm.value.id = -1;
      projectForm.value.company_id = '';
      projectForm.value.business_type = -1;
      projectForm.value.cooperation_type = -1;
      projectForm.value.studio_id = '';
      projectForm.value.start_date = '';
      projectForm.value.end_date = '';
      projectForm.value.commission_rate = '';
      projectForm.value.customer_manager_id = '';
      projectForm.value.live_num_per_month = '';
      projectForm.value.duration_per_live = '';
      projectForm.value.month_duration = '';
      projectForm.value.other_requirement = '';
      projectForm.value.remark = '';
      projectForm.value.settlement_cycle_type = -1;
      projectForm.value.price_per_hour = '';
      projectForm.value.project_manager_id = '';

      allStoreName.value = [];

      taobaoLiveBindAccounts.value = [{ account: '' }, { account: '' }, { account: '' }];
    };

    /** 点击保存 */
    const submit = async () => {
      if (saveLoading.value) {
        return;
      }

      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }

      const payload: LiveProjectForm = {
        project_name: projectForm.value.project_name,
        company_id: projectForm.value.company_id,
        business_type: projectForm.value.business_type,
        cooperation_type: projectForm.value.cooperation_type,
        studio_id: projectForm.value.studio_id,
        start_date: projectForm.value.start_date,
        end_date: projectForm.value.end_date,
        commission_rate: projectForm.value.commission_rate,
        customer_manager_id: projectForm.value.customer_manager_id,
        live_num_per_month: projectForm.value.live_num_per_month,
        duration_per_live: projectForm.value.duration_per_live,
        month_duration: projectForm.value.month_duration,
        other_requirement: projectForm.value.other_requirement,
        remark: projectForm.value.remark,
        settlement_cycle_type: projectForm.value.settlement_cycle_type,
        price_per_hour: projectForm.value.price_per_hour,
        project_manager_id: projectForm.value.project_manager_id,
        live_account_ids: projectForm.value.live_account_ids,
        feishu_department_id: projectForm.value.feishu_department_id,
        feishu_department_name: projectForm.value.feishu_department_name,
        brand_id: projectForm.value.brand_id,
      };
      if (projectForm.value.id !== -1) {
        payload.id = projectForm.value.id;
      }

      /** 开始时间晚与结束时间 */
      if (projectForm.value.start_date >= projectForm.value.end_date) {
        ctx.root.$message.error('结束时间需要晚于开始时间');
        return;
      }

      if (!REG_COMMISSION_RATE.test(projectForm.value.commission_rate)) {
        ctx.root.$message.error('佣金比例只能在1-100的范围');
        return;
      }

      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveLiveProject(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;

      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);
        // resetForm();
      } else {
        ctx.root.$message.error(response.message ?? '项目保存失败');
      }
    };

    const onSaveBtnClick = debounce(submit, 200);

    return {
      BusinessTypeEnum,
      getPositiveInteger,
      taobaoLiveBindAccounts,
      BusinessTypeOptions,
      formTitle,
      getPricePerHour,
      inputPositiveInteger,
      saveLoading,
      CooperationTypeEnum,
      allCustomerName,
      getAllCustomerName,
      allManagerName,
      getAllManagerName,
      formRef,
      brand_name,
      shop_cateogry_name,
      allStudioName,
      getAllStudioName,
      onStudioIdChange,
      getAllStoreName,
      allStoreName,
      onCustomerIdChange,
      onBusinessTypeChange,
      formRules,
      onCancelBtnClick,
      onSaveBtnClick,
      projectForm,
    };
  },
});
