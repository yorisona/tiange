import { defineComponent, ref, PropType, computed, watch } from '@vue/composition-api';
import { UpdateShopMcnTeamMembers } from '@/services/commonBusiness/project';
import { ProjectTeamMemberParams, ProjectTeamMemberProps } from '@/types/tiange/live';
import { SimpleRole } from '@/types/tiange/system/role';
import { deepClone } from '@/utils/tools';
import { GetUser } from '@/services/system';

const initForm = () => {
  return {
    project_manager_id: undefined,
    team_members: [],
    project_manager_name: undefined,
  } as ProjectTeamMemberParams;
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: String,
    },
    member: {
      type: Object as PropType<ProjectTeamMemberProps>,
    },
    creator: {
      type: String,
    },
  },
  setup(props, ctx) {
    const otherMemberLoading = ref<boolean>(false);
    const saveLoading = ref<boolean>(false);
    const computedCreator = computed(() => (props.creator ? props.creator : '--'));

    const form = ref<ProjectTeamMemberParams>(initForm());
    const projectManagers = ref<SimpleRole[]>([]);
    const otherMembers = ref<{ id: number; username: string }[]>([]);

    const selectMembers = ref<{ id: number; name: string }[]>([]);
    const selectNames = computed(() => {
      return form.value.team_members.map(id => {
        const findEl = selectMembers.value.find(el => el.id === id);
        return findEl?.name ?? '';
      });
    });

    const methods = {
      onClose: () => {
        ctx.emit('close');
        ctx.emit('update:visible', false);
      },
      onSave: async () => {
        const params: ProjectTeamMemberParams = {
          project_manager_id: form.value.project_manager_id,
          team_members: form.value.team_members ?? [],
        };
        saveLoading.value = true;
        const res = await UpdateShopMcnTeamMembers(props.projectId ?? '', params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.emit('save');
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败，请稍候重试');
        }
      },
      /**
       * request
       */
      getAllProjectManagerRequest: async (val = '') => {
        /*const res = await GetProjectManagerList();
        if (res.data.success) {
          projectManagers.value = res.data.data;
        }*/
        const { data: response } = await GetUser({
          search_type: 2,
          search_value: val,
          is_checked: 1,
        });
        projectManagers.value = response.success ? response.data.data : [];
      },
      getAllOtherMembersRequest: async (keyword: string) => {
        if (keyword === '' || keyword === undefined) {
          otherMembers.value = [];
          return;
        }

        otherMemberLoading.value = true;
        /*const res = await QueryUserNames(keyword);
        otherMemberLoading.value = false;
        if (res.data.success) {
          otherMembers.value = res.data.data.user_data;
        } else {
          otherMembers.value = [];
        }*/
        const { data: response } = await GetUser({
          /*roles: '1008',
              business_type: BusinessTypeEnum.marketing,*/
          search_type: 2,
          search_value: keyword,
          is_checked: 1,
        });
        otherMemberLoading.value = false;
        otherMembers.value = response.success ? response.data.data : [];
      },
      onOtherMembersChanged: (members: string[]) => {
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
        form.value.team_members = ids;
      },
    };
    watch([() => props.visible, () => props.member], ([newVisible, newMember]) => {
      if (newMember && newVisible) {
        const mem = newMember as ProjectTeamMemberProps;
        form.value = {
          project_manager_id: mem.project_manager_id,
          project_manager_name: mem.project_manager_name,
          team_members: mem.team_members.map(el => el.id),
        };
        selectMembers.value = deepClone(mem.team_members) as any;
        if (form.value.project_manager_name) {
          methods.getAllProjectManagerRequest(form.value.project_manager_name);
        }
      } else {
        otherMembers.value = [];
      }
    });
    return {
      selectNames,
      computedCreator,
      otherMemberLoading,
      form,
      saveLoading,
      projectManagers,
      otherMembers,
      ...methods,
    };
  },
});
