/**
 * 排班设置弹窗表单
 */
import {
  computed,
  defineComponent,
  inject,
  PropType,
  reactive,
  toRefs,
  ref,
  h,
  SetupContext,
} from '@vue/composition-api';
import { postSaveKol, postSaveOperate } from '@/api/shop.project';
import { ConflictOperatorResponse, Kol, LiveDisplay } from '@/types/tiange/live';
import { MILLIONSECONDS_OF_DAY, MILLIONSECONDS_OF_HOUR } from '@/const/time';
import { format } from '@/utils/time';
import { CheckKol, CheckOperator, KolQuery } from '@/services/live';
import { unique } from '@/utils/func';
import { watch } from '@vue/composition-api';
import { AsyncConfirm } from '@/use/asyncConfirm';
import moment from 'moment';
import { GetUser } from '@/services/system';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

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
  kol_ids: Array<number | null>;
  /** 当前主播排期是否有冲突 */
  kol_ids_verify: {
    show: boolean;
    info: Record<string, string | number>;
  }[];
  importKols: (number | null)[];
}

export default defineComponent({
  name: 'AnchorArrangeForm',
  emits: ['childClose'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object as PropType<LiveDisplay>,
      required: true,
    },
    /** 类型: anchor---主播, assistant---运营助理  */
    type: {
      type: String as PropType<'anchor' | 'assistant'>,
      required: true,
    },
    schedules: {
      type: Object as PropType<{
        kol: {
          duration: number;
          start_time: string;
          end_time: string;
          name: string;
          id: number;
        }[];
        operator: {
          duration?: number;
          start_time: string;
          end_time: string;
          name: string;
          id: number;
        }[];
      }>,
    },
  },
  setup(props, ctx: SetupContext) {
    const dialogTitle = ref('排班');
    const liveDisplay = computed(() => props.detailData);
    const haveAssistantConflict = ref<boolean>(false);

    const originAnchors = ref<Kol[]>([]);

    const 开始结束是否同一天 = computed(() => {
      const { live_start_time, live_end_time } = liveDisplay.value;

      const [live_start_date, live_end_date] = [live_start_time, live_end_time].map(
        el => el.split(' ')[0],
      );

      return live_start_date === live_end_date;
    });

    const data = reactive<{
      kol_schedule_infos: KolScheduleInfo[];
      check_kol_schedule_infos: any[];
      anchorKolList: Kol[];
      oprateList: any[];
    }>({
      kol_schedule_infos: [
        {
          start_time: liveDisplay.value.live_start_time, // 开始时间
          start_time_data: liveDisplay.value.live_start_time.split(' ')[0], // 开始时间截取年月日
          start_time_temp: liveDisplay.value.live_start_time.split(' ')[1], // 开始时间截取时分秒
          end_time: liveDisplay.value.live_end_time, // 结束时间
          // 限制日期不可选
          limitDate: {
            disabledDate(time: Date) {
              return time.getTime() < Date.now();
            },
          },
          /* ps:本来是可以直接把校验冲突的变量一起放到里面的,但是最后做到这里的时候发现有很多地方都用到这个数组,
          已经不好再多加了,就额外定义了一个专门校验冲突的数组*/
          kol_ids: [], // 当前时间段选择的主播或者运营助理
          kol_ids_verify: [
            {
              show: false,
              info: {},
            },
          ], // 当前主播排期是否有冲突
          importKols: [],
        },
      ],
      check_kol_schedule_infos: [], // 需要校验的信息
      anchorKolList: [], // 获取所有 kol
      oprateList: [], // 获取所有运营助理
    });

    const initKolScheduleInfos = async () => {
      await getKolList();
      if (
        props.schedules === undefined ||
        (props.schedules.kol.length === 0 && props.schedules.operator.length === 0)
      ) {
        return;
      }

      const schedules = props.type === 'anchor' ? props.schedules.kol : props.schedules.operator;

      const timePoints = unique(schedules.map(el => [el.start_time, el.end_time]).flat())
        .map(el => new Date(el).getTime())
        .sort();

      timePoints.shift();

      timePoints.forEach((time, index) => {
        if (index < timePoints.length - 1) {
          addTimeLine();
          data.kol_schedule_infos[index + 1].start_time = format(time, 'YYYY-mm-dd HH:ii');
          data.kol_schedule_infos[index + 1].start_time_data = format(time, 'YYYY-mm-dd');
          data.kol_schedule_infos[index + 1].start_time_temp = format(time, 'HH:ii');
        }

        data.kol_schedule_infos[index].end_time = format(time, 'YYYY-mm-dd HH:ii');
      });
      data.kol_schedule_infos.forEach(el => {
        const ids = schedules
          .filter(schedule => schedule.start_time === el.start_time)
          .map(schedule => schedule.id);
        el.kol_ids =
          props.type === 'anchor'
            ? ids.filter(id => originAnchors.value.find(kol => kol.kol_id === id))
            : data.oprateList.filter(op => ids.includes(op.id)).map(op => op.id);
        // ? originAnchors.value.filter(kol => ids.includes(kol.kol_id)).map(kol => kol.kol_id)
        el.importKols =
          props.type === 'anchor'
            ? el.kol_ids.filter(el =>
                schedules.find((subEl: any) => subEl.compass_schedule_id && el === subEl.id),
              )
            : [];
        if (el.kol_ids.length === 0) {
          el.kol_ids = [];
        }

        el.kol_ids_verify = new Array(el.kol_ids.length).fill(0).map(_ => ({
          info: {},
          show: false,
        }));
      });
      data.kol_schedule_infos[data.kol_schedule_infos.length - 1].end_time =
        liveDisplay.value.live_end_time;

      // const [start_time_data, start_time_temp] = liveDisplay.value.live_end_time.split(' ');
      // data.kol_schedule_infos[data.kol_schedule_infos.length - 1].start_time_data = start_time_data;
      // data.kol_schedule_infos[data.kol_schedule_infos.length - 1].start_time_temp = start_time_temp;
    };

    const isOptDisabled = (index: number, id: number) =>
      data.kol_schedule_infos[index].kol_ids.includes(id);
    // 获取主播kol/运营助理(主播列表)
    const getKolList = async (val = '') => {
      if (props.type === 'anchor') {
        const { data: response } = await KolQuery({});
        if (response.success) {
          originAnchors.value = response.data;
          data.anchorKolList = response.data.filter(el => el.kol_id < 0);
        } else {
          data.anchorKolList = [];
        }
      } else {
        /*const res = await getKolName({
          roles: '1001',
          // business_type: liveDisplay.value.business_type,
        });*/
        if (val) {
          const { data: response } = await GetUser({
            /*roles: '1008',
                business_type: BusinessTypeEnum.marketing,*/
            search_type: 2,
            search_value: val,
            is_checked: 1,
          });
          const resIds = response.data.data.map(el => el.id);
          const insertSelectedAssistant: any = props.schedules?.operator
            .filter((v: any) => {
              if (!resIds.includes(v.user_id)) return v;
            })
            .map((v: any) => {
              return { id: v.user_id, username: v.operator_name };
            });
          data.oprateList = response.success
            ? [...response.data.data, ...insertSelectedAssistant]
            : [];
        } else {
          const insertSelectedAssistant: any = props.schedules?.operator.map((v: any) => {
            return { id: v.user_id, username: v.operator_name };
          });
          data.oprateList = [...insertSelectedAssistant];
        }
      }
    };

    // 添加主播
    // const addAnchor = (index: number) => {
    //   data.kol_schedule_infos[index].kol_ids.push(null);
    //   data.kol_schedule_infos[index].kol_ids_verify.push({
    //     show: false,
    //     info: {},
    //   });
    // };

    const conflict_data = ref<ConflictOperatorResponse[]>([]);

    // 选择主播校验
    const verifyAnchor = async (val: number, index: number, idIndex: number) => {
      data.kol_schedule_infos[index].kol_ids[idIndex] = val;

      // 获取数组最后一位元素
      const tempLastItem = data.kol_schedule_infos[data.kol_schedule_infos.length - 1];

      if (!tempLastItem.start_time) {
        // 清空当前选中的主播
        data.kol_schedule_infos[index].kol_ids.splice(idIndex, 1, null);
        ctx.root.$message.warning('请先选择时间');
        return;
      }

      if (props.type === 'anchor') {
        const { data: response } = await CheckKol({
          shop_live_id: liveDisplay.value.id,
          check_kol_schedule_infos: [
            {
              start_time: data.kol_schedule_infos[index].start_time,
              end_time: data.kol_schedule_infos[index].end_time,
              kol_ids: [val],
            },
          ],
        });

        if (response.success) {
          // 有数据代表有冲突,无数据代表无冲突
          if (response.data?.length > 0) {
            const conflictKolResponse = response.data[0].conflict_kol_items[0];
            const { start_time, end_time, studio_name } = conflictKolResponse;

            const [startDate, endDate] = [start_time, end_time].map(el => new Date(el));

            const conflictTime = [
              format(startDate, 'YYYY.mm.dd HH:ii'),
              format(endDate, `${startDate.getDate() !== endDate.getDate() ? '次日' : ''}HH:ii`),
            ].join('~');

            data.kol_schedule_infos[index].kol_ids_verify.splice(idIndex, 1, {
              show: true,
              info: {
                conflictTime,
                start_time,
                end_time,
                studio_name,
              },
            });
          } else {
            data.kol_schedule_infos[index].kol_ids_verify.splice(idIndex, 1, {
              show: false,
              info: {
                conflictTime: '',
                start_time: '',
                end_time: '',
                studio_name: '',
              },
            });
          }
        } else {
          ctx.root.$message.error(response.message);
        }
      } else {
        const { data: response } = await CheckOperator({
          shop_live_id: liveDisplay.value.id,
          check_operator_schedule_infos: [
            {
              start_time: data.kol_schedule_infos[index].start_time,
              end_time: data.kol_schedule_infos[index].end_time,
              operator_ids: [val],
            },
          ],
        });

        if (response.success) {
          // 有数据代表有冲突,无数据代表无冲突
          if (response.data.length > 0) {
            conflict_data.value = response.data;
            haveAssistantConflict.value = true;
            const conflictOperatorResponse = response.data[0].conflict_operator_items[0];

            const { start_time, end_time, studio_name } = conflictOperatorResponse;

            const [startDate, endDate] = [start_time, end_time].map(el => new Date(el));

            const conflictTime = [
              format(startDate, 'YYYY.mm.dd HH:ii'),
              format(endDate, `${startDate.getDate() !== endDate.getDate() ? '次日' : ''}HH:ii`),
            ].join('~');

            // 显示校验信息
            data.kol_schedule_infos[index].kol_ids_verify.splice(idIndex, 1, {
              show: true,
              info: {
                conflictTime,
                start_time,
                end_time,
                studio_name,
              },
            });
          } else {
            haveAssistantConflict.value = false;
            data.kol_schedule_infos[index].kol_ids_verify.splice(idIndex, 1, {
              show: false,
              info: {
                conflictTime: '',
                start_time: '',
                end_time: '',
                studio_name: '',
              },
            });
          }
        } else {
          ctx.root.$message.error(response.message);
        }
      }
    };

    // 删除主播
    const deleteAnchor = (index: number, idIndex: number) => {
      data.kol_schedule_infos[index].kol_ids.splice(idIndex, 1);
    };

    // 删除时间点
    const deleteAnchorTime = (index: number) => {
      const isLast = index === data.kol_schedule_infos.length - 1;
      if (
        data.kol_schedule_infos.length === 2 &&
        index === 0 &&
        !data.kol_schedule_infos[index + 1].start_time
      ) {
        ctx.root.$message.warning('请选择直播时间');
        return;
      }
      data.kol_schedule_infos.splice(index, 1);
      if (isLast) {
        data.kol_schedule_infos[index - 1].end_time = liveDisplay.value.live_end_time;

        // const [start_time_data, start_time_temp] = liveDisplay.value.live_end_time.split(' ');
        // data.kol_schedule_infos[
        //   data.kol_schedule_infos.length - 1
        // ].start_time_data = start_time_data;
        // data.kol_schedule_infos[
        //   data.kol_schedule_infos.length - 1
        // ].start_time_temp = start_time_temp;
      } else {
        data.kol_schedule_infos[index - 1].end_time = data.kol_schedule_infos[index].start_time;

        const [start_time_data, start_time_temp] =
          data.kol_schedule_infos[index].start_time.split(' ');
        data.kol_schedule_infos[data.kol_schedule_infos.length - 1].start_time_data =
          start_time_data;
        data.kol_schedule_infos[data.kol_schedule_infos.length - 1].start_time_temp =
          start_time_temp;
      }
    };

    const 校验排班时长是否为0 = () => {
      data.kol_schedule_infos.forEach(el => {
        if (el.start_time === el.end_time) {
          ctx.root.$message.error(`${el.start_time} ~ ${el.end_time} 排班时长为零，请重新选择`);
        }
      });
    };

    // 选择日期回调
    const changeDate = (index: number) => {
      // 清空选择时间框
      data.kol_schedule_infos[index].start_time_temp = '';

      校验排班时长是否为0();
    };
    const kolWorkTime = (index: number) => {
      const len = data.kol_schedule_infos.length;
      if (index === len - 1 && data.kol_schedule_infos[index].end_time === '待设置') {
        data.kol_schedule_infos[index].end_time = data.kol_schedule_infos[index - 1].end_time;
      }
      if (len > 1) {
        data.kol_schedule_infos[index - 1].end_time = data.kol_schedule_infos[index].start_time;
        data.kol_schedule_infos[index].start_time_data =
          data.kol_schedule_infos[index].start_time.split(' ')[0];
        data.kol_schedule_infos[index].start_time_temp =
          data.kol_schedule_infos[index].start_time.split(' ')[1];
      }
      校验排班时长是否为0();
    };
    // 选择完时间回调
    const changeTime = (select_time: string, index: number) => {
      // 开始时间赋值
      if (data.kol_schedule_infos[index].start_time_data) {
        data.kol_schedule_infos[index].start_time =
          data.kol_schedule_infos[index].start_time_data +
          ' ' +
          data.kol_schedule_infos[index].start_time_temp;
        data.kol_schedule_infos[index].start_time = select_time;
      }
      // 上一条结束时间赋值
      if (data.kol_schedule_infos[index - 1] !== undefined) {
        data.kol_schedule_infos[index - 1].end_time =
          data.kol_schedule_infos[index].start_time_data +
          ' ' +
          data.kol_schedule_infos[index].start_time;
      }

      // 结束时间赋值
      if (
        index === data.kol_schedule_infos.length - 1 ||
        data.kol_schedule_infos[index + 1].start_time
      ) {
        data.kol_schedule_infos[index].end_time = liveDisplay.value.live_end_time;
      }

      校验排班时长是否为0();
    };

    // 添加时间点
    const addTimeLine = (userOperation = false) => {
      if (
        (isAutoObtain.value && userOperation && props.type === 'anchor') ||
        hasImportKolData.value
      ) {
        return;
      }
      const { live_end_time } = liveDisplay.value;

      // 获取数组最后一位元素
      const tempLastItem = data.kol_schedule_infos[data.kol_schedule_infos.length - 1];

      if (!tempLastItem.start_time) {
        ctx.root.$message.warning('请先选择时间');
        return;
      }

      const start_time_data = 开始结束是否同一天.value ? live_end_time.split(' ')[0] : '';

      data.kol_schedule_infos.push({
        start_time: moment(data.kol_schedule_infos[0].start_time).format('YYYY-MM-DD') + ' 00:00',
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
        importKols: [],
      });
    };

    /**
     * 获取某个时间分割点的时间拾取限制条件
     * @author  Jerry <jerry.hz.china@gmail.com>
     * @since   2021-01-28 13:53:19
     */
    const getLimitTimeSetting = (index: number) => {
      if (index === 0) {
        return {
          start: '00:00',
          step: '00:30',
          end: '23:30',
        };
      } else {
        const item = data.kol_schedule_infos[index];
        const { start_time } = data.kol_schedule_infos[index - 1];

        if (item.start_time_data === '') {
          return {
            start: '00:00',
            step: '00:30',
            end: '23:30',
          };
        }

        const startDate = new Date(item.start_time_data);
        const prevStartDate = new Date(start_time);

        const liveEndDate = new Date(liveDisplay.value.live_end_time);

        const endTimestamp = liveEndDate.getTime() - MILLIONSECONDS_OF_HOUR / 2;

        // 与上一个开始日期一致，需要缩短开始时间范围
        // 与结束日期一致，需要缩短结束时间范围
        if (startDate.getDate() === prevStartDate.getDate()) {
          const startTimestamp = prevStartDate.getTime() + MILLIONSECONDS_OF_HOUR / 2;
          const start = format(startTimestamp, 'HH:ii');

          return liveEndDate.getDate() !== startDate.getDate()
            ? {
                start,
                step: '00:30',
                end: '23:30',
              }
            : {
                start,
                step: '00:30',
                end: format(endTimestamp, 'HH:ii'),
              };
        } else {
          return liveEndDate.getDate() !== startDate.getDate()
            ? {
                start: '00:00',
                step: '00:30',
                end: '23:30',
              }
            : {
                start: '00:00',
                step: '00:30',
                end: format(endTimestamp, 'HH:ii'),
              };
        }
      }
    };

    const reload = inject<() => void>('reload');

    // 点击保存
    const save = async () => {
      // 判断信息是否填写（true代表没填写）
      // const isFull = data.kol_schedule_infos.some(
      //   item => item.end_time === '待设置' || !item.kol_ids.every(kol_id => kol_id !== null),
      // );
      const isFull = data.kol_schedule_infos.some(item => item.end_time === '待设置');

      if (isFull) {
        ctx.root.$message.error('请填写完整信息');
        return;
      }

      const isIntervalNotZero = data.kol_schedule_infos.every(
        item => item.start_time !== item.end_time,
      );

      if (!isIntervalNotZero) {
        ctx.root.$message.error('直播结束时间必须晚于开始时间');
        return;
      }

      const KolSelectNotSelected = ref(false);
      const DateFieldIncomplete = ref(false);
      const { business_type } = useProjectBaseInfo();
      // 筛选需要提交的数据
      const tempInfos = data.kol_schedule_infos.map(item => {
        if (item.kol_ids.length === 0) {
          KolSelectNotSelected.value = true;
        }
        if (!item.start_time_data || !item.start_time_temp || !item.end_time) {
          DateFieldIncomplete.value = true;
        }

        const start_date_time = item.start_time_data + ' ' + item.start_time_temp;
        const kol_ids = item.kol_ids.filter(el => {
          return el !== null;
        });
        return {
          start_time: start_date_time,
          end_time: item.end_time,
          kol_ids: kol_ids,
        };
      });

      tempInfos.forEach((el, index) => {
        if (index < tempInfos.length - 1) {
          el.end_time = tempInfos[index + 1].start_time;
        }
      });

      const tempOperateInfos = data.kol_schedule_infos.map(item => {
        const start_date_time = item.start_time_data + ' ' + item.start_time_temp;
        if (!item.start_time_data || !item.start_time_temp || !item.end_time) {
          DateFieldIncomplete.value = true;
        }
        if (item.kol_ids.length === 0) {
          KolSelectNotSelected.value = true;
        }

        return {
          start_time: start_date_time,
          end_time: item.end_time,
          operator_ids: item.kol_ids,
        };
      });
      if (KolSelectNotSelected.value) {
        ctx.root.$message.error('请选择排班人员');
        return;
      }
      if (DateFieldIncomplete.value) {
        ctx.root.$message.error('请填写直播时间');
        return;
      }

      tempOperateInfos.forEach((el, index) => {
        if (index < tempOperateInfos.length - 1) {
          el.end_time = tempOperateInfos[index + 1].start_time;
        }
      });

      let result = true;
      if (haveAssistantConflict.value === true) {
        if (props.type !== 'anchor') {
          const conflict_name = conflict_data.value
            .map(el =>
              el.conflict_operator_items.map(
                item => data.oprateList.find(op => op.id === item.operator_id)?.username,
              ),
            )
            .flat();
          result = await AsyncConfirm(ctx, {
            title: '排班存在冲突',
            content: conflict_name.join('、') + '的排班和其他场次冲突',
            confirmText: '继续提交',
            cancelText: '放弃提交',
          });
        }
      }

      if (result) {
        const res =
          props.type === 'anchor'
            ? await postSaveKol(
                {
                  shop_live_id: liveDisplay.value.id,
                  kol_schedule_infos: tempInfos,
                },
                business_type.value,
              )
            : await postSaveOperate(
                {
                  shop_live_id: liveDisplay.value.id,
                  operator_schedule_infos: tempOperateInfos,
                },
                business_type.value,
              );

        if (res.data.success) {
          data.anchorKolList = res.data.data;
          ctx.root.$message.success(res.data.message);
          if (reload) {
            reload();
          }
          closeDialog();
          ctx.emit('succeed');
        } else {
          ctx.root.$message.error(res.data.message);
          // 如果有数据返回,代表有冲突
          if (res.data.data?.length > 0) {
            // 找出有冲突的那一场,显示红色提示
            // 业务需要返回的数组层级太多,只能多层循环找出
            for (const val of res.data.data) {
              let temp;
              if (props.type === 'anchor') {
                temp = val.conflict_kol_items;
              } else {
                temp = val.conflict_operator_items;
              }
              for (const val_kol of temp) {
                data.kol_schedule_infos[val_kol.date_index].kol_ids_verify.splice(
                  val_kol.kol_index,
                  1,
                  {
                    show: true,
                    info: val_kol,
                  },
                );
              }
            }
          }
        }
      }
    };

    // 关闭弹窗
    const closeDialog = () => {
      ctx.emit('close');
      ctx.emit('update:visible', false);
    };

    const scheduleQuery = () => {
      const path = props.type === 'anchor' ? '/live/roster-query' : '/live/roster-query/operator';

      const [startDateStr, _] = props.detailData.live_start_time.split(' ');
      const date = new Date(startDateStr);
      const endDateStr = format(date.getTime() + 6 * MILLIONSECONDS_OF_DAY, 'YYYY-mm-dd');

      const query = {
        start_date: startDateStr,
        end_date: endDateStr,
      };

      const { href } = ctx.root.$router.resolve({
        path,
        query,
      });
      window.open(href, '_blank');
    };

    watch([() => props.visible], ([newVisible]) => {
      if (newVisible) {
        dialogTitle.value = props.type === 'anchor' ? '主播排班' : '运营排班';

        (data.kol_schedule_infos = [
          {
            start_time: liveDisplay.value.live_start_time, // 开始时间
            start_time_data: liveDisplay.value.live_start_time.split(' ')[0], // 开始时间截取年月日
            start_time_temp: liveDisplay.value.live_start_time.split(' ')[1], // 开始时间截取时分秒
            end_time: liveDisplay.value.live_end_time, // 结束时间
            // 限制日期不可选
            limitDate: {
              disabledDate(time: Date) {
                return time.getTime() < Date.now();
              },
            },
            /* ps:本来是可以直接把校验冲突的变量一起放到里面的,但是最后做到这里的时候发现有很多地方都用到这个数组,
            已经不好再多加了,就额外定义了一个专门校验冲突的数组*/
            kol_ids: [], // 当前时间段选择的主播或者运营助理
            kol_ids_verify: [
              {
                show: false,
                info: {},
              },
            ], // 当前主播排期是否有冲突
            importKols: [],
          },
        ]),
          (data.check_kol_schedule_infos = []);
        data.anchorKolList = [];
        data.oprateList = [];
        initKolScheduleInfos();
      }
    });

    const kol_name = (kol_id: number) =>
      originAnchors.value.find(el => el.kol_id === kol_id)?.kol_name;

    initKolScheduleInfos();

    const onSelectUserChanged = (users: number[], index: number) => {
      const scheduleInfo = data.kol_schedule_infos[index];
      scheduleInfo.kol_ids = Array.from(new Set([...(scheduleInfo.importKols || []), ...users]));
    };

    const isAutoObtain = computed(() => {
      // if (props.detailData.allow_update_kol_schedule) {
      //   return false;
      // }
      return false;
      // return props.detailData.compass_shop_live_room_id ? true : false;
    });

    const hasImportKolData = computed(() =>
      data.kol_schedule_infos.find(el => (el.importKols || []).length) ? true : false,
    );
    return {
      onSelectUserChanged,
      dialogTitle,
      conflict_data,
      ...toRefs(data),
      isOptDisabled,
      liveDisplay,
      getKolList,
      deleteAnchor,
      addTimeLine,
      changeDate,
      kolWorkTime,
      changeTime,
      deleteAnchorTime,
      verifyAnchor,
      save,
      closeDialog,
      getLimitTimeSetting,
      scheduleQuery,
      kol_name,
      isAutoObtain,
      hasImportKolData,
    };
  },
});
