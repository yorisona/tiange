/**
 * 系统设置 - 消息管理 - 弹框
 */
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import {
  GetSystemUsersList,
  GetSystemSettingDetail,
  PostNewsSettingReceiver,
  GetFeishuGroup,
  PostUpdateCheckedFeishuBotGroups,
} from '@/services/system/news';

export default defineComponent({
  props: {
    // 编辑的系统角色对象
    editingId: {
      type: Number,
    },
    msgType: {
      type: Number,
    },
    evtType: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const formRef = ref<ElForm | undefined>(undefined);
    // 表单数据
    const form = ref<any>({
      Live_ids: [],
      Marketing_ids: [],
      Mcn_ids: [],
      User_infos: [],
      Live_infos: [],
      Marketing_infos: [],
      Mcn_infos: [],
      Unity_ids: [],
      Unity_infos: [],
      iscanMcn: true,
      iscanMarketing: true,
      iscanLive: true,
      isUnity: true,
      Liveid: 0,
      Marketingid: 0,
      Mcnid: 0,
      UnityId: 0,
    });
    const messageIds = ref<string[]>([]);
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    const personnelHandler = async (payload: any) => {
      const { data } = await PostNewsSettingReceiver(payload);
      if (data.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('closeAction');
      } else {
        ctx.root.$message.error(data.message || '请重新保存');
      }
    };
    const idsHandler = async (payload: any) => {
      const { data } = await PostUpdateCheckedFeishuBotGroups(payload);
      if (data.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('closeAction');
      } else {
        ctx.root.$message.error(data.message || '请重新保存');
      }
    };
    // 保存
    const handleSaveAction = () => {
      if (props.msgType === 1) {
        const payload = {
          config_id: props.editingId,
          data: [
            {
              receiver_list: form.value.Live_infos,
              project_type: 1,
              id: form.value.Liveid,
            },
            {
              receiver_list: form.value.Marketing_infos,
              project_type: 2,
              id: form.value.Marketingid,
            },
            {
              receiver_list: form.value.Mcn_infos,
              project_type: 3,
              id: form.value.Mcnid,
            },
          ],
        };
        personnelHandler(payload);
      } else if (props.msgType === 3) {
        const payload = {
          config_id: props.editingId,
          data: [
            {
              receiver_list: form.value.Unity_infos,
              project_type: 4,
              id: form.value.UnityId,
            },
          ],
        };
        personnelHandler(payload);
      } else {
        const payload = {
          event_type: 1,
          chat_ids: messageIds.value.filter((item: string) => item),
        };
        idsHandler(payload);
      }
    };
    const getAllUserName = async (str: string) => {
      if (str && str.length > 0) {
        const { data } = await GetSystemUsersList(str);
        if (data.success) {
          form.value.User_infos = data.data.data;
        }
      }
    };
    const getSettingUserName = async () => {
      if (props.msgType === 1 || props.msgType === 3) {
        const { data: response } = await GetSystemSettingDetail(props.editingId);
        if (response.success) {
          const list: any[] = response.data.data;
          list.filter((item: any) => {
            if (item.project_type === 1) {
              const livearr: any[] = [];
              item.receiver_list.filter((subItem: any) => {
                livearr.push(subItem.user_id);
                const ishasitem = form.value.User_infos.find((sub_item: any) => {
                  if (sub_item.user_id === subItem.user_id) {
                    return true;
                  }
                });
                if (!ishasitem) {
                  form.value.User_infos.push(subItem);
                }
              });
              form.value.Live_infos = item.receiver_list;
              form.value.Live_ids = livearr;
              form.value.iscanLive = item.can_edit;
              form.value.Liveid = item.id;
            }
            if (item.project_type === 2) {
              const marketingarr: any[] = [];
              item.receiver_list.filter((subItem: any) => {
                marketingarr.push(subItem.user_id);
                const ishasitem = form.value.User_infos.find((sub_item: any) => {
                  if (sub_item.user_id === subItem.user_id) {
                    return true;
                  }
                });
                if (!ishasitem) {
                  form.value.User_infos.push(subItem);
                }
              });
              form.value.Marketing_infos = item.receiver_list;
              form.value.Marketing_ids = marketingarr;
              form.value.iscanMarketing = item.can_edit;
              form.value.Marketingid = item.id;
            }
            if (item.project_type === 3) {
              const mcnarr: any[] = [];
              item.receiver_list.filter((subItem: any) => {
                mcnarr.push(subItem.user_id);
                const ishasitem = form.value.User_infos.find((sub_item: any) => {
                  if (sub_item.user_id === subItem.user_id) {
                    return true;
                  }
                });
                if (!ishasitem) {
                  form.value.User_infos.push(subItem);
                }
              });
              form.value.Mcn_infos = item.receiver_list;
              form.value.Mcn_ids = mcnarr;
              form.value.iscanMcn = item.can_edit;
              form.value.Mcnid = item.id;
            }
            if (item.project_type === 4) {
              const livearr: any[] = [];
              item.receiver_list.filter((subItem: any) => {
                livearr.push(subItem.user_id);
                const ishasitem = form.value.User_infos.find((sub_item: any) => {
                  if (sub_item.user_id === subItem.user_id) {
                    return true;
                  }
                });
                if (!ishasitem) {
                  form.value.User_infos.push(subItem);
                }
              });
              form.value.Unity_infos = item.receiver_list;
              form.value.Unity_ids = livearr;
              form.value.isUnity = item.can_edit;
              form.value.UnityId = item.id;
            }
          });
        }
      } else {
        const feishuIds = await GetFeishuGroup(props.evtType as number);
        if (feishuIds.data.success) {
          const dataList: any = feishuIds.data.data;
          const list: any[] = dataList
            .filter((item: any) => item.is_checked)
            .map((item: any) => item.chat_id);
          messageIds.value = list;
        }
      }
    };
    const onChangeLive = (value: any) => {
      if (value.length > 50) {
        ctx.root.$message.warning('最多选择50位接收人员');
        form.value.Live_ids.splice(-1);
        return;
      }
      const arr: any = [];
      value.filter((item: any) => {
        let one_item = undefined;
        form.value.Live_infos.filter((subItem: any) => {
          if (item === subItem.user_id) {
            one_item = subItem;
          }
        });
        if (!one_item) {
          form.value.User_infos.filter((subItem: any) => {
            if (item === subItem.user_id) {
              one_item = subItem;
            }
          });
        }
        arr.push(one_item);
      });
      form.value.Live_ids = value;
      form.value.Live_infos = arr;
    };
    const onChangeUnity = (value: any) => {
      if (value.length > 50) {
        ctx.root.$message.warning('最多选择50位接收人员');
        form.value.Unity_ids.splice(-1);
        return;
      }
      const arr: any = [];
      value.filter((item: any) => {
        let one_item = undefined;
        form.value.Unity_infos.filter((subItem: any) => {
          if (item === subItem.user_id) {
            one_item = subItem;
          }
        });
        if (!one_item) {
          form.value.User_infos.filter((subItem: any) => {
            if (item === subItem.user_id) {
              one_item = subItem;
            }
          });
        }
        arr.push(one_item);
      });
      form.value.Unity_ids = value;
      form.value.Unity_infos = arr;
    };
    const onChangeMarketing = (value: any) => {
      if (value.length > 50) {
        ctx.root.$message.warning('最多选择50位接收人员');
        form.value.Marketing_ids.splice(-1);
        return;
      }
      const arr: any = [];
      value.filter((item: any) => {
        let one_item = undefined;
        form.value.Marketing_infos.filter((subItem: any) => {
          if (item === subItem.user_id) {
            one_item = subItem;
          }
        });
        if (!one_item) {
          form.value.User_infos.filter((subItem: any) => {
            if (item === subItem.user_id) {
              one_item = subItem;
            }
          });
        }
        arr.push(one_item);
      });
      form.value.Marketing_ids = value;
      form.value.Marketing_infos = arr;
    };
    const onChangeMcn = (value: any) => {
      if (value.length > 50) {
        ctx.root.$message.warning('最多选择50位接收人员');
        form.value.Mcn_ids.splice(-1);
        return;
      }
      const arr: any = [];
      value.filter((item: any) => {
        let one_item = undefined;
        form.value.Mcn_infos.filter((subItem: any) => {
          if (item === subItem.user_id) {
            one_item = subItem;
          }
        });
        if (!one_item) {
          form.value.User_infos.filter((subItem: any) => {
            if (item === subItem.user_id) {
              one_item = subItem;
            }
          });
        }
        arr.push(one_item);
      });
      form.value.Mcn_ids = value;
      form.value.Mcn_infos = arr;
    };
    onMounted(() => {
      getSettingUserName();
    });
    return {
      onChangeLive,
      onChangeUnity,
      onChangeMarketing,
      onChangeMcn,
      getSettingUserName,
      getAllUserName,
      form,
      messageIds,
      formRef,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
});
