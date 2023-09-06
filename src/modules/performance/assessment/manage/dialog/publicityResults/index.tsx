import { ref, defineComponent, h } from '@vue/composition-api';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { PublicifyAssessmentResult } from '@/services/performance';

type Detail_file = {
  avatar: string;
  user_id: number;
  username: string;
};
interface IFormData {
  id: number;
  detail_file: Detail_file[];
}
export default defineComponent({
  name: 'publicityResults',
  setup(props, ctx) {
    const formData = ref<IFormData>({
      id: '',
      detail_file: [],
    } as any);

    const show = (value: IFormData) => {
      formData.value = value;
      console.log(formData.value);
    };

    const onSaveBtnClick = async () => {
      if (!formData.value.detail_file.every((item: any) => item.avatar))
        return ctx.root.$message.error('请完成所有图片上传');
      PublicifyAssessmentResult({
        user_avatar_datas: formData.value.detail_file,
        assessment_management_id: formData.value.id,
      }).then(res => {
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('submit');
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };
    /* upload */
    const method = {
      beforeDataUpload(config: any) {
        console.log(config, 'config');

        return ValidationFileUpload({ image: true, fileSize: 10 })(config);
      },
      dataSuccessHandle(res: any, item: any) {
        console.log(res, formData.value, item, 'res');

        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上传失败');
        } else {
          const url = res.data.source;
          // formData.value.detail_file = [url];
          item.avatar = url;
          formData.value = { ...formData.value };
          // formRef.value?.clearValidate('detail_file');
        }
      },
      batchUpload(res: any) {
        console.log(res, 'res');
        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上传失败');
        } else {
          // const url = res.data.source;
          // formRef.value?.clearValidate('detail_file');
        }
      },
    };
    return {
      formData,
      onSaveBtnClick,
      show,
      ...method,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="publicityResults-box">
        <div class="mgb-24">
          确认公示此次考核结果为S的考核数据吗？如确认公示，请上传以下人员的头像信息。
        </div>
        {/* <div class="btn-box">
          <tg-upload
            disabled={formData.detail_file.length === 0}
            action="/api/resources/upload_file"
            data={{ type: 'visual_design', storage: 2 }}
            beforeUpload={this.beforeDataUpload}
            success={this.batchUpload}
            show-file-list={false}
          >
            <tg-button
              disabled={formData.detail_file.length === 0}

              type="primary"
            >
              批量上传
            </tg-button>
          </tg-upload>
          <tg-button
            type="link"
            download
            href="https://tiange-oss.goumee.com/prod/excel_template/%E4%B8%8A%E4%BC%A0%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E6%A8%A1%E6%9D%BF.xlsx"
          >
            下载模版
          </tg-button>
        </div> */}
        <div class="content-box">
          {formData.detail_file.map((item: any) => {
            return (
              <div class="item">
                <tg-upload
                  action="/api/resources/upload_file"
                  data={{ type: 'visual_design', storage: 2 }}
                  beforeUpload={this.beforeDataUpload}
                  success={(res: any) => this.dataSuccessHandle(res, item)}
                  show-file-list={false}
                >
                  <div class="headPortrait">
                    {item.avatar ? (
                      <img src={item.avatar} class="headPortrait" alt="avatar" />
                    ) : (
                      <i class="el-icon-plus avatar-uploader-icon" />
                    )}
                  </div>
                </tg-upload>
                <span>{item.username}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
