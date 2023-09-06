/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-25 10:39:25
 */
import { QueryAnchorMaintainer, SaveAnchorMaintainer } from '@/services/supplier';
import { UserInfo } from '@/types/tiange/system';
import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';

export interface MaintainerType {
  anchor_id: string | number | undefined;
  maintainer_id: string | number | undefined;
  maintainer_name: string | number | undefined;
}

export default defineComponent({
  setup(props, ctx) {
    const dialogVisible = ref<boolean>(false);

    const userInfoList = ref<UserInfo[]>([]);

    const getUserLoading = ref<boolean>(false);

    const saveLoading = ref<boolean>(false);

    const dataForm = ref<MaintainerType>({
      anchor_id: undefined,
      maintainer_id: undefined,
      maintainer_name: undefined,
    });

    const formRef = ref<ElForm | undefined>(undefined);

    const methods = {
      close: () => {
        dialogVisible.value = false;
      },
      save: async () => {
        formRef.value?.validate(async valid => {
          if (valid) {
            saveLoading.value = true;
            const res = await SaveAnchorMaintainer({
              id: dataForm.value.anchor_id,
              maintainer_id: dataForm.value.maintainer_id,
            });
            saveLoading.value = false;
            if (res.data.success) {
              ctx.root.$message.success(res.data.message);
              ctx.emit('save');
              dialogVisible.value = false;
            } else {
              ctx.root.$message.error(res.data.message);
            }
          }
        });
      },
      // show: (maintainer: MaintainerType) => {
      show: (maintainer: MaintainerType) => {
        dataForm.value.anchor_id = maintainer.anchor_id;
        dataForm.value.maintainer_id = maintainer.maintainer_id;
        dataForm.value.maintainer_name = maintainer.maintainer_name;
        dialogVisible.value = true;
        setTimeout(() => {
          formRef.value?.clearValidate();
        }, 0);
      },
      getUserReq: async (keyword: string) => {
        if (!keyword) {
          userInfoList.value = [];
          return;
        }
        getUserLoading.value = true;
        const res = await QueryAnchorMaintainer(keyword);
        getUserLoading.value = false;
        if (res.data.success) {
          userInfoList.value = res.data.data;
        }
      },
      onMaintainerChanged: (name: string) => {
        const finder = userInfoList.value.find(el => el.username === name);
        dataForm.value.maintainer_id = finder?.id;
        dataForm.value.maintainer_name = finder?.username;
      },
    };

    return {
      dataForm,
      formRef,
      getUserLoading,
      userInfoList,
      dialogVisible,
      ...methods,
    };
  },
});
