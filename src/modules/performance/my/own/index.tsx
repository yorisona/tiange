import { defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { EASSESSMENT_STAGE_MAP, EASSESSMENT_STAGE_OPTIONS } from '@/const/performance';
// import { RouterNamePerformance } from '@/const/router';
import {
  Query_Assessment_Name,
  Query_Evaluation_Group_Name,
  Query_My_Performance,
  QueryNowYearPerformanceBonus,
} from '@/services/performance';
// import { useRouter } from '@/use/vue-router';

export default defineComponent({
  setup: () => {
    // const router = useRouter();
    const columns: TgTableColumn<NPerformance.IAssessmentPeople>[] = [
      {
        align: 'left',
        label: '考核名称',
        minWidth: 100,
        prop: 'assessment_management_name',
      },
      {
        align: 'left',
        label: '考核周期',
        prop: 'assessment_cycle',
        minWidth: 100,
      },
      {
        align: 'left',
        label: '考评组',
        formatter: row => {
          return row.evaluation_group?.name ?? '--';
        },
        showOverflowTooltip: true,
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
          return row.present_person?.name ?? '--';
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
        minWidth: 60,
        formatter: row => {
          return (
            <div>
              <tg-button
                type="link"
                onClick={() => {
                  // router.push({
                  //   name: RouterNamePerformance.my.own.detail,
                  //   params: {
                  //     id: row.id as any,
                  //   },
                  // });
                  window.open(`/performance/my/own/${row.id}`, '_blank');
                }}
              >
                查看
              </tg-button>
            </div>
          );
        },
      },
    ];

    const reqList = usePagination(Query_My_Performance);

    const groupOptions = usePagination(Query_Evaluation_Group_Name, {
      defaultParams: [{ num: 20, page_num: 1 }, { search_type: 1 }],
      transform(res: any) {
        return res.data.map((item: NPerformance.IEvaluationGroup) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    });
    const reqAssess = useRequest(Query_Assessment_Name, {
      defaultParams: [
        { num: 1000000, page_num: 1 },
        { is_my_assessment: 1, search_type: 1 },
      ],
      transform: data => {
        return data.data.map(item => {
          return {
            label: item.assessment_cycle,
            value: item.id,
          };
        });
      },
    });
    const performanceBonus = useRequest(QueryNowYearPerformanceBonus, {
      transform: data => {
        return data.year_performance_bonus;
      },
    });

    const formData = ref<any>({});
    const config = {
      reset: () => {
        formData.value = {};
      },
    };
    return {
      columns,
      reqList,
      formData,
      config,
      groupOptions,
      reqAssess,
      performanceBonus,
    };
  },
  render() {
    const { formData } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.reqList}
        v-model={formData}
        config={this.config}
      >
        <el-form-item label="考核周期：">
          <Select
            placeholder="请选择考核周期"
            popper-class="el-select-popper-mini"
            options={this.reqAssess.data as any}
            v-model={formData.assessment_management_id}
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
              this.groupOptions.pagination.reQuery({ name, search_type: 1 })
            }
          />
        </el-form-item>
        <el-form-item label="考核阶段：">
          <Select
            popper-class="el-select-popper-mini"
            placeholder="请选择考核阶段"
            options={EASSESSMENT_STAGE_OPTIONS}
            v-model={formData.stage}
          />
        </el-form-item>
        <div
          slot="btnLine"
          v-show={this.performanceBonus.data}
          style="font-size:12px;"
          class="bonus-box"
        >
          <img class="logo" src={require('@/assets/img/performance/bonus.png')} alt="" />
          恭喜您！{new Date().getFullYear()}年度，您已因绩效优秀额外拿到了
          <span class="val">{this.performanceBonus.data}</span> 元绩效奖金！
        </div>
      </ListGenerallyTemplate>
    );
  },
});
