<!--
 * @Brief: 营销业务-项目管理 详情 指定AE 弹窗
 * @Author: wuyou
 * @Date: 2021-04-14 16:52:34
-->
<template>
  <div class="tg-marketing-project-ae-dialog tg-dialog-vcenter">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="440px"
      class="tg-dialog-classic tg-marketing-project-aeplus-form-dialog"
      @close="onCloseBtnClick"
    >
      <template #title>指定AE</template>
      <div class="form-content">
        <el-form label-position="top" size="mini" label-width="106px">
          <div class="form-item" v-for="(item, index) in ProjectAeForm.ae_infos" :key="index">
            <div
              v-if="ProjectAeForm.ae_infos.length > 1"
              class="form-item-remove-btn"
              @click="removeItemHandler(index)"
            >
              <tg-icon
                slot="icon"
                name="ico-frm-delete"
                hover-name="ico-frm-delete-active"
                style="font-size: 16px; cursor: pointer"
              />
            </div>
            <el-form-item label="AE名称" class="two-item-left">
              <el-select
                filterable
                placeholder="请选择AE"
                v-model="item.ae_id"
                remote
                reserve-keyword
                clearable
                :remote-method="getAllAeList"
              >
                <el-option
                  v-for="(ae, ae_index) in AeUserList"
                  :disabled="NotExistsAeIdList.includes(item.id)"
                  :key="ae_index"
                  :label="ae.username"
                  :value="ae.id"
                >
                  <span>{{ ae.username }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计跟单金额" class="two-item-right">
              <el-input
                placeholder="请输入跟单金额"
                v-model="item.expect_amount"
                maxlength="20"
                @input="value => inputPositiveNumber(value, index)"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="flex-none" style="padding: 0 24px 24px 24px">
          <tg-ghost-button @click="addItemHandler" style="width: 392px">
            <a>点击添加</a>
          </tg-ghost-button>
        </div>
      </div>
      <template #footer>
        <tg-button @click="onCloseBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./form.ts"></script>

<style lang="less">
@import './form.less';
</style>
