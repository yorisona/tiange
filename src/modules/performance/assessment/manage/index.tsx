import { defineComponent, h, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { ECYCLE_TYPE_OPTIONS } from '@/const/performance';
import { RouterNamePerformance } from '@/const/router';
import {
  Query_Assessment,
  QueryPublicityResultsNotAvatar,
  PublicifyAssessmentResult,
} from '@/services/performance'; //PublicifyAssessmentResult,
import { useRouter } from '@/use/vue-router';
import { useDialog } from '@/use/dialog';
import launch from './dialog/launch/index.vue';
import setLevel from './dialog/setLevel/index.vue';
import launchScore from './dialog/launchScore/index.vue';
import publicityResults from './dialog/publicityResults/index.vue';
import performanceBonus from './dialog/performanceBonus/index.vue';
import { usePermission } from '@/use/permission';
import { AsyncConfirm } from '@/use/asyncConfirm';
export default defineComponent({
  setup: (props, ctx) => {
    const saveLoading = ref(false);
    const router = useRouter();
    const permission = usePermission();
    const columns: TgTableColumn<NPerformance.IAssessment>[] = [
      {
        label: '考核名称',
        prop: 'name',
        minWidth: 150,
      },
      {
        label: '考核周期',
        minWidth: 150,
        prop: 'assessment_cycle',
      },
      {
        label: '参与人数',
        minWidth: 100,
        align: 'right',
        renderHeader: () => {
          return h(
            'div',
            {
              style:
                'padding-right: 20px; display: flex; justify-content: flex-end; color: var(--text-color)',
            },
            '参与人数',
          );
        },
        formatter: row => {
          return h('div', { style: 'padding-right: 20px;' }, `${row.user_count}`);
        },
      },
      {
        // label: '考核完成度',
        align: 'right',
        minWidth: 180,
        renderHeader: () => {
          return h(
            'div',
            {
              style: 'display: flex; justify-content: flex-end; padding: 0; padding-right: 60px',
            },
            [
              h(
                'span',
                {
                  style: 'color: var(--text-color)',
                },
                '考核完成度',
              ),
              h(
                'el-popover',
                {
                  props: {
                    content: '考核完成度=各考核已完成考核数/总考核数',
                    openDelay: 300,
                    trigger: 'hover',
                    placement: 'top',
                  },
                },
                [
                  h('tg-icon', {
                    props: {
                      name: 'ico-question',
                    },
                    class: 'target-icon-desc',
                    // style: '',
                    slot: 'reference',
                  }),
                ],
              ),
            ],
          );
        },
        formatter: row => {
          const content =
            row.asssessment_completion !== undefined && row.asssessment_completion !== null
              ? `${row.asssessment_completion}%`
              : '';
          return h('div', { style: 'padding-right: 76px' }, content);
        },
      },
      {
        label: '操作',
        width: 190,
        formatter: row => {
          return (
            <div style="padding-right: 20px">
              <tg-button
                type="link"
                onClick={() => {
                  router.push({
                    name: RouterNamePerformance.assessment.manage.detailList,
                    params: {
                      id: row.id as any,
                    },
                  });
                }}
              >
                查看
              </tg-button>
              {permission.assessment_management_score && (
                <tg-button
                  type="link"
                  class="mgl-12 initiateScoring"
                  disabled={!row.is_can_start_score}
                  onClick={async () => {
                    dialogLaunchScore.show(row.id);
                  }}
                >
                  发起评分
                </tg-button>
              )}
              {permission.assessment_publicity_result && (
                <tg-button
                  type="link"
                  class="mgl-12"
                  disabled={(row.asssessment_completion || 0) <= 0}
                  onClick={async () => {
                    displayResult(row.id);
                  }}
                >
                  公示结果
                </tg-button>
              )}
            </div>
          );
        },
      },
    ];

    const reqList = usePagination(Query_Assessment);
    const dialogLauch = useDialog({
      title: '发起考核',

      component: launch,
      width: '380px',
      on: {
        submit: () => {
          reqList.reload();
        },
      },
    });
    const dialogSetLevel = useDialog({
      component: setLevel,
      title: '考核等级设置',

      width: '430px',
    });

    const dialogLaunchScore = useDialog({
      component: launchScore,
      title: '发起评分',

      width: '600px',
      okText: '确定',
    });

    const dialogPublicityResults = useDialog({
      component: publicityResults,
      title: '公示提醒',
      width: '640px',
      okText: '确定',
      on: {
        submit: () => {
          dialogPublicityResults.close();
          reqList.reload();
        },
      },
    });
    const dialogPerformanceBonus = useDialog({
      component: performanceBonus,
      title: '上传绩效奖金',
      width: '390px',
      okText: '确定',
    });
    const formData = ref<any>({});
    const config = {
      reset() {
        formData.value = {};
      },
    };

    const displayResult = async (id: number) => {
      QueryPublicityResultsNotAvatar({ assessment_management_id: id }).then(async res => {
        console.log(res, '111');

        if (res.data.success) {
          if (res.data.data.data?.length > 0) {
            dialogPublicityResults.show({
              id,
              detail_file: res.data.data.data,
            });
          } else {
            const result = await AsyncConfirm(ctx, {
              title: '提醒',
              content: '确认公示此次考核结果为S的考核数据吗？',
            });
            if (result) {
              saveLoading.value = true;
              const res = await PublicifyAssessmentResult({
                assessment_management_id: id,
              });
              saveLoading.value = false;
              if (res.data.success) {
                ctx.root.$message.success(res.data.message);
              } else {
                ctx.root.$message.error(res.data.message);
              }
            }
          }
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };

    return {
      saveLoading,
      columns,
      reqList,
      dialogLauch,
      dialogSetLevel,
      dialogLaunchScore,
      formData,
      config,
      permission,
      dialogPerformanceBonus,
    };
  },
  render() {
    const { formData, permission } = this;
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.reqList}
        value={this.formData}
        config={this.config}
      >
        <el-form-item label="周期类型：">
          <Select
            options={ECYCLE_TYPE_OPTIONS}
            popper-class="el-select-popper-mini"
            v-model={formData.cycle_type}
          />
        </el-form-item>
        <el-form-item label="考核名称：">
          <el-input placeholder="请输入考核名称" v-model={formData.name} />
        </el-form-item>
        <div slot="btnLine" class="btns-line">
          {permission.assessment_management_start && (
            <tg-button
              type="primary"
              size="small"
              onClick={() => {
                this.dialogLauch.show();
              }}
            >
              发起考核
            </tg-button>
          )}

          {permission.assessment_management_bonus && (
            <tg-button
              type="primary"
              size="small"
              onClick={() => {
                const option = (this.reqList.data as any[]).map((item: any) => {
                  return {
                    label: item.name,
                    value: item.id,
                    disabled: (item.asssessment_completion_count || 0) <= 0,
                  };
                });
                // console.log(this.reqList, option, 'this.reqList');
                this.dialogPerformanceBonus.show(option);
              }}
            >
              上传绩效奖金
            </tg-button>
          )}

          {permission.assessment_management_level && (
            <tg-button
              size="small"
              style="margin-left: 12px;"
              onClick={() => {
                this.dialogSetLevel.show();
              }}
            >
              考核等级设置
            </tg-button>
          )}
        </div>
        {/* <tg-mask-loading visible={this.saveLoading} content="  正在保存，请稍候..." /> */}
      </ListGenerallyTemplate>
    );
  },
});
