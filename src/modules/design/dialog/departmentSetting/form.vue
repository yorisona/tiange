<template>
  <div>
    <div
      class="dialog-content"
      style="
        padding: 20px 20px;
        overflow-y: auto;
        min-height: 250px;
        max-height: 350px;
        overflow-x: hidden;
      "
    >
      <div class="department-list-container">
        <div class="th">部门</div>
        <div class="th">对应项目类型</div>
        <div class="th">分配人</div>
        <div class="th" />
        <template v-for="(item, index) in queryForm">
          <el-popover
            :key="index"
            placement="bottom-start"
            trigger="click"
            width="300"
            popper-class="cb-department-tree-popper-class  el-tree-popper-mini"
            class="td-1"
          >
            <div
              slot="reference"
              class="repain-select"
              style="display: flex; justify-content: flex-start; align-items: center"
            >
              <div v-if="item.feishu_department_name" class="depart-select-box">
                <span>{{ item.feishu_department_name }}</span>
                <i
                  @click.stop="
                    () => {
                      item.feishu_department_name = '';
                      item.feishu_department_id = undefined;
                      cb_department_tree.setCheckedKeys([]);
                    }
                  "
                  style="margin-top: 7px; color: white; font-size: var(--small-font-size)"
                  class="el-icon-circle-close"
                />
              </div>
              <div
                v-else
                class="depart-select-box"
                style="color: var(--disabled-color); border: 1px solid var(--border-line-color)"
              >
                <span>请选择归属部门</span>
                <i
                  style="
                    margin-top: 8px;
                    color: var(--disabled-color);
                    font-size: var(--small-font-size);
                  "
                  class="el-icon-arrow-down"
                ></i>
              </div>
            </div>
            <div class="department-tree">
              <el-tree
                :ref="'cb_department_tree' + index"
                :props="treeProps"
                node-key="department_id"
                :data="feishuDepartmentList"
                show-checkbox
                check-on-click-node
                :default-checked-keys="default_checked_department_ids(index)"
                :default-expanded-keys="default_checked_department_ids(index)"
                @check="handleNewCheckChange($event, index)"
              >
              </el-tree>
            </div>
          </el-popover>
          <el-input
            class="td-2"
            :key="index + 'b'"
            v-model="item.label"
            placeholder="请输入项目类型"
            size="mini"
          />
          <function-select
            :key="index + 'c'"
            :modeType="modeType"
            size="mini"
            multiple
            v-model="item.assigner_ids"
            class="td-3"
            :collapse-tags="false"
            multiple-limit="3"
            placeholder="请选择分配人"
            :defaultValue="item.defaultValue"
          />
          <div :key="index">
            <tg-icon
              :disabled="queryForm.length <= 1"
              class="ico-btn"
              name="ico-btn-delete"
              @click="onDeleteDepartment(index)"
            />
          </div>
        </template>
      </div>
      <div style="margin-top: 4px">
        <tg-button icon="ico-btn-add" size="mini" @click="onAddDepartment">新增部门</tg-button>
      </div>
    </div>

    <div class="form-footer">
      <tg-button @click="emitClose">取消</tg-button>
      <tg-button type="primary" @click="handleDialogSubmit">确定</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>

<script src="./form.ts"></script>

<style lang="less" scoped>
@import './form.less';
</style>
