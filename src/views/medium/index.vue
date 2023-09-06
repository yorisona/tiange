<template>
  <section class="medium-wrapper company tg-page-container" style="flex-grow: 1; min-width: 710px">
    <tg-card class="search-box" :padding="[16, 0, 4, 16]">
      <el-form size="mini" :show-message="false" label-width="60px">
        <div class="filter-form-div no-wrap">
          <div class="filter-form-item more">
            <el-form-item label="公司名称：">
              <el-input
                v-key-enter="clickQueryMedium"
                v-model="companyName"
                placeholder="请输入公司名称"
                clearable
                @clear="clickQueryMedium"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="是否专票：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="ticketValue"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in ticketList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="审核状态：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="approval_status"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in verifyStatusList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label-width="0">
              <div style="min-width: 208px; max-width: 208px">
                <tg-button class="mgr-8" @click="handleFolderClick">高级筛选</tg-button>
                <tg-button class="mgr-8" type="primary" @click="clickQueryMedium">查询</tg-button>
                <tg-button class="mgr-8" @click="resetMedium">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="list-filter" v-show="show">
        <tg-label-group
          class="tg-label-group-mini"
          v-model="cooperationPlatformIndex"
          :options="cooperationPlatformList.map(el => ({ label: el.value, value: el.type }))"
          @change="selectCooperationPlatform"
        >
          <template #label>擅长平台</template>
        </tg-label-group>
        <tg-label-group
          class="tg-label-group-mini"
          v-model="categoryIndex"
          :options="newcategoryList.map((el, idx) => ({ label: el, value: idx }))"
          @change="selectCategory"
        >
          <template #label>擅长领域</template>
        </tg-label-group>
      </div>
    </tg-card>
    <tg-card
      v-show="mediumType === 1"
      class="common-block-wrapper mgt-10 flex-auto"
      style="flex-grow: 1"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div
        class="new-search-display-button"
        :style="{ marginBottom: Permission.canCreateCompany ? '12px' : '4px' }"
      >
        <!-- <el-button type="primary" style="width:80px" size="small" @click="exportCompany">导出</el-button> -->
        <!--        <tg-button-->
        <!--          v-if="Permission.canDeleteCompany"-->
        <!--          size="small"-->
        <!--          @click="delCompany"-->
        <!--          icon="ico-btn-delete"-->
        <!--          type="negative"-->
        <!--          :disabled="multipleSelection.length === 0"-->
        <!--          >删除</tg-button-->
        <!--        >-->
        <tg-button
          v-if="Permission.canCreateCompany"
          type="primary"
          size="small"
          icon="ico-btn-add"
          @click="addCompanyNew()"
          >新增公司</tg-button
        >
      </div>
      <el-table
        stripe
        v-if="Permission.canViewCompanyList"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        :data="companyList"
        @row-click="goDetail"
        v-bind="tableProps"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <el-table-column label="是否专票" minWidth="100" align="center">
          <template v-slot="scope">{{
            scope.row.special_ticket ? '是' : scope.row.special_ticket === 0 ? '否' : defaultVal
          }}</template>
        </el-table-column>
        <el-table-column label="审核状态" minWidth="150" align="center">
          <template v-slot="scope">
            <div v-if="scope.row.verify_status === -1" class="co-status">
              <p class="point block"></p>
              <p>未通过</p>
            </div>
            <div v-else-if="scope.row.verify_status === 1" class="co-status">
              <p class="point success"></p>
              <p>已通过</p>
            </div>
            <div v-else-if="scope.row.verify_status === 2" class="co-status">
              <p class="point not-commit"></p>
              <p>未提交</p>
            </div>
            <div v-else class="co-status">
              <p class="point process"></p>
              <p>审核中</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="85">
          <template v-slot="scope">
            <div class="operation">
              <a>查看</a>
              <a
                v-if="
                  (scope.row.verify_status === -1 || scope.row.verify_status === 2) &&
                  permission.supplier_company_edit
                "
                @click="editCompany($event, scope.row.id)"
                >编辑</a
              >
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column label="报价单" width="100">-->
        <!--          <template v-slot="scope">-->
        <!--            <template v-if="scope.row.quotation">-->
        <!--              <tg-button type="link" class="mgr-12" @click.stop="preview(scope.row)"-->
        <!--                >预览</tg-button-->
        <!--              >-->
        <!--              <tg-button-->
        <!--                type="link"-->
        <!--                @click.stop-->
        <!--                :href="fixFileToken(scope.row.quotation)"-->
        <!--                download-->
        <!--                target="_blank"-->
        <!--                >下载</tg-button-->
        <!--              >-->
        <!--            </template>-->
        <!--            <template v-else>{{ defaultVal }}</template>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!-- </div> -->
        <template #empty>
          <div class="tg-page-empty">
            <empty-common></empty-common>
          </div>
        </template>
      </el-table>
      <div class="block">
        <el-pagination
          v-if="Permission.canViewCompanyList && companyList.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size.sync="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </tg-card>
    <CompanyAdd :visible.sync="companyVisible" @close="close" @save="saveCompany"></CompanyAdd>
    <!--    <personal-library v-show="mediumType === 2"></personal-library>-->
    <tg-mask-loading :visible="deleteLoading" content="正在删除公司，请稍候..." />
  </section>
</template>

<script src="./index.ts"></script>
<style lang="less">
.popover-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 12px;
  grid-row-gap: 12px;
}
</style>
<style lang="less" scoped>
@import './index.less';

/deep/ .el-table {
  font-size: 12px;
  a {
    font-size: 12px;
  }
  .co-status {
    width: 100%;
    justify-content: center;
  }
}
</style>
