import { defineComponent, ref } from '@vue/composition-api';
import { EASSESSMENT_STAGE, EASSESSMENT_STAGE_OPTIONS } from '@/const/performance';

export interface IStepRef {
  updateData(config: any): void;
}

export default defineComponent({
  props: {
    showRealName: {
      type: Boolean,
      default: () => true,
    },
  },
  setup: () => {
    // 数据
    const data = ref<any>({});
    // 考核状态
    const steps = ref(EASSESSMENT_STAGE_OPTIONS.map(it => ({ ...it })));
    const updateData = (value: any) => {
      data.value = value;

      // 目标确认开关
      if (value.is_target_confirmed !== true) {
        disabledStep(EASSESSMENT_STAGE.TARGET_CONFIRM);
      }
      if (value.is_superior_rating !== true) {
        disabledStep(EASSESSMENT_STAGE.SUPERIOR);
      }
      if (value.is_self_evaluation !== true) {
        disabledStep(EASSESSMENT_STAGE.SELF);
      }
    };

    const disabledStep = (value: EASSESSMENT_STAGE) => {
      steps.value = steps.value.filter(item => {
        return item.value !== value;
      });
    };

    return {
      steps,
      data,
      updateData,
      disabledStep,
    };
  },
  render() {
    const { data } = this;
    return (
      <div class="steps-box">
        {this.steps.map(item => {
          let stepClassName = 'step';
          if (data.present_stage > item.value) stepClassName = `${stepClassName} success`;
          if (data.present_stage === item.value) stepClassName = `${stepClassName} active`;
          let names = '';
          switch (item.value) {
            case EASSESSMENT_STAGE.TARGET_SETTING:
              names = `${data.operator_person?.username ?? '--'} (${
                data.operator_person?.real_name ?? '--'
              })`;
              break;
            case EASSESSMENT_STAGE.SELF:
            case EASSESSMENT_STAGE.SIGNATURE:
            case EASSESSMENT_STAGE.IN_PROGRESS:
              names = `${data.username ?? '--'} ${data.real_name ? ` (${data.real_name})` : ''}`;
              break;
            case EASSESSMENT_STAGE.TARGET_CONFIRM:
              names = `${data.confirmer_person?.username ?? '--'} ${
                data.confirmer_person?.real_name ? ` (${data.confirmer_person?.real_name})` : ''
              }
              `;
              break;
            case EASSESSMENT_STAGE.SUPERIOR:
              if (data.superior_rating_link_list && data.superior_rating_link_list.length > 0) {
                const filterSuperior_rating_link_list = () => {
                  const removeDuplicateObj = (arr: any) => {
                    const obj: any = {};
                    arr = arr.reduce((newArr: any, next: any) => {
                      console.log(next, obj, ' obj[next.user_id]');
                      if (!obj[next.user_id] || next.link === 3) {
                        obj[next.user_id] = true;
                        newArr.push(next);
                      } else if (obj[next.user_id]) {
                        if (next.is_close === 0 && next.link !== 3) {
                          next.flag = true;
                          newArr.push(next);
                          newArr.splice(
                            newArr.findIndex((v: any) => v.user_id === next.user_id && !v.flag),
                            1,
                          );
                        }
                      }
                      return newArr;
                    }, []);
                    return arr;
                  };
                  return removeDuplicateObj(data.superior_rating_link_list);
                };
                const link_list: any[] = [...filterSuperior_rating_link_list()];
                console.log(link_list, 'filterSuperior_rating_link_list');

                const openIndex = link_list.findIndex((it: any) => it.is_close === 0);
                console.log(openIndex, 'openIndex');

                console.log(data, 'data');
                names = link_list.map((item: any, index: number) => {
                  let hasPresent = '';
                  if (data.present_stage === EASSESSMENT_STAGE.SUPERIOR && openIndex === index) {
                    hasPresent = 'present';
                  }
                  return (
                    <span class={hasPresent}>{`${item.user_name ?? '--'} ${
                      item.real_name ? ` (${item.real_name})` : ''
                    }`}</span>
                  );
                }) as any;
              }
              break;
          }
          return (
            <div class={stepClassName}>
              <div class="step-target">
                <span>{item.label}</span>
              </div>
              <div class="step-names">{names}</div>
            </div>
          );
        })}
      </div>
    );
  },
});
