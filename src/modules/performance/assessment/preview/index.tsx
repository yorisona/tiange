import { defineComponent, inject, onActivated, ref } from '@vue/composition-api';
import {
  appendEmptyIndc,
  loadLocalAssessment,
  replaceEnter,
  useTransformAssessToTable,
} from '@/modules/performance/assessment/common';
import { RouterNamePerformance } from '@/const/router';
import { TgTableColumn } from '@/types/vendor/column';
import { useRouter } from '@/use/vue-router';
import { IStepRef } from '@/modules/performance/components/steps';
import Steps from '@/modules/performance/components/steps/index.vue';
import selectAssessor from '@/modules/performance/assessment/create/dialog/selectAssessor/index.vue';
import { Getuser_Leader_By_Subordinate_Id } from '@/services/performance';
import { EINDICATOR_TYPE } from '@/const/performance';
import { isEmpty } from '@/utils/func';
const routes = [
  {
    title: '考评组',
    name: RouterNamePerformance.assessment.list,
  },
  {
    title: '新增考评组',
    name: RouterNamePerformance.assessment.create.base,
  },
  {
    title: '预览',
  },
];
interface ISelf {
  real_name: string;
  username: string;
  user_id: number;
}
export default defineComponent({
  components: {
    Steps,
    selectAssessor,
  },
  setup: () => {
    onActivated(() => {
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    });
    const router = useRouter();
    const formData = ref(loadLocalAssessment());
    appendEmptyIndc(formData.value);
    const data = ref(useTransformAssessToTable(formData.value));
    const columns: TgTableColumn<
      NPerformance.Indicators & { assessment_dimension: NPerformance.IEvaluationDimension }
    >[] = [
      {
        align: 'center',
        label: '维度',
        minWidth: 150,
        formatter: row => {
          return row.assessment_dimension.name;
        },
      },
      {
        label: '指标名称',
        minWidth: 150,
        prop: 'name',
      },
      {
        label: '目标值',
        minWidth: 150,
        prop: 'is_target',
      },
      {
        label: '指标定义',
        minWidth: 150,
        prop: 'remark',
      },
      {
        label: '考核标准',
        minWidth: 150,
        prop: 'check_standard',
        formatter(row) {
          return row.check_standard ? replaceEnter(row.check_standard) : '--';
        },
      },
      {
        label: '权重',
        minWidth: 70,
        align: 'right',
        prop: 'weight',
        formatter: row => {
          switch (row.indicator_type) {
            case EINDICATOR_TYPE.DEDUCT:
            case EINDICATOR_TYPE.BONUS:
              return '--';
            case EINDICATOR_TYPE.QUALITATIVE:
            case EINDICATOR_TYPE.RATION:
              if (isEmpty(row.weight)) return '';
              return `${row.weight}%`;
          }
        },
      },
    ];
    const currentSelectInfo = ref<
      TG.HttpResultType<typeof Getuser_Leader_By_Subordinate_Id> & { self: ISelf }
    >({
      self: {},
      leader: {},
      job_title: '',
    } as any);

    const stepsRef = ref<IStepRef>();
    const selectAssessorRef = ref<{ show: IAnyFunc }>();

    const init = (userid: number) => {
      const findUser = formData.value.by_evaluation_person.find(
        it => Number(it.user_id) === userid,
      );
      if (findUser) {
        currentSelectInfo.value.self = findUser;
      }

      Getuser_Leader_By_Subordinate_Id(userid)
        .then(res => {
          if (res.data.success) {
            const data = res.data.data;
            data.leaders.forEach(item => {
              if (!item.username) item.username = '--';
              if (!item.real_name) item.real_name = '--';
            });
            currentSelectInfo.value.leaders = data.leaders;
            currentSelectInfo.value.job_title = data.job_title ?? '--';
          }
        })
        .then(() => {
          const _formData: any = { ...formData.value };
          let leaderName = '--';
          let leaderRealname = '--';
          if (currentSelectInfo.value.leaders.length > 0) {
            leaderName = currentSelectInfo.value.leaders[0].username;
            leaderRealname = currentSelectInfo.value.leaders[0].real_name;
          }

          const username = currentSelectInfo.value.self.username;
          const real_name = currentSelectInfo.value.self.real_name;
          _formData.username = username;
          _formData.real_name = real_name;

          _formData.operator_person = {
            username: _formData.operator === 2 ? leaderName : username,
            real_name: _formData.operator === 2 ? leaderRealname : real_name,
          };

          _formData.confirmer_person = {
            username:
              _formData.confirmer === 2
                ? leaderName
                : _formData.confirmer === 3
                ? _formData.confirmer_transfer_user_name
                : username,
            real_name:
              _formData.confirmer === 2
                ? leaderRealname
                : _formData.confirmer === 3 //3为指定人员
                ? _formData.confirmer_transfer_user_real_name
                : real_name,
          };
          _formData.superior_rating_link_list = currentSelectInfo.value.leaders.map((item: any) => {
            item.user_name = item.username;
            return item;
          });
          /* 当指定上级评分人 */
          if (
            _formData.superior_rating.length > 0 &&
            _formData.superior_rating[0].scorer.manager === 5
          ) {
            _formData.superior_rating_link_list = [
              {
                user_name: _formData.superior_rating[0].scorer.transfer_user_name,
                real_name: _formData.superior_rating[0].scorer.transfer_user_real_name,
              },
            ];
          }
          console.log(_formData, '_formData');

          stepsRef.value?.updateData(_formData);
        });
    };

    init(Number(router.currentRoute.query.user_id));
    return { formData, data, columns, currentSelectInfo, stepsRef, selectAssessorRef, init };
  },
  beforeRouteUpdate(to, form, next) {
    next();
    this.init(Number(to.query.user_id));
  },
  render() {
    const { selectAssessorRef, formData, currentSelectInfo } = this;
    return (
      <div class="tg-page-container page-content-container">
        <div class="container">
          <div class="userinfo-box">
            <tg-icon class="avatar" name="ico-default-avatar" />
            <div class="userinfo">
              <span class="name">
                {currentSelectInfo.self?.username}（{currentSelectInfo.self?.real_name}）
              </span>
              <span class="job">{currentSelectInfo.job_title}</span>
            </div>
            <tg-button
              class="mgl-18"
              onclick={() => {
                selectAssessorRef?.show(formData);
              }}
            >
              更换
            </tg-button>
          </div>
          <steps ref="stepsRef" />
          <div class="table-box">
            <tg-table
              border
              columns={this.columns}
              data={this.data}
              span-method={({ row, columnIndex }: any) => {
                if (columnIndex === 0 && row.span) return row.span;
                return [1, 1];
              }}
            />
          </div>
        </div>
        <select-assessor ref="selectAssessorRef" />
      </div>
    );
  },
});
