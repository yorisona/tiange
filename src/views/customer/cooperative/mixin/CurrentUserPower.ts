import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      userinfo: 'user/getUserInfo',
      CooperationDetail: 'cooperative/CooperationDetail',
    }),
  },
  created() {
    /* do nth */
  },
  methods: {
    // 判断当前用户权限
    judgeCurrentPower(userid: number) {
      // @ts-ignore
      const _userinfo = JSON.parse(JSON.stringify(this.userinfo));
      return _userinfo.id === userid;
    },
    // 判断执行AE权限
    judgeAEPower() {
      // @ts-ignore
      const _cooperationDetail = JSON.parse(JSON.stringify(this.CooperationDetail));
      // @ts-ignore
      const _userinfo = JSON.parse(JSON.stringify(this.userinfo));
      if (_cooperationDetail) {
        if (_cooperationDetail.ae && _cooperationDetail.ae.length > 0) {
          // @ts-ignore
          const _index = _cooperationDetail.ae.findIndex(a => a.ae_id === _userinfo.id);
          if (_index > -1) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
};
