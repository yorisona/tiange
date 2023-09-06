<template>
  <div class="main-box">
    <!-- <el-button @click="pre" style="width: 200px; height: 50px; margin-left: 20px">pre</el-button> -->
    <slot name="pre">
      <i v-show="showicon" class="el-icon-arrow-left pre" @click="pre"></i>
    </slot>
    <div class="show-area" ref="show-area" :style="{ width: `100%`, height: `100%` }">
      <div class="scroll-area">
        <!-- 设置margin，使内容 有从无到有的出现效果 -->
        <div class="slot-container">
          <slot></slot>
        </div>
      </div>
    </div>
    <slot name="next">
      <i v-show="showicon" class="el-icon-arrow-right next" @click="next"></i>
    </slot>
    <!-- <el-button @click="next" style="width: 200px; height: 50px; margin-left: 20px">next</el-button> -->
  </div>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
  props: {
    // 自定义跑马灯宽度
    width: {
      type: Number,
      default() {
        return 400;
      },
    },
    // 自定义跑马灯高度
    height: {
      type: Number,
      default: 50,
    },
    showicon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showArea: {},
      rafId: null,
      items: ['文字1  ', '文字2  ', '文字3  ', '文字4  ', '文字5  '],
    };
  },
  methods: {
    next() {
      // this.showArea.scrollLeft += 120;
      if (!this.rafId && this.showArea.scrollLeft < this.showArea.scrollWidth) {
        const flag = this.showArea.scrollLeft + this.width;
        this.scrollChange(flag, 'next');
        // debounce(this.scrollChange(flag), 200);
      }
    },
    pre() {
      // this.showArea.scrollLeft += 120;
      if (!this.rafId && this.showArea.scrollLeft >= 0) {
        const flag = this.showArea.scrollLeft - this.width;
        this.scrollChange(flag, 'pre');
        // debounce(this.scrollChange(flag), 200);
      }
    },
    scrollChange(flag, type) {
      let myWidth = this.showArea.scrollWidth - this.showArea.clientWidth;
      const fn = () => {
        if (type === 'next') {
          let needWidth = myWidth - this.showArea.scrollLeft;
          if (
            this.showArea.scrollLeft >= flag ||
            needWidth < 5
            // this.showArea.scrollLeft * 2 >= this.showArea.scrollWidth
          ) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
          } else {
            this.showArea.scrollLeft += 8;
            this.rafId = requestAnimationFrame(fn);
          }
        } else {
          if (this.showArea.scrollLeft <= flag || this.showArea.scrollLeft <= 0) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
          } else {
            this.showArea.scrollLeft -= 8;
            this.rafId = requestAnimationFrame(fn);
          }
        }
      };
      this.rafId = requestAnimationFrame(fn);
    },
  },
  mounted() {
    // this.showArea = document.querySelector('.show-area');
    this.showArea = this.$refs['show-area'];
  },
});
</script>

<style lang="scss" scoped>
.show-area {
  // height: 50px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  .scroll-area {
    padding: 0 10px;
    width: 100%;
    display: inline-block;
    //     display: flex;
    // justify-content: center;
    .slot-container {
      display: inline-block;
    }
  }
}
.main-box {
  width: 100%;
  // height: 230px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 3%;
  .pre {
    position: absolute;
    left: 0;
    top: 42%;
    font-size: 29px;
    font-weight: bold;
    &:hover {
      color: var(--theme-color);
    }
  }
  .next {
    position: absolute;
    right: 0;
    top: 42%;
    font-size: 29px;
    font-weight: bold;
    &:hover {
      color: var(--theme-color);
    }
  }
}
</style>
