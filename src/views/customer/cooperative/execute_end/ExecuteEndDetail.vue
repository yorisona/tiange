<template>
  <div class="executeenddetail-container" v-if="CooperationDetail !== null">
    <div class="content">
      <sub-panel :title="'项目执行结果'" :iserect="true">
        <table-no-data
          class="success"
          v-if="CooperationDetail.end_type === 1"
          :isvertical="true"
          title="项目正常结束，等待数据入库~"
          :img="require('@/assets/img/cooperative/xt_nodata_success.png')"
        ></table-no-data>
        <table-no-data
          class="error"
          v-if="CooperationDetail.end_type === 2"
          :isvertical="true"
          title="项目意外终止！"
          :img="require('@/assets/img/cooperative/xt_nodata_error.png')"
          :subtitle="getContentInfo(CooperationDetail)"
        ></table-no-data>
      </sub-panel>
    </div>
  </div>
</template>

<script>
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'ExecuteEndDetail',
  mixins: [CooperativeStore],
  data() {
    return {};
  },
  methods: {
    getContentInfo(CooperationDetail) {
      if (CooperationDetail.end_detail) {
        if (CooperationDetail.end_detail.unexpected_terminate_type === '1') {
          // 补播
          return '补播';
        } else if (CooperationDetail.end_detail.unexpected_terminate_type === '2') {
          // 退款
          if (CooperationDetail.end_detail.unexpected_terminate_detail !== '') {
            return (
              '退款：退款金额：' + CooperationDetail.end_detail.unexpected_terminate_detail + '元'
            );
          } else {
            return '';
          }
        } else if (CooperationDetail.end_detail.unexpected_terminate_type === '3') {
          // 其他
          if (CooperationDetail.end_detail.unexpected_terminate_detail !== '') {
            return '其他：' + CooperationDetail.end_detail.unexpected_terminate_detail;
          } else {
            return '';
          }
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="less" scoped>
.executeenddetail-container {
  width: 100%;
  // background-color: #f2f6f9;
  // padding-top: 10px;
  .content {
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 24px;
    /deep/ .success > p {
      color: #16b793 !important;
      font-size: 16px !important;
    }
    /deep/ .success {
      img {
        width: 150px;
        height: 150px;
      }
    }
    /deep/ .error > p {
      color: #acbbce !important;
      font-size: 16px !important;
    }
    /deep/ .error {
      img {
        width: 150px;
      }
    }
    /deep/ .error {
      .subtitle {
        color: #7e8190 !important;
        font-size: 14px !important;
      }
    }
  }
}
</style>
