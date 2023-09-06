/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-01 17:35:51
 */

import { TableColumn } from '@/types/vendor/column';
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { popoverShow, popoverHide, selectControlPopoverHide } from '@/utils/tree-other';
import { QueryOperatingProjects, QueryProfitLossDetail } from '@/services/finance';
import { GetFeishuDepartmentList } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { departmentFilterDisabled } from '@/utils/filter';
import { formatAmount } from '@/utils/string';
import moment from 'moment';
import { wait } from '@/utils/func';
import { OperatingProjectModel } from '@/types/tiange/finance/finance';
import dialogImport from '../dialog/profixLossStatementExport.vue';
import { useDialog } from '@/use/dialog';
enum ProfitLossKeyType {
  /** gmv */
  gmv = 'gmv',
  /** 视频号gmv **/
  wechat_video_gmv = 'wechat_video_gmv',
  /** 直播GMV */
  livestream_gmv = 'livestream_gmv',
  /** 橱窗GMV */
  showcase_gmv = 'showcase_gmv',
  /** 短视频GMV */
  shortvideo_gmv = 'shortvideo_gmv',
  /** 其它GMV */
  others_gmv = 'others_gmv',
  /** 月度增长率 */
  gmv_increase_rate = 'gmv_increase_rate',
  /** 结算GMV */
  settlement_gmv = 'settlement_gmv',
  /** 收入 */
  income = 'income',
  /** 服务费 */
  service_amount = 'service_amount',
  /** 佣金 */
  commission_amount = 'commission_amount',
  /** 营销/商广 */
  promote_income = 'promote_income',
  /** 其它收入 */
  others_income = 'others_income',
  /** 营收增长率 */
  income_increase_rate = 'income_increase_rate',
  /** 营收预算 */
  goal_income = 'goal_income',
  /** 预算完成进度 */
  goal_income_complete_rate = 'goal_income_complete_rate',
  /** 收入占结算GMV */
  income_to_settlement_gmv_percent = 'income_to_settlement_gmv_percent',
  /** 成本 */
  cost = 'cost',
  /** 主播成本 */
  star_cost = 'star_cost',
  /** 投放成本 */
  delivery_cost = 'delivery_cost',
  /** 人员成本 */
  employee_cost = 'employee_cost',
  /** 中台成本 */
  middle_platform_cost = 'middle_platform_cost',
  /** 其它成本费用 */
  others_cost = 'other_others_cost',
  /** 设计费 */
  visual_design_cost = 'visual_design_cost',
  /**   PGC运维费 */
  pgc_operate_cost = 'pgc_operate_cost',
  /**   短视频拍摄 */
  short_video_cost = 'short_video_cost',
  /** 签约服务费 */
  sign_service_cost = 'sign_service_cost',
  /** 营业税金及附加 */
  tax_cost = 'tax_cost',
  /** 项目利润 */
  profit = 'profit',
  /** 人均净利润 */
  avg_profit = 'avg_profit',
  /** 办公费 */
  others_cost_office = 'others_cost_office',
  /** 物料成本 */
  others_cost_logistics = 'others_cost_logistics',
  /** 装修费 */
  others_cost_decoration = 'others_cost_decoration',
  /**  差旅交通费 */
  others_cost_traffic = 'others_cost_traffic',
  /** 招待费 */
  others_cost_serve = 'others_cost_serve',
  /**  招聘咨询 */
  others_cost_recruitment = 'others_cost_recruitment',
  /** 公摊成本 */
  others_cost_pooled = 'others_cost_pooled',
  /** 其他 */
  others_cost_others = 'others_cost_others',

  /** 占收入百分比 成本 */
  cost_percent = 'cost_percent',
  /** 主播成本 */
  star_cost_percent = 'star_cost_percent',
  /** 投放成本 */
  delivery_cost_percent = 'delivery_cost_percent',
  /** 人员成本 */
  employee_cost_percent = 'employee_cost_percent',

  /** 投入产出比 */
  roi = 'roi',
  /** 团队人数 */
  employee_num = 'employee_num',
  /** 平均人力成本 */
  avg_employee_cost = 'avg_employee_cost',
}

interface QueryForm {
  department_ids: number[];
  department_name: string | undefined;
  // project_id: number | undefined;
  project_ids: number[] | undefined;
  year: number | undefined;
}

interface TargetType {
  key: ProfitLossKeyType | undefined;
  name: string | undefined;
  value: (number | null)[] | undefined;
  children?: TargetType[];
}

export default defineComponent({
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        department_ids: [],
        department_name: undefined,
        project_ids: undefined,
        year: Number(moment().format('YYYY')),
      };
    };
    const targets: TargetType[] = [
      {
        key: ProfitLossKeyType.gmv,
        name: '总GMV',
        value: [],
        children: [
          {
            key: ProfitLossKeyType.livestream_gmv,
            name: '抖音直播',
            value: [],
          },
          {
            key: ProfitLossKeyType.showcase_gmv,
            name: '橱窗',
            value: [],
          },
          {
            key: ProfitLossKeyType.shortvideo_gmv,
            name: '短视频',
            value: [],
          },
          {
            key: ProfitLossKeyType.others_gmv,
            name: '其它',
            value: [],
          },
          {
            key: ProfitLossKeyType.wechat_video_gmv,
            name: '微信视频号',
            value: [],
          },
        ],
      },

      {
        key: ProfitLossKeyType.gmv_increase_rate,
        name: '月度增长率',
        value: [],
      },
      {
        key: ProfitLossKeyType.income,
        name: '营收',
        value: [],
        children: [
          {
            key: ProfitLossKeyType.service_amount,
            name: '服务费',
            value: [],
          },
          {
            key: ProfitLossKeyType.commission_amount,
            name: '佣金',
            value: [],
          },
          {
            key: ProfitLossKeyType.promote_income,
            name: '营销/商广',
            value: [],
          },
          {
            key: ProfitLossKeyType.others_income,
            name: '其它收入',
            value: [],
          },
          {
            key: ProfitLossKeyType.income_increase_rate,
            name: '营收增长率',
            value: [],
          },
          {
            key: ProfitLossKeyType.goal_income,
            name: '营收预算',
            value: [],
          },
          {
            key: ProfitLossKeyType.goal_income_complete_rate,
            name: '预算完成进度',
            value: [],
          },
        ],
      },
      {
        key: ProfitLossKeyType.cost,
        name: '成本',
        value: [],
        children: [
          {
            key: ProfitLossKeyType.star_cost,
            name: '主播成本',
            value: [],
          },
          {
            key: ProfitLossKeyType.delivery_cost,
            name: '投放成本',
            value: [],
          },
          {
            key: ProfitLossKeyType.employee_cost,
            name: '人力成本',
            value: [],
          },
          {
            key: ProfitLossKeyType.middle_platform_cost,
            name: '中台成本',
            value: [],
            children: [
              {
                key: ProfitLossKeyType.visual_design_cost,
                name: '设计费',
                value: [],
              },
              {
                key: ProfitLossKeyType.pgc_operate_cost,
                name: 'PGC运维费',
                value: [],
              },
              {
                key: ProfitLossKeyType.short_video_cost,
                name: '短视频拍摄',
                value: [],
              },
              {
                key: ProfitLossKeyType.sign_service_cost,
                name: '签约服务费',
                value: [],
              },
            ],
          },
          {
            key: ProfitLossKeyType.others_cost,
            name: '其他成本',
            value: [],
            children: [
              {
                key: ProfitLossKeyType.others_cost_office,
                name: '办公费',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_logistics,
                name: '物料成本',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_decoration,
                name: '装修费',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_traffic,
                name: '差旅交通费',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_serve,
                name: '招待费',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_recruitment,
                name: '招聘咨询',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_pooled,
                name: '公摊成本',
                value: [],
              },
              {
                key: ProfitLossKeyType.others_cost_others,
                name: '其他',
                value: [],
              },
            ],
          },
        ],
      },
      {
        key: ProfitLossKeyType.profit,
        name: '实际净利润',
        value: [],
        children: [
          {
            key: ProfitLossKeyType.avg_profit,
            name: '人均净利润',
            value: [],
          },
        ],
      },
      {
        key: ProfitLossKeyType.cost_percent,
        name: '占收入百分比',

        value: [],
        children: [
          {
            key: ProfitLossKeyType.star_cost_percent,
            name: '主播成本',
            value: [],
          },
          {
            key: ProfitLossKeyType.delivery_cost_percent,
            name: '投放成本',
            value: [],
          },
          {
            key: ProfitLossKeyType.employee_cost_percent,
            name: '人力成本',
            value: [],
          },
        ],
      },
      {
        key: ProfitLossKeyType.roi,
        name: '投入产出比',
        value: [],

        children: [
          {
            key: ProfitLossKeyType.employee_num,
            name: '团队人数',
            value: [],
          },
          {
            key: ProfitLossKeyType.avg_employee_cost,
            name: '平均人力成本',
            value: [],
          },
        ],
      },
    ];
    const expands = [ProfitLossKeyType.income, ProfitLossKeyType.cost];
    const initTableData = (targets: TargetType[]) => {
      const tempTableData = [];
      const createObj = () => {
        const obj: TargetType = {
          key: undefined,
          name: undefined,
          value: [],
        };
        return obj;
      };
      for (let i = 0; i < targets.length; i++) {
        const obj = createObj();
        const target = targets[i];
        obj.name = targets[i].name;
        obj.key = targets[i].key;
        if (target.children) {
          obj.children = initTableData(target.children);
        }
        tempTableData.push(obj);
      }

      return tempTableData;
    };

    const dates = computed(() => {
      const format = 'yyyy-MM-DD';
      const start_date = queryForm.value.year
        ? moment(queryForm.value.year + '/01/01').startOf('year')
        : moment().startOf('year');
      const end_date = queryForm.value.year
        ? moment(queryForm.value.year + '/01/01').endOf('year')
        : moment().endOf('year');
      return [start_date.format(format), end_date.format(format)];
    });
    const yearOptions = ref<{ label: string; value: number }[]>([]);
    let year_num = Number(moment().format('YYYY')) || 2023;
    for (let i = 0; year_num >= 2022; i++) {
      yearOptions.value.push({
        label: year_num + '年',
        value: year_num,
      });
      year_num = year_num - 1;
    }
    const loading = ref(false);
    const updateTime = ref<number | undefined>(undefined);
    const updateStr = computed(() => {
      if (updateTime.value) {
        return moment(updateTime.value * 1000).format('yyyy-MM-DD HH:mm');
      }
      return '--';
    });

    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const projectList = ref<OperatingProjectModel[]>([]);

    const queryForm = ref<QueryForm>(initQueryForm());
    const tableData = ref(initTableData(targets));
    const dialog = useDialog({
      component: dialogImport,
      width: '328px',
      title: '其他成本明细导出',
      footer: false,
      on: {
        submit() {},
      },
    });
    const methods = {
      initColumns: (): TableColumn<TargetType>[] => {
        const tempColumns: TableColumn<TargetType>[] = [];
        for (let i = 0; i < 14; i++) {
          if (i === 0) {
            tempColumns.push({
              label: '指标',
              fixed: 'left',
              prop: 'name',
              minWidth: 150,
            });
          } else {
            tempColumns.push({
              label: i === 13 ? '合计' : `${i}月`,
              fixed: i === 13 ? 'right' : undefined,
              align: 'right',
              minWidth: 150,
              formatter: row => {
                const val = row.value?.[i - 1];
                if (row.key === ProfitLossKeyType.roi) {
                  return val ? `${val.toFixed(2)}` : val;
                }
                if (
                  row.key === ProfitLossKeyType.income_to_settlement_gmv_percent ||
                  row.key === ProfitLossKeyType.gmv_increase_rate ||
                  row.key === ProfitLossKeyType.income_increase_rate ||
                  row.key === ProfitLossKeyType.goal_income_complete_rate ||
                  row.key === ProfitLossKeyType.employee_cost_percent ||
                  row.key === ProfitLossKeyType.delivery_cost_percent ||
                  row.key === ProfitLossKeyType.star_cost_percent ||
                  row.key === ProfitLossKeyType.cost_percent
                ) {
                  return val ? `${val.toFixed(2)}%` : val;
                }
                if (row.key === ProfitLossKeyType.employee_num) {
                  return val;
                }
                return val ? formatAmount((val / 100).toFixed(2), '¥ ') : val;
              },
            });
          }
        }
        return tempColumns;
      },

      async getFeishuDepartmentList(isMounted = false) {
        const res = await GetFeishuDepartmentList({
          // root_department_name: '品牌',
        });
        if (res.data.success) {
          const list = res.data.data.data;
          departmentFilterDisabled(list, true, 3);
          feishuDepartmentList.value = list;
          if (isMounted) {
            const finder = methods.getDPRuningDepartment(feishuDepartmentList.value);
            queryForm.value.department_ids = finder ? [finder?.id] : [];
            queryForm.value.department_name = finder?.name;
            if (queryForm.value.department_ids) {
              department_tree.value?.setCheckedKeys(queryForm.value.department_ids);
            }
          }
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      async getCommonDouyinProjectList() {
        // const [start_date, end_date] = dates.value;
        const params = {
          // begin_time: start_date,
          // end_time: end_date,
          department_ids: queryForm.value.department_ids.join(','),
        };
        const res = await QueryOperatingProjects(params);
        if (res.data.success) {
          projectList.value = res.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      async queryProfitLossDetail() {
        const [start_date, end_date] = dates.value;
        loading.value = true;
        const [res] = await wait(
          500,
          QueryProfitLossDetail({
            start_date: start_date,
            end_date: end_date,
            department_ids: queryForm.value.department_ids.join(',') || '',
            project_ids:
              queryForm.value.project_ids && queryForm.value.project_ids.length > 0
                ? `${queryForm.value.project_ids.filter(item => item)}`
                : undefined,
            // : projectList.value.map(el => el.project_id).join(','),
            // project_ids: '136, 159, 135, 160 ,157, 158, 132, 129, 131',
          }),
        );
        loading.value = false;
        if (res.data.success) {
          tableData.value = initTableData(targets);
          const data = res.data.data.datas;
          updateTime.value = res.data.data.update_time;
          tableData.value = tableData.value.map(el => {
            if (el.children) {
              el.children = el.children.map(chilerenEl => {
                const finder = data?.find(item => item.key === chilerenEl.key);
                if (finder) {
                  chilerenEl.value = finder.value;
                }
                if (chilerenEl.children) {
                  chilerenEl.children = chilerenEl.children.map(sub_chilerenEl => {
                    const finder_two = data?.find(sub_item => sub_item.key === sub_chilerenEl.key);
                    if (finder_two) {
                      sub_chilerenEl.value = finder_two.value;
                    }
                    return sub_chilerenEl;
                  });
                }
                return chilerenEl;
              });
            }
            const finder = data?.find(item => item.key === el.key);
            if (finder) {
              el.value = finder.value;
            }
            return el;
          });
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      onQuery() {
        methods.queryProfitLossDetail();
      },
      onExport() {
        dialog.show(
          queryForm.value.year,
          queryForm.value.department_ids,
          queryForm.value.project_ids,
        );
      },
      async onReset() {
        queryForm.value = initQueryForm();
        // await methods.queryProfitLossDetail();
        await methods.getFeishuDepartmentList(true);
        await methods.getCommonDouyinProjectList();
        await methods.queryProfitLossDetail();
      },
      getDPRuningDepartment(arr: FeiShuDepartment[]): FeiShuDepartment | undefined {
        for (let i = 0; i < arr?.length ?? 0; i++) {
          const dp = arr[i];
          if (dp.name === '品牌运营一部') {
            return dp;
          } else {
            const finder = methods.getDPRuningDepartment(dp.sons);
            if (finder) {
              return finder;
            }
          }
        }
        return undefined;
      },
      ondepartmentCleaar(event: any) {
        department_tree.value?.setCheckedKeys([]);
        queryForm.value.department_ids = [];
        queryForm.value.department_name = undefined;
        methods.getCommonDouyinProjectList();
        if (event) {
          event.stopPropagation();
        }
      },
    };

    const columns = ref<TableColumn<TargetType>[]>(methods.initColumns());

    onMounted(async () => {
      await methods.getFeishuDepartmentList(true);
      await methods.getCommonDouyinProjectList();
      await methods.queryProfitLossDetail();
    });
    /*  const changeSelectProjectIds = (val: any[]) => {
      const find = (val || []).find((item: number) => item === 0);
      queryForm.value.project_ids = find === 0 ? [0] : queryForm.value.project_ids;
    };*/
    const getRowKeys = (row: TargetType) => {
      return row.key;
    };
    return {
      getRowKeys,
      expands,
      // changeSelectProjectIds,
      yearOptions,
      department_tree,
      popoverShow,
      popoverHide,
      selectControlPopoverHide,
      columns,
      feishuDepartmentList,
      projectList,
      queryForm,
      tableData,
      loading,
      updateStr,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-profix-loss-statement-page-container">
        <section class="filter-field">
          <div style="display: flex; align-items: center; margin-top: 12px; margin-right: 18px;">
            <span style="color: var(--text-second-color);font-size:12px">所属年度：</span>
            <el-select
              size="mini"
              popper-class="el-select-popper-mini"
              style="width:120px"
              v-model={this.queryForm.year}
            >
              {this.yearOptions.map((item: any) => {
                return <el-option value={item.value} label={item.label} />;
              })}
            </el-select>
          </div>
          <div style="display: flex; align-items: center; margin-top: 12px; margin-right: 18px;">
            <span style="color: var(--text-second-color);font-size:12px">归属部门：</span>
            <department-select
              style="width: 244px"
              selectMultiple={true}
              levelDisabled={(level: number) => level === 1}
              ref="departmentSelectRef"
              levelHidden={(level: number) => level >= 4}
              clearable={true}
              v-model={this.queryForm.department_ids}
              defaultExpandedKeys={[this.queryForm.department_ids]}
            ></department-select>
          </div>
          <li style="display: none" class="controlPopoverHide"></li>
          <div style="margin-top: 12px; margin-right: 18px;">
            <span style="color: var(--text-second-color);font-size:12px">项目名称：</span>
            <el-select
              popper-class="el-select-popper-mini"
              size="mini"
              multiple
              filterable
              clearable
              collapse-tags
              v-model={this.queryForm.project_ids}
              style="width: 244px"
              on-focus={this.selectControlPopoverHide}
              // on-change={this.changeSelectProjectIds}
            >
              {/*<el-option label="全部" value={0} key={'undefined'}></el-option>*/}
              {this.projectList.map(el => (
                <el-option
                  label={el.project_name}
                  value={el.project_id}
                  key={el.project_id}
                ></el-option>
              ))}
            </el-select>
          </div>
          <div style="margin-top: 12px;">
            <tg-button type="primary" on-click={this.onQuery}>
              搜索
            </tg-button>
            <tg-button class="mgl-8" on-click={this.onReset}>
              重置
            </tg-button>
            <tg-button class="mgl-8 mgr-12" on-click={this.onExport}>
              导出
            </tg-button>
          </div>
        </section>
        <section class="update-div mgt-10">
          <div class="update-time">数据更新时间：{this.updateStr}</div>
        </section>
        <section class="table-field" v-loading={this.loading}>
          <div class="table-container">
            <el-table
              border
              row-key={this.getRowKeys}
              height="100%"
              expand-row-keys={this.expands}
              attrs={{ data: this.tableData }}
              tree-props={{ children: 'children', hasChildren: 'hasChildren' }}
            >
              {this.columns.map((col, colIndex) => (
                <el-table-column key={colIndex} props={{ ...col }} />
              ))}
              {/* <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template> */}
            </el-table>
          </div>
        </section>
      </div>
    );
  },
});
