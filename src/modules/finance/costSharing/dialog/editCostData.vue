<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      width="310px"
      :visible="visiable"
      append-to-body
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>编辑</template>
      <div class="news-body">
        <el-form size="mini" :model="form" :rules="formRules" label-width="44px" ref="formRef">
          <!--          <el-form-item-->
          <!--            label="日期："-->
          <!--            prop="allocated_time"-->
          <!--            class="flex-form-item flex-form-item-time"-->
          <!--          >-->
          <!--            <el-date-picker-->
          <!--              disabled-->
          <!--              v-model="form.allocated_time"-->
          <!--              placeholder="选择日期"-->
          <!--              format="yyyy.MM.dd"-->
          <!--              value-format="yyyy-MM-dd"-->
          <!--              class="time-select-box"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item
            class="flex-form-item flex-form-item-time"
            prop="department_name"
            label="日期："
          >
            <el-input
              disabled
              :value="(form.allocated_time || '').replace(/-/g, '.') || '--'"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="flex-form-item flex-form-item-time"
            prop="multistage_department_name"
            label="部门："
          >
            <el-input disabled :value="form.multistage_department_name || '--'"></el-input>
          </el-form-item>
          <el-form-item
            class="flex-form-item flex-form-item-time"
            prop="project_name"
            label="项目："
          >
            <el-input disabled :value="form.project_name || '--'"></el-input>
          </el-form-item>
          <!--          <el-form-item class="flex-form-item flex-form-item-time" prop="employee_num" label="人数：">-->
          <!--            <el-input disabled :value="form.employee_num"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item
            class="flex-form-item flex-form-item-time"
            prop="expense_type_name"
            label="类别："
          >
            <el-input disabled :value="form.expense_type_name || '--'"></el-input>
          </el-form-item>
          <!--          <el-form-item-->
          <!--            class="flex-form-item flex-form-item-time"-->
          <!--            prop="project_uid"-->
          <!--            label="归属项目："-->
          <!--          >-->
          <!--            <el-select-->
          <!--              popper-class="el-select-popper-mini"-->
          <!--              v-model="form.project_uid"-->
          <!--              filterable-->
          <!--              clearable-->
          <!--              class="time-select-box"-->
          <!--              placeholder="请输入名称搜索项目"-->
          <!--              remote-->
          <!--              :remote-method="getProjectIds"-->
          <!--              @change="val => selectProjrctIDChange(val)"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in project_ids"-->
          <!--                :key="item.project_uid"-->
          <!--                :label="item.project_name"-->
          <!--                :value="item.project_uid"-->
          <!--              ></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item-->
          <!--            class="flex-form-item flex-form-item-time"-->
          <!--            prop="expense_type_biz_code"-->
          <!--            label="费用类别："-->
          <!--          >-->
          <!--            <el-select-->
          <!--              popper-class="el-select-popper-mini"-->
          <!--              v-model="form.expense_type_biz_code"-->
          <!--              filterable-->
          <!--              clearable-->
          <!--              class="time-select-box"-->
          <!--              placeholder="请输入名称搜索费用类别"-->
          <!--              @change="val => selectExpenseIDChange(val)"-->
          <!--              size="small"-->
          <!--              reserve-keyword-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in expense_category_ids"-->
          <!--                :key="item.expense_type_biz_code"-->
          <!--                :label="item.expense_type_name"-->
          <!--                :value="item.expense_type_biz_code"-->
          <!--              ></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item
            class="flex-form-item flex-form-item-time"
            label="金额："
            prop="allocated_amount"
          >
            <el-input
              type="number"
              placeholder="请输入分摊金额"
              v-model="form.allocated_amount"
              @input="getfixPositiveNumber($event)"
              @blur="blurPositiveNumber($event)"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./editCostData.ts"></script>
<style lang="less" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type='number'] {
  -moz-appearance: textfield !important;
}
/deep/ .el-form {
  .el-form-item--mini {
    margin-right: 0;
  }
}

.header-title {
  height: 40px;
  background: rgba(255, 122, 54, 0.06);
  width: 100%;
  font-size: 12px;
  color: #ff7a36;
  line-height: 40px;
  padding: 0px 20px;
  /deep/ .ico-warn {
    width: 20px;
    font-size: 13px;
    top: -1px;
    color: #ff7a36;
    height: 20px;
    margin-top: -3px;
    margin-right: 5px;
    vertical-align: middle;
  }
}
.news-body {
  padding: 18px;
  //margin-top: 24px;
  //margin-bottom: 24px;
  /deep/.el-input {
    width: 100%;
  }

  /deep/ .el-input__icon {
    &.el-icon-delete {
      margin-left: 6px;
      color: var(--text-third-color);
    }
    &:hover {
      color: rgba(var(--theme-rgb-color), 0.9);
    }
  }
}
</style>
