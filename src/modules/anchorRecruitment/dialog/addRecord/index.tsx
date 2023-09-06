import { QueryShopAndCommonProject, SaveOrUpdateAnchorRecruit } from '@/services/anchorRecruitment';
import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import Limit from '@/utils/inputLimit';
import { UserInfo } from '@/types/tiange/system';
import { CommonBusinessProject } from '@/types/tiange/commonBusiness/project';
import { QueryAnchorList } from '@/services/supplier';
import { GetUser } from '@/services/system';
import { projectLabelDisplay } from '../../use/common';
import { wait } from '@/utils/func';

export default defineComponent({
  setup(props, ctx) {
    const anchorLoading = ref(false);
    const anchorOptions = ref<any[]>([]);
    const referrerLoading = ref(false);
    const referrerOptions = ref<UserInfo[]>([]);
    const projectLoading = ref(false);
    const projectOptions = ref<CommonBusinessProject[]>([]);
    const queryForm = ref<M.anchorRecruitment.AddAnchorRecruitmentRecordParams>({
      anchor_id: undefined,
      business_cost: undefined,
      comment: undefined,
      cooperation_class: undefined,
      cooperation_cost_describe: undefined,
      cooperation_mode: undefined,
      project_counterpart_id: undefined,
      project_id: undefined,
      recruit_id: undefined,
    });
    const loading = ref(false);
    const elFormRef = ref<ElForm | undefined>(undefined);
    const recruitRecord = ref<M.anchorRecruitment.AnchorRecruitmentModel | undefined>(undefined);
    const methods = {
      show(recruit_record?: M.anchorRecruitment.AnchorRecruitmentModel) {
        queryForm.value.anchor_id = recruit_record?.anchor_id;
        queryForm.value.business_cost =
          recruit_record?.business_cost !== undefined && recruit_record?.business_cost !== null
            ? recruit_record.business_cost / 100
            : undefined;
        queryForm.value.comment = recruit_record?.comment;
        queryForm.value.cooperation_class = recruit_record?.cooperation_class;
        queryForm.value.cooperation_cost_describe = recruit_record?.cooperation_cost_describe;
        queryForm.value.cooperation_mode = recruit_record?.cooperation_mode;
        queryForm.value.project_counterpart_id = recruit_record?.project_counterpart_id;
        queryForm.value.project_id = recruit_record?.project_id;
        queryForm.value.recruit_id = recruit_record?.recruit_id;
        recruitRecord.value = recruit_record;
        methods.insertDefaultOptions('all');
      },
      onSaveBtnClick() {
        elFormRef.value?.validate(success => {
          if (success) {
            methods.evaluateAnchorRecruit();
          }
        });
      },
      onCancel() {
        ctx.emit('close');
      },
      async evaluateAnchorRecruit() {
        // const { recruit_id } = queryForm.value;
        // if (!recruit_id) {
        //   return;
        // }
        loading.value = true;
        // queryForm.value.business_cost = (queryForm.value.business_cost || 0) * 100;
        const { business_cost, ...rest } = queryForm.value;
        const res = await SaveOrUpdateAnchorRecruit({
          business_cost: (business_cost || 0) * 100,
          ...rest,
        });
        loading.value = false;
        if (res.data.success) {
          ctx.emit('submit');
          ctx.emit('close');
          Message.success(res.data.message);
        } else {
          Message.error(res.data.message);
        }
      },
      async queryAnchorList(keywords?: string) {
        if (!keywords) {
          anchorOptions.value = [];
          return;
        }
        anchorLoading.value = true;
        const [res] = await wait(
          200,
          QueryAnchorList({
            flower_name: keywords,
            page_num: 1,
            num: 1000,
          }),
        );
        anchorLoading.value = false;
        if (res.data.success) {
          anchorOptions.value = res.data.data.data || [];
        } else {
          anchorOptions.value = [];
        }
        methods.insertDefaultOptions('anchor', keywords);
      },
      async getUser(keywords?: string) {
        if (!keywords) {
          referrerOptions.value = [];
          return;
        }
        referrerLoading.value = true;
        const [res] = await wait(
          200,
          GetUser({
            page_num: 1,
            num: 1000,
            search_type: 2,
            search_value: keywords,
            is_checked: 1,
          }),
        );
        referrerLoading.value = false;
        if (res.data.success) {
          referrerOptions.value = res.data.data.data || [];
        } else {
          referrerOptions.value = [];
        }
        methods.insertDefaultOptions('counterpart', keywords);
      },
      async queryShopAndCommonProject(keywords?: string) {
        if (!keywords) {
          projectOptions.value = [];
          return;
        }
        projectLoading.value = true;
        const [res] = await wait(
          200,
          QueryShopAndCommonProject({
            page_num: 1,
            num: 1000,
            search_type: 6,
            search_value: keywords,
          }),
        );
        projectLoading.value = false;
        if (res.data.success) {
          projectOptions.value = res.data.data.data || [];
        } else {
          projectOptions.value = [];
        }
        methods.insertDefaultOptions('project', keywords);
      },
      insertDefaultOptions(type: 'all' | 'project' | 'anchor' | 'counterpart', keywords?: string) {
        if (!recruitRecord.value) return;
        if (type === 'project' || type === 'all') {
          if (
            queryForm.value.project_id === recruitRecord.value?.project_id &&
            recruitRecord.value?.project_id !== 0
          ) {
            if (!keywords || recruitRecord.value.project_name?.indexOf(keywords) !== -1) {
              const finder = projectOptions.value.find(
                el => el.id === recruitRecord.value?.project_id,
              );
              if (!finder) {
                projectOptions.value.unshift({
                  project_name: recruitRecord.value.project_name,
                  id: recruitRecord.value.project_id,
                  business_type: recruitRecord.value.business_type,
                } as any);
              }
            }
          }
        }
        if (type === 'anchor' || type === 'all') {
          if (queryForm.value.anchor_id === recruitRecord.value?.anchor_id) {
            if (!keywords || recruitRecord.value.anchor_flower_name?.indexOf(keywords) !== -1) {
              const finder = anchorOptions.value.find(
                el => el.id === recruitRecord.value?.anchor_id,
              );
              if (!finder) {
                anchorOptions.value.unshift({
                  flower_name: recruitRecord.value.anchor_flower_name,
                  id: recruitRecord.value.anchor_id,
                  real_name: recruitRecord.value.anchor_real_name,
                });
              }
            }
          }
        }
        if (type === 'counterpart' || type === 'all') {
          if (
            queryForm.value.project_counterpart_id === recruitRecord.value?.project_counterpart_id
          ) {
            if (
              !keywords ||
              recruitRecord.value.project_counterpart_name?.indexOf(keywords) !== -1
            ) {
              const finder = referrerOptions.value.find(
                el => el.id === recruitRecord.value?.project_counterpart_id,
              );
              if (!finder) {
                referrerOptions.value.unshift({
                  username: recruitRecord.value.project_counterpart_name,
                  id: recruitRecord.value.project_counterpart_id,
                } as any);
              }
            }
          }
        }
      },
      projectLabelDisplay,
    };
    return {
      loading,
      anchorOptions,
      anchorLoading,
      referrerLoading,
      referrerOptions,
      projectLoading,
      projectOptions,
      elFormRef,
      queryForm,
      ...methods,
    };
  },
  render() {
    return (
      <div class="recruitment-record-dialog">
        <el-form
          ref="elFormRef"
          size="mini"
          label-width="68px"
          attrs={{ model: this.queryForm }}
          class="recruitment-record-dialog-content"
        >
          <section class="recruitment-info">
            <div class="title">
              <span>招募信息</span>
            </div>
            <div class="two-columns mgt-16">
              <el-form-item
                prop="project_id"
                label="关联项目："
                rules={{ required: true, message: '请选择项目', trigger: 'change' }}
              >
                {/* <el-select v-model={this.queryForm.project_id}>
                  <el-option label="项目1" value={1} key={1}></el-option>
                  <el-option label="项目2" value={2} key={2}></el-option>
                </el-select> */}
                <el-select
                  v-model={this.queryForm.project_id}
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入项目名称搜索"
                  remote-method={this.queryShopAndCommonProject}
                  loading={this.projectLoading}
                  // clearable
                >
                  {this.projectOptions.length < 1 && (
                    <el-option key={0} label="暂无项目" value={0}></el-option>
                  )}
                  {this.projectOptions.map(el => (
                    <el-option
                      key={el.id}
                      label={this.projectLabelDisplay(el)}
                      value={el.id}
                    ></el-option>
                  ))}
                </el-select>
              </el-form-item>
              <el-form-item
                prop="project_counterpart_id"
                label="负责人："
                rules={{ required: true, message: '请选择负责人', trigger: 'change' }}
              >
                {/* <el-select v-model={this.queryForm.project_counterpart_id}>
                  <el-option label="负责人1" value={1} key={1}></el-option>
                  <el-option label="负责人2" value={2} key={2}></el-option>
                </el-select> */}
                <el-select
                  v-model={this.queryForm.project_counterpart_id}
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入花名搜索"
                  remote-method={this.getUser}
                  loading={this.referrerLoading}
                  // clearable
                >
                  {this.referrerOptions.map(el => (
                    <el-option key={el.id} label={`${el.username}`} value={el.id}></el-option>
                  ))}
                </el-select>
              </el-form-item>
            </div>
            <el-form-item
              prop="cooperation_class"
              class="text-item radio-field mgt-16"
              label="合作内容："
              rules={{ required: true, message: '请选择合作内容', trigger: 'change' }}
            >
              <el-radio-group v-model={this.queryForm.cooperation_class}>
                {E.supplier.RecruitmentCooperationContentOption.map(el => (
                  <el-radio label={el.value} key={el.value}>
                    {el.label}
                  </el-radio>
                ))}
              </el-radio-group>
            </el-form-item>
          </section>
          <section class="recruitment-result">
            <div class="title">
              <span>招募结果</span>
            </div>
            <div class="two-columns mgt-16">
              <el-form-item
                prop="anchor_id"
                label="主播花名："
                rules={{ required: true, message: '请选择主播花名', trigger: 'change' }}
              >
                {/* <el-select v-model={this.queryForm.anchor_id}>
                  <el-option label="主播1" value={1} key={1}></el-option>
                  <el-option label="主播2" value={2} key={2}></el-option>
                </el-select> */}
                <el-select
                  v-model={this.queryForm.anchor_id}
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入花名搜索"
                  remote-method={this.queryAnchorList}
                  loading={this.anchorLoading}
                  // clearable
                >
                  {this.anchorOptions.map(el => (
                    <el-option
                      key={el.id}
                      label={`${el.flower_name} (${el.real_name})`}
                      value={el.id}
                    ></el-option>
                  ))}
                </el-select>
              </el-form-item>
              <el-form-item
                prop="cooperation_mode"
                label="合作情况："
                rules={{ required: true, message: '请选择合作情况', trigger: 'change' }}
              >
                <el-select placeholder="请选择合作情况" v-model={this.queryForm.cooperation_mode}>
                  {E.supplier.RecruitmentCooperationModeOption.map(el => (
                    <el-option label={el.label} value={el.value} key={el.value}></el-option>
                  ))}
                </el-select>
              </el-form-item>
              <el-form-item
                prop="business_cost"
                label="商务费用："
                rules={{ required: true, message: '请输入商务费用', trigger: 'blur' }}
              >
                <el-input
                  placeholder="请输入商务费用"
                  v-model={this.queryForm.business_cost}
                  on-input={(value: string) =>
                    (this.queryForm.business_cost = Limit.EightIntergerAndDecimals(value) as any)
                  }
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <el-form-item
              prop="cooperation_cost_describe"
              class="mgt-16 cooperation_cost_describe_field"
              label="合作费用："
              rules={{ required: true, message: '请输入合作费用', trigger: 'change' }}
            >
              <el-input
                placeholder="请输入合作费用"
                type="textarea"
                maxlength={30}
                show-word-limit
                v-model={this.queryForm.cooperation_cost_describe}
              ></el-input>
            </el-form-item>
            <el-form-item class="mgt-16" label="其它说明：">
              <el-input
                type="textarea"
                placeholder="请输入其它说明"
                maxlength={100}
                show-word-limit
                v-model={this.queryForm.comment}
              ></el-input>
            </el-form-item>
          </section>
        </el-form>
        <tg-mask-loading visible={this.loading} content="  正在保存，请稍候..."></tg-mask-loading>
      </div>
    );
  },
});
