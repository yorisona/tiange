import { defineComponent, ref, set } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import {
  AppealStatus,
  EASSESSMENT_STAGE_MAP,
  EASSESSMENT_STAGE_OPTIONS,
} from '@/const/performance';
// import { RouterNamePerformance } from '@/const/router';
import {
  Query_Assessment_Name,
  Query_Evaluation_Group_Name,
  Query_With_Me_Performance,
} from '@/services/performance';
// import { useRouter } from '@/use/vue-router';
import { ExportList } from '@/modules/datacenter/competitor/use';
import { GetFeishuDepartmentList } from '@/services/live';
import grievanceHandling from '@/modules/performance/my/dialog/grievanceHandling/index.vue';
import { useDialog } from '@/use/dialog';
import { ObjectFilterEmpty } from '@/utils/func';
import { usePermission } from '@/use/permission';
export default defineComponent({
  setup: () => {
    // const router = useRouter();
    const permission = usePermission();

    const columns: TgTableColumn<NPerformance.IAssessmentPeople>[] = [
      {
        label: '花名',
        minWidth: 70,
        align: 'left',
        prop: 'username',
      },
      {
        align: 'left',
        label: '工号',
        minWidth: 80,
        prop: 'work_id',
      },
      {
        align: 'left',
        label: '部门',
        minWidth: 130,
        showOverflowTooltip: true,
        prop: 'department_name',
      },
      {
        align: 'left',
        label: '考核名称',
        minWidth: 143,
        showOverflowTooltip: true,
        prop: 'assessment_management_name',
      },
      {
        align: 'left',
        label: '考核周期',
        showOverflowTooltip: true,
        minWidth: 100,
        prop: 'assessment_cycle',
      },
      {
        align: 'left',
        label: '考评组',
        minWidth: 100,
        showOverflowTooltip: true,
        formatter: row => {
          return row.evaluation_group?.name ?? '--';
        },
      },
      {
        align: 'center',
        label: '当前节点',
        formatter: row => {
          return EASSESSMENT_STAGE_MAP.get(row.present_stage);
        },
      },
      {
        align: 'center',
        label: '待办人员',
        formatter: row => {
          return row.present_person?.name;
        },
      },
      {
        align: 'center',
        label: '考核结果',
        prop: 'result',
      },
      {
        align: 'center',
        label: '考核等级',
        prop: 'level',
      },
      {
        label: '操作',
        minWidth: 110,
        formatter: (row: any) => {
          return (
            <div>
              <tg-button
                type="link"
                onClick={() => {
                  window.open(`/performance/my/related/${row.id}`, '_blank');
                  // router.push({
                  //   name: RouterNamePerformance.my.related.detail,
                  //   params: {
                  //     id: row.id as any,
                  //   },
                  // });
                }}
              >
                查看
              </tg-button>
              {permission.handle_appeal &&
                row.appeal_detail &&
                row.appeal_detail.appeal_status === AppealStatus.launch && (
                  <tg-button
                    type="link"
                    class="mgl-12"
                    onClick={() => {
                      dialogGrievanceHandling.show(row);
                    }}
                  >
                    处理申诉
                  </tg-button>
                )}
            </div>
          );
        },
      },
    ];

    const reqList = usePagination(Query_With_Me_Performance);

    const formData = ref<any>({
      username: undefined,
      work_id: undefined,
      feishu_department_id_list: undefined,
      evaluation_group_id: undefined,
      is_leave: undefined,
    });

    const reset = () => {
      formData.value = {} as any;
      treeRef.value?.setCheckedKeys([]);
      selectedNodes.value = [];
      reqList.pagination.reQuery(formData.value);
    };
    const groupOptions = usePagination(Query_Evaluation_Group_Name, {
      defaultParams: [{ num: 20, page_num: 1 }, { search_type: 2 }],
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
      const res = await GetFeishuDepartmentList();
      const list = res.data.data.data;
      reqFeishuDep.value = [
        {
          id: 100000,
          name: '全选',
          sons: list || [],
        },
      ];
    };
    getFeishuDepartmentList();
    const treeRef = ref<ITreeRef>();
    const reqAssess = usePagination(Query_Assessment_Name, {
      defaultParams: [{ num: 1000000, page_num: 0 }, { search_type: 2 }],
      transform: (data: any) => {
        return data.data.map((it: any) => ({ label: it.assessment_cycle, value: it.id }));
      },
    });
    const dialogGrievanceHandling = useDialog({
      component: grievanceHandling,
      title: '申诉',
      width: '463px',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });

    const eachDemp = (data: any, list: any[]) => {
      list.push(data.id);
      data.sons?.forEach((item: any) => eachDemp(item, list));
      return list.join(',');
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

    return {
      columns,
      reqList,
      formData,
      reset,
      groupOptions,
      treeRef,
      reqFeishuDep,
      eachDemp,
      reqAssess,
      dialogGrievanceHandling,
      selectedNodes,
      removeSubNode,
      resetDepartmentIds,
    };
  },
  render() {
    const { formData } = this;
    return (
      <ListGenerallyTemplate columns={this.columns} service={this.reqList} v-model={formData}>
        <el-form-item label="员工花名：">
          <el-input placeholder="请填写花名" v-model={formData.username} />
        </el-form-item>
        <el-form-item label="员工工号：">
          <el-input placeholder="请填写工号" v-model={formData.work_id} />
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
        <el-form-item label="考核周期：">
          <Select
            placeholder="请选择考核周期"
            popper-class="el-select-popper-mini"
            options={this.reqAssess.data as any}
            v-model={formData.assessment_management_id}
            filterable
            remote
            remote-method={(name: string) =>
              this.reqAssess.pagination.reQuery({ name, search_type: 2 })
            }
          />
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
              this.groupOptions.pagination.reQuery({ name, search_type: 2 })
            }
          />
        </el-form-item>
        <el-form-item label="考核阶段：">
          <Select
            popper-class="el-select-popper-mini"
            placeholder="请选择考核阶段"
            v-model={formData.stage}
            options={EASSESSMENT_STAGE_OPTIONS}
          />
        </el-form-item>
        <div slot="searchBtn">
          <tg-button
            type="primary"
            onClick={() => {
              this.reqList.pagination.reQuery(formData);
            }}
          >
            查询
          </tg-button>
          <tg-button class="mgl-8" onClick={this.reset}>
            重置
          </tg-button>
          <tg-button
            class="mgl-8"
            onClick={() => {
              ExportList(
                ObjectFilterEmpty({
                  ...formData,
                  export_type: 1,
                }),
                '/api/performance_management/export_evaluation_performance',
              );
            }}
          >
            导出
          </tg-button>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
