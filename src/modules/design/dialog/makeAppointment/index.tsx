import { defineComponent, ref, watch } from '@vue/composition-api';
import { Message } from 'element-ui';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { Select } from '@gm/component/select';
import {
  Check_Reservation_Form_Date,
  Query_Project_Name,
  Save_Reservation_Form,
} from '@/services/design';
import moment from 'moment';
import { ElForm } from 'element-ui/types/form';

export default defineComponent({
  setup(props, ctx) {
    const show = (value: M.design.Reservation) => {
      if (value) {
        const formValue: M.design.Reservation & any = { ...value };
        formValue.appointment_date_list = [moment(formValue.appointment_date)];
        formValue.appointment_time = null;
        checkFormDate(formValue.appointment_date_list).then((res: any) => {
          const list = res.data.data;
          const find = list.find((it: any) => it.label === value.appointment_time);
          if (find && find.disabled !== true) {
            formData.value.appointment_time = find.value;
          }
        });
        reqProjectName.pagination.reQuery({
          project_id: formValue.project_id,
          search_type: 1,
          business_type: formValue.business_type,
        });

        formData.value = formValue;
      }
    };
    const reqSaveAssement = useRequest(Save_Reservation_Form, { manual: true });
    const formData = ref<M.design.Reservation>({
      scene_graph: [],
      design_sketch: [],
      project_id: undefined,
      appointment_time: null,
      appointment_date_list: [],
      start_broadcast_time: null,
    } as any);
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (!success) {
          return;
        }
        const params = { ...formData.value };
        params.appointment_date_list = params.appointment_date_list.map(it =>
          moment(it).format('YYYY-MM-DD'),
        );
        if (params.appointment_subject === E.design.AppointmentSubject.MODEL) {
          params.anchor_type = null as any;
        }
        reqSaveAssement.runAsync(params).then(() => {
          Message.success('发起成功');
          ctx.emit('submit');
          ctx.emit('close');
        });
      });
    };
    const reqProjectName = usePagination(Query_Project_Name, {
      manual: true,
      transform: data => {
        return data.data.map(it => {
          return {
            label: it.project_name,
            value: it.project_id,
          };
        });
      },
    });
    const reqCheckFormDate = useRequest(Check_Reservation_Form_Date, {
      manual: true,
      // onSuccess(_, res) {
      //   if (res.data.message) {
      //     ctx.root.$message.success(res.data.message);
      //   }
      // },
      transform(data) {
        return data.map(it => {
          return {
            label: it.message ? `${it.label} (${it.message})` : it.label,
            value: it.label,
            disabled: it.disabled,
          };
        });
      },
    });
    const checkFormDate = (val: string[]) => {
      const transVal = val.map((date: string) => {
        return moment(date).format('YYYY-MM-DD') as string;
      });
      return reqCheckFormDate.runAsync(transVal);
    };
    const remoteMethod = (val: string) => {
      reqProjectName.pagination.reQuery({
        project_name: val,
        search_type: 1,
        business_type: formData.value.business_type,
      });
    };
    // const formRef = ref<IFormRef>();
    const formRef = ref<ElForm | null>(null);
    watch(
      () => formData.value.design_sketch,
      () => {
        if (formData.value.design_sketch && formData.value.design_sketch.length > 0) {
          setTimeout(() => {
            formRef.value?.clearValidate('design_sketch');
          }, 10);
        }
      },
    );
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      reqProjectName,
      remoteMethod,
      reqCheckFormDate,
      checkFormDate,
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form
        size="mini"
        ref="formRef"
        attrs={{
          model: formData,
        }}
      >
        <div class="form-body">
          <el-form-item
            label="妆造类型"
            prop="image_design_type"
            rules={{ required: true, message: '请选择妆造类型', trigger: ['change'] }}
          >
            <Select
              v-model={formData.image_design_type}
              placeholder="请选择妆造类型"
              options={E.design.ImageDesignTypeOption}
            />
          </el-form-item>
          {formData.image_design_type !== E.design.ImageDesignType.INTERNAL && (
            <el-form-item
              label="业务类型"
              prop="business_type"
              rules={{ required: true, message: '请选择业务类型', trigger: ['change'] }}
            >
              <Select
                popper-class="el-select-popper-mini"
                v-model={formData.business_type}
                placeholder="请选择业务类型"
                options={E.project.BusinessTypeOption}
                onChange={() => {
                  formData.project_id = '' as any;
                }}
              />
            </el-form-item>
          )}

          {formData.image_design_type !== E.design.ImageDesignType.INTERNAL && (
            <el-form-item
              label="项目名称"
              prop="project_id"
              rules={{ required: true, message: '请选择项目名称', trigger: ['change'] }}
            >
              <Select
                popper-class="el-select-popper-mini"
                disabled={formData.business_type === undefined}
                remote
                remote-method={this.remoteMethod}
                filterable
                v-model={formData.project_id}
                placeholder="请选择项目名称"
                options={this.reqProjectName.data as any}
              />
            </el-form-item>
          )}

          <el-form-item
            label="预约主体"
            prop="appointment_subject"
            rules={{ required: true, message: '请选择预约主体', trigger: ['change'] }}
          >
            <Select
              popper-class="el-select-popper-mini"
              v-model={formData.appointment_subject}
              placeholder="请选择预约主体"
              options={E.design.AppointmentSubjectOption}
            />
          </el-form-item>
          {formData.appointment_subject === E.design.AppointmentSubject.ANCHOR && (
            <el-form-item
              label="主播类型"
              prop="anchor_type"
              rules={{ required: true, message: '请选择主播类型', trigger: ['change'] }}
            >
              <Select
                popper-class="el-select-popper-mini"
                v-model={formData.anchor_type}
                placeholder="请选择主播类型"
                options={E.supplier.AnchorTypeOption}
              />
            </el-form-item>
          )}

          <el-form-item
            label="预约日期"
            prop="appointment_date_list"
            rules={{ required: true, message: '请选择预约日期', trigger: ['change'] }}
          >
            <el-date-picker
              size="mini"
              v-model={formData.appointment_date_list}
              type="dates"
              format="yyyy.MM.dd"
              placeholder="请选择预约日期"
              onChange={(val: string[] | null) => {
                this.reqCheckFormDate.data = [] as any;
                formData.appointment_time = null as any;
                if (val === null) {
                  return;
                }
                this.checkFormDate(val);
              }}
            />
          </el-form-item>
          <el-form-item
            label="预约时间"
            prop="appointment_time"
            rules={{ required: true, message: '请选择预约时间', trigger: ['change'] }}
          >
            <Select
              popper-class="el-select-popper-mini"
              disabled={
                formData.appointment_date_list === null ||
                formData.appointment_date_list.length === 0
              }
              v-model={formData.appointment_time}
              placeholder="请选择预约时间"
              options={this.reqCheckFormDate.data as any}
            />
          </el-form-item>
          <el-form-item
            label="开播时间"
            prop="start_broadcast_time"
            rules={{ required: true, message: '请选择开播时间', trigger: ['change'] }}
          >
            <el-time-picker
              size="mini"
              v-model={formData.start_broadcast_time}
              placeholder="请选择开播时间"
              format="HH:mm"
              value-format="HH:mm"
            />
          </el-form-item>
          <el-form-item
            label="服务类型"
            prop="service_type"
            rules={{ required: true, message: '请选择服务类型', trigger: ['change'] }}
          >
            <Select
              popper-class="el-select-popper-mini"
              v-model={formData.service_type}
              placeholder="请选择服务类型"
              options={E.design.ServiceTypeOption}
            />
          </el-form-item>
          <el-form-item
            label="相关要求"
            prop="relevant_requirement"
            class="xiangguanyaoqiu"
            rules={{ required: true, message: '请输入相关要求', trigger: ['change'] }}
          >
            <el-input
              show-word-limit={true}
              maxlength={200}
              rows={3}
              type="textarea"
              v-model={formData.relevant_requirement}
              placeholder="请输入相关要求"
            />
          </el-form-item>
          <div class="pic-grid">
            <el-form-item label="场景图（≤3）张">
              <div class="upload-list">
                {formData.scene_graph.map((url, index) => {
                  return (
                    <div class="file-wrapper">
                      <div class="file">
                        <tg-image src={url} fit="cover" />
                      </div>
                      <div class="svg">
                        <tg-icon
                          name="ico-a-quseguanbiicon2x"
                          onClick={() => {
                            formData.scene_graph.splice(index, 1);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {formData.scene_graph.length < 3 && (
                  <tg-upload
                    action="/api/image_design/upload_image_design"
                    multiple
                    limit={3}
                    show-file-list={false}
                    beforeUpload={ValidationFileUpload({
                      fileSize: 100,
                      image: true,
                    })}
                    success={(res: { data: { source: string } }) => {
                      formData.scene_graph.push(res.data.source);
                    }}
                  >
                    <div class="upload-btn mgt-30">
                      <i class="el-icon-plus avatar-uploader-icon" />
                      <span>上传照片</span>
                    </div>
                  </tg-upload>
                )}
              </div>
              <div class="mgt-6" style="color:var(--text-third-color);font-size:12px">
                仅支持PNG,JPG,JPEG格式图片，单张不超过100M
              </div>
            </el-form-item>
            <el-form-item
              label="效果借鉴图（≤3）张"
              prop="design_sketch"
              rules={{
                required: true,
                message: '请上传效果借鉴图',
                trigger: ['change'],
              }}
            >
              <div class="upload-list">
                {formData.design_sketch.map((url, index) => {
                  return (
                    <div class="file-wrapper">
                      <div class="file">
                        <tg-image src={url} fit="cover" />
                      </div>
                      <div class="svg">
                        <tg-icon
                          name="ico-a-quseguanbiicon2x"
                          onClick={() => {
                            formData.design_sketch.splice(index, 1);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {formData.design_sketch.length < 3 && (
                  <tg-upload
                    action="/api/image_design/upload_image_design"
                    show-file-list={false}
                    multiple
                    limit={3}
                    beforeUpload={ValidationFileUpload({
                      fileSize: 100,
                      image: true,
                    })}
                    success={(res: { data: { source: string } }) => {
                      formData.design_sketch.push(res.data.source);
                    }}
                  >
                    <div class="upload-btn mgt-30">
                      <i class="el-icon-plus avatar-uploader-icon" />
                      <span>上传照片</span>
                    </div>
                  </tg-upload>
                )}
              </div>
              <div class="mgt-6" style="color:var(--text-third-color);font-size:12px">
                仅支持PNG,JPG,JPEG格式图片，单张不超过100M
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    );
  },
});
/**
 * 今天早上发现
 **/
