<template>
  <StageProgressCardItems ref="stageProgressCardItems">
    <CooperationDetail v-show="CooperationdetailStatus === 1" />
    <ConfirmCooperationDetail v-show="CooperationdetailStatus === 2" />
    <ExecuteProjectDetail v-show="CooperationdetailStatus === 3" />
    <ExecuteEndDetail v-show="CooperationdetailStatus === 4" />
    <LiveData v-show="CooperationdetailStatus === 5" />
  </StageProgressCardItems>
</template>

<script>
import StageProgressCardItems from '../components/StageProgressCardItems';
import CooperationDetail from './CooperationDetail';
import ConfirmCooperationDetail from '../confirm_cooperation/ConfirmCooperationDetail';
import ExecuteProjectDetail from '../execute_project/ExecuteProjectDetail';
import ExecuteEndDetail from '../execute_end/ExecuteEndDetail';
import LiveData from '../data_entry/LiveData';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import PubSub from 'pubsub-js';

export default {
  name: 'CooperationDetailMain',
  components: {
    StageProgressCardItems,
    CooperationDetail,
    ConfirmCooperationDetail,
    ExecuteProjectDetail,
    ExecuteEndDetail,
    LiveData,
  },
  mixins: [CooperativeStore],
  data() {
    return {};
  },
  methods: {
    // 显示
    show(page) {
      this.$refs.stageProgressCardItems.show(page);
      if (this.CooperationdetailStatus === 5) {
        setTimeout(() => {
          PubSub.publish('addScene', true);
        }, 1200);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
</style>
