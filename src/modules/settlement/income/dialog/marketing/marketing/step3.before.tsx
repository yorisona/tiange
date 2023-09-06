import { computed, defineComponent, h, inject, Ref, ref } from '@vue/composition-api';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep3Layout from '@/modules/settlement/component/step2.layout';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { Settlement } from '@/types/tiange/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetSubIncomeSettlement } from '@/services/finance/settlement';
import { formatAmount } from '@/utils/string';

export default defineComponent({
  components: {
    TopCard,
    CardLayout,
    SettlementStep3Layout,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const company_info = computed(() => settlement.value?.company_info_json ?? []);
    // const company_info = computed(() => {
    //   return [
    //     {
    //       company_name: 'xxx有限公司',
    //       adjust_info: [
    //         {
    //           adjust_amount: 2342,
    //           adjust_reason: '个人给我二哥恶搞我人格为',
    //         },
    //       ],
    //     },
    //     {
    //       company_name: 'xxx有限公司',
    //       adjust_info: [
    //         {
    //           adjust_amount: 2342,
    //           adjust_reason: '个人给我二哥恶搞我人格为',
    //         },
    //       ],
    //     },
    //   ];
    // });
    const methods = {
      prev: async () => {
        ctx.emit('prev');
      },

      next: async () => {
        const result = await AsyncConfirm(ctx, {
          title: '确定生成结算单吗?',
          content: () =>
            h('div', [h('div', '将对本次结算生成对应的结算单'), h('div', '是否需要生成？')]),
          confirmText: '确定',
          cancelText: '取消',
        });
        if (!result) {
          return;
        }
        methods.getSubCostSettlement();
      },
      saveBeforeClose: async () => {
        return false;
      },
      confirmBeforeClose: async () => {
        return false;
      },
      //  发送 生成结算单 请求
      getSubCostSettlement: async () => {
        if (!settlement.value?.id) {
          return;
        }
        saveLoading.value = true;
        const res = await GetSubIncomeSettlement({ settlement_id: settlement.value?.id });
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '生成结算单成功');
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error(res.data.message ?? '生成结算单失败');
        }
      },
      formatAmount,
    };
    return {
      saveLoading,
      settlement,
      company_info,
      ...methods,
    };
  },
  render() {
    return (
      <SettlementStep3Layout
        class="settlement-step3-mcn-taobao-other-before"
        topHeightType="default"
        leftItemWidth={600}
      >
        <top-card
          slot="top"
          is_cost={false}
          amount={`${this.settlement?.total_settle_amount}`}
          type="default"
        ></top-card>
        <div slot="left" class="before-customer-list">
          {this.company_info.map((el, elIdx) => {
            return (
              <div class="before-customer" key={elIdx}>
                {elIdx > 0 && <div class="hr"></div>}
                <div class="before-customer-name" style="margin-bottom: 4px">
                  {el.company_name}
                </div>
                {el.amount_info_list.map(info => {
                  return (
                    <div class="before-income-row mgt-12">
                      <div class="before-income-row-detail">
                        <span class="label">收入：</span>
                        <span class="value">{this.formatAmount(info.amount || 0, 'None')} 元</span>
                      </div>
                      <div class="other-desc">{info.remark}</div>
                    </div>
                  );
                })}
                {(el.adjust_info?.length || 0) > 0 && (
                  <div class="before-adjust-info mgt-12">
                    {el.adjust_info.map((info, infoIdx) => {
                      return (
                        <div key={infoIdx}>
                          <div class="mgt-12">
                            <span class="label">手工调账：</span>
                            <span class="value">
                              {this.formatAmount(info.adjust_amount, 'None')} 元
                            </span>
                          </div>
                          <div class="other-desc">{info.adjust_reason}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!this.$props.readonly && (
          <fragments slot="button">
            <tg-button on-click={this.prev}>上一步</tg-button>
            <tg-button type="primary" on-click={this.next}>
              生成结算单
            </tg-button>
          </fragments>
        )}
        <tg-mask-loading
          slot="mask"
          visible={this.saveLoading}
          content="正在生成结算单，请稍候..."
        />
      </SettlementStep3Layout>
    );
  },
});
