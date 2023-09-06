// @ts-nocheck
const mutations = {
  updateCurrentChooseAnchorIndex(state, index) {
    state.currentChooseAnchorIndex = index;
  },
  updateMatchedInfoList(state, list) {
    state.matchedInfoList = list;
  },
  updateImportedProList(state, list) {
    state.importedProList = list;
  },
  // 设置直播类型
  setDisplayType(state, type) {
    state.displayType = type;
  },
  selectAnchor(state, { rangeIndex, anchorIndex }) {
    const flag =
      state.matchedInfoList[state.currentChooseAnchorIndex].cost_range_list[rangeIndex].star_list[
        anchorIndex
      ].isSelect;
    state.matchedInfoList[state.currentChooseAnchorIndex].cost_range_list[rangeIndex].star_list[
      anchorIndex
    ].isSelect = flag ? 0 : 1;
    // console.log(state.matchedInfoList[state.currentChooseAnchorIndex].cost_range_list[rangeIndex])
  },
  // 更新选择主播的场次
  updateDisplayNum(state, { rangeIndex, anchorIndex, number }) {
    const _matchedInfoList = JSON.parse(JSON.stringify(state.matchedInfoList));
    _matchedInfoList[state.currentChooseAnchorIndex].cost_range_list[rangeIndex].star_list[
      anchorIndex
    ].display_num = number;
    state.matchedInfoList = JSON.parse(JSON.stringify(_matchedInfoList));
    // console.log(_matchedInfoList)
  },
  // 在候选集列表中增加主播
  addStar(state, { star }) {
    let rangeIndex = 0;
    // 混播
    if (state.displayType === 0) {
      if (star.star_mix_cost > 5000) {
        rangeIndex = 3;
      } else if (star.star_mix_cost > 3000) {
        rangeIndex = 2;
      } else if (star.star_mix_cost > 1000) {
        rangeIndex = 1;
      }
    } else if (state.displayType === 1) {
      // 直播
      if (star.star_special_cost > 5000) {
        rangeIndex = 3;
      } else if (star.star_special_cost > 3000) {
        rangeIndex = 2;
      } else if (star.star_special_cost > 1000) {
        rangeIndex = 1;
      }
    }
    state.matchedInfoList[state.currentChooseAnchorIndex].cost_range_list[
      rangeIndex
    ].star_list.unshift(star);
  },
  // 删除候选集里的主播
  delStar(state, { rangeIndex, anchorIndex }) {
    state.matchedInfoList[state.currentChooseAnchorIndex].cost_range_list[
      rangeIndex
    ].star_list.splice(anchorIndex, 1);
  },
  // 删除已确定的主播
  delChosenStar(state, index) {
    state.matchedInfoList[state.currentChooseAnchorIndex].chosen_plan_list.splice(index, 1);
  },
  // 重置在候选集中选择的主播
  resetSelect(state) {
    state.matchedInfoList[state.currentChooseAnchorIndex].cost_range_list.forEach(item => {
      item.star_list.forEach(item => {
        item.isSelect = 0;
      });
    });
  },
  resetRequirementData(state) {
    state.currentChooseAnchorIndex = -1;
    state.displayType = 0;
    state.matchedInfoList = [];
    state.importedProList = [];
  },
};
export default mutations;
