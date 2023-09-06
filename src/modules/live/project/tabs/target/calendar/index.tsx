import { computed, defineComponent, ref, set } from '@vue/composition-api';
import { usePermission } from '@/use/permission';
import CalendarCustom, {
  ECalendarType,
  useCalendarConfig,
} from '@/components/CalendarCustom/SideCalendar';
import MarketDialog from '@/modules/commonBusiness/project/dialog/daily/pressupposition/market.form.vue';
import limit from '@/utils/inputLimit';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { TargetEditType, useTarget } from '@/modules/live/project/tabs/target/useTarget';
import { formatAmount } from '@/utils/string';
import { Message } from 'element-ui';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const LimitUtils = limit;
export default defineComponent({
  components: {
    CalendarCustom,
    MarketDialog,
  },
  setup(props, ctx) {
    const { business_type: project_business_type } = useProjectBaseInfo();
    const target = useTarget(undefined, project_business_type.value);
    const permission = usePermission();
    const config = useCalendarConfig(ECalendarType.Year, { integerMonth: true });
    const active = ref();
    const fields = computed(() => {
      const result = [
        {
          field: 'goal_value',
          label: 'GMV目标 (元)',
          limit: [limit.IntergerAndDecimals],
        },
        target.isEdit !== TargetEditType.MONTH && {
          field: 'gmv',
          label: 'GMV (元)',
          limit: [limit.IntergerAndDecimals],
        },
        target.isEdit !== TargetEditType.MONTH && {
          field: 'complete_rate',
          label: 'GMV完成度',
          limit: [limit.IntergerAndDecimals],
        },
        {
          field: 'net_sales_goal_value',
          label: '净销额目标 (元)',
          limit: [limit.IntergerAndDecimals],
        },
      ].filter(Boolean);
      // if (target.isEdit !== TargetEditType.MONTH) {
      //   result.push(
      //     // {
      //     //   field: 'gmv',
      //     //   label: 'GMV (元)',
      //     //   limit: [limit.IntergerAndDecimals],
      //     // },
      //     {
      //       field: 'complete_rate',
      //       label: 'GMV完成度',
      //       limit: [limit.IntergerAndDecimals],
      //     },
      //     {
      //       field: 'net_sales_goal_value',
      //       label: '净销额目标 (元)',
      //       limit: [limit.IntergerAndDecimals],
      //     },
      //   );
      // }
      return result;
    });
    const isGoalInputChange = ref(false);
    const isSalesInputChange = ref(false);
    const isEdit = ref(false);

    const findmonth = (day: number): any | undefined => {
      return target.monthData.find(item => item.name === day + '月');
    };
    const getAllValue = (label: string, is_no_thousands = true): any | undefined => {
      let sub: any = null;
      target.monthData.map((item: any) => {
        sub = sub || 0;
        if (item[label]) {
          sub = sub + Number(item[label]);
        }
      });
      if (sub) {
        if (is_no_thousands) {
          return AmountInput(String(sub));
        } else {
          return sub;
        }
      } else {
        return '';
      }
    };
    const AmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,18})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
      return LimitUtils.Thousands(result);
    };
    //完成比例
    const AmountOneInput = (value: any) => {
      const str = String(value || '');
      const result = (/(?:0|[1-9]\d{0,18})(?:\.\d{0,1})?/u.exec(
        str.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
      return result + '%';
    };
    const onColumnClick = (month: number) => {
      // selectedMonth.value = month;
      target.changeMonth(month);
      console.log('onColumnClick', month);
    };

    return {
      target,
      isEdit,
      isSalesInputChange,
      isGoalInputChange,
      AmountOneInput,
      AmountInput,
      getAllValue,
      findmonth,
      permission,
      config,
      fields,
      active,
      onColumnClick,
    };
  },
  methods: {
    validateInput(inputValue: string) {
      // 只允许输入数字和一个小数点
      let value = inputValue.replace(/[^\d.]/g, '');
      value = value.replace(/\./, 'x').replace(/\./g, '').replace(/x/, '.');
      // 如果第一位是小数点，则自动补全 0
      if (value && value[0] === '.') {
        value = '0' + value;
      }
      // 如果有多个连续的 0，则只保留一个 0
      value = value.replace(/\b(0+)/gi, '0');
      // 如果以 0 开头且不是小数，则不能再输入数字
      if (value && value[0] === '0' && value.indexOf('.') === -1) {
        value = '';
      }
      // 最多只能输入一个小数点和两位小数
      const pointIndex = value.indexOf('.');
      if (pointIndex !== -1) {
        const integerPart = value.slice(0, pointIndex);
        const decimalPart = value.slice(pointIndex + 1);
        value = integerPart + '.' + decimalPart.slice(0, 2);
      }
      return value;
    },
    renderYear() {
      const { target } = this;
      return (
        <div class={`total-target ${target.isEdit === TargetEditType.YEAR ? 'edit' : ''}`}>
          <div>年度GMV目标：</div>
          <div>
            {target.isEdit === TargetEditType.YEAR ? (
              <el-input
                size="mini"
                value={target.yearData.goal_value}
                onInput={(val: string) => {
                  target.hasChangeData = true;
                  set(target.yearData, 'goal_value', limit.IntergerAndDecimals(val));
                }}
              />
            ) : target.yearData.goal_value ? (
              `¥ ${formatAmount(target.yearData.goal_value, 'None')}`
            ) : (
              target.yearData.goal_value
            )}
          </div>
          <div>年度净销额目标：</div>
          <div>
            {target.isEdit === TargetEditType.YEAR ? (
              <el-input
                size="mini"
                value={target.yearData.net_sales_goal_value}
                onInput={(val: string) => {
                  target.hasChangeData = true;
                  set(target.yearData, 'net_sales_goal_value', limit.IntergerAndDecimals(val));
                }}
              />
            ) : target.yearData.net_sales_goal_value ? (
              `¥ ${formatAmount(target.yearData.net_sales_goal_value, 'None')}`
            ) : (
              target.yearData.net_sales_goal_value
            )}
          </div>
        </div>
      );
    },
    renderMonth() {
      const { target } = this;
      if (target.isEdit === TargetEditType.YEAR) return;
      return (
        <div class="calendar-body">
          <calendar-custom
            selectedMonth={target.currentMonth}
            selectedAbled={true}
            config={this.config}
            fields={this.fields}
            on-columnClick={this.onColumnClick}
            scopedSlots={{
              renderTotal: (field: any) => {
                let value: any = '';
                if (field.field === 'complete_rate') {
                  const gmv = Number(this.getAllValue('gmv', false) || 0);
                  const goal_value = Number(this.getAllValue('goal_value', false) || 0);
                  if (gmv && goal_value && Number(goal_value) !== 0) {
                    value = this.AmountOneInput((gmv * 100) / goal_value);
                  }
                } else {
                  value = this.getAllValue(field.field);
                }
                return <div>{value}</div>;
              },
              render: (
                month: number,
                {
                  field,
                  maxLength,
                  limit,
                  format = (value: any) => value,
                }: {
                  field: string;
                  maxLength: number;
                  limit: ((value: string) => string)[] | undefined;
                  format: any;
                },
              ) => {
                let find: any = this.findmonth(month);
                let calendarClass = 'calendar-day';
                if (find === undefined) {
                  find = {
                    name: month + '月',
                    goal_value: null,
                    net_sales_goal_value: null,
                  };
                }
                if (!find['complete_rate']) {
                  if (find['gmv'] && find['goal_value']) {
                    const gmv = Number(find['gmv']);
                    const goal_value = Number(find['goal_value']);
                    if (goal_value !== 0) {
                      find['complete_rate'] = this.AmountOneInput(String((gmv * 100) / goal_value));
                    }
                  }
                }
                // const isShowInput = !!find[`edit_${field}`];
                if (`${field}_${find.name}` === this.active) {
                  calendarClass = `${calendarClass} active`;
                }
                return (
                  <div
                    onDblclick={(evt: { target: HTMLElement }) => {
                      console.log('onDblclick', field, target, evt);

                      // if (target.isEdit !== TargetEditType.MONTH) return;
                      if (field !== 'net_sales_goal_value') return;
                      this.active = `${field}_${find.name}`;
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
                      onBlur={async () => {
                        this.active = '';
                        let newValue = find[field];
                        if (newValue) {
                          const arr = String(newValue).split('');
                          if (arr.length > 0 && arr[arr.length - 1] === '.') {
                            arr.pop();
                          }
                          newValue = arr.join('');
                          set(find, field, newValue);
                          try {
                            await target.SaveMonth();
                            // await target.queryYear();
                            target.isEdit = null;
                            Message.success('保存成功');
                          } catch (e: any) {
                            Message.error(e.message);
                          } finally {
                            target.queryYear();
                          }
                        }
                        set(find, `edit_${field}`, false);
                      }}
                      v-show={find[`edit_${field}`]}
                      value={find[field]}
                      onInput={(evt: string) => {
                        // 只能输入正整数及小数点
                        // evt = this.validateInput(evt);
                        let newValue = evt;
                        if (limit) {
                          limit.forEach((fun: any) => {
                            newValue = fun(newValue);
                          });
                        }
                        if (Number(newValue) > 1000000000) {
                          let newstr = String(newValue);
                          newstr = newstr.slice(0, newstr.length - 1);
                          newValue = newstr;
                        }
                        if (field === 'goal_value' && newValue) {
                          this.isGoalInputChange = true;
                        }
                        if (field === 'net_sales_goal_value' && newValue) {
                          this.isSalesInputChange = true;
                        }
                        this.isEdit = true;
                        set(find, field, newValue);
                      }}
                    />
                  </div>
                );
              },
            }}
          />
        </div>
      );
    },
  },
  render() {
    const { target } = this;
    return (
      <div
        class="dailydata page-calendar"
        style={target.isEdit !== null ? 'margin-top:16px' : 'margin-top:26px'}
      >
        <div class="operation">
          <div class="titlediv">
            <span />
            店铺目标
          </div>
          {this.isEdittarget && this.indexnew === 0 && (
            <span>
              （
              <span style={{ color: '#FF7A36' }}>
                注：双击月目标单元格更改月目标数据，日目标编辑可以通过回车键快速切换日期
              </span>
              ）
            </span>
          )}
        </div>
        {this.renderYear()}
        {this.renderMonth()}
      </div>
    );
  },
});
