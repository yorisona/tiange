/**
 * 合作
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:41:08
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=81
 */

/**
 * 审批单获取业绩请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:45:09
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=81&itf=891
 */
export interface AchievementUidQueryParams {
  search?: string; //
}

/**
 * [description]
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:46:39
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=81&itf=891
 * @prop {number} achievement_id 收款编号
 * @prop {string[]} achievement_uid 业绩编号
 * @prop {number} gather_amount收款金额
 */
export interface AchievementUid {
  /** 收款编号 */
  achievement_id: number;
  /** 业绩编号 */
  achievement_uid: string;
  /** 收款金额 */
  gather_amount: number;
}
