<template>
  <div
    class="settlement-detail"
    :class="!accountDateVisible ? 'settlement-detail-bottom-24' : ''"
    :style="isMCNType ? 'height:610px' : ''"
  >
    <div class="amount">
      <top-card
        :is_cost="false"
        :amount="`${item.total_settle_amount}`"
        :taxed="item.is_include_tax"
        :invoice_type="item.invoice_type"
        :name="item.company_name"
        type="value2"
        :tax_rate_disabled="true"
        :tax_rate="`${item.tax_rate}`"
      ></top-card>
    </div>
    <div class="detail">
      <!-- 淘宝 -->
      <div v-if="isTbdb" class="detail-item server">
        <div class="label">
          <span class="part">服务费</span>
          <span class="formula">服务费 = 单价 + 时长</span>
        </div>
        <div class="amount">
          <i class="amount-bold">{{ formatAmountWithoutPrefix(item.service_amount) }} 元</i>
        </div>
      </div>
      <!-- 淘宝 -->
      <div v-if="isTbdb" class="detail-item commission">
        <div class="label">
          <span class="part">佣金</span>
          <span class="formula">佣金 = 种草金额*(1-退货率)*佣金比例</span>
        </div>
        <div class="amount">
          <div class="p1">共 {{ item.record_count }} 条记录</div>
          <div class="p2" style="font-weight: 400">
            合计种草成交金额&nbsp;<span style="font-weight: 600"
              >{{ formatAmountWithoutPrefix(item.recommend_amount) }} 元</span
            >
          </div>
          <div class="p3">佣金</div>
          <div class="p4">
            = {{ formatAmountWithoutPrefix(item.recommend_amount) }} * (1-{{ item.refund_rate }}%) *
            {{ item.commission_rate }}%
          </div>
          <div class="p5">
            =
            <i class="amount-bold">{{ formatAmountWithoutPrefix(item.commission) }} 元</i>
          </div>
        </div>
      </div>
      <!-- 抖音 -->
      <div
        v-if="isDydb"
        class="detail-item commission"
        :style="{ height: isDydb && isSelf ? '240px' : '220px' }"
      >
        <div class="label" v-if="isSelf">
          <span class="part">收入信息</span>
        </div>
        <div class="label" v-else>
          <span class="part">收入信息</span>
          <!-- <span class="formula">佣金=销售金额*佣金比例</span> -->
        </div>
        <div class="amount">
          <div v-if="item.record_count" class="p1 dydb">共 {{ item.record_count }} 条记录</div>
          <template v-if="item.commission_rate || item.sale_amount">
            <div class="p2" style="font-weight: 400; margin-top: 18px">
              <template v-if="isSelf">合计净销额</template><template v-else>合计销售金额</template
              ><span
                style="
                  margin-left: 4px;
                  color: var(--text-color);
                  font-style: normal;
                  font-weight: 600;
                "
                >{{ formatAmountWithoutPrefix(item.sale_amount) }} 元</span
              >
            </div>
            <div class="p3">佣金</div>
            <div class="p4">
              = {{ formatAmountWithoutPrefix(item.sale_amount) }} * {{ item.commission_rate }}%
            </div>
            <div class="p5">
              =
              <i class="amount-bold">{{ formatAmountWithoutPrefix(item.commission) }} 元</i>
            </div>
          </template>
          <div v-if="item.service_amount" class="p3" style="display: inline-block">服务费</div>
          <div
            v-if="item.service_amount"
            class="amount-bold"
            style="display: inline-block; margin-left: 0; width: 150px"
          >
            &nbsp;{{ formatAmountWithoutPrefix(item.service_amount || 0) }} 元
          </div>
          <div v-if="item.marketing_advertising_amount" class="p3" style="display: inline-block">
            营销/商广
          </div>
          <div
            v-if="item.marketing_advertising_amount"
            class="amount-bold"
            style="display: inline-block; margin-left: 0; width: 150px"
          >
            &nbsp;{{ formatAmountWithoutPrefix(item.marketing_advertising_amount || 0) }} 元
          </div>
        </div>
      </div>
      <!-- 淘宝甄选 -->
      <div v-if="isTbPick" class="detail-item commission" style="height: 220px">
        <div class="label">
          <span class="part">收入信息</span>
        </div>
        <div class="amount">
          <div style="display: flex">
            <div class="p3" style="display: inline-block; width: 60px; text-align: right">佣金</div>
            <div class="p5" style="display: inline-block; margin-left: 8px; margin-top: 18px">
              <i class="amount-bold">{{ formatAmountWithoutPrefix(item.commission) }} 元</i>
            </div>
          </div>
          <div style="display: flex">
            <div
              v-if="isSelf"
              class="p3"
              style="display: inline-block; width: 60px; text-align: right"
            >
              服务费
            </div>
            <div
              v-if="isSelf"
              class="amount-bold"
              style="display: inline-block; margin-left: 4px; margin-top: 18px"
            >
              &nbsp;{{ formatAmountWithoutPrefix(item.service_amount || 0) }} 元
            </div>
          </div>
        </div>
      </div>
      <!-- 创新项目 -->
      <div
        v-if="isMCNType || isNewMarketingType"
        class="detail-item server"
        :class="isMCNDouyinType ? 'douyincpn-width' : ''"
        :style="ItemHeightStyle"
      >
        <div class="label">
          <span class="part">{{ isMCNDouyinType ? '收入信息' : '收入信息' }} </span>
          <!-- 抖音CPS -->
          <!-- <span v-if="item.settlement_type === 5" class="formula"
            >(上传文件中所有收入金额合计)</span
          > -->
          <!-- V任务 -->
          <!-- <span v-if="item.settlement_type === 6" class="formula"
            >(上传文件中所有收入金额按客户合计)</span
          > -->
        </div>
        <div v-if="!isMCNDouyinType && !isMCNTaobaoOtherType && !isNewMarketingType">
          <div style="margin: 18px 18px 12px 18px; height: 18px; line-height: 18px">
            <div style="display: inline-block; color: var(--text-second-color); font-size: 12px">
              收入
            </div>
            <div style="display: inline-block; float: right">
              <i class="amount-bold">{{ formatAmountWithoutPrefix(item.income_amount) }}元</i>
            </div>
          </div>
          <div style="margin: 0 18px; border-bottom: 1px dashed rgba(164, 178, 194, 0.3)"></div>
          <div style="overflow-y: auto; padding: 12px 0 0 18px; height: 235px; font-size: 12px">
            <div style="width: 250px">
              <div v-for="(row, index) in item.excel_data" :key="index">
                <div
                  v-if="['技术服务费', '服务费', '其他费用', '专项服务费'].includes(row.name)"
                  :style="getExcelDataStyle(item, index)"
                >
                  <div style="display: inline-block; color: var(--text-second-color)">
                    {{ row.name }}
                  </div>
                  <div style="display: inline-block; float: right">
                    <span v-if="row.value < 0" style="color: #ec1e1e">{{
                      formatAmountWithoutPrefix(row.value)
                    }}</span>
                    <span v-else style="color: var(--text-color)">{{
                      formatAmountWithoutPrefix(row.value)
                    }}</span>
                  </div>
                </div>
                <div v-else style="margin-bottom: 8px; line-height: 18px; height: 18px">
                  <div style="display: inline-block; width: 142px; color: var(--text-color)">
                    <el-popover
                      placement="top"
                      :open-delay="300"
                      trigger="hover"
                      :content="row.name"
                    >
                      <p class="line-clamp-1" slot="reference">
                        {{ row.name }}
                      </p>
                    </el-popover>
                  </div>
                  <div style="display: inline-block; float: right; color: var(--text-color)">
                    <span v-if="row.value < 0" style="color: #ec1e1e">{{
                      formatAmountWithoutPrefix(row.value)
                    }}</span>
                    <span v-else>{{ formatAmountWithoutPrefix(row.value) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="douyin-cps-detail">
            <template v-if="douyin_cps_amount_info_list.length > 0">
              <div
                v-for="(amount, amountIdx) in douyin_cps_amount_info_list"
                :key="amountIdx"
                class="douyin-cps-amount"
              >
                <p class="amount-label">
                  {{
                    isMCNTaobaoOtherType || isNewMarketingType
                      ? '收入'
                      : amount.type === 10
                      ? 'CPS收入'
                      : amount.type === 11
                      ? '佣金'
                      : amount.type === 12
                      ? '佣金(服务费)'
                      : amount.type === 13
                      ? '技术服务费'
                      : douyin_cps_income_type(amount.type)
                  }}：
                </p>
                <div class="amount-detail">
                  <div class="amount-amount">
                    <p class="amount-fee">
                      {{ amount.amount ? formatAmountWithoutPrefix(amount.amount) + ' 元' : '--' }}
                    </p>
                    <tg-button
                      v-if="amount.type === 1"
                      type="link"
                      class="amount-download"
                      @click="downloadPitFeeDetail"
                      >下载明细</tg-button
                    >
                    <a
                      v-if="amount.file"
                      :href="amount.file + `?Authorization=${getToken()}`"
                      class="amount-download"
                      style="font-size: 14px"
                      >下载明细</a
                    >
                  </div>
                  <p v-if="amount.remark" class="amount-text">{{ amount.remark }}</p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="isDyCps"
        class="detail-item server"
        :class="isMCNDouyinType ? 'douyincpn-width' : ''"
        :style="ItemHeightStyle"
      >
        <div class="label">
          <span class="part">结算详情 </span>
        </div>

        <div>
          <div class="douyin-cps-detail">
            <template v-if="douyin_cps_amount_info_list.length > 0">
              <div v-for="(amount, amountIdx) in douyin_cps_amount_info_list" :key="amountIdx">
                <template v-if="amount.type === 10">
                  <div class="douyin-cps-amount">
                    <p class="amount-label">总GMV：</p>
                    <div class="amount-detail">
                      <div class="amount-amount">
                        <p class="amount-fee">
                          {{
                            amount.total_gmv
                              ? formatAmountWithoutPrefix(amount.total_gmv) + ' 元'
                              : '--'
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="douyin-cps-amount">
                    <p class="amount-label">退货率：</p>
                    <div class="amount-detail">
                      <div class="amount-amount">
                        <p class="amount-fee">
                          {{ amount.refund_rate ? amount.refund_rate + '%' : '--' }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="douyin-cps-amount" v-if="amount.version === 2">
                    <p class="amount-label">预估机构佣金：</p>
                    <div class="amount-detail">
                      <div class="amount-amount">
                        <p class="amount-fee">
                          {{
                            amount.commission_rate
                              ? formatAmountWithoutPrefix(amount.commission_amount) + '元'
                              : '--'
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="douyin-cps-amount" v-else>
                    <p class="amount-label">平均佣金比例：</p>
                    <div class="amount-detail">
                      <div class="amount-amount">
                        <p class="amount-fee">
                          {{ amount.commission_rate ? amount.commission_rate + '%' : '--' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="douyin-cps-amount">
                  <p class="amount-label">
                    {{
                      amount.type === 10
                        ? 'CPS收入'
                        : amount.type === 11
                        ? '佣金'
                        : amount.type === 12
                        ? '佣金(服务费)'
                        : amount.type === 13
                        ? '技术服务费'
                        : douyin_cps_income_type(amount.type)
                    }}：
                  </p>
                  <div class="amount-detail">
                    <div class="amount-amount">
                      <p class="amount-fee">
                        {{
                          amount.amount ? formatAmountWithoutPrefix(amount.amount) + ' 元' : '--'
                        }}
                      </p>
                      <tg-button
                        v-if="amount.type === 1"
                        type="link"
                        class="amount-download"
                        @click="downloadPitFeeDetail"
                        >下载明细</tg-button
                      >
                      <a
                        v-if="amount.file"
                        :href="amount.file + `?Authorization=${getToken()}`"
                        class="amount-download"
                        style="font-size: 14px"
                        >下载明细</a
                      >
                    </div>
                    <p v-if="amount.remark" class="amount-text">{{ amount.remark }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 营销业务 -->
      <div v-if="isOldMarketingType" class="detail-item server">
        <div class="label">
          <span class="part">收入信息</span>
          <!-- <span class="formula">收入 = 实际填写收入</span> -->
        </div>
        <div class="amount">
          服务费&nbsp;<i class="amount-bold"
            >{{ formatAmountWithoutPrefix(item.income_amount) }} 元</i
          >
        </div>
      </div>
      <div class="detail-item manual" :style="ItemHeightStyle">
        <div class="label">
          <span class="part">手工调账</span>
        </div>
        <div class="amount" :style="isMCNType ? 'height:285px' : 'height:178px'">
          <div class="p1">调账 {{ item.adjust_info.length }} 笔</div>
          <div class="p2">
            <span>共</span
            ><span style="margin-left: 4px"
              >{{ formatAmountWithoutPrefix(adjust_info_total) }} 元</span
            >
          </div>
          <div class="row">
            <div v-for="(column, idx) in item.adjust_info" :key="idx" class="manual-item">
              <span>{{ idx + 1 }}.&nbsp;</span>
              <div>
                调整金额：{{ formatAmountWithoutPrefix(column.adjust_amount) }} 元；调整原因：{{
                  column.adjust_reason
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MCN 文件区域 样式 -->
    <div
      v-if="isMCNType && (item.income_file || (item.detail_file && !item.unity_settlement_id))"
      class="mcn-range-recommend"
    >
      <div v-if="fileName(item.income_file)" class="mcn-download-item">
        <span class="label">收入文件：</span>
        <FileItem :showPreview="true" :key="1006" :filepath="item.income_file" :readonly="true" />
      </div>
      <div v-if="fileName(item.detail_file) && !item.unity_settlement_id" class="mcn-download-item">
        <span class="label">结算明细：</span>
        <FileItem :showPreview="true" :key="1005" :filepath="item.detail_file" :readonly="true" />
      </div>
    </div>
    <div
      v-if="
        !isMCNType &&
        (item.income_file ||
          (item.order_file && !item.unity_settlement_id) ||
          (item.live_file && item.cooperation_type === 1) ||
          item.recommend_file)
      "
      class="range-recommend"
    >
      <div v-if="fileName(item.income_file)" class="download-item">
        <span class="label">收入文件：</span>
        <FileItem :showPreview="true" :key="1004" :filepath="item.income_file" :readonly="true" />
      </div>
      <div v-if="fileName(item.order_file) && !item.unity_settlement_id" class="download-item">
        <span class="label">订单文件：</span>
        <FileItem :showPreview="true" :key="1003" :filepath="item.order_file" :readonly="true" />
      </div>
      <div v-if="fileName(item.live_file) && item.cooperation_type === 1" class="download-item">
        <span class="label">时长文件：</span>
        <FileItem :showPreview="true" :key="1001" :filepath="item.live_file" :readonly="true" />
      </div>
      <div v-if="fileName(item.recommend_file)" class="download-item">
        <span class="label">种草文件：</span>
        <FileItem
          :showPreview="true"
          :key="1002"
          :filepath="item.recommend_file"
          :readonly="true"
        />
      </div>
    </div>
    <div class="download">
      <!-- <div v-if="item.settlement_files.length" class="download-item"> -->
      <div class="download-item">
        <span class="label">结算单：</span>
        <div v-if="item.settlement_files.length">
          <div v-for="(column, index) in item.settlement_files" :key="column" class="file-item">
            <FileItem :showPreview="true" :key="index" :filepath="column" :readonly="true" />
          </div>
        </div>
        <div style="color: var(--text-color); padding-bottom: 16px" v-else>--</div>
      </div>
    </div>
    <div
      class="download"
      style="padding-bottom: 16px; margin-top: 0px"
      v-if="!isOldMarketingType && item.is_estimate !== 1"
    >
      <div class="download-item">
        <span class="label">是否盖章：</span>
        <div style="color: var(--text-color); font-size: 12px" v-if="item.seal_type === 2">是</div>
        <div style="color: var(--text-color); font-size: 12px" v-else-if="item.seal_type === 1">
          否
        </div>
        <div style="color: var(--text-color); font-size: 12px" v-else>--</div>
      </div>
    </div>
    <div class="download" style="padding-bottom: 16px; margin-top: 0px">
      <div class="download-item">
        <span class="label">关联合同：</span>
        <div
          class="contract-div"
          v-if="item.contract_id && item.sign_type_name"
          @click="contractClick"
        >
          {{
            item.contract_company_name +
            '  (' +
            item.sign_type_name +
            ')  ' +
            item.coop_start_date +
            '-' +
            item.coop_end_date
          }}
        </div>
        <div style="color: var(--text-color)" v-else>--</div>
      </div>
    </div>
    <div v-if="accountDateVisible" style="padding-bottom: 24px">
      <span style="color: var(--text-second-color); width: 62px; font-size: 12px">账期时间：</span>
      <el-date-picker
        style="width: 210px"
        size="mini"
        v-model="accountDate"
        type="month"
        placeholder="请选择账期时间"
        format="yyyy.MM"
        value-format="yyyy-MM"
        :editable="false"
        :picker-options="pickerOptions"
        @change="onAccountDateChange"
      ></el-date-picker>
    </div>
  </div>
</template>
<script src="./index.ts"></script>

<style lang="less" scoped>
@import './index.less';
.contract-div {
  font-size: 12px;
  display: flex;
  align-items: center;
  color: var(--theme-color);
  width: 520px;
  cursor: pointer;
  &:hover {
    color: var(--theme-color);
  }
}
/deep/.content-label {
  font-size: 14px;
}
/deep/.content-value {
  font-size: 16px;
}
</style>
