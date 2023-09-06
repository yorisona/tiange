import { defineComponent, onMounted, ref, reactive, inject } from '@vue/composition-api';
import { RouterNamePerformance } from '@/const/router';
import {
  Modify_Reset_Process,
  Query_Assessment_And_User,
  Query_Assessment_Detail,
  Query_Assessment_Detail_By_Analysis,
  Query_Assessment_Detail_By_Performance_Record,
  Query_Assessment_And_User_By_Analysis,
  Query_Assessment_And_User_By_Performance_Record,
  Modify_Performance_Process_Skip,
  Modify_Performance_Process_Transmit,
  // ExportAssessmentResult,
} from '@/services/performance';
import { appendEmptyIndc, useAssessmentTable } from '@/modules/performance/assessment/common';
import { Message } from 'element-ui';
import { useRouter } from '@/use/vue-router';
import Steps from '@/modules/performance/components/steps/index.vue';
import { IStepRef } from '@/modules/performance/components/steps';
import { EASSESSMENT_STAGE, ALLOW_OPERATOR_CODES } from '@/const/performance';
import resetProcess from '../../dialog/resetProcess/index.vue';
import { useDialog } from '@/use/dialog';
import { Select } from '@gm/component/select';
import { usePermission } from '@/use/permission';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import { Confirm } from '@/use/asyncConfirm';
import selectPeople from '@/modules/performance/my/dialog/selectPeople/index.vue';

let QueryRequest = Query_Assessment_Detail;
let QueryAssessmentAndUserRequest = Query_Assessment_And_User;

export default defineComponent({
  components: { Steps },
  setup: (props, ctx) => {
    const exportLoading = ref(false);
    const router = useRouter();
    const permission = usePermission();
    const assTable = useAssessmentTable();
    const stepsRef = ref<IStepRef>();
    const onLoadData = (data: any) => {
      appendEmptyIndc(data);
      assTable.updateDimension(data);
      stepsRef.value?.updateData(data);
      return data;
    };
    let lastParams: any = {};
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

    const loadData = () => {
      return QueryRequest(
        {
          page_num: 1,
          num: 20,
        },
        lastParams,
      )
        .then(res => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          const data = res.data.data.data;
          if (data.length > 0) {
            return data[0];
            throw new Error('出现了多条数据');
          } else if (data.length === 0) throw new Error('找不到数据');
          return data;
        })
        .then(onLoadData)
        .catch(ex => {
          Message.error(ex.message);
        });
    };

    const routes = ref<any[]>([
      {
        title: '考核管理',
        name: RouterNamePerformance.assessment.manage.list,
      },
      {
        name: RouterNamePerformance.assessment.manage.detailList,
        title: '考核详情',
      },
      {
        title: '员工绩效详情',
      },
    ]);
    const { userid } = router.currentRoute.params;
    if (router.currentRoute.name === RouterNamePerformance.report.result_analysis_detail) {
      routes.value = [
        {
          name: RouterNamePerformance.report.result_analysis,
          title: '考核结果分析',
        },
        {
          title: '员工绩效详情',
        },
      ];
      QueryRequest = Query_Assessment_Detail_By_Analysis;
      QueryAssessmentAndUserRequest = Query_Assessment_And_User_By_Analysis;
    } else if (router.currentRoute.name === RouterNamePerformance.report.detailDetail) {
      routes.value = [
        {
          name: RouterNamePerformance.report.record,
          title: '员工绩效档案',
        },
        {
          title: '员工考核详情',
          name: RouterNamePerformance.report.detail,
          params: {
            id: router.currentRoute.query.id as any,
          },
        },
        {
          title: '员工绩效详情',
        },
      ];
      QueryRequest = Query_Assessment_Detail_By_Performance_Record;
      QueryAssessmentAndUserRequest = Query_Assessment_And_User_By_Performance_Record;
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes.value);
    const init = () => {
      lastParams = {
        assessment_detail_id: userid,
      };
      return loadData();
    };
    const LoadAssesToUser = (assessment_management_id: number) => {
      return QueryAssessmentAndUserRequest({
        assessment_management_id,
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
      return QueryAssessmentAndUserRequest({
        user_id,
      }).then(res => {
        if (!res.data.success) return;
        searchForm.assessmentList = res.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
            assessment_detail_id: item.assessment_detail_id,
          };
        });
      });
    };
    const onFilterChange = () => {
      lastParams = {
        user_id: searchForm.examiner,
        assessment_management_id: searchForm.assessment,
      };
      loadData();
    };
    onMounted(() => {
      init().then(data => {
        searchForm.examiner = data.user_id;
        searchForm.assessment = data.assessment_management_id;
        LoadAssesToUser(data.assessment_management_id);
        LoadUserToAssess(data.user_id);
      });
    });
    const dialogResetProcess = useDialog({
      component: resetProcess,
      title: '重置流程',

      width: '340px',
      on: {
        submit(value: any) {
          Modify_Reset_Process({
            stage: value.id,
            remark: value.remark,
            assessment_detail_id: assTable.data.id,
          }).then(res => {
            if (res.data.success) {
              Message.success('重置成功');
              dialogResetProcess.close();
              loadData();
            } else {
              Message.error(res.data.message);
            }
          });
        },
      },
    });

    const dialogSelectPeople = useDialog({
      title: '选择转交人',
      component: selectPeople,
      width: '330px',
      on: {
        submit(id: number) {
          console.log(id, assTable.data.present_stage);
          Modify_Performance_Process_Transmit({
            assessment_detail_id: assTable.data.id,
            transfer_user_id: id,
            operate_type:
              assTable.data.present_stage === EASSESSMENT_STAGE.TARGET_CONFIRM
                ? ALLOW_OPERATOR_CODES.GOAL_CONFIRM_DELIVER
                : ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_DELIVER,
          }).then(res => {
            res.data.success
              ? Message.success(res.data.message || '操作成功') && loadData()
              : Message.error(res.data.message);
          });
          // submit(id, '转交目标');
        },
      },
    });

    const requestOptions = {
      headers: {
        Authorization: getToken() ?? '',
      },
    };
    const downloadFileHandler = (urlString: string, filename = '') => {
      fetch(urlString, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            let url_filename = urlString.split('/')[urlString.split('/').length - 1];
            try {
              url_filename = decodeURI(url_filename);
            } catch (_) {
              // _
            }
            const download_name = filename !== '' ? filename : url_filename;
            downloadFileFromBlob(data, download_name);
          } else {
            ctx.root.$message.error('导出失败');
          }
        }
      });
    };

    const onExportAssessmentResult = async () => {
      const username = searchForm.examinerList.find(el => el.value === searchForm.examiner)?.label;
      const assessment = searchForm.assessmentList.find(el => el.value === searchForm.assessment);
      const assessmentName = assessment ? assessment.label : '';
      const assessment_detail_id = assessment ? assessment.assessment_detail_id : '';
      downloadFileHandler(
        `/api/performance_management/export_assessment_results?assessment_detail_id=${
          assessment_detail_id || userid
        }`,
        `${assessmentName}-${username}.xlsx`,
      );
      // exportLoading.value = true;
      // const res = await ExportAssessmentResult({
      //   assessment_detail_id: userid,
      // });
      // exportLoading.value = false;
      // debugger;
      // if (res.data.success) {
      //   const url = res.data.data.url;
      //   window.open(
      //     `${url}/Authorization=${getToken()}`.replace(/http:\/\//, 'https://'),
      //     '_blank',
      //   );
      // } else {
      //   ctx.root.$message.error(res.data.message);
      // }
    };

    return {
      exportLoading,
      assTable,
      loadData,
      stepsRef,
      dialogResetProcess,
      searchForm,
      LoadAssesToUser,
      LoadUserToAssess,
      lastParams,
      onFilterChange,
      permission,
      router,
      onExportAssessmentResult,
      dialogSelectPeople,
    };
  },
  render() {
    const { assTable, searchForm, permission, router } = this;
    return (
      <div class="tg-page-container">
        <div class="page-content">
          <div class="form-box">
            <el-form size="mini" inline={true}>
              <el-form-item label="被考核人 ：">
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
              <el-form-item label-width="60px" label="考核名称：">
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
            {RouterNamePerformance.assessment.manage.detailDetail === router?.currentRoute.name &&
              permission.assessment_management_process &&
              assTable.data.present_stage > EASSESSMENT_STAGE.TARGET_SETTING && (
                <tg-button onClick={() => this.dialogResetProcess.show(assTable.data)}>
                  重置流程
                </tg-button>
              )}
            {RouterNamePerformance.assessment.manage.detailDetail === router?.currentRoute.name &&
              permission.assessment_management_transfer &&
              (assTable.data.present_stage === EASSESSMENT_STAGE.TARGET_CONFIRM ||
                assTable.data.present_stage === EASSESSMENT_STAGE.SUPERIOR) && (
                <tg-button
                  class="mgl-12"
                  onClick={() => {
                    this.dialogSelectPeople.show();
                  }}
                >
                  转交
                </tg-button>
              )}
            {RouterNamePerformance.assessment.manage.detailDetail === router?.currentRoute.name &&
              permission.assessment_skipAssessment &&
              assTable.data.present_stage === EASSESSMENT_STAGE.TARGET_CONFIRM &&
              assTable.data.is_leave === 1 && (
                <tg-button
                  class="mgl-12"
                  onClick={() => {
                    console.log(assTable, 'assTable');
                    Confirm(
                      '跳过后该考核表会自动流转到下一节点（若以发起评分，则自动流转到自评节点）',
                    ).then(() => {
                      Modify_Performance_Process_Skip({
                        assessment_detail_id: assTable.data.id,
                        operate_type: ALLOW_OPERATOR_CODES.SKIP_CURRENT_NODE,
                      }).then(res => {
                        res.data.success
                          ? Message.success(res.data.message || '操作成功') && this.loadData()
                          : Message.error(res.data.message);
                      });
                    });
                  }}
                >
                  跳过
                </tg-button>
              )}
            {RouterNamePerformance.assessment.manage.detailDetail === router?.currentRoute.name &&
              permission.export_assessment_detail &&
              assTable.data.present_stage === EASSESSMENT_STAGE.FINISH && (
                <tg-button class="mgl-12" onClick={() => this.onExportAssessmentResult()}>
                  导出
                </tg-button>
              )}
          </div>
          <steps ref="stepsRef" />
          <tg-table class="table" {...assTable.tableProps} border>
            <div class="tg-page-empty" slot="empty">
              <empty-common />
            </div>
          </tg-table>
        </div>
        <tg-mask-loading visible={this.exportLoading} content="  正在导出，请稍候..." />
      </div>
    );
  },
});
