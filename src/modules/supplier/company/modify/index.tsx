import { defineComponent, inject, onBeforeMount, ref } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { PostModifyCompany, SaveCompanyTempInfo } from '@/services/supplier';
import { categoryListNew, cooperationPlatformListNew } from '@/utils/format';
import { GetBankList, GetBankRegion } from '@/services/customers';
import { companyDetail } from '@/api/medium';
import { sleep } from '@/utils/func';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { BreadcrumbsRoutes } from '@/types/components/breadcrumbs';

interface IFormData {
  id?: number;
  company_name: string;
  platforms: number[];
  areas: string[];
  business_license: string[];
  account_permit: string[];
  special_ticket: string | number;
  contact_no2: string;
  email: string;
  wechat: string;
  phone: string;
  contact_person: string;
  company_profile: string;
  reason: string;
  profile: string[];
  gather_account_list: any[];
  is_taxpayer: boolean | undefined;
  department_id: number | undefined;
}

export default defineComponent({
  components: {},
  setup(props, ctx) {
    const router = useRouter();
    const hasEdit = router.currentRoute.params.id !== undefined;
    const verify_status = ref(null);
    const loading = ref(false);
    const formData = ref<IFormData>({
      company_name: '',
      platforms: [],
      areas: [],
      business_license: [],
      account_permit: [],
      special_ticket: '',
      gather_account_list: [
        {
          account_type: '',
          bank_card_number: '',
          bank_region: [],
          bank_sub_name: '',
          bank_name: '',
          bank_code: '',
          bank_id: 0,
          alipay_account: '',
          gather_account_id: 0,
          flag: 0,
        },
      ],
      contact_no2: '',
      email: '',
      wechat: '',
      phone: '',
      contact_person: '',
      company_profile: '',
      reason: '',
      profile: [],
      is_taxpayer: undefined,
      department_id: undefined,
    });

    const formRef = ref<{ validate: (value: any) => void } | undefined>(undefined);

    const platformList = ref<any>(cooperationPlatformListNew);
    const categoryArea = ref<any>(categoryListNew);
    const bankRegionList = ref<any>([]);
    const getBankRegion = async () => {
      const res = await GetBankRegion();
      if (res.data.success) {
        bankRegionList.value = res.data.data;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const bankList = ref<any>([]);
    const getBankDetail = async (value: string[]) => {
      const params = {
        province: value[0],
        city: value[1],
      };
      bankLoading.value = true;
      const res = await GetBankList(params);
      bankLoading.value = false;
      if (res.data.success) {
        bankList.value = res.data.data;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const bankLoading = ref(false);
    const getItemBanks = (item: any) => {
      if (item.bank_region && item.bank_region[0] && item.bank_region[1]) {
        getBankDetail([item.bank_region[0], item.bank_region[1]]);
      }
    };

    const getItemBankName = (bankSubName: string, index: number) => {
      formData.value.gather_account_list[index].bank_name = '';
      formData.value.gather_account_list[index].bank_code = '';
      bankList.value.map((bank: any) => {
        if (bankSubName === bank.bank_sub_name) {
          formData.value.gather_account_list[index].bank_name = bank.bank_name;
          formData.value.gather_account_list[index].bank_code = bank.bank_code;
          formData.value.gather_account_list[index].bank_id = bank.id;
        }
      });
    };

    const onItemAreaChanged = (value: string[], index: number) => {
      formData.value.gather_account_list[index].bank_sub_name = '';
      formData.value.gather_account_list[index].bank_name = '';
      formData.value.gather_account_list[index].bank_code = '';
      // getBankDetail(value);
    };

    const getCompanyDetail = async () => {
      const params = {
        companyId: router.currentRoute.params.id,
      };
      loading.value = true;
      const res = await companyDetail(params);
      loading.value = false;
      if (res.data.success) {
        const data = res.data.data;
        formData.value.company_name = data.name;
        formData.value.platforms = data.platforms;
        formData.value.areas = data.areas;
        formData.value.special_ticket = data.special_ticket;
        formData.value.gather_account_list = data.gather_account_list;
        formData.value.business_license = data.business_license;
        formData.value.account_permit = data.account_permit;
        formData.value.contact_person = data.contact_person;
        formData.value.wechat = data.wechat;
        formData.value.email = data.contact_email;
        formData.value.phone = data.contact_no;
        formData.value.contact_no2 = data.contact_no2;
        formData.value.company_profile = data.description;
        formData.value.reason = data.reason || '';
        formData.value.profile = data.description_file;
        formData.value.is_taxpayer = data.is_taxpayer;
        formData.value.department_id = data.department_id;
        verify_status.value = data.verify_status;

        // if (data.bank_province && data.bank_city) {
        //   getBankDetail(['', '']);
        // }
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    onBeforeMount(() => {
      getBankRegion();
      if (hasEdit) {
        getCompanyDetail();
      }
    });

    const deleteAccount = ref<any>([]);
    const onSaveInfo = async () => {
      const concatArr = [...formData.value.gather_account_list, ...deleteAccount.value];

      const params: any = {
        id: router.currentRoute.params.id,
        name: formData.value.company_name,
        areas: formData.value.areas.join(','),
        platforms: formData.value.platforms.join(','),
        special_ticket: formData.value.special_ticket,
        gather_account_list: concatArr,
        contact_no2: formData.value.contact_no2,
        contact_person: formData.value.contact_person,
        contact_no: formData.value.phone,
        wechat: formData.value.wechat,
        contact_email: formData.value.email,
        business_license: formData.value.business_license,
        account_permit: formData.value.account_permit,
        description: formData.value.company_profile,
        reason: formData.value.reason,
        description_file: formData.value.profile,
        is_taxpayer: formData.value.is_taxpayer,
        department_id: formData.value.department_id,
      };

      loading.value = true;
      const [{ data: response }] = await Promise.all([
        await SaveCompanyTempInfo(params),
        await sleep(500),
      ]);
      loading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message ?? '保存成功');
        router.push({ name: RouterNameSupplier.manage });
      } else {
        const msg = response.message ?? '保存失败';
        ctx.root.$message.error(msg);
      }
    };
    const onSubmit = () => {
      formRef.value?.validate(async (pass: any) => {
        if (!pass) return;
        if (formData.value.email === '' && formData.value.wechat === '') {
          ctx.root.$message.warning('微信号、邮箱2选1必填');
          return false;
        }
        const concatArr = [...formData.value.gather_account_list, ...deleteAccount.value];

        const params: any = {
          id: router.currentRoute.params.id,
          name: formData.value.company_name,
          areas: formData.value.areas.join(','),
          platforms: formData.value.platforms.join(','),
          special_ticket: formData.value.special_ticket,
          gather_account_list: concatArr,
          contact_no2: formData.value.contact_no2,
          contact_person: formData.value.contact_person,
          contact_no: formData.value.phone,
          wechat: formData.value.wechat,
          contact_email: formData.value.email,
          business_license: formData.value.business_license,
          account_permit: formData.value.account_permit,
          description: formData.value.company_profile,
          reason: formData.value.reason,
          description_file: formData.value.profile,
          is_taxpayer: formData.value.is_taxpayer,
          department_id: formData.value.department_id,
        };

        if (hasEdit && verify_status.value === 1) {
          const result = await AsyncConfirm(ctx, '该信息已审核通过，是否确认提交重新进行审核?');
          if (!result) {
            return false;
          }
        }
        loading.value = true;
        const [{ data: response }] = await Promise.all([
          await PostModifyCompany(params),
          await sleep(500),
        ]);
        loading.value = false;
        if (response.success) {
          ctx.root.$message.success('提交成功');
          router.push({ name: RouterNameSupplier.manage });
        } else {
          const msg = response.message ?? '提交失败';
          ctx.root.$message.error(msg);
        }
      });
    };
    const addAccount = () => {
      formData.value.gather_account_list.push({
        account_type: '',
        bank_card_number: '',
        bank_region: [],
        bank_sub_name: '',
        bank_name: '',
        bank_code: '',
        bank_id: 0,
        alipay_account: '',
        gather_account_id: 0,
        flag: 0,
      });
    };
    const removeAccount = (item: any, index: number) => {
      if (item.gather_account_id) {
        item.flag = 1;
        deleteAccount.value.push(item);
      }
      formData.value.gather_account_list.splice(index, 1);
    };
    const routes: BreadcrumbsRoutes[] = [
      { title: '公司管理', name: RouterNameSupplier.manage },
      { title: hasEdit ? '修改公司' : '新增公司' },
    ];
    if (hasEdit) {
      if (ctx.root.$route.params && ctx.root.$route.params.isFromDetail === '1') {
        routes.splice(1, 0, {
          title: '公司详情',
          name: RouterNameSupplier.company,
          params: router.currentRoute.params || {},
        });
      }
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    return {
      hasEdit,
      loading,
      formData,
      formRef,
      platformList,
      categoryArea,
      onSubmit,
      onSaveInfo,
      bankRegionList,
      // onAreaChanged,
      bankList,
      // getBankName,
      addAccount,
      removeAccount,
      onItemAreaChanged,
      getItemBankName,
      getItemBanks,
      bankLoading,
      verify_status,
    };
  },
  render() {
    return (
      <div class="company-modify-wrapper">
        <div class="page-content-container">
          <el-form
            ref="formRef"
            size="mini"
            labelPosition="top"
            attrs={{
              model: this.formData,
            }}
          >
            <div class="form-container">
              <div class="block-title star" style="margin-top: 0;margin-bottom:6px">
                公司基础信息
              </div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="company_name"
                    rules={[{ required: true, message: '请输入公司名称', trigger: 'blur' }]}
                  >
                    <el-input
                      placeholder="请输入公司名称"
                      vModel_trim={this.formData.company_name}
                      maxlength={30}
                      show-word-limit={true}
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="block-title star">擅长平台</div>
              <div class="flex-line-box">
                <el-form-item
                  prop="platforms"
                  rules={[
                    {
                      required: true,
                      message: '至少选一个擅长类目',
                      trigger: ['blur', 'change'],
                    },
                  ]}
                >
                  <el-checkbox-group
                    style="margin-top: 2px;margin-left: 2px"
                    v-model={this.formData.platforms}
                  >
                    {this.platformList.map((item: any) => {
                      return (
                        <el-checkbox label={item.type} key={item.type}>
                          <p class="checkbox-p">{item.value}</p>
                        </el-checkbox>
                      );
                    })}
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="block-title star">擅长领域</div>
              <div class="flex-line-box">
                <el-form-item
                  prop="areas"
                  rules={[
                    {
                      required: true,
                      message: '至少选一个擅长领域',
                      trigger: ['blur', 'change'],
                    },
                  ]}
                >
                  <el-checkbox-group
                    style="margin-top: 2px;margin-left: 2px"
                    v-model={this.formData.areas}
                  >
                    {this.categoryArea.map((item: any, key: number) => {
                      return (
                        <el-checkbox label={key + 1} key={key}>
                          <p class="checkbox-p">{item}</p>
                        </el-checkbox>
                      );
                    })}
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="block-title star">财务信息</div>

              <div class="flex-line-box" style="margin-bottom:8px">
                <div class="single">
                  <el-form-item
                    label="是否专票"
                    prop="special_ticket"
                    rules={[
                      { required: true, message: '请选择是否专票', trigger: ['blur', 'change'] },
                    ]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      placeholder="请选择是否专票"
                      style={{ width: '100%' }}
                      v-model={this.formData.special_ticket}
                    >
                      <el-option label="是" value={1} />
                      <el-option label="否" value={0} />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="single">
                  <el-form-item
                    label="财务电话"
                    prop="contact_no2"
                    rules={[
                      { required: true, message: '请输入财务电话', trigger: ['blur', 'change'] },
                    ]}
                  >
                    <el-input
                      v-model={this.formData.contact_no2}
                      placeholder="请输入财务电话"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="single">
                  <el-form-item
                    label="一般纳税人"
                    prop="is_taxpayer"
                    rules={[{ required: true, message: '请选择一般纳税人', trigger: ['change'] }]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      placeholder="请选择一般纳税人"
                      style={{ width: '100%' }}
                      v-model={this.formData.is_taxpayer}
                    >
                      <el-option label="是" value={1} />
                      <el-option label="否" value={0} />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="single">
                  <el-form-item label=" ">
                    <a href="http://www.800000361.com/gs/" target="_black">
                      http://www.800000361.com/gs/
                    </a>
                  </el-form-item>
                </div>
              </div>

              {this.formData.gather_account_list.map((item, index) => {
                return (
                  <div class="account-box" key={item.index}>
                    <div class="flex-line-box" style="margin-left:12px">
                      <div class="single">
                        <el-form-item
                          label="新增收款账户类型"
                          prop={`gather_account_list.${index}.account_type`}
                          rules={[
                            {
                              required: true,
                              message: '请选择收款账户类型',
                              trigger: ['blur', 'change'],
                            },
                          ]}
                        >
                          <el-select
                            popper-class="el-select-popper-mini"
                            placeholder="请选择收款账户类型"
                            style={{ width: '100%' }}
                            v-model={item.account_type}
                          >
                            <el-option label="银行账户" value={1} />
                            <el-option label="支付宝账户" value={2} />
                          </el-select>
                        </el-form-item>
                      </div>
                      {item.account_type === 1 && (
                        <div class="single">
                          <el-form-item
                            label="银行账号"
                            key={`gather_account_list.${index}.bank_card_number`}
                            prop={`gather_account_list.${index}.bank_card_number`}
                            rules={[{ required: true, message: '请输入银行账号', trigger: 'blur' }]}
                          >
                            <el-input
                              v-model={item.bank_card_number}
                              placeholder="请输入银行账号"
                              maxlength={30}
                            ></el-input>
                          </el-form-item>
                        </div>
                      )}

                      {item.account_type === 1 && (
                        <div class="single">
                          <el-form-item
                            label="开户地区"
                            key={`gather_account_list.${index}.bank_region`}
                            prop={`gather_account_list.${index}.bank_region`}
                            rules={[
                              {
                                required: true,
                                message: '请选择开户地区',
                                trigger: ['blur', 'change'],
                              },
                            ]}
                          >
                            <el-cascader
                              clearable=""
                              popper-class="company-cascader"
                              style="width: 100%"
                              placeholder="请选择开户地区"
                              v-model={item.bank_region}
                              options={this.bankRegionList}
                              onchange={() => this.onItemAreaChanged(item.bank_region, index)}
                            ></el-cascader>
                          </el-form-item>
                        </div>
                      )}

                      {item.account_type === 2 && (
                        <div class="single">
                          <el-form-item
                            key={`gather_account_list.${index}.alipay_account`}
                            prop={`gather_account_list.${index}.alipay_account`}
                            rules={[
                              {
                                required: true,
                                message: '请输入支付宝账号',
                                trigger: ['blur', 'change'],
                              },
                            ]}
                            label="支付宝账号"
                          >
                            <el-input
                              v-model={item.alipay_account}
                              placeholder="请输入支付宝账号"
                            ></el-input>
                          </el-form-item>
                        </div>
                      )}
                    </div>
                    {item.account_type === 1 && (
                      <div class="flex-line-box" style="margin-left:12px">
                        <div class="single">
                          <el-form-item
                            label="开户支行"
                            key={`gather_account_list.${index}.bank_sub_name`}
                            prop={`gather_account_list.${index}.bank_sub_name`}
                            rules={[
                              {
                                required: true,
                                message: '请选择开户支行',
                                trigger: ['blur', 'change'],
                              },
                            ]}
                          >
                            <el-select
                              popper-class="el-select-popper-mini"
                              v-model={item.bank_sub_name}
                              placeholder="请选择开户支行"
                              style="width: 100%"
                              filterable
                              loading={this.bankLoading}
                              onFocus={() => this.getItemBanks(item)}
                              onchange={() => this.getItemBankName(item.bank_sub_name, index)}
                            >
                              {this.bankList.map((item: any, key: number) => {
                                return (
                                  <el-option
                                    key={key}
                                    label={item.bank_sub_name}
                                    value={item.bank_sub_name}
                                  />
                                );
                              })}
                            </el-select>
                          </el-form-item>
                        </div>
                        <div class="single">
                          <el-form-item
                            label="开户银行"
                            key={`gather_account_list.${index}.bank_name`}
                            prop={`gather_account_list.${index}.bank_name`}
                            rules={[
                              {
                                required: true,
                                message: '请输入开户银行',
                                trigger: ['blur', 'change'],
                              },
                            ]}
                          >
                            <el-input
                              v-model={item.bank_name}
                              placeholder="请输入开户银行"
                              maxlength={30}
                              show-word-limit={true}
                            ></el-input>
                          </el-form-item>
                        </div>
                        <div class="single">
                          <el-form-item
                            label="联行号"
                            key={`gather_account_list.${index}.bank_code`}
                          >
                            <el-input
                              disabled
                              v-model={item.bank_code}
                              placeholder="请输入联行号"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    )}
                    {this.formData.gather_account_list.length > 1 && (
                      <el-button
                        class="delete-btn"
                        type="danger"
                        icon="el-icon-close"
                        onClick={() => this.removeAccount(item, index)}
                      ></el-button>
                    )}
                  </div>
                );
              })}
              <tg-button icon="ico-btn-add" onClick={this.addAccount} class="add-account-btn">
                新增收款账户
              </tg-button>

              <div class="block-title star">
                资质信息
                <span class="tips">（支持扩展名：.pdf .jpg .png .jpeg，单个文件不超过30M）</span>
              </div>
              <div class="form-block-container">
                <el-form-item
                  prop="business_license"
                  rules={[
                    { required: true, message: '请上传营业执照', trigger: ['blur', 'change'] },
                  ]}
                  style="margin-right:12px"
                >
                  <div style="padding-left: 2px">
                    <tg-upload
                      action="/api/medium/upload_file"
                      disabled={this.formData.business_license?.length >= 1}
                      show-file-list={false}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        image: true,
                        pdf: true,
                        fileSize: 30,
                      })}
                      success={(res: { data: { source: string } }) => {
                        if (this.formData.business_license === null) {
                          this.formData.business_license = [];
                        }
                        this.formData.business_license.push(res.data.source);
                      }}
                    >
                      <tg-button
                        disabled={this.formData.business_license?.length >= 1}
                        icon="ico-upload-lite"
                      >
                        营业执照
                      </tg-button>
                    </tg-upload>
                  </div>
                </el-form-item>
                <el-form-item prop="id_card_back">
                  <div>
                    <tg-upload
                      action="/api/medium/upload_file"
                      show-file-list={false}
                      disabled={this.formData.account_permit?.length >= 1}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        image: true,
                        pdf: true,
                        fileSize: 30,
                      })}
                      success={(res: { data: { source: string } }) => {
                        if (this.formData.account_permit === null) {
                          this.formData.account_permit = [];
                        }
                        this.formData.account_permit.push(res.data.source);
                      }}
                    >
                      <tg-button
                        disabled={this.formData.account_permit?.length >= 1}
                        icon="ico-upload-lite"
                      >
                        银行信息证明
                      </tg-button>
                    </tg-upload>
                  </div>
                </el-form-item>
              </div>
              <div class="business-license-box">
                {this.formData.business_license?.length > 0 && (
                  <p class="license-item">
                    <span class="title">营业执照：</span>
                    <upload-file-list v-model={this.formData.business_license} />
                  </p>
                )}
                {this.formData.account_permit?.length > 0 && (
                  <p class="license-item">
                    <span class="title">开户许可证：</span>
                    <upload-file-list v-model={this.formData.account_permit} />
                  </p>
                )}
              </div>
              <div class="block-title star">
                联系人及地址
                <span class="tips">（填写说明：微信号、邮箱2选1必填；邮箱用于接收电子发票）</span>
              </div>
              <div class="flex-line-box">
                <div class="flex-line-item">
                  <el-form-item
                    label="联系人"
                    prop="contact_person"
                    rules={[{ required: true, message: '请输入联系人', trigger: 'blur' }]}
                  >
                    <el-input placeholder="请输入联系人" v-model={this.formData.contact_person} />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="手机号"
                    prop="phone"
                    rules={[
                      { required: true, message: '请输入手机号', trigger: 'blur' },
                      {
                        validator: (rule: any, phone: any, callback: any) => {
                          const reg = /^1\d{10}$/;
                          if (phone !== '' && !reg.test(phone)) {
                            callback(new Error('手机号码格式不正确'));
                          } else {
                            callback();
                          }
                        },
                        trigger: 'blur',
                      },
                    ]}
                  >
                    <el-input placeholder="请输入手机号" v-model={this.formData.phone} />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item label="微信号" prop="wechat">
                    <el-input
                      maxlength={20}
                      show-word-limit={true}
                      placeholder="请输入微信号"
                      v-model={this.formData.wechat}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item label="邮箱" prop="email">
                    <el-input placeholder="请输入邮箱" v-model={this.formData.email} />
                  </el-form-item>
                </div>
              </div>
              <div class="block-title star" style="margin-bottom:6px">
                公司介绍
              </div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="company_profile"
                    rules={[
                      { required: true, message: '请输入公司介绍', trigger: ['blur', 'change'] },
                      { min: 20, message: '公司介绍不少于20字', trigger: 'blur' },
                    ]}
                  >
                    <el-input
                      type="textarea"
                      rows={4}
                      maxlength="500"
                      show-word-limit
                      placeholder="请输入公司介绍或公司相关链接（不少于20字）"
                      v-model={this.formData.company_profile}
                    />
                  </el-form-item>
                </div>
              </div>

              <div class="flex-line-box">
                <div style="min-width: 450px;margin-top:12px">
                  <el-form-item>
                    <div class="resume">
                      {this.formData.profile?.length < 5 && (
                        <tg-upload
                          action="/api/medium/upload_file"
                          show-file-list={false}
                          beforeUpload={FormValidation.ValidationFileUpload({
                            fileSize: 30,
                            image: true,
                            file: true,
                          })}
                          success={(res: { data: { source: string } }) => {
                            if (this.formData.profile === null) {
                              this.formData.profile = [];
                            }
                            this.formData.profile.push(res.data.source);
                          }}
                        >
                          <tg-button icon="ico-upload-lite">介绍资料</tg-button>
                        </tg-upload>
                      )}

                      <div class="tips">
                        (支持扩展名：.pdf .ppt .doc .jpg .png .jpeg，限传5份文件，单份不超过30M)
                      </div>
                    </div>
                    <upload-file-list v-model={this.formData.profile} />
                  </el-form-item>
                </div>
              </div>
              <div class="block-title star" style="margin-bottom:6px">
                新增原因
              </div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="reason"
                    rules={[
                      {
                        required: true,
                        message: '请输入新增公司原因',
                        trigger: ['blur', 'change'],
                      },
                    ]}
                  >
                    <el-input
                      type="textarea"
                      rows={2}
                      maxlength="100"
                      show-word-limit
                      placeholder="请输入新增公司原因（不超过100字）"
                      vModel_trim={this.formData.reason}
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="block-title star" style="margin-bottom:6px">
                费用承担部门
              </div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="department_id"
                    rules={[
                      {
                        required: true,
                        message: '请选择费用承担部门',
                        trigger: ['change'],
                      },
                    ]}
                  >
                    <department-select
                      levelHidden={(_: number, node: any) => {
                        return node?.name?.includes('停用');
                      }}
                      placeholder="请选择费用承担部门"
                      v-model={this.formData.department_id}
                    ></department-select>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div class="options">
          {this.verify_status !== 1 && (
            <tg-button style="margin-right: 12px" onClick={this.onSaveInfo}>
              保存信息
            </tg-button>
          )}
          <tg-button type="primary" onClick={this.onSubmit}>
            提交审核
          </tg-button>
        </div>
        <tg-mask-loading visible={this.loading} content="正在保存数据，请稍候..." />
      </div>
    );
  },
});
