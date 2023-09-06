import { computed, defineComponent, nextTick, ref, set, watch } from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';
import type { ElForm } from 'element-ui/types/form';
import {
  CommonBusinessProjectForm,
  ProjectTypeEnum,
  ProjectTypeEnumMap,
} from '@/types/tiange/commonBusiness/project';
import { sleep } from '@/utils/func';
import { SaveCommonBusinessProject } from '@/services/commonBusiness/project';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import type { FormRule } from '@/types/vendor/form';
import lodash from '@/utils/lodash/custom';
import { ElInput } from 'element-ui/types/input';
import { GetFeishuDepartmentList, QueryUserNames } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { ElTree } from 'element-ui/types/tree';
import { deepClone } from '@/utils/tools';
import { GetKOLList } from '@/services/kol';
import { departmentFilterDisabled } from '@/utils/filter';
import { GetUser } from '@/services/system';

const { debounce } = lodash;

const useForm = (props: { visible: boolean; title: string }) => {
  const formRef = ref<ElForm | null>(null);

  const ProjectForm = ref<any>({
    id: -1,
    project_name: '',
    platform_type: '',
    mcn_project_type: '',
    project_manager_id: '',
    team_members: [],
    feishu_department_id: undefined,
    feishu_department_name: undefined,
    kol_id: undefined,
    kol_name: undefined,
    baiying_id: undefined,
    qianchuan_uid: undefined,
    end_date: undefined,
    start_date: undefined,
    feishu_department_level: undefined,
    kol_infos: [],
    is_relate_kol: true,
    company_subject: undefined,
  });
  const formRules = ref<{
    [prop in keyof CommonBusinessProjectForm]?: FormRule<CommonBusinessProjectForm[prop]>[];
  }>({
    start_date: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
    end_date: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
    project_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    platform_type: [
      { required: true, message: '请选择业务平台', trigger: 'change' },
      {
        validator: (rule, value, callback) => {
          if (value === -1) {
            callback(new Error('请选择业务平台'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    mcn_project_type: [
      { required: true, message: '请选择业务类型', trigger: 'change' },
      {
        validator: (rule, value, callback) => {
          if (value === -1) {
            callback(new Error('请选择业务类型'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    kol_id: [{ required: true, message: '请选择项目关联达人', trigger: 'change' }],
    baiying_id: [{ required: true, message: '请输入达人百应ID', trigger: 'blur' }],
    qianchuan_uid: [{ required: true, message: '请输入达人百应ID', trigger: 'blur' }],
    project_manager_id: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
    feishu_department_id: [{ required: true, message: '请选择项目所属部门', trigger: 'change' }],
    kol_infos: [
      {
        validator: (rule, value, callback) => {
          console.log('kol_infos', value);
          if (value.length === 0) {
            callback(new Error('请添加项目关联达人'));
          } else {
            callback();
          }
        },
      },
    ],
    company_subject: [
      {
        required: true,
        message: '请选择归属主体',
        trigger: 'change',
      },
    ],
  });

  /** 重置表单 */
  const resetProjectForm = (callback: () => void) => {
    ProjectForm.value.id = -1;
    ProjectForm.value.project_name = '';
    ProjectForm.value.mcn_project_type = '';
    ProjectForm.value.platform_type = '';
    ProjectForm.value.project_manager_id = '';
    ProjectForm.value.team_members = [];
    ProjectForm.value.feishu_department_id = undefined;
    ProjectForm.value.feishu_department_name = undefined;
    ProjectForm.value.kol_id = undefined;
    ProjectForm.value.kol_name = undefined;
    ProjectForm.value.baiying_id = undefined;
    ProjectForm.value.qianchuan_uid = undefined;
    ProjectForm.value.start_date = undefined;
    ProjectForm.value.end_date = undefined;
    ProjectForm.value.feishu_department_level = undefined;
    ProjectForm.value.kol_infos = [];
    ProjectForm.value.is_relate_kol = true;
    ProjectForm.value.company_subject = undefined;
    callback();
  };

  return {
    formRef,
    formRules,
    ProjectForm,
    resetProjectForm,
  };
};

export default defineComponent({
  name: 'TgCommonBusinessProjectDialog',
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
      type: Object as PropType<CommonBusinessProjectDetail>,
      required: false,
    },
    isEditForm: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const Kols: any = ref([]);
    const kolLoading = ref(false);
    const autoFocuseRef = ref<ElInput | undefined>(undefined);
    const { formRef, formRules, ProjectForm, resetProjectForm } = useForm(props);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const cb_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);

    const default_checked_department_ids = computed(() => {
      return ProjectForm.value.feishu_department_id ? [ProjectForm.value.feishu_department_id] : [];
    });

    const treeProps = {
      label: 'name',
      children: 'sons',
    };

    const onCloseBtnClick = () => {
      resetProjectForm(() => {
        cb_department_tree.value?.setCheckedKeys([]);
      });

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

      const payload: any = {
        business_type: 5,
        project_name: ProjectForm.value.project_name,
        platform_type: ProjectForm.value.platform_type,
        start_date: ProjectForm.value.start_date,
        end_date: ProjectForm.value.end_date,
        mcn_project_type: ProjectForm.value.mcn_project_type,
        project_manager_id: ProjectForm.value.project_manager_id,
        team_members: ProjectForm.value.team_members,
        feishu_department_id: ProjectForm.value.feishu_department_id,
        kol_id: ProjectForm.value.platform_type === 1 ? ProjectForm.value.kol_id : undefined,
        baiying_id:
          ProjectForm.value.platform_type === 1 ? ProjectForm.value.baiying_id : undefined,
        qianchuan_uid:
          ProjectForm.value.platform_type === 1 ? ProjectForm.value.qianchuan_uid : undefined,
        feishu_department_level: ProjectForm.value.feishu_department_level,
        kol_infos:
          ProjectForm.value.platform_type === 1 && ProjectForm.value.is_relate_kol
            ? ProjectForm.value.kol_infos
            : undefined,
        is_relate_kol: ProjectForm.value.is_relate_kol,
        company_subject: ProjectForm.value.company_subject,
      };
      if (ProjectForm.value.id !== -1) {
        payload.id = ProjectForm.value.id;
      }
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveCommonBusinessProject(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);
      } else {
        ctx.root.$message.error(response.message ?? '项目保存失败');
      }
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    /** 是否不再是客户经理ID */
    const disabledManagerId = ref(-1);
    const openPlatform_type = () => {
      if (ProjectForm.value.is_relate_kol && ProjectForm.value.kol_infos?.length === 0) {
        addKol();
      }
    };

    watch(
      () => props.visible,
      newVal => {
        if (newVal) {
          resetProjectForm(() => cb_department_tree.value?.setCheckedKeys([]));
          formRef.value?.resetFields();
          /** 编辑项目 数据填充 */
          if (props.project !== undefined) {
            ProjectForm.value.id = props.project.id;
            ProjectForm.value.project_name = props.project.project_name;
            ProjectForm.value.mcn_project_type = props.project.mcn_project_type;
            ProjectForm.value.platform_type = props.project.platform_type;
            ProjectForm.value.project_manager_id = props.project.project_manager_id;
            ProjectForm.value.team_members = props.project.team_members.map(el => el.id);
            ProjectForm.value.feishu_department_id = props.project.feishu_department_id;
            ProjectForm.value.feishu_department_name = props.project.feishu_department_name;
            ProjectForm.value.kol_id = props.project.kol_id || undefined;
            ProjectForm.value.kol_name = props.project.kol_name || undefined;
            ProjectForm.value.baiying_id = props.project.baiying_id || undefined;
            ProjectForm.value.qianchuan_uid = props.project.qianchuan_uid || undefined;
            ProjectForm.value.start_date = props.project.start_date || undefined;
            ProjectForm.value.end_date = props.project.end_date || undefined;
            ProjectForm.value.feishu_department_level = props.project.feishu_department_level;
            ProjectForm.value.kol_infos = props.project.kol_infos;
            ProjectForm.value.company_subject = props.project.company_subject;
            ProjectForm.value.is_relate_kol = props.project.kol_infos?.length > 0 ? true : false;
            if (props.project.project_manager) {
              getAllManagerName(props.project.project_manager);
            }
            if (ProjectForm.value.kol_infos.length) {
              ProjectForm.value.kol_infos.forEach((item: any, index: number) => {
                if (item.kol_name) {
                  getAllKolsRequest(item.kol_name, index);
                }
              });
            }
            selectMembers.value = deepClone(props.project.team_members) as any;
          } else {
            nextTick(() => {
              autoFocuseRef.value?.focus();
            });
          }
        }
      },
    );
    watch(
      () => ProjectForm.value.platform_type,
      newVal => {
        if (
          newVal === 1 &&
          ProjectForm.value.is_relate_kol &&
          ProjectForm.value.kol_infos?.length === 0
        ) {
          addKol();
        }
      },
    );

    const addKol = () => {
      ProjectForm.value.kol_infos.push({
        kol_id: undefined,
        kol_name: undefined,
        baiying_id: undefined,
        qianchuan_uid: undefined,
      });
      const formDom = document.getElementById('ProjectForm');
      nextTick(() => {
        formDom!.scrollTop = formDom!.scrollHeight;
      });
    };
    const deleteKol = (index: number) => {
      ProjectForm.value.kol_infos.splice(index, 1);
      console.log(ProjectForm.value.kol_infos, 'ProjectForm.value.kol_infos');
    };

    const getKols = (value: number, label: string) => {
      return [
        {
          kol_info: {
            kol_id: value,
            kol_name: label,
          },
          kol_douyin_info: {
            baiying_id: ProjectForm.value.baiying_id || '',
            qianchuan_uid: ProjectForm.value.qianchuan_uid || '',
          },
        },
      ];
    };

    const getFeishuDepartmentList = async () => {
      const res = await GetFeishuDepartmentList();
      const list = res.data.data.data;
      departmentFilterDisabled(list, true, 3);
      feishuDepartmentList.value = list;
    };

    const handleCheckChange = (data: FeiShuDepartment) => {
      cb_department_tree.value?.setCheckedKeys([]);
      if (data.id === ProjectForm.value.feishu_department_id) {
        ProjectForm.value.feishu_department_id = undefined;
        ProjectForm.value.feishu_department_name = undefined;
      } else {
        ProjectForm.value.feishu_department_id = data.id;
        ProjectForm.value.feishu_department_name = data.name;
        cb_department_tree.value?.setCheckedKeys([data.id]);
      }
      ProjectForm.value.feishu_department_level = data.level;
    };

    getFeishuDepartmentList();

    /** 项目经理 */
    /** 是否不再是项目经理ID */
    const disabledProjectManagerId = ref(-1);

    const allManagerName = ref<{ id: number; username: string }[]>([]);
    const getAllManagerName = async (val: string) => {
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

    const otherMemberLoading = ref<boolean>(false);
    const otherMembers = ref<{ id: number; username: string }[]>([]);
    const selectMembers = ref<{ id: number; name: string }[]>([]);
    const selectNames = computed(() => {
      return ProjectForm.value.team_members.map((id: number) => {
        const findEl = selectMembers.value.find(el => el.id === id);
        return findEl?.name ?? '';
      });
    });
    const getAllOtherMembersRequest = async (keyword: string) => {
      if (keyword === '' || keyword === undefined) {
        otherMembers.value = [];
        return;
      }
      otherMemberLoading.value = true;
      const res = await QueryUserNames(keyword);
      otherMemberLoading.value = false;
      if (res.data.success) {
        otherMembers.value = res.data.data.user_data;
      } else {
        otherMembers.value = [];
      }
    };
    const onOtherMembersChanged = (members: string[]) => {
      const ids: number[] = [];
      //  先把已经搜索过的内容保存起来
      otherMembers.value.forEach(el => {
        const findEl = selectMembers.value.find(seEl => el.id === seEl.id);
        if (!findEl) {
          selectMembers.value.push({
            id: el.id,
            name: el.username,
          });
        }
      });
      members.forEach(name => {
        const findMember = selectMembers.value.find(seEl => seEl.name === name);
        if (findMember) {
          ids.push(findMember.id);
        }
      });
      ProjectForm.value.team_members = ids;
    };
    const changeBusinessPlatform = () => {
      ProjectForm.value.mcn_project_type = '';
    };

    const projectTypeOptions = computed(() => {
      const options: { label: string | undefined; value: ProjectTypeEnum }[] = [];
      if (ProjectForm.value.platform_type === 1) {
        options.push({
          label: ProjectTypeEnumMap.get(ProjectTypeEnum.clothing),
          value: ProjectTypeEnum.clothing,
        });
        options.push({
          label: ProjectTypeEnumMap.get(ProjectTypeEnum.label),
          value: ProjectTypeEnum.label,
        });
        options.push({
          label: ProjectTypeEnumMap.get(ProjectTypeEnum.makeups),
          value: ProjectTypeEnum.makeups,
        });
        options.push({
          label: ProjectTypeEnumMap.get(ProjectTypeEnum.head),
          value: ProjectTypeEnum.head,
        });
      } else if (ProjectForm.value.platform_type === 2) {
        options.push({
          label: ProjectTypeEnumMap.get(ProjectTypeEnum.taobao_cps),
          value: ProjectTypeEnum.taobao_cps,
        });
        options.push({
          label: ProjectTypeEnumMap.get(ProjectTypeEnum.v_task),
          value: ProjectTypeEnum.v_task,
        });
      }
      return options;
    });
    const getAllKolsRequest = async (val: any, index: number) => {
      console.log(index, val, 'val');
      kolLoading.value = true;
      const params: any = { kol_name: val, platform: 'douyin', verify_status: 1 };
      const [_, { data: response }] = await Promise.all([
        await sleep(500),
        await GetKOLList(params),
      ]);
      kolLoading.value = false;
      if (response.success) {
        // Kols.value = response.data.data;
        // console.log(response.data.data, 'response.data.data');
        set(ProjectForm.value.kol_infos[index], 'kols', response.data.data);
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const kolChange = (val: any, index: number) => {
      const baiying_id = ProjectForm.value.kol_infos[index].kols.find(
        (el: any) => el.kol_info.kol_id === val,
      )?.kol_douyin_info?.baiying_id;
      // console.log(val, baiying_id, 'val');
      set(ProjectForm.value.kol_infos[index], 'baiying_id', baiying_id ?? undefined);
    };
    return {
      ProprietorTypeOption: E.project.ProprietorTypeOption,
      kolChange,
      Kols,
      kolLoading,
      getAllKolsRequest,
      autoFocuseRef,
      disabledManagerId,
      saveLoading,
      formRef,
      formRules,
      ProjectForm,
      onCloseBtnClick,
      onSaveBtnClick,
      feishuDepartmentList,
      treeProps,
      handleCheckChange,
      cb_department_tree,
      default_checked_department_ids,
      allManagerName,
      getAllManagerName,
      disabledProjectManagerId,
      selectNames,
      otherMemberLoading,
      otherMembers,
      getAllOtherMembersRequest,
      onOtherMembersChanged,
      changeBusinessPlatform,
      projectTypeOptions,
      addKol,
      deleteKol,
      getKols,
      openPlatform_type,
    };
  },
});
