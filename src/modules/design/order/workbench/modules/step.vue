<template>
  <div class="progress-box">
    <div class="step-list" :style="globaStyle">
      <div
        v-for="(item, index) in stepList"
        :key="index"
        class="step-item"
        :class="{ active: item.active }"
      >
        <div class="step-item-content">
          <div
            v-if="item.title"
            class="step-item-content-title"
            :style="item.style"
            @click="$emit('click', item)"
          >
            {{ item.title }}
          </div>
          <div class="line" :style="item.lineStyle" v-if="index !== stepList.length - 1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    step: {
      type: Array,
      default: () => [],
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    stepList() {
      return this.step.map((item, index) => {
        return {
          ...item,
          active: index === this.active,
          style: {
            color: index <= this.active ? '#3d84ff' : 'var(--text-des-color)',
            background: index <= this.active ? 'rgba(61, 132, 255, 0.2)' : '#d9d9d9',
          },
          lineStyle: {
            background:
              index < this.active ? 'rgba(61, 132, 255, 0.4)' : 'rgba(153, 153, 153, 0.4)',
          },
        };
      });
    },
    globaStyle() {
      const columns = this.stepList.map((item, index) => {
        if (this.stepList.length === 1) {
          return '1fr';
        }
        if (index === this.stepList.length - 1) {
          return '64px';
        }
        return '1fr';
      });
      return {
        'grid-template-columns': `${columns.join(' ')}`,
      };
    },
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.progress-box {
  width: 100%;
  .step-list {
    display: grid;
    align-items: center;
    // justify-content: space-between;
    width: 100%;
    .step-item {
      display: flex;
      position: relative;
      .line {
        width: 100%;
        height: 2px;
        background: rgba(153, 153, 153, 0.4);
        flex: 1;
        margin: 8px;
        // position: absolute;
        // top: 12px;
        // left: -88px;
      }
      .step-item-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        .step-item-content-title {
          background: #d9d9d9;
          color: var(--text-des-color);
          width: 64px;
          height: 28px;
          line-height: 28px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 400;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
}
</style>
