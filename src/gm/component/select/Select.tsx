import { ReactFn } from '@/types/base/react';

interface ISelectProps {
  // 下拉选项
  options?: TG.OptionType<unknown>[];
  // 是否显示全部
  showAll?: boolean;
  showAllText?: string;
  placeholder?: string;
  clearable?: boolean;
  filterable?: boolean;
  size?: 'mini';
  class?: string;
  remote?: boolean;
  multiple?: boolean;
}

export const Select: ReactFn<ISelectProps> = (ctx: any) => {
  const { props } = ctx as any;
  const { showAll = false, showAllText = '全部', clearable = true, size, multiple } = props;
  const { on, ...other } = ctx.data;
  const childProps = {
    props: {
      size,
      ...ctx.value,
      clearable,
      multiple,
    },
    on: ctx.listeners,
    ...other,
  };
  return (
    <el-select {...childProps} ref="Select">
      {showAll && <el-option label={showAllText} value={undefined} />}
      {props.options?.map((item: any, key: number) => {
        return (
          <el-option
            disabled={item.disabled}
            key={key + '____' + item.value}
            label={item.label}
            value={item.value}
          />
        );
      })}
    </el-select>
  );
};

Select.props = {
  options: {},
  showAll: {},
  showAllText: {},
  clearable: {},
  multiple: {},
  size: {
    type: String,
    default: () => 'mini',
  },
};
