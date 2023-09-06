<template>
  <tg-block class="mgt-10" v-if="ContactList !== null">
    <div class="btns-line" style="margin-top: 8px">
      <tg-button type="primary" icon="ico-btn-add" v-show="Permission.canEdit" @click="addContact"
        >新增联系人</tg-button
      >
    </div>
    <!-- [表格] -->
    <el-table stripe :data="ContactList !== null ? ContactList.data : []" style="width: 100%">
      <template #empty>
        <span>该客户还没有联系人哦~</span>
      </template>
      <el-table-column
        prop="customer_name"
        label="联系人"
        header-align="left"
        align="left"
        minWidth="150"
      >
      </el-table-column>
      <el-table-column
        prop="wechat"
        label="手机号/微信"
        header-align="left"
        align="left"
        minWidth="350"
      >
        <template #default="{ row }">
          <span>{{ `${row.mobile ? row.mobile : '--'}/${row.wechat ? row.wechat : '--'}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wechat" label="录入人" header-align="left" align="left" minWidth="150">
        <template #default="{ row }">
          <p>{{ `${row.add_by_name}` }}</p>
          <p>{{ `${row.gmt_create.split(' ')[0]}` }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" minWidth="78">
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <tg-button
            type="link"
            v-if="Permission.canEdit && ShowEditBtn(scope.row)"
            @click="editContact(scope.row)"
            >编辑</tg-button
          >
        </template>
      </el-table-column>
    </el-table>
  </tg-block>
</template>

<script>
import { mapGetters } from 'vuex';
import { customerStageList } from '@/const/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';

export default {
  name: 'CustomerContactList',
  mixins: [CooperativeStore],
  setup(props, ctx) {
    const currentUser = ctx.root.$store.getters['user/getUserInfo'];

    const Permission = computed(() => {
      /** 客户列表/店铺详情 合作 */
      const canDelete = HasPermission(NEW_RIGHT_CODE.customer_collaboration_delete);
      const canEdit = HasPermission(NEW_RIGHT_CODE.customer_edit);

      return { canDelete, canEdit };
    });

    return { currentUser, Permission };
  },
  data() {
    return {
      customerStageList,
    };
  },
  computed: {
    ...mapGetters({
      ContactList: 'cooperative/ContactList',
    }),
  },
  methods: {
    // 新增合作
    addContact() {
      this.$emit('cooperation:create');
    },
    ShowEditBtn(row) {
      // 自己创建的联系人才可以编辑
      return this.currentUser.id === row.add_by;
    },
    editContact(row) {
      this.$emit('cooperation:edit', row);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
::v-deep .el-table thead {
  border-bottom: 1px solid red;
}
.detail-content {
  .hz-container {
    margin-top: 10px;
    margin-left: 50px;
  }
  .hz-table {
    margin-left: 50px;
    margin-top: 10px;
    .txt-stag {
      color: $color-primary;
      cursor: pointer;
      font-size: 16px;
    }
    .txt-dskamount {
      color: #ff731e;
    }
  }
}
.btn-blue {
  width: 100px;
  height: 36px;
}
.delete-kol-alert.el-message-box .el-message-box__content {
  height: initial;
}
.delete-kol-alert.el-message-box .el-message-box__content .el-message-box__message {
  top: 0;
}
.el-dialog__body {
  margin: 10px;
  background: #fff !important;
  border-radius: 10px;
}
.click_detail {
  color: var(--text-des-color);
  font-size: 14px;
  margin-left: 20px;
}
</style>
