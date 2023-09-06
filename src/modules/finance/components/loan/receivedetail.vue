<template>
  <el-dialog
    class="customer-dialog loan-detail-dialog el-dialog-center-rewrite"
    :isAppendToBody="true"
    :visible="visible"
    width="900px"
    :isfooter="true"
    @close="emitClose"
    :close-on-click-modal="false"
    title="收款详情"
  >
    <template>
      <div class="container-max">
        <div class="main">
          <div class="main-middle">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="from-middle-first">
                  <span class="color-9">收款编号：</span>
                  <span>{{ detailData.achievement_uid }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <span class="color-9">业绩名称：</span>
                  <span> {{ detailData.achievement_name }} </span>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <span class="color-9">项目编码：</span>
                  <span> {{ detailData.project_uid }} </span>
                </div>
              </el-col>
            </el-row>
            <!-- [收款方式: 3--对公银行] -->
            <template>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">项目名称：</span>
                    <span> {{ detailData.project_name }} </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">客户经理：</span>
                    <span> {{ detailData.manager }} </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">业务类型：</span>
                    <span>
                      {{ BusinessTypeMap.get(Number(detailData.business_type_str || 5)) }}
                    </span>
                  </div>
                </el-col>
              </el-row>
              <div class="linediv" />
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">客户公司：</span>
                    <span> {{ fillEmptyStr(detailData.customer_info.company_name) }} </span>
                  </div>
                </el-col>
                <!-- <el-col :span="8">
                  <div>
                    <span class="color-9"> 客户店铺：</span>
                    <span> {{ fillEmptyStr(detailData.customer_info.shop_name) }} </span>
                  </div>
                </el-col> -->
                <el-col :span="8">
                  <div>
                    <span class="color-9">品牌：</span>
                    <span> {{ fillEmptyStr(detailData.customer_info.brand_name) }} </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">收款类型：</span>
                    <span v-if="detailData.gather_type === 1">服务费</span>
                    <span v-else-if="detailData.gather_type === 2">佣金</span>
                    <span v-else-if="detailData.gather_type === 3">其他</span>
                    <span v-else-if="detailData.gather_type === 4" class="reverse-red">冲销</span>
                    <span v-else-if="detailData.gather_type === 5">退款</span>
                    <span v-else-if="detailData.gather_type === 6">预收款</span>
                    <span v-else>--</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">收款金额：</span>
                    <span> {{ detailData.gather_amount_str }} 元</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">打款方式：</span>
                    <span> {{ receiveType(detailData.gather_way) }} </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">收款凭证：</span>
                    <span
                      style="color: #2877ff; cursor: pointer"
                      v-if="detailData.gather_certificate_pic"
                      @click="checkoutPaymentBtn(detailData.gather_certificate_pic)"
                    >
                      查看
                    </span>
                    <span v-else>--</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">发票信息：</span>
                    <span
                      style="color: #2877ff; cursor: pointer"
                      v-if="detailData.invoice_info.length >= 1"
                      @click="openinvoicefinance(detailData.invoice_info)"
                    >
                      查看
                    </span>
                    <span v-else>--</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="22">
                  <div>
                    <span class="color-9">关联单据：</span>
                    <p>
                      <template v-if="detailData.gather_type === 5">
                        原单号&nbsp;(<span @click="checkoutreceiveApprovalBtn(detailData)">{{
                          detailData.refund_cost_id
                        }}</span
                        >)</template
                      ><template v-else>
                        合同&nbsp;(<span
                          :style="{
                            color: 'var(--theme-color)',
                            cursor: detailData.contract_uid ? 'pointer' : '',
                          }"
                          v-if="detailData.contract_uid"
                          @click="
                            checkoutreceivecontractBtn(
                              detailData.contract_id,
                              detailData.contract_type,
                            )
                          "
                          >{{ detailData.contract_uid }}</span
                        ><span v-else>&#45;&#45;</span>)
                        &nbsp;&nbsp;&nbsp;&nbsp;开票审批&nbsp;(<span
                          v-if="detailData.approval_uid"
                          @click="checkoutreceiveApprovalBtn(detailData)"
                          >{{ detailData.approval_uid }}</span
                        ><span v-else>&#45;&#45;</span>)</template
                      >
                    </p>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="23">
                  <div>
                    <span class="color-9">收款账号：</span>
                    <span v-if="detailData.gather_way === 3">
                      {{ fillEmptyStr(detailData.gather_confirm_detail.pay_company_name) }}
                      &nbsp;&nbsp;&nbsp;
                      {{ fillEmptyStr(detailData.gather_confirm_detail.bank_of_deposit) }}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {{ fillEmptyStr(detailData.gather_confirm_detail.account) }}</span
                    >
                    <span v-else-if="detailData.gather_way === 2">
                      {{ fillEmptyStr(detailData.gather_confirm_detail.pay_company_name) }}
                      &nbsp;&nbsp;&nbsp;
                      {{ fillEmptyStr(detailData.gather_confirm_detail.account) }}</span
                    >
                    <span v-else>
                      {{ fillEmptyStr(detailData.gather_confirm_detail.pay_company_name) }}</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="23">
                  <div>
                    <span class="color-9">付款账号：</span>
                    <span v-if="detailData.gather_way === 1">{{
                      fillEmptyStr(detailData.gather_way_detail.order_wangwang_id)
                    }}</span>
                    <span v-else>
                      {{ fillEmptyStr(detailData.gather_way_detail.pay_company_name) }}</span
                    >
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
                        detailData.gather_type === 5
                          ? detailData.refund_write_off_status === 2
                          : detailData.write_off_status === 2
                      "
                      class="write-on"
                    >
                      已核销
                    </span>
                    <span
                      v-else-if="
                        detailData.gather_type === 5
                          ? detailData.refund_write_off_status === 1
                          : detailData.write_off_status === 1
                      "
                      class="write-off"
                    >
                      部分核销
                    </span>
                    <span v-else class="write-off">未核销</span>
                  </div>
                </el-col>
              </el-row>
              <el-row
                v-if="detailData.write_off_infos.length > 0"
                :gutter="20"
                style="margin-bottom: 20px !important"
              >
                <el-col :span="1" style="background-color: #ffffff; width: 30px; height: 20px">
                </el-col>
                <el-col :span="22">
                  <div>
                    <el-table
                      :data="detailData.write_off_infos"
                      border
                      :style="{
                        height: detailData.write_off_infos.length < 1 ? '100px' : '',
                      }"
                      empty-text="暂无收款记录"
                    >
                      <el-table-column
                        prop="settlement_uid"
                        label="结算单号"
                        min-width="80"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="receivable_uid"
                        label="应收单号"
                        min-width="80"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column label="核销金额 (元)" min-width="80" align="center">
                        <span slot-scope="scoped">
                          {{ gettwonomalAmount(scoped.row.write_off_amount) }}
                        </span>
                      </el-table-column>
                      <el-table-column
                        prop="write_off_user"
                        label="核销人"
                        min-width="80"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="write_off_time"
                        label="核销时间"
                        min-width="80"
                        align="center"
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">录入人：</span>
                    <span>
                      {{ fillEmptyStr(detailData.add_by) }}&nbsp;&nbsp;{{
                        fillEmptyStr(detailData.registration_time)
                      }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9"> 确认人：</span>
                    <span>
                      {{ fillEmptyStr(detailData.gather_confirm_by_name) }}&nbsp;&nbsp;
                      {{ detailData.gather_date.split(' ')[0].replace(/-/g, '.') }}
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
</template>

<script src="./receivedetail.tsx"></script>

<style lang="less" scoped>
@import './detail.less';
</style>
