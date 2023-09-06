<!--
 * @Description: 生成方案
 * @Author: 白青
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2019-09-06 16:25:17
 * @LastEditors: 白青
 -->
<style lang="scss" scoped>
#generate-plan {
  .plan-wrap {
    .plan-header {
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      color: #666;
      font-size: 16px;
      background: #fbfbfb;
      font-weight: 600;
    }
    .plan-info {
      height: 70px;
      line-height: 70px;
      background: #fff;
      padding: 0 12px;
      color: #666;
      border-bottom: #eff0f1 solid 1px;
      label {
        display: inline-block;
        margin-right: 42px;
        .el-input {
          display: inline-block;
          width: 400px;
          span {
            font-size: 12px;
            margin-right: 10px;
          }
        }
        span em {
          font-style: normal;
          color: var(--text-des-color);
        }
      }
    }
    .anchor-list {
      background: #fff;
      padding: 0 12px;
      .list-title {
        height: 61px;
        line-height: 61px;
        color: #666;
        font-size: 14px;
        span {
          color: #5c82ff;
          font-size: 14px;
          font-weight: 600;
        }
      }
      .list-main {
        overflow: hidden;
        padding-top: 1px;
        padding-bottom: 100px;
        .anchor {
          width: calc(20% - 42px);
          display: block;
          padding: 20px;
          border: #eaeef1 solid 1px;
          float: left;
          margin-top: -1px;
          margin-right: -1px;
          transition: all 0.3s;
          &:hover {
            background: #f7f7f7;
          }
          .avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            vertical-align: top;
            margin-top: 10px;
          }
          .anchor-info {
            display: inline-block;
            line-height: 20px;
            margin-left: 9px;
            width: calc(100% - 84px);
            .anchor-name {
              color: #666;
              font-size: 14px;
              height: 20px;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .anchor-id {
              color: #666;
              font-size: 12px;
              height: 20px;
            }
            .anchor-cate {
              color: #b0b0b0;
              font-size: 12px;
              height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    .plan-footer {
      text-align: center;
      background: #fff;
      padding-bottom: 30px;
    }
  }
}
</style>

<template>
  <div id="generate-plan">
    <steps :active="2" />
    <div class="plan-wrap">
      <div class="plan-header">生成方案</div>
      <div class="plan-info">
        <label>
          <span>方案名称：</span>
          <el-input v-model="planName" placeholder="请输入方案名称" size="small">
            <template #suffix>
              <span v-show="planName === ''">列如：双十一阿玛尼口红直播方案</span>
            </template>
          </el-input>
        </label>
        <label>
          <span
            >方案生成日期：<em>{{ computDate }}</em></span
          >
        </label>
        <label>
          <span
            >方案生成人：<em>{{ userName }}</em></span
          >
        </label>
      </div>
      <div class="anchor-list">
        <div class="list-title">
          已选主播：<span>{{ anchors.length }}人</span>
        </div>
        <div class="list-main">
          <div class="anchor" v-for="(anchor, idx) in anchors" :key="idx">
            <img :src="anchor.pic_url" class="avatar" />
            <div class="anchor-info">
              <p class="anchor-name">{{ anchor.star_info.split('(')[0] }}</p>
              <p class="anchor-id">{{ anchor.id }}</p>
              <p class="anchor-cate">{{ anchor.star_info.split('(')[1].split(')')[0] }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="plan-footer">
        <el-button type="primary" @click="generatePlan">{{ generateBtnText }}</el-button>
        <el-button @click="backLastStep">返回上一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import steps from '@/views/brand/component/steps';
// import { getUserInfo } from '@/api/auth'
import { showProDateFormat } from '@/utils/format';
import { getPlanDetail, saveRequirementPlan } from '@/api/brand';
import { RouterNameProjectManage } from '@/const/router';

export default {
  name: 'generatePlan',
  components: {
    steps,
  },
  data() {
    return {
      planinfo: null,
      anchors: [],
      userName: '',
      planName: '',
      lastPageSavedData: null,
    };
  },
  computed: {
    computDate() {
      return showProDateFormat(Date.now());
    },
    generateBtnText() {
      if (this.planinfo && this.planinfo.status === 0) {
        return '生成方案';
      } else if (this.planinfo && this.planinfo.status === 1) {
        return '重新生成方案';
      } else {
        return '生成方案';
      }
    },
  },
  mounted() {
    // 获取上个页面存储的数据
    try {
      const data = sessionStorage.getItem('anchors');
      const info = JSON.parse(data);
      this.anchors = info.anchors;
      this.lastPageSavedData = info;
    } catch (error) {
      return this.$message({
        showClose: true,
        message: '本地数据获取出错',
        type: 'error',
      });
    }
    // 如果是修改 获取方案信息
    if (this.$route.query.pid) {
      this.getPlanInfoById(this.$route.query.pid);
    }
    // 获取当前用户名
    // getUserInfo()
    //   .then(response => {
    //     let data = response.data
    //     if (data.success) {
    //       this.userName = data.data.username
    //     }
    //   })
    const userinfo = this.$store.getters['user/getUserInfo'];
    this.userName = userinfo.username;
  },
  methods: {
    // 根据方案id获取方案详情
    async getPlanInfoById(planId) {
      try {
        const res = await getPlanDetail({
          plan_id: planId,
        });
        if (res.status === 200 && res.data.success) {
          this.planinfo = res.data.data;
          this.planName = this.planinfo.plan_name;
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
    // 生成方案
    async generatePlan() {
      // console.log(this.lastPageSavedData)
      if (this.planName === '') {
        return this.$message({
          showClose: true,
          message: '请输入方案名称',
          type: 'warning',
        });
      }
      const formdata = {
        plan_name: this.planName,
        requirement_id: this.lastPageSavedData.requirement.requirement_id,
        commit: 1,
        star_ids: JSON.stringify(this.anchors.map(item => item.id)),
      };
      if (this.$route.query.pid) formdata['plan_id'] = this.$route.query.pid;

      try {
        const res = await saveRequirementPlan(formdata);
        if (res.status === 200 && res.data.success) {
          // 弹出提示窗
          this.$confirm('成功生成方案', '提示', {
            confirmButtonText: '继续新增',
            cancelButtonText: '查看方案',
            type: 'success',
            iconClass: 'success-icon',
            customClass: 'g-plan-success',
          })
            .then(() => {
              this.$router.replace({
                path:
                  '/brand/match-anchor?rid=' + this.lastPageSavedData.requirement.requirement_id,
              });
              // 清空上个页面保存的数据
              sessionStorage.removeItem('anchors');
            })
            .catch(() => {
              // 跳转需求详情页面
              this.$router.replace({
                name: RouterNameProjectManage.marketing.demand.demand,
                params: {
                  id: this.lastPageSavedData.requirement.requirement_id,
                },
              });
              // 清空上个页面保存的数据
              sessionStorage.removeItem('anchors');
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
    // 返回上一步
    backLastStep() {
      const query = {
        rid: this.lastPageSavedData.requirement.requirement_id,
      };
      if (this.$route.query.pid) query['pid'] = this.$route.query.pid;
      this.$router.replace({
        // path: '/brand/match-anchor?rid=' + this.lastPageSavedData.requirement.requirement_id
        name: '匹配主播',
        query: query,
      });
    },
  },
};
</script>
