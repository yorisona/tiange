<template>
  <div>
    <el-dialog
      class="customer-dialog loan-detail-dialog el-dialog-center-rewrite"
      :isAppendToBody="true"
      :visible="visible"
      width="900px"
      :isfooter="true"
      @close="emitClose"
      :close-on-click-modal="false"
      title="付款详情"
    >
      <template>
        <div class="container-max">
          <div class="main">
            <div class="main-middle">
              <el-row :gutter="20" v-if="isFromApproval">
                <el-col :span="8">
                  <div class="from-middle-first">
                    <span class="color-9">付款编号：</span>
                    <span>{{ detailData.uid }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">业务类型：</span>
                    <span>
                      {{ BusinessTypeMap.get(detailData.business_type) }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">供应商：</span>
                    <span class="line-clamp-1">
                      {{ fillEmptyStr(detailData.cost_company_name) }}
                    </span>
                    <span v-if="detailData.business_type === 1"
                      >(KOL：{{ detailData.kol_name }})</span
                    >
                  </div>
                </el-col>
              </el-row>
              <template v-else>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div class="from-middle-first">
                      <span class="color-9">付款编号：</span>
                      <span>{{ detailData.uid }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="color-9">项目编码：</span>
                      <span> {{ detailData.project_uid }} </span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="color-9">项目名称：</span>
                      <span> {{ detailData.project_name }} </span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div>
                      <span class="color-9">业务类型：</span>
                      <span>
                        {{ BusinessTypeMap.get(detailData.business_type) }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div>
                      <span class="color-9">供应商：</span>
                      <span> {{ fillEmptyStr(detailData.cost_company_name) }} </span>
                      <span v-if="detailData.business_type === 1"
                        >(KOL：{{ detailData.kol_name }})</span
                      >
                    </div>
                  </el-col>
                </el-row>
              </template>
              <div class="linediv" />
              <template>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div>
                      <span class="color-9">付款类型：</span>
                      <span v-if="detailData.pay_type === 1">成本</span>
                      <span v-else-if="detailData.pay_type === 2">退款</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="color-9">付款金额：</span>
                      <span> {{ getnomalAmount(detailData.pay_amount) }} </span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="color-9">打款方式：</span>
                      <span v-if="detailData.pay_way === 1">银行卡</span>
                      <span v-else-if="detailData.pay_way === 2">v任务</span>
                      <span v-else-if="detailData.pay_way === 3">对公银行</span>
                      <span v-else-if="detailData.pay_way === 4">支付宝</span>
                      <span v-else>--</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div>
                      <span class="color-9">付款凭证：</span>
                      <span
                        style="color: #2877ff; cursor: pointer"
                        v-if="detailData.pay_certificate_pic"
                        @click="checkoutPaymentBtn(detailData.pay_certificate_pic)"
                      >
                        查看
                      </span>
                      <span v-else>--</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="color-9">票款方式：</span>
                      <span v-if="detailData.pay_invoice_type === 1"> 先票后款</span>
                      <span v-else-if="detailData.pay_invoice_type === 2"> 先款后票 </span>
                      <span v-else>--</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="22">
                    <div>
                      <span class="color-9">付款事由：</span>
                      <span>{{ fillEmptyStr(detailData.pay_reason) }}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="22">
                    <div>
                      <span class="color-9">关联单据：</span>
                      <div>
                        <template v-if="detailData.pay_type === 2">
                          原单号&nbsp;(<span @click="checkoutPaymentApprovalBtn(detailData)">{{
                            detailData.achievement_uid
                          }}</span>
                          ) </template
                        ><template v-else>
                          合同&nbsp;(<span
                            :style="{
                              color: 'var(--theme-color)',
                              cursor: detailData.contract_uid ? 'pointer' : '',
                            }"
                            v-if="detailData.contract_uid"
                            @click="
                              checkoutPaymentcontractBtn(
                                detailData.contract_id,
                                detailData.contract_type,
                              )
                            "
                            >{{ detailData.contract_uid }}</span
                          ><span v-else>&#45;&#45;</span>) &nbsp;&nbsp;&nbsp;&nbsp;
                          <template
                            >用款&nbsp;(<span
                              v-if="detailData.approval_uid"
                              @click="checkoutPaymentApprovalBtn(detailData)"
                            >
                              {{ detailData.approval_uid }} </span
                            ><span v-else>&#45;&#45;</span>) </template
                          >&nbsp;&nbsp;&nbsp;&nbsp;
                          <template
                            >垫款&nbsp;(<span
                              v-if="detailData.borrowing_uid"
                              @click="checkoutPaymentImprestBtn(detailData)"
                              >{{ detailData.borrowing_uid }}</span
                            >
                            <span v-else>&#45;&#45;</span>) </template
                          >&nbsp;&nbsp;&nbsp;&nbsp;
                          <template
                            v-if="
                              JSON.stringify(
                                detailData.associate_cost ? detailData.associate_cost : {},
                              ) !== '{}'
                            "
                            >付款&nbsp;(<el-popover
                              trigger="hover"
                              popper-class="pop-receivable-1"
                              placement="bottom-end"
                            >
                              <div
                                class="pop-receivable-header"
                                style="font-weight: 400; margin-bottom: 10px"
                              >
                                操作人：{{
                                  detailData.associate_cost
                                    ? detailData.associate_cost.operator_username
                                    : ''
                                }}
                                <span
                                  >（{{
                                    detailData.associate_cost
                                      ? detailData.associate_cost.operator_date
                                      : ''
                                  }}）</span
                                >
                              </div>
                              <el-table
                                stripe
                                :data="
                                  detailData.associate_cost ? detailData.associate_cost.costs : []
                                "
                                :header-cell-style="{
                                  height: '40px !important',
                                  padding: '0px !important',
                                  fontSize: '14px',
                                  fontWeight: '400 !important',
                                  fontFamily: 'Helvetica !important',
                                  color: '#3c5269',
                                  border: 'none',
                                }"
                                :cell-style="{
                                  border: 'none',
                                  height: '40px !important',
                                  padding: '0px !important',
                                }"
                              >
                                <el-table-column
                                  style="font-weight: 400"
                                  label="付款ID"
                                  width="104"
                                >
                                  <span
                                    slot="header"
                                    style="
                                      font-weight: 400 !important;
                                      color: var(--text-third-color);
                                      line-height: 40px;
                                      font-size: var(--default-font-size);
                                      margin-left: 12px;
                                    "
                                  >
                                    付款ID
                                  </span>
                                  <span
                                    style="
                                      font-weight: 400 !important;
                                      color: var(--text-color);
                                      line-height: 40px;
                                      font-size: var(--default-font-size);
                                    "
                                    slot-scope="scoped"
                                  >
                                    {{ scoped.row.id }}
                                  </span>
                                </el-table-column>
                                <el-table-column align="right" label="金额" width="128">
                                  <span
                                    slot="header"
                                    style="
                                      font-weight: 400 !important;
                                      color: var(--text-third-color);
                                      line-height: 40px;
                                      font-size: var(--default-font-size);
                                      margin-right: 12px;
                                    "
                                  >
                                    金额
                                  </span>
                                  <span
                                    style="
                                      font-weight: 400 !important;
                                      color: var(--text-color);
                                      line-height: 40px;
                                      font-size: var(--default-font-size);
                                    "
                                    slot-scope="scoped"
                                  >
                                    {{ gettwonomalAmount(scoped.row.amount) }}
                                  </span>
                                </el-table-column>
                              </el-table>
                              <span
                                slot="reference"
                                class="overview"
                                style="color: var(--theme-color); cursor: pointer"
                                >预览</span
                              > </el-popover
                            >)
                          </template>
                        </template>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="23">
                    <div>
                      <span class="color-9">付款账号：</span>
                      <span>
                        {{ fillEmptyStr(detailData.bank_account) }}
                        &nbsp;&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.bank_name) }}
                        &nbsp;&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.bank_no) }}</span
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="23">
                    <div>
                      <span class="color-9">收款账号：</span>
                      <span v-if="detailData.pay_way === 2"
                        >{{ fillEmptyStr(detailData.pay_way_detail.wangwang_name) }}
                        &nbsp;&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.pay_way_detail.v_task_id) }}
                      </span>
                      <span v-else-if="detailData.pay_way === 3">
                        {{ fillEmptyStr(detailData.pay_way_detail.company_name) }}
                        &nbsp;&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.pay_way_detail.bank_of_deposit) }}
                        &nbsp;&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.pay_way_detail.bank_card_number) }}</span
                      >
                      <span v-else>
                        {{ fillEmptyStr(detailData.pay_way_detail.name) }}
                        &nbsp;&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.pay_way_detail.account) }}</span
                      >
                    </div>
                  </el-col>
                </el-row>

                <el-row
                  :gutter="20"
                  v-if="
                    detailData.pay_way === 2 &&
                    detailData.business_type === 1 &&
                    detailData.pay_way_detail[0].v_task_url
                  "
                >
                  <el-col :span="23">
                    <div>
                      <span class="color-9">V任务链接：</span>
                      <a target="_blank" :href="detailData.pay_way_detail[0].v_task_url">
                        {{ detailData.pay_way_detail[0].v_task_url }}
                      </a>
                    </div>
                  </el-col>
                </el-row>

                <el-row
                  :gutter="20"
                  v-if="
                    detailData.pay_way === 2 &&
                    detailData.business_type === 1 &&
                    detailData.pay_way_detail[0].item_url
                  "
                >
                  <el-col :span="23">
                    <div>
                      <span class="color-9">产品链接：</span>
                      <a target="_blank" :href="detailData.pay_way_detail[0].item_url">
                        {{ detailData.pay_way_detail[0].item_url }}
                      </a>
                    </div>
                  </el-col>
                </el-row>
                <div class="linediv" />
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div>
                      <span class="color-9">核销状态：</span>
                      <span
                        v-if="
                          (detailData.business_type === 1 && detailData.new_cost_type === 8) ||
                          (detailData.business_type === 2 && detailData.is_split === 0) ||
                          (detailData.business_type === 3 && detailData.is_split === 0)
                        "
                      >
                        --
                      </span>
                      <template v-else>
                        <span v-if="detailData.write_off_status === 2" class="write-on"
                          >已核销</span
                        >
                        <span v-else-if="detailData.write_off_status === 1" class="write-off"
                          >部分核销</span
                        >
                        <span v-else class="write-off">未核销</span>
                      </template>
                    </div>
                  </el-col>
                </el-row>
                <el-row
                  v-if="detailData.write_off_infos.length > 0"
                  :gutter="20"
                  style="margin-bottom: 20px !important"
                >
                  <el-col style="background-color: #ffffff; width: 30px; height: 20px"> </el-col>
                  <el-col :span="22">
                    <div>
                      <el-table
                        :data="detailData.write_off_infos"
                        border
                        :style="{ height: detailData.write_off_infos.length < 1 ? '100px' : '' }"
                        empty-text="暂无付款记录"
                      >
                        <el-table-column
                          prop="settlement_uid"
                          label="结算单号"
                          min-width="100"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="payable_uid"
                          label="应付单号"
                          min-width="100"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="write_off_amount"
                          label="核销金额 (元)"
                          min-width="80"
                          align="center"
                        >
                          <span slot-scope="scoped">
                            {{ gettwonomalAmount(scoped.row.write_off_amount) }}
                          </span>
                        </el-table-column>
                        <el-table-column
                          prop="write_off_user"
                          label="核销人"
                          min-width="60"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="write_off_time"
                          label="核销时间"
                          min-width="60"
                          align="center"
                        >
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
                <el-row
                  v-else-if="detailData.refund_write_off_infos.length > 0"
                  :gutter="20"
                  style="margin-bottom: 20px !important"
                >
                  <el-col :span="1" style="background-color: #ffffff; width: 30px; height: 20px">
                  </el-col>
                  <el-col :span="22">
                    <div>
                      <el-table
                        :data="detailData.refund_write_off_infos"
                        border
                        :style="{
                          height: detailData.refund_write_off_infos.length < 1 ? '100px' : '',
                        }"
                        empty-text="暂无付款记录"
                      >
                        <el-table-column prop="settlement_uid" label="结算单号" min-width="80">
                        </el-table-column>
                        <el-table-column prop="receivable_uid" label="应收单号" min-width="80">
                        </el-table-column>
                        <el-table-column label="核销金额 (元)" min-width="80">
                          <span slot-scope="scoped">
                            {{ gettwonomalAmount(scoped.row.write_off_amount) }}
                          </span>
                        </el-table-column>
                        <el-table-column prop="write_off_user" label="核销人" min-width="80">
                        </el-table-column>
                        <el-table-column prop="write_off_time" label="核销时间" min-width="80">
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="22">
                    <div>
                      <span class="color-9">备注：</span>
                      <span>{{ fillEmptyStr(detailData.note) }}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div>
                      <span class="color-9">录入人：</span>
                      <span>
                        {{ fillEmptyStr(detailData.add_by_username) }}&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.gmt_create.split(' ')[0].replace(/-/g, '.')) }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="color-9"> 确认人：</span>
                      <span>
                        {{ fillEmptyStr(detailData.confirm_by_name) }}&nbsp;&nbsp;
                        {{ fillEmptyStr(detailData.pay_date.split(' ')[0].replace(/-/g, '.')) }}
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </div>
          </div>
        </div>
      </template>
    </el-dialog>
    <Invoicelist ref="invoicelistRef" />
  </div>
</template>

<script src="./paydetail.tsx"></script>

<style lang="less" scoped>
@import './detail.less';
</style>
