import { defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { ECYCLE_TYPE_MAP, ECYCLE_TYPE_OPTIONS } from '@/const/performance';
import { RouterNamePerformance } from '@/const/router';
import { Delete_Evaluation_Group, Query_Evaluation_Group } from '@/services/performance';
import { Confirm } from '@/use/asyncConfirm';
import { useRouter } from '@/use/vue-router';
import {
  defaultAssessment,
  resetLocalAssessment,
  saveLocalAssessment,
} from '@/modules/performance/assessment/common';
import copyEvalGroup from './dialog/copyEvalGroup/index.vue';
import { useDialog } from '@/use/dialog';
import { usePermission } from '@/use/permission';
export default defineComponent({
  setup: () => {
    const router = useRouter();
    const permission = usePermission();
    const columns: TgTableColumn<NPerformance.IEvaluationGroup>[] = [
      {
        label: '考评组名称',
        prop: 'name',
      },
      {
        label: '参与人数',
        formatter: row => {
          return `${row.by_evaluation_person.length}人`;
        },
      },
      {
        label: '周期类型',
        formatter: row => {
          return ECYCLE_TYPE_MAP.get(row.cycle_type);
        },
      },
      { label: '发起考核次数', prop: 'assessment_count' },
      {
        label: '操作',
        minWidth: 60,
        formatter: row => {
          return (
            <div>
              {permission.evaluation_group_edit && (
                <tg-button
                  type="link"
                  onClick={() => {
                    saveLocalAssessment(row);
                    router.push({
                      name: RouterNamePerformance.assessment.create.base,
                    });
                  }}
                >
                  编辑
                </tg-button>
              )}

              {permission.evaluation_group_edit && (
                <tg-button
                  type="link"
                  class="mgl-12"
                  onClick={() => {
                    dialogCopyEvalGroup.show(row);
                  }}
                >
                  复制
                </tg-button>
              )}
              {permission.evaluation_group_delete && (
                <tg-button
                  type="link"
                  class="mgl-12"
                  onClick={async () => {
                    await Confirm('确认删除考评组吗?');
                    reqDel.runAsync(row.id).then(reqList.reload);
                  }}
                >
                  删除
                </tg-button>
              )}
            </div>
          );
        },
      },
    ];

    const reqList = usePagination(Query_Evaluation_Group);
    const reqDel = useRequest(Delete_Evaluation_Group, { manual: true });
    const formData = ref({} as any);
    const config = {
      reset: () => {
        formData.value = {};
      },
    };
    const dialogCopyEvalGroup = useDialog({
      component: copyEvalGroup,

      title: '复制考评组',
      width: '380px',
      on: {
        submit({
          group,
          template,
          process,
        }: {
          group: NPerformance.IEvaluationGroup;
          template: boolean;
          process: boolean;
        }) {
          let data: any;
          // const data: NPerformance.IEvaluationGroup & any = { ...group };
          if (process) {
            data = { ...defaultAssessment(), ...group };
            if (!template) {
              data.assessment_dimension_list = [];
            }
          } else if (template) {
            data = defaultAssessment();
            data.assessment_dimension_list = group.assessment_dimension_list;
            data.cycle_type = group.cycle_type;
          }
          data.id = undefined;
          data.name = undefined;
          data.by_evaluation_person = [];

          saveLocalAssessment(data);
          router.push({
            name: RouterNamePerformance.assessment.create.base,
          });
        },
      },
    });

    return {
      columns,
      reqList,
      formData,
      config,
      dialogCopyEvalGroup,
      permission,
    };
  },
  render() {
    const { formData, permission } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.reqList}
        v-model={this.formData}
        config={this.config}
      >
        <el-form-item label="考评组：">
          <el-input placeholder="请填写" v-model={formData.name} />
        </el-form-item>
        <el-form-item label="周期类型：">
          <Select
            popper-class="el-select-popper-mini"
            options={ECYCLE_TYPE_OPTIONS}
            v-model={formData.cycle_type}
          />
        </el-form-item>
        <div slot="btnLine" class="btns-line">
          {permission.evaluation_group_edit && (
            <tg-button
              type="primary"
              onClick={() => {
                resetLocalAssessment();
                this.$router.push({
                  name: RouterNamePerformance.assessment.create.base,
                });
              }}
            >
              新增考评组
            </tg-button>
          )}
          {permission.evaluation_group_edit && (
            <tg-button style="margin-left: 12px;" onClick={() => this.dialogCopyEvalGroup.show()}>
              复制考评组
            </tg-button>
          )}
        </div>
      </ListGenerallyTemplate>
    );
  },
});
