import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  set,
} from '@vue/composition-api';
import { RouterNamePerformance } from '@/const/router';
import {
  Get_Assessment_Detail_By_My_Performance,
  Modify_Performance_Process,
  Query_Assessment_And_User_By_My_Performance,
  Query_Assessment_Detail_My_Performance,
  RepealAssessmentImprovePlan,
} from '@/services/performance';
import {
  appendEmptyIndc,
  AssessTableStatus,
  useAssessmentTable,
} from '@/modules/performance/assessment/common';
import { Message } from 'element-ui';
import { useRouter } from '@/use/vue-router';
import Steps from '@/modules/performance/components/steps/index.vue';
import { IStepRef } from '@/modules/performance/components/steps';
import { useUserInfo } from '@/use/vuex';
import {
  ALLOW_OPERATOR_CODES,
  AppealStatus,
  EASSESSMENT_STAGE,
  IMPROVEMENT_STATUS,
} from '@/const/performance';
import createIndic from '@/modules/performance/indicatorLibrary/create/index.vue';
import selectDimension from '../../dialog/selectDimension/index.vue';
import developImprovements from '../../dialog/developImprovements/index.vue';
import importIndicator from '@/modules/performance/assessment/create/dialog/importIndicator/index.vue';
import copyHistoryIndic from '@/modules/performance/my/dialog/copyHistoryIndic/index.vue';
import { useDialog, useDrawer } from '@/use/dialog';
import QrcodeVue from 'qrcode.vue';
import selectPeople from '@/modules/performance/my/dialog/selectPeople/index.vue';
import rejectProcess from '@/modules/performance/my/dialog/rejectProcess/index.vue';
import { Confirm } from '@/use/asyncConfirm';
import TgTable from '@/modules/performance/components/table/index.vue';
import { Select } from '@gm/component/select';
import grievanceSubmission from '../../dialog/grievanceSubmission/index.vue';
import { sleep } from '@/utils/func';
import relationProject from '@/modules/performance/assessment/dialog/relationProject/index.vue';

const QRCodeBox = defineComponent({
  components: { QrcodeVue },
  setup() {
    const assTable = ref<any>({});
    const show = (value: any) => {
      assTable.value = value;
    };
    return { show, assTable };
  },
  render() {
    const { assTable } = this;
    return (
      <div class="qrcode-box-2208111613">
        <div class="qrcode">
          <qrcode-vue
            value={`${process.env.VUE_APP_MOBILE_BASE_API}/result/confirmation/${assTable.data?.id}`}
            size="180"
            level="H"
            style="width: 100%; height:100%"
          />
        </div>
        <div class="text">请用微信扫码，在手机上签字确认绩效结果。</div>
      </div>
    );
  },
});

export default defineComponent({
  components: { Steps, TgTable, relationProject },
  setup: () => {
    const router = useRouter();
    const userInfo = useUserInfo();
    const relation_column = ref();
    const dialogRelationProject = useDialog({
      component: relationProject,
      title: '关联项目',
      width: '808px',
      footer: true,
      on: {
        submit(row: NPerformance.Indicators) {
          assTable.tableData = assTable.tableData.map(
            (item: NPerformance.Indicators, index: number) => {
              if (item.id === row.id && relation_column.value === index) {
                return row;
              }
              return item;
            },
          );
          dialogRelationProject.close();
        },
      },
    });
    const detailData = ref({} as any);
    const assTable = useAssessmentTable((row: any, column: number) => {
      relation_column.value = column;
      dialogRelationProject.show(row, detailData.value?.assessment_detail_id);
    });
    const stepsRef = ref<IStepRef>();

    const formEdit = ref({});
    const loadingSubmit = ref(false);
    const AssessmentSearchType = ref(1);
    onUnmounted(() => {
      RefreshAgreeStatus.stop();
    });
    // 监听同意状态下,状态变化
    const RefreshAgreeStatus = {
      timer: undefined as undefined | number,
      params: {} as any,
      doRequest: () => {
        clearTimeout(RefreshAgreeStatus.timer);
        Get_Assessment_Detail_By_My_Performance(RefreshAgreeStatus.params).then(res => {
          if (!res.data.success) return;
          if (res.data.data.present_stage !== EASSESSMENT_STAGE.SIGNATURE) {
            RefreshAgreeStatus.stop();
            onLoadData(res.data.data);
            dialogQRCodeBox.close();
          } else {
            RefreshAgreeStatus.timer = setTimeout(RefreshAgreeStatus.doRequest, 2000);
          }
        });
      },
      start(params: any) {
        this.params = params;
        this.doRequest();
      },
      stop() {
        clearTimeout(this.timer);
      },
    };
    const onLoadData = (data: any) => {
      appendEmptyIndc(data);
      // data.present_stage = EASSESSMENT_STAGE.SELF;
      data.assessment_dimension_list.forEach((item: any, index: number) => {
        item.id = index;
      });
      detailData.value = data;
      assTable.updateDimension(data);
      stepsRef.value?.updateData(data);
      return data;
    };
    let lastParams: any = {};
    const search_type =
      router.currentRoute.name === RouterNamePerformance.my.related.detail
        ? 1
        : router.currentRoute.name === RouterNamePerformance.my.underling.detail
        ? 2
        : 0;
    const loadData = () => {
      const currentParams = { ...lastParams, search_type: AssessmentSearchType.value };
      loadingSubmit.value = true;
      return Get_Assessment_Detail_By_My_Performance(currentParams)
        .then(res => {
          loadingSubmit.value = false;
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          const data = res.data.data;
          if (data.id === undefined) {
            router.push({
              name: routes.value[1].name,
            });
            return new Promise(() => {});
          }
          if (
            data.present_stage === EASSESSMENT_STAGE.SIGNATURE &&
            router.currentRoute.name === RouterNamePerformance.my.own.detail
          ) {
            RefreshAgreeStatus.start(currentParams);
          }
          return data;
        })
        .then(onLoadData)
        .catch(ex => {
          loadingSubmit.value = false;
          Message.error(ex.message);
        });
    };

    const routes = ref([
      // {
      //   title: '绩效管理',
      // },
      {
        name: RouterNamePerformance.my.own.list,
        title: '我的绩效',
      },
      {
        title: '绩效详情',
      },
    ]);
    if (router.currentRoute.name === RouterNamePerformance.my.related.detail) {
      AssessmentSearchType.value = 2;
      routes.value = [
        // {
        //   title: '绩效管理',
        // },
        {
          name: RouterNamePerformance.my.related.list,
          title: '与我相关',
        },
        {
          title: '绩效详情',
        },
      ];
    } else if (router.currentRoute.name === RouterNamePerformance.my.underling.detail) {
      AssessmentSearchType.value = 3;
      routes.value = [
        // {
        //   title: '绩效管理',
        // },
        {
          name: RouterNamePerformance.my.underling.list,
          title: '下级考核',
        },
        {
          title: '绩效详情',
        },
      ];
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes.value);
    const { id } = router.currentRoute.params;
    const init = () => {
      return loadData();
    };
    onMounted(() => {
      lastParams = {
        assessment_detail_id: id,
      };
      loadData().then(data => {
        if (search_type === 0) return;
        searchForm.examiner = data.user_id;
        searchForm.assessment = data.assessment_management_id;
        LoadAssesToUser(data.assessment_management_id);
        LoadUserToAssess(data.user_id);
      });
    });

    const removeEmptyDataAfterindicatorAdded = (data: NPerformance.IAssessmentPeople) => {
      data.assessment_dimension_list.forEach(el => {
        if (el.indicator_list.length > 1) {
          el.indicator_list = el.indicator_list.filter((subEl: any) => {
            const editNameKey = 'name_edit';
            const editWweightKey = 'weight_edit';
            const editRemarkKey = 'remark_edit';
            const editCheckStandard = 'check_standard_edit';

            return (
              subEl[editNameKey] ||
              subEl[editWweightKey] ||
              subEl[editRemarkKey] ||
              subEl[editCheckStandard] ||
              (subEl.name && subEl[editNameKey] === undefined) ||
              (subEl.weight && subEl[editWweightKey] === undefined) ||
              (subEl.remark && subEl[editRemarkKey] === undefined) ||
              (subEl.check_standard && subEl[editCheckStandard] === undefined)
            );
          });
        }
        // 添加制定评分人默认选择项
        el.indicator_list.forEach((subEl: any) => {
          if (subEl.assign_scorer_id && !subEl.assign_scorer_options) {
            set(subEl, 'assign_scorer_options', [
              { label: subEl.assign_scorer_username, value: subEl.assign_scorer_id },
            ]);
          }
        });
      });
    };

    const drawerCreateIndic = useDrawer({
      component: createIndic,
      width: '523px',
      title: '新增指标',
      props: {
        disabledSubmit: true,
      },
      on: {
        submit(value: any) {
          const newData: any[] = assTable.data.assessment_dimension_list;
          const find: any = newData.find((it: any) => it.id === selectDimensionValue.value.id);
          if (!find) {
            Message.error('找不到对应的维度');
          }
          find.indicator_list.push(value);
          assTable.data.assessment_dimension_list = newData;
          removeEmptyDataAfterindicatorAdded(assTable.data);
          onLoadData(assTable.data);
          drawerCreateIndic.close();
          if (assTable.status === AssessTableStatus.EDIT_SELF_TARGET) AutoSave.AutoSaveTarget();
        },
      },
    });
    const dialogImportIndicator = useDialog({
      component: importIndicator,
      title: '指标库导入',
      width: '750px',
      on: {
        submit(value: any[]) {
          const newData: any[] = assTable.data.assessment_dimension_list;
          const find: any = newData.find((it: any) => it.id === selectDimensionValue.value.id);
          if (!find) {
            Message.error('找不到对应的维度');
          }
          find.indicator_list.push(...value);
          assTable.data.assessment_dimension_list = newData;
          removeEmptyDataAfterindicatorAdded(assTable.data);
          onLoadData(assTable.data);
          if (assTable.status === AssessTableStatus.EDIT_SELF_TARGET) AutoSave.AutoSaveTarget();
        },
      },
    });
    const dialogImportHistory = useDialog({
      component: copyHistoryIndic,
      title: '复制历史指标',
      width: '480px',
      footer: false,
      on: {
        submit(value: any[], replace: boolean) {
          // console.log(repeat, '34');
          const newData: any[] = assTable.data.assessment_dimension_list;
          const find: any = newData.find((it: any) => it.id === selectDimensionValue.value.id);
          if (!find) {
            Message.error('找不到对应的维度');
          }
          if (replace) {
            find.indicator_list = value;
          } else {
            find.indicator_list.push(...value);
          }

          assTable.data.assessment_dimension_list = newData;
          removeEmptyDataAfterindicatorAdded(assTable.data);
          onLoadData(assTable.data);
          if (assTable.status === AssessTableStatus.EDIT_SELF_TARGET) AutoSave.AutoSaveTarget();
        },
        cancel() {
          dialogImportHistory.close();
        },
        // replace() {
        //   console.log('34');
        // },
      },
    });
    const dialogSelectPeople = useDialog({
      title: '选择转交人',
      component: selectPeople,

      width: '330px',
      on: {
        submit(id: number) {
          submit(id, '转交目标');
        },
      },
    });
    const selectDimensionValue = ref();
    const importType = ref(0);
    const dialogSelectDimension = useDialog({
      component: selectDimension,
      title: '选择维度',
      width: '324px',
      on: {
        submit(value: any) {
          selectDimensionValue.value = value;
          if (importType.value === 0) {
            drawerCreateIndic.show(null, selectDimensionValue.value.dimension_type_list, {
              isTargetSetting: true,
            });
          } else if (importType.value === 1) {
            dialogImportIndicator.show(null, selectDimensionValue.value.dimension_type_list);
          } else if (importType.value === 2) {
            dialogImportHistory.show(
              null,
              selectDimensionValue.value.dimension_type_list,
              detailData.value?.assessment_detail_id,
            );
          }
        },
      },
    });
    const dialogRejectProcess = useDialog({
      component: rejectProcess,
      title: '驳回',

      width: '330px',
      on: {
        submit: async ({ type, message }: any) => {
          console.log('type', type, message);
          await Confirm('确定要驳回吗?');
          dialogRejectProcess.close();
          submit(message, type);
        },
      },
    });
    const dialogGrievanceSubmission = useDialog({
      component: grievanceSubmission,
      width: '340px',
      title: '申诉',
      on: {
        submit(payload: any) {
          submit(payload, '申诉').then(() => {
            Message.success('申诉成功');
            dialogGrievanceSubmission.close();
          });
        },
      },
    });
    const transformSubmitDimension = (list: any) => {
      return list.map((it: any) => {
        return {
          ...it,
          indicator_list: it.indicator_list.map((it2: any) => {
            const obj = { ...it2 };
            Object.keys(it2).forEach(key => {
              if (/_edit/.test(key)) {
                const newKey = key.replace('_edit', '');
                obj[newKey] = it2[key];
              }
            });
            return obj;
          }),
        };
      });
    };
    // 结果值提交
    const submit = (isSave?: any, type?: any, isAuto = false) => {
      return Promise.resolve()
        .then(() => {
          if (!isAuto) loadingSubmit.value = true;
        })
        .then(async () => {
          switch (type) {
            case '保存目标':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                operate_type: ALLOW_OPERATOR_CODES.GOAL_SETTING_SAVE,
              });
            case '制定目标':
              return Promise.resolve()
                .then(() => {
                  if (detailData.value.is_existence_subordinate === true)
                    return Confirm({
                      title: '是否需要将确认后的目标同步给直属下级？',
                      cancelText: '否',
                      confirmText: '是',
                      showClose: true,
                    })
                      .then(() => 1)
                      .catch(() => {
                        return 0;
                      });
                  return undefined;
                })
                .then(is_synchronization_subordinate => {
                  // 清空维度下所有指标
                  detailData.value.assessment_dimension_list.forEach((item: any) => {
                    item.indicator_list = [];
                  });
                  // 在根据指标填充到维度中去
                  assTable.tableData.forEach((item: any) => {
                    const wd =
                      detailData.value.assessment_dimension_list[item.assessment_dimension.id];
                    wd.indicator_list.push(item);
                  });
                  return Modify_Performance_Process({
                    assessment_detail_id: detailData.value.id,
                    assessment_dimension_list: transformSubmitDimension(
                      detailData.value.assessment_dimension_list,
                    ),
                    is_synchronization_subordinate,
                    operate_type: ALLOW_OPERATOR_CODES.GOAL_SETTING_COMMIT,
                  });
                });
            case '撤销目标':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.GOAL_CONFIRM_REVOKE,
              });
            case '转交目标': {
              const res = await Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                transfer_user_id: isSave,
                operate_type:
                  detailData.value.present_stage === EASSESSMENT_STAGE.TARGET_CONFIRM
                    ? ALLOW_OPERATOR_CODES.GOAL_CONFIRM_DELIVER
                    : ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_DELIVER,
              });
              if (res.data.success) {
                Message.success('转交成功');
              } else {
                Message.error(res.data.message);
              }
              return res;
            }
            case '同意目标':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.GOAL_CONFIRM_PASSED,
              });
            case '驳回目标':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.GOAL_CONFIRM_FAILED,
                reject_remark: isSave,
              });
            case '调整目标':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.GOAL_CONFIRM_COMMIT,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
              });
            case '自评保存':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                operate_type: ALLOW_OPERATOR_CODES.SELF_ASSESSMENT_SAVE,
                self_evaluation_summary: detailData.value.self_evaluation_summary,
              });
            case '自评提交':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                self_evaluation_summary: detailData.value.self_evaluation_summary,
                operate_type: ALLOW_OPERATOR_CODES.SELF_ASSESSMENT_COMMIT,
              });
            case '上级驳回':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_FAILED,
                reject_remark: isSave,
              });
            case '上级评分':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                operate_type: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_COMMIT,
                superior_assessment_summary: detailData.value.superior_assessment_summary,
              });
            case '上级评分保存':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                operate_type: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_SAVE,
                superior_assessment_summary: detailData.value.superior_assessment_summary,
              });
            case '隔级同意评分':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                operate_type: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_LEADER_PASSED,
              });
            case '隔级评分调整':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                assessment_dimension_list: transformSubmitDimension(
                  detailData.value.assessment_dimension_list,
                ),
                operate_type: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_LEADER_COMMIT,
                result: (detailData.value as any).result_edit,
              });
            case '撤销评分':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_REVOKE,
              });
            case '申诉':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_APPEAL,
                ...isSave,
              });
            case '撤回申诉':
              return Modify_Performance_Process({
                assessment_detail_id: detailData.value.id,
                operate_type: ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_APPEAL_RETRACT,
                appeal_status: AppealStatus.retract,
              });
            default:
              throw new Error('未匹配到命令');
          }
        })
        .then(res => {
          if (!res.data.success) throw new Error(res.data.message);
        })
        .then(async () => {
          if (!isAuto) {
            assTable.status = AssessTableStatus.NONE;
            await sleep(500);
            return init();
          }
        })
        .catch(ex => {
          Message.error(ex.message);
          throw ex;
        })
        .finally(() => {
          if (!isAuto) loadingSubmit.value = false;
        });
    };

    const AutoSave = {
      AutoSaveTarget() {
        return submit(null, '保存目标', true);
      },
      AutoSaveSelfEvaluation() {
        return submit(null, '自评保存', true);
      },
      AutoSaveSuperiorRating() {
        return submit(null, '上级评分保存', true);
      },
    };
    assTable.bindSave(AutoSave);
    const searchForm = reactive<{
      examiner: number;
      examinerList: TG.OptionType[];
      assessment: number;
      assessmentList: TG.OptionType[];
    }>({
      examiner: '',
      assessment: '',
      examinerList: [],
      assessmentList: [],
    } as any);

    const LoadAssesToUser = (assessment_management_id: number) => {
      return Query_Assessment_And_User_By_My_Performance({
        assessment_management_id,
        search_type,
      }).then(res => {
        if (!res.data.success) return;
        searchForm.examinerList = res.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.user_id,
          };
        });
      });
    };

    const LoadUserToAssess = (user_id: number) => {
      return Query_Assessment_And_User_By_My_Performance({
        user_id,
        search_type,
      }).then(res => {
        if (!res.data.success) return;
        searchForm.assessmentList = res.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      });
    };

    const onFilterChange = () => {
      lastParams = {
        user_id: searchForm.examiner,
        assessment_management_id: searchForm.assessment,
        search_type,
      };
      loadData();
    };

    const dialogQRCodeBox = useDialog({
      component: QRCodeBox,
      title: '考核结果确认',
      width: '316px',
      footer: false,
    });

    const dialogDevelopImprovements = useDialog({
      component: developImprovements,
      title: '绩效改进计划',
      width: '878px',
      footer: false,
      on: {
        submit(payload: any) {
          init();
          dialogDevelopImprovements.close();
          console.log(payload, '提交');
        },
      },
    });

    const hasHistoryAssessment = ref(false);
    const queryAssessmentDetail = async () => {
      const res = await Query_Assessment_Detail_My_Performance(
        {
          num: 1000,
          page_num: 1,
        },
        {
          // is_finish: 1,
          search_type: 1,
        },
      );
      if (res.data.success) {
        hasHistoryAssessment.value =
          (res.data.data.data || []).filter((item: { id: number | string }) => {
            return String(item.id) !== String(lastParams.assessment_detail_id || '');
          }).length > 0;
        // methods.queryHistoryAssessmentIndicators();
      }
    };

    onMounted(() => {
      queryAssessmentDetail();
    });

    return {
      loadingSubmit,
      dialogQRCodeBox,
      lastParams,
      searchForm,
      LoadAssesToUser,
      LoadUserToAssess,
      assTable,
      loadData,
      stepsRef,
      detailData,
      formEdit,
      submit,
      importType,
      drawerCreateIndic,
      dialogSelectDimension,
      selectDimensionValue,
      dialogImportIndicator,
      dialogSelectPeople,
      init,
      userInfo,
      onFilterChange,
      search_type,
      dialogRejectProcess,
      dialogImportHistory,
      dialogGrievanceSubmission,
      hasHistoryAssessment,
      dialogDevelopImprovements,
    };
  },
  methods: {
    operator: null as any,
    operatorSubmit: null as any,
    [`render_edit_${AssessTableStatus.EDIT_SELF_TARGET}`]() {
      const { assTable } = this;
      // 是否有能操作的指标
      const hasIndicatorsModify = assTable.data.assessment_dimension_list.some(
        it => it.is_modify_delete,
      );
      this.operator = (
        <div class="operator-title">
          <span>
            维度指标数量：<b>{assTable.tableData.length}</b>
          </span>
          <span>
            所有维度权重：
            <b>
              {assTable.tableData.reduce((a: any, b: any) => {
                const target = b.weight_edit === undefined ? b.weight : b.weight_edit;
                if (!isNaN(target)) {
                  return a + Number(target);
                }
                return a;
              }, 0)}
              %
            </b>
          </span>
        </div>
      );
      this.operatorSubmit = [
        <div>
          {/* {hasIndicatorsModify && ( */}
          {/* <fragments> */}
          <tg-button
            disabled={!hasIndicatorsModify}
            class="mgr-12 "
            onclick={() => {
              this.importType = 1;
              const list = assTable.data.assessment_dimension_list.filter(
                it => it.is_modify_delete,
              );
              if (list.length === 1) {
                this.selectDimensionValue = list[0];
                this.dialogImportIndicator.show(
                  null,
                  this.selectDimensionValue.dimension_type_list,
                );
              } else {
                this.dialogSelectDimension.show(list);
              }
            }}
          >
            指标库导入
          </tg-button>
          <tg-button
            disabled={!hasIndicatorsModify}
            class="mgr-12 "
            onclick={() => {
              this.importType = 0;
              const list = assTable.data.assessment_dimension_list.filter(
                it => it.is_modify_delete,
              );
              if (list.length === 1) {
                this.selectDimensionValue = list[0];
                this.drawerCreateIndic.show(null, this.selectDimensionValue.dimension_type_list, {
                  isTargetSetting: true,
                });
              } else {
                this.dialogSelectDimension.show(list);
              }
            }}
          >
            增加指标
          </tg-button>
          <tg-button
            disabled={!hasIndicatorsModify || !this.hasHistoryAssessment}
            onclick={() => {
              this.importType = 2;
              const list = assTable.data.assessment_dimension_list.filter(
                it => it.is_modify_delete,
              );
              if (list.length === 1) {
                this.selectDimensionValue = list[0];
                this.dialogImportHistory.show(
                  null,
                  this.selectDimensionValue.dimension_type_list,
                  this.detailData?.assessment_detail_id,
                );
              } else {
                this.dialogSelectDimension.show(list);
              }
            }}
          >
            复制历史指标
          </tg-button>
          {/* </fragments> */}
          {/* )} */}
        </div>,
        <div>
          <tg-button
            class="mgr-12 "
            onclick={() => {
              assTable.toggleEditSelfTarget(false);
              this.init();
            }}
          >
            取消
          </tg-button>
          <tg-button class="mgr-12" onClick={() => this.submit(null, '保存目标')}>
            保存
          </tg-button>
          <tg-button type="primary" onClick={() => this.submit(null, '制定目标')}>
            提交
          </tg-button>
        </div>,
      ];
    },
    [`render_edit_${AssessTableStatus.EDIT_SUPERIOR_TARGET}`]() {
      const { assTable } = this;
      // 是否有能操作的指标
      const hasIndicatorsModify = assTable.data.assessment_dimension_list.some(
        it => it.is_modify_delete,
      );
      this.operatorSubmit = [
        hasIndicatorsModify && (
          <div>
            <tg-button
              onclick={() => {
                this.importType = 1;
                const list = assTable.data.assessment_dimension_list.filter(
                  it => it.is_modify_delete,
                );
                if (list.length === 1) {
                  this.selectDimensionValue = list[0];
                  this.dialogImportIndicator.show(
                    null,
                    this.selectDimensionValue.dimension_type_list,
                  );
                } else {
                  this.dialogSelectDimension.show(list);
                }
              }}
            >
              指标库导入
            </tg-button>
            <tg-button
              onclick={() => {
                this.importType = 0;
                const list = assTable.data.assessment_dimension_list.filter(
                  it => it.is_modify_delete,
                );
                if (list.length === 1) {
                  this.selectDimensionValue = list[0];
                  this.drawerCreateIndic.show(null, this.selectDimensionValue.dimension_type_list);
                } else {
                  this.dialogSelectDimension.show(list);
                }
              }}
            >
              增加指标
            </tg-button>
          </div>
        ),
        <div>
          <tg-button
            onclick={() => {
              assTable.toggleEditSupperTarget(false);
              this.init();
            }}
          >
            取消
          </tg-button>
          <tg-button type="primary" onClick={() => this.submit(false, '调整目标')}>
            提交
          </tg-button>
        </div>,
      ];
    },
    [`render_edit_${AssessTableStatus.EDIT_SELF_RESULT}`]() {
      const { assTable } = this;
      this.operatorSubmit = [
        <tg-button
          onclick={() => {
            assTable.toggleEditSelfResult(false);
            this.init();
          }}
        >
          取消
        </tg-button>,
        <tg-button onClick={() => this.submit(true, '自评保存')}>保存</tg-button>,
        <tg-button
          type="primary"
          onClick={() => {
            this.submit(null, '自评提交');
          }}
        >
          提交
        </tg-button>,
      ];
    },
    [`render_edit_${AssessTableStatus.EDIT_SUPPER_SCORE}`]() {
      const { assTable, detailData } = this;
      const hasSave = detailData.allow_operator_codes.includes(
        ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_SAVE,
      );
      this.operatorSubmit = [
        <tg-button onclick={() => assTable.toggleEditSelfTarget(false)}>取消</tg-button>,
        hasSave && <tg-button onClick={() => this.submit(7, '上级评分保存')}>保存</tg-button>,
        <tg-button type="primary" onClick={() => this.submit(7, '上级评分')}>
          提交
        </tg-button>,
      ];
    },
    [`render_edit_${AssessTableStatus.EDIT_SUPERIOR_MODIFY}`]() {
      const { assTable } = this;
      this.operatorSubmit = [
        <tg-button onclick={() => assTable.toggleEditSuperiorModify(false)}>取消</tg-button>,
        <tg-button type="primary" onClick={() => this.submit(7, '隔级评分调整')}>
          提交
        </tg-button>,
      ];
    },

    // 目标制定状态
    [`render_stage_${EASSESSMENT_STAGE.TARGET_SETTING}`]() {
      const { detailData, assTable } = this;
      if (assTable.status !== AssessTableStatus.NONE) return;
      if (
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_SETTING_SAVE) ||
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_SETTING_COMMIT)
      ) {
        this.operator = (
          <tg-button type="primary" onclick={() => assTable.toggleEditSelfTarget(true)}>
            目标制定
          </tg-button>
        );
      }
    },
    // 目标确认
    [`render_stage_${EASSESSMENT_STAGE.TARGET_CONFIRM}`]() {
      const { assTable, detailData } = this;
      if (assTable.status !== AssessTableStatus.NONE) return;

      this.operator = [
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_CONFIRM_PASSED) && (
          <tg-button onclick={() => this.submit(3, '同意目标')}>同意</tg-button>
        ),
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_CONFIRM_FAILED) && (
          <tg-button
            onclick={async () => {
              this.dialogRejectProcess.show('驳回目标');
            }}
          >
            驳回
          </tg-button>
        ),
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_CONFIRM_COMMIT) &&
          detailData.is_modify_indicator && (
            <tg-button onclick={() => assTable.toggleEditSupperTarget(true)}>调整目标</tg-button>
          ),
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_CONFIRM_DELIVER) && (
          <tg-button onclick={() => this.dialogSelectPeople.show()}>转交</tg-button>
        ),
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.GOAL_CONFIRM_REVOKE) && (
          <tg-button
            onclick={() => {
              Confirm('确认撤销目标吗?').then(() => {
                this.submit(false, '撤销目标');
              });
            }}
          >
            撤销
          </tg-button>
        ),
      ].filter(Boolean);
    },
    // 自评
    [`render_stage_${EASSESSMENT_STAGE.SELF}`]() {
      const { assTable, detailData } = this;
      if (assTable.status !== AssessTableStatus.NONE) return;
      if (
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.SELF_ASSESSMENT_COMMIT) ||
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.SELF_ASSESSMENT_COMMIT)
      ) {
        this.operator = (
          <tg-button type="primary" onclick={() => assTable.toggleEditSelfResult(true)}>
            自评
          </tg-button>
        );
      }
    },
    // 上级评分
    [`render_stage_${EASSESSMENT_STAGE.SUPERIOR}`]() {
      const { detailData, assTable } = this;
      if (assTable.status === AssessTableStatus.NONE) {
        this.operator = [
          detailData.allow_operator_codes.includes(
            ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_COMMIT,
          ) && (
            <tg-button onclick={() => assTable.toggleEditSupperScore(true)} type="primary">
              评分
            </tg-button>
          ),
          detailData.allow_operator_codes.includes(
            ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_FAILED,
          ) && (
            <tg-button
              onclick={async () => {
                this.dialogRejectProcess.show('上级驳回');
              }}
            >
              驳回
            </tg-button>
          ),
          detailData.allow_operator_codes.includes(
            ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_DELIVER,
          ) && <tg-button onclick={() => this.dialogSelectPeople.show()}>转交</tg-button>,
          detailData.allow_operator_codes.includes(
            ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_REVOKE,
          ) && (
            <tg-button
              onclick={() => {
                Confirm('确认撤销目标吗?').then(() => {
                  this.submit(false, '撤销评分');
                });
              }}
            >
              撤销
            </tg-button>
          ),
          detailData.allow_operator_codes.includes(
            ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_LEADER_COMMIT,
          ) && (
            <tg-button onclick={() => assTable.toggleEditSuperiorModify(true)}>调整评分</tg-button>
          ),
          detailData.allow_operator_codes.includes(
            ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_LEADER_PASSED,
          ) && (
            <tg-button
              onclick={() => {
                Confirm('确认同意此考核结果吗?').then(() => {
                  this.submit(false, '隔级同意评分');
                });
              }}
            >
              同意评分
            </tg-button>
          ),
        ].filter(Boolean);
      }
    },
    // 签字确认
    [`render_stage_${EASSESSMENT_STAGE.SIGNATURE}`]() {
      const { userInfo, detailData, assTable } = this;
      if (detailData.user_id !== userInfo.id) return {};
      this.operator = [
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_APPEAL) && (
          <tg-button onclick={() => this.dialogGrievanceSubmission.show()}>申诉</tg-button>
        ),
        detailData.allow_operator_codes.includes(
          ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_APPEAL_RETRACT,
        ) && (
          <tg-button
            onclick={() => {
              Confirm('确定撤销申诉吗?')
                .then(() => this.submit(null, '撤回申诉'))
                .then(() => {
                  Message.success('撤销成功');
                });
            }}
          >
            撤回
          </tg-button>
        ),
        detailData.allow_operator_codes.includes(ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_COMMIT) && (
          <tg-button
            type="primary"
            onClick={() => {
              this.dialogQRCodeBox.show(assTable);
            }}
          >
            同意
          </tg-button>
        ),
      ];
    },
    // 完成
    [`render_stage_${EASSESSMENT_STAGE.FINISH}`]() {
      const isMe = this.detailData.user_id === this.userInfo.id;
      let isShow = false;
      let text = '';
      let fnc = () => {
        this.dialogDevelopImprovements.show(
          this.detailData.improve_plan_status,
          isMe,
          this.detailData.id,
        );
      };
      switch (this.detailData.improve_plan_status) {
        case IMPROVEMENT_STATUS.UNDER_FORMULATION:
        case IMPROVEMENT_STATUS.REJECTED:
          if (isMe) {
            text = '制定改进计划';
            isShow = true;
          }
          break;
        case IMPROVEMENT_STATUS.CHECK_PENDING:
          isShow = true;
          if (isMe) {
            text = '撤回绩效改进计划';
            fnc = () => {
              Confirm('确认撤回绩效改进计划吗?').then(() => {
                RepealAssessmentImprovePlan({
                  assessment_detail_id: this.detailData.id,
                }).then(res => {
                  if (res.data.success) {
                    this.init();
                    Message.success(res.data.message);
                  } else {
                    Message.error(res.data.message);
                  }
                });
              });
            };
          } else {
            text = '审批绩效改进计划';
          }
          break;
        case IMPROVEMENT_STATUS.WAIT_UPDATED:
          if (isMe) {
            text = '更新绩效改进计划';
            isShow = true;
          }
          break;
        case IMPROVEMENT_STATUS.COMPLETED:
          text = '查看绩效改进计划';
          isShow = true;
          break;
      }
      const 需要显示的绩效等级 = ['C', 'D'];
      if (!需要显示的绩效等级.includes(this.detailData.level)) {
        isShow = false;
      }

      this.operator = (
        <tg-button type="primary" v-show={isShow} onClick={fnc}>
          {text}
        </tg-button>
      );
    },

    callStageMethod(present_stage: string) {
      this.operator = null;
      this.operatorSubmit = null;
      const method = this[`render_stage_${present_stage}`];
      method && method.call(this);
    },
    callEditMethod(status: any) {
      const method = this[`render_edit_${status}`];
      method && method.call(this);
    },
  },

  render() {
    const { assTable, detailData, searchForm } = this;

    this.callStageMethod(detailData.present_stage);
    this.callEditMethod(assTable.status);
    const { operator, operatorSubmit } = this;
    return (
      <div class="tg-page-container">
        <div class="page-content" v-loading={this.loadingSubmit}>
          {this.search_type !== 0 && (
            <div class="form-people">
              <el-form size="mini" inline={true}>
                <el-form-item label="被考核人：">
                  <Select
                    popper-class="el-select-popper-mini"
                    filterable
                    clearable={false}
                    options={searchForm.examinerList}
                    v-model={searchForm.examiner}
                    onChange={(value: any) => {
                      this.LoadUserToAssess(value);
                      this.onFilterChange();
                    }}
                  />
                </el-form-item>
                <el-form-item label-width="70px" label="考核名称：">
                  <Select
                    popper-class="el-select-popper-mini"
                    filterable
                    clearable={false}
                    options={searchForm.assessmentList}
                    v-model={searchForm.assessment}
                    onChange={(value: number) => {
                      this.LoadAssesToUser(value);
                      this.onFilterChange();
                    }}
                  />
                </el-form-item>
              </el-form>
            </div>
          )}

          <div class="form-box">
            <div class="info">{detailData?.assessment_management_name}</div>
            <div class="operator">{operator}</div>
          </div>
          <steps ref="stepsRef" />
          <tg-table class="table" {...assTable.tableProps} />
          <div class="operator-submit">{operatorSubmit}</div>
        </div>
      </div>
    );
  },
});
