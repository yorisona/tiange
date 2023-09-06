<template>
  <section class="child-container requirement-detail-container">
    <el-row class="detail-text-box">
      <!-- 点名字也返回 2019-3-20应产品要求修改 -->
      <div class="text-name">
        <span v-show="!requirementNameEdit" @click="$router.back()">{{ requirement_name }}</span>
        <el-input
          ref="requirementNameEdit"
          v-show="requirementNameEdit"
          maxlength="24"
          size="mini"
          class="text-input"
          v-model="requirement_name"
          @keyup.enter.native="editRequirement"
          @blur="editRequirement"
        ></el-input>
        <i
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_req)"
          class="edit-btn el-icon-edit"
          @click="setRequirementNameEdit"
        ></i>
      </div>
      <div class="text-info">
        <span
          >品牌名称：<b v-show="!brandNameEdit">{{ brand_name }}</b>
          <!-- <el-input v-show="brandNameEdit" size="mini" class="text-input" v-model="brand_name" @keyup.enter.native="editRequirement" @blur="editRequirement"></el-input> -->
          <el-select
            ref="brandNameEdit"
            :class="{ nobrandNameEdit: !brandNameEdit }"
            size="mini"
            class="text-input"
            v-model="brand_name"
            filterable
            placeholder="请选择"
            @change="brandChange"
            @blur="brandBlur"
          >
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.brand_name"
              :value="item.brand_name"
            >
            </el-option>
          </el-select>
          <i
            v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_req)"
            class="edit-btn el-icon-edit"
            @click="setBrandNameEdit"
          ></i>
        </span>
        <span
          >预算：<b v-show="!budgetEdit">¥{{ budget }}</b>
          <el-input
            ref="budgetEdit"
            v-show="budgetEdit"
            size="mini"
            class="w90"
            v-model="budget"
            maxlength="9"
            @keyup.enter.native="editRequirement"
            @blur="editRequirement"
          ></el-input>
          <i
            v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_req)"
            class="edit-btn el-icon-edit"
            @click="setBudgetEdit"
          ></i>
        </span>
        <span
          >提报日期:<b>{{ report_date }}</b></span
        >
      </div>
      <i class="el-icon-arrow-left" @click="$router.back()"></i>
    </el-row>
    <el-row class="detail-table-wrapper">
      <el-row class="btn-wrapper">
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.add_req)"
          type="primary"
          size="small"
          @click="goPlan"
          >新增方案</el-button
        >
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.view_req_list)"
          size="small"
          @click="output"
          >批量导出</el-button
        >
      </el-row>
      <el-table
        stripe
        :data="plans"
        :header-row-style="{ fontSize: '14px' }"
        :header-cell-style="{
          background: '#f0f1f2',
          height: '50px',
          color: 'var(--text-second-color)',
        }"
        class="detail-table"
        :row-style="{ height: '60px' }"
        @selection-change="handleSelectionChange"
        :height="tableHeight + ''"
      >
        <el-table-column type="selection" width="50" :selectable="row => row.status === 1" />
        <el-table-column label="序号" align="center" width="80">
          <template v-slot="scope">
            <div>
              {{ scope.$index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="plan_name" label="方案名称">
          <template v-slot="scope">
            <div class="edit-box">
              <span v-show="editingId !== scope.row.plan_id">{{ scope.row.plan_name }}</span>
              <el-input
                :ref="'input_' + scope.row.plan_id"
                v-if="editingId === scope.row.plan_id"
                size="mini"
                v-model="scope.row.plan_name"
                placeholder="请输入内容"
                @focus="focus(scope.row)"
                @keyup.enter.native="onInputBlur(scope.row)"
                @blur="onInputBlur(scope.row)"
              ></el-input>
              <i
                v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_req)"
                v-show="editingId !== scope.row.plan_id"
                class="edit-btn el-icon-edit"
                @keyup.enter.native="onEditClick(scope.row.plan_id)"
                @click.stop="onEditClick(scope.row.plan_id)"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="star_count" label="已选主播/个" align="center"></el-table-column>
        <el-table-column prop="create_date" label="方案生成日期" align="center" min-width="95" />
        <el-table-column prop="create_by" label="方案生成人" align="center"></el-table-column>
        <el-table-column label="生成状态">
          <template v-slot="scope">
            <div class="icon-status status1" v-if="scope.row.status">已生成</div>
            <div class="icon-status status2" v-else>生成中</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-tooltip
                class="item"
                effect="light"
                content="匹配主播"
                placement="top"
                v-if="!scope.row.status"
              >
                <i
                  v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_req)"
                  class="icon-match"
                  @click="goPlan(scope.row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="light"
                content="查看主播"
                placement="top"
                v-if="scope.row.status"
              >
                <i class="icon-look" @click="viewSelectedStars(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除方案" placement="top">
                <i
                  v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_req)"
                  class="el-icon-delete"
                  @click="handleDeletePlan(scope.row)"
                ></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-box no_data" style="padding: 40px 0">
            <img src="@/assets/img/anchor_nodata.png" />
            <p>暂时木有内容呀~</p>
          </div>
        </template>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          :page-sizes.sync="pagination.pageSizes"
          layout="prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-row>
    <el-dialog
      class="dialog-star-list"
      width="890px"
      :visible.sync="lookStarVisible"
      @close="lookStarVisible = false"
      title="查看主播"
      top="10vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <div class="star-tips">
          已选主播：<b>{{ starList.length }}人</b>
        </div>
        <ul class="anchor-list-wrapper">
          <li class="add-anchor anchor-item" @click="continueAddAnchor">
            <i class="el-icon-circle-plus-outline"></i>
            <p>添加主播</p>
          </li>
          <li
            class="anchor-item"
            v-for="(anchor, index) in starList"
            :key="index"
            @click="goStar(anchor)"
          >
            <div class="anchor-avatar">
              <img :src="anchor.pic_url" :alt="anchor.star_info" />
            </div>
            <div class="anchor-text">
              <p class="nickname">{{ anchor.star_info }}</p>
              <p class="anchorid">{{ anchor.id }}</p>
              <p class="starcat">{{ anchor.star_cat }}</p>
            </div>
            <i class="delete-anchor-btn el-icon-delete" @click.stop="showDeleteMask(anchor.id)"></i>
            <div class="delete-mask" v-show="deleteMaskShowId === anchor.id">
              <el-button size="mini" @click.stop="deleteMaskShowId = null">取消</el-button>
              <el-button
                type="danger"
                size="mini"
                @click.stop="deletePlanAnchor(anchor.id)"
                style="background: #f26467"
                >删除</el-button
              >
            </div>
          </li>
        </ul>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" size="small" @click="lookStarVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import {
  requirementDetail,
  updateRequirement,
  queryBrand,
  deleteRequirementPlan,
  viewSelectedStars,
  updateRequirementPlanName,
  deletePlanAnchor,
} from '@/api/brand';
import { getToken } from '@/utils/token';
import { RIGHT_CODE } from '@/const/roleCode';
import { RouterNameProjectManage } from '@/const/router';

export default {
  data() {
    return {
      RIGHT_CODE,
      tableHeight: 500,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 10,
      },
      // 需求编辑
      requirementNameEdit: false,
      // 品牌名编辑
      brandNameEdit: false,
      // 预算编辑
      budgetEdit: false,
      requirementId: null,
      requirement_name: '',
      brand_name: '',
      report_date: '',
      budget: '',
      plans: [],
      brandList: [],
      // 当前编辑id
      editingId: null,
      starList: [],
      lookStarVisible: false,
      // 被选中的数据
      selectList: [],
      // 查看主播弹窗中的方案id
      planIdOfShowing: null,
      deleteMaskShowId: null,
    };
  },
  created() {
    if (this.$route.params.id) {
      this.requirementId = this.$route.params.id;
      this.requirementDetail();
      this.queryBrand();
    } else {
      this.$router.back();
    }
  },
  mounted() {
    // this.setHeight()
  },
  methods: {
    queryBrand() {
      const params = {
        page: 1,
        page_size: 0,
      };
      queryBrand(params).then(res => {
        if (res.data.success) {
          this.brandList = res.data.data.data;
        }
      });
    },
    // 获取需求详情
    requirementDetail() {
      const params = {
        requirement_id: this.requirementId,
      };
      requirementDetail(params).then(res => {
        if (res.data.success) {
          const data = res.data.data;
          this.requirement_name = data.requirement_name;
          this.brand_name = data.brand_name;
          this.report_date = data.report_date;
          this.budget = data.budget;
          this.plans = data.plans;
          this.brand_id = data.brand_id;
        }
      });
    },
    setRequirementNameEdit() {
      this.requirementNameEdit = true;
      this.lastRequirementName = this.requirement_name;
      this.$nextTick(_ => {
        // this.$refs.requirementNameEdit.$refs.input.focus()
        this.$refs.requirementNameEdit.focus();
      });
    },
    setBrandNameEdit() {
      this.brandNameEdit = true;
      this.$nextTick(_ => {
        this.$refs.brandNameEdit.focus();
      });
    },
    setBudgetEdit() {
      this.budgetEdit = true;
      this.lastBudget = this.budget;
      this.$nextTick(_ => {
        this.$refs.budgetEdit.focus();
      });
    },
    brandChange(val) {
      let obj = {};
      obj = this.brandList.find(item => {
        return item.brand_name === val;
      });
      this.brand_id = obj.id;
      this.editRequirement();
    },
    brandBlur() {
      this.brandNameEdit = false;
    },
    // 编辑需求
    editRequirement() {
      this.budget = (this.budget + '').replace(/[^.\d]/g, '');
      if (!this.budget) {
        this.budget = this.lastBudget;
        this.requirementNameEdit = false;
        this.brandNameEdit = false;
        this.budgetEdit = false;
        return;
      }
      const params = {
        requirement_id: this.requirementId,
        budget: this.budget,
        requirement_name: this.requirement_name,
        brand_id: this.brand_id,
      };
      this.requirementNameEdit = false;
      this.brandNameEdit = false;
      this.budgetEdit = false;
      updateRequirement(params).then(res => {
        if (!res.data.success) {
          this.$message.error(res.data.message);
          this.requirement_name = this.lastRequirementName;
        }
      });
    },
    focus(row) {
      this.planName = row.plan_name;
    },
    // 需求名称失焦
    onInputBlur(row) {
      this.editingId = null;
      // 修改方案名
      const params = {
        plan_id: row.plan_id,
        plan_name: row.plan_name,
      };
      updateRequirementPlanName(params).then(res => {
        if (!res.data.success) {
          this.$message.error(res.data.message);
          row.plan_name = this.planName;
        }
      });
    },
    // 点击编辑按钮
    onEditClick(editingId) {
      // debugger
      this.editingId = editingId;
      this.$nextTick(() => {
        this.$refs['input_' + editingId].$refs.input.focus();
      });
    },
    handleDeletePlan(row) {
      this.$confirm('此操作将永久删除数据，是否继续', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const params = {
            plan_id: row.plan_id,
          };
          deleteRequirementPlan(params).then(res => {
            const result = res.data;
            if (result.success) {
              // this.$gmMessage(result.message)
              this.$gmMessage('删除成功');
              this.requirementDetail();
            } else {
              this.$gmMessage(result.message, 'tip');
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    // 查看方案选中的主播
    viewSelectedStars(row) {
      this.planIdOfShowing = row.plan_id;
      const params = {
        plan_id: row.plan_id,
      };
      viewSelectedStars(params).then(res => {
        if (res.data.success) {
          this.lookStarVisible = true;
          this.starList = res.data.data;
        }
      });
    },
    goStar(author) {
      // this.$router.push({
      //   path: '/star-personal',
      //   query: {
      //     starName: author.starInfo
      //   }
      // })
      // window.open('/data/product-info?starName=' + author.star_info)
      window.open('/operation-center/product-management?starName=' + author.star_info);
    },
    // 新增方案
    goPlan(row) {
      const query = {
        rid: this.requirementId,
      };
      if (row) {
        query.pid = row.plan_id;
      }
      this.$router.push({
        name: RouterNameProjectManage.marketing.matchAnchor,
        query,
      });
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    // 批量导出
    output() {
      if (this.selectList.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择需要导出的方案',
        });
      }

      const ids = this.selectList.map(item => item.plan_id);
      const token = getToken();
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/brand2/export_plan?ids=${JSON.stringify(
          ids,
        )}&Authorization=${token}`,
      );
    },
    // 删除方案中的主播
    deletePlanAnchor(starIds) {
      deletePlanAnchor({
        plan_id: this.planIdOfShowing,
        star_ids: JSON.stringify([starIds]),
      }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message);
          // 重新获取主播列表
          viewSelectedStars({
            plan_id: this.planIdOfShowing,
          }).then(res => {
            if (res.data.success) {
              this.starList = res.data.data;
            }
          });
          this.requirementDetail();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 继续添加主播
    continueAddAnchor() {
      this.$router.push({
        name: RouterNameProjectManage.marketing.matchAnchor,
        query: {
          rid: this.requirementId,
          pid: this.planIdOfShowing,
        },
      });
    },
    // 显示删除遮罩
    showDeleteMask(id) {
      this.deleteMaskShowId = id;
    },
    setHeight() {
      this.tableHeight = window.innerHeight - 300;
      console.log(this.tableHeight);
    },
    handleCurrentChange() {
      /* do nth */
    },
    handleSizeChange() {
      /* do nth */
    },
  },
};
</script>
<style lang="less">
.requirement-detail-container {
  .dialog-star-list {
    .el-dialog__body {
      padding: 30px 10px;
      padding-top: 0;
    }
    .el-dialog__footer {
      border-top: 1px solid #f2f2f2;
      padding: 20px 0;
    }
  }
  .nobrandNameEdit {
    width: 0 !important;
    padding: 0;
    overflow: hidden;
    height: 0 !important;
  }
}
</style>
<style lang="less" scoped>
.requirement-detail-container {
  right: 10px;
  display: flex;
  flex-direction: column;
  background: #f4f5f6;
  .detail-table-wrapper {
    flex: 1;
    background: #fff;
    padding: 12px;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    .detail-table {
      flex: 1;
      .el-table__body-wrapper {
        height: 100%;
      }
    }
    .pagination-wrapper {
      margin-top: 14px;
    }
  }
  .edit-btn {
    margin-left: 4px;
    color: #cacbd1;
    cursor: pointer;
    &:hover {
      color: #396fff;
    }
  }
  .detail-text-box {
    background: #fff;
    padding: 20px 36px 20px;
    position: relative;
    .el-icon-arrow-left {
      position: absolute;
      top: 25px;
      left: 12px;
      font-size: 18px;
      color: var(--text-des-color);
      cursor: pointer;
    }
    .text-name {
      font-size: 16px;
      font-weight: 600;
      color: #666;
      line-height: 30px;
      height: 30px;
      span {
        cursor: pointer;
      }
    }
    .text-info {
      margin-top: 15px;
      font-size: 14px;
      font-weight: 400;
      color: #666;
      line-height: 24px;
      height: 24px;
      span {
        margin-right: 50px;
      }
      b {
        color: var(--text-des-color);
        font-weight: 400;
      }
    }
    .text-input {
      width: 180px;
    }
    .w90 {
      width: 90px;
    }
  }
  .detail-table {
    margin-top: 12px;
  }
  .icon-status {
    &::before {
      width: 8px;
      height: 8px;
      display: inline-block;
      background: #396fff;
      content: '';
      border-radius: 50%;
      vertical-align: top;
      margin-top: 7px;
    }
    &.status1 {
      color: #666;
    }
    &.status2 {
      color: var(--text-des-color);
      &::before {
        background: var(--text-des-color);
      }
    }
  }
  .icon-match,
  .icon-look {
    display: inline-block;
    cursor: pointer;
  }
  .icon-match {
    width: 34px;
    height: 34px;
    background: url('images/icon_sprites.png') -10px -64px;
    &:hover {
      background: url('images/icon_sprites.png') -64px -64px;
    }
  }
  .icon-look {
    width: 34px;
    height: 34px;
    background: url('images/icon_sprites.png') -10px -10px;
    &:hover {
      background: url('images/icon_sprites.png') -64px -10px;
    }
  }
  .el-icon-delete {
    vertical-align: top;
    display: inline-block;
    color: #bfc1c8;
    font-size: 24px;
    line-height: 34px;
    cursor: pointer;
    &:hover {
      color: #396fff;
    }
  }
  .star-tips {
    padding: 10px 0 20px 0;
    color: #666;
    font-size: 14px;
    font-weight: 600;
    b {
      color: #396fff;
    }
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .anchor-list-wrapper {
    font-size: 0;
    max-height: 220px;
    overflow: auto;
  }
  .anchor-item {
    width: 210px;
    height: 98px;
    background: #fff;
    border-bottom: 1px solid #eaeef1;
    border-right: 1px solid #eaeef1;
    font-size: 0;
    position: relative;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      border-top: 1px solid #eaeef1;
    }
    &:nth-child(4n + 1) {
      border-left: 1px solid #eaeef1;
    }
    &:hover {
      background: #f7f7f7;
    }
    .anchor-avatar {
      width: 44px;
      height: 44px;
      display: inline-block;
      vertical-align: top;
      margin: 28px 0 0 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .anchor-text {
      margin: 24px 0 0 9px;
      display: inline-block;
      font-size: 14px;
      width: 127px;
      line-height: 1;
      .nickname {
        font-size: 14px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .anchorid {
        margin-top: 5px;
        font-size: 12px;
        color: #666;
      }
      .starcat {
        margin-top: 4px;
        font-size: 12px;
        line-height: 14px;
        color: #b0b0b0;
      }
    }
    .delete-anchor-btn {
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 16px;
      display: none;
    }
    &:hover .delete-anchor-btn {
      display: block;
    }
    .delete-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      padding-top: 18%;
    }
  }
  .add-anchor {
    text-align: center;
    i {
      font-size: 28px;
      color: #aaa;
      margin-top: 21px;
    }
    p {
      font-size: 14px;
      color: #aaa;
    }
  }
}
</style>
