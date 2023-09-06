<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="434px"
      title="目标规则设置"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div class="dialog-container">
        <el-form ref="formRef" :model="form" label-width="42px" size="small" hide-required-asterisk>
          <div class="title">目标截止时间</div>
          <div class="form-line" :key="key" v-for="(item, key) in form.rules">
            <el-form-item
              :label="`${item.season_cn}：`"
              :prop="`rules.${key}.year`"
              :rules="{ required: true, message: '请选择年度', trigger: ['blur'] }"
            >
              <el-select
                placeholder="请选择年度"
                v-model="item.year"
                style="width: 120px"
                @change="item.date = null"
              >
                <el-option label="本年度" :value="1" />
                <el-option label="次年" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="6px"
              :prop="`rules.${key}.date`"
              :rules="[{ required: true, message: '请选择日期', trigger: ['blur'] }]"
            >
              <el-date-picker
                type="date"
                placeholder="选择日期"
                format="M月d日"
                style="width: 216px"
                v-model="item.date"
                :disabled="item.year === null"
                :picker-options="{
                  disabledDate: val => disabledDate(item.year, val),
                }"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onClose">取消</tg-button>
        <tg-button type="primary" @click="onSave">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>
<script src="./targetRule.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 23px 24px 13px 24px;

  .el-form {
    .title {
      display: grid;
      grid-template-columns: 3px 1fr;
      grid-column-gap: 7px;

      &:before {
        content: ' ';
        display: block;
        width: 3px;
        height: 14px;
        align-self: center;
        background-color: var(--theme-color);
      }

      margin-bottom: 23px;
    }

    .form-line {
      display: flex;
    }
  }
}
</style>
