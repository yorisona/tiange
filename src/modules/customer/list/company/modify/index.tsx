import {
  defineComponent,
  onBeforeMount,
  ref,
  computed,
  nextTick,
  inject,
} from '@vue/composition-api';
import { RouterNameCustomer } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { areaType } from '@/const/kolConst';
import { deepClone } from '@/utils/tools';
import {
  GetBrandList,
  GetBankRegion,
  GetBankList,
  SaveCompany,
  SaveCompanyTempInfo,
} from '@/services/customers';
import { GetCompanyDetail } from '@/services/company';
import { sleep } from '@/utils/func';
import { AsyncConfirm } from '@/use/asyncConfirm';
import AddBrand from '@/modules/customer/brand/form/brand.vue';
import { AccountType } from '@/types/tiange/finance/finance';
import { ElForm } from 'element-ui/types/form';
import { BreadcrumbsRoutes } from '@/types/components/breadcrumbs';

const _areaType = deepClone(areaType);

const AccountTypeMap = new Map([
  [AccountType.bank, '银行账户'],
  [AccountType.zfb, '支付宝账户'],
]);

interface CompanyAccount {
  /** 银行账号/支付宝账号 */
  account_code?: string;
  account_type?: AccountType;
  bank_city?: string;
  // 联行号
  bank_code?: string;

  bank_id?: number;
  // 开户银行
  bank_name?: string;
  bank_province?: string;
  //  开户支行
  bank_sub_name?: string;
}

type IFormData = {
  id?: number;
  company_name: string;
  is_taxpayer: string | number;
  tax_id: string;
  cw_info_contact_phone: string;
  contact: string;
  email: string;
  wechat: string;
  contact_phone: string;
  address: string;
  introduce: string;
  reason: string;
  introduce_files: string[];
  settlement_type: number;
  invoice_files: string[];
  brands: number[];
  add_brands: (string | undefined)[];
  company_account: CompanyAccount[];
  department_id: number | undefined;
};

export default defineComponent({
  components: {
    AddBrand,
  },
  setup(props, ctx) {
    const initAccount = (type: AccountType | undefined = undefined): CompanyAccount => {
      return {
        account_code: undefined,
        account_type: type,
        bank_city: undefined,
        bank_code: undefined,
        bank_name: undefined,
        bank_province: undefined,
        bank_sub_name: undefined,
        bank_id: undefined,
      };
    };
    const router = useRouter();
    const loading = ref(false);
    const AddBrandVisible = ref(false);
    const hasEdit = router.currentRoute.params.id !== undefined;
    const formData = ref<IFormData>({
      company_name: '',
      is_taxpayer: '',
      tax_id: '',
      cw_info_contact_phone: '',
      contact: '',
      email: '',
      wechat: '',
      address: '',
      contact_phone: '',
      introduce: '',
      reason: '',
      introduce_files: [],
      settlement_type: 1,
      invoice_files: [],
      brands: [],
      add_brands: [],
      company_account: [initAccount(AccountType.bank)],
      department_id: undefined,
    });

    const formRef = ref<ElForm | undefined>(undefined);
    // const shopFirstInfo = ref<any>(null);
    const verify_status = ref(null);
    const isRequired = computed(() => formData.value.settlement_type === 1); // 结算方式为线上结算时所有信息必填，否则只有公司名称和店铺信息必填
    const getDetail = async () => {
      loading.value = true;
      const { data: response } = await GetCompanyDetail(ctx.root.$route.params.id);
      loading.value = false;
      if (response.success) {
        const data = response.data;
        formData.value.company_name = data.company_name;
        formData.value.is_taxpayer =
          data.is_taxpayer === 0 || data.is_taxpayer === 1 ? data.is_taxpayer : '';
        // formData.value.bank_account = data.bank_account;
        // formData.value.bank_region = [data.bank_province, data.bank_city];
        // formData.value.bank_sub_name = data.bank_sub_name;
        // formData.value.bank_name = data.bank_name;
        // formData.value.bank_code = data.bank_code;
        formData.value.tax_id = data.tax_id;
        formData.value.cw_info_contact_phone = data.cw_info_contact_phone;
        formData.value.contact = data.contact;
        formData.value.contact_phone = data.contact_phone;
        formData.value.wechat = data.wechat;
        formData.value.email = data.email;
        formData.value.address = data.address;
        formData.value.introduce = data.introduce;
        formData.value.reason = data.reason || '';
        formData.value.settlement_type = data.settlement_type;
        formData.value.introduce_files = data.introduce_files;
        formData.value.add_brands = data.add_brands || [];
        formData.value.brands = (data.brands || []).map((el: any) => el.id);
        formData.value.invoice_files = data.invoice_files;
        formData.value.company_account = data.company_account;
        formData.value.department_id = data.department_id;
        // formData.value.store = data.shops[0]
        //   ? data.shops[0] + `(${ShopTypeMap.get(data.shops_info[0]?.shop_type)})`
        //   : '';
        // shopFirstInfo.value = data.shops_info[0]?.shop_id;
        verify_status.value = data.verify_status;
        // editShopId.value = data.shops_info[0]?.xd_shop_id;

        if (data.bank_province && data.bank_city) {
          // getBankDetail(formData.value.bank_region);
        }
      } else {
        ctx.root.$router.push('/');
      }
    };

    onBeforeMount(() => {
      if (hasEdit) {
        getDetail();
      }
    });

    const brandList = ref<any>([]);
    const getBrandList = async () => {
      const res = await GetBrandList({});
      if (res.data.success) {
        brandList.value = res.data.data;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    getBrandList();
    const bankRegionList = ref<any>([]);
    const getBankRegion = async () => {
      const res = await GetBankRegion();
      if (res.data.success) {
        bankRegionList.value = res.data.data;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    getBankRegion();

    const bankList = ref<any>([]);
    const getBankDetail = async (value: string[]) => {
      const params = {
        province: value[0],
        city: value[1],
      };
      const res = await GetBankList(params);
      if (res.data.success) {
        bankList.value = res.data.data;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    const onAreaChanged = (account: CompanyAccount, value: string[]) => {
      account.bank_sub_name = '';
      account.bank_name = '';
      account.bank_id = undefined;
      account.bank_code = '';
      const [bank_province, bank_city] = value;
      account.bank_province = bank_province;
      account.bank_city = bank_city;
      getBankDetail(value);
    };
    const getBankName = (account: CompanyAccount, bankSubName: string) => {
      account.bank_id = undefined;
      account.bank_name = '';
      account.bank_code = '';
      bankList.value.map((bank: any) => {
        if (bankSubName === bank.bank_sub_name) {
          account.bank_id = bank.id;
          account.bank_name = bank.bank_name;
          account.bank_code = bank.bank_code;
        }
      });
    };

    const categoryList = ref<any>(_areaType);

    const onSaveInfo = async () => {
      const params: any = {
        company_id: router.currentRoute.params.id,
        company_name: formData.value.company_name,
        // bank_province: formData.value.bank_region[0],
        // bank_city: formData.value.bank_region[1],
        contact: formData.value.contact,
        contact_phone: formData.value.contact_phone,
        email: formData.value.email,
        wechat: formData.value.wechat,
        address: formData.value.address,
        introduce: formData.value.introduce,
        reason: formData.value.reason,
        introduce_files: formData.value.introduce_files,
        // bank_name: formData.value.bank_name,
        tax_id: formData.value.tax_id,
        cw_info_contact_phone: formData.value.cw_info_contact_phone,
        // bank_account: formData.value.bank_account,
        is_taxpayer: formData.value.is_taxpayer,
        settlement_type: formData.value.settlement_type,
        add_brands: formData.value.add_brands,
        brands: formData.value.brands,
        invoice_files: formData.value.invoice_files,
        company_account: formData.value.company_account,
        department_id: formData.value.department_id,
        // bank_sub_name: formData.value.bank_sub_name,
        // bank_code: formData.value.bank_code,
      };

      // if (formData.value.shopList.length > 0) {
      //   params.new_shops = [
      //     {
      //       shop_name: formData.value.addShopName,
      //       category: formData.value.addShopCategory,
      //       shop_type: formData.value.addShopType,
      //       brand_id: formData.value.addBrandId,
      //       company_type: formData.value.addCompanyType,
      //       // business_type: formData.value.addBusinessType,
      //     },
      //   ];
      // } else {
      //   params.shops = shopsIds;
      // }

      loading.value = true;
      const [{ data: response }] = await Promise.all([
        await SaveCompanyTempInfo(params),
        await sleep(500),
      ]);
      loading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message ?? '保存成功');
        router.push({ name: RouterNameCustomer.company });
      } else {
        const msg = response.message ?? '保存失败';
        ctx.root.$message.error(msg);
      }
    };
    const onSubmit = () => {
      formRef.value?.validate(async (pass: any) => {
        if (!pass) return;
        // const selectedShop = storeList.value.find(
        //   (item: any) => item.shop_id === formData.value.store,
        // );
        // if (
        //   formData.value.settlement_type === 2
        // formData.value.store &&
        // !selectedShop?.xd_shop_id &&
        // !editShopId.value
        // ) {
        //   ctx.root.$message.warning('关联店铺缺少店铺ID');
        //   return;
        // }
        // if (hasEdit && formData.value.settlement_type === 2) {
        //   ctx.root.$message.warning('关联店铺缺少店铺ID');
        //   return;
        // }
        if (formData.value.email === '' && formData.value.wechat === '' && isRequired.value) {
          ctx.root.$message.warning('微信号、邮箱2选1必填');
          return false;
        }

        // let shopsIds: any[] = [];
        if (!hasEdit) {
          // shopsIds = [formData.value.store];
        } else {
          // if (!isNaN(formData.value.store as any) && typeof formData.value.store === 'number') {
          //   shopsIds = [formData.value.store];
          // } else {
          //   shopsIds = [shopFirstInfo.value];
          // }
        }

        const params: any = {
          company_id: router.currentRoute.params.id,
          company_name: formData.value.company_name,
          // bank_province: formData.value.bank_region[0],
          // bank_city: formData.value.bank_region[1],
          contact: formData.value.contact,
          contact_phone: formData.value.contact_phone,
          email: formData.value.email,
          wechat: formData.value.wechat,
          address: formData.value.address,
          introduce: formData.value.introduce,
          reason: formData.value.reason,
          introduce_files: formData.value.introduce_files,
          // bank_name: formData.value.bank_name,
          tax_id: formData.value.tax_id,
          cw_info_contact_phone: formData.value.cw_info_contact_phone,
          // bank_account: formData.value.bank_account,
          is_taxpayer: formData.value.is_taxpayer,
          // bank_sub_name: formData.value.bank_sub_name,
          // bank_code: formData.value.bank_code,
          settlement_type: formData.value.settlement_type,
          add_brands: formData.value.add_brands,
          brands: formData.value.brands,
          invoice_files: formData.value.invoice_files,
          company_account: formData.value.company_account,
          department_id: formData.value.department_id,
        };
        // if (formData.value.shopList.length > 0) {
        //   params.new_shops = [
        //     {
        //       shop_name: formData.value.addShopName,
        //       category: formData.value.addShopCategory,
        //       shop_type: formData.value.addShopType,
        //       brand_id: formData.value.addBrandId,
        //       company_type: formData.value.addCompanyType,
        //       xd_shop_id: formData.value.xd_shop_id,
        //       // business_type: formData.value.addBusinessType,
        //     },
        //   ];
        // } else {
        //   params.shops = shopsIds;
        // }
        if (hasEdit && verify_status.value === 1) {
          const result = await AsyncConfirm(ctx, '该信息已审核通过，是否确认提交重新进行审核?');
          if (!result) {
            return false;
          }
        }
        loading.value = true;
        const [{ data: response }] = await Promise.all([
          await SaveCompany(params),
          await sleep(500),
        ]);
        loading.value = false;
        if (response.success) {
          ctx.root.$message.success('提交成功');
          router.push({ name: RouterNameCustomer.company });
        } else {
          const msg = response.message ?? '提交失败';
          ctx.root.$message.error(msg);
        }
      });
    };

    const onAddAccountHandler = () => {
      formData.value.company_account.push(initAccount());
    };

    const onDelAccountHandler = (index: number) => {
      formData.value.company_account.splice(index, 1);
    };
    const accountLabel = (type: AccountType) => {
      return type === AccountType.zfb ? '支付宝账号' : '银行账号';
    };
    const routes: BreadcrumbsRoutes[] = [
      // { title: '供应商管理' },
      { title: '公司管理', name: RouterNameCustomer.company },
      { title: hasEdit ? '修改公司' : '新增公司' },
    ];
    if (hasEdit) {
      if (ctx.root.$route.params && ctx.root.$route.params.isFromDetail === '1') {
        routes.splice(1, 0, {
          title: '公司详情',
          name: RouterNameCustomer.companyDetail,
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
      onSaveInfo,
      onSubmit,
      categoryList,
      AddBrandVisible,
      brandList,
      getBrandList,
      bankRegionList,
      onAreaChanged,
      bankList,
      getBankName,
      verify_status,
      isRequired,
      onAddAccountHandler,
      onDelAccountHandler,
      accountLabel,
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
              <div class="block-title star" style="margin-top: 0">
                公司名称
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
                  <el-form-item
                    style="position: relative"
                    label="结算方式"
                    prop="settlement_type"
                    rules={[{ required: true, trigger: 'blur' }]}
                  >
                    <el-radio-group v-model={this.formData.settlement_type}>
                      <el-radio label={1}>线上结算</el-radio>
                      <el-radio label={2}>线下结算</el-radio>
                    </el-radio-group>
                    <span style="position:absolute;top:3px;left:160px;color: var(--text-third-color);font-size: 12px">
                      (适用于S2B2C部分无需开票客户)
                    </span>
                  </el-form-item>
                </div>
              </div>
              <div
                class={this.isRequired ? 'block-title star' : 'block-title'}
                style="margin-top:2px"
              >
                财务信息
              </div>
              <div class="flex-line-box">
                <div class="flex-line-item">
                  <el-form-item
                    label="一般纳税人"
                    prop="is_taxpayer"
                    rules={[
                      {
                        required: this.isRequired,
                        message: '请选择一般纳税人',
                        trigger: ['blur', 'change'],
                      },
                    ]}
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
                <div class="flex-line-item">
                  <el-form-item
                    label="纳税人识别号"
                    prop="tax_id"
                    rules={[
                      {
                        required: this.isRequired,
                        message: '请输入纳税人识别号',
                        trigger: 'blur',
                      },
                    ]}
                  >
                    <el-input
                      vModel_trim={this.formData.tax_id}
                      maxlength={20}
                      placeholder="请输入纳税人识别号"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="公司电话"
                    prop="cw_info_contact_phone"
                    rules={[
                      {
                        required: this.isRequired,
                        message: '请输入公司电话',
                        trigger: 'blur',
                      },
                    ]}
                  >
                    <el-input
                      vModel_trim={this.formData.cw_info_contact_phone}
                      maxlength={15}
                      placeholder="请输入公司电话"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              {this.formData.company_account.map((account_info, account_idx) => {
                return (
                  <div class="account-container" key={account_idx}>
                    <div class="flex-line-box">
                      <div class="flex-line-item">
                        <el-form-item
                          label="新增对公账户类型"
                          prop={'company_account.' + account_idx + '.account_type'}
                          rules={[
                            {
                              required: this.isRequired,
                              message: '请选择对公账户类型',
                              trigger: 'change',
                            },
                          ]}
                        >
                          <el-select
                            v-model={account_info.account_type}
                            style="width: 100%"
                            placeholder="请选择对公账户类型"
                          >
                            {[...AccountTypeMap.entries()].map(([type, key]) => (
                              <el-option label={key} value={type} key={type}></el-option>
                            ))}
                          </el-select>
                        </el-form-item>
                      </div>
                      {account_info.account_type !== undefined && (
                        <div class="flex-line-item">
                          <el-form-item
                            label={this.accountLabel(account_info.account_type)}
                            prop={'company_account.' + account_idx + '.account_code'}
                            rules={[
                              {
                                required: this.isRequired,
                                message: `请输入${this.accountLabel(account_info.account_type)}`,
                                trigger: 'blur',
                              },
                            ]}
                          >
                            <el-input
                              vModel_trim={account_info.account_code}
                              placeholder={`请输入${this.accountLabel(account_info.account_type)}`}
                              maxlength={30}
                            ></el-input>
                          </el-form-item>
                        </div>
                      )}
                      {account_info.account_type === AccountType.bank && (
                        <div class="flex-line-item">
                          <el-form-item
                            label="开户地区"
                            prop={'company_account.' + account_idx + '.bank_city'}
                            rules={[
                              {
                                required: this.isRequired,
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
                              value={[account_info.bank_province, account_info.bank_city]}
                              // v-model={this.formData.bank_region}
                              options={this.bankRegionList}
                              onchange={(val: string[]) => this.onAreaChanged(account_info, val)}
                            ></el-cascader>
                          </el-form-item>
                        </div>
                      )}
                    </div>
                    {account_info.account_type === AccountType.bank && (
                      <div class="flex-line-box">
                        <div class="flex-line-item">
                          <el-form-item
                            label="开户支行"
                            prop={'company_account.' + account_idx + '.bank_sub_name'}
                            rules={[
                              {
                                required: this.isRequired,
                                message: '请选择开户支行',
                                trigger: ['blur', 'change'],
                              },
                            ]}
                          >
                            <el-select
                              popper-class="el-select-popper-mini"
                              v-model={account_info.bank_sub_name}
                              placeholder="请选择开户支行"
                              style="width: 100%"
                              filterable
                              onchange={(val: string) => this.getBankName(account_info, val)}
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
                        <div class="flex-line-item">
                          <el-form-item
                            label="开户银行"
                            prop={'company_account.' + account_idx + '.bank_name'}
                            rules={[
                              {
                                required: this.isRequired,
                                message: '请输入开户银行',
                                trigger: ['blur', 'change'],
                              },
                            ]}
                          >
                            <el-input
                              vModel_trim={account_info.bank_name}
                              placeholder="请输入开户银行"
                              // maxlength={30}
                              // show-word-limit={true}
                              disabled={true}
                            ></el-input>
                          </el-form-item>
                        </div>
                        <div class="flex-line-item">
                          <el-form-item
                            label="联行号"
                            prop={'company_account.' + account_idx + '.bank_code'}
                          >
                            <el-input
                              disabled
                              vModel_trim={account_info.bank_code}
                              placeholder="请输入联行号"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>
                    )}
                    {this.formData.company_account.length > 1 && (
                      <el-button
                        class="delete-btn"
                        on-click={() => this.onDelAccountHandler(account_idx)}
                      >
                        <i class="el-icon-close"></i>
                      </el-button>
                    )}
                  </div>
                );
              })}
              {this.formData.company_account.length < 10 && (
                <tg-button
                  class="add-account-btn"
                  icon="ico-btn-add"
                  on-click={this.onAddAccountHandler}
                >
                  新增对公账户
                </tg-button>
              )}
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    label="公司地址"
                    prop="address"
                    rules={[{ required: this.isRequired, message: '请输入地址', trigger: 'blur' }]}
                  >
                    <el-input
                      placeholder="请保持与营业执照上地址一致"
                      vModel_trim={this.formData.address}
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="flex-line-box">
                <div style="min-width: 450px">
                  <el-form-item
                    label="开票信息"
                    prop="invoice_files"
                    rules={[
                      { required: this.isRequired, message: '请输入上传附件', trigger: 'change' },
                    ]}
                  >
                    <div class="resume">
                      {this.formData.invoice_files.length < 5 && (
                        <tg-upload
                          action="/api/medium/upload_file"
                          show-file-list={false}
                          beforeUpload={FormValidation.ValidationFileUpload({
                            fileSize: 5,
                            image: true,
                            pdf: true,
                          })}
                          success={(res: { data: { source: string } }) => {
                            this.formData.invoice_files.push(res.data.source);
                            nextTick(() => {
                              this.formRef?.clearValidate('invoice_files');
                            });
                          }}
                        >
                          <tg-button icon="ico-upload-lite">请上传附件</tg-button>
                        </tg-upload>
                      )}

                      <div class="tips">
                        (请上传客户开票信息资料，支持扩展名：.pdf .jpg .png .jpeg，单个文件不超过5M)
                      </div>
                    </div>
                    <upload-file-list v-model={this.formData.invoice_files} />
                  </el-form-item>
                </div>
              </div>
              <div class={this.isRequired ? 'block-title star' : 'block-title'}>
                联系人
                <span class="tips">（填写说明：微信号、邮箱2选1必填；邮箱用于接收电子发票）</span>
              </div>
              <div class="flex-line-box">
                <div class="flex-line-item">
                  <el-form-item
                    label="联系人"
                    prop="contact"
                    rules={[
                      { required: this.isRequired, message: '请输入联系人', trigger: 'blur' },
                    ]}
                  >
                    <el-input placeholder="请输入联系人" vModel_trim={this.formData.contact} />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="手机号"
                    prop="contact_phone"
                    rules={[
                      { required: this.isRequired, message: '请输入手机号', trigger: 'blur' },
                      {
                        validator: (rule: any, phone: any, callback: any) => {
                          const reg = /^1\d{10}$/;
                          if (phone !== '' && !reg.test(phone) && this.isRequired) {
                            callback(new Error('手机号码格式不正确'));
                          } else {
                            callback();
                          }
                        },
                        trigger: 'blur',
                      },
                    ]}
                  >
                    <el-input
                      placeholder="请输入手机号"
                      vModel_trim={this.formData.contact_phone}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item label="微信号" prop="wechat">
                    <el-input
                      maxlength={20}
                      show-word-limit={true}
                      placeholder="请输入微信号"
                      vModel_trim={this.formData.wechat}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item label="邮箱" prop="email">
                    <el-input placeholder="用于接收电子发票" vModel_trim={this.formData.email} />
                  </el-form-item>
                </div>
              </div>
              <div class={this.isRequired ? 'block-title star' : 'block-title'}>品牌信息</div>
              <div class="flex-line-box">
                <div class="single">
                  <el-form-item
                    label="关联品牌"
                    prop="brands"
                    rules={[
                      {
                        required: this.isRequired && this.formData.add_brands.length === 0,
                        message: '请输入并选择',
                        trigger: ['blur', 'change'],
                      },
                    ]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      v-model={this.formData.brands}
                      placeholder="请选择品牌"
                      style="width: 100%"
                      filterable
                      multiple
                      class="brand-select"
                    >
                      {this.brandList.map((item: any) => {
                        return <el-option key={item.id} label={item.brand_name} value={item.id} />;
                      })}
                    </el-select>
                  </el-form-item>
                </div>
                <div class="single">
                  <el-form-item>
                    <span style="position: relative;top: 28px;color:var(--text-third-color)">
                      找不到品牌? 点击此处
                    </span>
                    <a
                      style="position: relative;top: 28px;margin-left: 4px"
                      href="javascript: void(0)"
                      // onClick={() => (this.AddBrandVisible = true)}
                      on-click={() => {
                        if (this.formData.add_brands.length === 0) {
                          this.formData.add_brands.push(undefined);
                        }
                      }}
                    >
                      新增
                    </a>
                  </el-form-item>
                </div>
              </div>
              {(this.formData.add_brands?.length || 0) > 0 && (
                <div class="shop-list-box">
                  <div class="shop-list-item">
                    <div class="single" style="width: 199px">
                      <el-form-item
                        label="品牌名称"
                        prop={'add_brands.' + 0}
                        rules={[{ required: true, message: '请输入品牌名称', trigger: 'blur' }]}
                      >
                        <el-input
                          placeholder="请输入品牌名称"
                          vModel_trim={this.formData.add_brands[0]}
                        />
                      </el-form-item>
                    </div>
                  </div>
                  <el-button
                    class="delete-shop-btn"
                    type="danger"
                    icon="el-icon-close"
                    circle
                    onclick={() => (this.formData.add_brands = [])}
                  ></el-button>
                </div>
              )}
              {/* <div class="block-title star">店铺信息</div>
              <div class="flex-line-box">
                <div class="single">
                  <el-form-item
                    label="关联店铺"
                    prop="store"
                    rules={[
                      {
                        required: this.formData.shopList.length === 0,
                        message: '请输入并选择',
                        trigger: ['blur', 'change'],
                      },
                    ]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      disabled={this.formData.shopList.length >= 1}
                      style="width: 100%"
                      clearable={true}
                      filterable={true}
                      remote={true}
                      remote-method={this.getStoreList}
                      v-model={this.formData.store}
                      placeholder="请输入并选择关联店铺"
                    >
                      {this.storeList.map((item: any, key: number) => {
                        return <el-option key={key} label={item.shop_name} value={item?.shop_id} />;
                      })}
                    </el-select>
                  </el-form-item>
                </div>
                {this.addStoreList.map((items: any, key: number) => {
                  return (
                    <div class="single store-box" key={key}>
                      <el-form-item label=" ">
                        <el-select
                          popper-class="el-select-popper-mini"
                          class="store-select"
                          style="width: 100%"
                          clearable={true}
                          filterable={true}
                          remote={true}
                          remote-method={this.getStoreList}
                          v-model={items.store_id}
                          placeholder="请输入并选择关联店铺"
                        >
                          {this.storeList.map((item: any, key: number) => {
                            return <el-option key={key} label={item.shop_name} value={item.id} />;
                          })}
                        </el-select>
                      </el-form-item>
                      <el-button
                        class="delete-store-btn"
                        type="danger"
                        icon="el-icon-close"
                        circle
                        onclick={() => this.removeStoreItem(key)}
                      ></el-button>
                    </div>
                  );
                })}
                <div class="double">
                  <el-form-item label=" ">
                    <p style="line-height:28px">
                      <span style="color: var(--text-third-color)">找不到店铺？点击此处 </span>
                      <a onclick={this.addShop}>新增</a>
                    </p> */}
              {/*<tg-button-line>*/}
              {/*  <tg-button onclick={this.addStoreMore}>关联更多</tg-button>*/}
              {/*  <tg-button icon="ico-btn-add" onclick={this.addShop}>*/}
              {/*    新增店铺*/}
              {/*  </tg-button>*/}
              {/*</tg-button-line>*/}
              {/* </el-form-item>
                </div>
              </div> */}
              {/* {this.formData.shopList.length > 0 && (
                <div class="shop-list-box">
                  <div class="shop-list-item">
                    <div class="single" style="width: 199px">
                      <el-form-item
                        label="店铺名称"
                        prop="addShopName"
                        rules={[{ required: true, message: '请输入店铺名称', trigger: 'blur' }]}
                      >
                        <el-input
                          placeholder="请输入店铺名称"
                          vModel_trim={this.formData.addShopName}
                        />
                      </el-form-item>
                    </div>
                    <div class="single">
                      <el-form-item
                        label="店铺类型"
                        prop="addShopType"
                        rules={[
                          {
                            required: true,
                            message: '请选择店铺类型',
                            trigger: ['blur', 'change'],
                          },
                        ]}
                      >
                        <el-select
                          popper-class="el-select-popper-mini"
                          placeholder="请选择店铺类型"
                          style="width: 100%"
                          v-model={this.formData.addShopType}
                        >
                          <el-option label="淘宝店" value={1} />
                          <el-option label="天猫店" value={2} />
                          <el-option label="抖音店" value={3} />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="single" style="width: 199px">
                      <el-form-item
                        label="店铺ID"
                        prop="xd_shop_id"
                        rules={[
                          {
                            required: this.shopIdRequired,
                            message: '请输入店铺ID',
                            trigger: ['blur', 'change'],
                          },
                        ]}
                      >
                        <el-input
                          placeholder="请输入店铺ID"
                          vModel_trim={this.formData.xd_shop_id}
                        />
                      </el-form-item>
                    </div>
                    <div class="single">
                      <el-form-item
                        label="店铺类目"
                        prop="addShopCategory"
                        rules={[
                          {
                            required: true,
                            message: '请选择店铺类目',
                            trigger: ['blur', 'change'],
                          },
                        ]}
                      >
                        <el-select
                          popper-class="el-select-popper-mini"
                          v-model={this.formData.addShopCategory}
                          placeholder="请选择店铺类目"
                          style="width: 100%"
                        >
                          {this.categoryList.map((item: any) => {
                            return <el-option key={item.key} label={item.value} value={item.key} />;
                          })}
                        </el-select>
                      </el-form-item>
                    </div>

                    <div class="single">
                      <el-form-item
                        label="请输入客户类型"
                        prop="addCompanyType"
                        rules={[
                          {
                            required: true,
                            message: '请选择客户类型',
                            trigger: ['blur', 'change'],
                          },
                        ]}
                      >
                        <el-select
                          popper-class="el-select-popper-mini"
                          placeholder="请选择"
                          style="width: 100%"
                          v-model={this.formData.addCompanyType}
                        >
                          <el-option label="同行机构" value={1} />
                          <el-option label="广告公司" value={2} />
                          <el-option label="品牌TP" value={3} />
                          <el-option label="直客" value={4} />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="single">
                      <el-form-item
                        label="店铺品牌"
                        prop="addBrandId"
                        rules={[
                          { required: true, message: '请输入并选择', trigger: ['blur', 'change'] },
                        ]}
                      >
                        <el-select
                          popper-class="el-select-popper-mini"
                          v-model={this.formData.addBrandId}
                          placeholder="请输入店铺品牌"
                          style="width: 100%"
                          filterable
                          onblur={(e: any) => this.brandSelect(0, e)}
                        >
                          {this.brandList.map((item: any) => {
                            return (
                              <el-option key={item.id} label={item.brand_name} value={item.id} />
                            );
                          })}
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="single">
                      <el-form-item>
                        <span style="position: relative;top: 28px">找不到品牌? 点击此处</span>
                        <a
                          style="position: relative;top: 28px;margin-left: 4px"
                          href="javascript: void(0)"
                          onClick={() => (this.AddBrandVisible = true)}
                        >
                          新增
                        </a>
                      </el-form-item>
                    </div>
                  </div>
                  <el-button
                    class="delete-shop-btn"
                    type="danger"
                    icon="el-icon-close"
                    circle
                    onclick={() => this.removeShopItem(0)}
                  ></el-button>
                </div>
              )} */}
              <div class={this.isRequired ? 'block-title star' : 'block-title'}>公司介绍</div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="introduce"
                    rules={[
                      {
                        required: this.isRequired,
                        message: '请输入公司介绍',
                        trigger: ['blur', 'change'],
                      },
                      { min: 20, message: '公司介绍不少于20字', trigger: 'blur' },
                    ]}
                  >
                    <el-input
                      type="textarea"
                      rows={4}
                      maxlength="500"
                      show-word-limit
                      placeholder="请输入公司介绍或公司相关链接（不少于20字）"
                      vModel_trim={this.formData.introduce}
                    />
                  </el-form-item>
                </div>
              </div>

              <div class="flex-line-box mgt-12">
                <div style="min-width: 450px">
                  <el-form-item>
                    <div class="resume">
                      {this.formData.introduce_files.length < 5 && (
                        <tg-upload
                          action="/api/medium/upload_file"
                          show-file-list={false}
                          beforeUpload={FormValidation.ValidationFileUpload({
                            fileSize: 30,
                            image: true,
                            file: true,
                          })}
                          success={(res: { data: { source: string } }) => {
                            this.formData.introduce_files.push(res.data.source);
                          }}
                        >
                          <tg-button icon="ico-upload-lite">介绍资料</tg-button>
                        </tg-upload>
                      )}

                      <div class="tips">
                        (支持扩展名：.pdf .ppt .doc .jpg .png .jpeg，限传5份文件，单份不超过30M)
                      </div>
                    </div>
                    <upload-file-list v-model={this.formData.introduce_files} />
                  </el-form-item>
                </div>
              </div>
              <div class={this.isRequired ? 'block-title star' : 'block-title'}>新增原因</div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="reason"
                    rules={[
                      {
                        required: this.isRequired,
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
              <div class={this.isRequired ? 'block-title star' : 'block-title'}>业务关联部门</div>
              <div class="flex-line-box">
                <div class="double">
                  <el-form-item
                    prop="department_id"
                    rules={[
                      {
                        required: this.isRequired,
                        message: '请选择业务关联部门',
                        trigger: ['change'],
                      },
                    ]}
                  >
                    <department-select
                      levelHidden={(_: number, node: any) => {
                        return node?.name?.includes('停用');
                      }}
                      placeholder="请选择业务关联部门"
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
            <tg-button style="margin-right: 12px" size="small" onClick={this.onSaveInfo}>
              保存信息
            </tg-button>
          )}
          <tg-button type="primary" onClick={this.onSubmit}>
            提交审核
          </tg-button>
          {/* <div class="div-primary-btn" onClick={this.onSubmit}>
            提交审核
          </div> */}
        </div>
        <tg-mask-loading visible={this.loading} content="正在保存数据，请稍候..." />
        <add-brand
          visible={this.AddBrandVisible}
          on={{
            'dialog:close': (val: boolean) => {
              this.AddBrandVisible = false;
              val && this.getBrandList();
            },
          }}
        />
      </div>
    );
  },
});
