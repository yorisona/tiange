<template>
  <section
    class="anchor-item"
    :class="{ selected: anchor.isSelect, chosen: isChose }"
    v-if="anchor.star_name"
  >
    <div class="anchor-avatar">
      <img :src="anchor.pic_url" :alt="anchor.star_name" />
    </div>
    <div class="anchor-text">
      <p class="nickname">{{ anchor.star_name }}</p>
      <p class="price">
        成本：{{ displayType === 0 ? anchor.star_mix_cost : anchor.star_special_cost }}
      </p>
      <p class="percent" title="最近15款平均销售额（元）/ 最近15款点击数（次）">
        <i class="gm-icon-percent"></i
        ><span
          >{{ anchor.sales_data }}&nbsp;/&nbsp;{{ anchor.click_num ? anchor.click_num : 0 }}</span
        >
      </p>
      <p class="number" v-if="anchor.isSelect || isChose" @click.stop>
        <span>场次：</span>
        <el-input-number
          size="mini"
          v-model="anchor.display_num"
          @change="handleChange"
          :min="1"
        ></el-input-number>
      </p>
    </div>
    <i class="anchor-tag" v-if="anchor.generate_way === 1"></i>
    <i class="el-icon-circle-check" v-if="anchor.isSelect"></i>
    <i
      class="el-icon-circle-check-outline"
      v-if="!isChose && !anchor.isSelect && anchor.generate_way === 0"
    ></i>
    <i
      class="el-icon-remove"
      @click.stop="del"
      v-if="isChose || (!anchor.isSelect && anchor.generate_way === 1)"
    ></i>
  </section>
</template>

<script>
export default {
  name: 'anchorItem',
  props: {
    anchor: {
      type: Object,
      default() {
        return {};
      },
    },
    // 已确定的主播
    isChose: {
      type: Number,
      default: 0,
    },
    // 价格区间index
    rangeIndex: {
      type: Number,
      default: 0,
    },
    // 主播index
    anchorIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    displayType() {
      return this.$store.state.requirement.displayType;
    },
  },
  created() {
    /* do nth */
  },
  methods: {
    handleChange(value) {
      if (this.isChose) {
        this.$emit('update', { method: 'update', anchor: this.anchor, number: value });
        return;
      }
      this.$store.commit('requirement/updateDisplayNum', {
        rangeIndex: this.rangeIndex,
        anchorIndex: this.anchorIndex,
        number: value,
      });
    },
    del() {
      this.$emit('del');
    },
  },
};
</script>
<style lang="less">
.anchor-text .number {
  .el-input-number--mini {
    width: 69px;
    .el-input-number__decrease,
    .el-input-number__increase {
      height: 20px;
      width: 20px;
      top: 3px;
    }
    .el-icon-minus,
    .el-icon-plus {
      margin-top: -2px;
      overflow: hidden;
    }
    .el-input__inner {
      height: 22px;
      padding: 0 20px;
      line-height: 20px;
    }
    .el-input--mini {
      height: 24px;
    }
  }
}
</style>

<style lang="less" scoped>
.anchor-item {
  width: 220px;
  height: 110px;
  border-radius: 2px;
  background: #f3f4f5;
  border: 1px solid #f3f4f5;
  font-size: 0;
  position: relative;
  .anchor-avatar {
    width: 50px;
    height: 50px;
    display: inline-block;
    vertical-align: top;
    margin: 30px 0 0 12px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .anchor-text {
    margin: 25px 0 0 12px;
    display: inline-block;
    font-size: 14px;
    width: 127px;
    line-height: 1;
    .nickname {
      font-size: 14px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .price {
      font-size: 12px;
      margin-top: 10px;
    }
    .percent {
      font-size: 12px;
      margin-top: 10px;
      .gm-icon-percent {
        opacity: 0.6;
        margin-right: 6px;
      }
      span {
        display: inline-block;
        vertical-align: top;
        margin-top: 1px;
        color: var(--text-des-color);
      }
    }
    .number {
      margin-top: 6px;
      span {
        font-size: 12px;
      }
    }
  }
  .anchor-tag {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 40px;
    height: 40px;
    background: url('../../../assets/img/icon-tag.png') no-repeat;
  }
  .el-icon-circle-check {
    position: absolute;
    top: 1px;
    right: 1px;
    font-size: 20px;
    color: #1890ff;
  }
  &.selected {
    border: 1px solid rgba(24, 144, 255, 1);
    box-shadow: 0px 0px 6px 0px rgba(24, 144, 255, 0.2);
    .anchor-text {
      margin-top: 12px;
    }
  }
  &.chosen {
    .anchor-text {
      margin-top: 12px;
    }
  }
  &:hover {
    .el-icon-remove {
      cursor: pointer;
      position: absolute;
      top: 1px;
      right: 1px;
      font-size: 20px;
      color: #f26467;
    }
  }
  .el-icon-circle-check-outline {
    position: absolute;
    top: 1px;
    right: 1px;
    font-size: 20px;
    color: #bfbfbf;
    display: none;
  }
  &:hover {
    .el-icon-circle-check-outline {
      display: block;
    }
  }
}
</style>
