/*
 * @Brief: 店铺代播-直播场次-新增场次弹框
 * @Author: tingzhu
 * @Date: 2020-12-31 17:21:54
 */
import {
  defineComponent,
  ref,
  PropType,
  watch,
  reactive,
  computed,
  toRefs,
} from '@vue/composition-api';
import { LiveDisplay, Studio, ProjectIDInfo, LiveDisplayForm, Kol } from '@/types/tiange/live';
import {
  LiveDisplayProjectIdList,
  KolQuery,
  EditShopLiveDisplayServiceV2Mcn,
} from '@/services/live';
import { ElForm } from 'element-ui/types/form';
import { unique, wait } from '@/utils/func';
import { ElSelect } from 'element-ui/types/select';
import { format } from '@/utils/time';
import { MILLIONSECONDS_OF_DAY } from '@/const/time';
import { getKolName } from '@/api/shop.project';
import { useSchedules } from '../use/schedule';
import limit from '@/utils/inputLimit';

interface KolScheduleInfo {
  /** 开始时间 */
  start_time: string;
  /** 结束时间 */
  end_time: string;
  /** 开始时间截取年月日 */
  start_time_data: string;
  /** 开始时间截取时分秒 */
  start_time_temp: string;
  limitDate: { disabledDate: (time: Date) => void };
  /** 当前时间段选择的主播或者运营助理 */
  kol_ids: Array<number>;
  /** 当前主播排期是否有冲突 */
  kol_ids_verify: {
    show: boolean;
    info: Record<string, string | number>;
  }[];
}
interface s2b2cForm extends LiveDisplayForm {
  startTimeAndEndTime: string[];
  live_end_time: string;
  live_start_time: string;
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
  },
  setup(props, ctx) {
    const brand_default_value = '--';
    const autoFocuseRef = ref<ElSelect | undefined>(undefined);
    // 保存 加载状态
    const saveLoading = ref<boolean>(false);
    // 项目编号列表 加载状态LiveDisplayLiveDisplay
    const projectListLoading = ref<boolean>(false);

    const formRef = ref<ElForm | undefined>(undefined);

    const form = ref<s2b2cForm>({
      id: undefined,
      // live_time: [],
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      live_title: '',
      project_id: '',
      studio_id: undefined,
      studio_name: '',
      remark: '',
      live_type: '',
      live_end_time: '',
      live_start_time: '',
      expect_gmv: '',
      startTimeAndEndTime: [],
    });

    const brand_name = ref(brand_default_value);
    const business_type = ref<number | undefined>(undefined);

    // 直播间列表
    const studioList = ref<Studio[]>([]);
    // 项目编号列表
    const projectList = ref<ProjectIDInfo[]>([]);
    // 校验规则
    const formRules = ref({
      project_id: { required: true, message: '请输入项目编号', trigger: ['change', 'blur'] },
      // live_time: { required: true, message: '请选择直播时间', trigger: 'change' },
      live_start_time: { required: true, message: '请选择直播时间', trigger: 'change' },
      start_time: { required: true, message: '请选择开始时间', trigger: 'change' },
      studio_id: { required: true, message: '请选择直播间', trigger: ['change', 'blur'] },
      live_title: { required: true, message: '请输入直播标题', trigger: 'blur' },
      expect_gmv: { required: true, message: '请填写预期GMV', trigger: 'blur' },
      live_type: { required: true, message: '请选择场次类型', trigger: 'change' },
    });

    // 获取项目编号列表请求
    async function sendGetProjectIDListRequest(query: string) {
      if (query === '') {
        projectList.value = [];
        return;
      }
      projectListLoading.value = true;
      const { data: response } = await LiveDisplayProjectIdList({
        project_uid: query,
      });
      projectListLoading.value = false;
      if (response.success) {
        projectList.value = response.data as ProjectIDInfo[];
      }
    }

    // 处理关闭事件
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };

    // 排班数据
    const ScheduleData = reactive<{
      kol_schedule_infos: KolScheduleInfo[];
      operate_schedule_infos: KolScheduleInfo[];
      check_kol_schedule_infos: any[];
      anchorKolList: Kol[];
      oprateList: any[];
    }>({
      check_kol_schedule_infos: [],
      anchorKolList: [],
      oprateList: [],
      operate_schedule_infos: [
        {
          start_time: '', // 开始时间
          start_time_data: '', // 开始时间截取年月日
          start_time_temp: '', // 开始时间截取时分秒
          end_time: '', // 结束时间
          // 限制日期不可选
          limitDate: {
            disabledDate(time: Date) {
              return time.getTime() < Date.now();
            },
          },
          kol_ids: [],
          kol_ids_verify: [
            {
              show: false,
              info: {},
            },
          ],
        },
      ],
      kol_schedule_infos: [
        {
          start_time: '', // 开始时间
          start_time_data: '', // 开始时间截取年月日
          start_time_temp: '', // 开始时间截取时分秒
          end_time: '', // 结束时间
          // 限制日期不可选
          limitDate: {
            disabledDate(time: Date) {
              return time.getTime() < Date.now();
            },
          },
          kol_ids: [],
          kol_ids_verify: [
            {
              show: false,
              info: {},
            },
          ],
        },
      ],
    });

    // 提交数据
    const handleFormDataSubmit = async () => {
      // 提交数据
      const { id, live_title, live_end_time, live_start_time, live_type, expect_gmv } = form.value;
      const project_id: any = form.value.project_id;
      if (project_id === '') {
        return;
      }
      if (!live_end_time || !live_start_time) {
        return;
      }

      const payload = {
        id: id?.toString() ?? '',
        project_id: project_id.toString(),
        live_title: live_title,
        live_start_time: live_start_time,
        live_end_time: live_end_time,
        live_type,
        expect_gmv,
      };
      if (payload.expect_gmv) {
        payload.expect_gmv = (payload.expect_gmv as any) * 100;
      }

      saveLoading.value = true;
      const [{ data: response }] = await wait(300, EditShopLiveDisplayServiceV2Mcn(payload));
      saveLoading.value = false;

      if (response.success) {
        ctx.emit('succeed');
        ctx.root.$message.success(response.message);
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };

    // 处理保存事件
    const handleSaveAction = async () => {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));

      if (!isValid) {
        return;
      }
      await handleFormDataSubmit();
    };

    const handleProjectUidFocus = () => {
      if (!form.value.project_id) {
        projectList.value = [];
      }
    };

    const studioChanged = (value: string) => {
      const fil = studioList.value.filter((item: Studio) => {
        return value === item.studio_name;
      });
      if (fil.length) {
        form.value.studio_id = fil[0].id;
      } else {
        form.value.studio_id = undefined;
      }
    };

    // 重置表单
    const resetForm = () => {
      setTimeout(() => {
        form.value = {
          start_date: '',
          start_time: '',
          end_date: '',
          end_time: '',
          live_end_time: '',
          startTimeAndEndTime: [],
          live_start_time: '',
          live_title: '',
          project_id: '',
          studio_id: undefined,
          studio_name: '',
          remark: '',
          live_type: '',
          expect_gmv: '',
        };
        brand_name.value = brand_default_value;
        studioList.value = [];
        saveLoading.value = false;
        ScheduleData.kol_schedule_infos = [
          {
            start_time: '', // 开始时间
            start_time_data: '', // 开始时间截取年月日
            start_time_temp: '', // 开始时间截取时分秒
            end_time: '', // 结束时间
            // 限制日期不可选
            limitDate: {
              disabledDate(time: Date) {
                return time.getTime() < Date.now();
              },
            },
            kol_ids: [],
            kol_ids_verify: [
              {
                show: false,
                info: {},
              },
            ],
          },
        ];
        ScheduleData.operate_schedule_infos = [
          {
            start_time: '', // 开始时间
            start_time_data: '', // 开始时间截取年月日
            start_time_temp: '', // 开始时间截取时分秒
            end_time: '', // 结束时间
            // 限制日期不可选
            limitDate: {
              disabledDate(time: Date) {
                return time.getTime() < Date.now();
              },
            },
            kol_ids: [],
            kol_ids_verify: [
              {
                show: false,
                info: {},
              },
            ],
          },
        ];
      }, 200);
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 210);
    };

    // 发送获取场次详情接口
    const { loadScheduleData, ScheduleData: RemoteScheduleData, ...rest } = useSchedules();

    watch(
      [() => props.visible, () => props.defaultDisplay],
      async ([newVisiable, newDefaultDisplay]) => {
        if (newVisiable) {
          if (newDefaultDisplay) {
            // 设置默认带入的场次
            const tempEditingDisplay = newDefaultDisplay as Partial<LiveDisplay>;
            setupDefaultDisplay(tempEditingDisplay);
          } else {
            form.value.project_id = props.project_id;
          }
        } else {
          resetForm();
        }
      },
    );

    const setupDefaultDisplay = (display: Partial<LiveDisplay>) => {
      form.value.id = display.id;
      if (display.live_start_time && display.live_end_time) {
        form.value.live_start_time = display.live_start_time;
        form.value.live_end_time = display.live_end_time;
        form.value.startTimeAndEndTime = [display.live_start_time, display.live_end_time];
      }

      form.value.live_title = display.live_title ?? '';
      form.value.remark = display.remark ?? '';
      brand_name.value = display.brand_name ?? '--';
      business_type.value = display.business_type ?? undefined;
      form.value.live_type = display.live_type as number;
      form.value.expect_gmv = '';
      if (display.expect_gmv) {
        form.value.expect_gmv = ((display.expect_gmv as any) / 100).toString();
      }

      if (display.project_id) {
        form.value.project_id = display.project_id;
      } else {
        form.value.project_id = props.project_id ?? -1;
      }
    };

    const StartEndSameIsDay = computed(() => {
      const live_start_time = form.value.start_date + ' ' + form.value.start_time;
      const live_end_time = form.value.end_date + ' ' + form.value.end_time;

      const [live_start_date, live_end_date] = [live_start_time, live_end_time].map(
        el => el.split(' ')[0],
      );

      return live_start_date === live_end_date;
    });

    const originAnchors = ref<Kol[]>([]);

    // 获取主播kol/运营助理(主播列表)
    const getKolList = async () => {
      const { data: response } = await KolQuery({});
      if (response.success) {
        originAnchors.value = response.data;
        ScheduleData.anchorKolList = response.data.filter(el => el.kol_id < 0);
      } else {
        ScheduleData.anchorKolList = [];
      }

      const res = await getKolName({
        roles: '1001',
        business_type: business_type.value,
      });
      if (res.data.success) {
        ScheduleData.oprateList = res.data.data;
      } else {
        ScheduleData.oprateList = [];
      }
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
          ScheduleData.kol_schedule_infos[index + 1].start_time = format(time, 'YYYY-mm-dd HH:ii');
          ScheduleData.kol_schedule_infos[index + 1].start_time_data = format(time, 'YYYY-mm-dd');
          ScheduleData.kol_schedule_infos[index + 1].start_time_temp = format(time, 'HH:ii');
        }

        ScheduleData.kol_schedule_infos[index].end_time = format(time, 'YYYY-mm-dd HH:ii');
      });

      ScheduleData.kol_schedule_infos.forEach(el => {
        const ids = schedules
          .filter(schedule => schedule.start_time === el.start_time)
          .map(schedule => schedule.id);

        el.kol_ids = originAnchors.value
          .filter(kol => ids.includes(kol.kol_id))
          .map(kol => kol.kol_id);

        if (el.kol_ids.length === 0) {
          el.kol_ids = [];
        }

        el.kol_ids_verify = new Array(el.kol_ids.length).fill(0).map(_ => ({
          info: {},
          show: false,
        }));
      });

      ScheduleData.kol_schedule_infos[ScheduleData.kol_schedule_infos.length - 1].end_time = '';
      form.value.end_date + ' ' + form.value.end_time;
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
          ScheduleData.operate_schedule_infos[index + 1].start_time = format(
            time,
            'YYYY-mm-dd HH:ii',
          );
          ScheduleData.operate_schedule_infos[index + 1].start_time_data = format(
            time,
            'YYYY-mm-dd',
          );
          ScheduleData.operate_schedule_infos[index + 1].start_time_temp = format(time, 'HH:ii');
        }

        ScheduleData.operate_schedule_infos[index].end_time = format(time, 'YYYY-mm-dd HH:ii');
      });

      ScheduleData.operate_schedule_infos.forEach(el => {
        const ids = schedules
          .filter(schedule => schedule.start_time === el.start_time)
          .map(schedule => schedule.id);

        el.kol_ids = ScheduleData.oprateList.filter(op => ids.includes(op.id)).map(op => op.id);

        if (el.kol_ids.length === 0) {
          el.kol_ids = [];
        }

        el.kol_ids_verify = new Array(el.kol_ids.length).fill(0).map(_ => ({
          info: {},
          show: false,
        }));
      });

      ScheduleData.operate_schedule_infos[ScheduleData.operate_schedule_infos.length - 1].end_time =
        form.value.end_date + ' ' + form.value.end_time;
    };

    const initKolScheduleInfos = async () => {
      await getKolList();

      initKolSchedule();
      initOperateSchedule();
    };

    initKolScheduleInfos();

    watch(
      () => [
        form.value.start_date,
        form.value.start_time,
        form.value.end_date,
        form.value.end_time,
      ],
      newVal => {
        if (newVal) {
          // 主播
          ScheduleData.kol_schedule_infos[0].start_time =
            form.value.start_date + ' ' + form.value.start_time;
          ScheduleData.kol_schedule_infos[0].start_time_data = form.value.start_date;
          ScheduleData.kol_schedule_infos[0].start_time_temp = form.value.start_time;

          ScheduleData.kol_schedule_infos[0].end_time =
            form.value.end_date + ' ' + form.value.end_time;

          // 运营
          ScheduleData.operate_schedule_infos[0].start_time =
            form.value.start_date + ' ' + form.value.start_time;
          ScheduleData.operate_schedule_infos[0].start_time_data = form.value.start_date;
          ScheduleData.operate_schedule_infos[0].start_time_temp = form.value.start_time;

          ScheduleData.operate_schedule_infos[0].end_time =
            form.value.end_date + ' ' + form.value.end_time;
        }
      },
    );

    const checkKolScheduleDurationValid = () => {
      ScheduleData.kol_schedule_infos.forEach(el => {
        if (el.start_time === el.end_time) {
          ctx.root.$message.error(`${el.start_time} ~ ${el.end_time} 排班时长为零，请重新选择`);
        }
      });
    };
    const checkOperateScheduleDurationValid = () => {
      ScheduleData.operate_schedule_infos.forEach(el => {
        if (el.start_time === el.end_time) {
          ctx.root.$message.error(`${el.start_time} ~ ${el.end_time} 排班时长为零，请重新选择`);
        }
      });
    };
    // 选择日期回调
    const changeKolDate = (index: number) => {
      // 清空选择时间框
      ScheduleData.kol_schedule_infos[index].start_time_temp = '';
      checkKolScheduleDurationValid();
    };

    const changeOperateDate = (index: number) => {
      ScheduleData.operate_schedule_infos[index].start_time_temp = '';
      checkOperateScheduleDurationValid();
    };

    // 选择完时间回调
    const changeKolTime = (select_time: string, index: number) => {
      // 开始时间赋值
      if (ScheduleData.kol_schedule_infos[index].start_time_data) {
        ScheduleData.kol_schedule_infos[index].start_time =
          ScheduleData.kol_schedule_infos[index].start_time_data +
          ' ' +
          ScheduleData.kol_schedule_infos[index].start_time_temp;
        ScheduleData.kol_schedule_infos[index].start_time = select_time;
      }
      // 上一条结束时间赋值
      if (ScheduleData.kol_schedule_infos[index - 1] !== undefined) {
        ScheduleData.kol_schedule_infos[index - 1].end_time =
          ScheduleData.kol_schedule_infos[index].start_time_data +
          ' ' +
          ScheduleData.kol_schedule_infos[index].start_time;
      }

      // 结束时间赋值
      if (
        index === ScheduleData.kol_schedule_infos.length - 1 ||
        ScheduleData.kol_schedule_infos[index + 1].start_time
      ) {
        ScheduleData.kol_schedule_infos[index].end_time =
          form.value.end_date + ' ' + form.value.end_time;
      }
      checkKolScheduleDurationValid();
    };

    // 选择完时间回调
    const changeOperateTime = (select_time: string, index: number) => {
      // 开始时间赋值
      if (ScheduleData.operate_schedule_infos[index].start_time_data) {
        ScheduleData.operate_schedule_infos[index].start_time =
          ScheduleData.operate_schedule_infos[index].start_time_data +
          ' ' +
          ScheduleData.operate_schedule_infos[index].start_time_temp;
        ScheduleData.operate_schedule_infos[index].start_time = select_time;
      }
      // 上一条结束时间赋值
      if (ScheduleData.operate_schedule_infos[index - 1] !== undefined) {
        ScheduleData.operate_schedule_infos[index - 1].end_time =
          ScheduleData.operate_schedule_infos[index].start_time_data +
          ' ' +
          ScheduleData.operate_schedule_infos[index].start_time;
      }

      // 结束时间赋值
      if (
        index === ScheduleData.operate_schedule_infos.length - 1 ||
        ScheduleData.operate_schedule_infos[index + 1].start_time
      ) {
        ScheduleData.operate_schedule_infos[index].end_time =
          form.value.end_date + ' ' + form.value.end_time;
      }
      checkKolScheduleDurationValid();
    };

    const addKolTimeLine = () => {
      const live_end_time = form.value.end_date + ' ' + form.value.end_time;

      // 获取数组最后一位元素
      const tempLastItem =
        ScheduleData.kol_schedule_infos[ScheduleData.kol_schedule_infos.length - 1];
      if (!tempLastItem.start_time) {
        ctx.root.$message.warning('请先选择时间');
        return;
      }

      const start_time_data = StartEndSameIsDay.value ? live_end_time.split(' ')[0] : '';

      ScheduleData.kol_schedule_infos.push({
        start_time: '',
        start_time_data,
        start_time_temp: '',
        end_time: '待设置',
        limitDate: {
          // 设置日期禁用
          disabledDate(time: Date) {
            // 需要-1天
            const liveEndTime = format(new Date(live_end_time), 'HH:ii');
            const isNextDay0000 = liveEndTime === '00:00';

            return (
              time.getTime() <
                new Date(tempLastItem.start_time_data).getTime() - MILLIONSECONDS_OF_DAY ||
              (isNextDay0000
                ? time.getTime() > new Date(live_end_time).getTime() - 1000
                : time.getTime() > new Date(live_end_time).getTime())
            );
          },
        },
        kol_ids: [],
        kol_ids_verify: [
          {
            show: false,
            info: {},
          },
        ],
      });
    };

    const addOperateTimeLine = () => {
      const live_end_time = form.value.end_date + ' ' + form.value.end_time;

      // 获取数组最后一位元素
      const tempLastItem =
        ScheduleData.operate_schedule_infos[ScheduleData.operate_schedule_infos.length - 1];
      if (!tempLastItem.start_time) {
        ctx.root.$message.warning('请先选择时间');
        return;
      }

      const start_time_data = StartEndSameIsDay.value ? live_end_time.split(' ')[0] : '';

      ScheduleData.operate_schedule_infos.push({
        start_time: '',
        start_time_data,
        start_time_temp: '',
        end_time: '待设置',
        limitDate: {
          // 设置日期禁用
          disabledDate(time: Date) {
            // 需要-1天
            const liveEndTime = format(new Date(live_end_time), 'HH:ii');
            const isNextDay0000 = liveEndTime === '00:00';

            return (
              time.getTime() <
                new Date(tempLastItem.start_time_data).getTime() - MILLIONSECONDS_OF_DAY ||
              (isNextDay0000
                ? time.getTime() > new Date(live_end_time).getTime() - 1000
                : time.getTime() > new Date(live_end_time).getTime())
            );
          },
        },
        kol_ids: [],
        kol_ids_verify: [
          {
            show: false,
            info: {},
          },
        ],
      });
    };

    const deleteKolTime = (index: number) => {
      ScheduleData.kol_schedule_infos.splice(index, 1);
    };
    const deleteOperateTime = (index: number) => {
      ScheduleData.operate_schedule_infos.splice(index, 1);
    };
    const onSelectKolUserChanged = (users: number[], index: number) => {
      ScheduleData.kol_schedule_infos[index].kol_ids = users;
    };
    const onSelectOperateUserChanged = (users: number[], index: number) => {
      ScheduleData.operate_schedule_infos[index].kol_ids = users;
    };

    const limitGMV = (value: string) => {
      const newValue = limit.IntergerAndDecimals(value);
      form.value.expect_gmv = newValue;
      return newValue;
    };

    const onLiveTimeChange = async (val: null | string[]) => {
      if (val === null) {
        form.value.live_start_time = '';
        form.value.live_end_time = '';
      } else {
        form.value.live_start_time = val[0];
        form.value.live_end_time = val[1];
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
    return {
      limitGMV,
      pickerOptions,
      onSelectKolUserChanged,
      onLiveTimeChange,
      onSelectOperateUserChanged,
      changeKolTime,
      changeKolDate,
      changeOperateTime,
      changeOperateDate,
      deleteKolTime,
      deleteOperateTime,
      addKolTimeLine,
      addOperateTimeLine,
      ...toRefs(ScheduleData),

      autoFocuseRef,
      formRef,
      form,
      formRules,
      studioList,
      projectList,
      brand_name,
      sendGetProjectIDListRequest,
      handleCloseAction,
      handleSaveAction,
      studioChanged,
      saveLoading,
      projectListLoading,
      handleProjectUidFocus,
    };
  },
});
