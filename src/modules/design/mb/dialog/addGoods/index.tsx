import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import inputLimit from '@/utils/inputLimit';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { Message } from 'element-ui';
import { useRequest } from '@gm/hooks/ahooks';
import { Save_Integral_Goods } from '@/services/integral';
import tipsImage from '@/assets/img/design/mb_upload_demo.jpg';
import { useDialog } from '@/use/dialog';
interface GoodsForm {
  name: string;
  images: string[];
  is_listed: number;
  id: string;
  comment: string;
  cost_m: number;
  stock_num: number | undefined;
}

const UploadDemo = defineComponent({
  render() {
    return <img src={tipsImage} style="width:100%" />;
  },
});

export default defineComponent({
  setup(props, ctx) {
    const elFormRef = ref<ElForm | undefined>(undefined);
    const formData = ref<GoodsForm>({
      images: [],
      is_listed: 1,
      stock_num: undefined,
    } as any);
    const reqSave = useRequest(Save_Integral_Goods, { manual: true });
    const dialogUploadDemo = useDialog({
      component: UploadDemo,
      footer: false,
      width: 750,
      title: '商品图上传规范',
    });
    const methods = {
      show(row: GoodsForm) {
        if (row !== undefined) {
          formData.value = JSON.parse(JSON.stringify(row));
        }
      },
      onSaveBtnClick() {
        elFormRef.value?.validate(success => {
          if (success) {
            reqSave.runAsync(formData.value).then(() => {
              Message.success('操作成功');
              ctx.emit('submit');
              ctx.emit('close');
            });
            // methods.evaluateAnchorRecruit();
          }
        });
      },
    };
    return {
      elFormRef,
      formData,
      dialogUploadDemo,
      ...methods,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="m-currency-edit-goods-dialog">
        <el-form
          ref="elFormRef"
          size="mini"
          label-width="100px"
          attrs={{ model: this.formData }}
          class="m-currency-edit-goods-dialog-content"
        >
          <el-form-item
            prop="name"
            label="商品名称："
            rules={{ required: true, message: '请输入商品名称', trigger: 'blur' }}
          >
            <el-input v-model={this.formData.name} maxlength={20} placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item
            prop="images"
            label="商品图片："
            rules={{ required: true, message: '请上传商品图片', trigger: 'change' }}
          >
            <div class="file-list">
              {formData.images.map((item: string, key: number) => {
                return (
                  <div class="file" key={key}>
                    <tg-image src={item} />
                    <tg-icon
                      name="ico-a-quseguanbiicon2x"
                      onClick={() => {
                        formData.images.splice(key, 1);
                      }}
                    />
                  </div>
                );
              })}
              {formData.images.length < 1 && (
                <fragments>
                  <tg-upload
                    action="/api/anchor/upload_anchor_file"
                    beforeUpload={FormValidation.ValidationFileUpload({
                      fileSize: 10,
                      image: true,
                    })}
                    success={(res: any) => {
                      if (res.success) formData.images.push(res.data.source);
                      else {
                        Message.error(res.message);
                      }
                    }}
                    show-file-list={false}
                  >
                    <div class="upload-btn">
                      <i class="el-icon-plus avatar-uploader-icon" />
                      <span>上传图片</span>
                    </div>
                  </tg-upload>
                  <span class="upload-tips" onClick={() => this.dialogUploadDemo.show()}>
                    <tg-icon name="ico-icon_explain" />
                    点击查看图片预览
                  </span>
                </fragments>
              )}
            </div>
          </el-form-item>
          <el-form-item
            prop="comment"
            label="商品说明："
            // rules={{ required: true, message: '请输入商品名称', trigger: 'blur' }}
          >
            <el-input
              type="textarea"
              v-model={this.formData.comment}
              maxlength={100}
              show-word-limit
              placeholder="请输入商品说明"
              rows={3}
            />
          </el-form-item>
          <el-form-item
            prop="stock_num"
            label="商品库存："
            rules={{ required: true, message: '请输入商品库存', trigger: 'blur' }}
          >
            <el-input
              v-model={this.formData.stock_num}
              maxlength={9}
              placeholder="请输入商品库存"
              on-input={(val: string) => {
                const newVal: any = inputLimit.Interger(val);
                this.formData.stock_num = newVal;
              }}
            />
          </el-form-item>
          <el-form-item
            prop="cost_m"
            label="兑换所需M币："
            rules={{ required: true, message: '请输入兑换所需M币', trigger: 'blur' }}
          >
            <el-input
              v-model={this.formData.cost_m}
              maxlength={9}
              placeholder="请输入兑换所需M币"
              on-input={(val: string) => {
                const newVal: any = inputLimit.Interger(val);
                this.formData.cost_m = newVal;
              }}
            />
          </el-form-item>
          <el-form-item
            class="text-item"
            prop="is_listed"
            label="上架状态："
            // rules={{ required: true, message: '请输入商品名称', trigger: 'blur' }}
          >
            <el-radio v-model={this.formData.is_listed} label={1}>
              上架
            </el-radio>
            <el-radio v-model={this.formData.is_listed} label={0}>
              下架
            </el-radio>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
