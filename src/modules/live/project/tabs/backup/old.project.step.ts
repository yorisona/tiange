/*
 * @Author: 矢车
 * @Date: 2021-01-08 10:39:57
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-22 16:16:04
 * @Description:
 */
import {
  computed,
  defineComponent,
  inject,
  PropType,
  ref,
  Ref,
  SetupContext,
} from '@vue/composition-api';
import projectFinal from '../dialog/project.final.vue';
import projectTrial from '../dialog/project.trial.vue';
import projectArea from '../dialog/project.area.vue';
import { enumEndType } from '@/utils/enumFunc';
import { LiveProject } from '@/types/tiange/live.project';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'LiveProjectStep',
  components: {
    projectFinal,
    projectTrial,
    projectArea,
  },
  emits: ['getDetail'],
  props: {
    CurrentProject: {
      type: Object as PropType<LiveProject>,
    },
  },
  setup(props, ctx: SetupContext) {
    /** 权限检查 */
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    const Permission = computed(() => {
      const canEdit = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_project_status)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_status_edit)
        : HasPermission(RIGHT_CODE.live_project_status_edit);

      return { canEdit };
    });

    const project =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    /** 是否无数据 */
    const isCurrentProjectUndef = computed(() => project.value === undefined);

    /** 项目阶段 */
    const step = computed(() => project.value?.project_status);

    const isStep2 = computed(() => step.value === 2);
    const isStep3 = computed(() => step.value === 3);
    const isStep4 = computed(() => step.value === 4);
    const isStep5 = computed(() => step.value === 5);

    const getDetail = () => {
      ctx.emit('getDetail');
    };

    return {
      Permission,
      project,
      isCurrentProjectUndef,
      enumEndType,
      getDetail,
      step,
      isStep2,
      isStep3,
      isStep4,
      isStep5,
    };
  },
});
