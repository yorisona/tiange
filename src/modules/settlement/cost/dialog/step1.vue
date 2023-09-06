<template>
  <div class="settlement-cost-basic-info">
    <div class="settlement-cost-basic-info-content">
      <el-form size="mini" v-if="!settlement && is_estimate_mode !== 1" style="padding-top: 20px">
        <el-form-item label="结算方式：">
          <el-radio-group v-model="Step1Frm.settlement_way">
            <el-radio
              v-for="opt in [
                { label: '普通结算', value: '1' },
                { label: '替换暂估结算', value: '2' },
              ]"
              :label="opt.value"
              :key="opt.value"
              >{{ opt.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="Step1Frm.settlement_way === '1'" label="收入结算：" class="text-item">
          <span
            >请选择对应的收入结算（如果没有可选择的收入结算，请先发起对应的收入结算并填写结算数据保存）</span
          >
        </el-form-item>
        <el-form-item v-if="Step1Frm.settlement_way === '2'" label="成本结算：" class="text-item">
          <span v-if="Step1Frm.settlement_way === '2'"
            >被替换的暂估结算如未确认会被删除，如已确认会被冲销</span
          ></el-form-item
        >
        <!--        <el-form-item label="替换方式：" v-if="Step1Frm.settlement_way === '2'">
          <el-radio-group v-model="settlement_replace_way">
            <el-radio :label="0">替换结算周期</el-radio>
            <el-radio :label="1">替换结算单</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <div class="top" v-else>
        <span class="big-tips">{{ topText }}</span
        ><span class="tips mgl-12">{{ tips }}</span>
      </div>
      <el-table
        v-if="Step1Frm.settlement_way === '1'"
        stripe
        :data="data"
        @row-click="onRowClick"
        :height="460"
        :style="`width: ${table_width}px`"
        v-loading="loading"
      >
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <template #empty>
          <empty-common
            img-height="100"
            img-width="150"
            detail-text="请先创建收入结算，再进行成本结算"
          ></empty-common>
        </template>
      </el-table>
      <!-- 替换暂估 选择区 -->
      <div v-if="Step1Frm.settlement_way === '2'">
        <div
          v-if="settlement_replace_way === 0 && ReplaceSettlementDateList.length === 0"
          style="width: 235px; margin: 0 auto; margin-top: 60px"
        >
          <empty-common img-height="100" img-width="150" detail-text="暂无结算周期"></empty-common>
        </div>
        <div
          v-if="settlement_replace_way === 1 && ReplaceIdsSettlementDateList.length === 0"
          style="width: 235px; margin: 0 auto; margin-top: 60px"
        >
          <empty-common
            img-height="100"
            img-width="150"
            detail-text="暂无暂估结算单"
          ></empty-common>
        </div>
        <div v-else style="margin: 0 78px" v-loading="loading">
          <el-radio-group v-model="replace_settlement_date_str" class="settlement_estimate">
            <template
              v-for="opt in settlement_replace_way === 0
                ? ReplaceSettlementDateList
                : ReplaceIdsSettlementDateList"
            >
              <el-radio
                v-if="opt.settlement_type !== SettlementType.s2b2c_douyin_cps"
                :label="opt.value"
                :key="opt.value"
                style="height: 35px; line-height: 35px; padding-right: 73px; display: block"
                >{{ opt.label }}</el-radio
              >
            </template>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="bottom-button-line">
      <tg-button @click="prev">取消</tg-button>
      <tg-button type="primary" @click="next" :disabled="data.length === 0">下一步</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./step1.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.settlement-cost-basic-info {
  .settlement-cost-basic-info-content {
    .pd(0 24px);
    .settlement_estimate {
      display: block;
      max-height: 350px;
      overflow-y: scroll;
      .el-radio__input {
        margin-top: -3px;
      }
    }
    .el-form-item__label {
      padding-right: 0;
      line-height: 18px;
      height: 18px;
    }
    .el-form .el-form-item--mini .el-form-item__content {
      .el-radio-group {
        height: 18px !important;
        line-height: 18px !important;
      }
      .el-radio,
      .el-radio__label,
      .el-radio__input {
        height: 18px !important;
        line-height: 18px !important;
      }
    }

    .el-radio {
      padding-top: 0;
    }

    .el-form-item__content {
      line-height: 18px;
    }
  }

  .top {
    height: 60px;
    display: flex;
    align-items: center;

    .big-tips {
      width: 140px;
      height: 14px;
      font-size: 12px;
      color: var(--text-color);
      line-height: 14px;
    }

    .tips {
      width: 396px;
      height: 12px;
      font-size: 12px;
      color: var(--text-third-color);
      line-height: 12px;
    }
  }

  > .step1-frm {
    width: 312px;
    justify-self: center;

    .el-form-item__label {
      .fc(14px, var(--text-second-color));
      font-weight: 400;
      padding-right: 0;
    }

    .static-content {
      width: 276px;
      .fc(12px, var(--text-color));
      letter-spacing: 0;
      font-weight: 400;
      .pdl(12px);
    }
  }

  .el-radio__label {
    padding-right: 25px;
  }
}
.settlement-tab {
  .settlement-cost-basic-info {
    .el-table {
      tbody > tr > td {
        // padding: 2px 0px !important;
      }

      .el-radio__label {
        display: none;
      }

      &::before {
        height: 0;
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  margin-bottom: 12px;
  margin-top: 0px;
  .el-form-item__content {
    font-size: 12px;
    color: var(--text-third-color);
  }
}
/deep/.el-radio__input + .el-radio__label {
  font-weight: 400;
  color: var(--text-color) !important;
}
</style>
