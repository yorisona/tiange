<template>
  <tg-card
    class="tg-marketing-project-tab-ae flex-none"
    v-bind="cardProps"
    @rect:update="onRectUpdate"
  >
    <div style="padding: 0">
      <tg-label-group
        v-model="queryForm.ae_id"
        :options="aeOptions"
        label="指定AE"
        v-if="aeList.length > 0"
      />
      <div v-else style="font-size: 14px; color: var(--text-color); padding: 12px 0">
        尚未添加AE
      </div>
      <el-divider />
    </div>
    <div class="btns-line">
      <tg-button
        type="primary"
        icon="ico-btn-add"
        @click="openDrawer"
        v-if="Permission.canChange && isAE"
        class="mgr-24"
        >登记跟单</tg-button
      >
      <label>实际跟单金额：</label>
      <span>{{ documentary_amount_format(statInfo.act_documentary_amount) }}</span>
      <label class="mgl-24">预计跟单金额：</label>
      <span>{{ documentary_amount_format(statInfo.exp_documentary_amount) }}</span>
    </div>
    <!-- <div class="table-container"> -->
    <el-table
      stripe
      border
      v-if="Permission.canViewList"
      :data="data"
      v-loading="loading"
      v-bind="tableProps"
      style="margin-bottom: 32px"
    >
      <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      <template #empty>
        <empty-common detail-text="暂无跟单"></empty-common>
      </template>
    </el-table>
    <!-- </div> -->
    <el-dialog
      class="tg-dialog-classic"
      :visible="itemsDialogVisible"
      width="612px"
      @close="closeItemsDialog"
    >
      <template #title>商品明细</template>
      <div style="padding: 24px; max-height: 620px; overflow-y: auto">
        <el-table stripe :data="items">
          <el-table-column
            v-for="(col, colIndex) in itemsTableColumns"
            v-bind="col"
            :key="colIndex"
          />
        </el-table>
      </div>
    </el-dialog>
    <el-drawer
      v-if="Permission.canChange"
      :title="drawerTitle"
      height="100vh"
      size="520"
      :visible="drawerVisible"
      :wrapperClosable="false"
      @close="closeDrawer"
    >
      <div class="ae-drawer-content" style="padding-top: 12px">
        <head-lines style="margin: 10px 18px" title="客户信息" />
        <DrawerCustomer
          :customerName="shop_name"
          :customerManager="manager_name"
          :companyName="company_name"
        />
        <head-lines style="margin: 10px 18px" :title="checkedAE" />
        <div style="padding: 0 30px">
          <div class="ae-order-list">
            <template v-for="(aeOrder, orderIndex) in aeForm">
              <el-form
                ref="formRef"
                class="el-form-vertical"
                :model="aeOrder"
                :rules="formRules"
                style="padding: 0"
                :key="orderIndex"
                size="mini"
              >
                <div class="ae-order">
                  <el-form-item label="KOL名称" prop="kol_id" class="col-1-2">
                    <el-select
                      placeholder="请输入并选择KOL名称"
                      v-model.trim="aeOrder.kol_name"
                      filterable
                      remote
                      clearable
                      @change="val => onKolChange(orderIndex, val)"
                      :remote-method="onKolSearch"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(item, key) in kol_list"
                        :key="key"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="报价金额" prop="price_amount" class="col-2-3">
                    <el-input
                      placeholder="请输入报价金额"
                      v-model.trim="aeOrder.price_amount"
                      @input="val => onInputPriceAmount(orderIndex, val)"
                    >
                      <template #append>元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="成本金额" prop="cost_amount" class="col-1-2">
                    <el-input
                      placeholder="请输入成本金额"
                      v-model.trim="aeOrder.cost_amount"
                      @input="val => onInputCostAmount(orderIndex, val)"
                    >
                      <template #append>元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="直播日期" prop="live_date" class="col-2-3">
                    <el-date-picker
                      placeholder="请选择直播日期"
                      v-model="aeOrder.live_date"
                      type="date"
                      value-format="yyyy-MM-dd"
                      format="yyyy.MM.dd"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="成本是否安排" prop="is_cost_arrange" class="col-1-2">
                    <el-radio-group
                      v-model="aeOrder.is_cost_arrange"
                      style="width: 100%; height: 32px; line-height: 32px"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div class="el-form-item is-required col-1-3" style="margin-bottom: 0">
                    <label class="el-form-item__label">商品名称</label>
                    <div style="width: 100%"></div>
                  </div>
                  <div class="ae-order-product-list col-1-3">
                    <template v-for="(item, itemIndex) in aeOrder.item_list">
                      <div class="ae-order-product col-1-3" :key="itemIndex">
                        <el-form-item
                          label="商品名称"
                          :prop="`item_list[${itemIndex}].item_name`"
                          :rules="formRules.item_name"
                          class="col-1-2"
                        >
                          <el-input placeholder="请输入商品名称" v-model.trim="item.item_name" />
                        </el-form-item>
                        <el-form-item
                          label="商品链接"
                          :prop="`item_list[${itemIndex}].item_url`"
                          :rules="formRules.item_url"
                          class="col-2-3"
                        >
                          <el-input placeholder="请输入商品链接" v-model.trim="item.item_url" />
                        </el-form-item>
                        <el-form-item label="样品是否安排" prop="is_sample_arrange">
                          <el-radio-group
                            v-model="item.is_sample_arrange"
                            style="width: 100%; height: 32px; line-height: 32px"
                          >
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <!-- [商品的删除] -->
                        <!-- [此处仅一条时不显示删除操作，我是不赞同的] -->
                        <!-- [对于一条和多条数据的操作并不一致] -->
                        <!-- [而且单条数据这一个整体概念上就无法清除了] -->
                        <!-- [只能手动清除每一个字段] -->
                        <!-- [产品和测试喜欢，那随你们] -->
                        <tg-icon
                          name="ico-frm-delete"
                          hover-name="ico-frm-delete-active"
                          @click="removeItem(orderIndex, itemIndex)"
                          v-if="aeOrder.item_list.length > 1"
                        />
                      </div>
                    </template>
                  </div>
                  <tg-ghost-button class="col-1-3 mgt-18" @click="addItem(orderIndex)">
                    <a>点击添加</a>
                  </tg-ghost-button>
                  <el-form-item label="备注" prop="note" class="col-1-3 mgt-18">
                    <el-input
                      type="textarea"
                      placeholder="请输入备注"
                      :maxlength="50"
                      show-word-limit
                      v-model="aeOrder.note"
                    />
                  </el-form-item>
                  <!-- [跟单的删除] -->
                  <!-- [此处想说的话同上] -->
                  <tg-icon
                    name="ico-frm-delete"
                    hover-name="ico-frm-delete-active"
                    @click="removeOrder(orderIndex)"
                    v-if="!editMode && aeForm.length > 1"
                  />
                </div>
              </el-form>
            </template>
          </div>
          <tg-ghost-button class="mgt-18" @click="addOrder" v-if="!editMode">
            <a>添加跟单表</a>
          </tg-ghost-button>
        </div>
      </div>
      <div class="el-drawer-footer">
        <tg-button @click="closeDrawer">取消</tg-button>
        <tg-button type="primary" @click="onSubmit">保存</tg-button>
      </div>
    </el-drawer>
    <TgMaskLoading content="正在保存跟单，请稍候..." :visible="submitLoading" />
    <TgMaskLoading content="正在删除跟单，请稍候..." :visible="deleteLoading" />
  </tg-card>
</template>

<script src="./ae.ts"></script>

<style lang="less">
@import './ae.less';
.tg-marketing-project-tab-ae {
  a,
  .cell,
  .status {
    font-size: 12px;
  }
}
</style>
