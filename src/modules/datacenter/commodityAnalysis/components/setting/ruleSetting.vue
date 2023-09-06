<template>
  <div>
    <div class="dialog-content">
      <div class="div-content" v-loading="upDataLoading">
        <div class="title">规则设置</div>
        <div class="example" style="width: 405px">
          <div style="width: 40px; color: var(--text-third-color)">示例：</div>
          <div style="flex: 1">
            <div class="example-div">
              <div class="value" v-if="selectIndex === 3 && formData.is_section_distinction === 1">
                CWAD<span style="height: 19px; border: 1px solid var(--error-color)">C</span>4910104
              </div>
              <div
                class="value"
                v-else-if="selectIndex === 3 && formData.is_section_distinction === 0"
              >
                CWADC4910104
              </div>
              <div class="value" v-else>
                <span style="height: 19px; border: 1px solid var(--error-color)">CWADC491</span>0104
              </div>
              <div style="margin-top: 6px">{{ selectIndex === 2 ? '款号' : '款别' }}代码</div>
            </div>
            <div>
              {{
                selectIndex === 2
                  ? '商品款号前8位相同则为同一款'
                  : selectIndex === 3 && formData.is_section_distinction === 0
                  ? '所有商品均显示成门店款'
                  : '商品款号第5位：8代表门店款；6代表网店款；Z代表抖音款；'
              }}
            </div>
          </div>
        </div>
        <div class="title" style="padding: 0 0 12px">判断规则：</div>
        <div style="padding: 0 0 12px" v-if="selectIndex === 3">
          <el-radio-group v-model="formData.is_section_distinction">
            <el-radio :label="0">款别无区分</el-radio>
            <el-radio :label="1">款别有区分</el-radio>
          </el-radio-group>
        </div>
        <div v-if="formData.is_section_distinction === 0">
          <span class="label">{{
            selectIndex === 2
              ? '商品款号前'
              : selectIndex === 3
              ? '所有商品均显示成'
              : '商品款号抓取位数：'
          }}</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.index_num"
            placeholder="请输入"
          ></el-input
          ><span class="label">{{
            selectIndex === 2 ? '位相同则为同一款' : selectIndex === 3 ? '；' : '位'
          }}</span>
        </div>
        <div v-if="formData.is_section_distinction === 1">
          <span class="label">商品款号第</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.section_start_num"
            placeholder="请输入"
          ></el-input
          ><span class="label">位到第</span
          ><el-input
            size="mini"
            style="width: 60px; margin: 0 8px"
            v-model.trim="formData.section_end_num"
            placeholder="选填"
          ></el-input
          ><span class="label">位</span>
        </div>
        <div v-if="formData.is_section_distinction === 1" class="example list">
          <div style="width: 40px; margin-top: 6px; color: var(--text-second-color)">其中：</div>
          <div style="flex: 1">
            <div
              style="margin-bottom: 16px"
              v-for="(item, index) in formData.section_list"
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
              ><span class="label">款；</span>
              <tg-icon
                :disabled="formData.section_list.length <= 1"
                class="ico-btn"
                name="ico-btn-delete"
                @click="onDeleteSection(index)"
              />
            </div>
          </div>
        </div>
        <div v-if="formData.is_section_distinction === 1" style="margin: 0 56px 20px; width: 200px">
          <tg-button type="link" size="mini" @click="onAddSection"> + 添加</tg-button>
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

<script src="./ruleSetting.ts"></script>

<style lang="less" scoped>
/deep/ .tg-btn-link {
  font-size: 12px;
}
/deep/ .ico-btn-delete {
  color: var(--text-third-color);
}
.dialog-content {
  padding: 24px;
  overflow-y: auto;
  min-height: 350px;
  max-height: 550px;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  color: var(--text-second-color);
  font-size: 12px;
  .div-content {
    overflow-y: auto;
    overflow-y: overlay;
  }
  .title {
    color: var(--text-third-color);
  }
  .label {
    color: var(--text-color);
  }
  .example {
    margin-top: 16px;
    width: 400px;
    padding: 16px 0 16px 16px;
    &.list {
      padding: 16px 0 0 25px;
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
