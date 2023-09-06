/**
 * Cont
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 13:57:34
 */
import { Get } from '@/utils/request';
import { HttpResponse } from '../types/base/http';

export default {
  /** 法务管理-合同查询 **/
  QUERY_LAW_CONTRACT: (params = {}): Promise<HttpResponse<any>> =>
    Get('/api/cont/query_law_contract', {
      params,
    }),
};
