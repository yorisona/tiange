import { VNode } from 'vue';

export enum reasonForScrapping {
  '使用年限已满，且无继续使用价值' = 1,
  '更新换代导致资产无法继续满足使用需求',
  '主要部分残缺，破损严重，再修理在经济上不合算',
  '一年以上或计划不再有使用需求',
  '其他',
}
export interface assetManagementList {
  add_by: number;
  add_by_name: string;
  asset_class: number;
  asset_class_name: string;
  asset_code: string;
  asset_model: string;
  asset_name: string;
  asset_type: number;
  asset_type_name: string;
  tax_amount: number; //税额
  tax_excluded_amount: number; //不含税金额
  current_department_id: null | number;
  current_department_name: null | string;
  current_project_id: null | number;
  current_project_name: null | string;
  current_user_id: null | number;
  current_user_name: null | string;
  depreciation_amount: number;
  expected_useful_life: number;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  image: string;
  last_used_date: string;
  modified_by: number;
  modified_by_name: string;
  position_name: string;
  purchase_date: string;
  remaining_amount: number;
  status: number;
  unit_price: number;
  warehouse_position: number;
  warranty_deadline: string;
  is_allow_edit: boolean;
  is_allow_allocation: boolean;
  is_allow_maintenance: boolean;
  is_allow_lock: boolean;
  is_allow_unlock: boolean;
  is_allow_scrapped: boolean;
  inventory_operation_status: number;
  inventory_status: number;
}

export const comonColumn = [
  {
    label: '资产编号',
    prop: 'asset_code',
    align: 'left',
    'show-overflow-tooltip': true,
  },
  {
    label: '名称',
    prop: 'asset_name',
    align: 'center',
    'show-overflow-tooltip': true,
  },
  {
    label: '分类',
    prop: 'asset_class_name',
    align: 'center',
    'show-overflow-tooltip': true,
  },
  {
    label: '规格型号',
    prop: 'asset_model',
    align: 'center',
    'show-overflow-tooltip': true,
  },
  {
    label: '资产类型',
    prop: 'asset_type_name',
    align: 'center',
    'show-overflow-tooltip': true,
  },
];

export const useComonTable: <T>(row: T) => VNode = row => {
  return <tg-table border max-height={'360px'} data={row} columns={comonColumn}></tg-table>;
};

import { useRequest } from '@gm/hooks/ahooks';
import {
  QueryFixedAssetType,
  QueryFixedAssetClass,
  QueryFixedAssetWarehousePosition,
} from '@/services/fixedAssets';
import { ref } from '@vue/composition-api';

type optionType = {
  label: string;
  value: number;
};
export const useComonOptions = () => {
  const assetClassOption = ref<{ asset_class_age: number }[] & optionType[]>([] as any);
  const assetTypeOption = ref<optionType[]>([] as any);
  const QueryFixedAssetClassReq = useRequest(QueryFixedAssetClass, {
    manual: true,
  });
  /** 资产类型 */
  QueryFixedAssetClassReq.runAsync().then(res => {
    assetClassOption.value =
      res.data.data?.map(item => {
        return {
          label: item.asset_class_name,
          value: item.id,
          asset_class_age: item.asset_class_age,
        };
      }) || [];
  });
  /** 分类 */
  const QueryFixedAssetTypeReq = useRequest(QueryFixedAssetType, {
    manual: true,
  });
  QueryFixedAssetTypeReq.runAsync().then(res => {
    assetTypeOption.value =
      res.data.data?.map(item => {
        return { label: item.asset_type_name, value: item.id };
      }) || [];
  });
  /** 存放地点 */
  const AssetWarehousePositionOption = ref<optionType[]>([] as any);
  QueryFixedAssetWarehousePosition({
    page_num: 1,
    num: 1000,
  }).then(res => {
    AssetWarehousePositionOption.value =
      res.data.data?.data?.map(item => {
        return { label: item.position_name, value: Number(item.id) };
      }) || [];
  });
  return {
    assetClassOption,
    assetTypeOption,
    AssetWarehousePositionOption,
  };
};
