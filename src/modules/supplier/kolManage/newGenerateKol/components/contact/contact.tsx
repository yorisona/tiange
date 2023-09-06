import { defineComponent, ref, onMounted, watch, inject } from '@vue/composition-api';
import { useList } from '@/modules/supplier/kolManage/use/list';
import { ElForm } from 'element-ui/types/form';
export default defineComponent({
  setup(prop, ctx) {
    const { city, flatCity, fetchCityData } = useList(ctx);
    const contractForm = ref({
      contacts: '',
      contact_wechat: '',
      contact_phone: '',
      contact_qq: '',
      area: [],
      address: '',
    });
    const validateContact = (rule: any, value: any, callback: any) => {
      if (
        contractForm.value.contact_wechat ||
        contractForm.value.contact_phone ||
        contractForm.value.contact_qq
      ) {
        return callback();
      } else {
        return callback(new Error('电话、微信、QQ至少填一个'));
      }
    };
    const contractRules = ref({
      contact_wechat: [
        {
          validator: validateContact,
          message: '电话、微信、QQ至少填一个',
          maxlength: 30,
          trigger: 'blur',
        },
      ],
      contact_phone: [
        {
          validator: validateContact,
          message: '电话、微信、QQ至少填一个',
          maxlength: 30,
          trigger: 'blur',
        },
      ],
      contact_qq: [
        {
          validator: validateContact,
          message: '电话、微信、QQ至少填一个',
          maxlength: 30,
          trigger: 'blur',
        },
      ],
      contacts: [{ required: true, message: '请输入联系人', maxlength: 30, trigger: 'blur' }],
    });
    const validate = async () => {
      try {
        const result = await (ctx.refs.contactRef as ElForm).validate();
        if (result) {
          const { area, contacts, contact_wechat, contact_phone, contact_qq, address } =
            contractForm.value;
          return Promise.resolve({
            contacts,
            contact_wechat,
            contact_phone,
            contact_qq,
            address,
            province: area[0],
            city: area[1],
            county: area[2],
          });
        } else {
          return Promise.reject();
        }
      } catch (error) {
        ctx.root.$message.warning('请完善表单信息');
        return Promise.reject();
      }
    };
    const editData: any = inject('editData');
    watch(
      () => editData,
      (val: any) => {
        const {
          contacts,
          contact_wechat,
          contact_phone,
          contact_qq,
          address,
          province,
          city,
          county,
        } = val.value.kol_info;
        const area: any = [province, city, county];
        contractForm.value = {
          contacts,
          contact_wechat,
          contact_phone,
          contact_qq,
          address,
          area,
        };
      },
      {
        deep: true,
      },
    );
    onMounted(() => {
      fetchCityData();
    });
    return {
      contractForm,
      contractRules,
      city,
      flatCity,
      validate,
    };
  },
  render() {
    return (
      <div class="base-info" style="padding-top: 8px">
        <el-form
          attrs={{ model: this.contractForm }}
          rules={this.contractRules}
          ref="contactRef"
          label-position="top"
          size="mini"
          label-width="106px"
        >
          <div class="form-container" style="row-gap: 0px">
            <div class="base-item-title" style="margin: 0 0 12px 0">
              <span class="star">* </span>
              <span class="title">联系方式</span>
            </div>
            <div class="flex-line-box">
              <div class="flex-line-item">
                <el-form-item label="联系人：" prop="contacts">
                  <el-input
                    placeholder="请输入联系人"
                    v-model={this.contractForm.contacts}
                    maxlength={20}
                    show-word-limit={true}
                  />
                </el-form-item>
              </div>
              <div class="flex-line-item">
                <el-form-item label="联系电话：" prop="contact_phone">
                  <el-input
                    placeholder="请输入联系电话"
                    v-model={this.contractForm.contact_phone}
                    onInput={(value: string) => {
                      this.contractForm.contact_phone = value.replace(/[^\d]/g, '');
                    }}
                    maxlength={20}
                    show-word-limit={true}
                  />
                </el-form-item>
              </div>
              <div class="flex-line-item">
                <el-form-item label="微信号：" prop="contact_wechat">
                  <el-input
                    placeholder="请输入微信号"
                    v-model={this.contractForm.contact_wechat}
                    maxlength={20}
                    show-word-limit={true}
                  />
                </el-form-item>
              </div>
              <div class="flex-line-item">
                <el-form-item label="QQ号：" prop="contact_qq">
                  <el-input
                    placeholder="请输入QQ号"
                    v-model={this.contractForm.contact_qq}
                    onInput={(value: string) => {
                      this.contractForm.contact_qq = value.replace(/[^\d]/g, '');
                    }}
                    maxlength={20}
                    show-word-limit={true}
                  />
                </el-form-item>
              </div>
            </div>
            <div class="flex-line-box">
              <div class="double">
                <el-form-item label="寄样地址：">
                  <el-cascader
                    popper-class="el-select-popper-mini"
                    ref="cascader"
                    options={this.city}
                    v-model={this.contractForm.area}
                    style="width: 100%"
                    attrs={{
                      props: { value: 'name', label: 'name', checkStrictly: true },
                    }}
                    placeholder="请选择省/市/区"
                  />
                </el-form-item>
              </div>
              <div class="double">
                <el-form-item label="详细地址：">
                  <el-input
                    placeholder="请填写详细地址"
                    v-model={this.contractForm.address}
                    maxlength={50}
                    show-word-limit={true}
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    );
  },
});
