<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#matchanchor {
  min-width: 1051px;
  .match-header {
    background: #fbfbfb;
    line-height: 50px;
    padding-left: 20px;
    .title {
      color: #666;
      font-size: 16px;
      font-weight: 600;
    }
    .amount {
      margin-left: 40px;
      font-size: 14px;
      color: var(--text-des-color);
      .budget-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(../../assets/img/anchor_sprite_icon.png);
        background-position: -6px -71px;
        margin-bottom: -4px;
        margin-right: 5px;
      }
    }
    .header-search {
      width: initial;
      float: right;
      width: 300px;
      margin-right: 13px;
      .el-icon-search {
        cursor: pointer;
        margin-right: 5px;
      }
    }
  }
  .match-content {
    background: #fff;
    padding: 0 12px 13px;
    .checked-conditions {
      // height: 50px;
      // line-height: 50px;
      padding-right: 90px;
      position: relative;
      padding-bottom: 16px;
      .label-text {
        color: var(--text-des-color);
        font-size: 12px;
        margin-top: 16px;
        display: inline-block;
      }
      .clear-condition-btn {
        float: right;
        color: #b8b8b8;
        line-height: 26px;
        position: absolute;
        right: 13px;
        top: 0;
      }
      .el-tag {
        margin-right: 4px;
        margin-top: 16px;
        .el-icon-close:hover {
          background-color: #5c82ff;
        }
      }
    }
    .all-conditions {
      border: #eff0f1 solid 1px;
      margin-bottom: 13px;
      .condition {
        position: relative;
        line-height: 50px;
        border-bottom: #eff0f1 dashed 1px;
        .label-text {
          position: absolute;
          left: 0;
          top: 0;
          line-height: 50px;
          display: inline-block;
          width: 110px;
          text-align: right;
          color: var(--text-des-color);
        }
        .options-wrap {
          padding-left: 110px;
          position: relative;
          padding-right: 86px;
          .el-button {
            margin: 0 10px 0 0;
          }
          .sub-options {
            position: absolute;
            left: 110px;
            background: #f5f5f5;
            padding-left: 10px;
            width: calc(100% - 130px);
            z-index: 99;
            .triangle {
              display: block;
              content: ' ';
              border: #f5f5f5 solid 5px;
              position: absolute;
              border-top-color: transparent;
              border-left-color: transparent;
              border-right-color: transparent;
              top: -10px;
            }
          }
          .marginBtm50 {
            margin-bottom: 60px;
          }
        }
        .collapse-btn {
          position: absolute;
          top: 0;
          right: 13px;
          margin-top: 12px;
        }
        .custom-condition {
          position: absolute;
          right: 0;
          top: 0;
          // float: right;
          color: var(--text-des-color);
          .el-input {
            width: 80px;
          }
        }
      }
    }
    .tables {
      overflow: hidden;
      ::v-deep .el-table th.gutter {
        background: rgb(245, 246, 249);
      }
      .anchor-info {
        text-align: left;
        position: relative;
        padding-right: 14px;
        overflow: hidden;
        cursor: pointer;
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          float: left;
        }
        .info {
          margin-left: 9px;
          width: calc(100% - 53px);
          float: left;
          .anchor-name {
            width: calc(100% - 14px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .anthor-id {
            font-size: 12px;
            line-height: 15px;
          }
          .anthor-category {
            font-size: 12px;
            color: #b0b0b0;
          }
        }
        .view-icon {
          display: none;
          width: 14px;
          height: 10px;
          background: url(../../assets/img/anchor_sprite_icon.png);
          background-position: -7px -23px;
          position: absolute;
          right: 0;
          top: 6px;
        }
        &:hover .view-icon {
          background-position: -21px -23px;
        }
      }
      .fans-portrait {
        font-size: 12px;
        color: #666;
        position: relative;
        padding-right: 5px;
        cursor: pointer;
        .view-icon {
          display: none;
          width: 14px;
          height: 10px;
          background: url(../../assets/img/anchor_sprite_icon.png);
          background-position: -7px -23px;
          position: absolute;
          right: -10px;
          top: 6px;
        }
        &:hover .view-icon {
          background-position: -21px -23px;
        }
      }
      .into-store-count {
        color: $color-primary;
      }
      .anchor-cost {
        span {
          color: var(--text-des-color);
          font-size: 12px;
          line-height: 10px;
        }
        p {
          color: #666;
          font-size: 14px;
          line-height: 10px;
        }
      }
      .selected-anchors {
        border: #e8eaef solid 1px;
        .selected-header {
          line-height: 48px;
          background: #f5f6f9;
          padding: 0 20px;
          .label-text {
            color: #666;
            em {
              font-style: normal;
              color: $color-primary;
            }
          }
          .clear-selected-anchors-btn {
            float: right;
            line-height: 24px;
            color: #b0b2b9;
          }
        }
        .selected-list {
          height: 500px;
          overflow: auto;
          width: 100%;
          .anchor-info {
            padding: 20px;
            overflow: hidden;
            color: #666;
            position: relative;
            width: calc(100% - 40px);
            border-bottom: #f5f8fa solid 1px;
            &:hover {
              background-color: #f8faff;
            }
            .avatar {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              float: left;
            }
            .info {
              margin-left: 9px;
              width: calc(100% - 53px);
              float: left;
              .anchor-name {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .anthor-id {
                font-size: 12px;
                line-height: 15px;
              }
              .anthor-category {
                font-size: 12px;
                color: #b0b0b0;
              }
            }
            .delete-btn {
              position: absolute;
              right: 20px;
              top: 30px;
              display: inline-block;
              width: 34px;
              height: 34px;
              border-radius: 2px;
              line-height: 43px;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s;
              &:hover {
                background: #ecf0ff;
                i {
                  color: $color-primary;
                }
              }
              i {
                font-size: 24px;
                color: #bfc1c8;
                transition: all 0.3s;
              }
            }
          }
        }
        .no-data {
          height: 364px;
          .placeholder {
            width: 210px;
            height: 143px;
            margin: 136px auto 0;
            background: url(../../assets/img/anchor_sprite_icon.png);
            background-position: -46px -47px;
          }
          p {
            color: #a9a6aa;
            font-size: 14px;
            text-align: center;
            margin-top: 20px;
          }
        }
      }
    }
    .footer-btns {
      text-align: center;
      height: 96px;
      line-height: 96px;
    }
  }
  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #f8faff;
    .view-icon {
      display: block;
    }
  }
  ::v-deep .el-message-box .el-message-box__content .el-message-box__message {
    position: initial;
  }
  .empty p {
    color: #a9a6aa;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<template>
  <div id="matchanchor">
    <steps :active="1" />
    <div class="match-header">
      <span class="title">匹配主播</span>
      <span class="amount" v-if="requirementDetail"
        ><em class="budget-icon"></em>预算：￥{{ requirementDetail.budget }}</span
      >
      <el-input
        placeholder="输入主播名称"
        class="header-search"
        size="small"
        v-model="conditions.name"
      >
        <template #suffix>
          <i class="el-icon-search" @click="handleSearchIconClick"></i>
        </template>
      </el-input>
    </div>
    <div class="match-content">
      <div class="checked-conditions">
        <span class="label-text">已选条件：</span>
        <el-tag
          v-if="conditions.name !== ''"
          size="mini"
          type="info"
          closable
          @close="handleTagClose('name')"
          >{{ conditions.name }}</el-tag
        >
        <el-tag
          v-if="conditions.category !== ''"
          size="mini"
          type="info"
          closable
          @close="handleTagClose('category')"
          >{{ conditions.category }}</el-tag
        >
        <el-tag
          v-for="(sub, idx) in conditions.subCategories"
          :key="idx"
          size="mini"
          type="info"
          closable
          @close="handleTagClose('subCategories', sub)"
          >{{ sub }}</el-tag
        >
        <el-tag
          v-if="computeFansNumberText !== ''"
          size="mini"
          type="info"
          closable
          @close="handleTagClose('fansNumber')"
          >{{ computeFansNumberText }}</el-tag
        >
        <el-tag
          v-for="(age, idx) in conditions.age"
          :key="idx"
          size="mini"
          type="info"
          closable
          @close="handleTagClose('age', age)"
          >{{ age }}</el-tag
        >
        <el-tag
          v-if="conditions.gander !== ''"
          size="mini"
          type="info"
          closable
          @close="handleTagClose('gander')"
          >{{ conditions.gander }}</el-tag
        >
        <el-button
          class="clear-condition-btn"
          type="text"
          icon="el-icon-delete"
          @click="clearAllConditions"
          >清空条件</el-button
        >
      </div>
      <div class="all-conditions">
        <div class="condition">
          <span class="label-text">所属类目：</span>
          <div class="options-wrap">
            <el-button
              :type="conditions.category === '' ? 'primary' : ''"
              size="mini"
              round
              @click="onAllCategoriesClick"
              >全部</el-button
            >
            <el-button
              v-for="(cate, idx) in cate"
              :key="idx"
              :data-index="idx"
              :class="['primary-cate', isCollapse === idx + '' ? 'marginBtm50' : '']"
              size="mini"
              @click="onPrimaryCategoryClick"
              :type="conditions.category === cate[0] ? 'primary' : ''"
              round
              >{{ cate[0] }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <div
              class="sub-options"
              v-show="isCollapse !== ''"
              :style="`top: ${subOptionsTopDiscount}px;`"
            >
              <el-button
                v-for="(subcate, idx) in selectedSubCate"
                :key="idx"
                size="mini"
                round
                @click="onSubCategoryClick"
                :type="conditions.subCategories.includes(subcate) ? 'primary' : ''"
                >{{ subcate }}</el-button
              >
              <div class="triangle" :style="`left: ${triangleLeftDiscount}px;`"></div>
            </div>
          </div>
          <el-button
            v-show="isCollapse !== ''"
            @click="onCollapseClick"
            class="collapse-btn"
            type="text"
            size="mini"
            round
            >收起<i class="el-icon-arrow-up el-icon--right"></i
          ></el-button>
        </div>
        <div class="condition">
          <span class="label-text">粉丝数：</span>
          <div class="options-wrap">
            <el-button
              :type="computeFansNumberText === '' ? 'primary' : ''"
              size="mini"
              round
              @click="onFansNumberClick(null, null)"
              >不限</el-button
            >
            <el-button
              :type="computeFansNumberText === '100万以上' ? 'primary' : ''"
              size="mini"
              round
              @click="onFansNumberClick(100, null)"
              >100万以上</el-button
            >
            <el-button
              :type="computeFansNumberText === '50-100万' ? 'primary' : ''"
              size="mini"
              round
              @click="onFansNumberClick(50, 100)"
              >50-100万</el-button
            >
            <el-button
              :type="computeFansNumberText === '30-50万' ? 'primary' : ''"
              size="mini"
              round
              @click="onFansNumberClick(30, 50)"
              >30-50万</el-button
            >
            <el-button
              :type="computeFansNumberText === '10-30万' ? 'primary' : ''"
              size="mini"
              round
              @click="onFansNumberClick(10, 30)"
              >10-30万</el-button
            >
            <el-button
              :type="computeFansNumberText === '10万以下' ? 'primary' : ''"
              size="mini"
              round
              @click="onFansNumberClick(null, 10)"
              >10万以下</el-button
            >
            <div class="custom-condition">
              <span class="custom-text">自定义</span>
              <el-input size="mini" v-model="CustomFansNumber.min">
                <template #suffix>
                  <span>万</span>
                </template>
              </el-input>
              -
              <el-input size="mini" v-model="CustomFansNumber.max">
                <template #suffix>
                  <span>万</span>
                </template>
              </el-input>
              <el-button size="mini" @click="onCustomFansNumber">确定</el-button>
            </div>
          </div>
        </div>
        <div class="condition">
          <span class="label-text">粉丝年龄：</span>
          <div class="options-wrap">
            <el-button
              :type="conditions.age.length > 0 ? '' : 'primary'"
              size="mini"
              round
              @click="onAgeClick"
              >不限</el-button
            >
            <el-button
              :type="conditions.age.includes('00后') ? 'primary' : ''"
              size="mini"
              round
              @click="onAgeClick"
              >00后</el-button
            >
            <el-button
              :type="conditions.age.includes('95后') ? 'primary' : ''"
              size="mini"
              round
              @click="onAgeClick"
              >95后</el-button
            >
            <el-button
              :type="conditions.age.includes('85后') ? 'primary' : ''"
              size="mini"
              round
              @click="onAgeClick"
              >85后</el-button
            >
            <el-button
              :type="conditions.age.includes('75后') ? 'primary' : ''"
              size="mini"
              round
              @click="onAgeClick"
              >75后</el-button
            >
            <el-button
              :type="conditions.age.includes('65后') ? 'primary' : ''"
              size="mini"
              round
              @click="onAgeClick"
              >65后</el-button
            >
          </div>
        </div>
        <div class="condition">
          <span class="label-text">粉丝性别：</span>
          <div class="options-wrap">
            <el-button
              :type="conditions.gander === '' ? 'primary' : ''"
              size="mini"
              round
              @click="onGanderSelected"
              >不限</el-button
            >
            <el-button
              :type="conditions.gander === '偏男性' ? 'primary' : ''"
              size="mini"
              round
              @click="onGanderSelected"
              >偏男性</el-button
            >
            <el-button
              :type="conditions.gander === '偏女性' ? 'primary' : ''"
              size="mini"
              round
              @click="onGanderSelected"
              >偏女性</el-button
            >
          </div>
        </div>
        <div class="condition">
          <span class="label-text">内容观看次数：</span>
          <div class="options-wrap">
            <el-select
              v-model="conditions.viewCount"
              placeholder="请选择"
              size="mini"
              style="width: 160px"
              @change="onViewCountChange"
            >
              <el-option label="7日数据" value="7"></el-option>
              <el-option label="30日数据" value="30"></el-option>
              <el-option label="90日数据" value="90"></el-option>
            </el-select>
            <span class="label-text" style="width: 150px; position: relative"
              >内容引导进店次数：</span
            >
            <el-select
              v-model="conditions.intoStoreCount"
              placeholder="请选择"
              size="mini"
              style="width: 160px"
              @change="onIntoStoreCountChange"
            >
              <el-option label="7日数据" value="7"></el-option>
              <el-option label="30日数据" value="30"></el-option>
              <el-option label="90日数据" value="90"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="tables">
        <el-table
          stripe
          ref="multipleTable"
          :data="anchorsData"
          tooltip-effect="dark"
          style="width: 68%; float: left"
          :header-cell-style="{
            background: '#F5F6F9',
            height: '50px',
            color: 'var(--text-second-color)',
          }"
          @select="onRowSelected"
          @select-all="onSelectedAll"
          v-loading="loading"
          height="553"
        >
          <el-table-column type="selection" width="30"> </el-table-column>
          <el-table-column prop="index" label="序号" align="center" width="50"> </el-table-column>
          <el-table-column
            prop="star_info"
            label="主播信息"
            align="center"
            width="200"
            :render-header="anthorTipInfo"
          >
            <template v-slot="scope">
              <div class="anchor-info">
                <img
                  class="avatar"
                  :src="scope.row.pic_url"
                  @click="goToAnchorDestail(scope.row.star_info.split('(')[0])"
                />
                <div class="info" @click="goToAnchorDestail(scope.row.star_info.split('(')[0])">
                  <p class="anchor-name">
                    {{ scope.row.star_info.split('(')[0] }}<span class="view-icon"></span>
                  </p>
                  <p class="anthor-id">{{ scope.row.id }}</p>
                  <p class="anthor-category">
                    {{ scope.row.star_info.split('(')[1].split(')')[0] }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="funs_num" label="粉丝数" align="right" width="90">
            <template v-slot="scope"> {{ scope.row.funs_num }}万 </template>
          </el-table-column>
          <el-table-column prop="funs_image" label="粉丝画像" min-width="120">
            <template v-slot="scope">
              <div class="fans-portrait" @click="goToFans(scope.row.star_info.split('(')[0])">
                {{ scope.row.funs_image }}
                <span class="view-icon"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pv" label="内容观看次数" align="right">
            <template v-slot="scope">
              {{ scope.row.pv || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="ipv" label="内容引导进店次数" align="right">
            <template v-slot="scope">
              <div class="into-store-count">
                {{ scope.row.ipv || '-' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="主播成本" align="right">
            <template v-slot="scope">
              <div class="anchor-cost" v-if="scope.row.cost[0] !== 0 && scope.row.cost[1] !== 0">
                <template v-if="scope.row.cost[1] !== 0">
                  <span>混播:</span>
                  <p>￥{{ scope.row.cost[1] }}</p>
                </template>
                <template v-if="scope.row.cost[0] !== 0">
                  <span>专场:</span>
                  <p>￥{{ scope.row.cost[0] }}</p>
                </template>
              </div>
              <div class="anchor-cost" v-else>-</div>
            </template>
          </el-table-column>
          <template #empty>
            <div class="empty">
              <img src="@/assets/img/anchor_nodata.png" />
              <p>居然一个人也没有？！</p>
            </div>
          </template>
        </el-table>
        <div class="selected-anchors" style="width: calc(32% - 13px); float: right">
          <div class="selected-header">
            <span class="label-text"
              >已选主播：<em>{{ anchorsSelectedData.length }}人</em></span
            >
            <el-button
              class="clear-selected-anchors-btn"
              type="text"
              icon="el-icon-delete"
              @click="clearAllSelectedData"
              >全部移除</el-button
            >
          </div>
          <div class="selected-list" v-if="anchorsSelectedData.length > 0">
            <div v-for="(item, index) in anchorsSelectedData" class="anchor-info" :key="index">
              <img class="avatar" :src="item.pic_url" />
              <div class="info">
                <p class="anchor-name">{{ item.star_info.split('(')[0] }}</p>
                <p class="anthor-id">{{ item.id }}</p>
                <p class="anthor-category">{{ item.star_info.split('(')[1].split(')')[0] }}</p>
              </div>
              <span class="delete-btn" @click="onDeleteSelectedData(index)">
                <i class="el-icon-delete"></i>
              </span>
            </div>
          </div>
          <div class="no-data" v-if="anchorsSelectedData.length === 0">
            <div class="placeholder"></div>
            <p>从左侧列表选择主播</p>
          </div>
        </div>
      </div>
      <div class="footer-btns">
        <template v-if="planStatus === 0">
          <el-button type="primary" size="small" @click="generatePlan">下一步生成方案</el-button>
          <el-button
            size="small"
            v-if="$route.query.from === 'createRequirement'"
            @click="backLastStep"
            >返回上一步</el-button
          >
          <el-button size="small" @click="saveDraft">保存草稿</el-button>
        </template>
        <template v-if="planStatus === 1">
          <el-button type="primary" size="small" @click="generatePlan">下一步生成方案</el-button>
          <el-button size="small" @click="backRequirementDetail">取消</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import steps from '@/views/brand/component/steps';
import {
  getCategories,
  getAnchors,
  saveRequirementPlan,
  requirementDetail,
  getPlanDetail,
} from '@/api/brand';
import { RouterNameProjectManage } from '@/const/router';

export default {
  name: 'matchanchor',
  components: {
    steps,
  },
  data() {
    return {
      anchorsData: [
        // {
        //   index: 1,
        //   anchor: '非诚勿扰女嘉宾婉婉',
        //   anchor_id: '7658969091',
        //   avatar: 'http://gw2.alicdn.com/tfscom/tuitui/TB2S1ViahvC11Bjy1zdXXXPcVXa_!!0-guide.jpg_310x310.jpg',
        //   category: '个护',
        //   fans_number: 100,
        //   fansPortrait: '偏女性/85后/杭州市女装/女士精品家庭主妇',
        //   viewCount: 5000,
        //   intoStoreCount: 864,
        //   anchorCost: 2000
        // }
      ],
      anchorsSelectedData: [],
      cate: [],
      // 选中子的分类
      selectedSubCate: [],
      // 三角形小角标距离左侧
      triangleLeftDiscount: 0,
      subOptionsTopDiscount: 0,
      // 是否展开二级菜单
      isCollapse: '',
      // 选中的条件
      conditions: {
        category: '',
        subCategories: [],
        fansNumber: {
          min: null,
          max: null,
        },
        age: [],
        gander: '',
        viewCount: '7',
        intoStoreCount: '7',
        name: '',
      },
      // 自定义粉丝数
      CustomFansNumber: {
        min: '',
        max: '',
      },
      // 加载中
      loading: false,
      // 需求详情，可以传递到下一个页面
      requirementDetail: null,
      // 方案状态 status 1：已匹配，无法修改
      planStatus: 1,
    };
  },
  async mounted() {
    // 获取分类
    const res = await getCategories();
    if (res.status === 200 && res.data.success) {
      this.cate = res.data.data;
    }
    // 获取需求信息
    try {
      const detail = await requirementDetail({
        requirement_id: this.$route.query.rid,
      });
      if (detail.status === 200 && detail.data.success) {
        this.requirementDetail = detail.data.data;
      } else {
        this.$message({
          showClose: true,
          message: detail.data.message || '数据返回有误',
          type: 'warning',
        });
      }
    } catch (error) {
      this.$message({
        showClose: true,
        message: '请求失败，稍后重试',
        type: 'error',
      });
    }
    // 如果传入planid，就获取详情
    if (this.$route.query.pid) {
      await this.getPlanInfoById(this.$route.query.pid);
    } else {
      this.planStatus = 0;
    }
    // 如果是上一个页面返回
    try {
      const data = sessionStorage.getItem('anchors');
      if (data) {
        const info = JSON.parse(data);
        // 判断是否属于同一个需求的数据
        if (info.requirement && this.$route.query.rid === info.requirement.requirement_id) {
          this.anchorsSelectedData = info.anchors;
        } else {
          sessionStorage.clear();
        }
      }
    } catch (error) {
      return this.$message({
        showClose: true,
        message: '本地数据获取出错',
        type: 'error',
      });
    }
    // 首次加载
    this.handleSearchIconClick();
  },
  computed: {
    // 计算粉丝数量范围
    computeFansNumberText() {
      if (this.conditions.fansNumber.min && this.conditions.fansNumber.max) {
        return this.conditions.fansNumber.min + '-' + this.conditions.fansNumber.max + '万';
      } else if (this.conditions.fansNumber.min && !this.conditions.fansNumber.max) {
        return this.conditions.fansNumber.min + '万以上';
      } else if (!this.conditions.fansNumber.min && this.conditions.fansNumber.max) {
        return this.conditions.fansNumber.max + '万以下';
      } else {
        return '';
      }
    },
  },
  methods: {
    // 点击大类
    onPrimaryCategoryClick(e) {
      const currentBtn = e.currentTarget;
      this.collapseSubOption(currentBtn.offsetTop + 38);
      setTimeout(() => {
        this.triangleLeftDiscount = currentBtn.offsetLeft - 115 + currentBtn.clientWidth / 2;
        this.isCollapse = currentBtn.dataset.index;
        this.subOptionsTopDiscount = currentBtn.offsetTop + 38;
      }, 100);
      const subCate = this.cate.find(item => item[0] === e.currentTarget.innerText);
      this.selectedSubCate = subCate[1];

      // 保存大类
      // 清空小类
      if (this.conditions.category !== e.currentTarget.innerText) {
        this.conditions.category = subCate[0];
        this.conditions.subCategories = [];
      }

      this.handleSearchIconClick();
    },
    // 选择全部大类
    onAllCategoriesClick() {
      this.conditions.category = '';
      this.conditions.subCategories = [];
      this.collapseSubOption();
      this.handleSearchIconClick();
    },
    // 点击小类
    onSubCategoryClick(e) {
      if (this.conditions.subCategories.includes(e.currentTarget.innerText)) {
        this.conditions.subCategories = this.conditions.subCategories.filter(
          item => item !== e.currentTarget.innerText,
        );
      } else {
        this.conditions.subCategories.push(e.currentTarget.innerText);
      }
      this.handleSearchIconClick();
    },
    // 点击收起
    onCollapseClick() {
      this.collapseSubOption();
    },
    // 年龄多选
    onAgeClick(e) {
      if (this.conditions.age.includes(e.currentTarget.innerText)) {
        this.conditions.age = this.conditions.age.filter(
          item => item !== e.currentTarget.innerText,
        );
      } else if (e.currentTarget.innerText === '不限') {
        this.conditions.age = [];
      } else {
        this.conditions.age.push(e.currentTarget.innerText);
      }
      this.handleSearchIconClick();
    },
    // 选择性别
    onGanderSelected(e) {
      this.conditions.gander =
        e.currentTarget.innerText === '不限' ? '' : e.currentTarget.innerText;
      this.handleSearchIconClick();
    },
    // 粉丝数单选
    onFansNumberClick(min, max) {
      // if (e.currentTarget.innerText !== '不限') {
      //   this.conditions.fansNumber = e.currentTarget.innerText
      // } else {
      //   this.conditions.fansNumber = ''
      // }
      this.conditions.fansNumber = {
        min: min,
        max: max,
      };
      this.CustomFansNumber = { max: '', min: '' };
      this.handleSearchIconClick();
    },
    // 自定义粉丝数
    onCustomFansNumber() {
      if (this.CustomFansNumber.min === '' && this.CustomFansNumber.max === '') {
        this.$message({
          showClose: true,
          message: '请填写粉丝数范围',
          type: 'warning',
        });
      } else {
        this.conditions.fansNumber = {
          min: parseInt(this.CustomFansNumber.min, 10),
          max: parseInt(this.CustomFansNumber.max, 10),
        };
        this.handleSearchIconClick();
      }
    },
    /*
      收起二级菜单方法（公用）currentTopDiscount: 当前距离顶部的距离，和上一次data.subOptionsTopDiscount 的距离对比
      若距离相等，说明在同一行，无需隐藏子菜单；若不在同一行，就需要隐藏前一个状态的子菜单
    */
    collapseSubOption(_currentTopDiscount) {
      this.isCollapse = '';
    },
    // 内容观看次数
    onViewCountChange() {
      this.handleSearchIconClick();
    },
    // 内容引导进店次数
    onIntoStoreCountChange() {
      this.handleSearchIconClick();
    },
    // 清空所有已选条件
    clearAllConditions() {
      this.conditions = {
        category: '',
        subCategories: [],
        fansNumber: '',
        age: [],
        gander: '',
        viewCount: '7',
        intoStoreCount: '7',
        name: '',
      };
      this.CustomFansNumber = { min: '', max: '' };
      this.collapseSubOption();
      this.handleSearchIconClick();
    },
    // 关闭已选tag category subCategories fansNumber age gander
    handleTagClose(type, value) {
      // 清除大类，同时清除小类
      if (type === 'category') {
        this.conditions.category = '';
        this.conditions.subCategories = [];
        this.collapseSubOption();
      } else if (type === 'fansNumber') {
        this.conditions.fansNumber = '';
        this.CustomFansNumber = { min: '', max: '' };
      } else if (type === 'name') {
        this.conditions.name = '';
      } else {
        this.conditions[type] = value ? this.conditions[type].filter(item => item !== value) : '';
      }
      this.handleSearchIconClick();
    },
    // 当一行数据被选中时
    onRowSelected(selection, row) {
      // v3
      // 遍历左侧选中的selection是否存在于右侧，存在忽略，不存在插入
      if (selection.find(item => item.id === row.id)) {
        // 选中事件
        selection.every(item => {
          const isExit = this.anchorsSelectedData.find(elem => elem.id === item.id);
          // debugger
          if (!isExit) {
            this.anchorsSelectedData.push(item);
          }
          return true;
        });
      } else {
        // 取消选中事件
        this.anchorsSelectedData = this.anchorsSelectedData.filter(item => item.id !== row.id);
      }
    },
    // 全选事件
    onSelectedAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        // 遍历原先左侧数据，若存在于右侧，则从右侧删除
        this.anchorsData.every(item => {
          this.anchorsSelectedData = this.anchorsSelectedData.filter(elem => elem.id !== item.id);
          return true;
        });
      } else {
        // 全选
        this.anchorsData.every(item => {
          const isExit = this.anchorsSelectedData.find(elem => elem.id === item.id);
          if (!isExit) {
            this.anchorsSelectedData.push(item);
          }
          return true;
        });
      }
    },
    // 删除选中的数据
    onDeleteSelectedData(index) {
      const row = this.anchorsData.find(item => item.id === this.anchorsSelectedData[index].id);
      this.$refs.multipleTable.toggleRowSelection(row, false);
      this.anchorsSelectedData.splice(index, 1);
    },
    // 全部移除
    clearAllSelectedData() {
      this.anchorsSelectedData = [];
      this.$refs.multipleTable.clearSelection();
    },
    // 搜索
    async handleSearchIconClick() {
      const fansAge = this.conditions.age.map(item => {
        if (item === '00后') return 0;
        if (item === '95后') return 1;
        if (item === '85后') return 2;
        if (item === '75后') return 3;
        if (item === '65后') return 4;
      });
      let fansGender = null;
      if (this.conditions.gander === '偏男性') {
        fansGender = 1;
      }
      if (this.conditions.gander === '偏女性') {
        fansGender = 2;
      }
      const form = {
        // "cost_max": 1,
        // "cost_min": 1,
        cat: this.conditions.category,
        sub_cat: JSON.stringify(this.conditions.subCategories),
        fans_num_min: this.conditions.fansNumber.min,
        fans_num_max: this.conditions.fansNumber.max,
        fans_age: JSON.stringify(fansAge),
        fans_gender: fansGender,
        pv_type: parseInt(this.conditions.viewCount, 10),
        ipv_type: parseInt(this.conditions.intoStoreCount, 10),
        name: this.conditions.name,
      };
      this.loading = true;
      try {
        const res = await getAnchors(form);
        if (res.status === 200 && res.data.success) {
          this.anchorsData = res.data.data.map((item, index) => {
            item['index'] = index + 1;
            return item;
          });
          // 每次查询结果时，把右侧已经选取的数据，在左侧重新勾选上
          setTimeout(() => {
            this.anchorsData.every(item => {
              const isExit = this.anchorsSelectedData.find(elem => elem.id === item.id);
              if (isExit) {
                this.$refs.multipleTable.toggleRowSelection(item, true);
              }
              return true;
            });
          }, 300);
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '接口请求出错',
            type: 'warning',
          });
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: '请求失败，稍后重试',
          type: 'error',
        });
      }
      this.loading = false;
    },
    // 保存草稿
    saveDraft() {
      if (this.anchorsSelectedData.length === 0) {
        return this.$message({
          showClose: true,
          message: '请选择至少1个主播',
          type: 'warning',
        });
      }
      if (this.$route.query.pid) {
        this.saveDraftFunction();
      } else {
        this.$prompt('请输入方案名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,24}$/,
          inputErrorMessage: '字符长度24个字以内',
        })
          .then(({ value }) => {
            this.saveDraftFunction(value);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消保存草稿',
            });
          });
      }
    },
    // 请求保存草稿
    async saveDraftFunction(planName) {
      try {
        const formdata = {
          requirement_id: this.$route.query.rid,
          commit: 0,
          star_ids: JSON.stringify(this.anchorsSelectedData.map(item => item.id)),
        };
        if (this.$route.query.pid) formdata['plan_id'] = this.$route.query.pid;
        if (planName) formdata['plan_name'] = planName;
        const res = await saveRequirementPlan(formdata);
        if (res.status === 200 && res.data.success) {
          // 清空上个页面保存的数据
          sessionStorage.removeItem('anchors');
          // 跳转需求详情页面
          this.$router.push({
            name: RouterNameProjectManage.marketing.demand.demand,
            params: { id: this.$route.query.rid },
          });
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '接口请求出错',
            type: 'warning',
          });
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: '请求失败，稍后重试',
          type: 'error',
        });
      }
    },
    // 下一步生成方案
    generatePlan() {
      if (this.anchorsSelectedData.length === 0) {
        return this.$message({
          showClose: true,
          message: '请选择至少1个主播',
          type: 'warning',
        });
      }
      sessionStorage.setItem(
        'anchors',
        JSON.stringify({
          requirement_id: this.$route.query.rid,
          anchors: this.anchorsSelectedData,
          requirement: this.requirementDetail,
        }),
      );
      this.$router.push({
        name: RouterNameProjectManage.marketing.generateplan,
        query: {
          pid: this.$route.query.pid,
        },
      });
    },
    // 根据方案id获取方案详情
    async getPlanInfoById(planId) {
      try {
        const res = await getPlanDetail({
          plan_id: planId,
        });
        // debugger
        if (res.status === 200 && res.data.success) {
          this.anchorsSelectedData = res.data.data.stars;
          this.planStatus = res.data.data.status;
          // debugger
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '接口请求出错',
            type: 'warning',
          });
        }
      } catch (error) {
        // debugger
        this.$message({
          showClose: true,
          message: '请求失败，稍后重试',
          type: 'error',
        });
      }
    },
    // 返回上一步
    backLastStep() {
      this.$router.replace({
        name: RouterNameProjectManage.marketing.demand.create,
        params: {
          rid: this.$route.query.rid,
        },
      });
    },
    // 返回需求详情
    backRequirementDetail() {
      this.$router.push({
        name: RouterNameProjectManage.marketing.demand.demand,
        params: { id: this.$route.query.rid },
      });
    },
    // 跳转主播详情
    goToAnchorDestail(starName) {
      // 新窗口打开/star-personal?starName=
      window.open('/star-personal?starName=' + starName, '_blank');
    },
    // 跳转粉丝画像/star-personal?starName=xxx&tab=fans
    goToFans(starName) {
      window.open('/star-personal?tab=fans&starName=' + starName, '_blank');
    },
    // 点击主播头像，跳转商品管理
    goToGoodsManage(starName) {
      // window.open('/data/product-info?starName=' + starName, '_blank')
      window.open('/operation-center/product-management?starName=' + starName, '_blank');
    },
    /* eslint-disable indent */
    anthorTipInfo() {
      return (
        <div class="format-title">
          主播信息
          <el-tooltip
            content="点击头像跳转至主播详情模块，点击主播信息跳转至商品管理模块"
            placement="top"
            effect="dark"
          >
            <i class="el-icon-question" style="color: #bbb; margin-left: 5px;" />
          </el-tooltip>
        </div>
      );
    },
  },
};
</script>
