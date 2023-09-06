import { defineComponent, ref } from '@vue/composition-api';
// import { improvementStatus } from '@/const/performance';
import { useDialog } from '@/use/dialog';
import rejectProcess from '../rejectProcess/index.vue';
import { IMPROVEMENT_STATUS } from '@/const/performance';
import { useRouter } from '@/use/vue-router';
import {
  QueryAssessmentImprovePlan,
  SaveAssessmentImprovePlan,
  SubmitAssessmentImprovePlan,
  ApproveAssessmentImprovePlan,
  UpdateAssessmentImprovePlan,
} from '@/services/performance';
import { Message } from 'element-ui';
import { getToken } from '@/utils/token';

export default defineComponent({
  setup(props, ctx) {
    const router = useRouter();
    const status = ref(0);
    const assessment_detail_id = ref();
    // const showSignature = ref<boolean>(false);
    const show = (value: IMPROVEMENT_STATUS, isMe: boolean, id = router.currentRoute.params.id) => {
      console.log('编辑', value, isMe);
      status.value = value;
      assessment_detail_id.value = id;
      console.log('assessment_detail_id', value, isMe, assessment_detail_id.value);

      /* 仅上级显示签名-又说不用了 */
      // showSignature.value = !isMe;
      if (
        status.value === IMPROVEMENT_STATUS.UNDER_FORMULATION ||
        status.value === IMPROVEMENT_STATUS.REJECTED
      ) {
        isEdit.value = true;
      }
      getImprovePlan();
    };
    /* 获取配置 */
    const getImprovePlan = () => {
      QueryAssessmentImprovePlan({ assessment_detail_id: assessment_detail_id.value }).then(res => {
        if (res.data.success) {
          for (const key in res.data.data) {
            if (key === 'assessment_improve' && !res.data.data[key]?.length) continue;
            formData.value[key] = res.data.data[key] || '';
            formData.value['assessment_improve_plan_id'] = res.data.data['id']; //提交时需要assessment_improve_plan_id
          }
          console.log('获取配置', formData.value);
        }
      });
    };

    const formData = ref({
      department_communication_record: '', //部门沟通记录
      hrbp_communication_record: undefined, //HRBP与员工绩效沟通记录
      assessment_improve: [
        {
          number: 1,
          assessment_target_formulate: '', //绩效目标制定
          convention_reach_date: undefined, //约定达成日期
          real_completion: '', //实际完成情况
          existing_problems: '', //存在问题
        },
      ],
      convention_solution: '', //约定解决方案
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', {
            type: status.value,
            message: formData.value.id,
          });
        }
      });
    };

    const formRef = ref<IFormRef>();
    const onDeleteDelivery = (index: number) => {
      console.log('index', index);

      formData.value.assessment_improve.splice(index, 1);
    };
    const onAddDelivery = () => {
      formData.value.assessment_improve.push({
        number:
          formData.value.assessment_improve[formData.value.assessment_improve.length - 1]?.number +
            1 || 1, //后端唯一标识
        assessment_target_formulate: '', //绩效目标制定
        convention_reach_date: undefined, //约定达成日期
        real_completion: '', //实际完成情况
        existing_problems: '', //存在问题
      });
    };
    /* 是否编辑 */
    const isEdit = ref(false);
    /* 驳回 */
    const loading = ref(false);
    const dialogRejectProcess = useDialog({
      component: rejectProcess,
      title: '驳回绩效改进计划',
      width: '375px',
      on: {
        submit: async ({ type, message }: any) => {
          console.log('type', type, message);
          loading.value = true;
          ApproveAssessmentImprovePlan({
            status: 3,
            reject_reason: message,
            assessment_improve_plan_id: formData.value.assessment_improve_plan_id,
          }).then(res => {
            loading.value = false;
            if (res.data.success) {
              Message.success(res.data.message);
            } else {
              Message.error(res.data.message);
            }
            // await Confirm('确定要驳回吗?');
            dialogRejectProcess.close();
            ctx.emit('submit');
          });
        },
      },
    });
    const cancel = () => {
      ctx.emit('close');
    };
    /* 待发起 */
    const UNDER_FORMULATION_METHODS = {
      onSaveBtnClick() {
        formRef.value?.validate(success => {
          if (success) {
            const fuc =
              status.value === IMPROVEMENT_STATUS.WAIT_UPDATED
                ? UpdateAssessmentImprovePlan
                : SubmitAssessmentImprovePlan;
            fuc(formData.value).then(res => {
              if (res.data.success) {
                Message.success(res.data.message);
                ctx.emit('submit');
              } else {
                Message.error(res.data.message);
                ctx.emit('close');
              }
            });
          }
        });
      },
      temporaryStorage() {
        /* 保存 */
        SaveAssessmentImprovePlan(formData.value).then(res => {
          if (res.data.success) {
            Message.success(res.data.message);
            ctx.emit('submit');
          } else {
            Message.error(res.data.message);
            ctx.emit('close');
          }
        });
      },
    };
    /* 待审批 */
    const UNDER_APPROVAL_METHODS = {
      approvedCancel() {
        if (!isEdit.value) {
          dialogRejectProcess.show('驳回');
          return;
        }
        isEdit.value = false;
      },
      adjustmentPlan() {
        if (isEdit.value) {
          /* 调整 */
          formRef.value?.validate(success => {
            if (success) {
              loading.value = true;
              SaveAssessmentImprovePlan(formData.value).then(res => {
                if (res.data.success) {
                  Message.success(res.data.message);
                  loading.value = false;
                  ctx.emit('submit');
                } else {
                  Message.error(res.data.message);
                  ctx.emit('close');
                }
              });
            }
          });
          return;
        }
        isEdit.value = true;
      },
      by() {
        loading.value = true;
        ApproveAssessmentImprovePlan({
          status: 2,
          assessment_improve_plan_id: formData.value.assessment_improve_plan_id,
        }).then(res => {
          loading.value = false;
          if (res.data.success) {
            Message.success(res.data.message);
            ctx.emit('submit');
          } else {
            Message.error(res.data.message);
            ctx.emit('close');
          }
          // await Confirm('确定要驳回吗?');
        });
      },
    };
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      onDeleteDelivery,
      onAddDelivery,
      status,
      isEdit,
      UNDER_APPROVAL_METHODS,
      UNDER_FORMULATION_METHODS,
      loading,
      cancel,
    };
  },
  methods: {},
  render() {
    const { formData, status } = this;
    let operator = [] as any;
    switch (status) {
      case IMPROVEMENT_STATUS.UNDER_FORMULATION:
      case IMPROVEMENT_STATUS.WAIT_UPDATED:
      case IMPROVEMENT_STATUS.REJECTED:
        operator = [
          <tg-button onClick={this.cancel}>取消</tg-button>,
          <tg-button onClick={this.UNDER_FORMULATION_METHODS.temporaryStorage}>保存</tg-button>,
          <tg-button type="primary" onClick={this.UNDER_FORMULATION_METHODS.onSaveBtnClick}>
            提交
          </tg-button>,
        ];
        break;
      case IMPROVEMENT_STATUS.CHECK_PENDING:
        operator = [
          <tg-button onClick={this.UNDER_APPROVAL_METHODS.approvedCancel}>
            {!this.isEdit ? '驳回' : '取消'}
          </tg-button>,
          <tg-button onClick={this.UNDER_APPROVAL_METHODS.adjustmentPlan}>
            {!this.isEdit ? '调整计划' : '提交'}
          </tg-button>,
          <tg-button v-show={!this.isEdit} type="primary" onClick={this.UNDER_APPROVAL_METHODS.by}>
            通过
          </tg-button>,
        ];
        break;
      case IMPROVEMENT_STATUS.COMPLETED:
        operator = [
          <tg-button type="primary" onClick={this.cancel}>
            确定
          </tg-button>,
        ];
        break;
    }

    return (
      <div class="dialog-container" v-loading={this.loading}>
        <el-form
          size="mini"
          ref="formRef"
          class="form-box"
          // inline={true}
          // hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <div class="header-box">
            <div class="header-item">
              <span>花名：</span>
              <span>{formData.assessed_username}</span>
            </div>
            <div class="header-item">
              <span>岗位：</span>
              <span>{formData.assessed_job_title}</span>
            </div>
            <div class="header-item">
              <span>本次考核等级：</span>
              <span>{formData.level}</span>
            </div>
          </div>
          <div v-show={this.isEdit}>
            <el-form-item
              label="部门负责人与员工绩效沟通记录"
              prop="department_communication_record"
              rules={{
                required: true,
                message: '请输入部门负责人与员工绩效沟通记录',
                // trigger: 'blur',
              }}
            >
              <el-input
                type="textarea"
                autosize={{ minRows: 2, maxRows: 3 }}
                placeholder="阐明考核评定的结果与依据，分析尚待改进的部分"
                v-model={formData.department_communication_record}
                validate-event={false}
              ></el-input>
            </el-form-item>
            <el-form-item label="HRBP与员工绩效沟通记录">
              <el-input
                type="textarea"
                autosize={{ minRows: 2, maxRows: 3 }}
                placeholder="协助分析考评结果和待改进的部分"
                v-model={formData.hrbp_communication_record}
              ></el-input>
            </el-form-item>
            <el-form-item
              label="绩效改进计划"
              class="date-picker-item"
              prop="assessment_improve"
              rules={[
                {
                  required: true,
                  validator: (rule: any, value: any, callback: any) => {
                    for (const i in value) {
                      for (const j in value[i]) {
                        if (j === 'assessment_target_formulate' || j === 'convention_reach_date') {
                          if (!value[i][j]) {
                            callback(new Error('请填写完整'));
                          }
                        }
                      }
                      // Object.values(value[i]).forEach((item: any) => {
                      //   if (!item) {
                      //     callback(new Error('请填写完整'));
                      //   }
                      // });
                    }
                    callback();
                  },
                  trigger: ['blur'],
                },
              ]}
            >
              <div class="table-box">
                <div class="table-header">
                  <div>序号</div>
                  <div>绩效目标制定</div>
                  <div>约定达成时间</div>
                  <div>
                    实际完成情况 <span class="subTitle">(复盘时填写)</span>
                  </div>
                  <div>
                    当中存在问题 <span class="subTitle">(复盘时填写)</span>
                  </div>
                  <div>操作</div>
                </div>
                <div class="table-body">
                  {formData.assessment_improve.map((item: any, index: number) => {
                    return (
                      <div class="table-item">
                        <div>{index + 1}</div>
                        <div>
                          <el-input
                            type="textarea"
                            autosize={{ minRows: 1, maxRows: 3 }}
                            v-model={item.assessment_target_formulate}
                            placeholder="请输入"
                            validate-event={false}
                          />
                        </div>
                        <div style="padding: 4px 0;">
                          <el-date-picker
                            v-model={item.convention_reach_date}
                            class="date-picker"
                            value-format={'yyyy-MM-dd'}
                            type="date"
                            range-separator="~"
                            placeholder="请选择日期"
                            size="mini"
                            style="width: 118px;"
                            format="yyyy.MM.dd"
                            validate-event={false}
                            pickerOptions={{
                              disabledDate(time: Date) {
                                return time.getTime() <= Date.now() - 8.64e7;
                              },
                            }}
                          />
                        </div>
                        <div>
                          <el-input disabled v-model={item.real_completion} />
                        </div>
                        <div>
                          <el-input disabled v-model={item.existing_problems} />
                        </div>
                        <div>
                          <tg-icon
                            disabled={formData.assessment_improve.length <= 1}
                            class="ico-btn"
                            name="ico-btn-delete"
                            onClick={() => this.onDeleteDelivery(index)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div class="table-add">
                  <tg-button class="ico-btn-add" icon="ico-btn-add" onClick={this.onAddDelivery}>
                    新增计划
                  </tg-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              style="margin-top: 18px;"
              label="如下一考核周期，绩效仍未改进，约定解决办法"
              prop="convention_solution"
              rules={{
                required: true,
                message: '请输入',
                // trigger: 'blur',
              }}
            >
              <el-input
                type="textarea"
                autosize={{ minRows: 2, maxRows: 3 }}
                placeholder="请输入"
                v-model={formData.convention_solution}
                validate-event={false}
              ></el-input>
            </el-form-item>
          </div>
          {/* 查看 */}
          <div class="reading" v-show={!this.isEdit}>
            <div class="mgb-6">1、部门负责人与员工绩效沟通记录</div>
            <div class="content">{formData.department_communication_record || '--'}</div>
            <div class="mgb-6">2、HRBP与员工绩效沟通记录</div>
            <div class="content">{formData.hrbp_communication_record || '--'}</div>
            <div class="mgb-6">3、绩效改进计划</div>
            <div class="table-box mgb-18" style={'margin-left:18px'}>
              <div class="table-header" style="grid-template-columns: 48px 235px 141px 208px 1fr;">
                <div>序号</div>
                <div>绩效目标制定</div>
                <div>约定达成时间</div>
                <div>
                  实际完成情况 <span class="subTitle">(复盘时填写)</span>
                </div>
                <div>
                  当中存在问题 <span class="subTitle">(复盘时填写)</span>
                </div>
              </div>
              <div class="table-body">
                {formData.assessment_improve.map((item: any, index: number) => {
                  return (
                    <div
                      class="table-item"
                      style="grid-template-columns: 48px 235px 141px 208px 1fr;"
                    >
                      <div>{index + 1}</div>
                      <div
                        style={
                          this.status !== IMPROVEMENT_STATUS.WAIT_UPDATED &&
                          'align-items: baseline;'
                        }
                      >
                        {item.assessment_target_formulate}
                      </div>
                      <div>{item.convention_reach_date}</div>
                      <div
                        class={
                          this.status === IMPROVEMENT_STATUS.CHECK_PENDING && 'dashedBackground'
                        }
                        style={
                          this.status !== IMPROVEMENT_STATUS.WAIT_UPDATED &&
                          'align-items: baseline;'
                        }
                      >
                        {this.status === IMPROVEMENT_STATUS.WAIT_UPDATED ? (
                          <el-input
                            // style="height: 27px;"
                            type="textarea"
                            autosize={{ minRows: 2, maxRows: 3 }}
                            size="mini"
                            v-model={item.real_completion}
                            placeholder="请输入"
                          />
                        ) : (
                          item.real_completion
                        )}
                      </div>
                      <div
                        class={
                          this.status === IMPROVEMENT_STATUS.CHECK_PENDING && 'dashedBackground'
                        }
                        style={
                          this.status !== IMPROVEMENT_STATUS.WAIT_UPDATED &&
                          'align-items: baseline;'
                        }
                      >
                        {this.status === IMPROVEMENT_STATUS.WAIT_UPDATED ? (
                          <el-input
                            // style="height: 27px;"
                            type="textarea"
                            autosize={{ minRows: 2, maxRows: 3 }}
                            size="mini"
                            v-model={item.existing_problems}
                            placeholder="请输入"
                          />
                        ) : (
                          item.existing_problems
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div class="mgb-6">4、如下一考核周期，绩效仍未改进，约定解决办法</div>
            <div class="content">{formData.convention_solution || '--'}</div>
          </div>
          <div class="declaration-title">特别声明</div>
          <div class="declaration">
            本人同意遵守构美（浙江）信息科技有限公司《2022年公司绩效管理办法》，对本次绩效沟通的内容、改进的意见以及制定的下一阶段绩效改进目标和对应约定表示认可，没有异议。
          </div>
          <div class="imgbox" v-show={status > IMPROVEMENT_STATUS.UNDER_FORMULATION}>
            <img src={`${formData.signature_url}?Authorization=${getToken()}`} alt="" />
          </div>
        </el-form>
        <div class="footer-box">{operator}</div>
      </div>
    );
  },
});
