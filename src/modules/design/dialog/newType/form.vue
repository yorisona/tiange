<template>
  <div>
    <div class="form-wrapper">
      <el-form
        :rules="orderFormRules"
        :model="orderForm"
        inline
        label-width="70px"
        ref="orderFormRef"
        size="mini"
      >
        <el-form-item label="制作内容：" prop="name" key="name">
          <el-input
            maxlength="20"
            show-word-limit
            style="width: 314px"
            placeholder="请输入制作内容"
            v-model.trim="orderForm.name"
          />
        </el-form-item>
        <el-form-item
          label="项目类型："
          prop="team_id"
          key="team_id"
          style="margin-right: 0 !important"
        >
          <el-select
            popper-class="el-select-popper-mini"
            v-model="orderForm.team_id"
            style="width: 188px"
            placeholder="请选择项目类型"
          >
            <el-option
              v-for="(chance, index) in department_list"
              :label="chance.label"
              :key="index"
              :value="chance.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="字段设置：">
            <el-checkbox-group
              class="order-checkbox-group tg-label-group-mini"
              v-model="orderForm.fields"
              style="width: 560px"
            >
              <el-checkbox
                class="chance-checkbox"
                v-for="chance in setFieldChances"
                :label="chance.id"
                :key="chance.id"
                :value="chance.id"
                >{{ chance.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="交付天数："
            prop="delivery_days"
            key="delivery_days"
            style="margin-right: 12px !important"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="orderForm.delivery_days"
              style="width: 144px"
              placeholder="请选择交付天数"
            >
              <el-option
                v-for="chance in deliveryDaysChances"
                :label="chance"
                :value="chance"
                :key="chance"
              ></el-option>
            </el-select>
          </el-form-item>
          <span style="display: inline-block; line-height: 28px">
            <tg-icon name="ico-weibiaoti-11" style="margin-right: 6px; font-size: 14px" />
            <span style="color: var(--text-third-color); font-size: 12px"
              >交付天数会限制期望交付时间，请谨慎填写</span
            >
          </span>
        </div>
        <div class="addition-div">
          <el-form-item
            label="附加内容："
            key="addition_content"
            label-width="600px"
            style="margin-right: 0 !important; margin-bottom: 0 !important; text-align: left"
          >
            <template #label
              >附加内容：
              <span style="display: inline-block; line-height: 28px">
                <tg-icon name="ico-weibiaoti-11" style="margin-right: 6px; font-size: 14px" />
                <span style="color: var(--text-third-color); font-size: 12px"
                  >选择了附加内容后，会在交付天数上额外增加附加内容需要的时间</span
                >
              </span></template
            >
            <div class="list-wrapper addition">
              <div class="header-box">
                <div class="header-item content-name">内容名称</div>
                <div class="header-item delivery-way days">设计时间 (天)</div>
                <div class="header-item delivery-way">是否必填</div>
                <div class="header-item delivery-delete">操作</div>
              </div>
              <div
                v-for="(item, index) in orderForm.addition_content"
                :key="index"
                class="body-box"
              >
                <div class="body-item content-name">
                  <el-form-item
                    label=""
                    style="margin-right: 0 !important; margin-bottom: 0 !important"
                  >
                    <el-input
                      style="width: 120px"
                      maxlength="10"
                      placeholder="请输入内容名称"
                      v-model.trim="item.name"
                    />
                  </el-form-item>
                </div>
                <div class="body-item delivery-way days">
                  <el-form-item label="" :key="index">
                    <el-select
                      popper-class="el-select-popper-mini"
                      v-model="item.delivery_days"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="chance in deliveryDaysChances"
                        :label="chance"
                        :value="chance"
                        :key="chance"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="body-item delivery-way">
                  <el-form-item label="" :key="index">
                    <el-select
                      popper-class="el-select-popper-mini"
                      filterable
                      v-model="item.is_required"
                      placeholder="请选择"
                      class="content-name-select"
                    >
                      <el-option
                        v-for="chance in deliveryTypeChances"
                        :label="chance.label"
                        :value="chance.value"
                        :key="chance.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="body-item delivery-delete">
                  <tg-icon class="ico-btn" name="ico-btn-delete" @click="onDeleteAddtion(index)" />
                </div>
              </div>
              <div class="body-box add">
                <tg-button icon="ico-btn-add" size="mini" @click="onAddAddtion">新增</tg-button>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="form-footer">
      <tg-button @click="emitClose">取消</tg-button>
      <tg-button type="primary" @click="handleDialogSubmit">确定</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>
<script src="./form.ts" lang="ts"></script>
<style lang="less" scoped>
@import 'form.less';
</style>
