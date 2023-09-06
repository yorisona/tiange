/**
 * 合作
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:41:08
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=81
 */
import { Get } from '@/utils/request';
import { QUERY_ACHIEVEMENT_UID } from '@/apis/coop';
import { ObjectFilterEmpty } from '@/utils/func';
import { ListResponse } from '@/types/base/http';
import { AchievementUid, AchievementUidQueryParams } from '@/types/tiange/coop';

/**
 * 审批单获取业绩
 * ```
 * 最多返回100条
 * ```
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:44:11
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=81&itf=891
 */
export const GetAchievementUid = async (
  payload: AchievementUidQueryParams,
): Promise<ListResponse<AchievementUid>> =>
  Get(QUERY_ACHIEVEMENT_UID, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
