/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2020-12-15 13:40:33
 */
/**
 * 临时写个可用的表格列设置
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 14:36:19
 */

import { ElementUIHorizontalAlignment } from 'element-ui/types/component';
import { PopoverPlacement } from 'element-ui/types/popover';
import { SortOrders, TableColumnFilter, TableColumnFixedType } from 'element-ui/types/table-column';
import { CreateElement } from 'vue';

/**
 * 自定义渲染函数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 10:10:11
 */
export type TableColumnFormatter<T> = (
  row: T,
  column: TableColumn<T>,
  value: any,
  $index: number,
) => any;

/**
 * 支持泛型的 element-ui table column interface
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 10:07:30
 */
export interface TableColumn<T extends Record<string, any>> {
  /** 验真失败原因*/
  verified_desc?: string;
  /** 验真状态*/
  is_verified?: number | boolean;
  /** 类型 */
  type?: 'selection' | 'index' | 'expand' | 'default';
  /** 索引 */
  index?: number;
  /** 显示的标题 */
  label?: string;
  /** 字段名 alias of property */
  prop?: keyof T;
  /** 字段名 */
  property?: keyof T;
  /** column 的 key */
  columnKey?: string;
  /** 宽度 */
  width?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 是否固定列 */
  fixed?: boolean | TableColumnFixedType;
  /** 是否可排序 */
  sortable?: boolean | 'custom';
  /** 排序方法 */
  sortMethod?: (a: any, b: any) => number;
  /** 排序策略的轮转顺序 */
  sortOrders?: SortOrders[];
  /** 是否可拖拽改变列宽 */
  resizable?: boolean;
  /** 自定义列渲染函数 */
  formatter?: TableColumnFormatter<T> | string;
  /** 内容过长被隐藏时显示 tooltip */
  showOverflowTooltip?: boolean;
  /** 内容对齐方式 */
  align?: ElementUIHorizontalAlignment;
  /** 表头内容对齐方式 */
  headerAlign?: ElementUIHorizontalAlignment;
  /** 列类名 */
  className?: string;
  /** 列(表头)类名 */
  labelClassName?: string;
  /** 复选框列是否可选函数 */
  selectable?: (row: T, index: number) => boolean;
  /** 数据更新之后是否保留选中数据(需指定row-key) */
  reserveSelection?: boolean;
  /** 数据过滤选项 */
  filters?: TableColumnFilter[];
  /** 过滤弹出框定位 */
  filterPlacement?: PopoverPlacement;
  /** 数据过滤是否多选 */
  filterMultiple?: boolean;
  /** 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示 */
  filterMethod?: (value: any, row: T) => boolean;
  /** 选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性 */
  filteredValue?: TableColumnFilter[];
  renderHeader?: (
    h: CreateElement,
    { column, $index }: { column: TableColumn<T>; $index: number },
  ) => any;
}

export interface TgTableColumn<T> extends TableColumn<T> {
  minWidth?: number | string;
  dataType?: IDataTypeEnum | IDataType;
  'show-overflow-tooltip'?: boolean;
  showOverflowTooltip?: boolean;
}
export type IDataTypeEnum = 'money' | 'text' | 'number' | 'enum' | 'date' | 'datetime';
export interface IDataType {
  type?: IDataTypeEnum;
  // 字符串前缀
  prefix?: string;
  // 字符串追加后缀
  suffix?: string;
  // 是否进行空处理,默认为true 显示 --
  empty?: boolean;
  // 数字单位处理, 设置后默认按分处理
  unit?: number;
  // 是否保留2位小数
  toFixed?: number;
  [key: string]: any;
}
