<template>
  <div class="executeprojectdetail-container">
    <div class="content" v-if="CooperationAE.length > 0 && CurrentAE !== null">
      <div class="header">
        <span style="font-size: 14px">AE跟单表：</span>
        <div class="medium-title">
          <tg-label
            :label="item.ae_name"
            :checked="item.ae_id === CurrentAE.ae_id"
            v-for="item in CooperationAE"
            :key="item.ae_id"
            @click="val => changeCurrentType(val, item)"
          />
        </div>
      </div>
      <!-- AE金额 -->
      <ExecuteAccount />
      <!-- AE跟单记录 -->
      <AEDocumentaryList />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ExecuteAccount from './ExecuteAccount';
import AEDocumentaryList from './AEDocumentaryList';

export default {
  name: 'ExecuteProjectDetail',
  components: {
    ExecuteAccount,
    AEDocumentaryList,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      CooperationAE: 'cooperative/CooperationAE',
      CurrentAE: 'cooperative/CurrentAE',
    }),
  },
  methods: {
    ...mapActions({
      GetCurrentAE: 'cooperative/GetCurrentAE',
    }),
    changeCurrentType(val, item) {
      this.GetCurrentAE(JSON.parse(JSON.stringify(item)));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.executeprojectdetail-container {
  width: 100%;
  background-color: #f2f6f9;
  // padding-top: 10px;

  .content {
    background-color: #fff;
    padding: 10px 24px;
    // border-radius: 10px;
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      border-bottom: #efefef solid 1px;
      padding-bottom: 10px;
      .medium-title {
        font-size: 0;
        text-align: center;
        background: #fff;
        .title {
          display: inline-block;
          width: 75px;
          height: 30px;
          color: var(--text-des-color);
          box-sizing: border-box;
          line-height: 30px;
          background: #fff;
          margin: 0 10px;
          cursor: pointer;
          font-size: 14px;
          span {
            display: inline-block;
          }
          &.current {
            position: relative;
            z-index: 0;
            font-size: 16px !important;
            &::after {
              display: block;
              content: '';
              width: 70%;
              height: 8px;
              border-radius: 6px;
              background: #ffce36;
              position: absolute !important;
              bottom: 4px;
              left: 11px;
              z-index: -1;
            }
          }
        }
      }
    }
  }
}
</style>
