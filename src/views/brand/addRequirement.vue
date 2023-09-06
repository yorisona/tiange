<!--
 * @Description: 新增需求
 * @Author: 白青
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2019-09-06 16:25:10
 * @LastEditors: 白青
 -->
<style lang="scss" scoped>
#addRequirement {
  .requirement-setting {
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04);
    .setting-header {
      background: #fbfbfb;
      color: #666;
      font-size: 16px;
      line-height: 50px;
      font-weight: 600;
      padding-left: 20px;
    }
    .setting-content {
      background: #fff;
      overflow: hidden;
      .setting-form {
        width: 510px;
        margin: 45px auto;
        /deep/ .el-form-item__error {
          top: -20px;
        }
        .el-select {
          width: 100%;
        }
      }
    }
    .setting-footer {
      background: #fff;
      text-align: center;
    }
  }
  p.tip {
    color: #ccc;
    line-height: initial;
    font-size: 13px;
    margin-bottom: -14px;
    margin-top: 5px;
  }
}
</style>

<template>
  <div id="addRequirement">
    <steps :active="0" />
    <div class="requirement-setting">
      <div class="setting-header">需求设置</div>
      <div class="setting-content">
        <el-form
          class="setting-form"
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-position="right"
          label-width="110px"
        >
          <el-form-item label="品牌名称：" prop="ppname">
            <!-- <el-input v-model="ruleForm.ppname"></el-input> -->
            <el-select
              v-model="ruleForm.ppname"
              filterable
              placeholder="请选择"
              @change="brandChangeHandle"
              @blur="brandBlurHandle"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.brand_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需求名称：" prop="xqname">
            <el-input
              v-model="ruleForm.xqname"
              placeholder="请输入需求名称"
              @input="requirementNameTyping"
            ></el-input>
            <p class="tip">例如：双十一专场_2019-11-11</p>
          </el-form-item>
          <el-form-item label="预算：" prop="ys">
            <el-input v-model="ruleForm.ys" placeholder="请输入预算金额">
              <template #prepend>￥</template>
            </el-input>
          </el-form-item>
          <el-form-item label="需求提报时间：">
            <span>{{ computDate }}</span>
          </el-form-item>
          <el-form-item label="提报人：">
            <span>{{ userName }}</span>
          </el-form-item>
          <div class="setting-footer">
            <el-button type="primary" @click="submitForm('ruleForm', 'next')"
              >下一步匹配主播</el-button
            >
            <el-button @click="submitForm('ruleForm', 'save')">保存草稿</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import steps from '@/views/brand/component/steps';
import { showProDateFormat } from '@/utils/format';
// import { getUserInfo } from '@/api/auth'
import {
  getBrandList,
  createRequirement,
  requirementDetail,
  updateRequirement,
  validateRequirementName,
} from '@/api/brand';
import { RouterNameProjectManage } from '@/const/router';

// 预算自定义验证
const validateBudget = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入预算金额'));
  }
  value = Number(value);
  if (typeof value === 'number' && !isNaN(value)) {
    if (value.toString().includes('.')) {
      callback(new Error('请输入整数'));
    } else if (value < 0) {
      callback(new Error('预算金额不能负数'));
    } else if (value > 999999999) {
      callback(new Error('预算金额不能超过999999999元'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入阿拉伯数字'));
  }
};

export default {
  name: 'addRequirement',
  components: {
    steps,
  },
  data() {
    return {
      ruleForm: {
        ppname: '',
        xqname: '',
        ys: null,
      },
      options: [],
      rules: {
        ppname: [{ required: true, message: '请输入品牌名称', trigger: 'change' }],
        xqname: [
          {
            required: true,
            validator: this.validateRequirementName,
            trigger: 'blur',
          },
          { max: 24, message: '长度小于 25 个字', trigger: 'blur' },
        ],
        ys: [
          {
            required: true,
            validator: validateBudget, // 自定义验证
            trigger: 'blur',
          },
        ],
      },
      userName: '',
      // 需求名称重复判断标志，是否判断过
      requiementNameRepeatTipIsShowed: false,
    };
  },
  mounted() {
    // getUserInfo()
    //   .then(response => {
    //     let data = response.data
    //     if (data.success) {
    //       this.userName = data.data.username
    //     }
    //   })
    const userinfo = this.$store.getters['user/getUserInfo'];
    this.userName = userinfo.username;
    // 获取品牌列表
    this.getBrandList();
    // 如果是下一步匹配主播返回的状态，根据方案id获取信息
    if (this.$route.query.rid) {
      this.getRequirementDetail(this.$route.query.rid);
    }
  },
  computed: {
    computDate() {
      return showProDateFormat(Date.now());
    },
  },
  methods: {
    // 需求名称自定义验证
    async validateRequirementName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入需求名称'));
      } else if (this.ruleForm.ppname) {
        if (this.requiementNameRepeatTipIsShowed) {
          callback();
        } else {
          const res = await validateRequirementName({
            brand_id: this.ruleForm.ppname,
            requirement_name: value,
          });

          if (res.status === 200 && res.data.success) {
            callback();
          } else {
            this.$alert(res.data.message, '温馨提示', {
              confirmButtonText: '我知道了',
            });
            this.requiementNameRepeatTipIsShowed = true;
          }
        }
      } else {
        callback();
      }
    },
    // 提交 / 保存草稿
    submitForm(formName, type) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 如果query中有rid说明从匹配主播页面返回，则修改需求
          if (this.$route.query.rid) {
            this.modifyRequirementDetail(type);
          } else {
            this.saveRequirement(type);
          }
        } else {
          return false;
        }
      });
    },
    // 获取品牌列表
    async getBrandList(keywords) {
      try {
        const res = await getBrandList({
          name: keywords,
          page_size: 0,
        });

        if (res.status === 200 && res.data.success) {
          this.options = res.data.data.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '请求接口出错',
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
    // 保存新建需求
    async saveRequirement(type) {
      try {
        const res = await createRequirement({
          requirement_name: this.ruleForm.xqname,
          brand_id: this.ruleForm.ppname,
          budget: this.ruleForm.ys,
        });
        if (res.status === 200 && res.data.success) {
          if (type === 'next') {
            this.$router.push({
              name: RouterNameProjectManage.marketing.matchAnchor,
              query: {
                rid: res.data.data,
                from: 'createRequirement',
              },
            });
          } else if (type === 'save') {
            this.$message({
              showClose: true,
              message: '保存草稿成功',
              type: 'success',
              onClose: () => {
                this.$router.push({
                  name: RouterNameProjectManage.marketing.demand.demand,
                });
              },
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '请求接口出错',
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
    // 获取需求详情
    async getRequirementDetail(rid) {
      try {
        const res = await requirementDetail({
          requirement_id: rid,
        });

        if (res.status === 200 && res.data.success) {
          this.ruleForm.ppname = res.data.data.brand_id;
          this.ruleForm.xqname = res.data.data.requirement_name;
          this.ruleForm.ys = res.data.data.budget;
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '请求接口出错',
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
    // 修改需求
    async modifyRequirementDetail(type) {
      try {
        const res = await updateRequirement({
          requirement_id: this.$route.query.rid,
          requirement_name: this.ruleForm.xqname,
          brand_id: this.ruleForm.ppname,
          budget: this.ruleForm.ys,
        });

        if (res.status === 200 && res.data.success) {
          if (type === 'next') {
            this.$router.push({
              name: RouterNameProjectManage.marketing.matchAnchor,
              query: { rid: this.$route.query.rid, from: 'createRequirement' },
            });
          } else if (type === 'save') {
            this.$message({
              showClose: true,
              message: '保存草稿成功',
              type: 'success',
              onClose: () => {
                this.$router.push({
                  name: RouterNameProjectManage.marketing.demand.demand,
                });
              },
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message || '请求接口出错',
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
    // 需求名称输入回调
    requirementNameTyping() {
      this.requiementNameRepeatTipIsShowed = false;
    },
    // 品牌名称失焦检测
    async brandChangeHandle() {
      this.requiementNameRepeatTipIsShowed = false;
      if (this.ruleForm.ppname && this.ruleForm.xqname) {
        const res = await validateRequirementName({
          brand_id: this.ruleForm.ppname,
          requirement_name: this.ruleForm.xqname,
        });

        if (!res.data.success) {
          this.$alert(res.data.message, '温馨提示', {
            confirmButtonText: '我知道了',
          });
          this.requiementNameRepeatTipIsShowed = true;
        }
      }
    },
    brandBlurHandle() {
      /* do nth */
    },
  },
};
</script>
