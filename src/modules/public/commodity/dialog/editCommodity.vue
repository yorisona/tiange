<template>
  <div class="tg-public-commodity-edit-goods">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="420px"
      title="商品编辑"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div class="team-member-content">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="60px"
          size="small"
          label-position="top"
        >
          <el-form-item label="项目名称：" prop="project_id">
            <el-select
              clearable
              filterable
              remote
              reserve-keyword
              :remote-method="getProjectList"
              @change="onProjectIdChange"
              v-model="form.project_name"
              placeholder="请输入并选择项目"
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index"
                :label="item.project_name"
                :value="item.project_id"
              >
                <span>{{ item.project_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品编码：" prop="item_id">
            <el-input
              v-model.trim="form.item_id"
              placeholder="请输入商品编码"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品款号：">
            <el-input
              v-model.trim="form.item_sn"
              placeholder="请输入商品款号"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="自定义一级类目：" prop="first_tiange_cat_id">
            <el-select
              clearable
              remote
              reserve-keyword
              :remote-method="getFirstCatList"
              @change="onFirstCatChange"
              v-model="form.first_tiange_cat_name"
              placeholder="请输入并选择"
            >
              <el-option
                v-for="(item, index) in firstCatList"
                :key="index"
                :label="item.cat_name"
                :value="item.cat_id"
              >
                <span>{{ item.cat_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义三级类目：" prop="third_tiange_cat_id">
            <el-select
              clearable
              v-model="form.third_tiange_cat_name"
              @change="onThirdCatChange"
              placeholder="请选择"
            >
              <el-option
                style="width: 100%"
                v-for="item in thirdCatList"
                :key="item.cat_id"
                :label="item.cat_name"
                :value="item.cat_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品年度：" prop="year">
            <el-date-picker
              style="width: 100%"
              v-model="form.year"
              value-format="yyyy"
              format="yyyy"
              type="year"
              placeholder="请选择年度"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="商品季度：" prop="season">
            <el-select clearable v-model="form.season" placeholder="请选择季度">
              <el-option
                style="width: 100%"
                v-for="item in quarterList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否重点款：" prop="is_key">
            <el-select v-model="form.is_key">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="目标销量：" prop="target_sale_count">
            <el-input
              v-model.trim="form.target_sale_count"
              placeholder="请输入目标销量"
              :maxlength="20"
              @input="formatInterger"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onClose">取消</tg-button>
        <tg-button type="primary" @click="onSave">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>
<script src="./editCommodity.ts"></script>
<style lang="less">
@import './editCommodity.less';
</style>
