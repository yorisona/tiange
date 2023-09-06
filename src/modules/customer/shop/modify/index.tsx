import {
  defineComponent,
  inject,
  onBeforeMount,
  PropType,
  ref,
  watch,
  computed,
} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { areaType } from '@/const/kolConst';
import { shopTypeRadio, companyTypeRadio } from '@/utils/format';
import { BusinessTypeEnum, BusinessTypeOptions } from '@/types/tiange/common';
import { GetCompanyId } from '@/services/company';
import { CreateCustomer, EditCustomer, GetBrandList } from '@/services/customers';
import AddBrand from '@/modules/customer/brand/form/brand.vue';

export default defineComponent({
  name: 'CustomerModifyShop',
  components: {
    AddBrand,
  },
  props: {
    close: {
      type: Function as PropType<any>,
      default: Function,
    },
    data: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const addShopFormVisible: any = inject('addShopFormVisible');
    const shopForm = ref<any>({
      shop_name: '',
      category: '',
      shop_type: '',
      brand_id: '',
      company_type: '',
      companies: [],
      business_type: [],
      xd_shop_id: '',
    });
    const formVisible = ref(false);
    const shopId = ref('');
    const resetForm = () => {
      shopId.value = '';
      shopForm.value = {
        shop_name: '',
        category: '',
        shop_type: '',
        brand_id: '',
        company_type: '',
        companies: [],
        business_type: [],
        xd_shop_id: '',
      };
      selectedCompanies.value = [{ company_id: '', company_name: '', settlement_type: 1 }];
      selectedCompanyIds.value = [''];
    };

    const closeForm = () => {
      props.close();
      addShopFormVisible.value = false;
      shopId.value = '';
      resetForm();
      (ctx.refs.formRef as ElForm).resetFields();
    };

    const companySelectOptions = ref<any>([]);
    const selectedCompanies = ref<any>([{ company_id: '', company_name: '', settlement_type: 1 }]);
    const selectedCompanyIds = ref<any>(['']);
    const getCompanyList = async (company_name: any) => {
      if (company_name === '') {
        companySelectOptions.value = [];
        return;
      }
      const response = await GetCompanyId(company_name);
      const companyList: any[] = [];
      if (response.data.success) {
        response.data.data.map(company => {
          companyList.push({
            company_name: company.company_name,
            company_id: company.id,
            settlement_type: company.settlement_type,
          });
        });
      }
      companySelectOptions.value = companyList;
    };
    const settlementType = computed(
      () => !!selectedCompanies.value.find((item: any) => item.settlement_type === 2),
    );
    const shopIdRequired = computed(() => settlementType.value && shopForm.value.shop_type === 3); // 如果结算方式为线下结算且店铺类型为抖音店，店铺ID必填
    const formRules = ref({
      shop_name: [{ required: true, message: '请输入店铺名称', maxlength: 20, trigger: 'blur' }],
      category: [{ required: true, message: '请选择类目', trigger: 'change' }],
      shop_type: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
      brand_id: [{ required: true, message: '请选择店铺品牌', trigger: 'change' }],
      company_type: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
      companies: [{ required: true, message: '请选择关联公司', trigger: 'blur' }],
      // business_type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    });
    const addCompany = () => {
      selectedCompanies.value.push({ company_id: '', company_name: '', settlement_type: 1 });
      selectedCompanyIds.value.push('');
    };
    const selectCompany = (key: number) => {
      selectedCompanies.value[key].company_id = selectedCompanyIds.value[key];
      selectedCompanies.value[key].settlement_type = companySelectOptions.value.find(
        (com: any) => com.company_id === selectedCompanyIds.value[key],
      )?.settlement_type;
      selectedCompanies.value[key].company_name = companySelectOptions.value.find(
        (com: any) => com.company_id === selectedCompanyIds.value[key],
      )?.company_name;
    };
    const brandList = ref<any>([]);
    const getBrandList = async () => {
      const res = await GetBrandList({});
      if (res.data.success) {
        brandList.value = res.data.data;
      }
    };

    watch(
      () => props.data,
      val => {
        if (val) {
          const {
            shop_id,
            shop_name,
            category,
            shop_type,
            brand_id,
            company_type,
            companies,
            xd_shop_id,
            // business_type,
          } = val;
          shopForm.value = {
            shop_name,
            category,
            shop_type,
            brand_id,
            xd_shop_id,
            shop_id,
            company_type: company_type || null,
            // business_type: business_type.filter((item: any) => item !== BusinessTypeEnum.mcn),
          };
          const companyList = companies.map((item: any) => {
            return {
              company_id: item.company_id,
              company_name: item.company_name,
              settlement_type: item.settlement_type,
            };
          });

          shopId.value = shop_id;
          companySelectOptions.value = companyList;
          selectedCompanies.value = companyList;
          selectedCompanyIds.value = companyList.map((item: any) => item.company_id);
        } else {
          resetForm();
        }
      },
      {
        deep: true,
      },
    );
    const submitForm = async () => {
      try {
        const result = await (ctx.refs.formRef as ElForm).validate();
        // const companies = selectedCompanyIds.value.filter((item: any) => typeof item === 'number');
        // if (companies.length < 1) {
        //   ctx.root.$message.warning('关联公司至少选一个');
        //   return Promise.reject();
        // }
        if (result) {
          const obj: any = shopId.value
            ? Object.assign({}, shopForm.value, {
                shop_id: shopId.value,
                // company_ids: companies,
              })
            : Object.assign({}, shopForm.value, {
                // company_ids: companies,
              });
          const res = shopId.value ? await EditCustomer(obj) : await CreateCustomer(obj);
          if (res.data.success) {
            ctx.emit('saveSuccess', true);
            addShopFormVisible.value = false;
            return Promise.resolve(obj);
          } else {
            ctx.root.$message.error(res.data.message);
            return Promise.reject();
          }
        } else {
          return Promise.reject();
        }
      } catch (error) {
        console.log(error);
        ctx.root.$message.warning('请完善表单信息');
        return Promise.reject();
      }
    };
    const deleteCompany = (key: number) => {
      selectedCompanies.value.splice(key, 1);
      selectedCompanyIds.value.splice(key, 1);
    };
    const businessTypeOptions = ref<any>([]);
    onBeforeMount(() => {
      getBrandList();
      businessTypeOptions.value = BusinessTypeOptions.filter(
        el => el.value !== BusinessTypeEnum.mcn,
      );
    });
    const AddBrandVisible = ref(false);
    return {
      props,
      shopForm,
      AddBrandVisible,
      formRules,
      closeForm,
      getBrandList,
      formVisible,
      areaType,
      shopTypeRadio,
      brandList,
      companyTypeRadio,
      getCompanyList,
      companySelectOptions,
      addCompany,
      selectedCompanies,
      selectCompany,
      submitForm,
      addShopFormVisible,
      selectedCompanyIds,
      businessTypeOptions,
      deleteCompany,
      shopId,
      shopIdRequired,
    };
  },
  render() {
    return (
      <el-drawer
        class="tg-dialog-classic tg-dialog-cctv"
        height="100vh"
        size="600px"
        visible={this.addShopFormVisible}
        closeOnClickModal={false}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.closeForm}
        title={this.shopId ? '编辑店铺' : '新增店铺'}
      >
        <div class="add-customer-drawer-inner">
          <div class="drawer-form">
            <el-form
              attrs={{ model: this.shopForm }}
              rules={this.formRules}
              ref="formRef"
              size="mini"
              label-position="top"
            >
              <div class="form-container">
                <div class="flex-line-box-shop">
                  <div class="flex-line-item">
                    <el-form-item label="店铺名称" prop="shop_name">
                      <el-input
                        placeholder="请输入店铺名称"
                        v-model={this.shopForm.shop_name}
                        maxlength={20}
                        show-word-limit={true}
                      />
                    </el-form-item>
                  </div>
                  <div class="flex-line-item">
                    <el-form-item label="店铺类目" prop="category">
                      <el-select
                        popper-class="el-select-popper-mini"
                        v-model={this.shopForm.category}
                        placeholder="请选择业店铺类目"
                        style={{ width: '100%' }}
                      >
                        {this.areaType.map((item: any) => (
                          <el-option label={item.value} value={item.key} />
                        ))}
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-line-box-shop">
                  <div class="flex-line-item">
                    <el-form-item label="店铺类型" prop="shop_type">
                      <el-select
                        popper-class="el-select-popper-mini"
                        v-model={this.shopForm.shop_type}
                        placeholder="请选择店铺类型"
                        style={{ width: '100%' }}
                      >
                        {this.shopTypeRadio.map((item: any) => (
                          <el-option label={item.text} value={item.value} />
                        ))}
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="flex-line-item">
                    <div class="">
                      <el-form-item label="客户类型" prop="company_type">
                        <el-select
                          popper-class="el-select-popper-mini"
                          v-model={this.shopForm.company_type}
                          placeholder="请选择"
                          style={{ width: '100%' }}
                        >
                          {this.companyTypeRadio.map((item: any) => {
                            return <el-option label={item.text} value={item.value} />;
                          })}
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="flex-line-box-shop">
                  <el-form-item label="店铺品牌" prop="brand_id" class="single">
                    <el-select
                      popper-class="el-select-popper-mini"
                      v-model={this.shopForm.brand_id}
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      filterable
                    >
                      {this.brandList.map((item: any) => (
                        <el-option label={item.brand_name} value={item.id} />
                      ))}
                    </el-select>
                  </el-form-item>
                  <el-form-item label="">
                    <span style="position: relative;top: 26px">找不到品牌? 点击此处</span>
                    <a
                      onClick={() => (this.AddBrandVisible = true)}
                      style="position: relative;top: 26px;margin-left: 4px"
                      href="javascript: void(0)"
                    >
                      新增
                    </a>
                  </el-form-item>
                </div>
                {/*<label for="companies" class="form-title">*/}
                {/*  关联公司*/}
                {/*</label>*/}
                {/* <el-form-item
                  class="is-required"
                  label={'关联公司'}
                  style=" margin-right: 0 !important;"
                >
                  <div class="flex-line-box-wrap">
                    {this.selectedCompanies.map((company: any, key: number) => {
                      return (
                        <div class="flex-line-item">
                          <div class="company-selected-box" style={{ width: '100%' }}>
                            <el-select
                              popper-class="el-select-popper-mini"
                              v-model={this.selectedCompanyIds[key]}
                              placeholder="请输入公司并选择公司名称"
                              remote
                              filterable
                              style={{ width: '100%' }}
                              remoteMethod={this.getCompanyList}
                              onChange={() => this.selectCompany(key)}
                              loading={false}
                            >
                              {this.companySelectOptions.map((item: any) => (
                                <el-option
                                  key={item.company_id}
                                  label={item.company_name}
                                  value={item.company_id}
                                />
                              ))}
                            </el-select>
                            {this.selectedCompanies.length > 1 && (
                              <el-button
                                class="delete-company-btn"
                                type="danger"
                                icon="el-icon-close"
                                circle
                                onClick={() => {
                                  this.deleteCompany(key);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div class="flex-line-item">
                      <el-button
                        icon="el-icon-plus"
                        onClick={this.addCompany}
                        class="add-company-btn el-btn-mini"
                      >
                        添加公司
                      </el-button>
                    </div>
                  </div>
                </el-form-item> */}
                <div class="flex-line-box-wrap">
                  {/*<div class="single">
                    <el-form-item label="业务类型" prop="business_type">
                      <el-checkbox-group v-model={this.shopForm.business_type}>
                        {this.businessTypeOptions.map((item: any) => {
                          return (
                            <el-checkbox label={item.value} key={item.value} value={item.value}>
                              <p class="checkbox-p" style="font-weight: normal;">
                                {item.label}
                              </p>
                            </el-checkbox>
                          );
                        })}
                      </el-checkbox-group>
                    </el-form-item>
                  </div>*/}
                  <el-form-item
                    prop="xd_shop_id"
                    label="店铺ID"
                    rules={[
                      {
                        required: this.shopIdRequired,
                        message: '请输入并选择',
                        trigger: ['blur', 'change'],
                      },
                    ]}
                  >
                    <el-input
                      style="width: 263px"
                      placeholder="请输入店铺ID"
                      v-model={this.shopForm.xd_shop_id}
                      maxlength={20}
                      show-word-limit={true}
                    />
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <tg-button onClick={this.closeForm}>取消</tg-button>
            <tg-button type="primary" onClick={this.submitForm}>
              保存
            </tg-button>
          </div>
        </div>
        <add-brand
          visible={this.AddBrandVisible}
          on={{
            'dialog:close': (val: boolean) => {
              this.AddBrandVisible = false;
              val && this.getBrandList();
            },
          }}
        />
      </el-drawer>
    );
  },
});
