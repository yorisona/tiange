<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-20 10:14:23
-->
<template>
  <div class="tg-invoice-reverse-dislog">
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      title="发票核销"
      :visible="visible"
      width="1294px"
      height="685px"
      destroy-on-close
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="tg-invoice-reverse-content">
        <div class="invoice-amount-container">
          <div class="amount-item">
            <div>发票金额：</div>
            <div>{{ decimal2String(default_invoice ? default_invoice.total_amount : '0') }}</div>
          </div>
          <div class="amount-item">
            <div>未核销金额：</div>
            <div>{{ decimal2String(not_reverse_amount) }}</div>
          </div>
          <div class="amount-item">
            <div>发票类型：</div>
            <div>{{ invoce_type }}</div>
          </div>
        </div>
        <div class="amount-project">
          <!-- <div class="project-selection">选择项目：</div> -->
          <div>
            <el-select
              popper-class="el-select-popper-mini"
              v-model="project_type"
              slot="prepend"
              placeholder="选择项目类型"
              class="mgr-12"
              style="width: 150px"
              size="mini"
              @change="projectTypeChanged"
            >
              <el-option
                v-for="project_type in ProjectTypes"
                :key="project_type.value"
                :label="project_type.label"
                :value="project_type.value"
              ></el-option>
            </el-select>
            <el-select
              popper-class="el-select-popper-mini"
              v-model="project_uid"
              slot="prepend"
              placeholder="请输入并选择项目"
              size="mini"
              style="width: 200px"
              filterable
              remote
              clearable=""
              reserve-keyword
              :remote-method="queryProjectUIDList"
              :loading="project_query_loading"
              @change="projectUidChange"
            >
              <el-option
                v-for="project in project_uid_list"
                :key="project.project_uid"
                :label="project.project_name"
                :value="project.project_uid"
              ></el-option>
              <template v-if="!project_type" slot="empty">
                <div style="padding: 9px 15px; color: var(--text-third-color); font-size: 12px">
                  请先选择项目类型
                </div>
              </template>
            </el-select>
          </div>
        </div>
        <!-- 结算单 -->
        <div class="settlement-list-container">
          <!-- <div class="list-container-title">结算单列表：</div> -->
          <el-table
            height="200px"
            stripe
            border
            :data="settlement_list"
            :header-cell-style="{ fontWeight: '500', lineHeight: '17px' }"
            :cell-style="{ paddingTop: '11px', paddingBottom: '11px' }"
            :row-class-name="settlement_list_class_name"
          >
            <el-table-column
              v-for="(column, index) in settlementColumns"
              :key="index"
              v-bind="column"
            ></el-table-column>
            <template #empty>
              <empty-common img-height="100" img-width="150" detail-text="暂无数据"></empty-common>
            </template>
          </el-table>
        </div>
        <!-- 发票核销列表 -->
        <div class="invoice-reverse-list-container">
          <div class="list-container-title">发票核销列表：</div>
          <el-table
            height="200px"
            border
            stripe
            :data="write_off_list"
            :header-cell-style="{ fontWeight: '500', lineHeight: '17px' }"
            :cell-style="{ paddingTop: '4px', paddingBottom: '4px' }"
          >
            <el-table-column
              v-for="(column, index) in invoiceReverseColumns"
              :key="index"
              v-bind="column"
            ></el-table-column>
            <el-table-column label="核销发票金额 (元)" min-width="147">
              <template slot-scope="scoped">
                <el-input
                  size="small"
                  class="reverse-amount"
                  :value="write_off_list[scoped.$index].typein_write_off_amount"
                  @input="writeOffAmountInput($event, scoped.$index)"
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="52" align="center">
              <template slot-scope="scoped">
                <!-- <template> -->
                <tg-icon
                  name="ico-btn-delete"
                  class="invoice-reverse-delete"
                  @click="() => invoice_reverse_delete_action(scoped.$index)"
                ></tg-icon>
              </template>
            </el-table-column>
            <template #empty>
              <empty-common img-height="100" img-width="150" detail-text="暂无数据"></empty-common>
            </template>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <tg-button @click="cancel" class="mgr-12">取 消</tg-button>
        <tg-button type="primary" @click="sure">确 定</tg-button>
      </div>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="正在核销发票，请稍候..." />
  </div>
</template>

<script src="./invoice.reverse.ts"></script>
<style lang="less">
@import './invoice.reverse.less';
</style>
