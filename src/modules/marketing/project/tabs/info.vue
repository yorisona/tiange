<template>
  <div class="tg-marketing-project-detail-info">
    <div class="amount-stat-block">
      <div class="amount-block">
        <span>销售金额</span>
        <div class="amount">{{ ProjectDetail.sale_amount_str }}</div>
      </div>
      <div class="amount-block">
        <span style="display: inline-block">收款金额</span>
        <div style="display: inline-block; margin-left: 5px">
          <el-popover
            popper-class="question-tips-popper"
            placement="top"
            trigger="hover"
            content="登记的业绩总金额减去退款金额"
          >
            <template slot="reference">
              <tg-icon name="ico-question"></tg-icon>
            </template>
          </el-popover>
        </div>
        <div class="amount">{{ ProjectDetail.gather_amount_str }}</div>
      </div>
      <div class="amount-block">
        <span style="display: inline-block">待收款金额</span>
        <div style="display: inline-block; margin-left: 5px">
          <el-popover
            popper-class="question-tips-popper"
            placement="top"
            trigger="hover"
            content="销售金额减去收款金额"
          >
            <template slot="reference">
              <tg-icon name="ico-question"></tg-icon>
            </template>
          </el-popover>
        </div>
        <div class="amount">{{ ProjectDetail.wait_gather_amount_str }}</div>
      </div>
      <div class="amount-block">
        <span style="display: inline-block">成本安排金额 </span>
        <div style="display: inline-block; margin-left: 5px">
          <el-popover
            popper-class="question-tips-popper"
            placement="top"
            trigger="hover"
            content="登记的成本安排总金额"
          >
            <template slot="reference">
              <tg-icon name="ico-question"></tg-icon>
            </template>
          </el-popover>
        </div>
        <div class="amount">{{ ProjectDetail.cost_amount_str }}</div>
      </div>
      <div class="amount-block">
        <span style="display: inline-block">退款金额 </span>
        <div style="display: inline-block; margin-left: 5px">
          <el-popover
            popper-class="question-tips-popper"
            placement="top"
            trigger="hover"
            content="退款审批通过的退款金额"
          >
            <template slot="reference">
              <tg-icon name="ico-question"></tg-icon>
            </template>
          </el-popover>
        </div>
        <div class="amount">{{ ProjectDetail.refund_total_amount_str }}</div>
      </div>
    </div>
    <hr class="hr-line" />
    <div class="project-info-block">
      <div class="project-info-title">
        项目名称：<DefText :content="ProjectDetail.cooperation_name" />（{{
          ProjectDetail.cooperation_uid
        }})
        <span
          v-if="Permission.canSaveProject"
          @click="toggleMarketingProjectModalVisible(true)"
          style="cursor: pointer; margin-left: 18px; display: inline-block; font-size: 14px"
        >
          <el-popover popper-class="edit-btn-popper" placement="top" trigger="hover" content="编辑">
            <template slot="reference">
              <tg-icon
                class="ico-edit-btn"
                name="ico-edit"
                style="font-size: 20px; width: 16px; height: 16px"
              ></tg-icon>
            </template>
          </el-popover>
        </span>
      </div>
      <div class="project-info">
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">公司名称：</div>
            <div
              class="base-grid-item-content"
              style="cursor: pointer"
              @click="jumptoCompanyDetailPage(ProjectDetail.company_id)"
            >
              <el-popover slot placement="top" trigger="hover">
                <span v-if="ProjectDetail.company_name">
                  {{ ProjectDetail.company_name }}
                </span>
                <!-- <span v-else>
                  店铺尚未关联到公司，请到<a
                    :href="'/customer/shop/' + ProjectDetail.customer_id"
                    target="_blank"
                    >店铺详情</a
                  >编辑，并关联到所属的公司
                </span> -->
                <p
                  style="color: var(--theme-color); cursor: pointer"
                  class="line-clamp-1"
                  slot="reference"
                >
                  {{ ProjectDetail.company_name || '--' }}
                </p>
              </el-popover>
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">所属部门：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.feishu_department_name }}</div>
          </div>
          <!-- <div class="base-grid-item">
            <div class="base-grid-item-lbl">店铺名称：</div>
            <div class="base-grid-item-content">
              <el-popover placement="top" trigger="hover" :content="ProjectDetail.shop_name">
                <p style="cursor: pointer" class="line-clamp-1" slot="reference">
                  {{ ProjectDetail.shop_name }}
                </p>
              </el-popover>
            </div>
          </div> -->
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">品牌名称：</div>
            <div class="base-grid-item-content">
              <el-popover placement="top" trigger="hover" :content="ProjectDetail.brand_name">
                <p style="cursor: pointer" class="line-clamp-1" slot="reference">
                  {{ ProjectDetail.brand_name }}
                </p>
              </el-popover>
            </div>
          </div>

          <div class="base-grid-item">
            <div class="base-grid-item-lbl">客户经理：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.manager_name }}</div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">合作类型：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.cooperation_type_str }}</div>
          </div>
          <!-- <div class="base-grid-item">
            <div class="base-grid-item-lbl">客户分类：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.customer_class_str }}</div>
          </div> -->
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">客户类型：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.company_type_str }}</div>
          </div>
          <!-- <div class="base-grid-item">
            <div class="base-grid-item-lbl">店铺类目：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.category_str }}</div>
          </div> -->

          <div class="base-grid-item">
            <div class="base-grid-item-lbl">是否收款：</div>
            <div class="base-grid-item-content">{{ ProjectDetail.is_gather_str }}</div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">回款日期：</div>
            <div class="base-grid-item-content">
              <span v-if="ProjectDetail.is_gather === 1">--</span>
              <span v-if="ProjectDetail.is_gather === 0">{{ ProjectDetail.gather_date_str }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="base-grid-item" style="width: 100%; margin-top: 12px">
        <div class="base-grid-item-lbl flex-none">备注：</div>
        <div class="base-grid-item-content">
          <DefText :content="ProjectDetail.remark" />
        </div>
      </div>
      <div class="line mgt-18 mgb-6"></div> -->

      <!-- <div class="project-plan-block">
        <div class="project-plan-name">方案</div>
        <div
          class="project-plan-file-block"
          style="color: #a4b2c2; height: 20px; line-height: 20px"
          v-if="ProjectDetail.planList.length <= 0"
        >
          未上传方案
        </div>
        <div class="project-plan-file-block" v-if="ProjectDetail.planList.length > 0">
          <div
            class="project-plan-file-item"
            v-for="(item, index) in ProjectDetail.planList"
            :key="index"
          >
            <tg-icon
              slot="icon"
              :name="`ico-${item.icon}`"
              style="font-size: 20px; width: 20px; height: 20px; margin-right: 2px"
            />{{ item.filename
            }}<span
              style="color: var(--theme-color); cursor: pointer; margin-left: 12px"
              @click="downloadCaseBtnClick(item.filepath)"
              >下载</span
            >
          </div>
        </div>
      </div> -->
      <!-- <hr class="hr-line" />
      <div class="customer-demand-block">
        <div class="customer-demand-name">客户需求</div>
        <div class="customer-demand">
          <div class="base-grid">
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">预算：</div>
              <div class="base-grid-item-content">{{ ProjectDetail.budget_str }}</div>
            </div>
            <div class="base-grid-item"></div>
            <div class="base-grid-item"></div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">GMV要求：</div>
              <div class="base-grid-item-content">
                {{ ProjectDetail.gmv_str
                }}<font color="#A4B2C2">（ROI：{{ ProjectDetail.roi_str }}）</font>
              </div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">UV要求：</div>
              <div class="base-grid-item-content">
                {{ ProjectDetail.uv_str }}
                <font color="#A4B2C2">（UV单价：{{ ProjectDetail.per_uv_str }}）</font>
              </div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">PV要求：</div>
              <div class="base-grid-item-content">
                {{ ProjectDetail.pv_str }}
                <font style="color: #a4b2c2">（PV单价：{{ ProjectDetail.per_pv_str }}）</font>
              </div>
            </div>
          </div>
        </div>
        <div class="base-grid-item" style="width: 100%; margin-top: 12px">
          <div class="base-grid-item-lbl flex-none">其他要求：</div>
          <div class="base-grid-item-content">
            <DefText :content="ProjectDetail.note" />
          </div>
        </div>
      </div> -->
    </div>

    <!-- 编辑项目  -->
    <MarketingProjectDialog
      title="编辑项目"
      isEditForm
      :project="currentProject"
      :visible="ProjectFormVisible"
      @dialog:close="onProjectFormModalClose"
    />
  </div>
</template>

<script src="./info.ts"></script>

<style lang="less">
@import './info.less';
</style>
