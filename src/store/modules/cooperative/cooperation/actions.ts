/**
 * 协同模块-合作记录Actions
 */
// @ts-nocheck
import {
  getCooperation,
  getCooperationDetail,
  getAchievementList,
  getCostList,
  getRebate,
} from '@/api/cooperative';
import {
  GET_CooperationList,
  GET_CooperationDetail,
  SET_CooperationDetailStatus,
  GET_AchievementList,
  GET_CostList,
  GET_CurrentAERecordList,
  GET_RebatesList,
} from './actiontypes';
import { Message } from 'element-ui';

// 获取合作记录
const GetCooperation = ({ commit }, data) => {
  getCooperation(data)
    .then(res => {
      if (res.data.success) {
        const cooperationlist = res.data.data;
        commit(GET_CooperationList, cooperationlist);
      } else {
        if (res.data.error_code !== 200) {
          Message.error(res.data.message);
        }
        commit(GET_CooperationList, null);
      }
    })
    .catch(err => {
      Message.error(err);
    });
};

// 获取合作详情
const GetCooperationDetail = ({ commit, state, dispatch }, data) => {
  let _time = 0;
  if (state.CooperationDetail !== null) {
    _time = 300;
  }
  setTimeout(() => {
    getCooperationDetail(data)
      .then(res => {
        if (res.data.success) {
          const cooperationdetail = res.data.data.data[0];
          commit(GET_CooperationDetail, cooperationdetail);
          dispatch('cooperative/GetCustomerDetail', cooperationdetail.customer_id, { root: true });
        } else {
          if (res.data.error_code !== 200) {
            Message.error(res.data.message);
          }
          commit(GET_CooperationDetail, null);
        }
      })
      .catch(err => {
        Message.error(err);
      });
  }, _time);
};

// 重置合作详情数据集
const ResetCurrentAERecordList = ({ commit }) => {
  commit(GET_CurrentAERecordList, null);
};

// 设置当前合作详情状态
const SetCooperationdetailStatus = ({ commit }, data) => {
  commit(SET_CooperationDetailStatus, data);
};

// 获取业绩记录
const GetAchievementList = ({ commit }, data) => {
  getAchievementList(data)
    .then(res => {
      if (res.data.success) {
        const achievementList = res.data.data;
        commit(GET_AchievementList, achievementList);
      } else {
        if (res.data.error_code !== 200) {
          Message.error(res.data.message);
        }
        commit(GET_AchievementList, null);
      }
    })
    .catch(err => {
      Message.error(err);
    });
};

// 获取成本安排记录
const GetCoostList = ({ commit }, data) => {
  getCostList(data)
    .then(res => {
      if (res.data.success) {
        const costList = res.data.data;
        commit(GET_CostList, costList);
      } else {
        if (res.data.error_code !== 200) {
          Message.error(res.data.message);
        }
        commit(GET_CostList, null);
      }
    })
    .catch(err => {
      Message.error(err);
    });
};

// 获取返点安排记录
const GetRebatesList = ({ commit }, data) => {
  getRebate(data)
    .then(res => {
      if (res.data.success) {
        const rebatesList = res.data.data;
        commit(GET_RebatesList, rebatesList);
      } else {
        if (res.data.error_code !== 200) {
          Message.error(res.data.message);
        }
        commit(GET_RebatesList, null);
      }
    })
    .catch(err => {
      Message.error(err);
    });
};
export default {
  GetCooperation,
  ResetCurrentAERecordList,
  GetCooperationDetail,
  SetCooperationdetailStatus,
  GetAchievementList,
  GetCoostList,
  GetRebatesList,
};
