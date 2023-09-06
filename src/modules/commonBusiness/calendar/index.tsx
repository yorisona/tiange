import { defineComponent, PropType, reactive, ref, set, watch } from '@vue/composition-api';
import { usePermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';
import CalendarCustom, {
  ECalendarType,
  useCalendarConfig,
} from '@/components/CalendarCustom/SideCalendar';
import monent, { Moment } from 'moment';
import MarketDialog from '@/modules/commonBusiness/project/dialog/daily/pressupposition/market.form.vue';
import { useDailyData } from './use';
import { PostSaveCommissionRate } from '@/services/live.project';
import { Message } from 'element-ui';
import limit from '@/utils/inputLimit';
import { CooperationTypeEnum } from '@/types/tiange/common';

const LimitUtils = limit;
export default defineComponent({
  props: {
    query: {
      type: Function as PropType<(begin: number, end: number, project_id: string) => void>,
    },
    save: {
      type: Function as PropType<(data: any) => Promise<any>>,
    },
    type: {
      type: String as PropType<'base' | 'mcn' | 'market'>,
    },
    business_type: {
      type: Number,
    },
    cooperation_type: {
      type: Number as PropType<CooperationTypeEnum>,
    },
    end_date: {
      type: String,
    },
    near_seven_data: {
      type: Boolean,
      default: false,
    },
    itemHeight: {
      type: String as PropType<'32px' | '44px'>,
      default: '32px',
    },
    showRest: {
      type: Boolean,
      default: true,
    },
    showQueryError: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CalendarCustom,
    MarketDialog,
  },
  setup(props, ctx) {
    const permission = usePermission();
    const dailydata = useDailyData(
      {
        save: props.save,
        query: props.query,
      },
      ctx,
    );
    // const restDates = dailydata.list
    //   .map(el => {
    //     if (el.status) {
    //       return `${el.date}`;
    //     }
    //   })
    //   .filter(el => el !== undefined) as string[];
    const config = useCalendarConfig(
      ECalendarType.Week,
      { integerMonth: true },
      props.near_seven_data,
      // props.itemHeight,
      // props.showRest,
    );

    // const config = computed(() => {
    //   const restDates = dailydata.list
    //     .map(el => {
    //       if (el.status) {
    //         return `${el.date}`;
    //       }
    //     })
    //     .filter(el => el !== undefined) as string[];
    //   return useCalendarConfig(
    //     ECalendarType.Week,
    //     { integerMonth: true },
    //     restDates,
    //     props.near_seven_data,
    //   );
    // });

    const router = useRouter();
    const project_id = router.currentRoute.params.id;

    const dialogConfig = reactive({
      visible: false,
      title: '预设净销比例',
      data: {},
      project_id,
    });
    const active = ref();

    const queryAuto = () => {
      const start = Number(config.startTime.format('YYYYMMDD'));
      const end = Number(config.endTime.format('YYYYMMDD'));
      dailydata.query(start, end, project_id, props.showQueryError);
    };
    const add = (num: number) => {
      config.add(num);
      queryAuto();
    };
    const changeCalendarType = (type: ECalendarType) => {
      config.changeCalendarType(type);
      queryAuto();
    };

    const fields = ref({});
    watch(
      () => [props.business_type, config.type, props.cooperation_type],
      () => {
        if (
          props.business_type === 3 &&
          props.cooperation_type === CooperationTypeEnum.selfSupport
        ) {
          fieldMap['gmv'] = {
            field: 'gmv',
            label: '直播间GMV (元)',
            maxLength: 16,
            limit: [limit.NineIntergerAndDecimals],
          };
        } else {
          fieldMap['gmv'] = {
            field: 'gmv',
            label: 'GMV（元）',
            maxLength: 16,
            limit: [limit.NineIntergerAndDecimals],
          };
        }
        initFields();
      },
    );
    const fieldMap: any = {};
    fieldMap['直播时长'] = {
      field: 'live_duration',
      label: '直播时长（时）',
      limit: [limit.NumberRange(0, 100)],
      maxLength: 16,
      format: (value: string) => {
        // 秒转小时
        if (!value) return value;
        //千分位转数字
        if (typeof value === 'string' && value.indexOf(',') > -1) {
          value = value.replace(/,/g, '');
        }
        return (Number(value) / 3600).toFixed(1);
      },
    };
    fieldMap['直播增粉'] = {
      field: 'new_fans_count',
      label: '直播增粉（人）',
      maxLength: 9,
      limit: [limit.Interger],
    };
    fieldMap['uv'] = { field: 'uv', label: 'UV', maxLength: 9, limit: [limit.Interger] };
    fieldMap['最高在线'] = {
      field: 'max_uv',
      label: '最高在线（人）',
      maxLength: 9,
      limit: [limit.Interger],
    };
    fieldMap['停留时长'] = {
      field: 'avg_stay',
      label: '停留时长（秒）',
      maxLength: 16,
      limit: [limit.NineIntergerAndDecimals],
    };

    if (props.business_type === 3 && props.cooperation_type === CooperationTypeEnum.selfSupport) {
      fieldMap['gmv'] = {
        field: 'gmv',
        label: '直播间GMV (元)',
        maxLength: 16,
        limit: [limit.NineIntergerAndDecimals],
      };
    } else {
      fieldMap['gmv'] = {
        field: 'gmv',
        label: 'GMV（元）',
        maxLength: 16,
        limit: [limit.NineIntergerAndDecimals],
      };
    }
    // 淘宝甄选增加视频号GMV
    fieldMap['wechat_video_gmv'] = {
      field: 'wechat_video_gmv',
      label: '视频号GMV（元）',
      maxLength: 16,
      limit: [limit.NineIntergerAndDecimals],
    };
    fieldMap['shop_gmv'] = {
      field: 'shop_gmv',
      label: '小店GMV（元）',
      maxLength: 16,
      limit: [limit.NineIntergerAndDecimals],
    };
    fieldMap['goal_gmv'] = {
      field: 'goal_gmv',
      label: 'GMV目标',
      maxLength: 16,
      limit: [limit.NineIntergerAndDecimals],
      edit: false,
    };
    fieldMap['gmv_percent'] = {
      field: 'gmv_percent',
      label: 'GMV完成度',
      edit: false,
      format: (value: string) => {
        if (value === null || value === undefined || value === '') return value;
        return `${value}%`;
      },
    };
    fieldMap['净销比例'] = {
      field: 'net_sales_rate',
      label: '净销比例（%）',
      maxLength: 6,
      limit: [limit.NumberRange(0, 100)],
      edit: props.business_type !== 8 ? true : false,
      format: (value: string) => {
        if (value === null || value === undefined || value === '') return value;
        return `${value}%`;
      },
    };
    fieldMap['预估净销额'] = {
      field: 'net_sales_amount',
      label: '预估净销额（元）',
      edit: props.business_type !== 8 ? false : true,
    };
    fieldMap['投放金额'] = {
      field: 'promote_amount',
      label: '投放金额（元）',
      maxLength: 16,
      limit: [limit.NineIntergerAndDecimals],
    };
    fieldMap['定向投放'] = {
      field: 'roi',
      label: '定向投放（倍）',
      maxLength: 16,
      limit: [limit.NineIntergerAndDecimals],
    };

    const transformField = (fields: any[]) => {
      return fields.filter(Boolean).map(item => {
        if (fieldMap[item] === undefined) throw new Error(`${item}找不到`);
        return fieldMap[item];
      });
    };
    // 抖音 有 投放投放ROI（倍） 投放金额
    const initFields = () => {
      if (props.type === 'base') {
        fieldMap['净销比例'].edit = props.business_type !== 8 ? true : false;
        fieldMap['预估净销额'].edit = props.business_type !== 8 ? false : true;
        fields.value = transformField([
          (props.business_type === 3 || props.business_type === 7) &&
            props.cooperation_type === CooperationTypeEnum.selfSupport &&
            'shop_gmv',
          'goal_gmv',
          'gmv_percent',
          'gmv',
          props.business_type === 8 && 'wechat_video_gmv',
          (props.business_type === 2 ||
            props.business_type === 3 ||
            props.business_type === 7 ||
            props.business_type === 8) &&
            'uv',
          '直播增粉',
          '最高在线',
          '停留时长',
          '直播时长',
          (props.business_type === 3 || props.business_type === 7) && '投放金额',
          (props.business_type === 3 || props.business_type === 7) && '定向投放',
          /*'净销比例',
          '预估净销额',*/
          props.business_type !== 8 ? '净销比例' : '预估净销额',
          props.business_type !== 8 ? '预估净销额' : '净销比例',
        ]);
      } else if (props.type === 'market') {
        fields.value = [
          {
            field: 'income_amount',
            label: '到账金额（元）',
            maxLength: 16,
            limit: [limit.NineIntergerAndDecimals],
          },
        ];
      } else if (props.type === 'mcn') {
        fields.value = [
          {
            field: 'gmv',
            label: 'GMV（元）',
            maxLength: 16,
            limit: [limit.NineIntergerAndDecimals],
          },
          {
            field: 'operating_amount',
            label: '运营费用（元）',
            maxLength: 16,
            limit: [limit.NineIntergerAndDecimals],
          },
          {
            field: 'live_count',
            label: '直播场次(场)',
            maxLength: 9,
            limit: [limit.Interger],
          },
          {
            field: 'live_duration',
            label: '开播时长（小时）',
            limit: [limit.NineIntergerAndDecimals],
            maxLength: 16,
          },
          {
            field: 'anchor_count',
            label: '开播主播数（人）',
            limit: [limit.Interger],
            maxLength: 9,
          },
        ];
      }
    };
    initFields();
    queryAuto();
    return {
      project_id,
      queryAuto,
      add,
      changeCalendarType,
      permission,
      config,
      dailydata,
      dialogConfig,
      fields,
      active,
    };
  },
  render() {
    const config = this.config;

    const dialogConfig = {
      props: this.dialogConfig,
      on: {
        'dialog:close': () => {
          this.dialogConfig.visible = false;
        },
        saveCommissinRate: (data: any) => {
          PostSaveCommissionRate({
            ...data,
            project_id: this.project_id,
          })
            .then(res => {
              if (res.data.success !== true) {
                throw new Error(res.data.message);
              }
            })
            .then(() => {
              this.dialogConfig.visible = false;
              Message.success('保存成功');
            })
            .then(() => {
              this.queryAuto();
            })
            .catch((ex: Error) => {
              Message.error(ex.message);
            });
        },
        saveSubmit: (ex: any) => {
          return this.dailydata
            .save(ex)
            .then((res: any) => {
              this.queryAuto();
              return res;
            })
            .then((res: any) => {
              if (res.data.error_code === 1001) {
                return;
              }
              Message.success('保存成功');
            })
            .catch((ex: Error) => {
              Message.error(ex.message);
            });
        },
      },
    };
    const MonthsLabel = config.currentDate.format('YYYY年M月');
    const WeekLabel = `${config.startTime.format('YYYY.MM.DD')} ～ ${config.endTime.format(
      'MM.DD',
    )}`;

    const total: any = this.dailydata.total || {};

    return (
      <div class="dailydata page-calendar">
        <div class="operation">
          <div class="left">
            <div class="btn-circle" onClick={() => this.add(-1)}>
              <tg-icon name="ico-arrow-left" />
            </div>
            <div class="btn-circle" onClick={() => this.add(1)}>
              <tg-icon name="ico-arrow-right" />
            </div>
            <div class="calendar-date-range">
              {config.type === ECalendarType.Month ? MonthsLabel : WeekLabel}
            </div>
            <div class="tips" style={{ color: 'var(--text-third-color)' }}>
              日报数据将在每日凌晨通过系统自动填写部分数据 （
              <span style={{ color: '#FF7A36' }}>注：双击单元格编辑日报数据</span>）
            </div>
          </div>
          <div class="right">
            {/* {this.type === 'base' && (
              <div
                class="pre-supposition"
                onclick={() => {
                  dialogConfig.props.visible = true;
                }}
              >
                预设净销比例
              </div>
            )}*/}
            <div class="calendar-type-group">
              <span
                onClick={() => this.changeCalendarType(ECalendarType.Week)}
                class={ECalendarType.Week === this.config.type && 'active'}
              >
                周
              </span>
              <span
                onClick={() => this.changeCalendarType(ECalendarType.Month)}
                class={ECalendarType.Month === this.config.type && 'active'}
              >
                月
              </span>
            </div>
          </div>
        </div>
        {this.business_type === 3 && (
          <div style="padding: 0 0 8px 0; color: #5392FF;">小店GMV包含直播GMV和橱窗GMV</div>
        )}
        <div class="calendar-body">
          <calendar-custom
            config={this.config}
            showRest={this.showRest}
            fields={this.fields}
            restDates={this.dailydata.restDate}
            columsLabel={'指标'}
            scopedSlots={{
              renderTotal: (field: any) => {
                return (
                  <div>
                    {field.format
                      ? field.format(total[field.field])
                      : LimitUtils.Thousands(total[field.field])}
                  </div>
                );
              },
              render: (
                day: Moment,
                {
                  field,
                  edit,
                  maxLength,
                  limit,
                  format = (value: any) => value,
                }: {
                  field: string;
                  edit: boolean;
                  maxLength: number;
                  limit: ((value: string) => string)[] | undefined;
                  format: any;
                },
              ) => {
                const dayFormat = day.format('YYYY.MM.DD');
                const find: any = this.dailydata.find(day);
                let calendarClass =
                  dayFormat === monent().format('YYYY.MM.DD') ? 'calendar-day' : 'calendar-day';
                let inputDisabled = false;
                if (monent().isBefore(day)) {
                  inputDisabled = true;
                }
                if (this.business_type === 2 || this.business_type === 3) {
                  if (monent(this.$props.end_date).isBefore(day)) {
                    inputDisabled = true;
                  }
                }
                if (inputDisabled) {
                  return <div class={`${calendarClass} empty`} />;
                }
                if (edit === false) {
                  calendarClass = `${calendarClass} disable`;
                }

                if (find !== undefined) {
                  const isShowInput = !!find[`edit_${field}`];
                  if (`${field}_${find.date}` === this.active && !isShowInput) {
                    calendarClass = `${calendarClass} active`;
                  }
                  // console.log('fild', field, find[field], find);
                  return (
                    <div
                      onClick={() => {
                        this.active = `${field}_${find.date}`;
                      }}
                      onDblclick={(evt: { target: HTMLElement }) => {
                        if (edit === false) return;
                        set(find, `edit_${field}`, true);
                        this.$nextTick(() => {
                          evt.target.querySelector('input')?.focus();
                        });
                      }}
                      class={calendarClass}
                    >
                      <span class="show-txt" v-show={!find[`edit_${field}`]}>
                        {format(LimitUtils.Thousands(find[field]))}
                      </span>
                      <el-input
                        maxLength={maxLength}
                        onBlur={() => {
                          this.active = '';
                          set(find, `edit_${field}`, false);
                          dialogConfig.on.saveSubmit({
                            ...find,
                            [field]: find[field],
                          });
                        }}
                        v-show={find[`edit_${field}`]}
                        value={find[field]}
                        onInput={(evt: string) => {
                          let newValue = evt;
                          if (limit) {
                            limit.forEach((fun: any) => {
                              newValue = fun(newValue);
                            });
                          }
                          set(find, field, newValue);
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div class={calendarClass}>
                      <span class="show-txt"></span>
                    </div>
                  );
                }
              },
            }}
          />
        </div>
        <market-dialog {...dialogConfig} />
      </div>
    );
  },
});
