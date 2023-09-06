<template>
  <div class="step-mini">
    <div class="line"></div>
    <div class="line-current" :style="`height:${28 * level - 14}px`"></div>
    <ul class="list">
      <template v-for="(item, index) in customerLevelList">
        <li
          class="item"
          :class="{ sign: index < level, current: index === level }"
          :key="index"
          v-if="index > 0"
        >
          <span class="icon"></span>
          <span class="text">{{ item.value }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { customerLevelList } from '@/utils/format';
export default {
  name: 'stepMini',
  props: {
    level: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      customerLevelList,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.step-mini {
  position: relative;
  margin-left: 23px;
  .line {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 168px;
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
      &.current {
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
</style>
