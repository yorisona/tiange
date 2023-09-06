<!--
 * @Brief: 项目结算 弹窗 手工调账
 * @Author: wuyou
 * @Date: 2021-05-19 14:20:32
-->
<template>
  <CardLayout class="tg-adjust-account-container" :padding="[18, 0, 0, 0]">
    <template #title>{{ title }}</template>
    <template
      v-if="ExtendItem === 'company' || ExtendItem === 'anchor' || ExtendItem === 'LiveDouyinSelf'"
      #desc
    >
      <div class="topBar">
        <el-form size="mini">
          <el-form-item
            class="inline-form-item"
            label=""
            label-width="60px"
            style="margin-bottom: 12px !important"
          >
            <el-select
              filterable
              clearable
              :placeholder="`请选择${
                ExtendItem === 'company'
                  ? '机构'
                  : ExtendItem === 'customer'
                  ? '客户'
                  : ExtendItem === 'LiveDouyinSelf'
                  ? '主播或公司'
                  : '主播'
              }`"
              popper-class="tg-adjust-component-top-select el-select-popper-mini"
              v-model="filterOption"
            >
              <el-option
                value=""
                :label="`${
                  ExtendItem === 'company'
                    ? '全部机构'
                    : ExtendItem === 'customer'
                    ? '全部客户'
                    : ExtendItem === 'LiveDouyinSelf'
                    ? '全部主播或公司'
                    : '全部主播'
                }`"
                ><span>{{
                  ExtendItem === 'company'
                    ? '全部机构'
                    : ExtendItem === 'customer'
                    ? '全部客户'
                    : ExtendItem === 'LiveDouyinSelf'
                    ? '全部主播或公司'
                    : '全部主播'
                }}</span></el-option
              >
              <el-option
                style="width: 158px"
                v-for="(item, index) in allSelectData"
                :key="index"
                :label="item.real_name || item.name"
                :value="item.real_name || item.name"
              >
                <span>{{ item.real_name || item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <div
      class="adjust-account-content"
      :style="`grid-template-rows: 44px ${total_height - 102}px;`"
    >
      <div class="pdl-18 pdr-18">
        <tg-ghost-button
          v-if="AdjustInfoList.length < MaxAdjustSize"
          class="flex-none"
          @click="addItemHandler"
        >
          <a>点击添加</a>
        </tg-ghost-button>
        <el-tooltip
          v-else
          :content="`最多上传${MaxAdjustSize}条手工调账`"
          placement="top"
          effect="light"
        >
          <tg-ghost-button class="flex-none disabled-tg-ghost-button">
            <a>点击添加</a>
          </tg-ghost-button>
        </el-tooltip>
      </div>
      <div class="item-container">
        <div
          class="item-list"
          :style="`height: ${
            DisplayAdjustInfoList.length * 134 - 18
          }px;grid-template-rows: repeat(${DisplayAdjustInfoList.length}, 116px)`"
        >
          <div class="one-item-block" v-for="(item, index) in DisplayAdjustInfoList" :key="index">
            <tg-icon
              class="form-item-remove-btn"
              name="ico-frm-delete"
              hover-name="ico-frm-delete-active"
              @click="removeItemHandler(index)"
              v-if="AdjustInfoList.length > 1"
            />
            <el-form size="mini">
              <el-form-item
                v-if="ShowLiveDouyinSelf || ShowLiveDouyinSelfAfter"
                class="inline-form-item"
                label="结算方式："
                label-width="60px"
                :style="{
                  marginBottom: ShowLiveDouyinSelfAfter ? '12px  !important' : '0px  !important',
                }"
              >
                <el-select
                  filterable
                  clearable
                  placeholder="请选择"
                  v-model="item.type"
                  popper-class="tg-adjust-component-select el-select-popper-mini"
                  @change="handlerSelectWayChange(item, index)"
                >
                  <el-option
                    v-for="(subItem, seq) in costOptions"
                    :key="seq"
                    :label="subItem.label"
                    :value="subItem.value"
                    :disabled="itemTyepDisabled(subItem.value)"
                  >
                    <span>{{ subItem.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 选择机构 -->
              <el-form-item
                v-if="ShowCompany"
                class="inline-form-item"
                :label="
                  ExtendItem === 'company'
                    ? '选择机构：'
                    : ExtendItem === 'supplier'
                    ? '供应商：'
                    : '客户：'
                "
                label-width="60px"
                style="margin-bottom: 12px !important"
              >
                <el-select
                  style="width: 100%"
                  filterable
                  clearable
                  :placeholder="
                    ExtendItem === 'company'
                      ? '请选择机构'
                      : ExtendItem === 'supplier'
                      ? '请选择供应商'
                      : '请选择客户'
                  "
                  v-model="item.company_name"
                  popper-class="tg-adjust-component-select el-select-popper-mini"
                  @change="handlerSelectChange(item.company_name, index)"
                >
                  <el-option
                    v-for="(subItem, seq) in allSelectData"
                    :key="seq"
                    :label="subItem.name"
                    :value="subItem.name"
                  >
                    <span>{{ subItem.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <!--            选择公司-->
              <el-form-item
                v-if="
                  ShowLiveDouyinSelf &&
                  (item.type === SettlementIncomeType.put ||
                    item.type === SettlementIncomeType.other ||
                    item.type === SettlementIncomeType.marketing_advertising)
                "
                class="inline-form-item"
                label="选择公司："
                label-width="60px"
                style="margin-bottom: 12px; margin-top: 12px"
              >
                <el-select
                  filterable
                  clearable
                  placeholder="请选择公司"
                  v-model="item.company_name"
                  popper-class="tg-adjust-component-select el-select-popper-mini"
                  @change="handlerSelectChange(item.company_name, index)"
                >
                  <el-option
                    v-for="(subItem, seq) in item.type === SettlementIncomeType.put
                      ? allCompanySelectData
                      : item.type === SettlementIncomeType.other
                      ? allOtherSelectData
                      : allAdvertSelectData"
                    :key="seq"
                    :label="subItem.name"
                    :value="subItem.name"
                    :disabled="itemDisabled(item.type, subItem.name)"
                  >
                    <span>{{ subItem.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 有主播选项 -->
              <el-form-item
                v-if="
                  ShowAnchor || (ShowLiveDouyinSelf && item.type === SettlementIncomeType.anchor)
                "
                class="inline-form-item"
                label="选择主播："
                label-width="60px"
                style="margin-bottom: 12px !important"
                :style="{
                  marginTop: item.type === SettlementIncomeType.anchor ? '12px' : '0px',
                }"
              >
                <el-select
                  filterable
                  clearable
                  placeholder="请选择主播"
                  v-model="item.real_name"
                  popper-class="tg-adjust-component-select el-select-popper-mini"
                  @change="handlerSelectChange(item.real_name, index)"
                >
                  <el-option
                    v-for="(subItem, seq) in allKolSelectData"
                    :key="seq"
                    :label="subItem.real_name || subItem.name"
                    :value="subItem.real_name || subItem.name"
                    :disabled="itemDisabled(9, subItem.real_name || subItem.name)"
                  >
                    <span>{{ subItem.real_name || subItem.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 有项目选项 -->
              <el-form-item
                v-if="ShowProject"
                class="inline-form-item"
                label="调整项目："
                label-width="60px"
                style="margin-bottom: 12px !important"
              >
                <el-select
                  filterable
                  clearable
                  placeholder="请选择调整项目"
                  v-model="item.project_name"
                  popper-class="tg-adjust-component-select el-select-popper-mini"
                  @change="handlerSelectChange(item.project_name, index)"
                >
                  <el-option
                    v-for="(subItem, seq) in allSelectData"
                    :key="seq"
                    :label="subItem.name"
                    :value="subItem.name"
                  >
                    <span>{{ subItem.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="(ShowLiveDouyinSelf && item.type) || !ShowLiveDouyinSelf"
                style="margin-bottom: 12px !important"
                class="inline-form-item"
                label="调整金额："
                label-width="60px"
              >
                <el-input
                  @input="value => getAdjustAmountNumber(value, index)"
                  placeholder="0.00"
                  maxlength="13"
                  v-model.trim="item.adjust_amount"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="(ShowLiveDouyinSelf && item.type) || !ShowLiveDouyinSelf"
                class="inline-form-item"
                label="调整原因："
                label-width="60px"
              >
                <el-input
                  type="textarea"
                  placeholder="请输入调整原因"
                  maxlength="100"
                  rows="6"
                  v-model.trim="item.adjust_reason"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </CardLayout>
</template>

<script src="./AdjustAccount.ts"></script>

<style lang="less">
@import './AdjustAccount.less';
</style>
