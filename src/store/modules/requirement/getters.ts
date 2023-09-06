// @ts-nocheck
const getters = {
  // 合并的列表
  list: state => {
    const _arr = [];
    // console.log(state.matchedInfoList, state.importedProList, _arr)
    const _importedProList = JSON.parse(JSON.stringify(state.importedProList));
    state.matchedInfoList.forEach((item, index) => {
      _arr[index] = Object.assign(_importedProList[index], item);
    });
    return _arr;
  },
  // 当前选择的主播列表
  currentChosenPlanList: (state, getters) => {
    let ret = [];
    if (state.currentChooseAnchorIndex > -1) {
      ret = getters.list[state.currentChooseAnchorIndex].chosen_plan_list;
    }
    return ret;
  },
  // 当前操作的主播列表
  currentCostRangeList: (state, getters) => {
    let ret = [];
    if (!getters.list[state.currentChooseAnchorIndex]) return ret;
    ret = getters.list[state.currentChooseAnchorIndex].cost_range_list.map(item => {
      item.star_list.forEach(item => {
        if (!item.isSelect) {
          item.isSelect = 0;
        }
        if (!item.generate_way) {
          item.generate_way = 0;
        }
      });
      return item;
    });
    return ret;
  },
};
export default getters;
