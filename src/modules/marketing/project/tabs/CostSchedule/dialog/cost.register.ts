/*
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 登记成本
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-24 15:38:53
 */

import { defineComponent, ref, watch, inject, Ref, PropType } from '@vue/composition-api';
import { Company, CostInfoParams, MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { KolQuery } from '@/services/live';
import { GetContractUid } from '@/services/contract';
import { queryApprovalList, queryArchievement, updateCost } from '@/services/marketing.project';
import { queryKolCompany, addCostList } from '@/services/marketing.project';
import { Kol } from '@/types/tiange/live';
import { ContractUid } from '@/types/tiange/contract';
import { ElForm } from 'element-ui/types/form';

import { format } from '@/utils/time';
import { deepClone } from '@/utils/tools';

const currentDate = () => {
  const current = new Date();
  return format(current, 'YYYY-mm-dd');
};

interface KOLCompany extends Company {
  disabled?: boolean;
}

interface CostInfoTable extends CostInfoParams {
  live_dates?: string[];
  company_list?: KOLCompany[];
}

const costData = (cost: CostInfoTable | undefined = undefined): CostInfoTable => {
  if (!cost) {
    const curDate = currentDate();
    return {
      cost_id: undefined,
      //** 成本类型，1-关联业绩，2-借款 */
      cost_type: 1,
      //** 合作id */
      cooperation_id: undefined,
      //** 机构id */
      achievement_uid: undefined,
      //**  */
      kol_id: undefined,
      //** 机构id */
      company_id: undefined,
      company_name: undefined,
      //** 打款方式，1-银行卡，2-v任务 3-对公银行，4-对公支付宝 */
      pay_way: 1,
      //** 打款金额（元） */
      pay_amount: undefined,
      //** 打款账户，1-时光机，2-玥每映像 */
      pay_account: 1,
      //** 打款日期，格式为2019-1-11 */
      transfer_date: curDate,
      //** 是否开票，0-否，1-是 */
      is_invoice: undefined,
      //** 税点金额 */
      tax_point: undefined,
      //**  */
      note: undefined,
      //** 是否个人，1-是，2-否 */
      is_personal: 2,
      //**  */
      invoice_certificate_pic: undefined,
      //** 是否有合同,1：有；2：没有 */
      has_contract: 1,
      //** 合同id，has_contract=1时必填 */
      contract_id: undefined,
      //** 业务执行开始时间 */
      live_start_date: curDate,
      //** 业务执行结束时间 */
      live_end_date: curDate,
      //** 借款审批单编号  借款时时必填 */
      borrowing_uid: undefined,
      //** 用款审批单id  借款时时必填 */
      approval_id: undefined,
      //** 合同编号 */
      contract_str: undefined,
      //** 合同附件，用,隔开 */
      // contract_annex: undefined,
      //** v任务信息列表，打款方式为v任务时必填 */
      v_task_list: [
        {
          /** v任务链接 */
          v_task_url: undefined,
          /** 商品链接 */
          item_url: undefined,
        },
      ],
      live_dates: [curDate, curDate],
      company_list: [],
    };
  }

  return deepClone(cost) as CostInfoTable;
  // return Object.create(cost)
  // return JSON.parse(JSON.stringify(cost));
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    editCost: {
      type: Object as PropType<CostInfoParams>,
    },
  },
  setup(props, ctx) {
    /** refs */
    const project =
      inject<Ref<MarketingProjectDetail>>('MarketingProject') ?? ref<MarketingProjectDetail>();

    const form = ref<{ data: CostInfoTable[] }>({ data: [costData()] });
    const ruleForm = ref<ElForm | undefined>(undefined);

    const kolList = ref<Kol[]>([]);
    const contractList = ref<ContractUid[]>([]);
    const achievementList = ref([]);
    const dgyhApprovalList = ref([]);
    const zfbApprovalList = ref([]);
    const borrowApprovalList = ref([]);
    // const companyList = ref([]);

    const saveLoading = ref<boolean>(false);

    /** methods */
    watch([() => props.visible, () => props.editCost], ([newVisiable, newEditCost]) => {
      if (newVisiable) {
        // resetForm();
        // sendGetStudioListRequest();
        getKOL();
        getContractUid();
        getAchievementList();
        getApprovalList(1, undefined, 3);
        getApprovalList(1, undefined, 4);
        if (project?.value) {
          getApprovalList(3, project.value.customer_id);
        }

        if (newEditCost) {
          const cost = newEditCost as CostInfoParams;
          let live_dates = undefined;
          if (cost.live_start_date && cost.live_end_date) {
            live_dates = [cost.live_start_date, cost.live_end_date];
          }
          form.value.data = [{ ...cost, live_dates: live_dates }];
          form.value.data.forEach(item => {
            if (!item.v_task_list || item.v_task_list.length === 0) {
              item.v_task_list = [
                {
                  /** v任务链接 */
                  v_task_url: undefined,
                  /** 商品链接 */
                  item_url: undefined,
                },
              ];
            }
            // 外部传入 cost 对象并没有 company_list 属性，所以需要动态添加以保持响应性
            ctx.root.$set(item, 'company_list', []);
          });
          if (cost.kol_id) {
            getKolComppany(cost.kol_id, 0);
          }
        }
      } else {
        resetForm();
      }
    });
    const close = () => {
      ctx.emit('update:visible', false);
    };

    const save = () => {
      ruleForm.value?.validate((valid: boolean) => {
        if (valid) {
          if (props.editCost) {
            update_Cost();
          } else {
            saveCostList();
          }
        }
      });

      // ctx.emit('update:visible', false);
    };

    const copyCost = (cost: CostInfoTable, index: number) => {
      form.value.data.splice(index + 1, 0, costData(cost));
      ctx.root.$message.success('表单复制成功');
    };

    const deleteCost = (index: number) => {
      form.value.data.splice(index, 1);
    };

    const addCost = () => {
      form.value.data.push(costData());
    };

    const addVTask = (index: number) => {
      form.value.data[index].v_task_list.push({
        /** v任务链接 */
        v_task_url: undefined,
        /** 商品链接 */
        item_url: undefined,
      });
    };

    const delVTask = (index: number, subIndex: number) => {
      form.value.data[index].v_task_list.splice(subIndex, 1);
    };

    const kolChanged = (val: number, index: number) => {
      const cost = form.value.data[index];
      cost.company_list = [];
      // companyList.value = [];
      cost.company_id = undefined;
      cost.company_name = undefined;
      getKolComppany(val, index);
    };

    const payWayChanged = (_: number, index: number) => {
      form.value.data[index].approval_id = undefined;
    };

    const moneyChange = (value: string | number, index: number) => {
      const cost = form.value.data[index];
      let tempValue = `${value}`;
      tempValue = tempValue.replace(/[^\d.]/g, '');
      tempValue = tempValue.replace(/\.{2,}/g, '.');
      tempValue = tempValue.replace(/^\./g, '0.');
      tempValue = tempValue.replace(/^\d*\.\d*\./g, tempValue.substring(0, tempValue.length - 1));
      tempValue = tempValue.replace(/^0[^.]+/g, '0');
      tempValue = tempValue.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');

      cost.pay_amount = tempValue;
    };

    /** send request */
    // 获取主播
    const getKOL = async () => {
      // KOL_QUERY
      const res = await KolQuery();
      kolList.value = res.data.data;
    };

    // 获取合同
    const getContractUid = async () => {
      const res = await GetContractUid({
        partner_type: 2,
        contract_status: 2,
        project_type: 2,
      });
      contractList.value = res.data.data.data;
    };

    // 获取业绩
    const getAchievementList = async () => {
      if (project?.value) {
        const res = await queryArchievement(project.value.cooperation_id);
        achievementList.value = res.data.data.data;
      }
    };

    // 获取已通过的审批单id列表 1: 用款/垫款；3: 借款，此时必传 customer_id
    const getApprovalList = async (
      type: 1 | 3,
      customer_id?: number | string,
      level_three_types?: 3 | 4,
    ) => {
      const res = await queryApprovalList(type, customer_id, level_three_types);
      switch (type) {
        case 1:
          if (level_three_types === 3) {
            dgyhApprovalList.value = res.data.data;
          } else {
            zfbApprovalList.value = res.data.data;
          }
          break;
        case 3:
          borrowApprovalList.value = res.data.data;
          break;
        default:
          break;
      }
    };

    const companyChanged = (val: any, index: number) => {
      const cost = form.value.data[index];
      if (val === '') {
        cost.company_id = undefined;
        cost.company_name = undefined;
      } else {
        const com: any = cost.company_list?.filter((item: any) => item.company_id === val) ?? [];
        if (com.length > 0) {
          cost.company_id = val;
          cost.company_name = com[0].company_name;
        }
      }
    };

    // 返回指定kol的所属机构
    const getKolComppany = async (kol_id: number, forIndex: number, isRefresh?: boolean) => {
      const res = await queryKolCompany(kol_id);
      const cost: CostInfoTable = form.value.data[forIndex];
      cost.company_list = res.data.data ?? [];
      if (cost.company_id && cost.company_name) {
        const filter = cost.company_list?.filter((item: KOLCompany) => {
          return item.company_id === cost.company_id;
        });
        if ((filter?.length ?? 0) === 0) {
          cost.company_list?.push({
            company_id: cost.company_id,
            company_name: cost.company_name,
            disabled: true,
          });
        }
      }
      if (cost.company_list && cost.company_list.length > 0) {
        cost.company_id = cost.company_list[0].company_id;
        cost.company_name = cost.company_list[0].company_name;
      }

      if (isRefresh && res.data.success) {
        ctx.root.$message.success('刷新成功');
      }
    };

    const liveDateChanged = (dates: string[], index: number) => {
      if (dates && dates.length === 2) {
        form.value.data[index].live_start_date = dates[0];
        form.value.data[index].live_end_date = dates[1];
      } else {
        form.value.data[index].live_start_date = undefined;
        form.value.data[index].live_end_date = undefined;
      }
    };

    const goToConbination = (index: number) => {
      const kol_id = form.value.data[index].kol_id;
      if (!kol_id) {
        ctx.root.$message.warning('请先选择kol名称');
        return false;
      }

      let kol_name = undefined;
      kolList.value.forEach((val: Kol) => {
        if (val.kol_id === kol_id) {
          kol_name = val.kol_name;
          return;
        }
      });
      const { href } = ctx.root.$router.resolve({
        path: '/supplier/list',
        query: {
          kol_name: kol_name,
          kol_id: `${kol_id}`,
        },
      });
      window.open(href, '_blank');
    };

    const companyRefresh = (index: number) => {
      const kol_id = form.value.data[index].kol_id;
      if (!kol_id) {
        ctx.root.$message.warning('请先选择kol名称');
        return false;
      }
      getKolComppany(kol_id, index, true);
    };

    const saveCostList = async () => {
      form.value.data.forEach((val: CostInfoTable) => {
        val.cooperation_id = project?.value?.cooperation_id;
      });
      saveLoading.value = true;
      const res = await addCostList(form.value.data);
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '新增成本成功');
        close();
        ctx.emit('save');
      } else {
        ctx.root.$message.error(res.data.message ?? '新增成本失败');
      }
    };

    const update_Cost = async () => {
      form.value.data.forEach((val: CostInfoTable) => {
        val.cooperation_id = project?.value?.cooperation_id;
      });
      saveLoading.value = true;
      const res = await updateCost(form.value.data[0]);
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '更新成本成功');
        close();
        ctx.emit('save');
      } else {
        ctx.root.$message.error(res.data.message ?? '更新成本失败');
      }
    };

    const resetForm = () => {
      form.value = { data: [costData()] };
      kolList.value = [];
      contractList.value = [];
      achievementList.value = [];
      dgyhApprovalList.value = [];
      zfbApprovalList.value = [];
      borrowApprovalList.value = [];
      // companyList.value = [];
      setTimeout(() => {
        ruleForm.value?.clearValidate();
      }, 100);
    };

    // getKOL()
    // getContractUid()
    // getAchievementList()
    // getApprovalList(1)
    // getApprovalList(3)

    return {
      saveLoading,
      project,
      kolList,
      contractList,
      achievementList,
      dgyhApprovalList,
      zfbApprovalList,
      borrowApprovalList,
      // companyList,
      form,
      ruleForm,
      close,
      save,
      kolChanged,
      payWayChanged,
      liveDateChanged,
      companyChanged,
      moneyChange,
      goToConbination,
      companyRefresh,
      copyCost,
      deleteCost,
      addCost,
      addVTask,
      delVTask,
      Error,
      Number,
    };
  },
});
