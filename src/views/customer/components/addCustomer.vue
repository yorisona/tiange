<!--
 * @Description: file content
 * @Author: 白青
 * @Date: 2019-09-29 15:22:06
 * @LastEditTime: 2021-07-13 11:05:10
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div :class="id === 0 ? 'customer-header-create-wrapper' : ''">
    <div v-if="customerForm === null"></div>
    <el-drawer
      class="add-customer-drawer"
      :visible="visible"
      height="100vh"
      size="612px"
      :close-on-click-modal="false"
      @close="close"
      v-else
      :wrapperClosable="false"
    >
      <template #title v-if="id === 0">
        <div class="customer-header-create">
          <tg-tabs
            :tabs="[
              { label: '新增店铺', value: 'onebyone' },
              { label: '批量导入', value: 'import' },
            ]"
            style="background: #f4f8ff"
            v-model="dialogType"
            :inline="true"
            :height="48"
          />
        </div>
      </template>
      <template #title v-else>
        <div class="customer-header">
          <span :class="[{ active: dialogType === 'onebyone' }]" style="font-size: 16px"
            >编辑店铺</span
          >
        </div>
      </template>
      <div class="add-customer-drawer-inner">
        <!-- [新增(手动)] -->
        <div v-if="dialogType === 'onebyone'" class="drawer-form">
          <el-form
            class="customer-form"
            ref="customerForm"
            :model="customerForm"
            label-width="127px"
            label-position="top"
            :rules="customerRules"
            size="small"
          >
            <!-- [左侧区块] -->
            <div class="customer-form-left">
              <el-alert
                title="注意：提示已存在的店铺请不要重复录入，会导致后期数据统计不准确。业绩归属和谁录入的客户无关，录入的客户联系人仅您和上级可见。"
                type="warning"
                show-icon
                :closable="false"
                v-if="id === 0"
              >
              </el-alert>
              <el-row class="form-title"
                ><i class="form-title-mark"></i>
                <p class="form-title-p">店铺基础信息</p></el-row
              >
              <el-form-item label="店铺名称" prop="shopName" class="form-item form-item-left">
                <el-input
                  v-model="customerForm.shopName"
                  placeholder="请输入店铺名称"
                  maxlength="40"
                  style="width: 260px"
                  clearable
                  ref="autoFocuseRef"
                />
              </el-form-item>
              <el-form-item label="店铺类目" prop="category" class="form-item form-item-right">
                <el-select
                  v-model="customerForm.category"
                  placeholder="请选择"
                  style="width: 260px"
                >
                  <el-option
                    v-for="item in categoryList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="店铺类型" prop="shopType" class="form-item form-item-left">
                <el-select
                  v-model="customerForm.shopType"
                  placeholder="请选择"
                  style="width: 260px"
                >
                  <el-option
                    v-for="item in shopTypeRadio"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="店铺品牌" prop="brand_id" class="form-item form-item-right">
                <el-select
                  v-model="customerForm.brand_id"
                  filterable
                  placeholder="请选择"
                  style="width: 260px"
                >
                  <el-option
                    v-for="item in shopList"
                    :key="item.id"
                    :label="item.brand_name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="业务类型" prop="business_type" class="form-item-left">
                <el-checkbox-group v-model="customerForm.business_type">
                  <el-checkbox
                    :label="opt.value"
                    v-for="opt in BusinessTypeOptions"
                    :key="opt.value"
                    >{{ opt.label }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="公司名称" prop="company_id" class="form-item-left">
                <div v-for="(it, index) in list" :key="index" class="company-selected-box">
                  <el-select
                    v-model="oneId[index]"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="it.company_name ? it.company_name : '请输入公司并选择公司名称'"
                    :remote-method="companyRemoteMethod"
                    :loading="companyLoading"
                    style="width: 267px"
                    @change="onCompanySelect"
                  >
                    <el-option
                      v-for="item in companies"
                      :key="item.id"
                      :label="item.company_name"
                      :value="item.id"
                    />
                  </el-select>
                  <el-button
                    class="delete-company-btn"
                    @click="removeItem(it, index)"
                    type="danger"
                    icon="el-icon-close"
                    circle
                  ></el-button>
                </div>
                <el-button @click="addItem" icon="el-icon-plus" class="add-company-btn"
                  >添加公司</el-button
                >
              </el-form-item>

              <el-row class="form-title" v-if="id === 0"
                ><i class="form-title-mark"></i>
                <p class="form-title-p">客户联系人</p></el-row
              >
              <el-form-item
                label="客户姓名"
                prop="customerName"
                class="form-item form-item-left"
                v-if="id === 0"
              >
                <el-input
                  v-model="customerForm.customerName"
                  placeholder="请输入客户姓名"
                  maxlength="20"
                  style="width: 260px"
                />
              </el-form-item>
              <el-form-item
                label="联系方式"
                prop="wechat"
                style="margin-left: 18px"
                class="form-item"
                v-if="id === 0"
              >
                <el-input
                  v-model="customerForm.mobile"
                  placeholder="请输入手机号"
                  @input.native="inputMobile"
                  :maxlength="11"
                  style="width: 125px"
                />
                <el-input
                  class="mgl-10"
                  v-model="customerForm.wechat"
                  placeholder="请输入微信号"
                  :maxlength="20"
                  style="width: 125px"
                />
                <div class="small-tip">（至少填写一项）</div>
              </el-form-item>
              <el-row class="form-title"
                ><i class="form-title-mark"></i>
                <p class="form-title-p">客户基础信息</p></el-row
              >
              <el-form-item label="客户类型" prop="companyName" class="form-item-left">
                <el-radio-group v-model="customerForm.companyType">
                  <el-radio v-for="tag in companyTypeRadio" :label="tag.value" :key="tag.value">{{
                    tag.text
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="客户地址"
                prop=""
                class="form-item-left"
                style="margin-bottom: 6px"
              >
                <el-cascader
                  ref="cascader"
                  :options="city"
                  v-model="customerForm.cities"
                  :props="{ value: 'id', label: 'name' }"
                  style="width: 552px"
                />
              </el-form-item>
              <el-form-item label="" class="form-item-left">
                <el-input
                  type="textarea"
                  v-model="customerForm.addrDetail"
                  :rows="3"
                  placeholder="详细地址"
                  style="width: 552px"
                />
              </el-form-item>
              <el-row class="form-title"
                ><i class="form-title-mark"></i>
                <p class="form-title-p">财务信息</p></el-row
              >
              <el-form-item
                :label-width="rightBlockLabelWidth"
                label="公司开票抬头"
                class="form-item form-item-left"
              >
                <el-input v-model="customerForm.invoiceTitle" placeholder="请输入公司开票抬头" />
              </el-form-item>
              <el-form-item
                :label-width="rightBlockLabelWidth"
                label="地址"
                class="form-item form-item-right"
              >
                <el-input v-model="customerForm.invoiceAddr" placeholder="请输入地址" />
              </el-form-item>
              <el-form-item
                :label-width="rightBlockLabelWidth"
                label="纳税人识别号"
                prop="invoiceNumber"
                class="form-item form-item-left"
              >
                <el-input v-model="customerForm.invoiceNumber" placeholder="请输入纳税人识别号" />
              </el-form-item>
              <el-form-item
                :label-width="rightBlockLabelWidth"
                label="账号"
                prop="invoiceAccount"
                class="form-item form-item-right"
              >
                <el-input v-model="customerForm.invoiceAccount" placeholder="请输入账号" />
              </el-form-item>

              <el-form-item
                :label-width="rightBlockLabelWidth"
                label="开户行"
                class="form-item form-item-left"
              >
                <el-input v-model="customerForm.invoiceBank" placeholder="请输入开户行" />
              </el-form-item>
              <el-form-item
                :label-width="rightBlockLabelWidth"
                label="电话"
                prop="invoicePhone"
                class="form-item form-item-right"
              >
                <el-input v-model="customerForm.invoicePhone" placeholder="请输入电话" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- [批量导入] -->
        <star-import-file
          class="drawer-form"
          v-if="dialogType === 'import'"
          uploadText="客户"
          uploadKey="customer"
          downloadSrc="/template/customer_upload_template.xlsx"
        />

        <div class="el-drawer-footer" v-if="dialogType === 'onebyone'">
          <tg-button @click="close">取消</tg-button>
          <tg-button type="primary" @click="submitForm" :disabled="isAddingEditing">保存</tg-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { queryAllUserNames } from '@/api/customer';
import { areaType } from '@/const/kolConst';
import {
  categoryFormate,
  customerClassList,
  shopTypeRadio,
  companyTypeRadio,
} from '@/utils/format';
import { ROLE_CODE } from '@/const/roleCode';
import { deepClone } from '@/utils/tools';
import { GetCompanyId } from '@/services/company';
import { CreateCustomer, EditCustomer, GetBrandList } from '@/services/customers';
import { cityId2name, cityName2id, fetchCities, getFlatCities } from '@/utils/~city~';
import { parse } from '@/utils/func';
import { getChromeVersion } from '@/utils/browser';
import { BusinessTypeEnum, BusinessTypeOptions } from '@/types/tiange/common';
import { ref } from '@vue/composition-api';

const _areaType = deepClone(areaType);

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    // 客户信息
    customerFormEdit: {
      type: Object,
      default() {
        return {
          // 店铺名
          shopName: '',
          // 店铺类型
          shopType: '',
          // 客户类目
          category: '',
          // 店铺品牌
          brand_id: '',
          // 业务类型
          business_type: [],
          // 公司名称
          companyName: '',
          // 客户经理id列表
          manager_ids: [],
          manager_infos: [],
          // 客户类型
          companyType: '',
          // 客户姓名
          customerName: '',
          // 客户分类
          customerClass: '',
          // 手机号
          mobile: '',
          // 微信号
          wechat: '',
          // 客户意向
          intention: '',
          province: '',
          city: '',
          county: '',
          // 省市区列表
          cities: [],
          addrDetail: '',
          // ----------跟进人---------------
          // 客户经理
          manager: {},
          // 部门
          department: '',
          // ----------财务信息---------------
          // 公司开票抬头
          invoiceTitle: '',
          // 地址
          invoiceAddr: '',
          // 纳税人识别号
          invoiceNumber: '',
          // 账号
          invoiceAccount: '',
          // 开户行
          invoiceBank: '',
          // 电话号码
          invoicePhone: '',
          // 选择的AE
          coopAe: [],
          // 客户经理真名
          managerName: '',
          // 公司ID
          company_id: '',
        };
      },
    },
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  setup() {
    const autoFocuseRef = ref(undefined);
    return {
      autoFocuseRef,
    };
  },
  data() {
    // 微信号自定义验证规则
    const validateWechat = (rule, value, callback) => {
      const { wechat, mobile } = this.customerForm;
      if (wechat === '' && mobile === '') {
        this.goTop();
        callback(new Error('手机号和微信号至少填写一个'));
      } else if (mobile !== '' && !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };

    return {
      oneId: [],
      list: [{ oneId: '', company_id: '', company_name: '' }],
      customerForm: {
        // 店铺名
        shopName: '',
        // 店铺类型
        shopType: '',
        // 客户类目
        category: '',
        // 店铺品牌
        brand_id: '',
        // 业务类型
        business_type: [],
        // 公司名称
        companyName: '',
        // 客户经理id列表
        manager_ids: [],
        manager_infos: [],
        // 客户类型
        companyType: '',
        // 客户姓名
        customerName: '',
        // 客户分类
        customerClass: '',
        // 手机号
        mobile: '',
        // 微信号
        wechat: '',
        // 客户意向
        intention: '',
        province: '',
        city: '',
        county: '',
        // 省市区列表
        cities: [],
        addrDetail: '',
        // ----------跟进人---------------
        // 客户经理
        manager: {},
        // 部门
        department: '',
        // ----------财务信息---------------
        // 公司开票抬头
        invoiceTitle: '',
        // 地址
        invoiceAddr: '',
        // 纳税人识别号
        invoiceNumber: '',
        // 账号
        invoiceAccount: '',
        // 开户行
        invoiceBank: '',
        // 电话号码
        invoicePhone: '',
        // 选择的AE
        coopAe: [],
        // 客户经理真名
        managerName: '',
        // 公司ID
        company_id: '',
      },
      // 防止重复提交
      isAddingEditing: false,
      // ----------客户信息---------------
      shopTypeRadio,
      companyTypeRadio,
      // 客户类目列表
      categoryList: _areaType,
      // 客户类目格式化
      categoryFormate,
      // 客户分类
      customerClassList,
      // 部门
      departmentList: [],
      // 客户经理列表
      managerList: [],
      shopList: [],
      city: [],
      flatCity: [],
      customerRules: {
        shopType: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
        shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择客户类目', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        business_type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        // mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        wechat: [{ required: true, validator: validateWechat, trigger: 'blur' }],
        invoiceNumber: [
          {
            validator(rule, value, callback) {
              if (value === '') {
                callback();
                return;
              }
              const myreg = /.*[\u4e00-\u9fa5]+.*$/;
              if (myreg.test(value)) {
                callback(new Error('请输入正确的纳税人识别号'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        invoiceAccount: [
          {
            validator(rule, value, callback) {
              if (value === '') {
                callback();
                return;
              }
              const myreg = /^[0-9]+$/;
              if (!myreg.test(value)) {
                callback(new Error('账号必须为纯数字'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        invoicePhone: [
          {
            validator(rule, value, callback) {
              if (value === '') {
                callback();
                return;
              }
              const myreg1 = /^[1][0-9]{10}$/;
              const myreg2 = /^(0[0-9]{2,3}[-\s])?([1-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
              if (!myreg1.test(value) && !myreg2.test(value)) {
                callback(new Error('请输入正确的电话号码'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      aeAllList: [],
      // 弹窗的类型 onebyone 一个一个的上传，import 批量上传
      dialogType: 'onebyone',
      companyLoading: false,
      companies: [],
      rightBlockLabelWidth: '98px',
      version: getChromeVersion(),
      BusinessTypeOptions: BusinessTypeOptions.filter(el => el.value !== BusinessTypeEnum.mcn),
    };
  },
  computed: {
    isClassFallback() {
      return this.version !== false && this.version <= 84;
    },
  },
  async created() {
    await this.fetchCityData();
    // 获取客户经理列表
    this.queryUserNames(ROLE_CODE.customer_manager);
    // 获取部门下拉选项
    // this.getDepartmentOptions();
    this.getBrandList();
  },
  methods: {
    addItem() {
      this.list.push({ oneId: '', company_id: '', company_name: '' });
    },
    removeItem(it, index) {
      this.list.splice(index, 1);
      this.oneId.splice(index, 1);
    },

    // 获取省市区数据
    async fetchCityData() {
      const res = await fetchCities();
      this.city = res;

      this.flatCity = getFlatCities(parse(res));
    },
    // 关闭弹窗
    close() {
      this.oneId = [];
      this.list = [{ oneId: '', company_id: '', company_name: '' }];
      this.$refs.customerForm?.resetFields();
      this.$emit('close');
    },
    // 获取用户
    queryUserNames(_) {
      queryAllUserNames().then(res => {
        if (res.data.success) {
          this.managerList = res.data.data.user_data;
          if (this.id && this.customerForm?.managerId && this.managerList) {
            const currManager = this.managerList.find(el => el.id === this.customerForm?.managerId);
            this.customerForm.manager = {
              department_str: '',
              ...currManager,
            };
          }
        }
      });
      // 角色（管理员1，客户执行0，客户经理2，项目经理3）
      // queryUserNamesByRoles({ roles }).then(res => {
      //   if (res.data.success) {
      //     this.managerList = res.data.data;
      //     if (this.id && this.customerForm?.managerId && this.managerList) {
      //       const currManager = this.managerList.find(el => el.id === this.customerForm?.managerId);
      //       this.customerForm.manager = {
      //         department_str: '',
      //         ...currManager,
      //       };
      //     }
      //   }
      // });
    },
    // 获取部门列表
    // getDepartmentOptions() {
    //   getDepartment().then(res => {
    //     // debugger
    //     if (res.data.success) {
    //       this.departmentList = res.data.data;
    //     } else {
    //       this.$message({
    //         type: 'warning',
    //         message: res.data.message,
    //         duration: 2000,
    //         showClose: true,
    //       });
    //     }
    //   });
    // },
    // * 省市区初始化
    initAddr() {
      const { province, city, county } = this.customerForm;

      const cities = cityName2id([province, city, county], this.flatCity);
      this.customerForm.cities = cities;
      const inputValue = `${province} / ${city} / ${county}`;

      setTimeout(() => {
        this.$refs.cascader.inputValue = inputValue === ' /  / ' ? '' : inputValue;
      }, 17);
    },
    // 提交保存表单
    submitForm() {
      if (this.customerForm.shopType === 0) {
        this.$message.error('请选择店铺类型');
        return false;
      }

      this.$refs.customerForm.validate(valid => {
        if (valid) {
          this.isAddingEditing = true;
          // 保存接口
          this.saveCustomer();
        } else {
          // 跳到顶部
          if (
            this.customerForm.shopName === '' ||
            this.customerForm.category === '' ||
            this.customerForm.customerName === ''
          ) {
            this.goTop();
          }
          return false;
        }
      });
    },
    // 回顶部
    goTop() {
      document.querySelector('.customer-form').scrollTop = 0;
    },
    // 保存客户
    async saveCustomer() {
      const form = this.customerForm;
      // const [addr_province, addr_town, addr_county] = cityId2name(form.cities, this.flatCity);
      const [addr_province, addr_town, addr_county] = form.cities
        ? cityId2name(form.cities, this.flatCity)
        : [undefined, undefined, undefined];
      let companyIds = [];
      let newCompanyIds = [];
      // 为了保证编辑时提交有效的id
      for (let index = 0; index < this.oneId.length; index++) {
        if (typeof this.oneId[index] !== 'number') {
          companyIds.push(this.list[index].company_id);
        } else {
          companyIds.push(this.oneId[index]);
        }
      }
      companyIds.forEach(item => {
        if (item) {
          newCompanyIds.push(item);
        }
      });

      const params = {
        // 店铺名
        shop_name: form.shopName,
        // 店铺类型
        shop_type: form.shopType,
        // 客户类目
        category: form.category,
        // 店铺品牌
        brand_id: form.brand_id,
        // 业务类型
        business_type: form.business_type,
        // 公司名称
        // company_name: form.companyName,
        // 公司ID
        company_ids: newCompanyIds,
        // 客户类型
        company_type: form.companyType || null,
        // 客户姓名
        customer_name: form.customerName,
        // 客户分类
        // customer_class: form.customerClass,
        // 手机号
        mobile: form.mobile,
        // 微信号
        wechat: form.wechat,
        // 客户意向
        intention: form.intention,
        /*
        addr_province: form.province,
        addr_town: form.city,
        addr_county: form.county,
        */
        addr_province,
        addr_town,
        addr_county,
        addr_detail: form.addrDetail,
        // ----------跟进人---------------
        // 客户经理
        // manager: form.manager.username,
        // manager_ids: form.manager_ids,
        // 部门
        // department: form.manager.department,
        // ----------财务信息---------------
        // 公司开票抬头
        invoice_title: form.invoiceTitle,
        // 地址
        invoice_addr: form.invoiceAddr,
        // 纳税人识别号
        invoice_number: form.invoiceNumber,
        // 账号
        invoice_account: form.invoiceAccount,
        // 开户行
        invoice_bank: form.invoiceBank,
        // 电话号码
        invoice_phone: form.invoicePhone,
      };
      if (this.id) {
        params.id = this.id;
        // params.manager_name = form.managerName;
      }

      const res = this.id ? await CreateCustomer(params) : await EditCustomer(params);

      if (res.data.success) {
        this.$emit('save', res.data.data);
        this.oneId = [];
        this.list = [{ company_id: '', company_name: '' }];
      } else {
        this.$message.error(res.data.message);
      }

      this.isAddingEditing = false;
    },
    // 重置表单

    resetCustomer() {
      this.oneId = [];
      this.list = [{ company_id: '', company_name: '' }];
      this.customerForm.shop_name = '';
      this.customerForm.shopType = '';
      this.customerForm.category = '';
      this.customerForm.companyName = '';
      this.customerForm.companyType = '';
      this.customerForm.customerName = '';
      this.customerForm.customerClass = '';
      this.customerForm.mobile = '';
      this.customerForm.wechat = '';
      this.customerForm.intention = '';
      this.customerForm.province = '';
      this.customerForm.city = '';
      this.customerForm.county = '';
      this.customerForm.addrDetail = '';
      this.customerForm.manager = {};
      this.customerForm.department = '';
      this.customerForm.invoiceTitle = '';
      this.customerForm.invoiceAddr = '';
      this.customerForm.invoiceNumber = '';
      this.customerForm.invoiceAccount = '';
      this.customerForm.invoiceBank = '';
      this.customerForm.invoicePhone = '';
      this.customerForm.managerName = '';
      this.customerForm.cities = [];
      // this.customerForm = {
      //   // 店铺名
      //   shopName: '',
      //   shopType: '',
      //   // 客户类目
      //   category: '',
      //   // 公司名称
      //   companyName: '',
      //   companyType: '',
      //   // 客户姓名
      //   customerName: '',
      //   // 客户分类
      //   customerClass: '',
      //   // 手机号
      //   mobile: '',
      //   // 微信号
      //   wechat: '',
      //   // 客户意向
      //   intention: '',
      //   province: '',
      //   city: '',
      //   county: '',
      //   addrDetail: '',
      //   // ----------跟进人---------------
      //   // 客户经理
      //   manager: {},
      //   // 部门
      //   department: '',
      //   // ----------财务信息---------------
      //   // 公司开票抬头
      //   invoiceTitle: '',
      //   // 地址
      //   invoiceAddr: '',
      //   // 纳税人识别号
      //   invoiceNumber: '',
      //   // 账号
      //   invoiceAccount: '',
      //   // 开户行
      //   invoiceBank: '',
      //   // 电话号码
      //   invoicePhone: '',
      //   managerName: '',
      // };
    },
    // 切换弹窗
    handleImportType(type) {
      this.dialogType = type;
    },
    // 搜索公司名称
    async companyRemoteMethod(company_name) {
      if (company_name === '') {
        this.companies = [];
        return;
      }
      const response = await GetCompanyId(company_name);
      if (response.data.success) {
        this.companies = response.data.data.map(company => ({
          ...company,
        }));
      } else {
        this.companies = [];
      }
    },
    // 搜索选择公司回调，写入公司名称
    onCompanySelect(val) {
      this.customerForm.companyName = this.companies.find(com => com.id === val)?.company_name;
    },
    // 输入手机号
    inputMobile(event) {
      const val = event.target.value.replace(/\D+/u, '');
      this.customerForm.mobile = val;
      event.target.value = val;
    },
    async getBrandList() {
      const res = await GetBrandList({});
      if (res.data.success) {
        this.shopList = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.initAddr();
          this.list = [];
          this.customerForm = this.customerFormEdit;
          const companies = this.customerForm.companies;
          for (let index = 0; index < companies.length; index++) {
            this.list.push({
              oneId: companies[index].company_id,
              company_id: companies[index].company_id,
              company_name: companies[index].company_name,
            });
            this.oneId.push(companies[index].company_name);
          }
        } else {
          this.resetCustomer();
          this.$nextTick(() => {
            this.goTop();
            this.autoFocuseRef.focus();
          });
        }
      }

      this.companyRemoteMethod(this.customerForm.companyName);
    },
    customerForm(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal) && val !== null) {
        this.customerForm.manager = this.managerList.find(
          el => el.id === this.customerForm.manager.id,
        ) ?? {
          username: '',
          id: 0,
          department: 0,
          department_str: '',
        };
        if (!this.customerForm.manager_ids) {
          this.$set(this.customerForm, 'manager_ids');
          this.customerForm.manager_ids = [];
        }

        this.customerForm.manager_ids.splice(
          0,
          this.customerForm.manager_ids.length,
          ...this.customerForm.manager_infos.map(item => {
            return item.manager_id;
          }),
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.mutipleSelect {
  ::v-deep .el-icon-close:before {
    font-size: 13px !important;
  }
}
.add-company-btn {
  border: 1px dashed rgba(164, 178, 194, 0.5);
  width: 267px;
  height: 32px;
}
.company-selected-box {
  margin-bottom: 12px;
  width: 268px;
  float: left;
  margin-right: 18px;
  position: relative;
  .delete-company-btn {
    visibility: hidden;
    padding: 1px;
    border: none;
    background: #d1d8e0;
    position: absolute;
    right: -7px;
    top: -7px;
    &:hover {
      background: var(--error-color);
    }
    ::v-deep.el-icon-close:before {
      font-size: 12px;
      color: #ffffff;
    }
  }
  &:hover {
    .delete-company-btn {
      visibility: visible;
    }
  }
}

.form-title {
  font-weight: 600;
  margin-top: 18px;
  margin-bottom: 6px;
  height: 40px;
  color: var(--text-color);
  padding-left: 20px;
  font-size: 14px;
  line-height: 1;
}
.form-item {
  width: 267px;
  display: inline-block;
}
.form-item-left {
  margin-left: 30px;
}
.form-item-right {
  margin-left: 18px;
}
.drawer-footer {
  height: 50px;
  background: #f4f8ff;
  width: 100%;
  position: relative;
}
.form-title-mark {
  width: 3px;
  height: 14px;
  line-height: 40px;
  background: rgba(var(--theme-rgb-color), 0.9);
  border-radius: 1px;
  display: inline-block;
  vertical-align: sub;
  margin-right: 6px;
}
.form-address {
  margin-left: 48px;
  .el-form-item {
    // width: 668px;
    margin-left: 66px;
    margin-bottom: 16px;
    .address-select {
      display: flex;
      .el-select {
        &:nth-child(n + 2) {
          margin-left: 10px;
        }
      }
    }
  }
  .add-ae {
    // border: 1px dashed #dadada;
    border-radius: 2px;
    height: 32px;
    text-align: center;
    color: #c2c2c2;
    cursor: pointer;
    .el-input__inner {
      border: 1px dashed #dadada;
    }
    .tag-box {
      text-align: left;
      .el-tag {
        margin-left: 10px;
      }
    }
    .btn-add {
      .el-icon-circle-plus {
        color: #c2c2c2;
      }
      span {
        margin-left: 6px;
      }
    }
    .select-wrapper {
      border: 1px solid #dcdfe6;
      position: relative;
      z-index: 1;
      background: #fff;
      border-radius: 5px;
      padding: 5px 0;
      margin-top: 1px;
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
      .item {
        padding: 0 10px;
        text-align: left;
        color: #666;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  .address-textarea {
    margin-top: 2px;
  }
}
::v-deep .el-icon-close:before {
  color: var(--text-color);
  font-size: 20px;
}
.Position-r {
  position: relative;
  .Position-a {
    font-size: 12px;
    color: var(--text-des-color);
    position: absolute;
    left: -93px;
    bottom: -18px;
  }
}
.margin-r {
  width: 331px !important;
}

// 客户地址
.display_inline {
  ::v-deep .el-form-item__label {
    vertical-align: top;
  }
  display: inline-block;
}
</style>

<style lang="less">
@import '~@/styles/utils/index.less';

.customer-header {
  .pdl(24px);
  background: #f2f7ff;
}
.customer-header-create {
  background: #f4f8ff;
  > .tg-tabs {
    > .tg-tabs-header {
      background: #f4f8ff;
    }
  }
}
.customer-header-create
  > .tg-tabs.tg-tabs-line.bg-white
  > .tg-tabs-header
  > .tg-tabs-header-tab-list
  > .tg-tabs-header-tab-item {
  background-color: #f4f8ff;
  border-bottom-color: #f4f8ff;
}
.customer-header-create
  > .tg-tabs.tg-tabs-line.bg-white
  > .tg-tabs-header
  > .tg-tabs-header-tab-list
  > .tg-tabs-header-tab-item.tg-tabs-header-tab-item-active {
  border-bottom: 2px solid var(--theme-color);
}
.el-radio {
  .el-radio__label {
    color: var(--text-color);
  }
}
.add-customer-drawer .el-drawer__container {
  > .el-drawer {
    overflow-y: auto;
    overflow-y: overlay;
    > .el-drawer__header {
      height: 100%;
      max-height: 48px;
      padding: 0;
      .el-drawer__close-btn {
        height: 100%;
        .el-icon-close:before {
          color: #a4b2c2;
          font-size: 13px;
          margin-right: 27px;
          vertical-align: middle;
        }
      }
    }
  }
}
.customer-header-create-wrapper {
  .el-drawer__container {
    > .el-drawer {
      > .el-drawer__header {
        background: #f4f8ff;
      }
    }
  }
}
.form-title-p {
  display: inline-block;
  color: var(--text-color);
  line-height: 40px;
}
.customer-form {
  @leftWidth: 441px;
  @rightWidth: 415px;
  @marginLeft: 34px;
  display: flex;
  .el-checkbox__label {
    font-size: 14px;
    color: var(--text-color);
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
  }
  .el-form-item__label {
    line-height: 16px;
    font-size: 12px;
    margin-bottom: 6px;
  }
  > .add-tips-massage {
    width: 100%;
    height: 54px;
    background: rgba(255, 122, 54, 0.06);
  }
  > .customer-form-left {
    flex: none;
    width: 100%;
  }
  .el-checkbox {
    margin-left: 0;
    margin-right: 24px;
  }
  .el-radio {
    line-height: 32px;
  }
  > .customer-form-right {
    flex: none;
    width: @rightWidth;
    .mgl(@marginLeft);
  }

  .small-tip {
    .pos-a(100; -20px; 65px);

    .fc(12px, #666);
    width: 96px;
    height: 16px;

    font-size: 12px;
    color: #a4b2c2;
    line-height: 16px;
    font-weight: 400;
  }
  .with-small-tip {
    > .el-form-item__label {
      transform: translateY(-6px);
    }
  }
}
</style>

<style lang="less" scoped>
.add-customer-drawer-inner {
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow-y: auto !important;
  overflow-y: overlay !important;
  > .drawer-form {
    flex: auto;
    overflow-y: auto;
    overflow-y: overlay;
  }
  > .el-drawer-footer {
    flex: none;
  }
}
</style>
