<!--
 * @Brief: 抖音cps/团长服务费喝星图收入
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:33:38
-->
<template>
  <div class="tg-income-settlement-component-settlement-detail-douyin-cps">
    <div class="douyin-cps-content">
      <div class="customer">{{ company_name }}：</div>
      <div class="income">
        <span class="label">收入：</span>
        <span class="value">{{ `${formatAmountWithoutPrefix(dataForm.income_amount)} 元` }}</span>
      </div>
    </div>
    <div class="douyin-cps-bottom">
      <el-tooltip
        :disabled="dataForm.file ? true : false"
        content="上传数据后支持下载"
        placement="top"
        effect="light"
      >
        <tg-button
          :disabled="dataForm.file ? false : true"
          type="link"
          style="font-size: 14px"
          @click="downloadDataFile(dataForm.file)"
          >下载原始数据</tg-button
        >
      </el-tooltip>
      <span class="hor-line"></span>
      <el-upload
        v-model="dataForm.file"
        action="/"
        :multiple="false"
        :show-file-list="false"
        :http-request="uploadFileHandler"
      >
        <tg-button type="link" style="font-size: 14px">上传</tg-button>
      </el-upload>
      <span class="hor-line"></span>
      <tg-button @click="downTempFile" type="link" style="font-size: 14px">下载模板</tg-button>
      <!-- <tg-button :href="templateFileUrl()" download type="link">下载模板</tg-button> -->
    </div>
    <tg-mask-loading :visible="uploadLoading" content="正在上传，请稍候..." />
  </div>
</template>

<script src="./douyin.income.ts"></script>

<style lang="less">
.tg-income-settlement-component-settlement-detail-douyin-cps {
  .douyin-cps-content {
    padding: 16px 12px 6px;
    .customer {
      color: var(--text-second-color);
    }
    .income {
      margin-top: 18px;
      .label {
        color: var(--text-second-color);
      }
      .value {
        font-weight: 600;
        color: var(--text-color);
      }
    }
  }
  .douyin-cps-bottom {
    justify-content: center;
    height: 64px;
    display: flex;
    align-items: center;
    margin-left: 12px;
    padding-bottom: 6px;
    .hor-line {
      display: inline-block;
      margin: 0 12px;
      width: 1px;
      height: 10px;
      border-left: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
    }
  }
}
</style>
