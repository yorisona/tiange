/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-10-09 16:16:53
 */

import { UpdateShopLiveTeamMembers } from '@/services/live';
import { ProjectTeamMemberParams, ProjectTeamMemberProps } from '@/types/tiange/live';
// import { UserInfo } from '@/types/tiange/system';
import { SimpleRole } from '@/types/tiange/system/role';
import { deepClone } from '@/utils/tools';
import { defineComponent, ref, PropType, computed, watch } from '@vue/composition-api';
import { GetUser } from '@/services/system';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const initForm = () => {
  return {
    project_manager_id: undefined,
    customer_manager_id: undefined,
    project_manager_name: undefined,
    customer_manager_name: undefined,
    team_members: [],
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
    const customerManagers = ref<SimpleRole[]>([]);
    const projectManagers = ref<SimpleRole[]>([]);
    const otherMembers = ref<{ id: number; username: string }[]>([]);
    const { business_type } = useProjectBaseInfo();
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
          customer_manager_id: form.value.customer_manager_id,
          team_members: form.value.team_members ?? [],
        };

        saveLoading.value = true;
        const res = await UpdateShopLiveTeamMembers(
          props.projectId ?? '',
          params,
          business_type.value,
        );
        saveLoading.value = false;
        if (res.data.success) {
          ctx.emit('save');
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败，请稍候重试');
        }
        // ctx.emit('save');
      },
      /**
       * request
       */
      getAllProjectManagerRequest: async (val = '') => {
        /* const res = await GetProjectManagerList();
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
      getAllCustomManagerRequest: async (val = '') => {
        /*const res = await GetCustomerManagerList();
        if (res.data.success) {
          customerManagers.value = res.data.data;
        }*/
        const { data: response } = await GetUser({
          search_type: 2,
          search_value: val,
          is_checked: 1,
        });
        customerManagers.value = response.success ? response.data.data : [];
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
        // form.value.customer_manager_id = newMember?.customer_manager_id
        const mem = newMember as ProjectTeamMemberProps;
        form.value = {
          project_manager_id: mem.project_manager_id,
          customer_manager_id: mem.customer_manager_id,
          project_manager_name: mem.project_manager_name,
          customer_manager_name: mem.customer_manager_name,
          team_members: mem.team_members.map(el => el.id),
        };
        if (mem.customer_manager_name) {
          methods.getAllCustomManagerRequest(mem.customer_manager_name);
        }
        if (mem.project_manager_name) {
          methods.getAllProjectManagerRequest(mem.project_manager_name);
        }
        selectMembers.value = deepClone(mem.team_members) as any;
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
      customerManagers,
      projectManagers,
      otherMembers,
      ...methods,
    };
  },
});
