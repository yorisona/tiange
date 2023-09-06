import { defineComponent, ref, set } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { RouterNamePerformance } from '@/const/router';
import {
  Query_Evaluation_Group_Name,
  Query_Finish_Assessment,
  Query_Performance_Analysis,
} from '@/services/performance';
import { useRouter } from '@/use/vue-router';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { GetAssessment_management_department_list } from '@/services/live';
import { ExportList } from '@/modules/datacenter/competitor/use';
import { usePermission } from '@/use/permission';

export default defineComponent({
  components: { BaseEcharts },
  setup: () => {
    const router = useRouter();
    const permission = usePermission();
    const columns: TgTableColumn<any>[] = [
      {
        align: 'left',
        label: '花名',
        minWidth: 80,
        formatter: (row: any) => {
          return `${row.username}(${row.real_name})`;
        },
      },
      {
        align: 'center',
        label: '工号',
        minWidth: 80,
        prop: 'work_id',
      },
      {
        align: 'left',
        label: '部门',
        minWidth: 180,
        prop: 'department_name',
      },
      {
        align: 'left',
        label: '岗位',
        minWidth: 120,
        prop: 'job_title',
      },
      {
        align: 'center',
        label: '考核名称',
        minWidth: 140,
        prop: 'assessment_management_name',
      },
      {
        align: 'center',
        label: '考评组',
        minWidth: 120,
        formatter: row => {
          return row.evaluation_group.name;
        },
      },
      {
        align: 'right',
        label: '考核结果',
        minWidth: 80,
        prop: 'result',
      },
      {
        align: 'center',
        label: '绩效等级',
        minWidth: 100,
        prop: 'level',
      },
      {
        align: 'left',
        label: '排名',
        minWidth: 50,
        prop: 'rank',
      },
      {
        label: '操作',
        minWidth: 60,
        formatter: row => {
          return (
            <div>
              <tg-button
                type="link"
                onClick={() => {
                  const { href } = router.resolve({
                    name: RouterNamePerformance.report.result_analysis_detail,
                    params: {
                      userid: row.id,
                      id: row.assessment_management_id as any,
                    },
                  });
                  window.open(href);
                }}
              >
                查看
              </tg-button>
            </div>
          );
        },
      },
    ];
    const level_total_analysis = ref<any[]>([]);
    const setSeries = () => {
      baseOptions.value.series = [
        {
          type: 'bar',
          data: level_total_analysis.value.map(it => it.proportion),
          barMaxWidth: 60,
          itemStyle: {
            borderRadius: 4,
            color: '#2877FF',
          },
        },
      ];
    };
    const formData = ref<any>({
      assessment_management_id: undefined,
    });
    const reqList = usePagination(Query_Performance_Analysis, {
      defaultParams: [{ num: 20, page_num: 1 }, formData.value],
      manual: true,
      onSuccess(_, data: any) {
        if (!selectLevel.value) {
          const mewData: any[] = [...data.data.level_total_analysis];
          if (mewData.length > 0) {
            const allCount = mewData.reduce((a, b) => a + b.count, 0);
            mewData.push({
              level: '合计',
              proportion: '100',
              count: allCount,
            });
          }
          level_total_analysis.value = mewData;
          baseOptions.value.xAxis.data = data.data.level_total_analysis.map((it: any) => it.level);
          setSeries();
        }
      },
    });
    const assessment_management_options = ref<TG.OptionType[]>([]);
    //Query_Finish_Assessment
    Query_Finish_Assessment().then(res => {
      if (res.data.success) {
        assessment_management_options.value = res.data.data.map((item: any) => {
          return {
            value: item.assessment_management_id,
            label: item.name,
          };
        });
        if (assessment_management_options.value.length > 0) {
          formData.value.assessment_management_id = assessment_management_options.value[0].value;
          reqList.run({ num: 20, page_num: 1 }, formData.value);
          getFeishuDepartmentList();
        }
      }
    });
    const props = {
      analyseType: 2,
    };
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        // triggerOn: 'click',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
        textStyle: {
          color: '#343F4C',
          fontSize: 14,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
        formatter: '{b0}: {c0}%',
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
      },
      axisPointer: {
        label: {
          formatter: '{value}',
        },
      },
      legend: {
        show: true,
        // data: props.xData ?? [],
        right: 80,
        top: 12,
        type: 'scroll',
        width: 700,
        itemGap: 20,
        itemWidth: 20,
      },
      grid: {
        left: 30,
        right: 10,
        bottom: 30,
        top: 30,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: [] as any[],
        axisPointer: {
          type: 'shadow',
          label: {
            show: false,
          },
          shadowStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0,156,255,0.02)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0,156,255,0.15)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#F2F2F2',
          },
        },
        axisLabel: {
          color: '#6A7B92',
        },
      },
      yAxis: [
        {
          type: 'value',
          axisPointer: {
            type: 'line',
            label: {
              show: true,
            },
            lineStyle: {
              type: [6, 5],
              color: '#A4B2C2',
              cap: 'round',
            },
          },
          position: 'left',
          splitLine: {
            //   show: false,
            lineStyle: {
              type: [6, 5],
              color: '#F2F2F2',
              cap: 'round',
              dashOffset: 6,
            },
          },
          alignTicks: true,
          axisLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter: '{value} 元',
          // },
          nameTextStyle: {
            padding: [0, 42, 15, 0],
          },
          axisLabel: {},
        },
        {
          type: 'value',
          position: 'right',
          alignTicks: true,
          splitLine: {
            lineStyle: {
              type: [6, 5],
              color: '#F2F2F2',
              cap: 'round',
              dashOffset: 6,
            },
          },
          axisPointer: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [] as any[],
    });
    const groupOptions = usePagination(Query_Evaluation_Group_Name, {
      defaultParams: [{ num: 20, page_num: 1 }, { search_type: 3 }],
      transform(res: any) {
        return res.data.map((item: NPerformance.IEvaluationGroup) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    });
    const reqFeishuDep = ref([
      {
        id: 100000,
        name: '全选',
        sons: [] as any[],
      },
    ]);
    const getFeishuDepartmentList = async () => {
      const res = await GetAssessment_management_department_list({
        assessment_management_id: formData.value.assessment_management_id,
      });
      const list = res.data.data.data;
      reqFeishuDep.value = [
        {
          id: 100000,
          name: '全选',
          sons: list || [],
        },
      ];
    };
    // getFeishuDepartmentList();
    const treeRef = ref<ITreeRef>();
    const eachDemp = (data: any, list: any[]) => {
      list.push(data.id);
      data.sons?.forEach((item: any) => eachDemp(item, list));
      return list.join(',');
    };
    const reset = () => {
      formData.value = {
        assessment_management_id: formData.value.assessment_management_id,
      } as any;
      treeRef.value?.setCheckedKeys([]);
      selectedNodes.value = [];
      selectLevel.value = null;
      reqList.pagination.reQuery(formData.value);
    };

    const selectedNodes = ref<any[]>([]);
    const removeSubNode = (nodes: any[]) => {
      const result: any[] = [];
      nodes.forEach(el => {
        const finder = nodes.find(subEl => el.parent_department_id === subEl.open_department_id);
        if (!finder) {
          result.push(el);
        }
      });
      return result;
    };

    const resetDepartmentIds = (nodes: any[]) => {
      set(formData.value, 'feishu_department_id_list', nodes.map((el: any) => el.id).join(','));
    };
    const tgTable = ref();
    // 选中等级
    const selectLevel = ref(null);

    return {
      columns,
      assessment_management_options,
      reqList,
      formData,
      level_total_analysis,
      baseOptions,
      groupOptions,
      reqFeishuDep,
      treeRef,
      eachDemp,
      permission,
      reset,
      selectedNodes,
      removeSubNode,
      resetDepartmentIds,
      tgTable,
      selectLevel,
      getFeishuDepartmentList,
      // selectClick,
    };
  },
  render() {
    const { formData, permission } = this;
    return (
      <ListGenerallyTemplate columns={this.columns} service={this.reqList} v-model={formData}>
        <el-form-item label="考核名称：">
          <Select
            popper-class="el-select-popper-mini"
            clearable={false}
            options={this.assessment_management_options}
            v-model={formData.assessment_management_id}
            onChange={this.getFeishuDepartmentList}
          />
        </el-form-item>
        <el-form-item label="员工部门：">
          <el-popover
            placement="bottom-start"
            trigger="click"
            popper-class="marketing-department-tree-popper-class el-tree-popper-mini"
          >
            <div slot="reference" class="repain-select" style="display: block">
              <el-input
                // value={this.formData.department_id_input}
                value={this.selectedNodes.length ? ' ' : undefined}
                style="color: var(--placeholder-color)"
                placeholder="请选择所属部门"
                readonly
              >
                <i class="select-icon select-icon-user-add el-icon-arrow-down" slot="suffix" />
              </el-input>
              {this.selectedNodes.length > 0 && (
                <div class="department-select-tags">
                  <span>
                    <span class="line-clamp-1" style="max-width: 88px;">
                      {this.selectedNodes[0].name}
                    </span>
                    <i
                      class="el-icon-close"
                      on-click={(event: MouseEvent) => {
                        this.selectedNodes.shift();
                        this.treeRef?.setCheckedKeys(this.selectedNodes.map(el => el.id));
                        const selectedNodes = (this.treeRef as any).getCheckedNodes() || [];
                        this.resetDepartmentIds(selectedNodes);
                        event.stopPropagation();
                      }}
                    ></i>
                  </span>
                  {this.selectedNodes.length > 1 && <span>+ {this.selectedNodes.length - 1}</span>}
                </div>
              )}
            </div>
            <div class="department-tree">
              <el-tree
                ref="treeRef"
                props={{
                  props: {
                    label: 'name',
                    children: 'sons',
                  },
                }}
                // check-strictly="true"
                node-key="id"
                data={this.reqFeishuDep}
                default-expanded-keys={[100000]}
                show-checkbox
                oncheck={() => {
                  const selectedNodes = (this.treeRef as any).getCheckedNodes() || [];
                  this.selectedNodes = this.removeSubNode(selectedNodes);
                  this.resetDepartmentIds(selectedNodes);
                  // set(
                  //   formData,
                  //   'feishu_department_id_list',
                  //   selectedNodes.map((el: any) => el.id).join(','),
                  // );
                  // this.treeRef?.setCheckedKeys([]);
                  // if (node.name !== formData.department_id_input) {
                  //   this.treeRef?.setCheckedKeys([node.id]);
                  //   set(formData, 'department_id_input', node.name);
                  //   set(formData, 'feishu_department_id_list', this.eachDemp(node, []));
                  // } else {
                  //   set(formData, 'department_id_input', '');
                  //   set(formData, 'feishu_department_id_list', '');
                  // }
                }}
              />
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="考评组：">
          <Select
            popper-class="el-select-popper-mini"
            placeholder="请选择考评组"
            options={this.groupOptions.data as any}
            v-model={formData.evaluation_group_id}
            filterable
            remote
            remote-method={(name: string) =>
              this.groupOptions.pagination.reQuery({ name, search_type: 3 })
            }
          />
        </el-form-item>
        <el-form-item label="员工花名：">
          <el-input placeholder="请填写花名" v-model={formData.username} />
        </el-form-item>
        <el-form-item label="员工工号：">
          <el-input placeholder="请填写工号" v-model={formData.work_id} />
        </el-form-item>

        <div slot="middle" class="charts-box">
          <div class={`chart ${this.level_total_analysis.length === 0 ? 'chartEmpty' : ''}`}>
            {this.level_total_analysis.length === 0 && (
              <empty-common img-height="100" img-width="150" />
            )}
            {this.level_total_analysis.length > 0 && (
              <base-echarts
                ref="myChart"
                // onGetChart={(chart: any) => this.chartAddEvent(chart)}
                options={this.baseOptions}
                // onSelectClick={this.selectClick}
              />
            )}
          </div>
          <tg-table
            ref="tgTable"
            data={this.level_total_analysis}
            border
            on-row-click={(row: any) => {
              if (this.selectLevel === row.level) {
                this.tgTable.setCurrentRow();
                this.selectLevel = null;
              } else {
                this.selectLevel = row.level;
                this.tgTable.setCurrentRow(row);
              }

              this.reqList.pagination.reQuery({
                ...formData,
                level: this.selectLevel === '合计' ? undefined : this.selectLevel,
              });
            }}
            highlight-current-row
            row-style={() => {
              return {
                cursor: 'pointer',
              };
            }}
            // row-class-name={({ row, rowIndex }: any) => {
            //   console.log('sdsdd');

            //   if (rowIndex === 0) {
            //     return 'current-row';
            //   }
            // }}
          >
            <el-table-column label="绩效等级" prop="level" align="center" />
            <el-table-column
              align="center"
              label="占比"
              scopedSlots={{
                default: ({ row }: any) => {
                  return `${row.proportion}%`;
                },
              }}
            />
            <el-table-column align="center" label="人数" prop="count" />
            <div class="tg-page-empty" slot="empty">
              <empty-common style="margin-top:-30px" img-height="80" img-width="120" />
            </div>
          </tg-table>
        </div>
        <div slot="searchBtn">
          <tg-button
            type="primary"
            onClick={() => {
              this.selectLevel = null;
              this.reqList.pagination.reQuery(formData);
              this.tgTable.setCurrentRow();
            }}
          >
            查询
          </tg-button>
          <tg-button class="mgl-8" onClick={this.reset}>
            重置
          </tg-button>
          {permission.performance_report_analysis_view_export && (
            <tg-button
              class="mgl-8"
              onClick={() => {
                ExportList(formData, '/api/performance_management/export_performance_analysis');
              }}
            >
              导出
            </tg-button>
          )}
        </div>
      </ListGenerallyTemplate>
    );
  },
});
