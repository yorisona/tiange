<template>
  <div>
    <div class="dialog-content" v-loading="upDataLoading">
      <div style="overflow-y: auto; overflow-y: overlay">
        <div class="title">年度设置</div>
        <div class="example">
          <div style="width: 40px; color: var(--text-third-color)">示例：</div>
          <div style="flex: 1">
            <div class="example-div">
              <div class="value">
                CWAD<span style="height: 19px; border: 1px solid var(--error-color)">C</span>4910104
              </div>
              <div style="margin-top: 6px">年度代码</div>
            </div>
            <div>商品款号第5位：A代表2020年；B代表2021年；C代表2022年；</div>
          </div>
        </div>
        <div style="padding: 0 16px">
          判断规则：<span class="label">商品款号第</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.year_start_num"
            placeholder="请输入"
          ></el-input
          ><span class="label">位到第</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.year_end_num"
            placeholder="选填"
          ></el-input
          ><span class="label">位</span>
        </div>
        <div class="example list">
          <div style="width: 40px; margin-top: 6px; color: var(--text-second-color)">其中：</div>
          <div style="flex: 1">
            <div
              style="margin-bottom: 16px"
              v-for="(item, index) in formData.year_list"
              :key="index"
            >
              <el-input
                size="mini"
                style="width: 60px; margin: 0 8px 0 0"
                v-model.trim="item.chars"
                placeholder="请输入"
              ></el-input
              ><span class="label">代表</span>
              <el-input
                size="mini"
                style="width: 60px; margin: 0 8px"
                v-model.trim="item.real"
                placeholder="请输入"
              ></el-input
              ><span class="label">年；</span>
              <tg-icon
                :disabled="formData.year_list.length <= 1"
                class="ico-btn"
                name="ico-btn-delete"
                @click="onDeleteYear(index)"
              />
            </div>
          </div>
        </div>
        <div style="margin: 0 56px 20px; width: 200px">
          <tg-button type="link" size="mini" @click="onAddYear"> + 添加</tg-button>
        </div>
      </div>
      <div style="width: 0.5px; margin: 32px 0 8px; border: 1px dashed #e5e5e5"></div>
      <div style="overflow-y: auto; overflow-y: overlay">
        <div class="title">季节设置</div>
        <div class="example" style="width: 422px">
          <div style="width: 40px; color: var(--text-third-color)">示例：</div>
          <div style="flex: 1">
            <div class="example-div">
              <div class="value">
                CWADC<span style="height: 19px; border: 1px solid var(--error-color)">4</span>910104
              </div>
              <div style="margin-top: 6px">季节代码</div>
            </div>
            <div>商品款号第6位：1代表春季；2代表夏季；3代表秋季；4代表冬季；</div>
          </div>
        </div>
        <div style="padding: 0 16px">
          判断规则：<span class="label">商品款号第</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.season_start_num"
            placeholder="请输入"
          ></el-input
          ><span class="label">位到第</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.season_end_num"
            placeholder="选填"
          ></el-input
          ><span class="label">位</span>
        </div>
        <div class="example list">
          <div style="width: 40px; margin-top: 6px; color: var(--text-second-color)">其中：</div>
          <div style="flex: 1">
            <div
              style="margin-bottom: 16px"
              v-for="(item, index) in formData.season_list"
              :key="index"
            >
              <el-input
                size="mini"
                style="width: 60px; margin: 0 8px 0 0"
                v-model.trim="item.chars"
                placeholder="请输入"
              ></el-input
              ><span class="label">代表</span>
              <el-input
                size="mini"
                style="width: 60px; margin: 0 8px"
                v-model.trim="item.real"
                placeholder="请输入"
              ></el-input
              ><span class="label">季；</span>
              <tg-icon
                :disabled="formData.season_list.length <= 1"
                class="ico-btn"
                name="ico-btn-delete"
                @click="onDeleteSeason(index)"
              />
            </div>
          </div>
        </div>
        <div style="margin: 0 56px 20px; width: 200px">
          <tg-button type="link" size="mini" @click="onAddSeason"> + 添加</tg-button>
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

<script src="./yearSeasonRuleSetting.ts"></script>

<style lang="less" scoped>
/deep/ .tg-btn-link {
  font-size: 12px;
}
/deep/ .ico-btn-delete {
  color: var(--text-third-color);
}
.dialog-content {
  padding: 20px 20px;
  overflow-y: auto;
  min-height: 350px;
  max-height: 550px;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  color: var(--text-second-color);
  font-size: 12px;
  .title {
    color: var(--text-color);
    font-weight: 600;
  }
  .label {
    color: var(--text-color);
  }
  .example {
    margin-top: 16px;
    width: 408px;
    padding: 16px 0 16px 16px;
    &.list {
      padding: 16px 0 0 16px;
    }
    background: #f6f6f6;
    display: flex;
    justify-content: flex-start;
    color: var(--text-color);
    .example-div {
      width: 184px;
      height: 57px;
      background: #ffffff;
      padding: 11px 18px;
      text-align: center;
      .value {
        font-size: 14px;
      }
      margin-bottom: 12px;
    }
    &.list {
      margin: 2px;
      background: transparent;
      .ico-btn {
        font-size: 16px;
        margin-left: 8px;
        vertical-align: -0.22em;
      }
    }

    margin-bottom: 18px;
  }
}
.form-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  background-color: #f4f8ff;
}
/deep/ .el-select > .el-input {
  height: 32px;
  line-height: 32px;
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-input__icon {
    line-height: 32px !important;
    height: 32px !important;
  }
}
</style>
