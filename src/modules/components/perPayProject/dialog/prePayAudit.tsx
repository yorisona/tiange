import { defineComponent, ref, UnwrapRef, watch } from '@vue/composition-api';
import { Message } from 'element-ui';
import { QuerySettlementRevenueFlow } from '@/services/finance';
import { OptionType } from '@/types/base/advanced';
import { GetContractUid } from '@/services/contract';
import { PartnerTypeEnum } from '@/types/tiange/common';
import { AccountType, FlowStatus, RevenueFlowModel } from '@/types/tiange/finance/finance';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
import { SaveProjectPrePayInfo } from '@/services/common/project';
import { ElForm } from 'element-ui/types/form';
import { GetSettlementCompanyList } from '@/services/finance/settlement';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      is_received: 1,
      remark: '',
      revenue_flow_id: undefined as undefined | number,
      register_amount: undefined as undefined | number | string,
      contract_id: undefined as undefined | number,
      gather_way: 3,
      pay_company_name: '',
      company_id: undefined,
      company_name: '',
    });
    const project = ref<{
      project_uid: number | string | undefined;
      id: number | undefined;
      company_name: string;
      customer_company_name: string;
      company_id: number | undefined;
      customer_company_id: number | undefined;
      business_type: number;
    }>({
      project_uid: '',
      id: undefined,
      company_name: '',
      customer_company_name: '',
      company_id: undefined,
      customer_company_id: undefined,
      business_type: 3,
    });
    const formRef = ref<ElForm | undefined>(undefined);
    const show = (obj: any) => {
      project.value = obj.value;
      formData.value.company_name = project.value.company_name || '';
      formData.value.company_id = obj.value.company_id || obj.value.customer_company_id || '';
      search_contract('');
      getAllCompanyName(formData.value.company_name);
      queryRevenueFlow(AccountType.bank);
      ctx.root.$nextTick(() => {
        formRef.value?.clearValidate();
      });
    };
    const saveLoading = ref(false);
    const onCancelHandler = () => {
      ctx.emit('close');
    };
    const onSubmitHandler = async () => {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }
      saveLoading.value = true;
      const res = await SaveProjectPrePayInfo(
        {
          contract_id: formData.value.contract_id,
          gather_way: formData.value.gather_way,
          register_amount: Number(formData.value.register_amount || '0') * 100,
          project_id: project.value?.id,
          project_uid: project.value.project_uid || undefined,
          revenue_flow_id: formData.value.revenue_flow_id,
          is_received: formData.value.is_received,
          remark: formData.value.remark,
          company_id: formData.value.company_id,
        },
        project.value.business_type,
      );
      saveLoading.value = false;

      if (res.data.success) {
        Message.success(res.data.message);
        ctx.emit('submit');
        ctx.emit('close');
      } else {
        Message.error(res.data.message);
      }
    };
    // 关联合同
    const search_contract_list = ref<UnwrapRef<OptionType<number>[]>>([]);
    const search_contract = async (search: string) => {
      const res = await GetContractUid({
        partner_type: 1,
        company_name: search,
        project_type: PartnerTypeEnum.customer,
        project_id: project.value?.id,
        partner_id: search ? null : formData.value.company_id || undefined,
      });
      if (res.data.success) {
        const options = res.data.data.data.map(data => ({
          label:
            (data.company_name || '-') +
            '  (' +
            data.sign_type_name +
            ')  ' +
            data.coop_start_date +
            '-' +
            data.coop_end_date,
          value: data.contract_id,
        }));
        search_contract_list.value = options;
      }
    };

    const flowList = ref<RevenueFlowModel[]>([]);
    // 关联流水
    const queryRevenueFlow = async (accountType: AccountType) => {
      const res = await QuerySettlementRevenueFlow({
        num: 1000,
        page_num: 1,
        status: `${FlowStatus.watigingClaim},${FlowStatus.partClaimed}`,
        account_type: accountType,
        payer: accountType === AccountType.bank ? formData.value.company_name : undefined,
      });
      if (res.data.success) {
        flowList.value = (res.data.data.data ?? []).map(item => {
          item.un_claimed_amount = (item.income || 0) - (item.claimed_amount || 0);
          return item;
        });
      }
    };
    const search_revenueFlow = async (payer: string) => {
      const res = await QuerySettlementRevenueFlow({
        num: 1000,
        page_num: 1,
        status: `${FlowStatus.watigingClaim},${FlowStatus.partClaimed}`,
        account_type: formData.value.gather_way === 2 ? AccountType.zfb : AccountType.bank,
        payment_account: formData.value.gather_way === 2 && payer ? payer : undefined,
        payer:
          formData.value.gather_way === 3
            ? payer
              ? payer
              : formData.value.company_name
            : undefined,
      });
      if (res.data.success) {
        flowList.value = (res.data.data.data ?? []).map(item => {
          item.un_claimed_amount = (item.income || 0) - (item.claimed_amount || 0);
          return item;
        });
      }
    };

    watch(
      () => formData.value.gather_way,
      newWay => {
        if (newWay === 2) {
          // 支付宝
          queryRevenueFlow(AccountType.zfb);
        } else if (newWay === 3) {
          // 银行
          queryRevenueFlow(AccountType.bank);
        }
      },
      {
        deep: true,
      },
    );
    const revenueDate = (date: string | undefined) => {
      return date ? moment(date).format('M.D') : '--';
    };
    const companyList = ref<any>([]);
    const getAllCompanyName = async (keyword: string) => {
      const { data: response } = await GetSettlementCompanyList({ company_name: keyword });
      companyList.value = response.success ? response.data.data : [];
    };

    const handleCompanySelect = (id: string) => {
      const one = companyList.value.find((item: any) => {
        return item.id === id;
      });
      formData.value.company_name = one.company_name;
      /** 获取相关流水 */
      if (formData.value.gather_way === 3) {
        formData.value.revenue_flow_id = undefined;
        queryRevenueFlow(AccountType.bank);
      }

      if (formData.value.contract_id) {
        return;
      }
      search_contract(formData.value.company_name);
      // refundForm.value.bank = one[0].bank_of_deposit;
      // refundForm.value.bank_account = one[0].bank_card_number;
    };
    return {
      handleCompanySelect,
      getAllCompanyName,
      companyList,
      formRef,
      formatAmount,
      revenueDate,
      project,
      search_revenueFlow,
      flowList,
      queryRevenueFlow,
      search_contract,
      search_contract_list,
      onSubmitHandler,
      saveLoading,
      onCancelHandler,
      show,
      formData,
    };
  },
  render() {
    return (
      <div class="prepay-approval-container">
        <section class="content">
          <el-form
            ref="formRef"
            class="prepay-filter-form"
            size="mini"
            label-width="70px"
            attrs={{
              model: this.formData,
            }}
          >
            <el-form-item label="是否到账：" class="sp-form-item">
              <div style="width: 100%">
                <el-radio-group
                  v-model={this.formData.is_received}
                  on-change={() => {
                    this.formData.revenue_flow_id = undefined;
                    this.formData.register_amount = undefined;
                  }}
                >
                  <el-radio label={1}>已到账</el-radio>
                  <el-radio label={0}>未到账</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item
              label="收款说明："
              prop="remark"
              rules={{ required: true, message: '请输入收款说明', trigger: 'blur' }}
            >
              <el-input
                style="width: 100%"
                v-model={this.formData.remark}
                placeholder="请输入收款说明"
                maxlength={30}
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="公司名称："
              prop="company_id"
              rules={{ required: true, message: '请选择公司名称', trigger: 'change' }}
            >
              <el-select
                style="width:100%"
                popper-class="el-select-popper-mini"
                v-model={this.formData.company_id}
                placeholder="请输入并选择公司名称"
                filterable
                remote
                reserve-keyword
                on-change={this.handleCompanySelect}
                remote-method={this.getAllCompanyName}
              >
                {(this.companyList || []).map((item: any, key: number) => (
                  <el-option key={key} value={item.id} label={item.company_name} />
                ))}
              </el-select>
            </el-form-item>

            <el-form-item
              class="mgb0"
              label="收款方式："
              prop="gather_way"
              rules={{
                required: this.formData.is_received === 1,
                message: '请选择收款方式',
                trigger: 'change',
              }}
            >
              <el-radio-group
                value={this.formData.gather_way}
                onInput={(val: any) => {
                  this.formData.gather_way = val;
                }}
                on-change={() => {
                  this.formData.revenue_flow_id = undefined;
                  this.formData.pay_company_name = '';
                }}
                disabled={this.formData.is_received === 0}
              >
                <el-radio label={3}>对公银行</el-radio>
                <el-radio label={2}>支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="mgt-16"
              label="关联流水："
              prop="revenue_flow_id"
              rules={{
                required: this.formData.is_received === 1,
                message: '请选择关联收入流水',
                trigger: 'change',
              }}
            >
              <el-select
                popper-class="el-select-popper-mini"
                placeholder="请选择关联收入流水"
                style="width:100%"
                v-model={this.formData.revenue_flow_id}
                on-change={(id: any) => {
                  const finder = this.flowList.find(el => el.id === id);
                  if (finder?.payer) {
                    this.formData.pay_company_name = finder?.payer;
                  }
                  this.formData.register_amount = Number(finder?.un_claimed_amount || 0) / 100;
                }}
                remote={true}
                filterable={true}
                clearable={true}
                on-clear={() =>
                  this.search_revenueFlow(
                    this.formData.gather_way === 3 ? this.formData.company_name || '' : '',
                  )
                }
                remote-method={this.search_revenueFlow}
                disabled={this.formData.is_received === 0}
              >
                {this.flowList.map((item, key) => (
                  <el-option
                    key={item.id}
                    value={item.id}
                    label={`${this.revenueDate(item.revenue_date)} 收入: ${this.formatAmount(
                      (item.income ?? 0) / 100,
                      'None',
                    )}元 待认领: ${this.formatAmount(
                      (item.un_claimed_amount ?? 0) / 100,
                      'None',
                    )}元  ${
                      this.formData.gather_way === 3 ? item.payer ?? '' : item.payment_account ?? ''
                    }`}
                  />
                ))}
              </el-select>
            </el-form-item>

            <el-form-item
              label="预收金额："
              rules={{
                required: this.formData.is_received !== 1,
                message: '请选择预收金额',
                trigger: 'blur',
              }}
              prop="register_amount"
            >
              <el-input
                style="width: 100%"
                v-model={this.formData.register_amount}
                placeholder="请输入预收金额"
                disabled={this.formData.is_received === 1}
                v-only-number={{ precision: 2 }}
              />
            </el-form-item>
            <el-form-item
              label="关联合同："
              prop="contract_id"
              rules={{
                required: this.formData.is_received !== 1,
                message: '请选择关联合同',
                trigger: 'change',
              }}
            >
              <el-select
                popper-class="el-select-popper-mini"
                placeholder={
                  this.search_contract_list.length === 0 ? '暂无有效合同' : '请选择关联合同'
                }
                style="width:100%"
                value={this.formData.contract_id}
                filterable={true}
                remote={true}
                clearable={true}
                onInput={(val: any) => (this.formData.contract_id = val)}
                remote-method={this.search_contract}
                // disabled={isDisable_contract_id}
              >
                {this.search_contract_list.map((item, key) => (
                  <el-option key={key} value={item.value} label={item.label} />
                ))}
              </el-select>
            </el-form-item>
          </el-form>
        </section>
        <section class="footer">
          <tg-button on-click={this.onCancelHandler}>取消</tg-button>
          <tg-button type="primary" on-click={this.onSubmitHandler}>
            确认
          </tg-button>
        </section>
        <tg-mask-loading
          visible={this.saveLoading}
          content="  正在保存，请稍候..."
        ></tg-mask-loading>
      </div>
    );
  },
});
