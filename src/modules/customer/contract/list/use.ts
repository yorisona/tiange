import { ref, SetupContext } from '@vue/composition-api';
import { GetContractListByType } from '@/services/contract';
import { Contract } from '@/types/tiange/contract';
import { Decimal2String } from '@/utils/string';
import Decimal from 'decimal.js';
import { RouterNameProjectManage, RouterLegal } from '@/const/router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { useRouter } from '@/use/vue-router';
import { useExternal } from '@/router/routeGuard';

export default {
  /** 2为淘宝，6为抖音，5为供应链，4为本地生活 ，1为整合营销，3为创新业务 */
  useContract(type: any, ctx: SetupContext) {
    const { externalQuery } = useExternal();
    const data = ref<Contract[]>([]);
    let lastQuery: any;
    const loading = ref<boolean>(false);
    const query = (params: any) => {
      loading.value = true;
      setTimeout(() => {
        GetContractListByType(params, type).then((res: any) => {
          data.value = res.data.data.data.map((item: any) => {
            const template_info = item.template_info;
            if (template_info) {
              const pay_condition = template_info.pay_condition;
              if (pay_condition) {
                pay_condition.filter((subItem: any) => {
                  if (subItem.key === '收费类型') {
                    item.getMoneytype = subItem.value;
                    item.contractMoney = '';
                    item.contractCommission = '';
                    item.contractOtherMoney = '';
                    if (!subItem.value) {
                      item.getMoneytype = '其它';
                    }
                  }
                  if (item.getMoneytype === '纯佣金') {
                    if (subItem.key === '佣金') {
                      item.contractCommission = subItem.value ? subItem.value + '%' : '';
                    }
                    if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                      const value = subItem.value ? subItem.value + '%(构美)' : '';
                      item.contractCommission = value;
                    }
                    if (subItem.key === '主播佣金') {
                      const value = subItem.value ? subItem.value + '%(主播)' : '';
                      item.contractCommission = item.contractCommission
                        ? value + '+' + item.contractCommission
                        : value;
                    }
                  }
                  if (
                    item.getMoneytype === '服务费+佣金' ||
                    item.getMoneytype === '固定服务费+佣金'
                  ) {
                    item.getMoneytype = '服务费+佣金';
                    if (subItem.key === '固定服务费') {
                      item.contractMoney =
                        subItem.value || Number(subItem.value) === 0
                          ? '￥' + Decimal2String(new Decimal(subItem.value))
                          : '';
                    }
                    if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                      const value = subItem.value ? subItem.value + '%(构美)' : '';
                      item.contractCommission = value;
                    }
                    if (subItem.key === '主播佣金') {
                      const value = subItem.value ? subItem.value + '%(主播)' : '';
                      item.contractCommission = item.contractCommission
                        ? value + '+' + item.contractCommission
                        : value;
                    }
                    if (subItem.key === '佣金') {
                      const value = subItem.value ? subItem.value + '%' : '';
                      item.contractCommission = value;
                    }
                  }
                  if (item.getMoneytype === '固定服务费') {
                    if (subItem.key === '固定服务费') {
                      item.contractMoney =
                        subItem.value || Number(subItem.value) === 0
                          ? '￥' + Decimal2String(new Decimal(subItem.value))
                          : '';
                    }
                  }
                  if (item.getMoneytype === '其它') {
                    if (subItem.key === '其它') {
                      item.contractOtherMoney = '--';
                    }
                  }
                });
              } else {
                const contract_info = item.contract_info;
                if (contract_info.contract_type === 7) {
                  const cooperation_content = template_info.cooperation_content;
                  if (cooperation_content) {
                    cooperation_content.filter((subItem: any) => {
                      if (subItem.key === '计算方式') {
                        const computeWayRecords = [
                          { value: 1, label: '小时服务费' },
                          { value: 9, label: '保底服务费' },
                          { value: 4, label: '小时服务费或提点' },
                          { value: 2, label: '保底服务费或提点' },
                          { value: 5, label: '小时服务费或阶梯式提点' },
                          { value: 6, label: '保底服务费或阶梯式提点' },
                          { value: 7, label: '保底服务费A或保底服务费B+提点' },
                          { value: 8, label: '小时服务费或保底服务费+提点' },
                        ];
                        const index = subItem.value;
                        let str = '--';
                        computeWayRecords.map((item: any) => {
                          if (String(item.value) === String(index)) {
                            str = item.label;
                          }
                        });
                        item.getMoneytype = str || '--';
                        item.contractOtherMoney = '--';
                      }
                      if (item.getMoneytype === '保底服务费') {
                        if (subItem.key === '保底服务费') {
                          item.contractOtherMoney =
                            subItem.value || Number(subItem.value) === 0
                              ? '￥' + Decimal2String(new Decimal(subItem.value))
                              : '';
                        }
                      }
                      if (item.getMoneytype === '小时服务费') {
                        if (subItem.key === '小时服务费') {
                          item.contractOtherMoney =
                            subItem.value || Number(subItem.value) === 0
                              ? '￥' + Decimal2String(new Decimal(subItem.value)) + '元/小时'
                              : '';
                        }
                      }
                    });
                  }
                } else {
                  item.getMoneytype = '--';
                  item.contractOtherMoney =
                    item.contract_detail.contract_amount ||
                    item.contract_detail.contract_amount === 0
                      ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
                      : '--';
                }
              }
            } else {
              item.getMoneytype = '--';
              item.contractOtherMoney =
                item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
                  ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
                  : '--';
            }
            return item;
          });
          // setTimeout(() => {
          loading.value = false;
          // }, 500);
        });
      }, 500);
      lastQuery = params;
    };
    const reload = () => {
      query(lastQuery);
    };
    const contractClick = (
      contract_id: number,
      asExternal = false,
      project_id?: number | string | undefined,
    ) => {
      const tempQuery = asExternal ? externalQuery : {};
      if (!contract_id) {
        return;
      }
      const {
        isFromMarketing,
        isFromLive,
        isFromLocalLife,
        isFromSupplyChain,
        isFromCommon,
        isFromLiveDouyin,
      } = useProjectBaseInfo();
      const payload: any = { id: contract_id };
      GetContractListByType(payload, type, asExternal).then((res: any) => {
        data.value = res.data.data.data;
        if (data.value.length > 0) {
          const contract_info = data.value[0].contract_info;
          const template_info = data.value[0].template_info;
          const router = useRouter();
          if (
            contract_info.contract_type === 1 ||
            contract_info.contract_type === 2 ||
            contract_info.contract_type === 5
          ) {
            // 客户合同
            const detailTemplate = isFromLiveDouyin.value
              ? RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate
              : isFromMarketing.value || type === '1'
              ? RouterNameProjectManage.marketing.contract.customer.detailTemplate
              : isFromLive.value || type === '2'
              ? RouterNameProjectManage.live.contract.customer.detailTemplate
              : isFromCommon.value || type === '3'
              ? RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate
              : isFromLocalLife.value || type === '4'
              ? RouterNameProjectManage.localLife.contract.customer.detailTemplate
              : isFromSupplyChain.value || type === '5'
              ? RouterNameProjectManage.supplyChain.contract.customer.detailTemplate
              : isFromLiveDouyin.value || type === '6'
              ? RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate
              : RouterLegal.contracts.customer.detailTemplate;
            const detail = isFromLiveDouyin.value
              ? RouterNameProjectManage.tiktokLive.contract.customer.detail
              : isFromMarketing.value || type === '1'
              ? RouterNameProjectManage.marketing.contract.customer.detail
              : isFromLive.value || type === '2'
              ? RouterNameProjectManage.live.contract.customer.detail
              : isFromCommon.value || type === '3'
              ? RouterNameProjectManage.commonBusiness.contract.customer.detail
              : isFromLocalLife.value || type === '4'
              ? RouterNameProjectManage.localLife.contract.customer.detail
              : isFromSupplyChain.value || type === '5'
              ? RouterNameProjectManage.supplyChain.contract.customer.detail
              : isFromLiveDouyin.value || type === '6'
              ? RouterNameProjectManage.tiktokLive.contract.customer.detail
              : RouterLegal.contracts.customer.detail;
            const parent_tab = type === '1' ? 'settlement_income' : 'income';
            const routeUrl = ctx.root.$router.resolve({
              name: template_info ? detailTemplate : detail,
              params: {
                id: `${contract_info.id}`,
                project_id:
                  router?.currentRoute.params.id || String(contract_info.project_id || project_id),
              },
              query: {
                contract_type: String(contract_info.contract_type),
                parent_id:
                  router?.currentRoute.params.id || String(contract_info.project_id || project_id),
                parent_tab: router?.currentRoute.params.tab || parent_tab,
                ...tempQuery,
              },
            });
            //       根据name获取path
            window.open(routeUrl.href, '_blank');
          } else if (
            contract_info.contract_type === 3 ||
            contract_info.contract_type === 4 ||
            contract_info.contract_type === 6
          ) {
            // 供应商合同
            const detailTemplate = isFromLiveDouyin.value
              ? RouterNameProjectManage.tiktokLive.contract.supplier.detailTemplate
              : isFromMarketing.value || type === '1'
              ? RouterNameProjectManage.marketing.contract.supplier.detailTemplate
              : isFromLive.value || type === '2'
              ? RouterNameProjectManage.live.contract.supplier.detailTemplate
              : isFromCommon.value || type === '3'
              ? RouterNameProjectManage.commonBusiness.contract.supplier.detailTemplate
              : isFromLocalLife.value || type === '4'
              ? RouterNameProjectManage.localLife.contract.supplier.detailTemplate
              : isFromSupplyChain.value || type === '5'
              ? RouterNameProjectManage.supplyChain.contract.supplier.detailTemplate
              : isFromLiveDouyin.value || type === '6'
              ? RouterNameProjectManage.tiktokLive.contract.supplier.detailTemplate
              : RouterLegal.contracts.supplier.detailTemplate;
            const detail = isFromLiveDouyin.value
              ? RouterNameProjectManage.tiktokLive.contract.supplier.detail
              : isFromMarketing.value || type === '1'
              ? RouterNameProjectManage.marketing.contract.supplier.detail
              : isFromLive.value || type === '2'
              ? RouterNameProjectManage.live.contract.supplier.detail
              : isFromCommon.value || type === '3'
              ? RouterNameProjectManage.commonBusiness.contract.supplier.detail
              : isFromLocalLife.value || type === '4'
              ? RouterNameProjectManage.localLife.contract.supplier.detail
              : isFromSupplyChain.value || type === '5'
              ? RouterNameProjectManage.supplyChain.contract.supplier.detail
              : RouterLegal.contracts.supplier.detail;
            const parent_tab = type === '1' ? 'settlement_cost' : 'cost';
            const routeUrl = ctx.root.$router.resolve({
              name: template_info ? detailTemplate : detail,
              params: {
                id: `${contract_info.id}`,
                project_id:
                  router?.currentRoute.params.id || String(contract_info.project_id || project_id),
              },
              query: {
                contract_type: String(contract_info.contract_type),
                parent_id:
                  router?.currentRoute.params.id || String(contract_info.project_id || project_id),
                parent_tab: router?.currentRoute.params.tab || parent_tab,
                ...tempQuery,
              },
            });
            //       根据name获取path
            window.open(routeUrl.href, '_blank');
          } else {
            // 主播
            const detailTemplate = isFromLiveDouyin.value
              ? RouterNameProjectManage.tiktokLive.contract.anchor.detailTemplate
              : isFromMarketing.value || type === '1'
              ? RouterNameProjectManage.marketing.contract.anchor.detailTemplate
              : isFromLive.value || type === '2'
              ? RouterNameProjectManage.live.contract.anchor.detailTemplate
              : isFromCommon.value || type === '3'
              ? RouterNameProjectManage.commonBusiness.contract.anchor.detailTemplate
              : isFromLocalLife.value || type === '4'
              ? RouterNameProjectManage.localLife.contract.anchor.detailTemplate
              : isFromSupplyChain.value || type === '5'
              ? RouterNameProjectManage.supplyChain.contract.anchor.detailTemplate
              : isFromLiveDouyin.value || type === '6'
              ? RouterNameProjectManage.tiktokLive.contract.anchor.detailTemplate
              : RouterLegal.contracts.anchor.detailTemplate;
            const routeUrl = ctx.root.$router.resolve({
              name: detailTemplate,
              params: {
                id: `${contract_info.id}`,
                project_id:
                  router?.currentRoute.params.id || String(contract_info.project_id || project_id),
              },
              query: {
                contract_type: String(contract_info.contract_type),
                parent_id:
                  router?.currentRoute.params.id || String(contract_info.project_id || project_id),
                parent_tab: router?.currentRoute.params.tab,
                ...tempQuery,
              },
            });
            //       根据name获取path
            window.open(routeUrl.href, '_blank');
          }
        }
      });
    };
    return {
      loading,
      data,
      query,
      reload,
      contractClick, //点击合同跳转
    };
  },
};
