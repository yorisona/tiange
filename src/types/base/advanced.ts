/**
 * 扩展的类型声明
 * Type / Interface / Enum
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 15:50:14
 */
import { StringArray } from './base';
export * from './base';

/**
 * YesOrNo 布尔值枚举
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 15:50:14
 * @prop YES 1 是/允许
 * @prop NO 0 否/禁止/不允许
 */
export enum BooleanType {
  YES = 1, // 是/允许
  NO = 0, // 否/禁止/不允许
}

/**
 * 计时器变量
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-07 21:10:08
 */
export type Timer = number | undefined;

/**
 * 用于表单项的日期类型
 * 允许为空字符串，表示无数据
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-26 09:27:33
 */
export type FormDateField = Date | '';

/**
 * 上传数据
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-17 09:50:14
 */
export interface UploadData {
  host: string;
  data: any;
  url: string;
}

/**
 * 时间相关字段
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-20 15:24:31
 * @prop {number} create_time 创建时间
 * @prop {number} update_time 更新时间
 */
export interface TimeFields {
  /** 创建时间 */
  create_time: number;
  /** 更新时间 */
  update_time: number;
}

/**
 * 时间相关字段
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-20 15:25:12
 */
export type PartialTimeFields = Partial<TimeFields>;

/**
 * 时间字段 - 创建时间/修改时间
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-19 13:11:16
 */
export interface GmtTimeFields {
  /** 创建时间 */
  gmt_create: DateStr;
  /** 修改时间 */
  gmt_modified: DateStr;
}

/**
 * 创建人 / 修改人
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-19 13:13:02
 */
export interface RecordOperatorFields {
  /** 修改人 */
  modified_by: number;
  /** 创建人 */
  add_by: number;
}

/**
 * 基础树节点
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-20 16:20:15
 */
export interface TNode {
  id: number;
  pid: number;
}

/**
 * 级联树节点
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-22 20:11:10
 */
export interface CascaderTNode extends TNode {
  value: StringArray;
  label: string;
  loading?: boolean;
}

/**
 * 泛型树类型
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-20 17:01:40
 */
export type Tree<T extends TNode = TNode> = T & { children?: Tree<T>[] | T[] | [] };

/**
 * 泛型级联树类型
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-22 20:12:03
 */
export type CascaderTree<CT extends CascaderTNode> = Tree<CT>;

/**
 * 二维平面坐标 [ x, y ]
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-25 17:05:18
 */
export type Point = [number, number];

export type Rect = Point;

/** 由两个点组成的区间 */
export type PointInterval = [number, number];

/**
 * 二维平面线坐标
 * 起点(x1, y1)和终点(x2, y2)
 * [x1, y1, x2, y2]
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-25 17:09:20
 */
export type LinePoints = [number, number, number, number];

/**
 * RGB数组 [ red, green, blue ]
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-25 17:06:42
 */
export type RGB = [number, number, number];

/**
 * 时间(接口返回)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 20:10:05
 */
export type DateStr = string;

/**
 * 选项类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-10 15:50:50
 */
export type OptionType<T = unknown> = TG.OptionType<T>;
