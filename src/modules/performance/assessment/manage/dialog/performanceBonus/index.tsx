import { ref, defineComponent, h } from '@vue/composition-api';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { Select } from '@gm/component/select';
import { ExportPerformanceBonus } from '@/services/performance';

export default defineComponent({
  name: 'performanceBonus',
  setup(props, ctx) {
    const formData = ref({
      assessment_management_id: undefined,
      file_path: [],
    } as any);
    const assessmentOption = ref([] as any);
    const show = (value: any[]) => {
      assessmentOption.value = value;
      formData.value.assessment_management_id =
        value.find((item: any) => !item.disabled)?.value ?? undefined;
    };
    const formRef = ref<IFormRef>();
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ExportPerformanceBonus({
            assessment_management_id: formData.value.assessment_management_id,
            file_path: formData.value.file_path[0],
          }).then(res => {
            if (res.data.success) {
              ctx.root.$message.success(res.data.message);
              ctx.emit('close');
            } else {
              ctx.root.$message.error(res.data.message);
            }
          });
        }
      });
    };
    /* upload */
    const method = {
      beforeDataUpload(config: any) {
        return ValidationFileUpload({ excel: true, fileSize: 10 })(config);
      },
      dataSuccessHandle(res: any) {
        console.log(res, 'res');

        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上次失败');
        } else {
          const url = res.data.source;
          formData.value.file_path = [url];
          // formRef.value?.clearValidate('detail_file');
        }
      },
    };
    return {
      formData,
      formRef,
      onSaveBtnClick,
      show,
      assessmentOption,
      ...method,
    };
  },
  render() {
    const { formData } = this;

    return (
      <div class="performanceBonus-box">
        <el-form
          ref="formRef"
          size="mini"
          class="form-box"
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            label="选择考核："
            prop="assessment_management_id"
            rules={{
              required: true,
              message: '请选择考核',
              trigger: 'blur',
            }}
          >
            <Select
              options={this.assessmentOption}
              popper-class="el-select-popper-mini"
              v-model={formData.assessment_management_id}
            />
          </el-form-item>
        </el-form>
        <div class="btn-box">
          <tg-upload
            disabled={
              !formData.assessment_management_id || formData.file_path.length > 0 ? true : false
            }
            action="/api/resources/upload_file"
            data={{ type: 'visual_design', storage: 2 }}
            beforeUpload={this.beforeDataUpload}
            success={this.dataSuccessHandle}
            show-file-list={false}
          >
            <tg-button
              disabled={
                !formData.assessment_management_id || formData.file_path.length > 0 ? true : false
              }
              icon="ico-btn-upload"
              // type="primary"
            >
              批量上传
            </tg-button>
          </tg-upload>
          <tg-button
            type="link"
            download
            style="font-size:12px"
            href="https://tiange-oss.goumee.com/prod/excel_template/%E4%B8%8A%E4%BC%A0%E7%94%A8%E6%88%B7%E7%BB%A9%E6%95%88%E5%A5%96%E9%87%91%E6%A8%A1%E6%9D%BF.xlsx"
          >
            下载模版
          </tg-button>
        </div>
        <span class="subcontent" v-show={formData.file_path.length === 0}>
          仅支持xlsx, xls文件格式上传，文件大小不超过5MB
        </span>
        <upload-file-list style="padding-left: 81px;" v-model={formData.file_path} />
      </div>
    );
  },
});
