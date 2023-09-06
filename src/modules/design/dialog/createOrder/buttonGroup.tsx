// ButtonGroup.tsx

import { defineComponent, PropType } from '@vue/composition-api';
import './buttonGroup.less';

export default defineComponent({
  name: 'ButtonGroup',
  props: {
    /** 按钮数据源 */
    buttons: {
      type: Array as PropType<any[]>,
      required: true,
    },
    /** 数据格式 */
    dataFormat: {
      type: Object as PropType<{ label: string; value: string; subtitle: string }>,
      default: () => ({ label: 'label', value: 'value', subtitle: 'subtitle' }),
    },
    //** 数据绑定格式支持数组多选 */
    value: {
      type: [String, Number, Array],
      required: true,
    },
    gap: {
      type: String,
      default: '10px',
    },
    /** 是否自动填充 */
    autoFill: {
      type: Boolean,
      default: false,
    },
    /** group样式  */
    groupStyle: {
      type: String,
      default: '',
    },
    /** label样式 */
    labelStyle: {
      type: String,
      default: 'font-size: 14px;',
    },
  },
  setup: (props, { emit }) => {
    console.log(props.buttons, 'buttons');

    const handleClick = (value: string | number) => {
      console.log(props.value, Array.isArray(props.value), 'ssss');
      if (Array.isArray(props.value)) {
        if (props.value.includes(value)) {
          emit(
            'input',
            props.value.filter((item: any) => item !== value),
          );
        } else {
          emit('input', [...props.value, value]);
          emit('change', [...props.value, value]);
        }
        return;
      }
      emit('input', value);
      emit('change', value);
    };

    return () => (
      <div class="button-group-20230323" style={props.groupStyle}>
        {props.buttons.map(button => (
          <div
            key={button[props.dataFormat.value]}
            class={{
              // selected: button[props.dataFormat.value] === props.value,
              selected:
                (Array.isArray(props.value)
                  ? props.value.includes(button[props.dataFormat.value])
                  : button[props.dataFormat.value] === props.value) || button['required'],
              'button-item': true,
              'button-item-required': button['required'],
            }}
            style={{
              flex: props.autoFill && 1,
              marginRight: props.gap,
            }}
            onClick={() => !button['required'] && handleClick(button[props.dataFormat.value])}
          >
            <div class="label" style={props.labelStyle}>
              {button[props.dataFormat.label]}
            </div>
            {/* 子标题 */}
            {button[props.dataFormat.subtitle] && (
              <div class="subtitle">{button[props.dataFormat.subtitle]}</div>
            )}
            <div
              v-show={
                (Array.isArray(props.value) &&
                  props.value.includes(button[props.dataFormat.value])) ||
                button['required']
              }
              class="status-box"
            >
              <span class="status correct"></span>
            </div>
          </div>
        ))}
      </div>
    );
  },
});
