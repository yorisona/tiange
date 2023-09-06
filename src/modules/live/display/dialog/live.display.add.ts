import {
  defineComponent,
  ref,
  PropType,
  reactive,
  toRefs,
  watch,
  computed,
} from '@vue/composition-api';
import { LiveDisplay, Studio, LiveDisplayCreateParams, Kol } from '@/types/tiange/live';
import {
  StudioList,
  KolQuery,
  EditShopLiveDisplayServiceV2,
  LiveScheduleQuery,
} from '@/services/live';
import { ElForm } from 'element-ui/types/form';
import { unique, wait } from '@/utils/func';
import { useSchedules } from '../use/schedule';
import moment from 'moment';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { DateStr } from '@/types/base/advanced';
import lodash from '@/utils/lodash/custom';
import { GetUser } from '@/services/system';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
const { debounce } = lodash;

interface currentFrom extends LiveDisplayCreateParams {
  startTimeAndEndTime: null | string[];
  studio_name?: string;
  id?: number | undefined;
}

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '新增场次',
    },
    start_date_disabled: {
      type: Boolean,
      default: false,
    },
    // 带入的的直播场次，
    defaultDisplay: {
      type: Object as PropType<Partial<LiveDisplay>>,
    },
    project_id: {
      type: Number,
      default: -1,
    },
    business_type: {
      type: Number,
    },
    studioInfo: {
      type: Object as PropType<{ studio_id: string; studio_name: string }>,
    },
  },

  setup(props, ctx) {
    // 保存 加载状态
    const saveLoading = ref<boolean>(false);
    // 项目编号列表 加载状态LiveDisplayLiveDisplay

    const formRef = ref<ElForm | undefined>(undefined);
    const {
      isFromLocalLife,
      isFromSupplyChain,
      business_type: project_business_type,
    } = useProjectBaseInfo();
    const numOfSessionsForm = ref<currentFrom>({
      id: undefined,
      project_id: props.project_id,
      live_title: '',
      live_start_time: '',
      live_end_time: '',
      studio_id: Number(props.studioInfo?.studio_id),
      studio_name: props.studioInfo?.studio_name,
      kol_schedule_infos: [],
      operator_schedule_infos: [],
      startTimeAndEndTime: [],
    });

    watch([() => props.visible, () => props.defaultDisplay], async () => {
      if (props.visible) {
        numOfSessionsForm.value.studio_id = props.studioInfo
          ? Number(props.studioInfo?.studio_id)
          : Number(props.defaultDisplay?.studio_id);
        numOfSessionsForm.value.studio_name = props.studioInfo
          ? props.studioInfo?.studio_name
          : props.defaultDisplay?.studio_name;

        if (props.defaultDisplay) {
          business_type.value = props.defaultDisplay?.business_type;
          const {
            id = 0,
            project_id = 0,
            live_title = '',
            live_start_time = '',
            live_end_time = '',
          } = props.defaultDisplay;
          const [{ data: response }] = await wait(
            300,
            LiveScheduleQuery(
              id,
              isFromSupplyChain.value
                ? E.project.BusinessType.supplyChain
                : isFromLocalLife.value
                ? E.project.BusinessType.locallife
                : E.project.BusinessType.douyin,
            ),
          );
          if (response.success) {
            const kolObj: any = {};
            const operatorObj: any = {};
            const oprateList = [] as any[];
            response.data.operator_schedule_list.forEach(item => {
              oprateList.push({
                id: item.user_id,
                username: item.operator_name,
              });
              const stv = moment(item.start_time).valueOf();
              if (!operatorObj[stv]) {
                operatorObj[stv] = {};
                operatorObj[stv].start_time = item.start_time;
                operatorObj[stv].end_time = item.end_time;
                operatorObj[stv].operator_ids = [item.user_id];
                operatorObj[stv].pickerOptions = {
                  disabledDate(time: Date) {
                    return (
                      moment(time).format('YYYY-MM-DD') <
                        moment(item.start_time).format('YYYY-MM-DD') ||
                      moment(time).format('YYYY-MM-DD') > moment(item.end_time).format('YYYY-MM-DD')
                    );
                  },
                };
              } else {
                operatorObj[stv].operator_ids.push(item.user_id);
              }
            });
            response.data.kol_schedule_list.forEach(item => {
              const stv = moment(item.start_time).valueOf();
              if (!kolObj[stv]) {
                kolObj[stv] = {};
                kolObj[stv].start_time = item.start_time;
                kolObj[stv].end_time = item.end_time;
                kolObj[stv].kol_ids = [item.kol_id];
                kolObj[stv].importKols =
                  (item as any).compass_schedule_id && item.kol_id ? [item.kol_id] : [];
                kolObj[stv].pickerOptions = {
                  disabledDate(time: Date) {
                    return (
                      moment(time).format('YYYY-MM-DD') <
                        moment(item.start_time).format('YYYY-MM-DD') ||
                      moment(time).format('YYYY-MM-DD') > moment(item.end_time).format('YYYY-MM-DD')
                    );
                  },
                };
              } else {
                kolObj[stv].kol_ids.push(item.kol_id);
                if ((item as any).compass_schedule_id && item.kol_id) {
                  kolObj[stv].importKols.push(item.kol_id);
                }
              }
            });
            numOfSessionsForm.value.operator_schedule_infos = Object.values(operatorObj);
            ScheduleData.oprateList =
              ScheduleData.oprateList.length > 0 ? ScheduleData.oprateList : oprateList;
            numOfSessionsForm.value.kol_schedule_infos = Object.values(kolObj);
          }
          numOfSessionsForm.value.project_id = project_id;
          numOfSessionsForm.value.id = id;
          numOfSessionsForm.value.live_title = live_title;
          numOfSessionsForm.value.live_start_time = live_start_time;
          numOfSessionsForm.value.live_end_time = live_end_time;
          numOfSessionsForm.value.startTimeAndEndTime = [live_start_time, live_end_time];
        }
      }
    });
    const business_type = ref<number | undefined>(undefined);

    // 直播间列表
    const studioList = ref<Studio[]>([]);
    // 项目编号列表
    // 校验规则
    const formRules = ref({
      project_id: { required: true, message: '请输入项目编号', trigger: ['change', 'blur'] },
      live_start_time: { required: true, message: '请选择直播日期', trigger: 'blur' },
      // studio_id: { required: true, message: '请选择直播间', trigger: 'blur' },
      live_title: { required: true, message: '请输入直播标题', trigger: 'blur' },
    });

    // 获取店铺列表请求
    async function sendGetStudioListRequest(
      studio_name: string | undefined,
      business_type: number | undefined,
    ) {
      const { data: response } = await StudioList(studio_name, business_type);
      if (response.success) {
        studioList.value = response.data as Studio[];
      }
    }

    // 处理关闭事件
    const handleCloseAction = () => {
      resetForm();
      ctx.emit('closeAction');
    };

    // 排班数据
    const ScheduleData = reactive<{
      check_kol_schedule_infos: any[];
      anchorKolList: Kol[];
      oprateList: any[];
    }>({
      check_kol_schedule_infos: [],
      anchorKolList: [],
      oprateList: [],
    });

    const studioChanged = (value: string) => {
      const fil = studioList.value.filter((item: Studio) => {
        return value === item.studio_name;
      });
      if (fil.length) {
        numOfSessionsForm.value.studio_id = fil[0].id;
      } else {
        numOfSessionsForm.value.studio_id = undefined;
      }
    };

    // 重置表单
    const resetForm = () => {
      numOfSessionsForm.value = {
        id: undefined,
        project_id: props.project_id,
        live_title: '',
        live_start_time: '',
        live_end_time: '',
        studio_id: Number(props.studioInfo?.studio_id),
        studio_name: props.studioInfo?.studio_name,
        kol_schedule_infos: [],
        operator_schedule_infos: [],
        startTimeAndEndTime: [],
      };
      formRef.value?.clearValidate();
    };

    // 发送获取场次详情接口
    const { loadScheduleData, ScheduleData: RemoteScheduleData, ...rest } = useSchedules();

    const queryStudio = (query: string) => {
      if (query !== '') {
        sendGetStudioListRequest(query, business_type.value);
      } else {
        studioList.value = [];
      }
    };

    const originAnchors = ref<Kol[]>([]);

    // 获取主播kol/运营助理(主播列表)
    const getKolList = async (val = '') => {
      const { data: response } = await KolQuery({});
      if (response.success) {
        originAnchors.value = response.data;
        ScheduleData.anchorKolList = response.data.filter(el => el.kol_id < 0);
      } else {
        ScheduleData.anchorKolList = [];
      }
      /*   const res = await getKolName({
        roles: '1001',
        business_type: business_type.value,
      });
      if (res.data.success) {
        ScheduleData.oprateList = res.data.data;
      } else {
        ScheduleData.oprateList = [];
      }*/
    };
    const getOprateList = async (val = '') => {
      const { data: res } = await GetUser({
        /*roles: '1008',
            business_type: BusinessTypeEnum.marketing,*/
        search_type: 2,
        search_value: val,
        is_checked: 1,
      });
      ScheduleData.oprateList = res.success ? res.data.data : [];
    };
    const initKolSchedule = () => {
      const schedules = [{ duration: 0, start_time: '', end_time: '', name: '', id: 0 }];

      const timePoints = unique(schedules.map(el => [el.start_time, el.end_time]).flat())
        .map(el => new Date(el).getTime())
        .sort();

      timePoints.shift();

      timePoints.forEach((time, index) => {
        if (index < timePoints.length - 1) {
          addKolTimeLine();
        }
      });
    };
    const initOperateSchedule = () => {
      const schedules = [{ duration: 0, start_time: '', end_time: '', name: '', id: -1 }];

      const timePoints = unique(schedules.map(el => [el.start_time, el.end_time]).flat())
        .map(el => new Date(el).getTime())
        .sort();

      timePoints.shift();

      timePoints.forEach((time, index) => {
        if (index < timePoints.length - 1) {
          addOperateTimeLine();
        }
      });
    };

    const initKolScheduleInfos = async () => {
      await getKolList();

      initKolSchedule();
      initOperateSchedule();
    };
    initKolScheduleInfos();
    const addKolTimeLine = (userOperation = false) => {
      if ((isAutoObtain.value && userOperation) || hasImportKolData.value) {
        return;
      }
      // 获取数组最后一位元素
      const len = numOfSessionsForm.value.kol_schedule_infos.length;
      const tempLastItem = numOfSessionsForm.value.kol_schedule_infos[len - 1];
      const idx = numOfSessionsForm.value.kol_schedule_infos.length - 1;
      const preEnd = numOfSessionsForm.value.kol_schedule_infos[idx].end_time;
      const preStart = numOfSessionsForm.value.kol_schedule_infos[idx].start_time;
      if (!tempLastItem.start_time) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '请先选择时间',
        });
        return;
      }
      if (numOfSessionsForm.value.kol_schedule_infos[idx].kol_ids.length === 0) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '未选择排班人员',
        });
        return;
      }

      numOfSessionsForm.value.kol_schedule_infos?.push({
        end_time: '',
        start_time: moment(preStart).format('YYYY-MM-DD') + ' 00:00',
        kol_ids: [],
        pickerOptions: {
          disabledDate(time: Date) {
            return (
              moment(time).format('YYYY-MM-DD') < moment(preStart).format('YYYY-MM-DD') ||
              moment(time).format('YYYY-MM-DD') > moment(preEnd).format('YYYY-MM-DD')
            );
          },
        },
      });
    };
    const kolWorkTime = (idx: number) => {
      const curKol = numOfSessionsForm.value.kol_schedule_infos[idx];
      const preKol = numOfSessionsForm.value.kol_schedule_infos[idx - 1];
      // numOfSessionsForm.value.kol_schedule_infos.splice(idx + 1);
      if (idx === 1 && !curKol.start_time) {
        preKol.end_time = numOfSessionsForm.value.live_end_time;
      } else {
        preKol.end_time = curKol.start_time;
        if (idx === numOfSessionsForm.value.kol_schedule_infos.length - 1) {
          curKol.end_time = numOfSessionsForm.value.live_end_time;
        }
      }
    };
    const kolOperateTime = (idx: number) => {
      const curKol = numOfSessionsForm.value.operator_schedule_infos[idx];
      const preKol = numOfSessionsForm.value.operator_schedule_infos[idx - 1];
      if (idx === 1 && !curKol.start_time) {
        preKol.end_time = numOfSessionsForm.value.live_end_time;
      } else {
        preKol.end_time = curKol.start_time;
        if (idx === numOfSessionsForm.value.operator_schedule_infos.length - 1) {
          curKol.end_time = numOfSessionsForm.value.live_end_time;
        }
      }
      // curKol.end_time = numOfSessionsForm.value.live_end_time;
    };
    const addOperateTimeLine = () => {
      const len = numOfSessionsForm.value.operator_schedule_infos.length;
      const tempLastItem = numOfSessionsForm.value.operator_schedule_infos[len - 1];
      const idx = numOfSessionsForm.value.operator_schedule_infos.length - 1;
      const preEnd = numOfSessionsForm.value.operator_schedule_infos[idx].end_time;
      const preStart = numOfSessionsForm.value.operator_schedule_infos[idx].start_time;
      if (!tempLastItem.start_time) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '请先选择时间',
        });
        return;
      }
      if (numOfSessionsForm.value.operator_schedule_infos[idx].operator_ids.length === 0) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '未选择排班人员',
        });
        return;
      }

      numOfSessionsForm.value.operator_schedule_infos?.push({
        end_time: '',
        start_time: moment(preStart).format('YYYY-MM-DD') + ' 00:00',
        operator_ids: [],
        pickerOptions: {
          disabledDate(time: Date) {
            return (
              moment(time).format('YYYY-MM-DD') < moment(preStart).format('YYYY-MM-DD') ||
              moment(time).format('YYYY-MM-DD') > moment(preEnd).format('YYYY-MM-DD')
            );
          },
        },
      });
    };

    const deleteKolTime = (index: number) => {
      numOfSessionsForm.value.kol_schedule_infos.splice(index, 1);
      const len = numOfSessionsForm.value.kol_schedule_infos.length; // 2
      numOfSessionsForm.value.kol_schedule_infos.forEach((item, idx) => {
        if (idx === len - 1) {
          item.end_time = numOfSessionsForm.value.live_end_time;
        } else {
          item.end_time = numOfSessionsForm.value.kol_schedule_infos[idx + 1].start_time;
        }
      });
    };
    const deleteOperateTime = (index: number) => {
      numOfSessionsForm.value.operator_schedule_infos.splice(index, 1);
      const len = numOfSessionsForm.value.operator_schedule_infos.length; // 2
      numOfSessionsForm.value.operator_schedule_infos.forEach((item, idx) => {
        if (idx === len - 1) {
          item.end_time = numOfSessionsForm.value.live_end_time;
        } else {
          item.end_time = numOfSessionsForm.value.operator_schedule_infos[idx + 1].start_time;
        }
      });
    };
    const onSelectKolUserChanged = (users: number[], index: number) => {
      const kols: any = numOfSessionsForm.value.kol_schedule_infos;
      kols[index].kol_ids = Array.from(new Set([...(kols[index].importKols || []), ...users]));
    };
    const onSelectOperateUserChanged = (users: number[], index: number) => {
      numOfSessionsForm.value.operator_schedule_infos[index].operator_ids = users;
    };

    const onAddkolSchedule = () => {
      if (!numOfSessionsForm.value.live_start_time) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '请先选择直播开始时间和结束时间',
        });
        return;
      }
      numOfSessionsForm.value.kol_schedule_infos?.push({
        end_time: numOfSessionsForm.value.live_end_time,
        start_time: numOfSessionsForm.value.live_start_time,
        kol_ids: [],
        pickerOptions: {},
      });
    };

    const onDeleteKolSchedule = () => {
      numOfSessionsForm.value.kol_schedule_infos = [];
    };

    const onAddOperatorSchedule = () => {
      if (!numOfSessionsForm.value.live_start_time) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '请先选择直播开始时间和结束时间',
        });
        return;
      }
      numOfSessionsForm.value.operator_schedule_infos?.push({
        end_time: numOfSessionsForm.value.live_end_time,
        start_time: numOfSessionsForm.value.live_start_time,
        operator_ids: [],
        pickerOptions: {},
      });
    };

    const onDeleteOperatorSchedule = () => {
      numOfSessionsForm.value.operator_schedule_infos = [];
    };
    const confirmFunc = debounce(async (oldStart: any, oldEnd: any) => {
      const res = await AsyncConfirm(ctx, '此次排班改动较大，是否进行重新排班？');
      if (!res) {
        numOfSessionsForm.value.live_start_time = oldStart;
        numOfSessionsForm.value.live_end_time = oldEnd;
        numOfSessionsForm.value.startTimeAndEndTime = [oldStart, oldEnd];
        return Promise.resolve(false);
      }
      onDeleteKolSchedule();
      onDeleteOperatorSchedule();
      return Promise.resolve(res);
    });
    const validateChangeTime = async (val: DateStr[], st: DateStr, et: DateStr, infos: any) => {
      if (st === infos[1]?.start_time) {
        infos?.shift();
      } else if (st < infos[0].start_time) {
        const obj: any = {
          end_time: infos[0].start_time,
          start_time: val[0],
          pickerOptions: {
            disabledDate(time: Date) {
              return (
                time.getTime() < moment(st, 'YYYY-MM-DD').valueOf() ||
                time.getTime() > moment(et, 'YYYY-MM-DD').valueOf()
              );
            },
          },
        };
        if (infos[0].kol_ids) {
          obj.kol_ids = [...infos[0].kol_ids];
        } else {
          obj.operator_ids = [...infos[0].operator_ids];
        }
        infos?.unshift(obj);
        numOfSessionsForm.value.live_start_time = val[0];
        return Promise.resolve(false);
      } else if (val[0] > infos[0].start_time && val[0] < infos[1]?.start_time) {
        infos[0].start_time = val[0];
        return Promise.resolve(false);
      } else if (infos[infos.length - 1]?.end_time < val[1]) {
        const obj: any = {
          end_time: val[1],
          start_time: infos[infos.length - 1]?.end_time,
          pickerOptions: {
            disabledDate(time: Date) {
              return (
                time.getTime() < moment(st, 'YYYY-MM-DD').valueOf() ||
                time.getTime() > moment(et, 'YYYY-MM-DD').valueOf()
              );
            },
          },
        };
        if (infos[0].kol_ids) {
          obj.kol_ids = [...infos[infos.length - 1].kol_ids];
        } else {
          obj.operator_ids = [...infos[infos.length - 1].operator_ids];
        }
        infos?.push(obj);
        return Promise.resolve(false);
      } else if (infos[infos.length - 1]?.start_time === val[1]) {
        infos.pop();
        return Promise.resolve(false);
      } else if (
        val[1] < infos[infos.length - 1]?.end_time &&
        val[1] > infos[infos.length - 1]?.start_time
      ) {
        if (infos.length === 1) {
          infos[0].start_time = val[0];
          infos[0].end_time = val[1];
        } else {
          infos[infos.length - 1].end_time = val[1];
        }
      } else {
        if (infos.length === 1) {
          infos[0].start_time = val[0];
          infos[0].end_time = val[1];
          return Promise.resolve(false);
        }
        // return confirmFunc(oldStart, oldEnd);
      }
    };
    const onLiveTimeChange = async (val: null | string[]) => {
      // 如果时间为空，清排班
      const kolLen = numOfSessionsForm.value.kol_schedule_infos.length;
      const operatorLen = numOfSessionsForm.value.operator_schedule_infos.length;
      const oldStart = numOfSessionsForm.value.live_start_time;
      const oldEnd = numOfSessionsForm.value.live_end_time;

      if (val === null) {
        numOfSessionsForm.value.live_start_time = '';
        numOfSessionsForm.value.live_end_time = '';
        onDeleteKolSchedule();
        onDeleteOperatorSchedule();
        return;
      }
      numOfSessionsForm.value.live_start_time = val[0];
      numOfSessionsForm.value.live_end_time = val[1];
      // 如果没有排班，直接赋值

      if (kolLen === 0 && operatorLen === 0) {
        return;
      }
      const st = numOfSessionsForm.value.live_start_time;
      const et = numOfSessionsForm.value.live_end_time;
      // 跨天
      // 开始时间晚于第二条的开始时间，
      // 结束时间早于最右一条的结束时间
      if (numOfSessionsForm.value.kol_schedule_infos.length === 1) {
        if (val[0] > numOfSessionsForm.value.kol_schedule_infos[0].end_time) {
          return confirmFunc(oldStart, oldEnd);
        }
      }

      if (
        isNotOneDay.value ||
        val[0] > numOfSessionsForm.value.kol_schedule_infos[1]?.start_time || // 开始时间晚于第二条开始时间
        val[1] < numOfSessionsForm.value.kol_schedule_infos[kolLen - 1]?.start_time // 结束时间早于最右一条结束时间
      ) {
        if (val[1] !== numOfSessionsForm.value.kol_schedule_infos[kolLen - 1]?.start_time) {
          return confirmFunc(oldStart, oldEnd);
        }
      }
      // 如果修改时间早于第一条时间，就新增一条早的
      if (kolLen !== 0) {
        await validateChangeTime(val, st, et, numOfSessionsForm.value.kol_schedule_infos);
        // if (isChange) {
        //   onDeleteKolSchedule();
        //   onDeleteOperatorSchedule();
        //   return;
        // }
      }
      if (operatorLen !== 0) {
        await validateChangeTime(val, st, et, numOfSessionsForm.value.operator_schedule_infos);
        // numOfSessionsForm.value.live_start_time = val[0];
        // numOfSessionsForm.value.live_end_time = val[1];
        // if (isChange) {
        //   onDeleteKolSchedule();
        //   onDeleteOperatorSchedule();
        // }
      }
    };
    const pickerOptions = {
      disabledDate(time: Date) {
        if (!props.defaultDisplay?.id) {
          // 如果是创建场次
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
        return false;
      },
    };
    const isNotOneDay = computed(() => {
      const st = numOfSessionsForm.value.live_start_time;
      const et = numOfSessionsForm.value.live_end_time;
      return moment(et).date() - moment(st).date() >= 2;
    });
    const handleSaveHandler = async () => {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid || (!numOfSessionsForm.value.studio_id && studioRequired.value)) {
        return;
      }

      const st = numOfSessionsForm.value.live_start_time;
      const et = numOfSessionsForm.value.live_end_time;
      if (isNotOneDay.value) {
        ctx.root.$message.error({
          showClose: true,
          duration: 6000,
          message: '保存失败，日期最多跨一天',
        });
        return;
      }

      const {
        live_end_time,
        live_start_time,
        live_title,
        project_id,
        studio_id,
        id,
        kol_schedule_infos,
        operator_schedule_infos,
      } = numOfSessionsForm.value;
      if (kol_schedule_infos.length !== 0) {
        const startTimeError = kol_schedule_infos.find(item => {
          return (
            moment(item.start_time).valueOf() < moment(st).valueOf() ||
            item.start_time === item.end_time ||
            item.start_time > et
          ); // 排班时间小于等于直播开始时间
        });
        const startKolError = kol_schedule_infos.find(item => item.kol_ids.length === 0);
        if (startTimeError) {
          ctx.root.$message.error({
            showClose: true,
            duration: 6000,
            message: '主播排班日期错误',
          });
          return;
        }
        if (startKolError) {
          ctx.root.$message.error({
            showClose: true,
            duration: 6000,
            message: '未选择排班人员',
          });
          return;
        }
      }
      if (operator_schedule_infos.length !== 0) {
        const startTimeError = operator_schedule_infos.find(item => {
          return (
            moment(item.start_time).valueOf() < moment(st).valueOf() ||
            item.start_time === item.end_time ||
            item.start_time > et
          );
        });
        if (startTimeError) {
          ctx.root.$message.error({
            showClose: true,
            duration: 6000,
            message: '运营排班日期错误',
          });
          return;
        }
        const startKolError = operator_schedule_infos.find(item => item.operator_ids.length === 0);
        if (startKolError) {
          ctx.root.$message.error({
            showClose: true,
            duration: 6000,
            message: '未选择排班人员',
          });
          return;
        }
      }
      const payload = {
        id: id?.toString(),
        project_id: project_id.toString(),
        live_title: live_title,
        live_start_time: live_start_time,
        live_end_time: live_end_time,
        studio_id: studio_id?.toString(),
        kol_schedule_infos: kol_schedule_infos.map(({ start_time, end_time, kol_ids }) => ({
          start_time,
          end_time,
          kol_ids,
        })),
        operator_schedule_infos: operator_schedule_infos.map(
          ({ start_time, end_time, operator_ids }) => ({ start_time, end_time, operator_ids }),
        ),
      };
      saveLoading.value = true;
      const [{ data: response }] = await wait(
        300,
        EditShopLiveDisplayServiceV2(payload, project_business_type.value),
      );
      saveLoading.value = false;

      if (response.success) {
        ctx.emit('succeed');
        ctx.root.$message.success(response.message);
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };

    const isAutoObtain = computed(() => {
      // if (props.defaultDisplay?.allow_update_kol_schedule) {
      //   return false;
      // }
      return false;
      // return props.defaultDisplay?.compass_shop_live_room_id ? true : false;
    });

    const studioRequired = computed(() => {
      if (props.defaultDisplay) {
        return props.defaultDisplay.business_type !== 3 && props.defaultDisplay.business_type !== 8;
      }
      return props.business_type === 3 || props.business_type === 8 ? false : true;
    });

    const computedDisplayInfo = computed(() => props.defaultDisplay);
    const isDataImport = computed(() =>
      computedDisplayInfo.value?.compass_shop_live_room_id ? true : false,
    );

    const hasImportKolData = computed(() =>
      numOfSessionsForm.value.kol_schedule_infos.find((el: any) => (el.importKols?.length || 0) > 0)
        ? true
        : false,
    );

    return {
      getKolList,
      getOprateList,
      onSelectKolUserChanged,
      onSelectOperateUserChanged,
      deleteKolTime,
      deleteOperateTime,
      addKolTimeLine,
      addOperateTimeLine,
      ...toRefs(ScheduleData),
      formRef,
      isNotOneDay,
      formRules,
      studioList,
      resetForm,
      handleCloseAction,
      studioChanged,
      saveLoading,
      queryStudio,
      onAddkolSchedule,
      onDeleteKolSchedule,
      onAddOperatorSchedule,
      onDeleteOperatorSchedule,
      onLiveTimeChange,

      numOfSessionsForm,
      handleSaveHandler,
      pickerOptions,
      kolWorkTime,
      kolOperateTime,
      isAutoObtain,
      studioRequired,
      isDataImport,
      hasImportKolData,
    };
  },
});
