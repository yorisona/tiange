import { defineComponent, Ref, ref, inject, computed, onActivated } from '@vue/composition-api';
import { ECYCLE_TYPE_OPTIONS } from '@/const/performance';
import selectPeople from '../dialog/selectPeople/index.vue';
import { useDialog } from '@/use/dialog';
import { RouterNamePerformance } from '@/const/router';
export default defineComponent({
  setup() {
    const formData = inject('formData') as Ref<NPerformance.IEvaluationGroup>;
    const formRef = ref<IFormRef>();

    const validate = () => {
      return Promise.resolve();
      // return new Promise(resolve => {
      //   formRef.value?.validate((err: any) => {
      //     if (!err) return;
      //     resolve(undefined);
      //   });
      // });
    };
    const by_evaluation_person = computed(() => {
      let str = '';
      const showLength = 2;
      const personLength = formData.value.by_evaluation_person.length;
      const showNames = formData.value.by_evaluation_person.slice(0, showLength);
      str = showNames
        .map(it => {
          return it.username;
        })
        .join('、');
      if (personLength > showLength) {
        str = `${str}等${personLength}人`;
      }
      return str;
    });
    const dialogSelectPeople = useDialog({
      component: selectPeople,
      title: '选择考核人员',

      width: '900px',
      on: {
        submit: (value: any) => {
          formData.value.by_evaluation_person = value;
        },
      },
    });
    const routes = [
      {
        title: '考评组',
        name: RouterNamePerformance.assessment.list,
      },
      {
        title: '新增考评组',
      },
    ];
    onActivated(() => {
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    });
    return { formData, formRef, validate, by_evaluation_person, dialogSelectPeople };
  },
  render() {
    const { formData } = this;
    return (
      <div>
        <el-form
          ref="formRef"
          size="mini"
          label-width="110px"
          attrs={{
            model: this.formData,
          }}
        >
          <el-form-item
            label="考评组名称："
            prop="name"
            rules={[{ required: true, message: '请填写考评组名称' }]}
          >
            <el-input placeholder="请填写考评组名称" v-model={formData.name} style="width:208px" />
          </el-form-item>
          <el-form-item
            class="text-item"
            label="周期类型："
            prop="cycle_type"
            rules={[{ required: true, message: '选择周期类型' }]}
          >
            {ECYCLE_TYPE_OPTIONS.map(item => {
              return (
                <el-radio
                  size="small"
                  name="cycle_type"
                  v-model={this.formData.cycle_type}
                  label={item.value}
                >
                  {item.label}
                </el-radio>
              );
            })}
          </el-form-item>
          <el-form-item label="被考核人员：" prop="check_standard">
            <div
              style="width:264px"
              onClick={() => {
                this.dialogSelectPeople.show(formData.by_evaluation_person);
              }}
            >
              <el-input
                value={this.by_evaluation_person}
                placeholder="请选择人员"
                style="width:100%"
                readonly
              >
                <i class="el-icon-edit el-input__icon" slot="suffix" />
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
