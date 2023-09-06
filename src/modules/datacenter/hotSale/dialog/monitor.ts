import { computed, defineComponent, inject, reactive, ref, watch } from '@vue/composition-api';
import { GetMonitorConfig, UpdateMonitorConfig } from '@/services/datacenter';
import { ElForm } from 'element-ui/types/form';
import inputLimit from '@/utils/inputLimit';
import { IMonitorConfig } from '@/types/tiange/datacenter';
import { GetSystemUsersList } from '@/services/system/news';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const project_id = inject('project_id') as number;
    const formRef = ref<ElForm | null>(null);
    const form = reactive<IMonitorConfig>({
      project_id: project_id,
      hot_sale_count: '',
      hot_sale_time: '',
      receiver_list: [],
      monitor_accounts: [''],
    });

    const resetForm = () => {
      form.hot_sale_time = '';
      form.hot_sale_count = '';
      form.receiver_list = [];
      form.monitor_accounts = [''];
    };

    const formRules = ref<any>({
      hot_sale_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
      hot_sale_count: [{ required: true, message: '请设置阀值', trigger: ['blur', 'change'] }],
      receiver_list: [
        {
          required: form.receiver_list.length === 0,
          message: '请输入并选择',
          trigger: ['blur', 'change'],
        },
      ],
    });

    const monitorAcCheck = (_: any, value: string, callback: any, index: number) => {
      if (value === '' || value === undefined || value === null) {
        return callback(new Error('请输入账号名称'));
      }
      return callback();
    };

    watch(
      () => props.visible,
      newVal => {
        if (newVal) {
          getInitialVal();
        } else {
          formRef.value?.resetFields();
          resetForm();
        }
      },
    );

    const getInitialVal = async () => {
      const res = await GetMonitorConfig({ project_id });
      if (res.data.success) {
        const data = res.data.data.data;
        if (!data) return;
        form.hot_sale_time = data.hot_sale_time;
        form.hot_sale_count = data.hot_sale_count;
        form.monitor_accounts = data.monitor_accounts;
        form.receiver_list = data.receiver_list;
        selectMembers.value = data.receiver_list;
      } else {
        ctx.root.$message.error(res.data.message ?? '获取失败，请稍候重试');
      }
    };

    const otherMemberLoading = ref<boolean>(false);
    const otherMembers = ref<{ user_id: string; name: string }[]>([]);
    const selectMembers = ref<{ user_id: string; name: string }[]>([]);
    const selectNames = computed(() => {
      return form.receiver_list.map((item: { user_id: string; name: string }) => {
        const findEl = selectMembers.value.find(el => el.user_id === item.user_id);
        return findEl?.name ?? '';
      });
    });

    const getAllOtherMembersRequest = async (keyword: string) => {
      if (keyword === '' || keyword === undefined) {
        otherMembers.value = [];
        return;
      }
      otherMemberLoading.value = true;
      const res = await GetSystemUsersList(keyword);
      otherMemberLoading.value = false;
      if (res.data.success) {
        otherMembers.value = res.data.data.data;
      } else {
        otherMembers.value = [];
      }
    };
    const onOtherMembersChanged = (members: string[]) => {
      const selects: { user_id: string; name: string }[] = [];
      //  先把已经搜索过的内容保存起来
      otherMembers.value.forEach(el => {
        const findEl = selectMembers.value.find(seEl => el.user_id === seEl.user_id);
        if (!findEl) {
          selectMembers.value.push({
            user_id: el.user_id,
            name: el.name,
          });
        }
      });
      members.forEach((name: string) => {
        const findMember = selectMembers.value.find(seEl => seEl.name === name);
        if (findMember) {
          selects.push(findMember);
        }
      });
      form.receiver_list = selects;
    };

    const deleteAccount = (key: number) => {
      form.monitor_accounts.splice(key, 1);
    };
    const addAccount = () => {
      form.monitor_accounts.push('');
    };

    const methods = {
      onClose: () => {
        resetForm();
        ctx.emit('update:visible', false);
      },
      onSave: async () => {
        const isValid = await new Promise(resolve =>
          formRef.value?.validate(pass => resolve(pass)),
        );
        if (!isValid) {
          return;
        }
        const params = {
          ...form,
        };
        saveLoading.value = true;
        const res = await UpdateMonitorConfig(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '操作成功');
          resetForm();
          ctx.emit('save');
          ctx.emit('update:visible', false);
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败，请稍候重试');
        }
      },
    };

    const formatInterger = (val: any) => {
      form.hot_sale_count = inputLimit.Interger(val);
    };

    return {
      form,
      formRules,
      formRef,
      saveLoading,
      ...methods,
      formatInterger,
      otherMemberLoading,
      otherMembers,
      selectNames,
      getAllOtherMembersRequest,
      onOtherMembersChanged,
      deleteAccount,
      addAccount,
      monitorAcCheck,
    };
  },
});
