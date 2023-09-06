/**
 * 店铺代播 - 直播场次 - 筛选项逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 11:27:16
 */

import { LiveDisplaySearchType, LiveDisplayStatus } from '@/types/tiange/live';
import { ref } from '@vue/composition-api';
import { BusinessTypeEnum } from '@/types/tiange/common';

export const useFilter = () => {
  const searchTypeList = ref([
    // {
    //   label: '全部',
    //   value: undefined,
    // },
    {
      label: '品牌名称',
      value: LiveDisplaySearchType.brand_name ?? '--',
    },
    {
      label: '直播间',
      value: LiveDisplaySearchType.studio_name,
    },
    {
      label: '客户名称',
      value: LiveDisplaySearchType.shop_name,
    },
    {
      label: '项目编号',
      value: LiveDisplaySearchType.project_uid,
    },
    {
      label: '项目名称',
      value: LiveDisplaySearchType.project_name,
    },
    {
      label: '直播标题',
      value: LiveDisplaySearchType.live_title,
    },
    {
      label: '主播名称',
      value: LiveDisplaySearchType.kol_name,
    },
    {
      label: '运营助理',
      value: LiveDisplaySearchType.operation_assistant_name,
    },
  ]);

  const liveStatusList = ref([
    {
      label: '全部',
      value: undefined,
    },
    {
      label: '待排班',
      value: LiveDisplayStatus.waitingSchedule,
    },
    {
      label: '待直播',
      value: LiveDisplayStatus.waitingLive,
    },
    {
      label: '待录入',
      value: LiveDisplayStatus.waitingTypeIn,
    },
    {
      label: '已直播',
      value: LiveDisplayStatus.lived,
    },
  ]);

  const businessTypeList = [
    {
      label: '全部',
      value: undefined,
    },
    {
      label: '抖音店播',
      value: BusinessTypeEnum.douyin,
    },
    {
      label: '淘宝店播',
      value: BusinessTypeEnum.taobao,
    },
  ];

  const searchPlaceholder = (value: LiveDisplaySearchType) => {
    switch (value) {
      case LiveDisplaySearchType.brand_name:
        return '请输入品牌名称';
      case LiveDisplaySearchType.studio_name:
        return '请输入直播间名称';
      case LiveDisplaySearchType.shop_name:
        return '请输入客户名称';
      case LiveDisplaySearchType.project_uid:
        return '请输入项目编号';
      case LiveDisplaySearchType.live_title:
        return '请输入直播标题';
      case LiveDisplaySearchType.kol_name:
        return '请输入主播名称';
      case LiveDisplaySearchType.operation_assistant_name:
        return '请输入运营助理名称';
      default:
        return '';
    }
  };

  return { searchTypeList, liveStatusList, businessTypeList, searchPlaceholder };
};
