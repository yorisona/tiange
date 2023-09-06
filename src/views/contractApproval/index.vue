<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#contract-approval {
  .contract-approval-header {
    border-radius: 10px;
    height: 60px;
    margin-bottom: 10px;
    background: #fff;
    text-align: center;
    .header-menu {
      display: inline-block;
      // width: 120px;
      line-height: 60px;
      margin: 0 10px;
      padding: 0 15px;
      text-align: center;
      color: var(--text-des-color);
      font-size: 16px;
      position: relative;
      cursor: pointer;
      font-weight: 600;
      &.active {
        color: $color-primary;
        &::after {
          position: absolute;
          bottom: 18px;
          left: 0;
          background: $color-yellow;
        }
      }
    }
  }
}
</style>

<template>
  <div id="contract-approval">
    <div class="contract-approval-header">
      <span
        :class="['header-menu', { active: activeMenu === 'customerContract' }]"
        @click="activeMenu = 'customerContract'"
        >客户合同</span
      >
      <span
        :class="['header-menu', { active: activeMenu === 'supplierContract' }]"
        @click="activeMenu = 'supplierContract'"
        >供应商合同</span
      >
      <span
        :class="['header-menu', { active: activeMenu === 'appurtenance' }]"
        @click="activeMenu = 'appurtenance'"
        >附件</span
      >
    </div>
    <customer-contract v-show="activeMenu === 'customerContract'" />
    <medium-contract v-show="activeMenu === 'supplierContract'" />
    <contract-attachment v-show="activeMenu === 'appurtenance'" />
  </div>
</template>

<script>
import CustomerContract from './components/customerContract';
import MediumContract from './components/mediumContract';
import ContractAttachment from './components/contractAttachment';

export default {
  name: 'ContractApproval',
  components: {
    CustomerContract,
    MediumContract,
    ContractAttachment,
    // ReviewDialog,
    // ApproveProgress
  },
  data() {
    return {
      activeMenu: 'customerContract',
    };
  },
  computed: {},
  async mounted() {
    /* do nth */
  },
  activated() {
    /* do nth */
  },
  methods: {},
};
</script>
