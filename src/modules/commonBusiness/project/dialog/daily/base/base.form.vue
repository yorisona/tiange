<!--
 * @Brief: 通用业务->项目管理->项目详情->日报数据 基地业务弹框
 * @Author: 棠棣
 * @Date: 2021-05-18 10:49
-->
<template>
  <div class="tg-common-business-base-form-dialog tg-dialog-vcenter">
    <el-dialog
      class="tg-dialog-classic"
      width="440px"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      @close="onCloseBtnClick"
    >
      <template #title>{{ title }}</template>
      <div class="dialog-content">
        <el-form ref="formRef" label-position="top" size="small" label-width="106px">
          <div class="tg-dialog-section-title"><span></span>直播数据</div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="直播时长">
              <el-input
                maxlength="8"
                v-model.trim="baseForm.live_duration"
                @input="value => inputAmount('live_duration', value)"
                placeholder="0.00"
              >
                <template slot="append">小时</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="直播增粉数">
              <el-input
                maxlength="12"
                v-model.trim="baseForm.new_fans_count"
                @input="value => inputInteger('new_fans_count', value)"
                placeholder="0"
              >
                <template slot="append">人</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="同时最高在线人数">
              <el-input
                maxlength="12"
                v-model.trim="baseForm.max_uv"
                @input="value => inputInteger('max_uv', value)"
                placeholder="0"
              >
                <template slot="append">人</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="用户停留时长">
              <el-input
                maxlength="8"
                v-model.trim="baseForm.avg_stay"
                @input="value => inputInteger('avg_stay', value)"
                placeholder="0"
              >
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="tg-dialog-section-title"><span></span>销售数据</div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="GMV">
              <el-input
                maxlength="18"
                v-model.trim="baseForm.gmv"
                @input="value => inputAmount('gmv', value)"
                placeholder="0.00"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="净销比例">
              <el-input
                maxlength="10"
                v-model.trim="baseForm.net_sales_rate"
                @input="value => inputAmount('net_sales_rate', value)"
                placeholder="0.00"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="预估当日净销额">
              <el-input maxlength="18" disabled :value="net_sales_amount" placeholder="- -">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="tg-dialog-section-title"><span></span>投放数据</div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="投放金额">
              <el-input
                maxlength="18"
                v-model.trim="baseForm.promote_amount"
                @input="value => inputAmount('promote_amount', value)"
                placeholder="0.00"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="定向投放ROI（倍数）">
              <el-input
                maxlength="18"
                v-model.trim="baseForm.roi"
                @input="value => inputAmount('roi', value)"
                placeholder="0.00"
              >
                <template slot="append">倍</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="tg-dialog-section-title"><span></span>收入数据</div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="佣金比例">
              <el-input
                maxlength="10"
                v-model.trim="baseForm.commission_rate"
                @input="value => inputAmount('commission_rate', value)"
                placeholder="0.00"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="预估当日佣金">
              <el-input maxlength="18" disabled :value="commission_amount" placeholder="- -">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="每日到账金额">
              <el-input
                maxlength="18"
                v-model.trim="baseForm.income_amount"
                @input="value => inputAmount('income_amount', value)"
                placeholder="0.00"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer style="height: 50px">
        <tg-button size="small" @click="onCloseBtnClick">取消</tg-button>
        <tg-button size="small" type="primary" @click="onSaveBtnClick">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>
<script src="./base.form.ts"></script>
<style lang="less">
@import './base.form.less';
.el-input.is-disabled .el-input__inner {
  color: var(--text-color);
}
</style>
