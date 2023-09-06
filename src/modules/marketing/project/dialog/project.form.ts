import lodash from '@/utils/lodash/custom';
import {
  MarketingProjectDetail,
  MarketingProjectForm,
  MarketingProjectFormAddCustomer,
} from '@/types/tiange/marketing/project';
import { computed, defineComponent, nextTick, PropType, ref, watch } from '@vue/composition-api';
import { sleep } from '@/utils/func';
import { SaveMarketingProject } from '@/services/marketing.project';
import { GetMarketingCompanyList } from '@/services/company';
import { ElForm } from 'element-ui/types/form';

import { CustomerCategoryMAP } from '@/types/tiange/common';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import moment from 'moment';
import { getPositiveNumber } from '@/utils/string';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { ValidateCallback } from '@/types/vendor/form';
import { ElInput } from 'element-ui/types/input';
import { GetFeishuDepartmentList } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { ElTree } from 'element-ui/types/tree';
import { departmentFilterDisabled } from '@/utils/filter';
// import { departmentFilterDisabled } from '@/utils/filter';
import { GetUser } from '@/services/system';
// import { useRequest } from '@gm/hooks/ahooks';
// import { GetBrandList } from '@/services/customers';
import { Brand } from '@/types/tiange/brand';
const { debounce } = lodash;

const useForm = (props: { visible: boolean; title: string }) => {
  const formRef = ref<ElForm | null>(null);

  /** 客户经理搜索 */
  const CustomerManagerList = ref<{ id: number; username: string }[]>([]);
  /** 所有店铺选项 */
  const allCompanyName = ref<any[]>([]);

  /** 所有店铺选项 */
  const allStoreName = ref<any[]>([]);

  const ProjectForm = ref<MarketingProjectForm>({
    cooperation_name: '',
    company_id: '',
    // company_shop_id: '',
    company_name: '',
    // shop_name: '',
    customer_id: '',
    manager_id: '',
    cooperation_type: [],
    sale_amount: '',
    uv: '',
    pv: '',
    gmv: '',
    budget: '',
    note: '',
    remark: '',
    is_gather: 1,
    gather_date: '',
    plan: [],
    feishu_department_id: undefined,
    feishu_department_name: undefined,
    brand_id: undefined,
    company_subject: undefined,
  });

  const formRules = ref({
    cooperation_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    company_id: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
    // company_shop_id: [{ required: true, message: '请选择店铺', trigger: 'change' }],
    sale_amount: [
      { required: true, message: '请输入销售金额', trigger: 'blur' },
      {
        validator: (_: any, value: number, callback: ValidateCallback) => {
          if (value <= 0) {
            callback(new Error('请输入正数'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
    cooperation_type: [{ required: true, message: '请选择合作类型', trigger: 'change' }],
    is_gather: [{ required: true, message: '请选择是否回款', trigger: 'blur' }],
    gather_date: [{ required: true, message: '请选择回款日期', trigger: 'blur' }],
    manager_id: [{ required: true, message: '请输入客户经理', trigger: 'change' }],
    customer_id: [{ required: true, message: '请输入客户名称', trigger: 'change' }],
    feishu_department_id: [{ required: true, message: '请选择项目所属部门', trigger: 'change' }],
    company_subject: [
      {
        required: true,
        message: '请选择归属主体',
        trigger: 'change',
      },
    ],
  });

  watch(
    () => props.visible,
    newVal => {
      if (newVal) {
        resetProjectForm();
        formRef.value?.resetFields();
      }
    },
  );

  const uploadedFileList = ref<
    { icon: string; type: string; size?: number; name: string; path: string }[]
  >([]);

  /** 重置表单 */
  const resetProjectForm = () => {
    ProjectForm.value.company_id = '';
    ProjectForm.value.cooperation_name = '';
    ProjectForm.value.customer_id = '';
    // ProjectForm.value.company_shop_id = '';
    ProjectForm.value.manager_id = '';
    ProjectForm.value.plan = [];
    ProjectForm.value.cooperation_type = [];
    ProjectForm.value.sale_amount = '';
    ProjectForm.value.uv = '';
    ProjectForm.value.pv = '';
    ProjectForm.value.gmv = '';
    ProjectForm.value.budget = '';
    ProjectForm.value.note = '';
    ProjectForm.value.remark = '';
    ProjectForm.value.is_gather = 1;
    ProjectForm.value.gather_date = '';
    ProjectForm.value.brand_id = undefined;
    ProjectForm.value.company_subject = undefined;
    uploadedFileList.value = [];
    CustomerManagerList.value = [];
    allCompanyName.value = [];
    allStoreName.value = [];
    ProjectForm.value.feishu_department_id = undefined;
    ProjectForm.value.feishu_department_name = undefined;
  };

  /** 客户名称 下拉选择 */
  const getAllCompanyName = async (company_name: string) => {
    const { data: response } = await GetMarketingCompanyList({ company_name, verify_status: 1 });
    allCompanyName.value = response.success ? response.data.data : [];
  };

  const brandList = ref<Brand[]>([]);
  const onCompanyIdChange = (company_id: string) => {
    ProjectForm.value.brand_id = undefined;
    const finder = allCompanyName.value.find(el => el.id === company_id);
    brandList.value = finder?.brands || [];
    // ProjectForm.value.company_id = company_id;
    // ProjectForm.value.company_shop_id = '';
    // for (let index = 0; index < allCompanyName.value.length; index++) {
    //   if (allCompanyName.value[index].id === company_id) {
    //     allStoreName.value = allCompanyName.value[index].shops_info ?? [];
    //   }
    // }
  };

  // const onShopIdChange = (company_shop_id: string) => {
  // ProjectForm.value.company_shop_id = company_shop_id;
  // };

  return {
    CustomerManagerList,
    uploadedFileList,
    formRef,
    formRules,
    ProjectForm,
    resetProjectForm,
    getAllCompanyName,
    allCompanyName,
    onCompanyIdChange,
    allStoreName,
    brandList,
    // onShopIdChange,
  };
};

export default defineComponent({
  name: 'TgMarketingProjectDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '新增场次',
    },
    project: {
      type: Object as PropType<MarketingProjectDetail>,
      required: false,
    },
    isEditForm: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props, ctx) {
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
    // const new_brand_name = ref('');
    const new_shop_cateogry_name = ref('');
    const autoFocuseRef = ref<ElInput | undefined>(undefined);
    const saveLoading = ref(false);

    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);

    const maketing_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);

    const default_checked_department_ids = computed(() => {
      return ProjectForm.value.feishu_department_id ? [ProjectForm.value.feishu_department_id] : [];
    });

    const treeProps = {
      label: 'name',
      children: 'sons',
    };

    const {
      CustomerManagerList,
      uploadedFileList,
      formRef,
      formRules,
      ProjectForm,
      resetProjectForm,
      getAllCompanyName,
      onCompanyIdChange,
      allCompanyName,
      allStoreName,
      brandList,
      // onShopIdChange,
    } = useForm(props);

    const onCloseBtnClick = () => {
      resetProjectForm();

      ctx.emit('dialog:close');
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

      if (ProjectForm.value.uv && parseInt(ProjectForm.value.uv, 10) <= 0) {
        ctx.root.$message.error('UV必需为正整数');
        return;
      }

      if (ProjectForm.value.pv && parseInt(ProjectForm.value.pv, 10) <= 0) {
        ctx.root.$message.error('PV必需为正整数');
        return;
      }

      const payload: MarketingProjectForm = {
        cooperation_name: ProjectForm.value.cooperation_name,
        company_id: ProjectForm.value.company_id,
        // company_shop_id: ProjectForm.value.company_shop_id,
        company_name: '',
        customer_id: ProjectForm.value.customer_id,
        manager_id: ProjectForm.value.manager_id,
        cooperation_type: ProjectForm.value.cooperation_type,
        sale_amount: ProjectForm.value.sale_amount,
        uv: ProjectForm.value.uv,
        pv: ProjectForm.value.pv,
        gmv: ProjectForm.value.gmv,
        budget: ProjectForm.value.budget,
        note: ProjectForm.value.note,
        remark: ProjectForm.value.remark,
        is_gather: ProjectForm.value.is_gather,
        gather_date: ProjectForm.value.gather_date,
        plan: ProjectForm.value.plan,
        company_subject: ProjectForm.value.company_subject,
        feishu_department_id: ProjectForm.value.feishu_department_id,
        brand_id: ProjectForm.value.brand_id,
        //  此字段不需要传
        feishu_department_name: undefined,
      };
      if (ProjectForm.value.cooperation_id) {
        payload.cooperation_id = ProjectForm.value.cooperation_id;
      }

      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveMarketingProject(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;

      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);

        ctx.root.$store.dispatch('marketing/setProjectInfo', -1);
      } else {
        ctx.root.$message.error(response.message ?? '项目保存失败');
      }
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    /** 客户名称 */
    const CustomerList = ref<MarketingProjectFormAddCustomer[]>([]);
    // 搜索获取客户名称列表
    // async function getCustomerListRequest(query: string) {
    //   if (query === '') {
    //     CustomerList.value = [];
    //     return;
    //   }
    //   const { data: response } = await GetCustomerList(query);
    //   if (response.success) {
    //     CustomerList.value = response.data.data;
    //   }
    // }
    /** 选中的客户名称 */
    // const selectedCustomerItem = computed(() =>
    //   CustomerList.value.find(item => {
    //     return item.id.toString() === ProjectForm.value.customer_id.toString();
    //   }),
    // );

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
    // const shop_category_name = computed(() => {
    //   const category = CustomerCategoryMAP.get(selectedShopItem.value?.category ?? -1);
    //   return category ? category : '--';
    // });

    // const onSelectedCustomerChange = (customer_id: number) => {
    //   ProjectForm.value.customer_id = customer_id;
    // };

    /** 是否不再是客户经理ID */
    const disabledManagerId = ref(-1);

    const getAllCustomerManager = async (val: string) => {
      const { data: response } = await GetUser({
        /*roles: '1008',
        business_type: BusinessTypeEnum.marketing,*/
        search_type: 2,
        search_value: val,
        is_checked: 1,
      });
      CustomerManagerList.value = response.success ? response.data.data : [];
      const current_manager_id = props.project?.manager_id;
      if (current_manager_id) {
        if (
          !CustomerManagerList.value
            .map(el => el.id.toString())
            .includes(current_manager_id.toString())
        ) {
          disabledManagerId.value = current_manager_id;
          CustomerManagerList.value.push({
            id: current_manager_id,
            username: props.project?.manager_name ?? '--',
          });
        }
      }
    };

    /** 文件上传 */
    const uploadFileHandler = async (value: HttpRequestOptions) => {
      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      formData.append('type', 'plan');

      const res = await uploadFileService(formData);
      if (res.data.success) {
        const filename_suffix = filename.split('.')[filename.split('.').length - 1];
        const fileType = value.file.type !== '' ? value.file.type : filename_suffix;

        uploadedFileList.value.push({
          name: value.file.name,
          type: value.file.type,
          icon: fileTypeIconMap.get(fileType) ?? 'picture',
          size: value.file.size,
          path: res.data.data.source,
        });

        const urlList = uploadedFileList.value.map(item => item.path);
        ProjectForm.value.plan = urlList;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: res.data.message ?? '上传失败，稍后重试',
          showClose: true,
          duration: 3000,
        });
      }
    };

    /** 删除已上传的文件 */
    const handleRemoveFileClick = (index: number) => {
      uploadedFileList.value.splice(index, 1);
      const urlList = uploadedFileList.value.map(item => item.path);
      ProjectForm.value.plan = urlList;
    };
    watch(
      () => props.visible,
      async newVal => {
        if (newVal) {
          maketing_department_tree.value?.setCheckedKeys([]);
          formRef.value?.resetFields();
          // getAllCustomerManager('');

          /** 编辑项目 数据填充 */
          if (props.project !== undefined) {
            const shop_cateogry_name1 = computed(() => {
              const category = CustomerCategoryMAP.get(props.project?.category ?? -1);
              return category ? category : '--';
            });
            if (props.project.manager_name) {
              getAllCustomerManager(props.project.manager_name);
            }
            new_shop_cateogry_name.value = shop_cateogry_name1.value;
            // new_brand_name.value = props.project.brand_name ? props.project.brand_name : '--';
            ProjectForm.value.cooperation_id = props.project.cooperation_id;
            ProjectForm.value.company_name = props.project.company_name;
            ProjectForm.value.company_id = props.project.company_id;
            // ProjectForm.value.company_shop_id = props.project.customer_id;
            // ProjectForm.value.shop_name = props.project.shop_name;
            ProjectForm.value.cooperation_name = props.project.cooperation_name;
            ProjectForm.value.cooperation_type = props.project.cooperation_type;
            ProjectForm.value.is_gather = props.project.is_gather;
            ProjectForm.value.sale_amount = props.project.sale_amount?.toString();
            ProjectForm.value.feishu_department_id = props.project.feishu_department_id;
            ProjectForm.value.feishu_department_name = props.project.feishu_department_name;
            ProjectForm.value.brand_id = props.project.brand_id;
            ProjectForm.value.company_subject = props.project.company_subject;
            const defaultBrandList = props.project.brand_id
              ? [
                  {
                    id: props.project.brand_id,
                    brand_name: props.project.brand_name,
                  } as Brand,
                ]
              : [];
            brandList.value = defaultBrandList;
            // if (props.project.brand_id) {
            //   brandList.value = [
            //     {
            //       id: props.project.brand_id,
            //       brand_name: props.project.brand_name,
            //     } as Brand,
            //   ];
            // }
            if (props.project.company_name && props.project.company_id) {
              await getAllCompanyName(props.project.company_name);
              // onCompanyIdChange(props.project.company_id);
              const finder = allCompanyName.value.find(el => el.id === props.project?.company_id);
              brandList.value = [...defaultBrandList, ...(finder?.brands || [])].filter(
                (el, idx, self) => self.findIndex(subEL => subEL.id === el.id) === idx,
              );
            }
            if (ProjectForm.value.sale_amount === '0') {
              ProjectForm.value.sale_amount = '';
            }
            ProjectForm.value.budget = props.project.budget?.toString();
            if (ProjectForm.value.budget === '0') {
              ProjectForm.value.budget = '';
            }

            ProjectForm.value.uv = props.project.uv?.toString();
            if (ProjectForm.value.uv === '0') {
              ProjectForm.value.uv = '';
            }
            ProjectForm.value.pv = props.project.pv?.toString();
            if (ProjectForm.value.pv === '0') {
              ProjectForm.value.pv = '';
            }

            ProjectForm.value.gmv = props.project.gmv?.toString();
            if (ProjectForm.value.gmv === '0') {
              ProjectForm.value.gmv = '';
            }

            ProjectForm.value.note = props.project.note;
            ProjectForm.value.remark = props.project.remark;

            ProjectForm.value.manager_id = props.project.manager_id;

            ProjectForm.value.plan = props.project.plan;

            ProjectForm.value.plan?.map(filepath => {
              const filename = filepath.split('/')[filepath.split('/').length - 1];
              const filename_suffix = filename.split('.')[filename.split('.').length - 1];
              const fileType = filename_suffix;

              uploadedFileList.value.push({
                name: filename,
                type: fileType,
                icon: fileTypeIconMap.get(fileType) ?? 'picture',
                path: filepath,
              });
            });

            if (props.project.gather_date) {
              ProjectForm.value.gather_date = moment(props.project.gather_date * 1000).format(
                'YYYY-MM-DD',
              );
            } else {
              const date = new Date();
              const dateTs = date.setDate(date.getDate() + 45);
              ProjectForm.value.gather_date = moment(dateTs).format('YYYY-MM-DD');
            }

            // getCustomerListRequest(props.project.shop_name);
            // ProjectForm.value.customer_id = props.project.customer_id;
          } else {
            const date = new Date();
            const dateTs = date.setDate(date.getDate() + 45);
            ProjectForm.value.gather_date = moment(dateTs).format('YYYY-MM-DD');
            nextTick(() => {
              autoFocuseRef.value?.focus();
            });
          }
        }
      },
    );

    const inputPositiveNumber = (value: string, field: string) => {
      const result = getPositiveNumber(value);
      if (field === 'gmv') {
        ProjectForm.value.gmv = result;
      } else if (field === 'budget') {
        ProjectForm.value.budget = result;
      } else if (field === 'sale_amount') {
        ProjectForm.value.sale_amount = result;
      }
    };

    const getPositiveInteger = (value: string) => {
      return value.replace(/\D/g, '').replace(REG_REMOVE_PREFIX_ZERO, '');
    };

    /** 正整数值检查 */
    const inputPositiveInteger = (value: string, field: 'uv' | 'pv') => {
      const result = getPositiveInteger(value);
      if (field === 'uv') {
        ProjectForm.value.uv = result;
      } else if (field === 'pv') {
        ProjectForm.value.pv = result;
      }
    };

    const getFeishuDepartmentList = async () => {
      const res = await GetFeishuDepartmentList();
      const list = res.data.data.data;
      departmentFilterDisabled(list);
      feishuDepartmentList.value = res.data.data.data;
    };

    getFeishuDepartmentList();

    const handleCheckChange = (data: FeiShuDepartment) => {
      maketing_department_tree.value?.setCheckedKeys([]);
      if (data.id === ProjectForm.value.feishu_department_id) {
        ProjectForm.value.feishu_department_id = undefined;
        ProjectForm.value.feishu_department_name = undefined;
      } else {
        ProjectForm.value.feishu_department_id = data.id;
        ProjectForm.value.feishu_department_name = data.name;
        maketing_department_tree.value?.setCheckedKeys([data.id]);
      }
    };

    // const brandServe = useRequest(GetBrandList);

    return {
      ProprietorTypeOption: E.project.ProprietorTypeOption,
      autoFocuseRef,
      disabledManagerId,
      inputPositiveNumber,
      inputPositiveInteger,
      handleRemoveFileClick,
      uploadedFileList,
      uploadFileHandler,
      // brand_name,
      // shop_category_name,
      // onSelectedCustomerChange,
      // getCustomerListRequest,
      CustomerList,
      CustomerManagerList,
      getAllCustomerManager,
      saveLoading,
      formRef,
      formRules,
      ProjectForm,
      onCloseBtnClick,
      onSaveBtnClick,
      getAllCompanyName,
      onCompanyIdChange,
      allCompanyName,
      allStoreName,
      // onShopIdChange,
      // new_brand_name,
      new_shop_cateogry_name,
      feishuDepartmentList,
      maketing_department_tree,
      handleCheckChange,
      treeProps,
      brandList,
      default_checked_department_ids,
      // brandServe,
    };
  },
});
