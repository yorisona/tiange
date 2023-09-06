/*
 * @Brief: 已完结项目状态修改弹框
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-27 11:37:35
 */

import { ChangeProjectStatus } from '@/services/live';
import {
  CooperationTypeEnum,
  ProjectStatusEnum,
  ProjectStatusMap,
  ProjectTypeEnum,
} from '@/types/tiange/common';
import { defineComponent, ref, PropType, computed, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';

export interface RollBackProjectInfo {
  projectId: string | number | undefined;
  projectType: ProjectTypeEnum;
  cooperationType?: CooperationTypeEnum;
}

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    projectInfo: {
      type: Object as PropType<RollBackProjectInfo>,
    },
  },
  setup(props, ctx) {
    const formData = ref<{ status: ProjectStatusEnum | undefined }>({
      status: undefined,
    });

    const formRef = ref<ElForm | undefined>(undefined);
    const rules = ref({
      status: [{ required: true, message: '请选择项目状态', trigger: 'change' }],
    });

    const saveLoading = ref<boolean>(false);
    const methods = {
      handleCloseAction: () => {
        ctx.emit('update:visible', false);
      },
      handleSaveAction: async () => {
        const saveRequest = async () => {
          saveLoading.value = true;
          const res = await ChangeProjectStatus({
            id: props.projectInfo?.projectId,
            status: formData.value.status,
            project_type: props.projectInfo?.projectType,
          });
          saveLoading.value = false;
          if (res.data.success) {
            ctx.root.$message.success(res.data.message);
            ctx.emit('save');
          } else {
            ctx.root.$message.error(res.data.message);
          }
        };
        formRef.value?.validate(async valid => {
          if (valid) {
            await saveRequest();
          }
        });
      },
    };

    const projectStatusOptions = computed(() => {
      const status: { label: string | undefined; value: ProjectStatusEnum }[] = [];
      switch (props.projectInfo?.projectType) {
        case ProjectTypeEnum.live: {
          status.push({
            label: ProjectStatusMap.get(ProjectStatusEnum.tryLive),
            value: ProjectStatusEnum.tryLive,
          });
          if (props.projectInfo?.cooperationType === CooperationTypeEnum.selfSupport) {
            status.push({
              label: ProjectStatusMap.get(ProjectStatusEnum.execution),
              value: ProjectStatusEnum.execution,
            });
          } else if (props.projectInfo?.cooperationType === CooperationTypeEnum.region) {
            status.push({
              label: ProjectStatusMap.get(ProjectStatusEnum.regionExecution),
              value: ProjectStatusEnum.regionExecution,
            });
          }
          status.push({
            label: '执行结束',
            value: ProjectStatusEnum.executionEnd,
          });
          break;
        }
        case ProjectTypeEnum.common_business: {
          status.push({
            label: '执行中',
            value: ProjectStatusEnum.execution,
          });
          status.push({
            label: '执行结束',
            value: ProjectStatusEnum.executionEnd,
          });
          break;
        }
        case ProjectTypeEnum.marketing: {
          status.push({
            label: '确定合作',
            value: ProjectStatusEnum.tryLive,
          });
          status.push({
            label: '执行项目',
            value: ProjectStatusEnum.execution,
          });
          break;
        }
        default:
          break;
      }
      return status;
    });

    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) {
          formData.value.status = undefined;
          setTimeout(() => {
            formRef.value?.clearValidate();
          }, 300);
        }
      },
    );

    return {
      formRef,
      rules,
      formData,
      projectStatusOptions,
      saveLoading,
      ...methods,
    };
  },
});
