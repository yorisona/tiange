import { defineComponent, ref, reactive, toRefs, computed, watch } from '@vue/composition-api';
import singleTrees from '@/components/system-set/trees/singleTrees.vue';
import { ElForm } from 'element-ui/types/form';
import { Message } from 'element-ui';
import {
  // CustomerCategoryMAP,
  SettlementCycleTypeMap,
} from '@/types/tiange/common';
import { GetShopLiveCompanyList } from '@/services/company';
import { GetFeishuDepartmentList } from '@/services/live';
import { departmentFilterDisabled } from '@/utils/filter';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import moment from 'moment';
import InputLimit from '@/utils/inputLimit';
import formatData from '@/utils/formatData';
import { ShopLiveProjectApproval } from '@/services/live.project';
import Decimal from 'decimal.js';
import { GetUser } from '@/services/system';
import { Brand } from '@/types/tiange/brand';
// import { useRequest } from '@gm/hooks/ahooks';
// import { GetBrandList } from '@/services/customers';
const SettlementCycleTypeMapOptions = [...SettlementCycleTypeMap].map((item: any) => {
  return { label: item[1], value: item[0] };
});
const useArtificial = () => {
  const formData = reactive({
    company_id: undefined,
    company_id_options: [],
    project_name: '',
    brand_id: undefined,
    // company_shop_id: undefined,
    // company_shop_id_options: [],
    company_shop_id: undefined,
    company_shop_id_options: [],
    business_type: 9,
    cooperation_type: undefined,
    // 店铺类目
    // new_shop_cateogry_name: '',
    start_date: undefined,
    end_date: undefined,
    // 结算周期类型
    settlement_cycle_type: undefined,
    customer_manager_id: undefined,
    customer_manager_id_options: [] as any[],
    project_manager_id: undefined,
    project_manager_id_options: [] as any[],
    feishu_department_id: undefined,
    feishu_department_level: undefined,
    feishu_department_id_input: '',
    feishu_department_id_show: false,
    feishu_department_id_list: [],
    attachment_url: [],
    estimated_data_list: [],
    remark: undefined,
    // 总GMV
    total_gmv: undefined,
    // 总营收
    total_income: undefined,
    // 总成本费用
    total_cost: undefined,
    // 总利润
    total_profit: undefined,
    default_checked_keys: [],
    company_subject: undefined,
  });
  const totalSum = computed(() => {
    let gmv = 0;
    let income = 0;
    let cost = 0;
    let profit: number | string = 0;
    formData.estimated_data_list.forEach((item: any) => {
      if (!isNaN(item.gmv)) {
        gmv += Number(item.gmv) * 10000;
      }
      if (!isNaN(item.income)) {
        income += Number(item.income) * 10000;
      }
      if (!isNaN(item.cost)) {
        cost += Number(item.cost) * 10000;
      }
    });
    if (!isNaN(income) && !isNaN(cost)) {
      profit = income - cost;
    }
    const total_gmv = gmv;
    const total_income = income;
    const total_cost = cost;
    const total_profit = profit;
    gmv = formatData.formatPriceFormYuan(gmv, 2, true);
    income = formatData.formatPriceFormYuan(income, 2, true);
    cost = formatData.formatPriceFormYuan(cost, 2, true);
    const hasNegative = profit < 0;
    profit = formatData.formatPriceFormYuan(Math.abs(profit), 2, false);
    if (hasNegative) profit = `-${profit}`;
    if (profit !== '--') profit = `￥${profit}`;
    return {
      gmv,
      total_gmv,
      income,
      total_income,
      cost,
      total_cost,
      profit,
      total_profit,
    };
  });

  const getAllCompanyName = async (company_name: string) => {
    const { data: response } = await GetShopLiveCompanyList(
      { company_name, verify_status: 1 },
      formData.business_type,
    );
    (formData as any).company_id_options = response.success ? response.data.data : [];
  };
  const brandList = ref<Brand[]>([]);
  const onChangeCompany = (company_id: number) => {
    formData.brand_id = undefined;
    const finder = formData.company_id_options?.find((el: any) => el.id === company_id) as any;
    brandList.value = finder?.brands || [];
    // const company: any = formData.company_id_options.find((it: any) => it.id === company_id);
    // if (!company) return;
    // // 默认填充项目名称
    // if (!formData.project_name) {
    //   if (company.shops_info?.length > 0) formData.project_name = company.shops_info[0].brand_name;
    // }
    // formData.company_shop_id_options = company.shops_info;
    // if (company.shops_info.length > 0) {
    //   formData.company_shop_id = company.shops_info[0].shop_id;
    //   onChangeShop(formData.company_shop_id as any);
    // } else {
    //   formData.company_shop_id = undefined;
    //   formData.new_shop_cateogry_name = '';
    // }
    // };
    // 店铺选择
    // const onChangeShop = (shop_id: number) => {
    //   const shop: any = formData.company_shop_id_options.find((it: any) => it.shop_id === shop_id);
    //   if (!shop) return;
    //   formData.new_shop_cateogry_name = CustomerCategoryMAP.get(shop.category) as any;
  };
  const getManagerList = async (val: string) => {
    const { data: response } = await GetUser({
      /*roles: '1008',
        business_type: BusinessTypeEnum.marketing,*/
      search_type: 2,
      search_value: val,
      is_checked: 1,
    });
    formData.project_manager_id_options = response.success ? response.data.data : [];
  };
  const getCustomerManagerList = async (val: string) => {
    const { data: response } = await GetUser({
      /*roles: '1008',
        business_type: BusinessTypeEnum.marketing,*/
      search_type: 2,
      search_value: val,
      is_checked: 1,
    });
    formData.customer_manager_id_options = response.success ? response.data.data : [];
  };
  const init = async () => {
    /* getManagerList('');
    getCustomerManagerList('');*/
    const res = await GetFeishuDepartmentList();
    const list = res.data.data.data;
    departmentFilterDisabled(list, true, 3);
    (formData as any).feishu_department_id_list = list;
  };

  init();

  const edit = (value: any) => {
    value.estimated_data_list = value.estimated_data.estimated_data_list;
    value.feishu_department_id_input = value.department_name;

    Object.keys(formData).forEach((item: any) => {
      if (value[item] === undefined) return;
      (formData as any)[item] = value[item];
    });
    formData.company_id_options = [
      {
        company_name: value.company_name,
        id: value.company_id,
      },
    ] as any;
    formData.default_checked_keys = [value.feishu_department_id] as any;
    formData.company_subject = value.company_subject;
    // formData.company_shop_id = value.customer_id;
    // formData.company_shop_id_options = [
    //   {
    //     shop_name: value.customer_manager_name,
    //     shop_id: value.customer_id,
    //   },
    // ] as any;
    // formData.new_shop_cateogry_name = value.category_name;
    formData.attachment_url = [value.attachment_url] as any;
    totalSum.value;
  };
  const submit = async () => {
    const _data: any = { ...formData };
    delete _data.company_shop_id_options;
    delete _data.company_id_options;
    delete _data.customer_manager_id_options;
    delete _data.feishu_department_id_list;
    delete _data.project_manager_id_options;

    _data.total_gmv = totalSum.value.total_gmv;
    _data.total_income = totalSum.value.total_income;
    _data.total_cost = totalSum.value.total_cost;
    _data.total_profit = totalSum.value.total_profit;
    _data.estimated_data_list = formData.estimated_data_list.map((item: any) => {
      const { gmv, income, cost } = item;
      return {
        // ...item,
        gmv: new Decimal(gmv ?? 0).mul(new Decimal(10000)).toNumber(),
        income: new Decimal(income ?? 0).mul(new Decimal(10000)).toNumber(),
        cost: new Decimal(cost ?? 0).mul(new Decimal(10000)).toNumber(),
        date: moment(item.date).format('YYYY.MM'),
      };
    });
    _data.attachment_url = formData.attachment_url[0];
    _data.start_date = moment(formData.start_date).format('YYYY-MM-DD');
    _data.end_date = moment(formData.end_date).format('YYYY-MM-DD');

    const { data: response } = await ShopLiveProjectApproval(_data as any, 9);
    if (response.success) {
      Message.success(response.message);
    } else {
      Message.error(response.message ?? '项目保存失败');
      throw new Error('项目保存失败');
    }
  };

  return reactive({
    getManagerList,
    getCustomerManagerList,
    edit,
    ...toRefs(formData),
    getAllCompanyName,
    onChangeCompany,
    brandList,
    // onChangeShop,
    submit,
    totalSum,
  });
};

const renderOptions = (options: any = [], label = 'label', value = 'value', isArea = false) => {
  return options.map((item: any, key: number) => {
    return (
      <el-option
        key={key}
        label={item[label]}
        value={item[value]}
        disabled={isArea && item[value] === 8}
      />
    );
  });
};

export default defineComponent({
  components: {
    singleTrees,
  },
  setup(_, ctx) {
    const formRef = ref<ElForm | null>(null);

    const artForm = useArtificial();
    const treeRef = ref();
    const steps = reactive({
      step: 1,
      cleanText: '取消',
      okText: '下一步',
      clean: () => {
        if (steps.step === 2) {
          steps.step = 1;
          steps.okText = '下一步';
          steps.cleanText = '取消';
        } else {
          ctx.emit('close');
        }
      },
      submit: () => {
        if (steps.step === 1) {
          Promise.resolve()
            .then(() => {
              return new Promise((resolve, reject) => {
                formRef.value?.validate(pass => {
                  if (pass) resolve(pass);
                  else reject();
                });
              });
            })
            .then(() => {
              const start = moment(artForm.start_date);
              const end = moment(artForm.end_date);
              if (end.isBefore(start)) throw new Error('结束时间不能小于开始时间');
              const estimated_data_list: any = [];
              while (!start.isAfter(end)) {
                let item: any = artForm.estimated_data_list.shift();
                if (item === undefined) {
                  item = {
                    date: start.clone(),
                    gmv: '',
                    income: '',
                    cost: '',
                  };
                } else {
                  item.date = start.clone();
                }
                start.add(1, 'months');
                estimated_data_list.push(item);
              }
              artForm.estimated_data_list = estimated_data_list;
            })
            .then(() => {
              steps.step = 2;
              steps.okText = '提交';
              steps.cleanText = '上一步';
            })
            .catch((ex: Error) => {
              if (ex?.message) {
                Message.error(ex.message);
              }
            });
        } else {
          Promise.resolve().then(() => {
            return new Promise((resolve, reject) => {
              formRef.value?.validate(pass => {
                if (pass) resolve(pass);
                else reject();
              });
            }).then(async () => {
              await artForm.submit();
              ctx.emit('close');
              ctx.emit('submit');
            });
          });
        }
      },
    });
    const show = (value: any) => {
      if (value && value.estimated_data_list) artForm.edit(value);
    };

    // const brandServe = useRequest(GetBrandList);
    watch(
      () => artForm.cooperation_type,
      () => {
        (artForm.business_type as any) =
          artForm.business_type === 8 ? undefined : artForm.business_type;
      },
    );
    return {
      show,
      artForm,
      formRef,
      treeRef,
      steps,
      // brandServe,
    };
  },
  render() {
    const artForm = this.artForm;
    return (
      <div class="dialog-import">
        {this.steps.step === 1 && (
          <div class="header-title">
            <tg-icon name="ico-warn" />
            创建项目流程：1、客户管理中创建客户公司、品牌信息；2、发起项目立项审批；3、审批通过后系统自动创建项目。
          </div>
        )}
        <div class="content">
          {this.steps.step === 1 && (
            <div class="artificial">
              <head-lines style="margin: 10px 0px 15px 0px" title="项目信息" />
              <el-form
                ref="formRef"
                label-width="70px"
                label-position="top"
                size="mini"
                hide-required-asterisk={true}
                attrs={{
                  model: artForm,
                }}
              >
                <div class="artificial-item">
                  <el-form-item
                    label="合作类型"
                    prop="cooperation_type"
                    rules={{
                      required: true,
                      message: '请选择合作类型',
                      trigger: ['blur', 'change'],
                    }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.cooperation_type}
                    >
                      {renderOptions(
                        [
                          { label: '自营', value: 1 },
                          { label: '区域', value: 2 },
                        ],
                        'label',
                        'value',
                      )}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="业务类型"
                    prop="business_type"
                    rules={{
                      required: true,
                      message: '请选择业务类型',
                      trigger: ['blur', 'change'],
                    }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.business_type}
                      disabled
                    >
                      {renderOptions(
                        [
                          { label: '抖音店播', value: 3 },
                          { label: '本地生活', value: 7 },
                          { label: '淘宝店播', value: 2 },
                          { label: '淘宝甄选', value: 8 },
                          { label: '供应链', value: 9 },
                        ],
                        'label',
                        'value',
                        artForm.cooperation_type === 2,
                      )}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="公司名称"
                    prop="project_name"
                    rules={{ required: true, message: '请选择公司名称', trigger: ['blur'] }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      remote-method={artForm.getAllCompanyName}
                      filterable
                      remote
                      placeholder="请选择"
                      v-model={artForm.company_id}
                      onChange={artForm.onChangeCompany}
                    >
                      {renderOptions(artForm.company_id_options, 'company_name', 'id')}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="项目名称"
                    prop="project_name"
                    rules={{ required: true, message: '请填写项目名称', trigger: ['blur'] }}
                  >
                    <el-input
                      style="width:100%"
                      placeholder="请输入项目名称"
                      v-model={artForm.project_name}
                    />
                  </el-form-item>
                  <el-form-item
                    label="品牌"
                    prop="brand_id"
                    rules={{ required: true, message: '请选择品牌', trigger: ['change'] }}
                  >
                    {/* <el-input
                      style="width:100%"
                      // placeholder="请输入项目名称"
                      v-model={artForm.project_name}
                    /> */}
                    <el-select style="width:100%" v-model={artForm.brand_id}>
                      {artForm.brandList.map((el: any) => (
                        <el-option label={el.brand_name} value={el.id} key={el.id}></el-option>
                      ))}
                    </el-select>
                  </el-form-item>
                  {/* <el-form-item
                    label="店铺名称"
                    prop="company_shop_id"
                    rules={{ required: true, message: '请选择', trigger: ['blur'] }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请选择"
                      disabled={!artForm.company_id}
                      v-model={artForm.company_shop_id}
                      onChange={artForm.onChangeShop}
                    >
                      {renderOptions(artForm.company_shop_id_options, 'shop_name', 'shop_id')}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="店铺类目"
                    prop="new_shop_cateogry_name"
                    rules={{ required: true, message: '请填写店铺类目', trigger: ['blur'] }}
                  >
                    <el-input
                      disabled={true}
                      style="width:100%"
                      v-model={artForm.new_shop_cateogry_name}
                    />
                  </el-form-item> */}
                  <el-form-item
                    label="开始时间"
                    prop="start_date"
                    rules={{ required: true, message: '请选择开始时间', trigger: ['blur'] }}
                  >
                    <el-date-picker
                      placeholder="请选择"
                      style="width:100%"
                      format="yyyy.MM.dd"
                      v-model={artForm.start_date}
                    />
                  </el-form-item>
                  <el-form-item
                    label="结束时间"
                    prop="end_date"
                    rules={{ required: true, message: '请选择结束时间', trigger: ['blur'] }}
                  >
                    <el-date-picker
                      placeholder="请选择"
                      style="width:100%"
                      format="yyyy.MM.dd"
                      v-model={artForm.end_date}
                    />
                  </el-form-item>
                  <el-form-item
                    label="结算周期"
                    prop="settlement_cycle_type"
                    rules={{ required: true, message: '请选择', trigger: ['blur', 'change'] }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.settlement_cycle_type}
                    >
                      {renderOptions(SettlementCycleTypeMapOptions)}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="客户经理"
                    prop="customer_manager_id"
                    rules={{
                      required: true,
                      message: '请输入客户经理花名',
                      trigger: ['blur', 'change'],
                    }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请输入客户经理花名"
                      filterable
                      v-model={artForm.customer_manager_id}
                      remote
                      reserve-keyword
                      clearable
                      remote-method={artForm.getCustomerManagerList}
                    >
                      {renderOptions(artForm.customer_manager_id_options, 'username', 'id')}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="项目经理"
                    prop="project_manager_id"
                    rules={{
                      required: true,
                      message: '请输入项目经理花名',
                      trigger: ['blur', 'change'],
                    }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请输入项目经理花名"
                      v-model={artForm.project_manager_id}
                      filterable
                      remote
                      reserve-keyword
                      clearable
                      remote-method={artForm.getManagerList}
                    >
                      {renderOptions(artForm.project_manager_id_options, 'username', 'id')}
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    label="所属部门"
                    prop="feishu_department_id"
                    rules={{ required: true, message: '请选择归属部门', trigger: 'change' }}
                  >
                    <el-popover
                      placement="top"
                      trigger="click"
                      popper-class="live-project-addproject-popper el-tree-popper-mini"
                      v-model={artForm.feishu_department_id_show}
                      popper-options={{
                        boundariesElement: 'body',
                      }}
                    >
                      <el-input
                        placeholder="请选择"
                        readonly
                        slot="reference"
                        value={artForm.feishu_department_id_input}
                      >
                        <template slot="suffix">
                          <i class="select-icon select-icon-user-add el-icon-arrow-down" />
                        </template>
                      </el-input>
                      <el-tree
                        show-checkbox={true}
                        check-strictly={true}
                        node-key="id"
                        data={artForm.feishu_department_id_list}
                        ref="treeRef"
                        default-checked-keys={artForm.default_checked_keys}
                        onCheck={(value: any) => {
                          this.treeRef.setCheckedKeys([]);
                          this.treeRef.setCheckedKeys([value.department_id]);
                          artForm.feishu_department_id = value.id;
                          artForm.feishu_department_id_input = value.name;
                          artForm.feishu_department_id_show = false;
                          artForm.feishu_department_level = value.level;
                        }}
                        {...{
                          props: {
                            props: {
                              label: 'name',
                              children: 'sons',
                            },
                          },
                        }}
                      />
                    </el-popover>
                    {/*<el-select popper-class="el-select-popper-mini" */}
                    {/*  style="width:100%"*/}
                    {/*  placeholder="请选择"*/}
                    {/*  v-model={artForm.department_biz_code}*/}
                    {/*>*/}
                    {/*  {renderOptions(artForm.department_biz_code_options, 'name', 'department_id')}*/}
                    {/*</el-select>*/}
                  </el-form-item>
                  <el-form-item
                    label="归属主体"
                    prop="company_subject"
                    rules={{
                      required: true,
                      message: '请选择归属主体',
                      trigger: ['blur', 'change'],
                    }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:100%"
                      placeholder="请选择归属主体"
                      v-model={artForm.company_subject}
                    >
                      {(E.project.ProprietorTypeOption || []).map((item: any, index: number) => {
                        return <el-option key={index} label={item.label} value={item.value} />;
                      })}
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          )}
          {this.steps.step === 2 && (
            <div class="artificial">
              <head-lines style="margin: 10px 0px 15px 0px" title="项目预估数据" />
              <el-form
                ref="formRef"
                label-width="70px"
                label-position="top"
                size="mini"
                hide-required-asterisk={true}
                attrs={{
                  model: artForm,
                }}
              >
                <div class="artificial-item">
                  {artForm.estimated_data_list.map((_: any, key) => {
                    const date = moment(_.date);
                    const month = date.month() + 1;
                    const year = date.year();
                    return (
                      <fragments>
                        <el-form-item
                          label={`${year}年${month}月GMV (万)`}
                          prop={`estimated_data_list.${key}.gmv`}
                          rules={{ required: true, message: '请填写GMV', trigger: ['blur'] }}
                        >
                          <el-input
                            style="width:100%"
                            placeholder="请输入"
                            v-model={_.gmv}
                            maxLength={12}
                            onInput={(value: string) => {
                              _.gmv = InputLimit.IntergerAndDecimals(value);
                            }}
                          />
                        </el-form-item>
                        <el-form-item
                          label={`${year}年${month}月营收 (万)`}
                          prop={`estimated_data_list.${key}.income`}
                          rules={{ required: true, message: '请填写营收', trigger: ['blur'] }}
                        >
                          <el-input
                            style="width:100%"
                            placeholder="请输入"
                            v-model={_.income}
                            maxLength={12}
                            onInput={(value: string) => {
                              _.income = InputLimit.IntergerAndDecimals(value);
                            }}
                          />
                        </el-form-item>
                        <el-form-item
                          label={`${year}年${month}月成本费用 (万)`}
                          prop={`estimated_data_list.${key}.cost`}
                          rules={{ required: true, message: '请填写成本费用', trigger: ['blur'] }}
                        >
                          <el-input
                            style="width:100%"
                            placeholder="请输入"
                            v-model={_.cost}
                            maxLength={12}
                            onInput={(value: string) => {
                              _.cost = InputLimit.IntergerAndDecimals(value);
                            }}
                          />
                        </el-form-item>
                      </fragments>
                    );
                  })}
                </div>
                <div class="summation">
                  <div>
                    <span>总GMV∶</span>
                    <span>{artForm.totalSum.gmv}</span>
                  </div>
                  <div>
                    <span>总营收∶</span>
                    <span>{artForm.totalSum.income}</span>
                  </div>
                  <div>
                    <span>总成本费用∶</span>
                    <span>{artForm.totalSum.cost}</span>
                  </div>
                  <div>
                    <span>总利润∶</span>
                    <span>{artForm.totalSum.profit}</span>
                  </div>
                </div>
                <el-form-item label="备注" prop="remark" class="remark-item">
                  <el-input
                    maxLength={100}
                    placeholder="限100字"
                    style="width:100%"
                    v-model={artForm.remark}
                  />
                </el-form-item>
                <el-form-item
                  label="附件"
                  prop="attachment_url"
                  rules={{ required: true, message: '请上传附件', trigger: ['blur', 'change'] }}
                >
                  <tg-upload
                    show-file-list={false}
                    action="/api/resources/upload_file"
                    data={{ type: 'settlement' }}
                    style="margin-bottom:12px"
                    beforeUpload={FormValidation.ValidationFileUpload({
                      excel: true,
                      fileSize: 10,
                      doc: true,
                      pdf: true,
                    })}
                    success={(res: any) => {
                      if (!res.success) {
                        Message.error(res.message);
                        return;
                      }
                      artForm.attachment_url = [res.data.source] as any;
                    }}
                  >
                    <tg-button icon="ico-upload-lite">上传文件</tg-button>
                  </tg-upload>
                  <upload-file-list v-model={artForm.attachment_url} />
                </el-form-item>
              </el-form>
            </div>
          )}
        </div>
        <div class="footer">
          <tg-button onClick={this.steps.clean}>{this.steps.cleanText}</tg-button>
          <tg-button onClick={this.steps.submit} type="primary">
            {this.steps.okText}
          </tg-button>
        </div>
      </div>
    );
  },
});
