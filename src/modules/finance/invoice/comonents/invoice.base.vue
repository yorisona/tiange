<template>
  <div class="void-content-base">
    <div class="base-item">
      <p class="label">申请人：</p>
      <p class="value">{{ currentUserName }}</p>
    </div>
    <div class="base-item">
      <p class="label">开票时间：</p>
      <p class="value">{{ showProDateFormat(invoice_date * 1000, 'YYYY.MM.DD') }}</p>
    </div>
    <div class="base-item">
      <p class="label">发票号码：</p>
      <p class="value">{{ invoice_number }}</p>
    </div>
    <div class="base-item">
      <p class="label">发票代码：</p>
      <p class="value">{{ invoice_code }}</p>
    </div>
    <div class="base-item">
      <p class="label">开票金额负数：</p>
      <p class="value">{{ numberMoneyFormat(total_amount, 2) }}</p>
    </div>
    <div class="base-item">
      <p class="label">购买方：</p>
      <p class="value" style="max-width: 220px">
        {{ buyer_name || '--' }}
      </p>
    </div>
    <div class="base-item">
      <p class="label">纳税人识别号：</p>
      <p class="value">{{ buyer_tax_number }}</p>
    </div>
    <div class="base-item">
      <p class="label">业务部门：</p>
      <p class="value">
        <department-select clearable v-model="department_id"></department-select>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, ref, watch } from '@vue/composition-api';
import { showProDateFormat } from '@/utils/format';
import { numberMoneyFormat } from '@/utils/formatMoney';

export default defineComponent({
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const currentUserName = computed(() => {
      return ctx.root.$store.getters['user/getUserInfo'].username;
    });
    const department_id = ref(props.info.approval_department_id);
    watch(
      () => department_id.value,
      () => {
        ctx.emit('changeDepartId', department_id.value);
      },
      { deep: true },
    );
    return {
      department_id,
      currentUserName,
      showProDateFormat,
      numberMoneyFormat,
      ...toRefs(props.info),
    };
  },
});
</script>

<style scoped lang="less">
.void-content-base {
  display: grid;
  grid-template-columns: 280px 280px;
  grid-column-gap: 12px;
  padding: 12px 0 12px 24px;
  font-size: 12px;
  .base-item {
    line-height: 28px;
    display: flex;
    .label {
      color: var(--text-third-color);
    }
    .value {
      flex: 1;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      > div {
        margin-top: 2px;
        width: 204px;
        /deep/ .el-input--mini .el-input__inner {
          height: 24px;
          line-height: 22px;
        }
        /deep/ .el-input__suffix {
          top: 0;
        }
      }
    }
  }
}
</style>
