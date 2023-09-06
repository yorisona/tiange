<template>
  <div class="step-wrapper">
    <div class="step-title">客户阶段</div>
    <div class="detail-step-wrapper">
      <div class="detail-step-line"></div>
      <div class="detail-step-line-current">
        <el-row :gutter="0">
          <el-col :span="2" v-for="(item, index) in lineArr" :key="item">
            <div class="line-item" :class="{ current: index <= active * 2 }"></div>
          </el-col>
        </el-row>
      </div>
      <div class="detail-step">
        <el-row :gutter="0">
          <template v-for="(item, index) in customerLevelList">
            <el-col :span="4" :key="item.type" v-if="index > 0">
              <div
                class="step-item"
                :class="{ current: active > index - 1, active: active === index - 1 }"
              >
                <span class="title">{{ item.value }}</span>
                <i class="icon-circle"></i>
                <span class="description">{{ stepArr[item.type] }}阶段</span>
              </div>
            </el-col>
          </template>

          <!-- <el-col :span="4">
            <div class="step-item" :class="{current:active>1, active: active==1}">
              <span class="title">意向客户</span>
              <i class="icon-circle"></i>
              <span class="description">二阶段</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="step-item" :class="{current:active>2, active: active==2}">
              <span class="title">执行项目</span>
              <i class="icon-circle"></i>
              <span class="description">三阶段</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="step-item" :class="{current:active>3, active: active==3}">
              <span class="title">执行结束</span>
              <i class="icon-circle"></i>
              <span class="description">四阶段</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="step-item" :class="{current:active>4, active: active==4}">
              <span class="title">数据入库</span>
              <i class="icon-circle"></i>
              <span class="description">五阶段</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="step-item" :class="{current:active>5, active: active==5}">
              <span class="title">项目完成</span>
              <i class="icon-circle"></i>
              <span class="description">六阶段</span>
            </div>
          </el-col> -->
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { customerLevelList } from '@/utils/format';
export default {
  name: 'detailStep',
  props: {
    level: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      stepArr: ['-', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      customerLevelList,
      lineArr: new Array(12),
    };
  },
  computed: {
    active() {
      return this.level - 1;
    },
  },
  created() {
    /* do nth */
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.step-wrapper {
  margin-top: 18px;
  background: #f9f9f9;
  overflow: hidden;
  height: 169px;
  margin: 18px 30px 0;
  .step-title {
    margin-top: 30px;
    font-size: 14px;
    color: #666666;
    text-align: center;
    font-weight: 600;
  }
  .detail-step-wrapper {
    margin-top: 65px;
    position: relative;
    padding: 0 30px;
    .detail-step-line {
      height: 2px;
      background: #d6d6d6;
    }
    .detail-step-line-current {
      margin-top: -2px;
      height: 2px;
      .line-item {
        height: 2px;
        &.current {
          background: $color-primary;
        }
      }
    }
    .detail-step {
      //   display: flex;
      position: relative;
      .step-item {
        text-align: center;
        flex: 1;
        .title {
          line-height: 28px;
          display: block;
          font-size: 14px;
          color: #aaaaaa;
          width: 76px;
          margin: -48px auto 0;
        }
        .icon-circle {
          margin-top: 9px;
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid #dbe3fc;
          border-radius: 50%;
          position: relative;
          background: #fff;
          &::before {
            content: '';
            width: 6px;
            height: 6px;
            display: block;
            background: $color-primary;
            border-radius: 50%;
            position: absolute;
            top: 5px;
            left: 5px;
          }
        }
        .description {
          line-height: 1;
          margin-top: 11px;
          display: block;
          font-size: 12px;
          color: #666666;
        }
        &.current {
          .title {
            color: #666;
          }
        }
        &.active {
          .title {
            position: relative;
            color: #fff;
            background: $color-primary;
            border-radius: 2px;
            &::before {
              position: absolute;
              top: 28px;
              left: 32px;
              content: '';
              width: 0;
              height: 0;
              border-width: 6px 6px;
              border-style: solid;
              border-color: $color-primary transparent transparent;
            }
          }
        }
      }
    }
  }
}
</style>
