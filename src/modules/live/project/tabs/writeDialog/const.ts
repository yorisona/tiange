/*
 * @Author: 肖槿
 * @Date: 2021-06-07 15:58:21
 * @Description: 应收实收常量
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-22 17:38:50
 * @FilePath: \goumee-star-frontend\src\modules\live\project\tabs\writeDialog\const.ts
 */
import { formatAmount } from '@/utils/string';
import { h } from '@vue/composition-api';
import {
  GetQueryShopLiveForWriteOff,
  SaveMarketWriteOff,
  SaveShopLiveWriteOff,
  GetQueryMarketForWriteOff,
  GetQueryShopLiveForWriteOff2,
  GetQueryMarketForWriteOff2,
  GetSearchReceivable,
  GetSearchAchievement,
  GetSearchPayable,
  GetSearchCostPayable,
  GetSearchPayableForWrite,
  SavePayableWriteOff,
  GetQueryLocalLifeForWriteOff,
  SaveLocalLifeWriteOff,
  SaveSupplyChainWriteOff,
  GetQueryLocalLifeAchievementsForWriteOff,
} from '@/services/marketing/achievement';

// 应收tab下
export const isReceivable = {
  type: 'isReceivable',
  queryText: '业绩查询',
  searchTip: '付款编号仅支持实收发生的退款付款编号搜索',
  queryPlaceholder: '请输入收款或付款编号',
  dialogTitle: '应收核销', // 弹框title
  alert: '注意：如果需要核销到其他项目的实收，请点击下一步后添加。', // 注意文案
  queryAjax: GetSearchAchievement, // 营销业务业绩查询url
  yxSameProjectAjax: GetQueryMarketForWriteOff, // 营销业务同项目实收单url
  yxSubmitAjax: SaveMarketWriteOff, // 营销业务提交url
  dbSameProjectAjax: GetQueryShopLiveForWriteOff, // 店铺代播同项目实收单url
  dbSubmitAjax: SaveShopLiveWriteOff, // 店铺代播提交url
  dbSameLocalLifeProjectAjax: GetQueryLocalLifeAchievementsForWriteOff,
  dbSubmitLocalLifeAjax: SaveLocalLifeWriteOff, // 店铺代播提交url
  dbSubmitSupplyChainAjax: SaveSupplyChainWriteOff,
  amountText: '应收单可核销金额', // 金额文案
  projectText: '同项目实收单', // 同项目文案
  writeOffText: '实收核销列表', // 核销列表文案
  // 同项目是收单表格
  firstColumn: [
    {
      type: 'selection',
      align: 'center',
      headerAlign: 'center',
      width: 60,
    },
    {
      label: '收款编号',
      property: 'uid',
    },
    {
      label: '实收金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.gather_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.not_write_off_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
  ],
  // 查询业绩表格
  secondColumn: [
    {
      label: '收/付款编号',
      property: 'uid',
      width: 168,
    },
    {
      label: '实收/实付金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 140,
      formatter: (row: any) => {
        let amount = row.gather_amount;
        if (row.search_type === 2) {
          amount = row.gather_amount * -1;
        }
        return formatAmount(amount, '');
      },
    },
    {
      label: '项目名称',
      formatter: (row: any) => row.project_name || '--',
      minWidth: 260,
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      formatter: (row: any) => {
        let amount = row.not_write_off_amount;
        if (row.search_type === 2) {
          amount = row.not_write_off_amount * -1;
        }
        return formatAmount(amount, '');
      },
    },
  ],
};

// 实收tab下
export const isActualIncome = {
  type: 'isActualIncome',
  queryText: '应收查询',
  queryPlaceholder: '请输入应收编号',
  dialogTitle: '实收核销', // 弹框title
  alert: '注意：如果需要核销到其他项目的应收，请点击下一步后添加。', // 注意文案
  queryAjax: GetSearchReceivable, // 营销业务业绩查询url
  yxSameProjectAjax: GetQueryMarketForWriteOff2, // 营销业务同项目实收单url
  yxSubmitAjax: SaveMarketWriteOff, // 营销业务提交url
  dbSameProjectAjax: GetQueryShopLiveForWriteOff2, // 店铺代播同项目实收单url
  dbSameLocalLifeProjectAjax: GetQueryLocalLifeForWriteOff,
  dbSubmitAjax: SaveShopLiveWriteOff, // 店铺代播提交url
  dbSubmitLocalLifeAjax: SaveLocalLifeWriteOff, // 店铺代播提交url
  dbSubmitSupplyChainAjax: SaveSupplyChainWriteOff, // 店铺代播提交url
  amountText: '实收可核销金额', // 金额文案
  projectText: '同项目应收单', // 同项目文案
  writeOffText: '应收核销列表', // 核销列表文案
  // 同项目是收单表格
  firstColumn: [
    {
      type: 'selection',
      align: 'center',
      headerAlign: 'center',
      width: 60,
    },
    {
      label: '应收编号',
      property: 'uid',
    },
    {
      label: '应收金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.receivable_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.not_write_off_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
  ],
  // 查询业绩表格
  secondColumn: [
    {
      label: '应收编号',
      property: 'uid',
      width: 168,
    },
    {
      label: '应收金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      formatter: (row: any) => formatAmount(row.receivable_amount, ''),
    },
    {
      label: '项目名称',
      minWidth: 300,
      showOverflowTooltip: true,
      formatter: (row: any) => row.project_name || '--',
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 110,
      formatter: (row: any) => formatAmount(row.not_write_off_amount, ''),
    },
  ],
};

// 应付
export const isPayable = {
  type: 'isPayable',
  queryText: '收/付款查询',
  searchTip: '收款编号仅支持实付发生的退款收款编号搜索',
  queryPlaceholder: '请输入收款或付款编号',
  dialogTitle: '应付核销', // 弹框title
  alert: '注意：如果需要核销到其他项目的实付，请点击下一步后添加。', // 注意文案
  queryAjax: GetSearchCostPayable, // 营销业务业绩查询url
  yxSameProjectAjax: GetSearchCostPayable, // 营销业务同项目实收单url
  yxSubmitAjax: SavePayableWriteOff, // 营销业务提交url
  dbSameProjectAjax: GetSearchCostPayable, // 店铺代播同项目实收单url
  dbSubmitAjax: SavePayableWriteOff, // 店铺代播提交url
  dbSameLocalLifeProjectAjax: GetSearchCostPayable,
  dbSubmitLocalLifeAjax: SavePayableWriteOff, // 店铺代播提交url
  dbSameSupplyChainProjectAjax: GetSearchCostPayable,
  dbSubmitSupplyChainAjax: SavePayableWriteOff, // 店铺代播提交url

  amountText: '应付单可核销金额', // 金额文案
  projectText: '同项目实付单', // 应付核销中文案应为’同项目实付单‘ dh
  writeOffText: '实付核销列表', // 核销列表文案
  // 同项目是收单表格
  firstColumn: [
    {
      type: 'selection',
      align: 'center',
      headerAlign: 'center',
      width: 60,
    },
    {
      label: '付款编号',
      property: 'id',
    },
    {
      label: '实付金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.cost_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.not_write_off_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
  ],
  // 查询业绩表格
  secondColumn: [
    {
      label: '收/付款编号',
      width: 168,
      formatter: (row: any) => {
        return row.search_type === 4 ? row.uid : row.id;
      },
    },
    {
      label: '实收/实付金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 140,
      formatter: (row: any) => {
        let amount = row.cost_amount;
        if (row.search_type === 4) {
          amount = row.cost_amount * -1;
        }
        return formatAmount(amount, '');
      },
    },
    {
      label: '项目名称',
      minWidth: 260,
      showOverflowTooltip: true,
      formatter: (row: any) => row.project_name || '--',
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      formatter: (row: any) => {
        let amount = row.not_write_off_amount;
        if (row.search_type === 4) {
          amount = row.not_write_off_amount * -1;
        }
        return formatAmount(amount, '');
      },
    },
  ],
};

// 实付
export const isActual = {
  type: 'isActual',
  queryText: '应付查询',
  queryPlaceholder: '请输入应付编号',
  dialogTitle: '实付核销', // 弹框title
  alert: '注意：如果需要核销到其他项目的应付，请点击下一步后添加。', // 注意文案
  queryAjax: GetSearchPayableForWrite, // 营销业务业绩查询url
  yxSameProjectAjax: GetSearchPayable, // 营销业务同项目实收单url
  yxSubmitAjax: SavePayableWriteOff, // 营销业务提交url
  dbSameProjectAjax: GetSearchPayable, // 店铺代播同项目实收单url
  dbSubmitAjax: SavePayableWriteOff, // 店铺代播提交url
  dbSameLocalLifeProjectAjax: GetSearchPayable,
  dbSubmitLocalLifeAjax: SavePayableWriteOff, // 店铺代播提交url
  dbSubmitSupplyChainAjax: SavePayableWriteOff, // 店铺代播提交url
  amountText: '实付单可核销金额', // 金额文案
  projectText: '同项目应付单', // 同项目文案
  writeOffText: '应付核销列表', // 核销列表文案
  // 同项目是收单表格
  firstColumn: [
    {
      type: 'selection',
      align: 'center',
      headerAlign: 'center',
      width: 60,
    },
    {
      label: '应付编号',
      property: 'uid',
    },
    {
      label: '应付金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.payable_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 126,
      formatter: (row: any) => formatAmount(row.not_write_off_amount, ''),
    },
    {
      label: '',
      width: 110,
    },
  ],
  // 查询业绩表格
  secondColumn: [
    {
      label: '应付编号',
      property: 'uid',
      width: 168,
    },
    {
      label: '应付金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      formatter: (row: any) => formatAmount(row.payable_amount, ''),
    },
    {
      label: '项目名称',
      minWidth: 300,
      showOverflowTooltip: true,
      formatter: (row: any) => row.project_name || '--',
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      headerAlign: 'right',
      width: 110,
      formatter: (row: any) => formatAmount(row.not_write_off_amount, ''),
    },
  ],
};
