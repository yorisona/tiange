<template>
  <Step2Layout class="settlement-step2-shoplive" :amount="total_amount_str">
    <template #left>
      <CardLayout
        v-loading="fill_form_loading"
        class="settlement-left-block"
        :element-loading-text="loadingKolText"
        element-loading-background="rgba(0, 0, 0, 0.25)"
      >
        <template #title>主播工资</template>
        <template #desc>
          <div style="cursor: pointer; line-height: 14px; height: 14px; margin-left: -6px">
            <el-popover
              :offset="130"
              popper-class="kol-tips-popper"
              placement="bottom"
              trigger="hover"
            >
              <div>
                <div style="color: var(--text-color); font-weight: 600">时薪工资</div>
                <div style="color: #6a7b92">主播工资 = 单价 * 时长</div>
                <div style="color: var(--text-color); font-weight: 600">底薪/提成（取高的）</div>
                <div style="color: #6a7b92">主播工资 = 底薪和（净销额）*提成比例取高的</div>
                <div style="color: var(--text-color); font-weight: 600">底薪+提成</div>
                <div style="color: #6a7b92">主播工资 = 底薪 + （净销额）*提成比例</div>
              </div>
              <template slot="reference">
                <tg-icon style="font-size: 14px" name="ico-question"></tg-icon>
              </template>
            </el-popover>
          </div>
        </template>
        <div class="AnchorListBlock" ref="root">
          <el-form
            ref="formRef"
            :model="DataForm"
            @submit.native.prevent
            size="small"
            label-width="68px"
          >
            <div v-if="DataForm.kol_salary_infos.length === 0">
              <div style="margin-top: 62px" class="tg-page-empty">
                <empty-common detail-text="暂无数据，请先完善主播排班信息"></empty-common>
              </div>
            </div>
            <div
              v-for="(item, index) in DataForm.kol_salary_infos"
              :key="index"
              ref="target"
              style="height: 195px"
              :data-index="index"
              :data-visible="CanItemShow(index)"
              :data-preview="CanItemPreview(index)"
            >
              <template v-if="CanItemShow(index)">
                <div class="OneItem" :style="index > 0 ? 'margin-top: 18px' : ''">
                  <div style="height: 32px; line-height: 32px">
                    <div style="display: inline-block">
                      <div class="label" style="width: 64px">主播</div>
                      <span style="font-weight: 600">{{ item.kol_name }}</span>
                    </div>
                    <div style="display: inline-block; float: right; padding-right: 18px">
                      <tg-button
                        type="link"
                        @click="downloadKolScheduleFile(schedule_file_list[index].url)"
                        >下载<span style="color: #a4b2c2">排班信息</span></tg-button
                      >
                    </div>
                  </div>
                  <div style="margin-top: 12px; height: 32px; line-height: 32px">
                    <div class="label" style="width: 64px">结算方式</div>
                    <el-select
                      v-model="item.salary_type"
                      class="select"
                      placeholder=""
                      size="small"
                      style="width: 164px"
                    >
                      <el-option
                        v-for="(option, idx) in SettlementTypeOptions"
                        :key="idx"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </div>
                  <div
                    v-if="item.salary_type === 1"
                    style="margin-top: 18px; height: 32px; line-height: 32px; display: flex"
                  >
                    <div class="shoplive-form-item">
                      <div class="label" style="width: 64px">
                        <span style="color: #ec1e1e">*</span>开播时长
                      </div>
                      <el-form-item
                        :rules="formRules.live_duration"
                        :prop="`kol_salary_infos[${index}].live_duration`"
                      >
                        <el-input
                          @input="value => LiveDurationInput(value, index)"
                          v-model="item.live_duration"
                          style="width: 164px"
                          size="small"
                          placeholder="0.0"
                          maxlength="6"
                        >
                          <template #append>小时</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="shoplive-form-item">
                      <div class="label" style="width: 64px">
                        <span style="color: #ec1e1e">*</span>单价
                      </div>
                      <el-form-item
                        :rules="formRules.unit_price"
                        :prop="`kol_salary_infos[${index}].unit_price`"
                      >
                        <el-input
                          @input="value => UnitPriceInput(value, index)"
                          v-model="item.unit_price"
                          style="width: 164px"
                          size="small"
                          placeholder="0.00"
                          maxlength="13"
                        >
                          <template #append>时/元</template>
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div
                    v-if="item.salary_type !== 1"
                    style="margin-top: 18px; height: 32px; line-height: 32px; display: flex"
                  >
                    <div class="shoplive-form-item">
                      <div class="label" style="width: 64px">
                        <span style="color: #ec1e1e">*</span>底薪
                      </div>
                      <el-form-item
                        :rules="formRules.base_salary"
                        :prop="`kol_salary_infos[${index}].base_salary`"
                      >
                        <el-input
                          @input="value => BaseSalaryInput(value, index)"
                          v-model="item.base_salary"
                          style="width: 164px"
                          size="small"
                          placeholder="0.00"
                          maxlength="13"
                        >
                          <template #append>元</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="shoplive-form-item">
                      <div class="label" style="width: 60px">
                        <span style="color: #ec1e1e">*</span>净销额
                      </div>
                      <el-form-item
                        :rules="formRules.sale_amount"
                        :prop="`kol_salary_infos[${index}].sale_amount`"
                      >
                        <el-input
                          @input="value => SaleAmountInput(value, index)"
                          v-model="item.sale_amount"
                          style="width: 164px"
                          size="small"
                          placeholder="0.00"
                          maxlength="13"
                        >
                          <template #append>元</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="shoplive-form-item">
                      <div class="label" style="width: 72px">
                        <span style="color: #ec1e1e">*</span>提成比例
                      </div>
                      <el-form-item
                        :rules="formRules.commission_rate"
                        :prop="`kol_salary_infos[${index}].commission_rate`"
                      >
                        <el-input
                          @input="value => CommissionRateInput(value, index)"
                          v-model="item.commission_rate"
                          style="width: 100px"
                          size="small"
                          placeholder="0.00"
                          maxlength="13"
                        >
                          <template #append>%</template>
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div
                    style="display: inline-block; margin-top: 18px; height: 32px; line-height: 32px"
                  >
                    <div class="label" style="width: 64px">工资</div>
                    <span style="font-weight: 600">{{ ComputedKolData[index].salary_str }}</span>
                  </div>
                </div>
                <div
                  v-if="
                    index + 1 < DataForm.kol_salary_infos.length &&
                    DataForm.kol_salary_infos.length !== 0
                  "
                  style="border-top: 1px dashed rgba(164, 178, 194, 0.3); margin: 0 18px 18px 0"
                ></div>
              </template>
              <template v-else>
                <div class="one-item-skeleton-screen">
                  <div
                    class="skeleton-screen-item"
                    :class="item.class"
                    v-for="(item, itemIndex) in skeletonItems"
                    :key="itemIndex"
                  >
                    <div class="skeleton-screen-item-label"></div>
                    <div class="skeleton-screen-item-content"></div>
                  </div>
                </div>
              </template>
            </div>
          </el-form>
        </div>
      </CardLayout>
    </template>

    <template #right>
      <div>
        <el-form @submit.native.prevent size="small" label-width="68px">
          <TgAdjustAccountForm
            v-if="ShowAdjustInfo"
            :adjust_info="DataForm.adjust_info"
            ExtendItem="anchor"
            :ExtendItemSelectOptions="KolSelectOptions"
            @dataChange="onAdjustAccountDataChange"
          />
        </el-form>
      </div>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </Step2Layout>
</template>

<script src="./step2.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.settlement-step2-shoplive {
  .AnchorListBlock {
    margin-top: 0px;
    height: 372px;
  }

  .settlement-left-block {
    overflow-y: auto;
  }

  .shoplive-form-item {
    display: flex;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .el-input-group__append {
    padding: 0 12px;
    text-align: center;
  }

  .OneItem {
    padding: 0 0 18px 0;

    .label {
      color: var(--text-second-color);
      font-size: 14px;
      width: fit-content;
      margin-right: 12px;
      text-align: right;
      display: inline-block;
    }
  }

  // 骨架屏
  .one-item-skeleton-screen {
    display: grid;
    grid-template-areas:
      'a1 . .'
      'b1 . .'
      'c1 c2 c3'
      'd1 . .';
    row-gap: 12px;
    column-gap: 4px;
    .pd(18px 0);
    border-top: 1px dashed rgba(164, 178, 194, 0.3);
    > .skeleton-screen-item {
      height: 32px;
      display: flex;
      @color1: fade(#6a7b92, 20);
      @color2: fade(#6a7b92, 10);
      > .skeleton-screen-item-label {
        height: 18px;
        .mgr(12px);
        background-image: linear-gradient(to right, @color1 0%, @color2 50%, @color1 100%);
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-name: skeleton-screen-loading;
        animation-timing-function: linear;
        transition: 0.3s;
      }
      > .skeleton-screen-item-content {
        height: 18px;
        background-image: linear-gradient(to right, @color1 0%, @color2 50%, @color1 100%);
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-name: skeleton-screen-loading;
        animation-timing-function: linear;
        transition: 0.3s;
      }
      &.a1 {
        grid-area: a1;
        .pdl(24px);
        > .skeleton-screen-item-label {
          width: 40px;
        }
        > .skeleton-screen-item-content {
          width: 40px;
        }
      }
      &.b1 {
        grid-area: b1;
        > .skeleton-screen-item-label {
          width: 64px;
        }
        > .skeleton-screen-item-content {
          width: 164px;
        }
      }
      &.c1 {
        grid-area: c1;
        .pdl(24px);
        > .skeleton-screen-item-label {
          width: 40px;
        }
        > .skeleton-screen-item-content {
          width: 164px;
        }
      }
      &.c2 {
        grid-area: c2;
        .pdl(19px);
        > .skeleton-screen-item-label {
          width: 45px;
        }
        > .skeleton-screen-item-content {
          width: 150px;
        }
      }
      &.c3 {
        grid-area: c3;
        > .skeleton-screen-item-label {
          width: 64px;
        }
        > .skeleton-screen-item-content {
          width: 60px;
        }
      }
      &.d1 {
        grid-area: d1;
        .pdl(24px);
        > .skeleton-screen-item-label {
          width: 40px;
        }
        > .skeleton-screen-item-content {
          width: 60px;
        }
      }
    }
  }
}

.el-popover.kol-tips-popper {
  line-height: 24px;
  font-size: 12px;
  padding: 10px 18px 8px 18px;
}

@keyframes skeleton-screen-loading {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}
</style>
