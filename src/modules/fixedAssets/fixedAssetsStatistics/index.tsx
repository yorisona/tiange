import { ref, defineComponent, h, watchEffect } from '@vue/composition-api';
import assetUse from './modules/assetUse';
import assetDistribution from './modules/assetDistribution';
import { ExportList } from '@/modules/datacenter/competitor/use';
import capsuleGroup from '@/components/Button/capsuleGroup';
import { numberFormat } from '@/utils/formatMoney';
import { useRequest } from '@gm/hooks/ahooks';
import {
  QueryFixedAssetUsedStatistics,
  QueryFixedAssetProjectDepartmentUsedStatistics,
  QueryFixedAssetStatisticsRecord,
} from '@/services/fixedAssets';
import { TgTableColumn } from '@/types/vendor/column';
import moment from 'moment';

export default defineComponent({
  components: {
    assetUse,
    assetDistribution,
    capsuleGroup,
  },
  setup: (props, ctx) => {
    const useType = ref<1 | 2>(1);
    const distributionType = ref<1 | 2>(1);
    const formData = ref<any>({
      type: 1,
      date: moment().format('YYYY'),
    });
    const columns: TgTableColumn<any>[] = [
      {
        label: '部门/项目',
        prop: 'department_project',
        align: 'center',
        'show-overflow-tooltip': true,
        minWidth: 160,
        formatter: row => {
          const department_name = row.department_name ? row.department_name : '';
          const project_name = row.project_name ? '项目：' + row.project_name : '';
          if (!department_name && !project_name) return '--';
          return (
            <div style="text-overflow: ellipsis;overflow: hidden;">{`${
              row.department_name ? row.department_name : ''
            }${row.project_name ? '项目：' + row.project_name : ''}`}</div>
          );
        },
      },
      {
        label: '新增领用数量',
        prop: 'add_count',
        align: 'right',
        minWidth: 100,
      },
      {
        label: '新增领用金额 (元)',
        prop: 'add_amount',
        align: 'right',
        minWidth: 120,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '期末资产数',
        prop: 'end_count',
        minWidth: 100,
        align: 'right',
      },
      {
        label: '期末资产金额 (元)',
        prop: 'end_amount',
        align: 'right',
        minWidth: 120,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '维修数量',
        prop: 'maintenance_count',
        align: 'right',
        minWidth: 100,
      },
      {
        label: '维修金额 (元)',
        prop: 'maintenance_amount',
        align: 'right',
        minWidth: 100,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '折旧成本 (元)',
        prop: 'depreciation_amount',
        align: 'right',
        minWidth: 100,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '公摊成本 (元)',
        prop: 'allocated_amount',
        align: 'right',
        minWidth: 100,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
    ];

    const QueryFixedAssetUsedStatisticsReq = useRequest(QueryFixedAssetUsedStatistics, {
      manual: true,
      defaultParams: [
        {
          search_type: useType.value,
        },
      ],
    });
    const QueryFixedAssetProjectDepartmentUsedStatisticsReq = useRequest(
      QueryFixedAssetProjectDepartmentUsedStatistics,
      {
        manual: true,
        defaultParams: [
          {
            search_type: useType.value,
          },
        ],
      },
    );
    const QueryFixedAssetStatisticsRecordReq = useRequest(QueryFixedAssetStatisticsRecord, {
      manual: true,
    });
    watchEffect(() => {
      QueryFixedAssetUsedStatisticsReq.run({
        search_type: useType.value,
      });
    });

    watchEffect(() => {
      QueryFixedAssetProjectDepartmentUsedStatisticsReq.run({
        search_type: distributionType.value,
      });
    });
    const tableLodding = ref(false);
    watchEffect(() => {
      tableLodding.value = true;
      QueryFixedAssetStatisticsRecordReq.runAsync({
        year: moment(formData.value.date).format('YYYY'),
        month: formData.value.type === 1 ? undefined : moment(formData.value.date).format('MM'),
      }).then(() => {
        tableLodding.value = false;
      });
    });

    return {
      useType,
      distributionType,
      formData,
      columns,
      QueryFixedAssetUsedStatisticsReq,
      QueryFixedAssetProjectDepartmentUsedStatisticsReq,
      QueryFixedAssetStatisticsRecordReq,
      tableLodding,
    };
  },
  render() {
    const { formData } = this;
    const statistics = this.QueryFixedAssetStatisticsRecordReq?.data?.statistics_data || {};
    console.log(this.formData.date, 'this.formData.date');
    return (
      <div class="wrap">
        <div class="header_box">
          <div class="header_box_wrap">
            <div class="title_box">
              <head-lines style="margin-right:6px;flex: 1;" title="资产使用" titleFont={14} />
              <div
                class={'syb-btn mgr-8'}
                selected={this.useType === 1}
                onClick={() => {
                  this.useType = 1;
                }}
              >
                数量
              </div>
              <div
                class={'syb-btn'}
                selected={this.useType === 2}
                onClick={() => {
                  this.useType = 2;
                }}
              >
                金额
              </div>
            </div>
            <assetUse
              v-loading={this.QueryFixedAssetUsedStatisticsReq?.loading}
              subTitle={this.useType === 1 ? '总数量' : '总金额'}
              data={this.QueryFixedAssetUsedStatisticsReq?.data}
            />
          </div>
          <div class="header_box_wrap">
            <div class="title_box">
              <head-lines style="margin-right:6px;flex: 1;" title="资产分布" titleFont={14} />
              <div
                class={'syb-btn mgr-8'}
                selected={this.distributionType === 1}
                onClick={() => {
                  this.distributionType = 1;
                }}
              >
                数量
              </div>
              <div
                class={'syb-btn'}
                selected={this.distributionType === 2}
                onClick={() => {
                  this.distributionType = 2;
                }}
              >
                金额
              </div>
            </div>
            <assetDistribution
              v-loading={this.QueryFixedAssetProjectDepartmentUsedStatisticsReq?.loading}
              data={this.QueryFixedAssetProjectDepartmentUsedStatisticsReq?.data}
              distributionType={this.distributionType}
            />
          </div>
        </div>
        <div class="list-box">
          <div class="list-box_titie mgb-16">
            <head-lines style="margin-right:6px;flex: 1;" title="资产详情" titleFont={14} />
            <div class="list-box_titie_right">
              <div class="date-switch mgr-16">
                <capsule-group
                  v-model={formData.type}
                  options={[
                    { label: '年度', value: 1 },
                    { label: '月度', value: 2 },
                  ]}
                  onChange={(v: any) => {
                    if (v === 1) {
                      formData.date = moment().format('YYYY');
                    } else {
                      formData.date = moment().format('YYYY.MM');
                    }
                  }}
                />
              </div>
              <el-date-picker
                key={'syb' + formData.type}
                v-model={formData.date}
                class="mgr-18"
                style="width: 168px;"
                type={formData.type === 1 ? 'year' : 'month'}
                format={formData.type === 1 ? 'yyyy' : 'yyyy.MM'}
                picker-options={{
                  disabledDate: (current: any) => {
                    const end = moment();
                    return current.valueOf() > end.valueOf();
                  },
                }}
                size="small"
                placeholder={formData.type === 1 ? '选择年' : '选择月'}
                clearable={false}
              />
              <tg-button
                on-click={() => {
                  ExportList(
                    {
                      year: moment(formData.date).format('YYYY'),
                      month: formData.type === 1 ? undefined : moment(formData.date).format('MM'),
                    },
                    '/api/fixed_asset/kanban/export_fixed_asset_statistics_record',
                  );
                }}
              >
                导出
              </tg-button>
            </div>
          </div>
          <div class="data-text">
            <span>新增资产：</span>
            <span>{statistics?.add_count || 0}</span>
            <span>新增金额：</span>
            <span>¥{numberFormat(statistics?.add_amount / 100, 2) || 0}</span>
            <span>报废资产：</span>
            <span>
              {statistics?.scrapped_count || 0}{' '}
              <span style="color: #888888;font-weight: 400;">件</span>
            </span>
            <span>报废金额：</span>
            <span>¥ {numberFormat(statistics?.scrapped_amount / 100, 2) || 0}</span>
          </div>
          <div style="flex:1;overflow:hidden;" class="mgt-12" v-loading={this.tableLodding}>
            <tg-table
              border
              height="100%"
              data={this.QueryFixedAssetStatisticsRecordReq?.data?.data || []}
              columns={this.columns}
            />
          </div>
        </div>
      </div>
    );
  },
});
