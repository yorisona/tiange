<template>
  <div>
    <div class="form-wrapper">
      <el-form
        :rules="orderFormRules"
        :model="orderForm"
        inline
        label-width="96px"
        ref="orderFormRef"
        size="mini"
      >
        <ButtonGroup
          class="mgb-20"
          gap="0"
          :buttons="department_list"
          v-model="orderForm.department_id"
          :dataFormat="{ value: 'id', label: 'name', subtitle: 'design_types' }"
          labelStyle="font-weight: 400;font-size: 18px;"
          :groupStyle="`display: grid;grid-template-columns: repeat(auto-fill, minmax(284px, 1fr));grid-column-gap: 18px;`"
        />
        <ButtonGroup
          v-if="projectTypeChances.length > 0"
          class="mgb-14"
          :dataFormat="{ value: 'id', label: 'name' }"
          :buttons="projectTypeChances"
          v-model="orderForm.project_type"
        />
        <ButtonGroup
          v-if="additionContentChances.length > 0"
          :dataFormat="{ value: 'id', label: 'name' }"
          :buttons="additionContentChances"
          v-model="orderForm.addition_content"
        />
        <!-- <el-form-item label="项目类型：" style="margin: 0" prop="department_id" key="department_id">
          <el-radio-group
            v-model="orderForm.department_id"
            style="display: inline-flex; width: 650px; flex-wrap: wrap; height: auto"
          >
            <el-radio v-for="opt in department_list" :label="opt.id" :key="opt.id" :value="opt.id"
              >{{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          class="input-item"
          label="制作内容："
          style="margin: 4px 0 4px 0"
          prop="project_type"
          key="project_type"
          v-if="projectTypeChances.length > 0"
        >
          <el-radio-group
            class="order-checkbox-group tg-label-group-mini"
            v-model="orderForm.project_type"
            style="display: inline-flex; width: 650px; flex-wrap: wrap; height: auto"
          >
            <el-radio
              class="chance-checkbox"
              v-for="chance in projectTypeChances"
              :label="chance.id"
              :key="chance.id"
              >{{ chance.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="input-item"
          v-if="additionContentChances.length > 0"
          style="margin: 0"
          label="附加内容："
          key="addition_content"
        >
          <el-checkbox-group
            class="order-checkbox-group tg-label-group-mini"
            v-model="orderForm.addition_content"
            style="display: inline-flex; width: 650px; flex-wrap: wrap; height: auto"
          >
            <el-checkbox
              class="chance-checkbox"
              v-for="chance in additionContentChances"
              :disabled="chance.is_required === 1"
              :label="chance.id"
              :key="chance.id"
              >{{ chance.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item> -->
        <div class="line" />
        <div class="line-deliver" style="margin-top: 20px">
          <div class="line-deliver__left">
            <!-- <div class="first-line"> -->
            <el-form-item
              class="input-item"
              label="项目名称："
              label-width="68px"
              prop="project_name"
              key="project_name"
            >
              <el-input
                style="width: 100%"
                placeholder="请输入项目名称"
                maxlength="40"
                show-word-limit
                v-model.trim="orderForm.project_name"
              />
              <span style="display: inline-block; line-height: 28px; margin-left: 8px">
                <tg-icon name="ico-weibiaoti-11" style="margin-right: 8px; font-size: 14px" />
                <span style="color: var(--text-third-color); font-size: 12px"
                  >贴片需求5080*2146px，其他根据需求填写</span
                >
              </span>
            </el-form-item>
            <el-form-item label-width="68px" class="input-item form-item-details" label="">
              <el-input
                type="textarea"
                rows="9"
                maxlength="500"
                show-word-limit
                placeholder="请输入详细内容"
                v-model="orderForm.remark"
              />
            </el-form-item>
          </div>
          <div>
            <el-form-item class="input-item" label="项目方：" prop="brand_id" key="brand_id">
              <function-select
                style="width: 225px"
                :config="project_select_config"
                placeholder="请输入"
                :clearable="true"
                :defaultValue="brand_id_options"
                v-model.trim="orderForm.brand_id"
              />
            </el-form-item>
            <el-form-item
              v-if="orderForm.select_project_types['项目预算']"
              label="项目预算："
              prop="project_budget"
            >
              <el-input
                @input="getfixPositiveNumber($event, 'project_budget')"
                @blur="blurPositiveNumber($event, 'project_budget')"
                v-model="orderForm.project_budget"
                placeholder="请输入"
                ><span slot="append">元</span>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="orderForm.select_project_types['施工位置']"
              label="施工位置："
              prop="construction_location"
            >
              <function-select
                style="width: 225px"
                :config="construction_location_config"
                placeholder="请输入"
                :clearable="true"
                :defaultValue="brand_id_options"
                v-model.trim="orderForm.construction_location"
              />
            </el-form-item>
            <el-form-item
              label="期望交付时间："
              prop="expect_delivery_time"
              key="expect_delivery_time"
            >
              <el-date-picker
                style="width: 225px"
                default-time="18:00:00"
                v-model="orderForm.expect_delivery_time"
                popper-class="designAndMakeOrders-date-picker"
                type="datetime"
                :picker-options="pickerOptions"
                size="mini"
                placeholder="请选择"
                format="yyyy.MM.dd HH:mm"
                value-format="yyyy-MM-dd HH"
              />
            </el-form-item>
            <div v-if="orderForm.select_project_types['项目内容']">
              <head-lines
                style="margin: 0 4px 10px 4px"
                title="项目内容"
                :titleFont="12"
                titleColor="#19232d"
              />
              <el-form-item class="input-item" label="主标题：" prop="project_content_title">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.project_content_title"
                />
              </el-form-item>
              <el-form-item class="input-item" label="副标题：">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.project_content_second_title"
                />
              </el-form-item>
              <el-form-item class="input-item" label="利益点：">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.project_content_profit_point"
                />
              </el-form-item>
              <el-form-item class="input-item" label="其他内容：">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.project_content_other_content"
                />
              </el-form-item>
            </div>
            <div v-if="orderForm.select_project_types['视觉层级']">
              <head-lines
                style="margin: 0 4px 10px 4px"
                title="视觉层级"
                :titleFont="12"
                titleColor="#19232d"
              />
              <el-form-item label="第一层级：">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.view_first_tier"
                />
              </el-form-item>
              <el-form-item label="第二层级：">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.view_second_tier"
                />
              </el-form-item>
              <el-form-item label="第三层级：">
                <el-input
                  style="width: 668px"
                  placeholder="请输入"
                  maxlength="50"
                  show-word-limit
                  v-model.trim="orderForm.view_third_tier"
                />
              </el-form-item>
            </div>
            <div
              v-if="
                orderForm.select_project_types['色彩偏好'] ||
                orderForm.select_project_types['风格偏好']
              "
              style="margin-bottom: -6px"
            >
              <head-lines
                style="margin: 0 4px 10px 4px"
                title="偏好"
                :titleFont="12"
                titleColor="#19232d"
              />
              <div v-if="orderForm.select_project_types['色彩偏好']">
                <el-form-item label="色彩偏好：">
                  <el-checkbox-group
                    class="order-checkbox-group tg-label-group-mini"
                    v-model="orderForm.color_prefer"
                    style="width: 660px"
                  >
                    <el-checkbox
                      class="chance-checkbox"
                      v-for="chance in colorPreferenceChances"
                      :label="chance.id"
                      :key="chance.id"
                      >{{ chance.name }}</el-checkbox
                    >
                    <div style="display: inline-block">
                      <el-checkbox
                        class="chance-checkbox"
                        label="其他"
                        key="其他"
                        style="margin-right: 2px"
                        >其他</el-checkbox
                      >
                      <el-input
                        :disabled="!(orderForm.color_prefer.indexOf('其他') >= 0)"
                        v-model="orderForm.other_color"
                        class="input-line-text"
                        placeholder="请填写"
                        maxlength="10"
                        show-word-limit
                        style="width: 186px"
                      ></el-input>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div
                v-if="orderForm.select_project_types['风格偏好']"
                :style="{
                  marginTop: orderForm.select_project_types['色彩偏好'] ? '-8px' : '',
                }"
              >
                <el-form-item label="风格偏好：">
                  <el-checkbox-group
                    class="order-checkbox-group tg-label-group-mini"
                    v-model="orderForm.style_prefer"
                    style="width: 660px"
                  >
                    <el-checkbox
                      class="chance-checkbox"
                      v-for="chance in stylePreferenceChances"
                      :label="chance.id"
                      :key="chance.id"
                      >{{ chance.name }}</el-checkbox
                    >
                    <div style="display: inline-block">
                      <el-checkbox
                        class="chance-checkbox"
                        label="其他"
                        key="其他"
                        style="margin-right: 2px"
                        >其他</el-checkbox
                      >
                      <el-input
                        :disabled="!(orderForm.style_prefer.indexOf('其他') >= 0)"
                        v-model="orderForm.other_style"
                        class="input-line-text"
                        placeholder="请填写"
                        maxlength="10"
                        show-word-limit
                        style="width: 186px"
                      ></el-input>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
            <div class="replenish">
              <el-form-item
                v-if="
                  orderForm.select_project_types['物料/设备尺寸'] ||
                  orderForm.select_project_types['物料尺寸']
                "
                label="物料尺寸："
                prop="size"
                style="margin-bottom: 24px !important"
                ><el-input
                  style="width: 306px"
                  placeholder="请输入"
                  maxlength="20"
                  show-word-limit
                  v-model.trim="orderForm.size"
                />
                <span style="display: inline-block; line-height: 28px; margin-left: 8px">
                  <tg-icon name="ico-weibiaoti-11" style="margin-right: 8px; font-size: 14px" />
                  <span style="color: #888888; font-size: 12px"
                    >贴片需求5080*2146px，其他根据需求填写</span
                  >
                </span>
              </el-form-item>
              <el-form-item v-if="orderForm.project_type !== null">
                <div style="margin-top: -13px">
                  <span>
                    <tg-icon
                      name="ico-common-shuoming-areality"
                      style="color: #287ff2; margin-right: 4px; font-size: 14px; margin-left: 6px"
                    />
                    <span style="color: #888888; font-size: 12px"
                      >预计
                      <span style="color: #19232d">{{ need_days }}</span>
                      工作日交付，以项目分配时间为准</span
                    >
                  </span>
                </div>
              </el-form-item>
              <div class="line-box">
                <el-form-item label="附件内容：">
                  <div>
                    <!--                      <el-upload
                        action
                        class="upload-btn-wrap"
                        :show-file-list="false"
                        :multiple="false"
                        :http-request="event => uploadAttachmentFile(event, item)"
                        accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.xlsx"
                      >
                        <tg-button icon="ico-btn-upload">上传文件</tg-button>
                      </el-upload>
                      <span class="file-tips">单个文件大小不超过100M</span>-->
                    <opinion-upload
                      prompt="不超过500MB"
                      :canIUpload="true"
                      @change="(type, file) => changeUpload(type, file)"
                      v-model="orderForm.references"
                    />
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="form-footer">
      <tg-button @click="emitClose">取消</tg-button>
      <tg-button @click="handleDialogSubmit(true)">保存</tg-button>
      <tg-button type="primary" @click="handleDialogSubmit">确定</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>
<script src="./form.ts" lang="ts"></script>
<style lang="less">
.designAndMakeOrders-date-picker {
  .el-time-spinner {
    display: flex;
    justify-content: center;
  }
  .el-time-spinner__item {
    &:hover {
      background: none !important;
    }
  }
  .el-time-panel {
    width: 147px;
    .el-time-spinner {
      .el-scrollbar {
        &:nth-child(2) {
          display: none;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import './form.less';
</style>
