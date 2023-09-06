import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      UserInfo: 'user/getUserInfo',
      UserRoles: 'user/getUserRole',
      CustomerDetail: 'cooperative/CustomerDetail',
      CooperationDetail: 'cooperative/CooperationDetail',
      CooperationdetailStatus: 'cooperative/CooperationdetailStatus',
    }),
  },
  created() {
    /* do nth */
  },
  methods: {
    ...mapActions({
      ResetCurrentAERecordList: 'cooperative/ResetCurrentAERecordList',
      GetCustomerDetail: 'cooperative/GetCustomerDetail',
      GetCooperationDetail: 'cooperative/GetCooperationDetail',
      SetCooperationdetailStatus: 'cooperative/SetCooperationdetailStatus',
    }),
  },
};
