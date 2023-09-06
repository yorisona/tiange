import { defineComponent, inject, provide, ref } from '@vue/composition-api';
import { RouterNamePerformance } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import {
  Check_Evaluation_Group_User_Ids,
  Save_or_Modify_Evaluation_Group,
} from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import { loadLocalAssessment, saveLocalAssessment } from '@/modules/performance/assessment/common';
import SelectAssessor from './dialog/selectAssessor/index.vue';
import { isEmpty } from '@/utils/func';
import { Confirm } from '@/use/asyncConfirm';
const routes = [
  {
    title: '考评组',
    name: RouterNamePerformance.assessment.list,
  },
  {
    path: '',
    title: '新增考评组',
  },
];
const tabs = [
  {
    title: '基础信息',
    name: RouterNamePerformance.assessment.create.base,
  },
  {
    title: '模板指标',
    name: RouterNamePerformance.assessment.create.indicators,
  },
  {
    title: '考评流程',
    name: RouterNamePerformance.assessment.create.process,
  },
];

export default defineComponent({
  components: {
    SelectAssessor,
  },
  beforeRouteLeave(to, form, next) {
    this.saveLocal();
    next();
  },
  setup() {
    const router = useRouter();
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const createRef = ref<{ validate: () => Promise<void> }>();
    const selectAssessorRef = ref<{ show: IAnyFunc }>();
    const formData = ref<NPerformance.IEvaluationGroup>(loadLocalAssessment());
    provide('formData', formData);

    const reqSaveorModifyEvaluationGroup = useRequest(Save_or_Modify_Evaluation_Group, {
      manual: true,
    });

    const saveLocal = () => saveLocalAssessment(formData.value);

    const preview = () => {
      Promise.resolve()
        .then(check)
        .then(() => {
          selectAssessorRef.value?.show(formData.value);
        })
        .catch(ex => {
          Message.error(ex.message);
        });
    };

    const check = async () => {
      if (isEmpty(formData.value.name)) throw new Error('基础信息：请填写考评组名称');
      if (isEmpty(formData.value.cycle_type)) throw new Error('基础信息：请选择周期类型');
      if (formData.value.by_evaluation_person.length === 0)
        throw new Error('基础信息：请选择被考核人员');
      if (formData.value.assessment_dimension_list.length === 0)
        throw new Error('模板指标：请至少维护一个考核维度');
      const find = formData.value.assessment_dimension_list.find(
        it => it.is_modify_delete === false && it.indicator_list.length === 0,
      );
      if (find)
        throw new Error(
          `模板指标：因[${find.name}]维度不允许被考核人编辑和删除指标，请至少维护一个考核指标`,
        );

      if (formData.value.is_target_confirmed) {
        if (isEmpty(formData.value.operator)) throw new Error('考评流程：请选择目标制定人');
        if (isEmpty(formData.value.confirmer)) throw new Error('考评流程：请选择目标确认人');
      }

      if (formData.value.is_self_evaluation) {
        if (isEmpty(formData.value.weight)) throw new Error('考评流程：请填写自评权重');
      }

      if (formData.value.is_superior_rating) {
        for (let i = 0; i < formData.value.superior_rating.length; i++) {
          const tmp = formData.value.superior_rating[i];
          if (isEmpty(tmp.weight)) throw new Error('考评流程：请填写上级评分人权重');
          if (tmp.is_transfer === undefined) tmp.is_transfer = false;
        }
      }
    };

    const jumpTab = (name: string) => {
      Promise.resolve()
        .then(() => {
          if (createRef.value?.validate) return createRef.value?.validate();
        })
        .then(async () => {
          await router.push({
            name,
          });
          showBackTitleHandle(routes);
        });
    };

    const submit = () => {
      Promise.resolve()
        .then(check)
        .then(() => {
          return Check_Evaluation_Group_User_Ids({
            user_id_list: formData.value.by_evaluation_person.map(it => it.user_id) as any,
            cycle_type: formData.value.cycle_type,
            evaluation_group_id: formData.value.id,
          }).then(res => {
            if (!res.data.success) throw new Error(res.data.message);
            const data = res.data.data.data;
            if (data.length === 0) return;
            const userList = data.map(it => it.username).join('、');
            return Confirm({
              title: undefined as any,
              content: `${userList}已被添加到其他考评组中，是否确认变更到${formData.value.name}考评组？`,
            })
              .then(() => {
                formData.value.remove_user_id_list = data.map(it => it.user_id);
              })
              .catch(() => new Promise(() => {}));
          });
        })
        .then(() => {
          const submitParams: any = { ...formData.value };
          if (!submitParams.is_superior_rating) {
            submitParams.superior_rating.forEach((it: any) => {
              it.weight = null;
            });
          }
          if (!submitParams.is_self_evaluation) {
            submitParams.weight = null;
          }
          submitParams.is_superior_leader_rating = !!submitParams.is_superior_leader_rating;
          reqSaveorModifyEvaluationGroup.runAsync(submitParams).then(() => {
            Message.success(formData.value.id ? '修改成功' : '添加成功');
            router.push({
              name: RouterNamePerformance.assessment.list,
            });
          });
        })
        .catch(ex => {
          Message.error(ex.message);
        });
    };

    return {
      saveLocal,
      createRef,
      jumpTab,
      preview,
      submit,
      selectAssessorRef,
    };
  },
  render() {
    const currentRouterName = this.$route.name;
    return (
      <div class="tg-page-container page-content-container">
        <div class="tg-tabs tg-tabs-line bg-white">
          <div class="tg-tabs-header flex-fill">
            <div class="tg-tabs-header-tab-list" style="height:48px;line-height:48px">
              {tabs.map(it => {
                const hasActive = it.name === currentRouterName;
                return (
                  <div
                    class={`tg-tabs-header-tab-item ${
                      hasActive ? 'tg-tabs-header-tab-item-active' : ''
                    }`}
                    onclick={() => {
                      if (hasActive) return;
                      this.jumpTab(it.name);
                    }}
                  >
                    {it.title}
                  </div>
                );
              })}
            </div>
          </div>
          <div class="group">
            <tg-button onClick={this.preview}>预览</tg-button>
            <tg-button type="primary" onClick={this.submit}>
              保存
            </tg-button>
          </div>
        </div>
        <div class="assessment_content">
          <router-view ref="createRef" />
        </div>
        <select-assessor ref="selectAssessorRef" />
      </div>
    );
  },
});
