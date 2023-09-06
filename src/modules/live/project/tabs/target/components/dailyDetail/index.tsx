import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { formatAmount } from '@/utils/string';
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  set,
} from '@vue/composition-api';
import { ElInput } from 'element-ui/types/input';
import limit from '@/utils/inputLimit';
import { TargetEditType, useTarget } from '@/modules/live/project/tabs/target/useTarget';
import icon_check from '@/assets/img/icon_check.png';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

interface ICellConfig {
  type: string;
  field: string;
  label?: string;
  limit?: TG.anyFunc[];
}

export default defineComponent({
  setup(props, ctx) {
    const { business_type: project_business_type } = useProjectBaseInfo();
    const target = useTarget(undefined, project_business_type.value);
    const headerItems = computed(() => {
      const result: ICellConfig[] = [
        { type: 'Date', label: '日期', field: '' },
        {
          type: 'Input',
          field: 'goal_value',
          label: 'GMV目标 (元)',
          limit: [limit.IntergerAndDecimals],
        },
        target.isEdit !== TargetEditType.DAY && {
          type: 'Input',
          field: 'gmv',
          label: 'GMV (元)',
          limit: [limit.IntergerAndDecimals],
        },
        target.isEdit !== TargetEditType.DAY && {
          type: 'Percent',
          field: 'percent',
          label: 'GMV完成度',
        },
        {
          type: 'Input',
          field: 'net_sales_goal_value',
          label: '净销额目标 (元)',
          limit: [limit.IntergerAndDecimals],
        },
      ].filter(Boolean) as ICellConfig[];

      // if (target.isEdit !== TargetEditType.DAY) {
      //   // result.push({
      //   //   type: 'Input',
      //   //   field: 'gmv',
      //   //   label: 'GMV (元)',
      //   //   limit: [limit.IntergerAndDecimals],
      //   // });
      //   result.push({
      //     type: 'Percent',
      //     field: 'percent',
      //     label: 'GMV完成度',
      //   });
      //   result.push({
      //     type: 'Input',
      //     field: 'net_sales_goal_value',
      //     label: '净销额目标 (元)',
      //     limit: [limit.IntergerAndDecimals],
      //   });
      // }
      return result;
    });
    const editIndex = ref<number | undefined>(undefined);
    const editField = ref<string>();

    const methods = {
      onDblclick(day: number, field: string) {
        editIndex.value = day;
        editField.value = field;
        nextTick(() => {
          targetInputRef.value?.focus();
        });
      },
      onKeyup(keyCode: number, index = 1) {
        if (keyCode === 13) {
          editIndex.value = (editIndex.value ?? 0) + 1;
          nextTick(() => {
            targetInputRef.value?.focus();
          });
        }
      },
      onWindowClick(event: any) {
        if (event.target?.tagName?.toUpperCase() === 'INPUT') {
          return;
        }
        editIndex.value = undefined;
      },
      /* 导入的数据刷新*/
      percentColorStyle(val: number | null | undefined) {
        if (!val) {
          return 'color: #ED3434;';
        } else if (val < 40) {
          return 'color: ##ED3434;';
        } else if (val < 100) {
          return 'color: var(--warning-color);';
        } else {
          return 'color: #20BF55;';
        }
      },
    };

    const targetInputRef = ref<ElInput | undefined>(undefined);
    onMounted(() => {
      window.addEventListener('click', methods.onWindowClick);
    });
    onUnmounted(() => {
      window.removeEventListener('click', methods.onWindowClick);
    });
    return {
      target,
      headerItems,
      editIndex,
      targetInputRef,
      editField,
      // editDaysData,
      ...methods,
    };
  },
  methods: {
    typeCalibration(value: string) {
      const result = (/(?:0|[1-9]\d{0,18})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
      return result ? result : null;
    },
    renderCell(config: ICellConfig, day: number) {
      const { target } = this;
      const endDay = target.currentDate.endOf('month').date();
      const method: any = this[`render${config.type}`];
      if (day >= endDay && config.type !== 'Rest') return <div />;
      return method.apply(this, [config, day]);
    },
    renderInput(config: ICellConfig, day: number) {
      const { target } = this;
      const data: Record<any | null, any> = target.daysData[day];
      if (!data) return <div />;
      const value = data[config.field];
      const formatValue = isNaN(value)
        ? value
        : Number(value) === 0
        ? value
        : formatAmount(value, 'None');

      if (target.isEdit === TargetEditType.DAY) {
        if (this.editIndex !== day || this.editField !== config.field) {
          return (
            <div class="show-txt" onDblclick={() => this.onDblclick(day, config.field)}>
              {formatValue}
            </div>
          );
        }
        return (
          <div>
            <el-input
              class="target-input"
              size="small"
              ref="targetInputRef"
              value={value}
              onInput={(val: string) => {
                target.hasChangeData = true;
                set(data, config.field, this.typeCalibration(val));
              }}
            />
          </div>
        );
      }

      return <div class="show-txt">{formatValue}</div>;
    },
    renderDate(config: ICellConfig, day: number) {
      const { target } = this;
      return <div>{`${target.currentMonth + 1}月${day + 1}日`}</div>;
    },
    renderPercent(config: ICellConfig, day: number) {
      const { target, percentColorStyle } = this;
      const currentData = target.daysData[day];
      if (!currentData) return;
      let value = (currentData as any)[config.field];
      if (value === null || value === undefined) return <div>{value}</div>;
      value = Number(value);
      if (value === 0) return <div class="show-txt">{value}</div>;

      const color = percentColorStyle(value);
      return (
        <div class="show-txt complete-percent" style={color}>
          {value >= 100 && <img src={icon_check} />}
          {formatAmount(value, 'None')}%
        </div>
      );
    },
    renderRest(config: ICellConfig, day: number) {
      const { target } = this;
      const currentData = target.daysData[day];
      if (!currentData) return;
      if (currentData.is_rest_day) {
        if (target.isEdit !== TargetEditType.DAY) {
          return <div class="rest">休</div>;
        } else {
          return <div class="rest small">休</div>;
        }
      }
    },
  },
  render() {
    const { target, headerItems, renderCell } = this;
    const cellArr = Array.from({ length: 36 });
    if (target.isEdit === TargetEditType.YEAR || target.isEdit === TargetEditType.MONTH) {
      return <div />;
    }
    return (
      <div class="target-daily-detail-container">
        <div class="table-header-left">
          {Array.from({ length: 3 }).map(() => {
            return (
              <div class="cell">
                <div class="context">
                  {headerItems.map(item => {
                    return <div>{item.label}</div>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div class="table-body">
          {cellArr.map((_, day) => {
            return (
              <div class="cell">
                <div class="context 123">
                  {headerItems.map(item => renderCell(item, day))}
                  {/** 设置休息日 */}
                  {renderCell({ type: 'Rest', field: '' }, day)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
