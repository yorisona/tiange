import { defineComponent, ref, set, computed, onActivated, inject } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import {
  EASSESSMENT_STAGE,
  EASSESSMENT_STAGE_MAP,
  EASSESSMENT_STAGE_OPTIONS,
  EASSESSMENT_STATUS_MAP,
  EASSESSMENT_STATUS_OPTIONS,
  IMPROVEMENT_STATUS_OPTIONS,
} from '@/const/performance';
import { RouterNamePerformance } from '@/const/router';
import {
  DeleteAssessmentDetail,
  Query_Assessment_Detail,
  BulkResetAssessmentPresentStage,
} from '@/services/performance';
import { useRouter } from '@/use/vue-router';
import { useDialog } from '@/use/dialog';
import launch from '../dialog/launch/index.vue';
import reviseLevel from '../dialog/reviseLevel/index.vue';
import launchScore from '../dialog/launchScore/index.vue';
import overdueRestart from '../dialog/overdueRestart/index.vue';
import { GetAssessment_management_department_list } from '@/services/live';
import { usePermission } from '@/use/permission';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetAuthQueryUser } from '@/services/supplier';
import resetProcess from '../dialog/resetProcess/index.vue';
import transferrals from '../dialog/transferrals/index.vue';

export default defineComponent({
  setup: (props, ctx) => {
    const deleteLoading = ref(false);
    const router = useRouter();
    const permission = usePermission();
    const assessment_management_id = Number(router.currentRoute.params.id);
    const columns: TgTableColumn<NPerformance.IAssessmentDetail>[] = [
      {
        type: 'selection',
        // selectable: (row: any) => {
        //   console.log(row, 'row');

        //   return false;
        // },
      },
      {
        label: '花名',
        align: 'left',
        prop: 'username',
      },
      {
        label: '真名',
        align: 'left',
        prop: 'real_name',
      },
      {
        label: '部门',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 110,
        formatter: row => {
          return row.department_name;
        },
      },
      {
        label: '发起人',
        align: 'center',
        formatter: row => {
          return row.launch_person?.username || '--';
        },
      },
      {
        label: '考评组',
        align: 'left',
        showOverflowTooltip: true,
        prop: 'evaluation_group_name',
      },
      {
        label: '考核状态',
        align: 'left',
        prop: 'overdue_status',
        formatter: row => {
          return EASSESSMENT_STATUS_MAP.get(row.overdue_status) || '--';
        },
      },
      {
        label: '当前节点',
        align: 'left',
        prop: 'department_name',
        formatter: (row: any) => {
          return EASSESSMENT_STAGE_MAP.get(row.present_stage);
        },
      },
      {
        label: '待办人员',
        align: 'center',
        formatter: row => {
          return row.present_person.username;
        },
      },
      {
        label: '截止时间',
        align: 'center',
        prop: 'deadline',
      },
      {
        label: '考核结果',
        align: 'center',
        prop: 'result',
      },
      {
        align: 'center',
        label: '绩效等级',
        prop: 'level',
      },
      {
        align: 'center',
        label: '绩效改进状态',
        prop: 'improve_plan_status_cn',
        minWidth: 130,
      },
      {
        label: '操作',
        minWidth: 210,
        align: 'left',
        formatter: row => {
          return (
            <div>
              <tg-button
                type="link"
                onClick={() => {
                  router.push({
                    name: RouterNamePerformance.assessment.manage.detailDetail,
                    params: {
                      id: assessment_management_id as any,
                      userid: row.id as any,
                    },
                  });
                }}
              >
                查看
              </tg-button>
              <tg-button
                class="mgl-12"
                type="link"
                disabled={EASSESSMENT_STAGE.FINISH === row.present_stage}
                onClick={() => {
                  deleteAssessment(row.id);
                }}
              >
                删除
              </tg-button>
              {permission.assessment_management_result && (
                <tg-button
                  type="link"
                  class="mgl-12"
                  disabled={Number(row.present_stage || null) < EASSESSMENT_STAGE.SIGNATURE}
                  onClick={async () => {
                    dialogSetLevel.show(row);
                  }}
                >
                  调整考核结果和等级
                </tg-button>
              )}
            </div>
          );
        },
      },
    ];
    const formData = ref<any>({
      feishu_department_id_list: [],
      department_id_input: '',
      assessment_management_id,
    });
    const formDataC = computed(() => {
      const result = { ...formData.value };
      if (result.stage) {
        result.stage =
          result.stage.constructor.name === 'Array' ? result.stage.join(',') : result.stage;
      }

      return result;
    });

    const is_can_start_score = ref(false);

    const reqList = usePagination(Query_Assessment_Detail, {
      defaultParams: [{ page_num: 1, num: 20 }, formData.value],
      transform: (originData: any) => {
        // console.log('🚀 ~ file: index.tsx ~ line 153 ~ aaa', aaa);
        is_can_start_score.value = originData.is_can_start_score;
        return originData.data;
      },
    });
    const dialogLauch = useDialog({
      title: '发起考核',

      component: launch,
      width: '700px',
    });
    const dialogSetLevel = useDialog({
      component: reviseLevel,
      title: '调整考核结果和等级',

      width: '463px',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const dialogLaunchScore = useDialog({
      component: launchScore,
      title: '发起评分',

      width: '600px',
      okText: '确定',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });

    const dialogOverdueRestart = useDialog({
      component: overdueRestart,
      title: '逾期重启',
      width: '800px',
      okText: '确定',
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const selected = ref<NPerformance.Indicators[]>([]);
    const config = {
      reset() {
        formData.value = {
          department_id_input: '',
          feishu_department_id_list: [],
          assessment_management_id,
        };
        selectedNodes.value = [];
        treeRef.value?.setCheckedKeys([]);
      },
      table: {
        selectionChange: (value: NPerformance.Indicators[]) => {
          selected.value = value;
          console.log(selected.value, 'selected.value');
        },
      },
    };
    /* 批量重置 */
    const dialogResetProcess = useDialog({
      component: resetProcess,
      title: '重置流程',
      width: '340px',
      on: {
        submit(value: any) {
          BulkResetAssessmentPresentStage({
            stage: value.id,
            remark: value.remark,
            assessment_detail_ids: value.assessment_detail_ids,
          }).then((res: any) => {
            if (res.data.success) {
              ctx.root.$message.success('重置成功');
              dialogResetProcess.close();
              reqList.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
          });
        },
      },
    });
    /* 批量转交 */
    const dialogTransferrals = useDialog({
      component: transferrals,
      title: '批量转交',
      width: '340px',
      on: {
        submit(value: any) {
          BulkResetAssessmentPresentStage({
            stage: value.id,
            remark: value.remark,
            assessment_detail_ids: value.assessment_detail_ids,
          }).then((res: any) => {
            if (res.data.success) {
              ctx.root.$message.success('重置成功');
              dialogResetProcess.close();
              reqList.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
          });
        },
      },
    });

    const groupOptions = usePagination(Query_Assessment_Detail, {
      defaultParams: [{ page_num: 1, num: 20 }, formData.value],
      transform(res: any) {
        return res.evaluation_group_name_list.map((item: NPerformance.IEvaluationGroup) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    });
    const userList = ref<any[]>([]);
    const queryUserList = async (keyword: string | undefined) => {
      const res = await GetAuthQueryUser({
        search_type: 2,
        search_value: keyword,
        page_num: 1,
        num: 1000,
      });
      if (res?.data) {
        userList.value =
          (res?.data as any)?.map((el: any) => {
            return {
              label: el.username,
              value: el.id,
            };
          }) || [];
      }
    };

    // GetFeishuDepartmentList
    const reqFeishuDep = ref([
      {
        id: 100000,
        name: '全选',
        sons: [] as any[],
      },
    ]);
    const getFeishuDepartmentList = async () => {
      const res = await GetAssessment_management_department_list({
        assessment_management_id: assessment_management_id,
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
    getFeishuDepartmentList();
    const treeRef = ref<ITreeRef>();

    const eachDemp = (data: any, list: any[]) => {
      list.push(data.id);
      data.sons?.forEach((item: any) => eachDemp(item, list));
      return list.join(',');
    };

    const deleteAssessment = async (id: number) => {
      const result = await AsyncConfirm(ctx, {
        title: '确定删除此考核详情吗？',
      });
      if (!result) {
        return;
      }
      deleteLoading.value = true;
      const res = await DeleteAssessmentDetail({ id_list: [id] });
      deleteLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message);
        reqList.reload();
      } else {
        ctx.root.$message.error(res.data.message);
      }
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
    const routes = [
      {
        title: '考核管理',
        name: RouterNamePerformance.assessment.manage.list,
      },
      {
        title: '考核详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    onActivated(() => {
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    });
    return {
      selectedNodes,
      deleteLoading,
      formData,
      config,
      columns,
      reqList,
      dialogLauch,
      dialogSetLevel,
      dialogLaunchScore,
      dialogOverdueRestart,
      assessment_management_id,
      groupOptions,
      is_can_start_score,
      reqFeishuDep,
      treeRef,
      eachDemp,
      permission,
      formDataC,
      userList,
      queryUserList,
      removeSubNode,
      resetDepartmentIds,
      dialogResetProcess,
      dialogTransferrals,
      selected,
    };
  },
  render() {
    const { formData, config, permission, formDataC } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.reqList}
        value={formDataC}
        config={config}
      >
        <el-form-item label="员工花名：">
          <el-input placeholder="请填写" v-model={formData.username} />
        </el-form-item>
        <el-form-item label="考核部门：">
          <el-popover
            placement="bottom-start"
            trigger="click"
            popper-class="marketing-department-tree-popper-class el-tree-popper-mini"
          >
            <div slot="reference" class="repain-select" style="display: block">
              <el-input
                value={this.selectedNodes.length ? ' ' : undefined}
                style="color: var(--placeholder-color)"
                placeholder="请选择项目所属部门"
                class="department-input"
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
                on-check={() => {
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
                  //   // this.treeRef?.setCheckedKeys([node.id]);
                  //   // this.treeRef?.setCheckedKeys([this.treeRef?. node.id]);
                  //   set(formData, 'department_id_input', node.name);
                  // set(formData, 'feishu_department_id_list', this.eachDemp(node, []));
                  // } else {
                  //   set(formData, 'department_id_input', '');
                  //   set(formData, 'feishu_department_id_list', []);
                  // }
                }}
              />
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="发起人：">
          <Select
            options={this.userList}
            v-model={formData.launch_user_id}
            filterable
            remote
            remote-method={this.queryUserList}
            placeholder="请输入并选择发起人"
            // remote-method={(name: string) => this.groupOptions.pagination.reQuery({ name })}
          />
          {/* <el-input v-model={formData.launch_user_id} placeholder="请输入" /> */}
        </el-form-item>
        <el-form-item label="考评组：">
          <Select
            options={this.groupOptions.data as any}
            v-model={formData.evaluation_group_id}
            filterable
            // remote
            // remote-method={(name: string) => this.groupOptions.pagination.reQuery({ name })}
          />
        </el-form-item>
        <el-form-item label="考核状态：">
          <Select
            options={EASSESSMENT_STATUS_OPTIONS}
            v-model={formData.overdue_status}
            filterable
          />
        </el-form-item>
        <el-form-item label="考核阶段：">
          <Select
            options={EASSESSMENT_STAGE_OPTIONS}
            v-model={formData.stage}
            filterable
            multiple={true}
            collapse-tags={true}
          />
        </el-form-item>
        <el-form-item label="改进状态：">
          <Select
            popper-class="el-select-popper-mini"
            placeholder="请选择绩效改进状态"
            v-model={formData.improvement_status}
            options={IMPROVEMENT_STATUS_OPTIONS}
          />
        </el-form-item>
        <div slot="btnLine" class="btns-line">
          {permission.assessment_management_score && (
            <tg-button
              type="primary"
              size="small"
              disabled={!this.is_can_start_score || this.selected.length}
              onClick={() => {
                this.dialogLaunchScore.show(this.assessment_management_id);
              }}
            >
              发起评分
            </tg-button>
          )}
          {permission.restart_overdue && (
            <tg-button
              // type="primary"
              disabled={this.selected.length}
              style="margin-left: 8px;"
              size="small"
              onClick={() => {
                this.dialogOverdueRestart.show(this.assessment_management_id);
              }}
            >
              逾期重启
            </tg-button>
          )}
          {permission.batch_reset && (
            <tg-button
              // type="primary"

              style="margin-left: 8px;"
              size="small"
              disabled={!this.selected.length}
              onClick={() => {
                this.dialogResetProcess.show(this.selected);
              }}
            >
              批量重置
            </tg-button>
          )}
          {/* permission.assessment_management_transfer */}
          {permission.assessment_management_transfer && (
            <tg-button
              // type="primary"
              class="el-btn-mini"
              style="margin-left: 8px;"
              size="small"
              disabled={!this.selected.length}
              onClick={() => {
                this.dialogTransferrals.show(this.selected);
              }}
            >
              批量转交
            </tg-button>
          )}
        </div>
        {/* <tg-mask-loading
          visible={this.deleteLoading}
          content="  正在删除，请稍等..."
        ></tg-mask-loading> */}
      </ListGenerallyTemplate>
    );
  },
});
