import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import { Message } from 'element-ui';
import supplier from '@/services/supplier';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import moment from 'moment';
const { debounce } = lodash;
const defaultData = () => {
  return {
    business_type: 2,
    base_salary: '',
    commission_rate: '',
    end_date: '',
    start_date: '',
    settlement_type: 1,
    hourly_wage: '',
    project_id: '',
    appendix: [],
    coop_dates: [],
  };
};
export default defineComponent({
  components: {},
  props: {
    save: {
      type: Function as PropType<any>,
    },
  },
  setup(props: { save: (arg: any) => Promise<any> }, ctx) {
    const formRef = ref<ElForm | null>(null);
    const title = ref('');
    const visible = ref(false);
    const project_list = ref<any>([]);

    const formData = ref<any>({
      ...defaultData(),
    });
    const selectRange = computed(() => {
      const result = [];
      const find = project_list.value.find(
        (item: any) => item.project_id === formData.value.project_id,
      );
      if (find) {
        result[0] = find.start_date;
        result[1] = find.end_date;
      }
      return result;
    });
    // watch(
    //   () => formData.value.project_id,
    //   (newVal, oldVal) => {
    //     if (oldVal !== '') {
    //       formData.value.coop_dates = [];
    //     }
    //   },
    // );
    const hasDisabledDate = (value: Date) => {
      if (selectRange.value.length === 0) return true;
      const currentTime = moment(value);
      if (currentTime.isBefore(selectRange.value[0])) return true;
      if (currentTime.isAfter(selectRange.value[1])) return true;
      return false;
    };
    const months = ref<{ label: string; value: string }[]>([]);

    const onCloseBtnClick = () => {
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      visible.value = false;
    };
    /** 重置表单 */
    const resetForm = () => {
      formData.value = { pics: [], videos: [], status: 1 };
    };

    const show = (_title: string, info: any) => {
      title.value = _title;
      formData.value = { ...defaultData(), ...info };
      if (info.project_id !== null) {
        project_list.value = [{ project_name: info.project_name, project_id: info.project_id }];
      }
      visible.value = true;
    };

    /** 点击保存 */
    const submit = () => {
      formRef.value?.validate(valid => {
        if (valid) {
          props
            .save(formData.value)
            .then(() => {
              visible.value = false;
            })
            .catch(ex => {
              Message.error(ex.message);
            });
        } else {
          return false;
        }
      });
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);
    const query = (key: string) => {
      supplier
        .GetUnCompletedProjects({
          business_type: formData.value.business_type,
          project_name: key,
        })
        .then((res: any) => {
          project_list.value = res;
        });
    };

    return {
      show,
      query,
      title,
      visible,
      formData,
      months,
      onCloseBtnClick,
      onSaveBtnClick,
      formRef,
      project_list,
      selectRange,
      hasDisabledDate,
    };
  },
  render() {
    return (
      <el-dialog
        class="tg-dialog-classic"
        width="440px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <fragments slot="title">{this.title}</fragments>
        <div class="dialog-content">
          <el-form
            attrs={{
              model: this.formData,
            }}
            ref="formRef"
            label-position="top"
            size="mini"
            label-width="106px"
          >
            <div class="line-box first">
              <el-form-item
                class="mgb-18"
                label="业务类型"
                prop="business_type"
                rules={{ required: true, message: `请选择`, trigger: 'blur' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  placeholder="请输入业务类型"
                  v-model={this.formData.business_type}
                  onChange={() => {
                    this.formData.project_id = null;
                    this.project_list = [];
                  }}
                >
                  <el-option label="抖音店播" value={3} />
                  <el-option label="淘宝店播 " value={2} />
                </el-select>
              </el-form-item>
              <el-form-item
                className="mgb-18"
                label="请选择项目"
                prop="project_id"
                rules={{ required: true, message: '请选择项目', trigger: 'blur' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model={this.formData.project_id}
                  filterable
                  remote
                  remote-method={this.query}
                >
                  {this.project_list.map((item: any, key: number) => {
                    return (
                      <el-option label={item.project_name} value={item.project_id} key={key} />
                    );
                  })}
                </el-select>
              </el-form-item>
            </div>
            <div class="line-box">
              <el-form-item
                className="mgb-18"
                label="合作日期"
                prop="coop_dates"
                rules={{ required: true, message: '请选择合作日期', trigger: 'blur' }}
              >
                <el-date-picker
                  v-model={this.formData.coop_dates}
                  type="daterange"
                  range-separator="~"
                  // picker-options={{
                  //   disabledDate: this.hasDisabledDate,
                  // }}
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </div>
            <div class="line-box jiesuanbox">
              <el-form-item
                className="mgb-18"
                label="结算方式"
                prop="settlement_type"
                rules={{ required: true, message: '请选择结算方式', trigger: 'blur' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model={this.formData.settlement_type}
                >
                  <el-option label="时薪" value={1} />
                  <el-option label="底薪+提成" value={3} />
                  <el-option label="底薪和提成选高的" value={2} />
                </el-select>
              </el-form-item>
              {this.formData.settlement_type === 1 && (
                <el-form-item
                  className="mgb-18"
                  label="时薪"
                  prop="hourly_wage"
                  rules={{ required: true, message: '请输入时薪', trigger: 'blur' }}
                >
                  <el-input placeholder="请输入时薪" v-model={this.formData.hourly_wage}>
                    <span slot="append">小时</span>
                  </el-input>
                </el-form-item>
              )}
              {this.formData.settlement_type !== 1 && (
                <el-form-item
                  className="mgb-18"
                  label="底薪"
                  prop="base_salary"
                  rules={{ required: true, message: '请输入底薪', trigger: 'blur' }}
                >
                  <el-input placeholder="请输入底薪" v-model={this.formData.base_salary}>
                    <span slot="append">月</span>
                  </el-input>
                </el-form-item>
              )}
              {this.formData.settlement_type !== 1 && (
                <el-form-item
                  className="mgb-18"
                  label="提成"
                  prop="commission_rate"
                  rules={{ required: true, message: '请输入提成', trigger: 'blur' }}
                >
                  <el-input placeholder="请输入提成" v-model={this.formData.commission_rate}>
                    <span slot="append">%</span>
                  </el-input>
                </el-form-item>
              )}
            </div>
            <div class="line-box jianlibox">
              <el-form-item className="mgb-18" label="合同附件" prop="appendix">
                <div class="jianli-upload">
                  {this.formData.appendix?.length < 5 && (
                    <tg-upload
                      action="/api/anchor/upload_anchor_video"
                      show-file-list={false}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        file: true,
                        image: true,
                        fileSize: 30,
                      })}
                      success={(res: { data: { source: string } }) => {
                        this.formData.appendix.push(res.data.source);
                      }}
                    >
                      <tg-button name="ico-upload">上传附件</tg-button>
                    </tg-upload>
                  )}
                  <span class="file-tips">
                    支持扩展名：.docx .doc .pdf .jpg .png；最多上传5个文件（单个文件大小不超过30M）
                  </span>
                </div>
                <upload-file-list v-model={this.formData.appendix} />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <template slot="footer" style="height: 50px">
          <tg-button size="small" onClick={this.onCloseBtnClick}>
            取消
          </tg-button>
          <tg-button size="small" type="primary" onClick={this.onSaveBtnClick}>
            确定
          </tg-button>
        </template>
      </el-dialog>
    );
  },
});
