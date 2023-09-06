/*
 * @Author: 肖槿
 * @Date: 2020-04-07 11:57:47
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-22 17:19:57
 * @FilePath: \goumee-star-frontend\src\store\modules\customer\getters.js
 */
// @ts-nocheck
const getters = {
  // // 当前选择的主播列表
  // currentChosenPlanList: (state, getters) => {
  //   let ret = []
  //   if (state.currentChooseAnchorIndex > -1) {
  //     ret = getters.list[state.currentChooseAnchorIndex].chosen_plan_list
  //   }
  //   return ret
  // }
  companyList: state => state.companyList, // 洽谈记录
};
export default getters;
