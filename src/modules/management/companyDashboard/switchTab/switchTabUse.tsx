import { TgTableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { computed, ref } from '@vue/composition-api';
import { ManagementDateType, getIncreaseColor } from '../../use';
import { useRequest } from '@gm/hooks/ahooks';
import {
  Query_Operate_Manage_Poject_Operating_New_Project_Trend,
  Query_Operate_Manage_Poject_Operating_New_Projects,
  Query_Operate_Manage_Poject_Operating_Renewal_Contracts,
} from '@/services/management';
import { GetContractListByType } from '@/services/contract';
import { useRouter } from '@/use/vue-router';
import { RouterLegal, RouterManagement } from '@/const/router';
import { useExternal } from '@/router/routeGuard';
import moment from 'moment';
export const useProjectTopList = (props: { queryForm: SwitchTabQueryForm }, ctx: any) => {
  type Col = TgTableColumn<any>;
  // const commonWidth = 188;
  // const NoSortWidth = 114;
  const columnSortabld = (key: string) => {
    if (key === 'gmv' || key === 'income') {
      return true;
    }
    const { queryForm } = props || {};
    if (queryForm.date_type === 'day') return false;
    if (queryForm.date_type === 'month') {
      const currentMoment = moment();
      const selectMoment = moment(queryForm.start_date);
      return selectMoment.isSameOrAfter(currentMoment, 'month') ? false : true;
    }
    return true;
  };
  const columnInit = (
    label: string,
    amountKey: string,
    rankKey: string,
    rankChangeKey: string,
    minWidth: number,
    type: 'money' | 'rate' = 'money',
  ): Col => {
    const sortable = columnSortabld(amountKey);
    return {
      label,
      minWidth: minWidth,
      // showOverflowTooltip: true,
      prop: amountKey,
      sortable: 'custom',
      align: 'right',
      headerAlign: 'right',
      formatter: (row, column) => {
        const amount = row[amountKey];
        const amountStr =
          amount === null || amount === undefined
            ? '--'
            : type === 'money'
            ? formatAmount(Math.round(amount / 100), 'None').split('.')[0]
            : amount + '%';
        const rank = row[rankKey] || '--';
        // const rankChange = -Math.round(Math.random() * 10);
        const rankChange = row[rankChangeKey] || 0;
        // const rankChange = row[rankChangeKey] || 235;
        return (
          <div class="cell-container">
            <span class="amount">{amountStr}</span>
            {sortable === true && (
              <fragments>
                <span class="line"></span>
                <span class="rank">{rank}</span>
                <tg-icon
                  style={`color: ${getIncreaseColor(rankChange)}; font-size: 16px; visibility: ${
                    rankChange === 0 ? 'hidden' : 'visible'
                  }`}
                  name={
                    rankChange > 0
                      ? 'ico-icon_tongyong_shangsheng_16'
                      : 'ico-icon_tongyong_xiajiang_16'
                  }
                ></tg-icon>
                <span
                  class="rank-change"
                  style={`visibility: ${rankChange === 0 ? 'hidden' : 'visible'}; color: ${
                    rankChange > 0 ? 'var(--error-color)' : 'var(--success-color)'
                  }`}
                >
                  {Math.abs(rankChange)}
                </span>
              </fragments>
            )}
          </div>
        );
      },
    };
  };
  const columns = computed<Col[]>(() => [
    {
      label: '项目名称',
      minWidth: 120,
      align: 'left',
      headerAlign: 'left',
      showOverflowTooltip: true,
      formatter: row => {
        return (
          <div
            on-click={() => {
              const { href } = ctx.root.$router.resolve({
                name: RouterManagement.projectManagementDashboard,
                query: {
                  project_id: row.project_id,
                  project_name: row.project_name,
                },
              });
              window.open(href, '_blank');
            }}
            class="project-name-div"
          >
            {row.project_name || '--'}
          </div>
        );
      },
    },
    columnInit('GMV 排名', 'gmv', 'gmv_rank', 'gmv_rank_increase', 188),
    columnInit('营收排名', 'income', 'income_rank', 'income_rank_increase', 168),
    columnInit(
      '利润排名',
      'revenue_amount',
      'revenue_amount_rank',
      'revenue_amount_rank_increase',
      168,
    ),
    columnInit(
      '人均产值排名',
      'avg_labor_profit',
      'avg_labor_profit_rank',
      'avg_labor_profit_rank_increase',
      162,
    ),
    columnInit('人力成本排名', 'labor_cost', 'labor_cost_rank', 'labor_cost_rank_increase', 168),
    columnInit('主播成本排名', 'anchor_cost', 'anchor_cost_rank', 'anchor_cost_rank_increase', 168),
    columnInit('投放成本排名', 'ad_cost', 'ad_cost_rank', 'ad_cost_rank_increase', 168),
  ]);
  const sortInfo = ref<{
    sort: string | undefined;
    desc: boolean | undefined;
  }>({
    sort: 'gmv',
    desc: true,
  });
  const onSortChange = (event: any) => {
    const { order, prop } = event;
    if (order) {
      sortInfo.value.desc = order === 'descending';
      sortInfo.value.sort = prop;
    } else {
      sortInfo.value.desc = undefined;
      sortInfo.value.sort = undefined;
    }
  };
  const activedBusinessType = ref<E.management.BusinessType>();
  return {
    onSortChange,
    sortInfo,
    columnSortabld,
    activedBusinessType,
    // businessTypeList,
    columns,
  };
};

export const useOtherLogic = () => {
  const project_id = ref<number>();
  const lineType = ref<'gmv' | 'income'>('gmv');
  type Col = TgTableColumn<any>;
  const columns = ref<Col[]>([
    {
      label: '项目名称',
      minWidth: 120,
      align: 'left',
      showOverflowTooltip: true,
      formatter: row => {
        return row.project_name || '--';
      },
    },
    {
      label: '所属部门',
      minWidth: 132,
      align: 'left',
      showOverflowTooltip: true,
      formatter: row => {
        return row.department_name || '--';
      },
    },
    {
      label: '项目类型',
      minWidth: 88,
      align: 'center',
      formatter: row => {
        return row.business_type_name || '--';
      },
    },
    {
      label: '到期时间',
      minWidth: 100,
      align: 'center',
      showOverflowTooltip: true,
      formatter: row => {
        return row.expire_date || '--';
      },
    },
    {
      label: '剩余天数',
      minWidth: 100,
      align: 'center',
      showOverflowTooltip: true,
      formatter: row => {
        const expire_days =
          row.expire_days === null || row.expire_days === undefined ? '--' : row.expire_days;
        return expire_days <= 0 ? '已到期' : expire_days;
      },
    },
  ]);
  const reqProjectList = useRequest(Query_Operate_Manage_Poject_Operating_New_Projects, {
    manual: true,
    onSuccess: (data: any) => {
      project_id.value = data?.[0]?.project_id;
    },
  });
  const reqProjectTrend = useRequest(Query_Operate_Manage_Poject_Operating_New_Project_Trend, {
    manual: true,
  });
  const reqRenewalContracts = useRequest(Query_Operate_Manage_Poject_Operating_Renewal_Contracts, {
    manual: true,
  });
  const router = useRouter();
  const { externalQuery } = useExternal();
  const contractLoading = ref(false);
  const onContractClick = (row: any) => {
    const contract_id = row.contract_ids[0];
    const payload: any = { id: contract_id };
    let routeUrl: any = undefined;
    contractLoading.value = true;
    GetContractListByType(payload, undefined, true).then(
      (res: any) => {
        contractLoading.value = false;
        const data = res.data.data.data;
        if (data.length) {
          const contract_info = data[0].contract_info;
          const template_info = data[0].template_info;
          if (
            contract_info.contract_type === 1 ||
            contract_info.contract_type === 2 ||
            contract_info.contract_type === 5
          ) {
            routeUrl = router.resolve({
              name: template_info
                ? RouterLegal.contracts.customer.detailTemplate
                : RouterLegal.contracts.customer.detail,
              params: { id: `${contract_info.id}` },
              query: { ...externalQuery },
            });
            // 客户合同
            // ctx.root.$router.push({
            // name: row.template_info
            //   ? RouterLegal.contracts.customer.detailTemplate
            //   : RouterLegal.contracts.customer.detail,
            // params: { id: `${row.contract_info.id}` },
            // });
          } else if (
            contract_info.contract_type === 3 ||
            contract_info.contract_type === 4 ||
            contract_info.contract_type === 6
          ) {
            routeUrl = router.resolve({
              name: template_info
                ? RouterLegal.contracts.supplier.detailTemplate
                : RouterLegal.contracts.supplier.detail,
              params: { id: `${contract_info.id}` },
              query: {
                contract_type: `${contract_info.contract_type}`,
                ...externalQuery,
              },
            });
            // 供应商
            // ctx.root.$router.push({
            // name: row.template_info
            //   ? RouterLegal.contracts.supplier.detailTemplate
            //   : RouterLegal.contracts.supplier.detail,
            // params: { id: `${row.contract_info.id}` },
            // query: {
            //   contract_type: `${row.contract_info.contract_type}`,
            // },
            // });
          } else {
            routeUrl = router.resolve({
              name: RouterLegal.contracts.anchor.detailTemplate,
              params: { id: `${contract_info.id}` },
              query: {
                contract_type: `${contract_info.contract_type}`,
                ...externalQuery,
              },
            });
            // 主播
            // ctx.root.$router.push({
            // name: RouterLegal.contracts.anchor.detailTemplate,
            // params: { id: `${row.contract_info.id}` },
            // query: {
            //   contract_type: `${row.contract_info.contract_type}`,
            // },
            // });
          }
        }
        window.open(routeUrl.href, '_blank');
      },
      () => {
        contractLoading.value = false;
      },
    );
  };
  return {
    lineType,
    project_id,
    columns,
    contractLoading,
    onContractClick,
    reqProjectList,
    reqProjectTrend,
    reqRenewalContracts,
  };
};

export interface SwitchTabQueryForm {
  start_date: string;
  end_date: string;
  department_id?: string;
  department_ids?: string;
  is_department?: boolean;
  group_by: 'month' | 'day';
  date_type?: ManagementDateType;
  department_level?: number;
}
