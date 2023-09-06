import { HttpResponse, ListResponse } from '@/types/base/http';
import { IGPageQuery } from '@/types/tiange/general';
import { TgTableColumn } from '@/types/vendor/column';

declare global {
  namespace TG {
    // 空函数
    interface emptyFunc {
      (): void;
    }

    // 任意函数
    interface anyFunc {
      (...args: any): any;
    }

    interface TFunc<T> {
      (...args: any): T;
    }

    // 下拉框选项
    interface OptionType<T = unknown> {
      label: string;
      value: T;
      disabled?: boolean;
      [key: string]: unknown;
    }

    // 获取接口返回的数据类型
    type HttpResultType<T> = T extends (...rest: any[]) => Promise<HttpResponse<infer R>>
      ? R
      : never;

    // 获取列表接口返回的数据类型
    type HttpListResultType<T> = T extends (...rest: any[]) => Promise<ListResponse<infer R>>
      ? R
      : never;
    // 获取函数第一个参数
    type ParameterFirst<T extends (...args: any) => any> = T extends (args: infer P) => any
      ? P
      : never;
    // 获取分页请求函数参数, 不包括分页
    type PaginationParams<T> = T extends (pager: IGPageQuery, args: infer P) => any ? P : never;

    /** 获取对象中某一个属性类型 **/
    type ReadProperty<T, K extends keyof T> = T[K];
    type ArraySource<T extends any[]> = T[0];

    type TableColumn<T extends Record<string, any>> = TgTableColumn<T>;
    /** 排除类型以外的 */
    type ExcludeType<T, U> = T extends U ? never : T;
  }
}

export {};
