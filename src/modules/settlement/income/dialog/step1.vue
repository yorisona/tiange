<template>
  <div class="settlement-basic-info">
    <el-form
      class="step1-frm"
      :model="step1Frm"
      size="mini"
      :rules="step1FrmRules"
      label-width="90px"
      ref="step1FrmRef"
    >
      <el-form-item
        v-if="!settlement && step1Frm.is_estimate === 0"
        label="结算方式："
        prop="settlement_way"
      >
        <el-select
          popper-class="el-select-popper-mini"
          v-model="step1Frm.settlement_way"
          style="width: 276px"
        >
          <el-option value="1" label="普通结算" />
          <el-option value="2" label="替换暂估结算" />
        </el-select>
        <div
          v-if="step1Frm.settlement_way === '2'"
          style="
            width: 420px;
            height: 16px;
            line-height: 24px;
            font-size: 12px;
            color: var(--text-third-color);
          "
        >
          <tg-icon name="ico-warn" style="font-size: 14px" />
          被替换的暂估结算如未确认会被删除，如已确认会被冲销
        </div>
      </el-form-item>
      <!-- 替换暂估结算 选择周期 -->
      <div v-if="step1Frm.settlement_way === '2'">
        <!--        <el-form-item label="替换方式：" prop="settlement_replace_way">
          <el-radio-group v-model="settlement_replace_way">
            <el-radio :label="0">替换结算周期</el-radio>
            <el-radio :label="1">替换结算单</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item
          :label="settlement_replace_way === 1 ? '暂估结算单：' : '结算周期：'"
          prop="settlement_replace_id"
        >
          <el-select
            popper-class="el-select-popper-mini"
            v-model="settlement_replace_id"
            style="width: 276px"
          >
            <template
              v-for="(opt, optIndex) in settlement_replace_way === 1
                ? SettlementIdsReplaceDateOptions
                : SettlementReplaceDateOptions"
            >
              <el-option
                v-if="opt.settlement_type !== SettlementType.s2b2c_douyin_cps"
                :value="opt.value"
                :label="opt.label"
                :key="optIndex"
              />
            </template>
          </el-select>
        </el-form-item>
      </div>
      <!-- 普通结算 -->
      <div v-if="step1Frm.settlement_way === '1'">
        <el-form-item class="text-item" label="项目名称：">
          <div class="static-content">{{ project_name }}</div>
        </el-form-item>
        <el-form-item label="结算类型：" prop="settlement_type">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="step1Frm.settlement_type"
            style="width: 276px"
            :disabled="
              isFromLive ||
              isFromLiveDouyin ||
              isFromLocalLife ||
              isFromSupplyChain ||
              mcn_platform_type === 1 ||
              (mcn_platform_type === 2 &&
                (settlement ? !settlement.is_tmp : false) &&
                step1Frm.settlement_type === 9)
            "
            @change="onSettlementTypeChange"
          >
            <el-option
              v-for="(opt, optIndex) in typeOptions"
              :value="opt.value"
              :label="opt.label"
              :key="optIndex"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="公司："
          v-if="
            mcn_platform_type !== 1 &&
            (step1Frm.settlement_type === SettlementType.common_mcn_taobao_cps ||
              step1Frm.settlement_type === SettlementType.common_mcn_vtask)
          "
        >
          <div class="static-content">
            {{ isFromCommon ? '阿里巴巴网络科技有限公司' : project.company_name || '--' }}
          </div>
        </el-form-item>
        <!-- <el-form-item
          label="店铺："
          v-if="
            mcn_platform_type !== 1 &&
            (step1Frm.settlement_type === SettlementType.common_mcn_taobao_cps ||
              step1Frm.settlement_type === SettlementType.common_mcn_vtask)
          "
        >
          <div class="static-content">
            {{ isFromCommon ? '阿里巴巴网络有限公司' : project.shop_name || '--' }}
          </div>
        </el-form-item> -->
        <el-form-item
          v-if="
            (isFromLive || isFromLiveDouyin || isFromLocalLife || isFromSupplyChain) &&
            (step1Frm.settlement_type === SettlementType.live_douyin ||
              step1Frm.settlement_type === SettlementType.local_life ||
              step1Frm.settlement_type === SettlementType.supply_chain) &&
            !isAreaCost
          "
          label="结算周期："
          prop="dateMonth"
        >
          <el-date-picker
            :editable="false"
            :disabled="mcn_platform_type === 1 && (settlement ? !settlement.is_tmp : false)"
            v-model="step1Frm.dateMonth"
            type="month"
            style="width: 276px"
            format="yyyy.MM"
            value-format="yyyy-MM"
            placeholder="选择结算周期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-else label="结算周期：" prop="date">
          <el-date-picker
            v-model="step1Frm.date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy.MM.dd"
            style="width: 276px"
            :editable="false"
            :disabled="
              (mcn_platform_type === 1 && (settlement ? !settlement.is_tmp : false)) ||
              (mcn_platform_type === 2 &&
                (settlement ? !settlement.is_tmp : false) &&
                step1Frm.settlement_type === 9)
            "
            :picker-options="pickerOptions"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="bottom-button-line">
      <tg-button @click="prev">取消</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./step1.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.settlement-basic-info {
  height: 530px;
  .pdt(18px);
  > .step1-frm {
    width: auto;
    justify-self: center;
    height: 510px;
    .static-content {
      width: auto;
      .fc(12px, var(--text-color));
      letter-spacing: 0;
      font-weight: 400;
    }
  }
}
</style>
