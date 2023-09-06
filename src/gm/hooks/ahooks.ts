import { reactive, Ref, ref, toRefs, UnwrapRefSimple } from '@vue/composition-api';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { Message } from 'element-ui';
import { IGPageQuery } from '@/types/tiange/general';

export interface RequestOption<Req extends (...args: any) => any> {
  // 是否手动提交
  manual?: boolean;
  // 首次默认执行时,传递给service的参数
  defaultParams?: Parameters<Req>;
  autoError?: boolean;
  // 请求成功后,返回的res.data对象
  onSuccess?: (data: ReturnTypeReq<Req>, oData: HttpResponse<ReturnTypeReq<Req>>) => void;
  // 请求出错时调用的函数
  onError?: (e: Error) => void;
  // 不管成功失败,调用的方法
  onFinally?: (params: Parameters<Req>, data?: ReturnTypeReq<Req>, e?: Error) => void;
  // 转换data数据
  transform?: (e: ReturnTypeReq<Req>) => any;
}
type emptyFun = () => void;

type RequestResult<Req extends (...args: any) => any> = UnwrapRefSimple<{
  data?: Ref<ReturnTypeReq<Req>>;
  params: Parameters<Req>[] | any;
  loading: boolean;
  error?: unknown;
  reload: emptyFun;
  run: (...args: Parameters<Req>) => void;
  runAsync: (...args: Parameters<Req>) => ReturnType<Req>;
}>;

type PaginationRequestResult<Req extends (...args: any) => any> = UnwrapRefSimple<{
  data?: Ref<ReturnTypePaginReq<Req>[]>;
  params: Parameters<Req>[] | any;
  loading: boolean;
  error?: unknown;
  reload: emptyFun;
  run: (...args: Parameters<Req>) => Promise<void>;
  runAsync: (...args: Parameters<Req>) => ReturnType<Req>;
}>;

type ReturnTypeReq<T extends TG.anyFunc> = T extends TG.TFunc<Promise<HttpResponse<infer R>>>
  ? R
  : any;
type ReturnTypePaginReq<T extends TG.anyFunc> = T extends TG.TFunc<Promise<ListResponse<infer R>>>
  ? R
  : any;
export const useRequest = <Req extends (...args: any) => Promise<HttpResponse<unknown>>>(
  service: Req,
  { manual, onError, onSuccess, defaultParams, transform }: RequestOption<Req> = {},
): RequestResult<Req> => {
  const data = ref<ReturnTypeReq<Req>>();
  const error = ref<unknown>();
  const loading = ref(false);
  const params = ref<Parameters<Req>[]>([]);

  const reload = () => {
    run(...(params.value as any));
  };
  const run = (...args: any[]) => {
    return Promise.resolve(args || defaultParams)
      .then(() => {
        loading.value = true;
      })
      .then(() => {
        if (args.length === 0 && defaultParams && defaultParams.length > 0) {
          return defaultParams;
        }
        return args;
      })
      .then((args: any) => {
        params.value = args;
        return args;
      })
      .then(args => service(...args))
      .then((res: any) => {
        if (!res.data.success) throw new Error(res.data.message);
        if (transform) {
          data.value = transform(res.data.data);
        } else {
          data.value = res.data.data;
        }
        onSuccess && onSuccess(data.value as any, res.data);
        return res;
      })
      .then(res => {
        loading.value = false;
        return res;
      })
      .catch((e: Error) => {
        loading.value = false;
        error.value = e.message;
        onError && onError(e);
        Message.error(e.message);
        throw e;
      });
  };
  const runAsync = run;
  if (!manual) {
    run(...(defaultParams || ([] as any)));
  }

  return reactive({
    data,
    error,
    loading,
    reload,
    run,
    runAsync: runAsync as any,
    params,
  });
};

type RequestOptionPagination<Req extends (page: IGPageQuery, ...args: any) => any> =
  RequestOption<Req> & {
    defaultPageSize?: number;
    defaultParams?: Parameters<Req>;
  };

interface Pagination {
  total: number;
  num: number;
  page_num: number;
  page_size: number;
  page_sizes: number[];
  layout: string;
  onSizeChange: (num: number) => void;
  onCurrentChange: (num: number) => void;
  reQuery: (...args: any[]) => void;
}
export const usePagination = <
  Req extends (page: IGPageQuery, ...args: any) => Promise<ListResponse<ReturnTypePaginReq<Req>>>,
>(
  service: Req,
  option: RequestOptionPagination<Req> = {},
): PaginationRequestResult<Req> & { pagination: Pagination } => {
  const { defaultPageSize = 20, defaultParams = [], transform, ...rest } = option;
  const data = ref<ReturnTypeReq<Req>>();
  const pagination = reactive({
    total: 0,
    page_num: 1,
    num: defaultPageSize,
    page_size: defaultPageSize,
    page_sizes: [10, 20, 50, 100],
    layout: 'total, prev, pager, next, sizes, jumper',
    onCurrentChange: (num: number) => {
      const params: any[] = [...result.params];
      if (params[0]) {
        params[0].page_num = num;
      } else {
        params[0] = {
          num: defaultPageSize,
          page_size: defaultPageSize,
          page_num: num,
        };
      }
      result.runAsync(...(params as any)).then(() => {
        pagination.page_num = num;
      });
    },
    onSizeChange: (size: number) => {
      const params: any[] = [...result.params];
      if (params[0]) {
        params[0].page_size = size;
        params[0].num = size;
      } else {
        params[0] = {
          num: size,
          page_size: size,
          page_num: 1,
        };
      }
      result.runAsync(...(params as any)).then(() => {
        pagination.page_size = size;
        pagination.num = size;
      });
    },
    onCurrentSizeChange: () => {
      const params: any[] = [...result.params];
      if (params[0]) {
        params[0].page_num = 1;
        params[0].page_size = defaultPageSize;
        params[0].num = defaultPageSize;
      } else {
        params[0] = {
          num: defaultPageSize,
          page_size: defaultPageSize,
          page_num: 1,
        };
      }
      result.runAsync(...(params as any)).then(() => {
        pagination.page_num = 1;
        pagination.num = defaultPageSize;
        pagination.page_size = defaultPageSize;
      });
    },
    refresh: () => {
      return pagination.onCurrentSizeChange();
    },
    reQuery(...args: any[]) {
      const params: any = [];
      if (result.params[0]) {
        params[0] = result.params[0];
        params[0].page_num = 1;
        pagination.page_num = 1;
      } else {
        params[0] = {
          num: defaultPageSize,
          page_num: 1,
        };
        pagination.page_num = 1;
      }
      params.push(...args);
      return result.runAsync(...params);
    },
  });
  const [defaultPage = { num: defaultPageSize, page_num: 1 }, ...restInit] = defaultParams;
  const result = useRequest<Req>(service, {
    defaultParams: [defaultPage, ...restInit] as any,
    ...rest,
    onSuccess(_data: any, res: any) {
      if (transform) {
        data.value = transform(_data);
      } else {
        data.value = _data.data;
      }
      pagination.total = _data.total;
      if ((result.params[0] as IGPageQuery)?.page_num !== undefined) {
        pagination.page_num = (result.params[0] as IGPageQuery)?.page_num;
      }

      option.onSuccess && option.onSuccess(data.value as any, res);
    },
  });
  const { data: _, ...restResult } = toRefs(result);
  return reactive({
    ...restResult,
    data,
    pagination,
  }) as any;
};
