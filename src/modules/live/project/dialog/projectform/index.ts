import { LiveProject, LiveProjectForm } from '@/types/tiange/live.project';
import { computed, defineComponent, nextTick, PropType, ref, watch } from '@vue/composition-api';
import lodash from '@/utils/lodash/custom';
// import { QueryShopAndBrandRecord } from '@/types/tiange/customer';
// import { QueryShopAndBrand, GetBrandList } from '@/services/customers';
import { GetShopLiveCompanyList } from '@/services/company';
import { ElForm } from 'element-ui/types/form';
import {
  BusinessTypeEnum,
  BusinessTypeMap,
  CooperationTypeEnum,
  // CustomerCategoryMAP,
} from '@/types/tiange/common';
import { ValidateCallback } from '@/types/vendor/form';
import { GetStudioList } from '@/services/studio';
import { SaveLiveProject } from '@/services/live.project';
import { sleep } from '@/utils/func';
import { getPositiveNumber } from '@/utils/string';
// import { GetUserBusinessTypes } from '@/use/permission';
import { ElInput } from 'element-ui/types/input';
import { GetFeishuDepartmentList } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { ElTree } from 'element-ui/types/tree';
import { departmentFilterDisabled } from '@/utils/filter';
import { GetUser } from '@/services/system';
import { Brand } from '@/types/tiange/brand';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
// import { useRequest } from '@gm/hooks/ahooks';
// import { GetBrandList } from '@/services/customers';
const { debounce } = lodash;

const REG_COMMISSION_RATE = /0|100|[1-9]\d?/;

const useForm = (
  newForm: boolean,
  defaultBusinessType: number | '',
  business_type: number | undefined,
) => {
  // const UserBusinessTypeList = GetUserBusinessTypes();

  // 淘宝直播账号
  const taobaoLiveBindAccounts = ref([
    { account: '' },
    /*  { account: '' },
    { account: '' },
    { account: '' },
    { account: '' },*/
  ]);
  const ProjectForm = ref<LiveProjectForm>({
    service_amount: undefined,
    id: -1,
    project_name: '',
    company_id: '',
    company_name: '',
    // shop_name: '',
    // company_shop_id: '',
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
    feishu_department_level: 0,
    brand_id: undefined,
    gmv_way: 1,
    company_subject: undefined,
  });

  const formRules = ref({
    company_id: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
    brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
    project_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
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
    commission_rate: [
      { required: true, message: '请输入佣金比例', trigger: 'change' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value > 100) {
            callback(new Error('不能大于100'));
          } else if (value < 0) {
            callback(new Error('不能小于0'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
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
    service_amount: [{ required: true, message: '请输入服务费', trigger: 'blur' }],
    price_per_hour: [
      { required: true, message: '请输入小时报价', trigger: 'change' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value < 0) {
            callback(new Error('小时报价不能为负数'));
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
    feishu_department_id: [{ required: true, message: '请选择项目所属部门', trigger: 'change' }],
    taobaoLiveBindAccounts: [
      {
        trigger: 'change',
        required: true,
        message: '至少填写一个帐号',
        validator: (_: any, val: number, callback: any) => {
          const value = taobaoLiveBindAccounts.value;
          let isValidator = false;
          for (let i = 0; i < value.length; i++) {
            if (!/^\s*$/.test(value[i].account)) {
              isValidator = true;
              break;
            }
          }
          if (isValidator) callback();
          else callback(_.message);
        },
      },
    ],
    company_subject: [
      {
        required: true,
        message: '请选择归属主体',
        trigger: ['change'],
      },
    ],
  });

  /** 小时报价 */
  const getPricePerHour = (value: string) => {
    ProjectForm.value.price_per_hour = getPositiveNumber(value);
  };
  /** 服务费 */
  const getPriceServerAmount = (value: string) => {
    ProjectForm.value.service_amount = getPositiveNumber(value);
  };
  const getPositiveInteger = (value: string) =>
    (/[1-9]\d{0,8}/.exec(value.replace(/\D+/gu, '')) ?? [''])[0];

  const getCommissionRate = (value: string) => getPositiveNumber(value);

  const inputPositiveInteger = (
    value: string,
    field: 'live_num_per_month' | 'duration_per_live' | 'month_duration' | 'commission_rate',
  ) => {
    if (field === 'commission_rate') {
      ProjectForm.value[field] = getCommissionRate(value);
    } else {
      ProjectForm.value[field] = getPositiveInteger(value);
    }
    ProjectForm.value.gmv_way = undefined;
  };

  /** 直播间列表 */
  const allStudioName = ref<any>([]);
  const getAllStudioName = async (studio_name?: string) => {
    const { data: response } = await GetStudioList({
      page_num: 1,
      num: 100,
      studio_name: studio_name,
      business_type: ProjectForm.value.business_type?.toString(),
    });

    allStudioName.value = response.success ? response.data.data : [];
  };

  const onStudioIdChange = (studio_id: string) => {
    ProjectForm.value.studio_id = studio_id;
  };

  /** 所有店铺选项 */
  const allStoreName = ref<any[]>([]);

  /** 所有店铺选项 */
  const allCompanyName = ref<any[]>([]);

  /** reload表单选中项 */
  const reloadFormItems = (project: LiveProject) => {
    getAllStudioName(project.studio_name);
  };

  /** 客户名称 下拉选择 */
  const getAllCompanyName = async (company_name: string) => {
    const { data: response } = await GetShopLiveCompanyList(
      { company_name, verify_status: 1 },
      business_type,
    );
    allCompanyName.value = response.success ? response.data.data : [];
  };

  /** 客户名称 下拉选择 */
  // const getAllStoreName = async (shop_name: string) => {
  //   const { data: response } = await QueryShopAndBrand({ shop_name });
  //   allStoreName.value = response.success ? response.data : [];
  // };

  /** 选中的客户名称 */
  // const selectedShopItem = computed(() =>
  //   allStoreName.value.find(item => {
  //     if (ProjectForm.value.company_shop_id) {
  //       return item.shop_id === ProjectForm.value.company_shop_id;
  //     }
  //   }),
  // );

  // const brand_name = computed(() => {
  //   const name = selectedShopItem.value?.brand_name;
  //   return name ? name : '--';
  // });

  /** 店铺类目 */
  // const shop_cateogry_name = computed(() => {
  //   const category = CustomerCategoryMAP.get(selectedShopItem.value?.category ?? -1);
  //   return category ? category : '--';
  // });

  // const onCompanyIdChange = (company_id: string) => {
  //   ProjectForm.value.company_id = company_id;
  //   ProjectForm.value.company_shop_id = '';
  //   for (let index = 0; index < allCompanyName.value.length; index++) {
  //     if (allCompanyName.value[index].id === company_id) {
  //       allStoreName.value = allCompanyName.value[index].shops_info ?? [];
  //     }
  //   }
  // };
  // const onShopIdChange = (company_shop_id: string) => {
  //   ProjectForm.value.company_shop_id = company_shop_id;
  // };

  return {
    getPositiveInteger,
    taobaoLiveBindAccounts,
    ProjectForm,
    formRules,
    getPricePerHour,
    getPriceServerAmount,
    inputPositiveInteger,
    getAllStudioName,
    onStudioIdChange,
    // onCompanyIdChange,
    // onShopIdChange,
    // shop_cateogry_name,
    // brand_name,
    allStoreName,
    allCompanyName,
    reloadFormItems,
    allStudioName,
    // getAllStoreName,
    getAllCompanyName,
  };
};

export default defineComponent({
  name: 'LiveProjectForm',
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
    const autoFocuseRef = ref<ElInput | undefined>(undefined);
    const formRef = ref<ElForm | null>(null);
    const saveLoading = ref(false);
    const formTitle = ref<string>('新增项目');
    const { isFromLocalLife, business_type } = useProjectBaseInfo();
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);

    const live_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);

    const treeProps = {
      label: 'name',
      children: 'sons',
    };

    const default_checked_department_ids = computed(() => {
      return ProjectForm.value.feishu_department_id ? [ProjectForm.value.feishu_department_id] : [];
    });
    const {
      getPositiveInteger,
      taobaoLiveBindAccounts,
      ProjectForm,
      formRules,
      getPricePerHour,
      getPriceServerAmount,
      inputPositiveInteger,
      getAllStudioName,
      onStudioIdChange,
      // shop_cateogry_name,
      // brand_name,
      allStoreName,
      allCompanyName,
      reloadFormItems,
      allStudioName,
      // getAllStoreName,
      getAllCompanyName,
      // onCompanyIdChange,
      // onShopIdChange,
    } = useForm(
      props.project === undefined,
      props.project?.business_type ?? '',
      business_type.value,
    );

    /** 客户经理搜索 */
    const allCustomerName = ref<{ id: number; username: string }[]>([]);

    /** 是否不再是客户经理ID */
    const disabledManagerId = ref(-1);

    const getAllCustomerName = async (val: string) => {
      if (ProjectForm.value.business_type === '') {
        return;
      }
      const { data: response } = await GetUser({
        /*roles: '1008',
            business_type: BusinessTypeEnum.marketing,*/
        search_type: 2,
        search_value: val,
        is_checked: 1,
      });
      allCustomerName.value = response.success ? response.data.data : [];
      const current_manager_id = props.project?.customer_manager_id;

      if (current_manager_id) {
        if (
          !allCustomerName.value.map(el => el.id.toString()).includes(current_manager_id.toString())
        ) {
          disabledManagerId.value = current_manager_id;

          allCustomerName.value.push({
            id: current_manager_id,
            username: props.project?.customer_manager ?? '--',
          });
        }
      }
    };

    /** 项目经理 */
    /** 是否不再是项目经理ID */
    const disabledProjectManagerId = ref(-1);

    const allManagerName = ref<{ id: number; username: string }[]>([]);
    const getAllManagerName = async (val: string) => {
      if (ProjectForm.value.business_type === '') {
        return;
      }
      const { data: response } = await GetUser({
        /*roles: '1008',
            business_type: BusinessTypeEnum.marketing,*/
        search_type: 2,
        search_value: val,
        is_checked: 1,
      });
      allManagerName.value = response.success ? response.data.data : [];
      const current_project_manager_id = props.project?.project_manager_id;
      if (current_project_manager_id) {
        if (
          !allManagerName.value
            .map(el => el.id.toString())
            .includes(current_project_manager_id.toString())
        ) {
          disabledProjectManagerId.value = current_project_manager_id;
          allManagerName.value.push({
            id: current_project_manager_id,
            username: props.project?.project_manager ?? '--',
          });
        }
      }
    };

    /** 业务类型选择 关联变动 */
    const onBusinessTypeChange = () => {
      /** 项目经理 客户经理 直播间 需要重新选择 */
      ProjectForm.value.customer_manager_id = '';
      ProjectForm.value.project_manager_id = '';
      ProjectForm.value.studio_id = '';

      /*getAllCustomerName('');
      getAllManagerName('');*/
      if (ProjectForm.value.cooperation_type === CooperationTypeEnum.selfSupport) {
        getAllStudioName();
      }
    };

    watch(
      () => taobaoLiveBindAccounts.value,
      newVal => {
        if (newVal) {
          const account_ids = taobaoLiveBindAccounts.value.map(el => el.account);
          ProjectForm.value.live_account_ids = account_ids ?? [];
        }
      },
      {
        deep: true,
      },
    );

    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
    };

    // const new_shop_cateogry_name = ref('');
    // const new_brand_name = ref('');
    const ProjectBusinessTypeChoices = [
      BusinessTypeEnum.douyin,
      BusinessTypeEnum.locallife,
      BusinessTypeEnum.supplyChain,
      BusinessTypeEnum.taobao,
      BusinessTypeEnum.taobaopick,
    ];
    /* const ProjectBusinessTypeList = newForm
      ? ProjectBusinessTypeChoices.filter(item => UserBusinessTypeList.includes(item))
      : ProjectBusinessTypeChoices;*/
    const ProjectBusinessTypeList = ProjectBusinessTypeChoices;

    /** 业务类型选项 */
    const BusinessTypeOptions = computed(() => {
      const category = ProjectBusinessTypeList.map(id => {
        return { value: id, label: BusinessTypeMap.get(id) };
      });
      return category ? category : '--';
    });

    watch(
      () => props.visible,
      async newVal => {
        if (newVal) {
          resetForm();

          // formRef.value?.clearValidate();
          formRef.value?.resetFields();
          formTitle.value = props.project === undefined ? '新增项目' : '编辑项目';
          if (props.project !== undefined) {
            if (props.isEditForm) {
              // const shop_cateogry_name1 = computed(() => {
              //   const category = CustomerCategoryMAP.get(props.project?.category ?? -1);
              //   return category ? category : '--';
              // });
              // new_shop_cateogry_name.value = shop_cateogry_name1.value;
              // new_brand_name.value = props.project.brand_name ? props.project.brand_name : '--';
            }

            ProjectForm.value.id = props.project.id;
            ProjectForm.value.project_name = props.project.project_name;
            ProjectForm.value.company_name = props.project.company_name;
            // ProjectForm.value.shop_name = props.project.shop_name;
            ProjectForm.value.company_id = props.project.company_id;
            // ProjectForm.value.company_shop_id = props.project.customer_id;
            ProjectForm.value.business_type = props.project.business_type;
            ProjectForm.value.cooperation_type = props.project.cooperation_type;
            ProjectForm.value.studio_id = props.project.studio_id;
            ProjectForm.value.start_date = props.project.start_date;
            ProjectForm.value.end_date = props.project.end_date;
            ProjectForm.value.commission_rate = props.project.commission_rate;
            ProjectForm.value.customer_manager_id = props.project.customer_manager_id;
            ProjectForm.value.live_num_per_month = props.project.live_num_per_month;
            ProjectForm.value.duration_per_live = props.project.duration_per_live;
            ProjectForm.value.month_duration = props.project.month_duration;
            ProjectForm.value.other_requirement = props.project.other_requirement;
            ProjectForm.value.remark = props.project.remark;
            ProjectForm.value.settlement_cycle_type = props.project.settlement_cycle_type;
            ProjectForm.value.price_per_hour = props.project.price_per_hour;
            ProjectForm.value.service_amount = props.project.service_amount;
            ProjectForm.value.project_manager_id = props.project.project_manager_id;
            ProjectForm.value.feishu_department_id = props.project.feishu_department_id;
            ProjectForm.value.feishu_department_name = props.project.feishu_department_name;
            ProjectForm.value.feishu_department_level = props.project.feishu_department_level;
            ProjectForm.value.brand_id = props.project.brand_id;
            ProjectForm.value.company_subject = props.project.company_subject;
            ProjectForm.value.gmv_way = props.project.is_all_shop_orders
              ? 3
              : props.project.live_account_ids &&
                (props.project.live_account_ids.split(',') || []).find(item => String(item) === '0')
              ? 2
              : 1;
            const defaultBrandList = props.project.brand_id
              ? [
                  {
                    id: props.project.brand_id,
                    brand_name: props.project.brand_name || '',
                  } as Brand,
                ]
              : [];
            brandList.value = defaultBrandList;
            // if (props.project.brand_id) {
            //   brandList.value = [
            //     {
            //       id: props.project.brand_id,
            //       brand_name: props.project.brand_name || '',
            //     } as Brand,
            //   ];
            // }
            if (props.project?.company_name && props.project?.company_id) {
              await getAllCompanyName(props.project.company_name);
              // onCompanyChange(props.project?.company_id as number);
              const finder = allCompanyName.value.find(el => el.id === props.project?.company_id);
              brandList.value = [...defaultBrandList, ...(finder?.brands || [])].filter(
                (el, idx, self) => self.findIndex(subEL => subEL.id === el.id) === idx,
              );
            }

            if (props.project.live_account_ids) {
              ProjectForm.value.live_account_ids = props.project.live_account_ids
                .toString()
                .replace(/,,/g, '')
                .split(',')
                .filter(item => String(item) !== '0');

              const account_arr: any = [];
              ProjectForm.value.live_account_ids.forEach((id, _) => {
                account_arr.push({ account: id });
              });
              taobaoLiveBindAccounts.value = account_arr;
            }
            reloadFormItems(props.project);
            if (props.project?.customer_manager) {
              getAllCustomerName(props.project?.customer_manager || '');
            }
            if (props.project?.project_manager) {
              getAllManagerName(props.project?.project_manager || '');
            }
          } else {
            nextTick(() => {
              autoFocuseRef.value?.focus();
            });
          }
        }
      },
    );

    /** 重置表单 */
    const resetForm = () => {
      taobaoLiveBindAccounts.value = [
        {
          account: '',
        },
      ];
      ProjectForm.value.id = -1;
      ProjectForm.value.company_id = '';
      // ProjectForm.value.company_shop_id = '';
      ProjectForm.value.business_type = -1;
      ProjectForm.value.cooperation_type = -1;
      ProjectForm.value.studio_id = '';
      ProjectForm.value.start_date = '';
      ProjectForm.value.end_date = '';
      ProjectForm.value.commission_rate = '';
      ProjectForm.value.customer_manager_id = '';
      ProjectForm.value.live_num_per_month = '';
      ProjectForm.value.duration_per_live = '';
      ProjectForm.value.month_duration = '';
      ProjectForm.value.other_requirement = '';
      ProjectForm.value.remark = '';
      ProjectForm.value.settlement_cycle_type = -1;
      ProjectForm.value.price_per_hour = '';
      ProjectForm.value.project_manager_id = '';
      ProjectForm.value.feishu_department_id = undefined;
      ProjectForm.value.feishu_department_name = undefined;
      ProjectForm.value.feishu_department_level = 0;
      ProjectForm.value.brand_id = undefined;
      ProjectForm.value.gmv_way = 1;
      ProjectForm.value.company_subject = undefined;
      allStoreName.value = [];
      allCompanyName.value = [];
      allCustomerName.value = [];
      allManagerName.value = [];
      live_department_tree.value?.setCheckedKeys([]);
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
      const live_account_ids: string[] =
        isFromLocalLife.value || ProjectForm.value.gmv_way === 3
          ? []
          : ProjectForm.value.live_account_ids || [];
      if (ProjectForm.value.gmv_way === 2) {
        live_account_ids.push('0');
      }
      const payload: LiveProjectForm = {
        project_name: ProjectForm.value.project_name,
        company_id: ProjectForm.value.company_id,
        // company_shop_id: ProjectForm.value.company_shop_id,
        business_type: ProjectForm.value.business_type,
        cooperation_type: ProjectForm.value.cooperation_type,
        studio_id: ProjectForm.value.studio_id,
        start_date: ProjectForm.value.start_date,
        end_date: ProjectForm.value.end_date,
        commission_rate: ProjectForm.value.commission_rate,
        customer_manager_id: ProjectForm.value.customer_manager_id,
        live_num_per_month: ProjectForm.value.live_num_per_month,
        duration_per_live: ProjectForm.value.duration_per_live,
        month_duration: ProjectForm.value.month_duration,
        other_requirement: ProjectForm.value.other_requirement,
        remark: ProjectForm.value.remark,
        settlement_cycle_type: ProjectForm.value.settlement_cycle_type,
        price_per_hour: ProjectForm.value.price_per_hour || undefined,
        service_amount: ProjectForm.value.service_amount
          ? Number(ProjectForm.value.service_amount)
          : undefined,
        project_manager_id: ProjectForm.value.project_manager_id,
        is_all_shop_orders: isFromLocalLife.value ? undefined : ProjectForm.value.gmv_way === 3,
        live_account_ids: isFromLocalLife.value ? [] : live_account_ids,
        feishu_department_id: ProjectForm.value.feishu_department_id,
        // 不用传此参数
        feishu_department_name: undefined,
        feishu_department_level: ProjectForm.value.feishu_department_level,
        brand_id: ProjectForm.value.brand_id,
        company_subject: ProjectForm.value.company_subject,
      };
      if (ProjectForm.value.id !== -1) {
        payload.id = ProjectForm.value.id;
      }

      /** 开始时间晚与结束时间 */
      if (ProjectForm.value.start_date >= ProjectForm.value.end_date) {
        ctx.root.$message.error('结束时间需要晚于开始时间');
        return;
      }

      if (!isFromLocalLife.value && !REG_COMMISSION_RATE.test(ProjectForm.value.commission_rate)) {
        ctx.root.$message.error('佣金比例只能在1-100的范围');
        return;
      }

      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveLiveProject(payload, business_type.value),
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

    const getFeishuDepartmentList = async () => {
      const res = await GetFeishuDepartmentList();
      const list = res.data.data.data;
      departmentFilterDisabled(list, true, 3);
      feishuDepartmentList.value = list;
    };

    getFeishuDepartmentList();

    const handleCheckChange = (data: FeiShuDepartment) => {
      live_department_tree.value?.setCheckedKeys([]);
      if (data.level === 1) return;
      if (data.id === ProjectForm.value.feishu_department_id) {
        ProjectForm.value.feishu_department_id = undefined;
        ProjectForm.value.feishu_department_name = undefined;
      } else {
        ProjectForm.value.feishu_department_id = data.id;
        ProjectForm.value.feishu_department_name = data.name;
        live_department_tree.value?.setCheckedKeys([data.id]);
      }
      ProjectForm.value.feishu_department_level = data.level;
    };
    const is_douyin_self = computed(() => {
      return (
        // ProjectForm.value.cooperation_type === 1 &&
        ProjectForm.value.business_type === 3 || ProjectForm.value.business_type === 7
      );
    });

    // const brandServe = useRequest(GetBrandList);
    const brandList = ref<Brand[]>([]);
    const onCompanyChange = (val: number) => {
      ProjectForm.value.brand_id = undefined;
      const finder = allCompanyName.value.find(el => el.id === val);
      brandList.value = finder?.brands || [];
    };
    const AddAccountFormItemHandler = () => {
      taobaoLiveBindAccounts.value.push({ account: '' });
      const form: any = ctx.refs.formRef;
      if (form && form.$el && taobaoLiveBindAccounts.value.length % 2 === 1) {
        form.$el.scrollTop = form.$el.scrollTop + 40;
      }
    };
    const DeleteAccountFormItemHandler = (index: number) => {
      taobaoLiveBindAccounts.value.splice(index, 1);
    };
    return {
      ProprietorTypeOption: E.project.ProprietorTypeOption,
      isFromLocalLife,
      DeleteAccountFormItemHandler,
      AddAccountFormItemHandler,
      is_douyin_self,
      autoFocuseRef,
      disabledProjectManagerId,
      disabledManagerId,
      getPositiveInteger,
      taobaoLiveBindAccounts,
      BusinessTypeEnum,
      BusinessTypeOptions,
      formTitle,
      getPricePerHour,
      getPriceServerAmount,
      inputPositiveInteger,
      saveLoading,
      CooperationTypeEnum,
      allCustomerName,
      getAllCustomerName,
      allManagerName,
      getAllManagerName,
      formRef,
      // brand_name,
      // shop_cateogry_name,
      // new_shop_cateogry_name,
      // new_brand_name,
      allStudioName,
      getAllStudioName,
      onStudioIdChange,
      // getAllStoreName,
      getAllCompanyName,
      allStoreName,
      allCompanyName,
      // onCompanyIdChange,
      // onShopIdChange,
      onBusinessTypeChange,
      formRules,
      onCancelBtnClick,
      onSaveBtnClick,
      ProjectForm,
      feishuDepartmentList,
      treeProps,
      handleCheckChange,
      live_department_tree,
      default_checked_department_ids,
      onCompanyChange,
      brandList,
      // brandServe,
    };
  },
});
