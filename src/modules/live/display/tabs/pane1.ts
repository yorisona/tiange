import {
  computed,
  defineComponent,
  inject,
  Ref,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import anchorArrangeForm from '../dialog/anchor.arrange.form.vue';
import { KolSchedule, LiveDisplay, OperatorSchedule } from '@/types/tiange/live';
import { LiveScheduleQuery } from '@/services/live';
import { sleep } from '@/utils/func';
import { TimelineSchedule } from '@/types/components/calendar';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import moment from 'moment';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

type DialogType = 'anchor' | 'assistant';

// 弹窗相关逻辑
const useDialogLogic = (ctx: SetupContext) => {
  /** 控制弹窗显示 */
  const isDialogVisible = ref(false);
  /** 弹窗内容类型 */
  const dialogType = ref<DialogType>('anchor');

  // 点击按钮区分主播排班和运营助理排班
  const anchorArrange = (type: DialogType) => {
    dialogType.value = type;
    isDialogVisible.value = true;
  };

  // 打开弹窗
  const openDialog = () => {
    // setTimeout(() => {
    //   ((ctx.refs.anchorArrangeForm as unknown) as { getKolList: () => void }).getKolList();
    // }, 0);
  };

  /** 主播排班 */
  const setDialogTypeAnchor = () => {
    anchorArrange('anchor');
  };

  /** 运营助理排班 */
  const setDialogTypeAssistant = () => {
    anchorArrange('assistant');
  };

  // 关闭弹窗
  const closeDialog = () => {
    isDialogVisible.value = false;
  };

  /** 弹窗标题 */
  const dialogTitle = computed(() => (dialogType.value === 'anchor' ? '主播排班' : '运营助理排班'));

  return {
    isDialogVisible,
    dialogType,
    dialogTitle,
    closeDialog,
    openDialog,
    setDialogTypeAnchor,
    setDialogTypeAssistant,
  };
};

// 获取排班数据相关逻辑
const useSchedules = () => {
  const schedule = ref<{
    kolSchedules: KolSchedule[];
    operatorSchedules: OperatorSchedule[];
  }>({
    kolSchedules: [],
    operatorSchedules: [],
  });

  const loading = ref(false);

  const loadData = async (id: number) => {
    loading.value = true;
    const [{ data: response }] = await Promise.all([await LiveScheduleQuery(id), await sleep(300)]);
    loading.value = false;

    if (response.success) {
      schedule.value.kolSchedules = response.data.kol_schedule_list;
      schedule.value.operatorSchedules = response.data.operator_schedule_list;
    } else {
      schedule.value.kolSchedules = [];
      schedule.value.operatorSchedules = [];
    }
  };

  const testClear = () => {
    schedule.value.kolSchedules = [];
    schedule.value.operatorSchedules = [];
  };

  return { loading, loadData, schedule, testClear };
};

export default defineComponent({
  name: 'TgLiveDisplayDetailTabPane1',
  components: {
    anchorArrangeForm,
  },
  setup(props, ctx) {
    /** 场次详情 */
    const displayDetail = inject<Ref<LiveDisplay | undefined>>('liveDisplay');

    const live_time = computed(() => {
      if (displayDetail?.value === undefined) {
        return '';
      }

      const { live_start_time, live_end_time } = displayDetail.value;

      return [live_start_time, live_end_time]
        .map(el => {
          return moment(el).format('YYYY.MM.DD HH:mm');
        })
        .join(' ~ ');
    });

    const { loadData, schedule, ...rest } = useSchedules();

    const timeRange = computed(() =>
      displayDetail?.value === undefined
        ? []
        : [displayDetail.value.live_start_time, displayDetail.value.live_end_time].map(el =>
            // new Date(el).getTime(),
            moment(el).valueOf(),
          ),
    );

    watch(
      () => displayDetail?.value,
      val => {
        if (val !== undefined) {
          loadData(val.id);
        }
      },
    );

    if (displayDetail?.value !== undefined) {
      loadData(displayDetail.value.id);
    }

    // 排班数据
    const schedules = computed(() => {
      if (displayDetail?.value === undefined) {
        return;
      }

      const { id, live_start_time, live_end_time } = displayDetail.value;
      // const date = new Date(displayDetail?.value.live_start_time);
      const date = moment(displayDetail?.value.live_start_time);
      //
      const ret: TimelineSchedule<LiveDisplay> = {
        id,
        original: displayDetail.value,
        day: date.day(),
        start_time: live_start_time,
        end_time: live_end_time,
        kol: schedule.value.kolSchedules.map(kolEl => {
          return {
            start_time: kolEl.start_time,
            end_time: kolEl.end_time,
            name: kolEl.kol_name,
            id: kolEl.kol_id,
            duration: kolEl.duration,
          };
        }),
        operator: schedule.value.operatorSchedules.map(opEl => {
          return {
            start_time: opEl.start_time,
            end_time: opEl.end_time,
            name: opEl.operator_name,
            duration: opEl.duration,
            id: opEl.user_id,
          };
        }),
      };

      return ret;
    });

    // 是否无数据
    const isEmpty = computed(
      () => schedule.value.operatorSchedules.length + schedule.value.kolSchedules.length === 0,
    );

    const roles = ref([
      {
        name: '运营助理',
        color: '#ffcdb3',
      },
      {
        name: '主播',
        color: '#b6cbf2',
      },
    ]);
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();

    /** 权限检查 */
    const Permission = computed(() => {
      /** 主播排班 */
      const canEditStreamerSchedule = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_kol_schedule)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_streamer_schedule)
        : HasPermission(RIGHT_CODE.live_streamer_schedule);
      /** 运营助理排班 */
      const canEditAssistantSchedule = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_assistant_schedule)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_operation_schedule)
        : HasPermission(RIGHT_CODE.live_operation_schedule);
      return { canEditStreamerSchedule, canEditAssistantSchedule };
    });

    return {
      Permission,
      ...useDialogLogic(ctx),
      displayDetail,
      live_time,
      ...rest,
      timeRange,
      schedules,
      isEmpty,
      roles,
    };
  },
});
