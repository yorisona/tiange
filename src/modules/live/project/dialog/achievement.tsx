/**
 * 登记业绩弹框
 */
import {
  defineComponent,
  ref,
  inject,
  UnwrapRef,
  Ref,
  // onMounted,
  watch,
} from '@vue/composition-api';
// import { LiveProject } from '@/types/tiange/live.project';
import { GetContractUid } from '@/services/contract';
import {
  SAVE_SHOP_LIVE_ACHIEVEMENT,
  SAVE_SHOP_LIVE_ACHIEVEMENT_COMMON,
  SAVE_COOP_LIVE_ACHIEVEMENT_COMMON,
  SAVE_SHOP_LIVE_MERCHANT_ACHIEVEMENT,
} from '@/services/live.project';
import { queryApprovalIdList, uploadCertificate } from '@/api/cooperative';
import { Message } from 'element-ui';
import rules from '@/utils/rules';
import { OptionType } from '@/types/base/advanced';
import { PartnerTypeEnum } from '@/types/tiange/common';
import { GetSettlementRevenueFlowDetail, QuerySettlementRevenueFlow } from '@/services/finance';
import { AccountType, FlowStatus, RevenueFlowModel } from '@/types/tiange/finance/finance';
import { formatAmount } from '@/utils/string';
import moment from 'moment';
import { ElForm } from 'element-ui/types/form';
import {
  GetProjectPrePayDepositReceviedList,
  SaveProjectPrePayAchievement,
} from '@/services/common/project';
// import { MarketingProjectDetail } from '@/types/tiange/marketing/project';
// import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
const gatherTypeOptions: OptionType<any>[] = [
  { label: '服务费', value: 1 },
  { label: '佣金', value: 2 },
  { label: '其他', value: 3 },
  { label: '预收款', value: 6 },
];

interface IForm {
  achievement_name: string;
  gather_type: number;
  gather_amount: string;
  gather_way: number;
  register_way: number;
  pay_company_name: string;
  settlement_no_write_off_amount?: string;
  task_id: string;
  order_wangwang_id: string;
  order_date: string;
  contract_id: any;
  is_invoice: number;
  gather_certificate_pic: { name: string; value: string } | null;
  achievement_id?: string;
  revenue_flow_id: number | undefined;
  record_id?: number | undefined;
}

const formDefault = {
  achievement_id: undefined,
  achievement_name: '',
  gather_type: 1,
  gather_amount: '',
  settlement_no_write_off_amount: '',
  gather_way: 3,
  register_way: 1,
  pay_company_name: '',
  task_id: '',
  order_wangwang_id: '',
  order_date: '',
  contract_id: null,
  is_invoice: 0,
  gather_certificate_pic: null,
  revenue_flow_id: undefined,
  record_id: undefined,
};

const mcn_taobao_default_company = '阿里巴巴网络科技有限公司';

export default defineComponent({
  props: {
    type: {
      type: Number, // 1:通用业务
      default: null,
    },
    isFromPrePay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const project = inject<Ref>('project') ?? ref(undefined);
    // const project = inject<Ref<UnwrapRef<LiveProject>>>('project');

    // const mcn_douuyin_company = ref<string | undefined>(undefined);
    // const mcn_taobao_company = ref<string>(mcn_taobao_default_company);
    // const marketing_company = ref<string | undefined>(undefined);
    const company_info = ref<{ company_id?: number; company_name?: string }>({
      company_id: undefined,
      company_name: undefined,
    });
    const form = ref<IForm>({ ...formDefault });
    form.value.gather_type = props.isFromPrePay ? 6 : 1;
    const visible = ref(false);
    const saveLoading = ref<boolean>(false);
    const flowList = ref<RevenueFlowModel[]>([]);
    const oldFlowModel = ref<RevenueFlowModel | undefined>(undefined);
    const businessType = ref({
      isMcn: false,
      isBrand: false,
      isMarketing: false,
      isMerchant: false,
      isLocalLife: false,
      isSupplyChain: false,
    });
    const isLiveDouyin = ref(false);
    const isDisable_contract_id = ref(false);

    const getSettlementRevenueFlowDetail = async (id: number) => {
      if (!id) {
        return;
      }
      const res = await GetSettlementRevenueFlowDetail(id);
      if (res.data.success) {
        oldFlowModel.value = res.data.data;
      }
    };
    const the_same_connection_option = ref({
      label: '',
      value: '',
    });
    const data = ref<any>({});
    const show = (obj: any = {}, btype: any = {}, liveDouyin: false) => {
      flowList.value = [];
      form.value.revenue_flow_id = obj.revenue_flow_id || undefined;
      form.value.record_id = obj.id || undefined;
      data.value = obj;
      businessType.value = btype;
      isLiveDouyin.value = liveDouyin;
      const {
        gather_amount,
        search_invoice_apply_value,
        search_contract_list_value,
        company_id,
        company_name,
        revenue_flow_id,
      } = obj;
      company_info.value = {
        company_id,
        company_name:
          project.value.platform_type === 2
            ? company_name || mcn_taobao_default_company
            : company_name,
      };
      if (revenue_flow_id) {
        getSettlementRevenueFlowDetail(revenue_flow_id);
      } else {
        if (form.value.gather_way === 2) {
          // 支付宝
          queryRevenueFlow(AccountType.zfb);
        } else if (form.value.gather_way === 3) {
          // 银行
          queryRevenueFlow(AccountType.bank);
        } else if (form.value.gather_way === 6) {
          // 预收款
          queryRevenueFlow(6);
        }
      }

      // if (businessType.value.isMcn) {
      //   mcn_douuyin_company.value = company_name;
      //   mcn_taobao_company.value = company_name || mcn_taobao_default_company;
      // }
      // if (businessType.value.isMarketing) {
      //   marketing_company.value = company_name;
      // }
      search_contract_list.value = [];

      if (obj.contract_id) {
        isDisable_contract_id.value = true;
        form.value.contract_id = obj.contract_id;
        if (search_contract_list_value) {
          the_same_connection_option.value = {
            label: search_contract_list_value[0].label,
            value: search_contract_list_value[0].value,
          };
        }
      } else {
        isDisable_contract_id.value = false;
      }

      if (search_invoice_apply_value) {
        search_invoice_apply.value = search_invoice_apply_value;
      } else {
        search_invoice_apply.value = [];
      }
      form.value.gather_amount = gather_amount || '';
      setTimeout(() => {
        Object.entries({ ...formDefault, ...obj }).forEach(([key, value]) => {
          // @ts-ignore
          if (key === 'gather_certificate_pic' && value) {
            const obj_value = Object(value);
            const name_str = decodeURI(String(obj_value.name));
            form.value.gather_certificate_pic = { name: name_str, value: obj_value.value };
          } else {
            // @ts-ignore
            form.value[key] = value as any;
          }
          form.value.gather_type = props.isFromPrePay ? 6 : 1;
          form.value.revenue_flow_id = obj.revenue_flow_id || undefined;
          form.value.record_id = obj.id || undefined;
          // if (key === 'settlement_no_write_off_amount' && value) {
          //   form.gather_amount = value + '';
          // }
        });
        if (form.value.contract_id === 0 || form.value.contract_id === '0') {
          form.value.contract_id = undefined;
        }
      }, 10);
      search_contract(obj.contract_company_name || '');
      visible.value = true;
      formRef.value && formRef.value?.clearValidate();
    };
    // 关联合同
    const search_contract_list = ref<UnwrapRef<OptionType<number>[]>>([]);
    const search_contract = async (search: string) => {
      const res = await GetContractUid({
        partner_type: 1,
        company_name: search,
        project_type: PartnerTypeEnum.customer,
        project_id: project.value.id,
        partner_id: search ? null : company_info.value.company_id,
        settlement_start_date: data.value.start_date
          ? moment(Number(data.value.start_date * 1000)).format('YYYY-MM-DD')
          : undefined,
        settlement_end_date: data.value.end_date
          ? moment(Number(data.value.end_date * 1000)).format('YYYY-MM-DD')
          : undefined,
      });
      if (res.data.success) {
        let options = res.data.data.data.map(data => ({
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
        if (the_same_connection_option.value.value) {
          options = options.filter((i: OptionType) => {
            return i.value !== Number(the_same_connection_option.value.value);
          }); //去重处理
          search_contract_list.value = [...options, the_same_connection_option.value];
        } else {
          search_contract_list.value = options;
        }
      }
    };
    // 开票审批
    const search_invoice_apply = ref<UnwrapRef<OptionType<number>[]>>([]);
    const search_invoice = async (search: string) => {
      const res = await queryApprovalIdList({
        approval_type: 4,
        achievement_id: form.value.achievement_id,
        approval_uid: search,
      });
      if (res.data.success) {
        search_invoice_apply.value = res.data.data.map((data: any) => {
          return {
            label: data.approval_uid,
            value: data.id,
          };
        });
      }
    };
    // 附件上传
    const uploadAttachmenFile = async (value: any) => {
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('type', 'certificate/achievement_gather_certificate');
      try {
        const res = await uploadCertificate(formData);
        if (!res.data.success) {
          Message.warning(res.data.message);
        } else {
          form.value.gather_certificate_pic = {
            name: value.file.name,
            value: res.data?.data?.source,
          };
        }
      } catch (event) {
        Message.error('上传失败');
      }
    };

    const formRef = ref<ElForm | undefined>(undefined);
    const emitClose = (value = false) => {
      ctx.emit('close', value);
      visible.value = false;
    };
    const emitSuccess = () => {
      ctx.emit('ok');
      visible.value = false;
    };
    const submit = () => {
      formRef.value?.validate((valid: boolean) => {
        if (!valid) return false;

        const project_id = project ? project.value.id : -1;
        if (project_id === -1) {
          Message.error('项目ID错误');
          return false;
        }

        const query: any = {
          project_id: project_id,
          ...form.value,
        };
        if (query.is_invoice === 0) {
          // query.gather_certificate_pic = null;
        } else {
          // query.gather_certificate_pic = form.value.gather_certificate_pic;
        }
        if (query.gather_certificate_pic) {
          query.gather_certificate_pic = query.gather_certificate_pic.value;
        }
        Promise.resolve()
          .then(() => {
            saveLoading.value = true;
            const {
              achievement_name,
              gather_amount,
              gather_type,
              gather_way,
              is_invoice,
              pay_company_name,
              task_id,
              order_wangwang_id,
              order_date,
              gather_certificate_pic,
              achievement_id,
              contract_id,
              revenue_flow_id,
            } = form.value;
            // let company_name: any = undefined;
            // if (businessType.value.isMcn) {
            //   if (project.value.platform_type === 2) {
            //     company_name = mcn_taobao_company.value;
            //   } else if (project.value.platform_type === 1) {
            //     company_name = mcn_douuyin_company.value;
            //   }
            // } else {
            //   company_name = project.value.customer_company_name || project.value.company_name;
            // }
            const obj: any = {
              settlement_id: query.id,
              achievement_name,
              gather_amount,
              gather_type,
              gather_way,
              is_invoice,
              pay_company_name:
                (gather_way === 2 && !businessType.value.isMarketing) ||
                (businessType.value.isMarketing && form.value.register_way === 2)
                  ? company_info.value.company_name
                  : pay_company_name,
              task_id,
              order_wangwang_id,
              order_date,
              contract_id,
              gather_certificate_pic: gather_certificate_pic?.value ?? '',
              achievement_id,
              revenue_flow_id: form.value.gather_way !== 6 ? revenue_flow_id : undefined,
              deposit_received_id: form.value.gather_way === 6 ? revenue_flow_id : undefined,
              record_id: form.value.record_id || undefined,
            };

            if (props.isFromPrePay) {
              return SaveProjectPrePayAchievement(obj, businessType.value.isMcn ? 5 : 3);
            } else if (businessType.value.isMerchant) {
              obj.project_id = project_id;
              return SAVE_SHOP_LIVE_MERCHANT_ACHIEVEMENT(obj);
            } else if (businessType.value.isMcn) {
              obj.project_id = project_id;
              return SAVE_SHOP_LIVE_ACHIEVEMENT_COMMON(obj);
            } else if (businessType.value.isBrand) {
              obj.project_id = project_id;
              return SAVE_SHOP_LIVE_ACHIEVEMENT(obj);
            } else if (businessType.value.isSupplyChain) {
              obj.project_id = project_id;
              return SAVE_SHOP_LIVE_ACHIEVEMENT(obj, E.project.BusinessType.supplyChain);
            } else if (businessType.value.isLocalLife) {
              obj.project_id = project_id;
              return SAVE_SHOP_LIVE_ACHIEVEMENT(obj, E.project.BusinessType.locallife);
            } else {
              obj.cooperation_id = (project?.value as any).cooperation_id;
              return SAVE_COOP_LIVE_ACHIEVEMENT_COMMON(obj);
            }
          })
          .then((res: any) => {
            saveLoading.value = false;
            if (!res.data.success) return Message.error(res.data.message);
            Message.success(res.data.message);
            setTimeout(emitSuccess, 1000);
          })
          .catch(ex => {
            saveLoading.value = false;
            Message.error(ex.message);
          });
      });
    };
    // 关联流水
    const queryRevenueFlow = async (accountType: AccountType | 6) => {
      if (accountType === 6) {
        const res = await GetProjectPrePayDepositReceviedList({
          num: 1000,
          page_num: 1,
          customer_company_name: data.value.company_name || undefined,
        });
        if (res.data.success) {
          flowList.value = res.data.data.data ?? [];
        }
        return;
      }
      const res = await QuerySettlementRevenueFlow({
        num: 1000,
        page_num: 1,
        status: `${FlowStatus.watigingClaim},${FlowStatus.partClaimed}`,
        account_type: accountType,
        payer: accountType === AccountType.bank ? data.value.company_name : undefined,
      });
      if (res.data.success) {
        flowList.value = res.data.data.data ?? [];
      }
    };
    const search_revenueFlow = async (payer: string) => {
      // console.log(payer, project.value, data, 'payer');
      if (form.value.gather_way === 6) {
        const res = await GetProjectPrePayDepositReceviedList({
          num: 1000,
          page_num: 1,
          customer_company_name: payer || undefined,
        });
        if (res.data.success) {
          flowList.value = res.data.data.data ?? [];
        }
        return;
      }
      const res = await QuerySettlementRevenueFlow({
        num: 1000,
        page_num: 1,
        status: `${FlowStatus.watigingClaim},${FlowStatus.partClaimed}`,
        account_type: form.value.gather_way === 2 ? AccountType.zfb : AccountType.bank,
        payment_account: form.value.gather_way === 2 && payer ? payer : undefined,
        payer: form.value.gather_way === 3 ? (payer ? payer : data.value.company_name) : undefined,
      });
      if (res.data.success) {
        flowList.value = res.data.data.data ?? [];
      }
    };
    watch(
      () => form.value.gather_way,
      newWay => {
        flowList.value = [];
        form.value.revenue_flow_id = undefined;
        if (newWay === 2) {
          // 支付宝
          queryRevenueFlow(AccountType.zfb);
        } else if (newWay === 3) {
          // 银行
          queryRevenueFlow(AccountType.bank);
        } else if (newWay === 6) {
          // 预收款
          queryRevenueFlow(6);
        }
      },
      {
        deep: true,
      },
    );

    // onMounted(() => {
    //   queryRevenueFlow();
    // });
    const revenueDate = (date: string | undefined) => {
      return date ? moment(date).format('M.D') : '--';
    };

    return {
      flowList,
      isDisable_contract_id,
      saveLoading,
      project,
      // mcn_douuyin_company,
      // mcn_taobao_company,
      // marketing_company,
      company_info,
      form,
      formRef,
      emitClose,
      businessType,
      search_contract_list,
      search_contract,
      search_invoice_apply,
      search_invoice,
      search_revenueFlow,
      uploadAttachmenFile,
      submit,
      visible,
      show,
      formatAmount,
      revenueDate,
      oldFlowModel,
      isLiveDouyin,
    };
  },
  render(h) {
    /* isDisable_contract_id 关联合同允许修改 */
    const { visible, form, company_info } = this;
    const { company_name } = company_info;
    const project: any = this.project;
    if (!project) return <div />;

    // let display_company_name: any = undefined;
    // if (this.businessType.isMcn) {
    //   if (project.platform_type === 2) {
    //     display_company_name = company_info.company_name || mcn_taobao_default_company;
    //   } else if (project.platform_type === 1) {
    //     display_company_name = company_info.company_name;
    //   } else {
    //     display_company_name = company_info.company_name;
    //   }
    // } else {
    //   display_company_name = company_info.company_name;
    // }
    // this.form.pay_company_name = company_name;

    const dialogWidth = this.businessType.isMcn ? '670px' : '588px';
    const gather_wayMap = new Map([
      [3, '1'],
      [2, '2'],
    ]);
    const flowList: any =
      this.form.gather_type === 6
        ? this.flowList
        : this.oldFlowModel &&
          this.oldFlowModel.account_type === Number(gather_wayMap.get(this.form.gather_way)) &&
          this.flowList.every(i => i.id !== (this.oldFlowModel as any).id)
        ? [this.oldFlowModel, ...this.flowList]
        : this.flowList;
    // console.log(this.flowList, this.oldFlowModel, 'this.flowList');
    return (
      <div>
        <el-dialog
          z-index={2000}
          class="customer-dialog el-dialog-center-rewrite achievement-tsx-dialog"
          width={dialogWidth}
          visible={visible}
          title={'收款登记'}
          close-on-click-modal={false}
          onClose={this.emitClose}
        >
          <div class="achievement-container">
            <el-form
              labelWidth={'68px'}
              ref="formRef"
              size="mini"
              attrs={{
                model: this.form,
              }}
              onInput={() => {
                //
              }}
            >
              {!this.businessType.isMcn && (
                <el-form-item label="客户名称：">
                  <el-input value={company_name} disabled={true} />
                </el-form-item>
              )}
              {!this.businessType.isMcn && (
                <el-form-item label="客户经理：">
                  <el-input
                    value={project.customer_manager || project.manager_name}
                    disabled={true}
                  />
                </el-form-item>
              )}
              {this.businessType.isMcn && (
                <el-form-item label="公司名称：">
                  <el-input value={company_name} disabled={true} />
                </el-form-item>
              )}
              <el-form-item
                label="业绩名称："
                prop="achievement_name"
                rules={{ required: true, message: '请输入业绩名称', trigger: 'blur' }}
              >
                <el-input
                  placeholder="请输入业绩名称"
                  value={form.achievement_name}
                  maxLength={15}
                  onInput={(val: any) => (form.achievement_name = val)}
                />
              </el-form-item>
              <el-form-item
                label="收款类型："
                prop="gather_type"
                rules={{ required: true, message: '请输入收款类型', trigger: 'blur' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  style="width:100%"
                  placeholder="请输入收款类型"
                  value={form.gather_type}
                  onInput={(val: any) => (form.gather_type = val)}
                  disabled={this.isFromPrePay}
                >
                  {gatherTypeOptions.map((item, key) => {
                    if (this.isFromPrePay === false && item.label === '预收款') {
                      return '';
                    }
                    return <el-option key={key} label={item.label} value={item.value} />;
                  })}
                </el-select>
              </el-form-item>
              <el-form-item
                class="mgb0"
                label="收款方式："
                rules={{ required: true, message: '请选择收款方式', trigger: 'blur' }}
                style="margin-bottom: 10px"
              >
                <el-radio-group
                  value={this.form.gather_way}
                  onInput={(val: any) => {
                    this.form.gather_way = val;
                  }}
                  on-change={() => {
                    form.revenue_flow_id = undefined;
                    this.form.pay_company_name = '';
                    this.formRef?.clearValidate();
                  }}
                >
                  <el-radio label={3}>对公银行</el-radio>
                  <el-radio label={2}>支付宝</el-radio>
                  {this.businessType.isMarketing === false && this.isFromPrePay === false && (
                    <el-radio label={6}>预收款</el-radio>
                  )}
                  {/*<el-radio label={1}>V任务</el-radio>
                  {this.businessType.isMcn && (
                    <fragments>
                      <el-radio label={4}>阿里妈妈</el-radio>
                      <el-radio label={5}>巨量百应</el-radio>
                    </fragments>
                  )}*/}
                </el-radio-group>
              </el-form-item>
              {this.businessType.isMarketing && (
                <el-form-item
                  class="mgb0"
                  label="登记方式："
                  rules={{ required: true, message: '请选择登记方式', trigger: ['blur', 'change'] }}
                >
                  <el-radio-group
                    value={this.form.register_way}
                    onInput={(val: any) => {
                      this.form.register_way = val;
                    }}
                    on-change={() => {
                      this.formRef?.clearValidate();
                    }}
                  >
                    <el-radio label={1}>手动登记(煜丰账户收款)</el-radio>
                    <el-radio label={2}>认领流水(构美账户收款)</el-radio>
                  </el-radio-group>
                </el-form-item>
              )}
              {this.form.gather_way === 6 && this.businessType.isMarketing === false && (
                <el-form-item
                  class="mgt-16"
                  label="预收记录："
                  prop="revenue_flow_id"
                  rules={{ required: true, message: '请选择预收记录', trigger: 'change' }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    placeholder="请选择预收记录"
                    style="width:100%"
                    v-model={form.revenue_flow_id}
                    on-change={(id: any) => {
                      const finder = flowList.find((el: any) => el.id === id);
                      if (finder?.payer) {
                        this.form.pay_company_name = finder?.payer;
                      }
                    }}
                    remote={true}
                    filterable={true}
                    clearable={true}
                    on-clear={() =>
                      this.search_revenueFlow(this.form.gather_way === 6 ? company_name || '' : '')
                    }
                    remote-method={this.search_revenueFlow}
                  >
                    {flowList.map((item: any) => (
                      <el-option
                        key={item.id}
                        value={item.id}
                        label={` ${item.uid || '--'} ( 预收 ${this.formatAmount(
                          (item.register_amount ?? 0) / 100,
                          'None',
                        )} ，未核销 ${this.formatAmount(
                          (item.un_write_off_amount ?? 0) / 100,
                          'None',
                        )} ) ${item.supplier_company_name || '--'}`}
                      />
                    ))}
                  </el-select>
                </el-form-item>
              )}
              {(this.form.gather_way === 3 || this.form.gather_way === 2) &&
                (this.businessType.isMarketing === false ||
                  (this.businessType.isMarketing && this.form.register_way === 2)) && (
                  <el-form-item
                    class="mgt-16"
                    label="关联流水："
                    prop="revenue_flow_id"
                    rules={{ required: true, message: '请选择关联收入流水', trigger: 'change' }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      placeholder="请选择关联收入流水"
                      style="width:100%"
                      v-model={form.revenue_flow_id}
                      on-change={(id: any) => {
                        const finder = flowList.find((el: any) => el.id === id);
                        if (finder?.payer) {
                          this.form.pay_company_name = finder?.payer;
                        }
                      }}
                      remote={true}
                      filterable={true}
                      clearable={true}
                      on-clear={() =>
                        this.search_revenueFlow(
                          this.form.gather_way === 3 ? company_name || '' : '',
                        )
                      }
                      remote-method={this.search_revenueFlow}
                    >
                      {flowList.map((item: any) => (
                        <el-option
                          key={item.id}
                          value={item.id}
                          label={`${this.revenueDate(item.revenue_date)} ${
                            this.form.gather_way === 3
                              ? item.payer ?? ''
                              : item.payment_account ?? ''
                          }: ${this.formatAmount((item.income ?? 0) / 100, 'None')}元`}
                        />
                      ))}
                    </el-select>
                  </el-form-item>
                )}
              {this.businessType.isMarketing && this.form.register_way === 1 && (
                <div>
                  {/*class="radio-form-item-children">*/}
                  {(this.form.gather_way === 2 || this.businessType.isMarketing) && (
                    <div>
                      <el-form-item
                        label="打款公司："
                        prop="pay_company_name"
                        rules={{ required: true, message: '请输入打款公司', trigger: 'blur' }}
                      >
                        <el-input
                          placeholder="请输入打款公司"
                          value={form.pay_company_name}
                          onInput={(val: any) => (form.pay_company_name = val)}
                        />
                      </el-form-item>
                    </div>
                  )}
                </div>
              )}
              {this.businessType.isMarketing && this.form.register_way === 1 && (
                <el-form-item
                  style="margin-top: 16px;"
                  label="收款金额："
                  prop="gather_amount"
                  rules={[
                    { required: true, message: '请输入收款金额', trigger: 'blur' },
                    { validator: rules.price(), trigger: 'blur' },
                    { validator: rules.number_range(), trigger: 'blur' },
                  ]}
                >
                  <el-input-extend
                    placeholder="请输入收款金额"
                    value={form.gather_amount}
                    maxLength={14}
                    inputType="price"
                    onInput={(val: any) => (form.gather_amount = val)}
                  />
                </el-form-item>
              )}
              <el-form-item label="打款凭证：">
                <div class="upload-operation">
                  <el-upload
                    action="xxx"
                    className="upload-btn-wrap"
                    show-file-list={false}
                    multiple={false}
                    accept=".jpg,.jpeg,.png"
                    http-request={this.uploadAttachmenFile}
                  >
                    <tg-button>上传文件</tg-button>
                  </el-upload>
                  <span class="upload-tips mgl-16">支持扩展名：.jpg .jpeg .png</span>
                </div>
                {this.form.gather_certificate_pic && (
                  <div class="uploaded-list">
                    <div class="upload-item">
                      <img
                        class="attachment-icon"
                        src={require('@/assets/img/live/enclosure.png')}
                      />
                      <span class="attachment-name">{this.form.gather_certificate_pic.name}</span>
                      <img
                        onClick={() => {
                          this.form.gather_certificate_pic = null;
                        }}
                        src={require('@/assets/img/live/close_2.png')}
                        class="clear-uploaded-file"
                      />
                    </div>
                  </div>
                )}
              </el-form-item>
              {this.isLiveDouyin ? (
                <el-form-item
                  label="关联合同："
                  prop="contract_id"
                  rules={{ required: true, message: '请选择供应商合同', trigger: ['change'] }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    // placeholder="请选择供应商合同"
                    placeholder={
                      this.search_contract_list.length === 0 ? '暂无有效合同' : '请选择合同'
                    }
                    style="width:100%"
                    value={form.contract_id}
                    filterable={true}
                    remote={true}
                    onInput={(val: any) => (form.contract_id = val)}
                    // disabled={isDisable_contract_id}
                    remote-method={this.search_contract}
                  >
                    {this.search_contract_list.map((item, key) => (
                      <el-option key={key} value={item.value} label={item.label} />
                    ))}
                  </el-select>
                </el-form-item>
              ) : (
                <el-form-item label="关联合同：" prop="contract_id">
                  <el-select
                    popper-class="el-select-popper-mini"
                    placeholder={
                      this.search_contract_list.length === 0 ? '暂无有效合同' : '请选择关联合同'
                    }
                    style="width:100%"
                    value={form.contract_id}
                    filterable={true}
                    remote={true}
                    clearable={true}
                    onInput={(val: any) => (form.contract_id = val)}
                    remote-method={this.search_contract}
                    // disabled={isDisable_contract_id}
                  >
                    {this.search_contract_list.map((item, key) => (
                      <el-option key={key} value={item.value} label={item.label} />
                    ))}
                  </el-select>
                </el-form-item>
              )}
              <el-form-item
                label="是否开票："
                rules={{ required: true, message: '请选择是否开票', trigger: 'blur' }}
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  style="width:100%"
                  value={form.is_invoice}
                  onInput={(val: any) => (form.is_invoice = val)}
                >
                  <el-option value={1} label="是" />
                  <el-option value={0} label="否" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <template slot="footer">
            <tg-button onClick={this.emitClose}>取消</tg-button>
            <tg-button type="primary" onClick={this.submit}>
              提交
            </tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
