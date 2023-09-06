/*
 * @Author: 肖槿
 * @Date: 2021-11-10 16:52:19
 * @Description: 添加模特弹框
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-11-18 15:35:04
 * @FilePath: \goumee-star-frontend\src\modules\supplier\components\addModelDialog\index.tsx
 */
import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { Model } from '@/types/tiange/supplier';
import { PostSaveModel } from '@/services/supplier';
import { deepClone } from '@/utils/tools';
export default defineComponent({
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const title = ref('');
    const visible = ref(false);
    const loading = ref(false);
    const formData = ref<Model>({
      real_name: '',
      flower_name: '',
      flag: 0,
      images: [],
      wechat: '',
      mobile: '',
      id: undefined,
    });
    const resetForm = () => {
      formData.value = {
        real_name: '',
        flower_name: '',
        flag: 0,
        images: [],
        wechat: '',
        mobile: '',
        id: undefined,
      };
    };

    const onCloseBtnClick = () => {
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      visible.value = false;
    };

    const show = (_title: string, data: Model | undefined) => {
      title.value = _title;
      if (data) {
        formData.value = deepClone(data) as Model;
      }
      visible.value = true;
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 0);
    };

    /** 保存 */
    const onSaveBtnClick = () => {
      formRef.value?.validate(async valid => {
        if (valid) {
          const { flower_name, images, mobile, real_name, wechat, id } = formData.value;
          loading.value = true;
          await PostSaveModel({ flower_name, images, mobile, real_name, wechat, id });
          ctx.root.$message.success('保存成功');
          loading.value = false;
          ctx.emit('success');
          onCloseBtnClick();
        } else {
          return false;
        }
      });
    };
    return {
      show,
      title,
      visible,
      formData,
      onCloseBtnClick,
      loading,
      onSaveBtnClick,
      formRef,
    };
  },
  render() {
    return (
      <el-dialog
        class="tg-dialog-classic add-model-dialog"
        width="592px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <template slot="title">{this.title}</template>
        <div class="model-body">
          <el-form
            ref="formRef"
            inline
            size="mini"
            labelWidth="50px"
            attrs={{
              model: this.formData,
            }}
          >
            <el-form-item
              class="add-model-item"
              label="花名："
              prop="flower_name"
              rules={{ required: true, message: `请输入花名`, trigger: 'blur' }}
            >
              <el-input
                placeholder="请输入模特名称"
                maxlength={20}
                show-word-limit={true}
                v-model={this.formData.flower_name}
              />
            </el-form-item>
            <el-form-item
              class="add-model-item"
              label="真名："
              prop="real_name"
              rules={{ required: true, message: `请输入真名`, trigger: 'blur' }}
            >
              <el-input
                placeholder="请输入真名"
                maxlength={20}
                show-word-limit={true}
                v-model={this.formData.real_name}
              />
            </el-form-item>
            <el-form-item
              class="add-model-item"
              label="手机："
              prop="mobile"
              rules={{ message: `请输入手机`, trigger: 'blur' }}
            >
              <el-input
                placeholder="请输入手机"
                maxlength={11}
                onInput={(value: string) => (this.formData.mobile = value.replace(/[^\d]/g, ''))}
                show-word-limit={true}
                v-model={this.formData.mobile}
              />
            </el-form-item>
            <el-form-item
              class="add-model-item"
              label="微信："
              prop="wechat"
              rules={{ message: `请输入微信`, trigger: 'blur' }}
            >
              <el-input
                placeholder="请输入微信"
                maxlength={20}
                show-word-limit={true}
                v-model={this.formData.wechat}
              />
            </el-form-item>
            <span class="upload-tip">(1-8张照片，单张大小不超过 5MB)</span>
            <el-form-item
              class="add-model-item"
              label="照片："
              prop="images"
              rules={{ required: true, message: '请上传照片', trigger: 'blur' }}
            >
              <div class="picture-list">
                {this.formData.images.map((item, key) => {
                  return (
                    <div class="file-wrapper">
                      <div class="file" key={key}>
                        <tg-image src={item} />
                      </div>
                      <tg-icon
                        name="ico-a-quseguanbiicon2x"
                        onClick={() => {
                          this.formData.images.splice(key, 1);
                        }}
                      />
                    </div>
                  );
                })}
                {this.formData.images.length < 8 && (
                  <tg-upload
                    action="/api/medium/upload_file"
                    show-file-list={false}
                    beforeUpload={ValidationFileUpload({
                      fileSize: 5,
                      image: true,
                    })}
                    success={(res: { data: { source: string } }) => {
                      this.formData.images.push(res.data.source);
                    }}
                  >
                    <div class="upload-btn mgt-30">
                      <i class="el-icon-plus avatar-uploader-icon" />
                      <span>上传照片</span>
                    </div>
                  </tg-upload>
                )}
              </div>
            </el-form-item>
          </el-form>
        </div>
        <template slot="footer">
          <tg-button onClick={this.onCloseBtnClick}>取消</tg-button>
          <tg-button v-loading={this.loading} type="primary" onClick={this.onSaveBtnClick}>
            保存
          </tg-button>
        </template>
      </el-dialog>
    );
  },
});
