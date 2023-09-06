<!--
 * @Brief: 通用业务->项目管理->项目详情->日报数据 mcn业务弹框
 * @Author: 棠棣
 * @Date: 2021-05-18 10:49
-->
<template>
  <div class="tg-common-business-mcn-form-dialog tg-dialog-vcenter">
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
          <div class="line-box">
            <el-form-item class="mgb-18" label="GMV">
              <el-input
                maxlength="18"
                v-model.trim="mcnForm.gmv"
                @input="value => inputAmount('gmv', value)"
                placeholder="0.00"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="运营费用">
              <el-input
                maxlength="18"
                v-model.trim="mcnForm.operating_amount"
                @input="value => inputAmount('operating_amount', value)"
                placeholder="0.00"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="直播场次">
              <el-input
                maxlength="8"
                v-model.trim="mcnForm.live_count"
                @input="value => inputInteger('live_count', value)"
                placeholder="0"
              >
                <template slot="append">场</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mgb-18" label="开播时长">
              <el-input
                maxlength="8"
                v-model.trim="mcnForm.live_duration"
                @input="value => inputAmount('live_duration', value)"
                placeholder="0.00"
              >
                <template slot="append">小时</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="开播主播数">
              <el-input
                maxlength="8"
                v-model.trim="mcnForm.anchor_count"
                @input="value => inputInteger('anchor_count', value)"
                placeholder="0"
              >
                <template slot="append">人次</template>
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
<script src="./mcn.form.ts"></script>
<style lang="less">
@import './mcn.form.less';
</style>
