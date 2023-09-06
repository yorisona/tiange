import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { GetCompanyList, ShopLiveSaveWithdraw } from '@/services/company';
import moment from 'moment';
export default defineComponent({
  setup(props, ctx) {
    const form = ref<{
      company_id: number;
      arrival_date: string;
      withdraw_amount: string;
      certificate_pic: string[];
    }>({
      certificate_pic: [],
    } as any);
    const formRef = ref<ElForm | null>(null);
    const companyList = ref<{ company_name: string; id: number }[]>([]);

    const dialogSubmit = () => {
      formRef.value?.validate(async valid => {
        if (!valid) return valid;
        await ShopLiveSaveWithdraw({
          company_id: form.value.company_id,
          arrival_date: moment(form.value.arrival_date).format('YYYY-MM-DD'),
          withdraw_amount: form.value.withdraw_amount,
          certificate_pic: form.value.certificate_pic[0],
        });
        ctx.emit('close');
        ctx.emit('submit');
      });
    };
    const show = () => {
      form.value = {
        certificate_pic: [],
      } as any;
    };
    const successHandle = (res: { data: { source: string } }) => {
      form.value.certificate_pic = [res.data.source];
    };
    const remoteMethod = async (company_name: string) => {
      const res = await GetCompanyList({
        company_name,
        num: 10,
      });
      companyList.value = res.data.data.data;
    };
    return {
      form,
      show,
      dialogSubmit,
      formRef,
      successHandle,
      remoteMethod,
      companyList,
    };
  },
  render() {
    const form = this.form;
    return (
      <div class="dialog-content">
        <el-form
          ref="formRef"
          attrs={{
            model: form,
          }}
          label-width="42px"
          size="mini"
          label-position="top"
          hide-required-asterisk={true}
        >
          <el-form-item
            label="提现公司"
            prop="company_id"
            rules={{ required: true, message: '请选择公司', trigger: ['blur'] }}
          >
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择公司"
              v-model={form.company_id}
              remote
              filterable
              remote-method={this.remoteMethod}
              style="width: 100%"
            >
              {this.companyList.map((item, key) => {
                return <el-option key={key} label={item.company_name} value={item.id} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item
            label="到账时间"
            prop="arrival_date"
            rules={{ required: true, message: '请选择时间', trigger: ['blur'] }}
          >
            <el-date-picker
              placeholder="选择时间"
              v-model={form.arrival_date}
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="提现金额"
            prop="withdraw_amount"
            rules={{ required: true, message: '请提现金额', trigger: ['blur'] }}
          >
            <el-input
              placeholder="请输入提现金额"
              v-model={form.withdraw_amount}
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="请上传附件"
            class="upload-box"
            prop="certificate_pic"
            rules={{ required: true, message: '请上传附件', trigger: ['blur'] }}
          >
            <div class="upload-form">
              <tg-upload
                prop="company_id"
                v-model={form.company_id}
                action="/api/shop_live/upload_photo"
                show-file-list={false}
                success={this.successHandle}
              >
                <tg-button icon="ico-upload-lite">上传文件</tg-button>
              </tg-upload>
              <span class="file-tips">支持扩展名：.jpg .jpeg .png</span>
            </div>
            <upload-file-list v-model={form.certificate_pic} />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
