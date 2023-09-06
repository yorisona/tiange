export * from './use';
import { defineComponent, PropType, computed } from '@vue/composition-api';
import moment, { Moment } from 'moment';
import './index.less';
import { ICalendarConfig, ECalendarType } from './use';

const WeekDayMap = ['日', '一', '二', '三', '四', '五', '六'];

export default defineComponent({
  name: 'CalendarCustom',
  props: {
    config: {
      type: Object as PropType<ICalendarConfig>,
      default: () => {
        return {
          itemHeight: '32px',
        };
      },
    },
    fields: {
      type: Array as PropType<{ field: string; label: string }[]>,
      default: () => [],
    },
    columsLabel: {
      type: String,
    },
    restDates: {
      type: Array as PropType<string[]>,
    },
    selectedAbled: {
      type: Boolean,
      default: false,
    },
    selectedMonth: {
      type: Number,
      default: undefined,
    },
    showRest: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const today = moment();
    const onCellClick = (month: number) => {
      if (!props.selectedAbled) {
        return;
      }
      ctx.emit('columnClick', month);
    };
    return {
      onCellClick,
      today,
    };
  },
  methods: {
    renderCalendarTd(day: Moment, field: { label: string; field: string }) {
      const $scopedSlots: any = this.$scopedSlots;
      return $scopedSlots?.render(day, field);
    },
    renderCalendarYearTd(day: number, field: { label: string; field: string }) {
      const $scopedSlots: any = this.$scopedSlots;
      return $scopedSlots?.render(day, field);
    },
    renderCalendarTotal(field: { label: string; field: string }) {
      const $scopedSlots: any = this.$scopedSlots;
      return $scopedSlots?.renderTotal(field);
    },
  },
  render() {
    const { range, currentDate, type } = this.config;
    const { showRest } = this;
    const restDate = computed(() => this.restDates ?? []);
    const _range: Moment[] = [];
    let rangeYears: number[] = [];
    if (type === 2) {
      rangeYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    } else {
      if (range.length < 2) return <div />;
      const start = range[0].clone();
      const end = range[1].clone();
      while (start.isSameOrBefore(end)) {
        _range.push(start.clone());
        start.add(1, 'days');
      }
    }
    const currentMonth = currentDate.month();
    const style = {
      gridTemplateRows:
        this.config.type === 2
          ? `32px repeat(${this.fields.length}, 32px)`
          : `36px repeat(${this.fields.length}, 32px)`,
      padding: this.config.type === 2 ? '0 149px 0 99px' : '0 150px 0 134px',
    };
    const headerstyle = {
      gridTemplateRows:
        this.config.type === 2 ? '32px repeat(auto-fit, 32px)' : '36px repeat(auto-fit, 32px)',
      width: this.config.type === 2 ? '100px' : '135px',
      color: 'var(--text-color)',
    };
    return (
      <div class="tg-calendar-custom-side">
        <div class="calendar-header calendar-header-left" style={headerstyle}>
          {this.config.type === 2 ? (
            <div
              class="tg-calendar-custom-th"
              style="width:100px;height:32px;line-height:32px;text-align:center;font-weight: 600;font-size:12px;background:#F6F6F6;border-right:1px solid var(--table-border-color)"
            >
              月份
            </div>
          ) : (
            <div
              class="tg-calendar-custom-th calendar-header-side calendar-header-angle"
              style="color:var(--text-color);height:36px;line-height:36px;background:#F6F6F6;border-right:1px solid var(--table-border-color)"
            >
              <span class="calendar-header-angle-columns">{this.columsLabel}</span>
              <span class="calendar-header-angle-row">日期</span>
            </div>
          )}
          {this.fields.map((item, key) => {
            return (
              <div
                class="tg-calendar-custom-td calendar-header-side"
                style={
                  this.config.type === 2
                    ? 'width:100px;padding-left:0px;min-width: 100px;'
                    : 'width:134px;padding-left:18px'
                }
                key={key}
              >
                <div
                  class="tg-calendar-custom-day"
                  style={
                    this.config.type === 2 ? 'width:100%;text-align: center;font-weight: 600;' : ''
                  }
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        <div class="calendar-body" style={style}>
          {(ECalendarType.Week === type || ECalendarType.Month === type) &&
            _range.map((item, index) => {
              const tdClass = `tg-calendar-custom-td ${
                ECalendarType.Month === type && item.month() !== currentMonth ? 'other-month' : ''
              }`;
              return (
                <fragments key={`range${index}`}>
                  <div class="tg-calendar-custom-th calendar-header-top" style="background:#F6F6F6">
                    <span class="day">{item.date()}</span>
                    {ECalendarType.Week === type && (
                      <span class="week">周{WeekDayMap[item.day()]}</span>
                    )}
                  </div>
                  {this.fields.map((field, key2) => {
                    let findDate = undefined;
                    if (showRest) {
                      findDate = restDate.value.find(el => {
                        return item.format('MM-DD') === el;
                      });
                    }
                    if (!findDate) {
                      return (
                        <div class={tdClass} key={`${index}field${key2}`}>
                          {this.renderCalendarTd(item, field)}
                        </div>
                      );
                    } else if (key2 === 0) {
                      return (
                        <div
                          style={`grid-row: 2/${this.fields.length + 2};`}
                          class={`${tdClass} rest`}
                          key={`${index}field${key2}`}
                        >
                          <div>休</div>
                        </div>
                      );
                    }
                  })}
                </fragments>
              );
            })}
          {ECalendarType.Year === type &&
            rangeYears.map((item, index) => {
              const tdClass = 'tg-calendar-custom-td';
              let headerStyle = 'min-width:115px; background: #F6F6F6;';
              let cellStyle = 'min-width:115px;';
              if (this.selectedAbled) {
                if (this.selectedMonth + 1 === item) {
                  headerStyle =
                    'min-width:115px; background: var(--table-current-row-bg-color); cursor: pointer;';
                  cellStyle =
                    'min-width:115px; background: var(--table-current-row-bg-color); cursor: pointer;';
                } else {
                  headerStyle = 'min-width:115px; background: #F6F6F6; cursor: pointer;';
                  cellStyle = 'min-width:115px; cursor: pointer;';
                }
              } else {
                headerStyle = 'min-width:115px; background: #F6F6F6;';
                cellStyle = 'min-width:115px;';
              }
              return (
                <fragments key={`range${index}`}>
                  <div
                    class="tg-calendar-custom-th calendar-header-top"
                    style={headerStyle}
                    on-click={() => this.onCellClick(item - 1)}
                    // selected={this.selectedMonth === item}
                  >
                    <span style="font-size: 12px; color: var(--text-color);font-weight:600;background: transparent;">
                      {item}月
                    </span>
                  </div>
                  {this.fields.map((field, key2) => {
                    return (
                      <div
                        class={tdClass}
                        style={cellStyle}
                        key={`${index}field${key2}`}
                        on-click={() => this.onCellClick(item - 1)}
                      >
                        {this.renderCalendarYearTd(item, field)}
                      </div>
                    );
                  })}
                </fragments>
              );
            })}
          {/* {ECalendarType.Month === type && (
            <div class="tg-calendar-custom-th" style={{ width: '150px' }}></div>
          )}*/}
        </div>
        <div
          class="calendar-header calendar-header-right"
          style={
            this.config.type === 2
              ? 'width:151px;  box-shadow: -1px 0 5px 0 rgba(0, 0, 0, 0.1);grid-template-rows: 32px repeat(auto-fit, 32px);'
              : 'grid-template-rows: 36px repeat(auto-fit, 32px)'
          }
        >
          <div
            class="tg-calendar-custom-th calendar-header-side "
            style={
              this.config.type === 2
                ? 'padding-right: 0px; text-align: center;display: inline-block;line-height: 32px;height: 32px;padding-left: 0px;  width: 150px;font-size:12px;background:#F6F6F6;width: 100%;text-align: center; justify-content: center;'
                : 'line-height: 36px;height: 36px;padding-right: 9px;font-size:12px;background:#F6F6F6;width: 100%;text-align: center; justify-content: center;'
            }
          >
            合计
          </div>
          {this.fields.map((item, key) => {
            return (
              <div
                class="tg-calendar-custom-td calendar-header-side"
                style={this.config.type === 2 ? 'padding-right: 15px' : 'padding-right: 9px'}
                key={key}
              >
                {this.renderCalendarTotal(item)}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
