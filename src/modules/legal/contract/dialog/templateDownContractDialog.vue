<template>
  <div v-if="visible">
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new contract-form-modal"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      top="70px"
      @close="visible = false"
      title="合同模板下载"
    >
      <div
        class="dialog-content"
        style="padding: 24px; overflow-y: auto; height: 300px; overflow-x: hidden"
      >
        <el-form size="mini" label-width="68px" ref="formRef">
          <!-- [合同模板] -->
          <el-form-item label="业务类型：" style="width: 450px">
            <el-select
              popper-class="el-select-popper-mini"
              class="select"
              v-model="business_type"
              clearable
              placeholder="请选择"
              @change="selectbusinesstypeChange"
              style="width: 377px"
            >
              <el-option
                v-for="item in businessTypeOptions"
                :key="item.value"
                合同搜索
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div
          v-if="!list || list.length < 1"
          style="height: 165px; width: 360px; border-radius: 4px; margin: auto; margin-top: 10px"
        >
          <div style="margin-top: 45px; margin-left: 0px">
            <empty-common
              detail-text="暂无该类型选项合同模板数据"
              img-height="100"
              img-width="150"
            ></empty-common>
          </div>
        </div>
        <div
          v-else
          style="
            height: 195px;
            width: 440px;
            border: 1px solid var(--border-line-color);
            padding: 10px 0px 10px 0px;
            border-radius: 4px;
            margin: auto;
            margin-top: 10px;
          "
        >
          <ul style="overflow: auto; margin: auto; height: 168px">
            <li
              v-for="item in list"
              :key="item.id"
              style="
                height: 25px;
                line-height: 25px;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 6px;
              "
              @click="selectlistChange(item)"
            >
              <tg-button
                style="
                  display: inline-block;
                  border: none;
                  width: 100%;
                  padding: 0px;
                  height: 25px;
                  line-height: 25px;
                  padding-left: 16px;
                "
              >
                <el-popover
                  v-if="item.name.length > 28"
                  placement="top-start"
                  width="330"
                  trigger="hover"
                  :content="item.name"
                >
                  <span
                    slot="reference"
                    class="line-clamp-1"
                    style="
                      font-size: 12px;
                      display: inline-block;
                      max-width: 330px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      -o-text-overflow: ellipsis;
                      white-space: nowrap;
                      float: left;
                      color: var(--text-color);
                      cursor: pointer;
                    "
                    >{{ item.name }}</span
                  >
                </el-popover>
                <span
                  v-else
                  style="
                    font-size: 12px;
                    display: inline-block;
                    max-width: 330px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    white-space: nowrap;
                    float: left;
                    color: var(--text-color);
                    cursor: pointer;
                  "
                  >{{ item.name }}</span
                >
                <div
                  style="
                    display: inline-block;
                    border: none;
                    font-size: 14px;
                    width: 20px;
                    float: left;
                    height: 20px;
                    margin-left: 6px;
                    padding: 0px;
                    background-color: transparent;
                  "
                >
                  <tg-icon name="ico-xiazai" style="font-size: 16px"></tg-icon>
                </div>
              </tg-button>
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <tg-button @click="visible = false">关闭</tg-button>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./templateDownContractDialog.ts"></script>

<style lang="less" scoped>
@import './index.less';

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
