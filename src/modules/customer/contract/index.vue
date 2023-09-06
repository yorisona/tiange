<template>
  <div id="contract" class="tg-page-container tg-contract-list-page">
    <tg-block>
      <tg-label-group
        v-model="queryForm.sale_chance"
        :options="saleChances.map(el => ({ label: el.label, value: el.value }))"
        @change="handleSelectSaleChance"
      >
        <template #label>销售渠道</template>
      </tg-label-group>
      <el-form
        class="filter-form flex-form pdt-10 pdb-10"
        :inline="true"
        size="medium"
        :show-message="false"
        label-width="70px"
      >
        <el-form-item
          label="类型："
          :data-order="formItemOrder.contract_type"
          class="flex-form-item"
          :class="`order-${formItemOrder.contract_type}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-select
            class="select"
            v-model="queryForm.contract_type"
            clearable
            placeholder="请选择"
            style="width: 220px"
          >
            <el-option
              v-for="item in contractTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态："
          :data-order="formItemOrder.contract_status"
          class="flex-form-item"
          :class="`order-${formItemOrder.contract_status}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-select
            class="select"
            v-model="queryForm.contract_status"
            clearable
            placeholder="请选择"
            style="width: 220px"
          >
            <el-option
              v-for="item in ApprovalStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否收回："
          :data-order="formItemOrder.is_recycled"
          class="flex-form-item"
          :class="`order-${formItemOrder.is_recycled}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-select
            class="select"
            v-model="queryForm.is_recycled"
            clearable
            placeholder="请选择"
            style="width: 220px"
          >
            <el-option label="已收回" :value="1" />
            <el-option label="未收回" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="结束日期："
          :data-order="formItemOrder.coop_end_date"
          class="flex-form-item"
          :class="`order-${formItemOrder.coop_end_date}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-date-picker
            v-model="queryForm.coop_end_date"
            placeholder="合作结束时间"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item
          label="创建人："
          :data-order="formItemOrder.add_by_name"
          class="flex-form-item"
          :class="`order-${formItemOrder.add_by_name}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-input
            v-model.trim="queryForm.add_by_name"
            @keypress.enter.native="reload"
            placeholder="请输入创建人"
            clearable
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item
          label="客户名称："
          :data-order="formItemOrder.partner_name"
          class="flex-form-item"
          :class="`order-${formItemOrder.partner_name}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-input
            class="input"
            v-model="queryForm.partner_name"
            placeholder="请输入客户名称"
            clearable
            @keypress.enter.native="reload"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item
          label="合同编号："
          :data-order="formItemOrder.contract_uid"
          class="flex-form-item"
          :class="`order-${formItemOrder.contract_uid}`"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <el-input
            class="input"
            v-model="queryForm.contract_uid"
            placeholder="请输入合同编号"
            clearable
            @keypress.enter.native="reload"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item
          :label="whitespace"
          class="flex-form-item order-100"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <tg-button type="primary" @click="reload">查询</tg-button>
          <tg-button type="negative" class="mgl-20" @click="reset">重置</tg-button>
          <tg-button class="mgl-20" v-if="isDev" @click="fetchStatements">查询结算</tg-button>
        </el-form-item>
      </el-form>
    </tg-block>
    <!-- [列表] -->
    <tg-block class="result-list Customer-contract mgt-10">
      <div class="btns-line" v-if="currentUserInfo">
        <tg-button
          type="primary"
          v-if="permission.marketing_contract_create"
          @click="showAddContractDialog"
          key="contract-add-btn"
          icon="ico-btn-add"
          >新增合同协议</tg-button
        >
        <tg-button
          v-if="permission.marketing_contract_create"
          type="primary"
          @click="toggleAddStatementModalVisible(true)"
          icon="ico-btn-add"
          >新增结算单</tg-button
        >
        <!-- [不要批量删除] -->
        <tg-button
          type="negative"
          v-if="false"
          @click="handleDeleteContracts"
          key="delete-btn"
          icon="ico-btn-delete"
          :disabled="deleteBtnDisabled"
          >删除</tg-button
        >
      </div>
      <el-table
        stripe
        v-if="Permission.canViewContractList"
        :data="list"
        style="width: 100%"
        v-loading="loading"
        :cell-style="{ cursor: 'pointer' }"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="空空如也~"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="Permission.canViewContractList"
        class="mgt-10"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-block>
    <add-contract ref="addContractDialogRef" @added="queryContract" />
    <AddStatement :visible="AddStatementVisible" @dialog:close="onAddStatementModalClose" />
    <review-dialog ref="reviewDialog" @approved="queryContract" />
    <add-attachment-dialog ref="addAttachmentDialogRef" @added="queryContract" />
    <!-- 新增合同复印件 -->
    <add-contract-copy-dialog
      ref="addContractCopyDialogRef"
      @added="queryContract"
      :contractId="contractId"
    />
    <AnnexDialog @dialog:close="onAnnexDialogClose" />
  </div>
</template>

<script src="./index.tsx"></script>

<style lang="less">
@import './index.less';
@import './flows.less';
</style>
