import { ECYCLE_TYPE_OPTIONS, INDICATOR_TYPE_OPTIONS } from '@/const/performance';
import {
  QueryHistoryAssessmentIndicators,
  Query_Assessment_Detail_My_Performance,
} from '@/services/performance';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';

interface QueryFormType {
  cycle: number | undefined;
  assessment: number | undefined;
  indicType: number | undefined;
}

type IndicatorsType = Omit<NPerformance.Indicators, 'id'>;

export default defineComponent({
  setup(props, ctx) {
    const queryForm = ref<QueryFormType>({
      assessment: undefined,
      cycle: undefined,
      indicType: undefined,
    });

    const enabledIndicTypeOptions = ref<number[]>([]);

    const allChecked = ref(false);
    const indeterminate = ref(false);
    const indicList = ref<IndicatorsType[]>([]);
    const selectedIndicNameList = ref<string[]>([]);
    const selectedIndicList = ref<IndicatorsType[]>([]);
    const assessmentList = ref<NPerformance.IAssessmentPeople[]>([]);
    const current_assessment_detail_id = ref();
    const router = useRouter();
    const methods = {
      show(val: any, indicList: number[], assessment_detail_id: number) {
        enabledIndicTypeOptions.value = indicList || [];
        const id = Number(router.currentRoute.params.id || 0);
        current_assessment_detail_id.value = assessment_detail_id || id ? Number(id) : undefined;
        methods.queryAssessmentDetail();
      },
      dialogSubmit() {
        // console.log(selectedIndicNameList);
      },
      resetAllCheck() {
        allChecked.value =
          indicList.value.length > 0 &&
          indicList.value.every(el => selectedIndicNameList.value.indexOf(el.name) !== -1);
        // selectedIndicIdList.value.length === indicList.value.length;
        indeterminate.value =
          indicList.value.find(el => selectedIndicNameList.value.indexOf(el.name) !== -1) &&
          !allChecked.value
            ? true
            : false;
        // selectedIndicIdList.value.length > 0 &&
        //   selectedIndicIdList.value.length < indicList.value.length;
      },
      async queryAssessmentDetail() {
        const res = await Query_Assessment_Detail_My_Performance(
          {
            num: 1000,
            page_num: 1,
          },
          {
            // is_finish: 1,
            search_type: 1,
            cycle_type: queryForm.value.cycle,
          },
        );
        if (res.data.success) {
          const router = useRouter();
          const { id } = router.currentRoute.params;
          assessmentList.value = (res.data.data.data || []).filter(
            (item: { id: number | string }) => {
              return String(item.id) !== String(id || '');
            },
          );
          queryForm.value.assessment = assessmentList.value[0]?.id;
          // methods.queryHistoryAssessmentIndicators();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onCancelHandler() {
        ctx.emit('cancel');
      },
      async onReplaceHandler() {
        if (!selectedIndicNameList.value.length) {
          ctx.root.$message.warning('请先选择历史指标');
          return;
        }
        const res = await AsyncConfirm(ctx, {
          title: '已选历史指标会替换该维度的原有指标，请确认是否替换？',
        });
        if (res) {
          ctx.emit('close');
          ctx.emit('submit', selectedIndicList.value, true);
        }
      },
      onSunbmitHandler() {
        if (!selectedIndicNameList.value.length) {
          ctx.root.$message.warning('请先选择历史指标');
          return;
        }
        ctx.emit('close');
        ctx.emit('submit', selectedIndicList.value, false);
      },
      async queryHistoryAssessmentIndicators() {
        if (!queryForm.value.assessment) {
          indicList.value = [];
          return;
        }
        const res = await QueryHistoryAssessmentIndicators({
          current_assessment_detail_id: current_assessment_detail_id.value,
          assessment_detail_id: queryForm.value.assessment,
          dimension_type_list:
            queryForm.value.indicType === undefined
              ? enabledIndicTypeOptions.value
              : [queryForm.value.indicType],
        });
        if (res.data.success) {
          indicList.value = res.data.data || [];
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
    };

    const operatorDisabled = computed(() => {
      if (selectedIndicNameList.value.length === 0) {
        return true;
      }
      return false;
    });

    watch(
      () => indicList.value,
      () => {
        methods.resetAllCheck();
      },
    );

    watch(
      () => queryForm.value.cycle,
      () => {
        methods.queryAssessmentDetail();
      },
    );

    watch(
      () => [queryForm.value.indicType, queryForm.value.assessment],
      () => {
        methods.queryHistoryAssessmentIndicators();
      },
    );

    watch(
      () => selectedIndicNameList.value,
      (val: string[]) => {
        const oldList = selectedIndicList.value.filter(el => val.find(subEl => subEl === el.name));
        const newList = indicList.value.filter(el => val.find(subEl => subEl === el.name));
        const diffList = newList.filter(el =>
          oldList.find(subEL => subEL.name === el.name) ? false : true,
        );
        selectedIndicList.value = [...oldList, ...diffList];
        // newList.forEach(el => {
        //   const finder = oldList.find(subEl => subEl.id === el.id);
        //   if (!finder) {
        //     selectedIndicList.value.push(el);
        //   }
        // });
      },
    );

    return {
      queryForm,
      allChecked,
      indeterminate,
      indicList,
      assessmentList,
      operatorDisabled,
      enabledIndicTypeOptions,
      selectedIndicNameList,
      ECYCLE_TYPE_OPTIONS,
      INDICATOR_TYPE_OPTIONS,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-copy-history-indic-page-container">
        <section class="content">
          <el-form size="small" label-width="70px">
            <el-form-item label="周期类型：">
              <el-select v-model={this.queryForm.cycle} style="width: 100%">
                <el-option label="全部" value={undefined}></el-option>
                {this.ECYCLE_TYPE_OPTIONS.map(el => (
                  <el-option label={el.label} value={el.value} key={el.value}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="绩效表：">
              <el-select v-model={this.queryForm.assessment} style="width: 100%">
                {this.assessmentList.map(el => (
                  <el-option
                    label={el.assessment_management_name}
                    value={el.id}
                    key={el.id}
                  ></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="指标类型：">
              <el-select v-model={this.queryForm.indicType} style="width: 100%">
                <el-option label="全部" value={undefined}></el-option>
                {this.INDICATOR_TYPE_OPTIONS.map(el => (
                  <el-option
                    label={el.label}
                    value={el.value}
                    key={el.value}
                    disabled={this.enabledIndicTypeOptions.indexOf(el.value) === -1}
                  ></el-option>
                ))}
              </el-select>
            </el-form-item>
          </el-form>
          <section class="content-list">
            <el-checkbox
              v-model={this.allChecked}
              indeterminate={this.indeterminate}
              on-change={(val: boolean) => {
                if (val) {
                  // this.selectedIndicIdList = this.indicList.map(el => el.id);
                  this.selectedIndicNameList = [
                    ...this.selectedIndicNameList,
                    ...this.indicList
                      .filter(el => this.selectedIndicNameList.indexOf(el.name) === -1)
                      .map(el => el.name),
                  ];
                } else {
                  // this.selectedIndicIdList = [];
                  this.selectedIndicNameList = this.selectedIndicNameList.filter(el => {
                    const finder = this.indicList.every(subEl => subEl.name !== el);
                    return finder;
                  });
                }
                this.indeterminate = false;
              }}
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model={this.selectedIndicNameList}
              on-change={() => {
                this.resetAllCheck();
              }}
              class="content-items"
            >
              {this.indicList.map(el => {
                return (
                  <div class="content-item">
                    <el-checkbox label={el.name} key={el.name}>
                      {el.name}
                    </el-checkbox>
                    <span class="content-label">
                      {el.weight === undefined || el.weight === null ? '' : `${el.weight}%`}
                    </span>
                  </div>
                );
              })}
            </el-checkbox-group>
          </section>
        </section>
        <section class="footer">
          <div class="selectedLabel">{`已选择：${this.selectedIndicNameList.length || 0}个`}</div>
          <tg-button on-click={this.onCancelHandler}>取消</tg-button>
          <tg-button on-click={this.onReplaceHandler} disabled={this.operatorDisabled}>
            替换
          </tg-button>
          <tg-button
            type="primary"
            on-click={this.onSunbmitHandler}
            disabled={this.operatorDisabled}
          >
            添加
          </tg-button>
        </section>
      </div>
    );
  },
});
