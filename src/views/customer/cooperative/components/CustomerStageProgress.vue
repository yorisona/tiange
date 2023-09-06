<template>
  <div class="csp-container">
    <div v-if="isvertical" class="vertical-container">
      <div class="line"></div>
      <div class="line-current" :style="`height: ${28 * stage - 14}px`"></div>
      <ul class="list">
        <template v-for="(item, index) in customerStageList">
          <li
            class="item"
            :class="{ sign: index < stage, current2: index === stage - 1 }"
            :key="index"
            v-if="index >= 0"
          >
            <span class="icon"></span>
            <span class="text">{{ item.value }}</span>
          </li>
        </template>
      </ul>
    </div>
    <div v-else class="horizontal-container">
      <div v-if="issimple" style="width: 60%; margin-left: -5%">
        <el-steps :active="stage - 1" align-center>
          <el-step class="simplestep" v-for="item in customerStageList" :key="item.type"></el-step>
        </el-steps>
      </div>
      <div v-else style="width: 100%" class="horizontal-detail">
        <p class="title">合作进度</p>
        <el-steps :active="stage" align-center>
          <el-step
            @click.native="() => handleStepClick(item.type, index)"
            v-for="(item, index) in customerStageList"
            :key="item.type"
            :title="item.value"
            :description="item.subtitle"
          >
            <template #title>
              <p>
                <span
                  :class="{
                    overtitle: stage > item.type,
                    pretitle: stage < item.type,
                    active_blue: index === isactive,
                  }"
                  >{{ item.value }}</span
                >
              </p>
            </template>
            <template #description>
              <div
                :class="{
                  'step-description1': stage > item.type,
                  'step-description': stage < item.type,
                }"
              >
                <span
                  :class="{
                    overtext: stage > item.type,
                    pretitle: stage < item.type,
                    active_blue: index === isactive,
                  }"
                  >{{ item.subtitle }}</span
                >

                <div v-if="judgeEditPowers(item.type)">
                  <tg-icon
                    name="ico-edit"
                    @click.stop="() => handleOperateClick(item.type, 'edit')"
                    style="font-size: 20px"
                  />
                </div>
                <div v-else-if="judgeAddPowers(item.type)">
                  <tg-icon
                    name="ico-edit"
                    @click.stop="() => handleOperateClick(item.type, 'add')"
                    style="font-size: 20px"
                  />
                </div>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
import { customerStageList } from '@/const/cooperative';
import { RIGHT_CODE } from '@/const/roleCode';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'CustomerStageProgress',
  props: ['isvertical', 'stage', 'issimple'],
  mixins: [CooperativeStore],
  data() {
    return {
      isactive: null,
      RIGHT_CODE,
      customerStageList,
    };
  },
  watch: {
    // 监听步骤变化，样式跟随
    stage() {
      this.isactive = this.stage - 1;
    },
  },
  methods: {
    // 样式跟随
    activeShow() {
      this.isactive = this.stage - 1;
    },
    // 点击步骤跳转详情
    handleStepClick(val, index) {
      if (this.stage >= val) {
        this.$emit('step-operate', {
          stage: val,
          type: 'detail',
        });
      }
      //点击进度样式跟随，未完成不可点击
      if (index < this.stage) {
        this.isactive = index;
      }
    },
    // 点击操作
    handleOperateClick(val, type) {
      this.$emit('step-operate', {
        stage: val,
        type,
      });
    },
    // 判断权限
    judgeEditPowers(type) {
      const _result = type <= this.stage;
      switch (type) {
        case 1: // 意向客户
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 2: // 确认合作
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 3: // 执行项目
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 4: // 执行结束
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 5: // 数据入库
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        default:
          return _result;
      }
    },
    // 判断权限
    judgeAddPowers(type) {
      const _result = type === this.stage + 1;
      switch (type) {
        case 2: // 确认合作
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 3: // 执行项目
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 4: // 执行结束
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        case 5: // 数据入库
          return _result && this.UserRoles.includes(RIGHT_CODE.update_cooperation);
        default:
          return _result;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
/deep/ .el-step.is-center .el-step__description {
  padding-left: 0%;
  padding-right: 0%;
}
.csp-container {
  .vertical-container {
    position: relative;
    margin-left: 7px;
    margin-top: 5px;
    .line {
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 140px;
      background: #d6d6d6;
    }
    .line-current {
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      background: $color-primary;
    }
    .list {
      position: relative;
      .item {
        height: 28px;
        display: flex;
        .icon {
          margin-left: -3px;
          margin-top: 10px;
          width: 5px;
          height: 5px;
          border: 1px solid #d6d6d6;
          border-radius: 50%;
          background: #fff;
        }
        .text {
          margin-left: 14px;
          line-height: 28px;
          color: #aaaaaa;
        }
        &.sign {
          .icon {
            border-color: $color-primary;
          }
          .text {
            color: #666666;
          }
        }
        &.current2 {
          .icon {
            border-color: $color-primary;
            background: $color-primary;
          }
          .text {
            color: #666666;
          }
        }
      }
    }
  }
  .horizontal-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    /deep/ .el-steps {
      cursor: pointer;
      .is-success {
        .is-text {
          border-radius: 50%;
          border: 7px solid;
          width: 57px !important;
          height: 57px;
          background-color: #d5d9de;
          color: #fff;
          font-size: 14px;
        }
      }
      .is-process {
        color: #c0c4cc;
        border-color: #c0c4cc;
        .is-text {
          border-radius: 50%;
          border: 7px solid;
          width: 37px;
          height: 37px;
          background-color: #d5d9de;
          color: #fff;
          font-size: 14px;
        }
      }
      .el-step__line {
        height: 2px;
        top: 20px;
      }
      .is-finish {
        .is-text {
          border: 7px solid;
          border-radius: 50%;
          width: 37px;
          height: 37px;
          background-color: $color-primary;
          color: #fff;
          font-size: 16px;
        }
      }
      .el-step__title {
        font-size: 15px;
        font-weight: 600;
      }
      .is-wait {
        .is-text {
          border-radius: 50%;
          border: 7px solid;
          width: 37px;
          height: 37px;
          background-color: #d5d9de;
          color: #fff;
          font-size: 14px;
        }
      }
      .el-step__description {
        // width: 7rem;
        margin-left: 0.5rem;
      }
    }
    .simplestep {
      /deep/ .is-process {
        color: $color-primary;
        border-color: $color-primary;
        .is-text {
          background-color: $color-primary;
        }
      }
      /deep/ .is-finish {
        // color: #c0c4cc !important;
        border-color: #c0c4cc;
        .is-text {
          background-color: #d5d9de;
        }
      }
    }
    .horizontal-detail {
      padding-bottom: 20px;
      padding-top: 15px;
      .title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        margin-left: 24px;
        margin-bottom: 10px;
      }
      .step-description1 {
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon-bianji::before {
          color: var(--text-des-color);
        }
        i {
          margin-top: 10px;
        }
      }
      .step-description {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      // 标题执行结束后
      .overtitle {
        color: #a5a8ab;
      }
      // 文本执行结束后
      .overtext {
        color: #a5a8ab;
      }
      // 未执行的
      .pretitle {
        color: #a5a8ab !important;
      }
      .icon-bianji {
        font-size: 33px !important;
        // border-radius: 50%;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        cursor: pointer;
        border: none !important;
      }
      .iconjindutianjia {
        font-size: 24px !important;
        border-radius: 50%;
        width: 33px;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        cursor: pointer;
      }
    }
    .over {
      background-color: #eaefff !important;
      border: none !important;
      // color: $color-primary !important;
    }
  }
}
.el-step__description,
.is-finish {
  .is-text {
    width: 50px !important;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    color: #a5a8ab;
    white-space: nowrap;
  }
}
.active_blue {
  color: #396fff !important;
}
</style>
