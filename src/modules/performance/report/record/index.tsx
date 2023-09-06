import { defineComponent, ref, set } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { RouterNamePerformance } from '@/const/router';
import { Query_Evaluation_Group_Name, Query_User_Performance_Record } from '@/services/performance';
import { useRouter } from '@/use/vue-router';
import { Select } from '@gm/component/select';
import { GetFeishuDepartmentList } from '@/services/live';
export default defineComponent({
  setup: () => {
    const router = useRouter();
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
        align: 'left',
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
        align: 'left',
        label: '在职状态',
        minWidth: 70,
        formatter: row => {
          return row.is_leave === 1 ? '离职' : '在职';
        },
      },
      {
        align: 'center',
        label: '考核次数',
        minWidth: 70,
        prop: 'sum_count',
      },
      {
        align: 'center',
        label: '完成考核次数',
        minWidth: 90,
        prop: 'completed_count',
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
                  router.push({
                    name: RouterNamePerformance.report.detail,
                    params: {
                      id: row.id as any,
                    },
                  });
                }}
              >
                查看
              </tg-button>
            </div>
          );
        },
      },
    ];

    const reqList = usePagination(Query_User_Performance_Record);

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
      transform(res: any) {
        return res.data.map((item: NPerformance.IEvaluationGroup) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    });

    // GetFeishuDepartmentList
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

    const eachDemp = (data: any, list: any[]) => {
      list.push(data.id);
      data.sons?.forEach((item: any) => eachDemp(item, list));
      return list.join(',');
    };
    const config = {
      reset,
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
      groupOptions,
      reqFeishuDep,
      columns,
      reqList,
      formData,
      reset,
      treeRef,
      eachDemp,
      config,
      selectedNodes,
      removeSubNode,
      resetDepartmentIds,
    };
  },
  render() {
    const { formData } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.reqList}
        value={formData}
        config={this.config}
      >
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
            popper-class="marketing-department-tree-popper-class  el-tree-popper-mini"
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
            remote-method={(name: string) => this.groupOptions.pagination.reQuery({ name })}
          />
        </el-form-item>
        <el-form-item label="在职状态：">
          <Select
            popper-class="el-select-popper-mini"
            placeholder="请选择在职状态"
            v-model={formData.is_leave}
            options={[
              { label: '在职', value: 0 },
              { label: '离职', value: 1 },
            ]}
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
          {/*<tg-button*/}
          {/*  class="mgl-12"*/}
          {/*  onClick={() => {*/}
          {/*    ExportList(formData, '/api/performance_management/export_performance_analysis');*/}
          {/*  }}*/}
          {/*>*/}
          {/*  导出*/}
          {/*</tg-button>*/}
        </div>
      </ListGenerallyTemplate>
    );
  },
});
