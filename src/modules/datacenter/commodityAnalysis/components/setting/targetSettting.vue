<template>
  <div>
    <div class="dialog-target-content">
      <div class="more-div">
        <span>自营店铺</span>
        <div>
          <div class="el-check-div" v-for="(item, index) in saleSelfBaseList" :key="item.label">
            <el-checkbox
              v-model="checkSelfAllArr[index]"
              :indeterminate="IndeterminateSelf[index]"
              @change="handleCheckAllChange($event, index)"
              >{{ item.label }}</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedSelfArr[index]"
              @change="handleCheckedCitiesChange($event, index)"
            >
              <el-checkbox
                v-for="subItem in item.children"
                :key="subItem.name"
                :label="subItem.name"
                >{{ subItem.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="more-div">
        <span>竞店店铺</span>
        <div>
          <div
            class="el-check-div other"
            v-for="(item, index) in saleCompetitiveBaseList"
            :key="item.label"
          >
            <el-checkbox
              v-model="checkCompetitiveAllArr[index]"
              :indeterminate="IndeterminateCompetitive[index]"
              @change="handleCheckAllChange($event, index, 1)"
              >{{ item.label }}</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedCompetitiveArr[index]"
              @change="handleCheckedCitiesChange($event, index, 1)"
            >
              <el-checkbox
                v-for="subItem in item.children"
                :key="subItem.name"
                :label="subItem.name"
                >{{ subItem.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="form-footer">
      <tg-button class="mgr-12" @click="emitClose">取消</tg-button>
      <tg-button type="primary" @click="handleDialogSubmit">确定</tg-button>
    </div>

    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>

<script src="./targetSetting.ts"></script>

<style lang="less">
.dialog-target-content {
  padding: 16px 16px 24px;
  overflow-y: auto;
  min-height: 350px;
  max-height: 550px;
  overflow-x: hidden;
  color: var(--text-second-color);
  font-size: 12px;
  .more-div {
    padding: 12px 4px;
    display: flex;
    color: var(--text-third-color);
    > span:first-child {
      width: 90px;
      color: var(--text-color);
    }
    .el-check-div {
      display: flex;
      font-size: 12px;
      margin-bottom: 12px;
      .el-checkbox {
        width: 120px;
        margin-right: 30px;
      }
      .el-checkbox__input .el-checkbox__inner,
      .el-checkbox__label {
        font-size: 12px;
      }
      .el-checkbox-group {
        display: grid;
        width: 500px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }
  }
}

.form-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  background-color: #f4f8ff;
}
</style>
