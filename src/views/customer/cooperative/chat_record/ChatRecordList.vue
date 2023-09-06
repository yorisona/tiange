<template>
  <div>
    <el-dialog
      class="customer-dialog"
      :visible.sync="visible"
      ref="ChatRecordListDialog"
      width="990"
      @dialog-cancel="handledialogCancel"
    >
      <template #title> <span>洽谈记录</span> </template>
      <div class="chatrecordlist-container">
        <p class="title" v-if="CustomerDetail !== null">
          <span>【店铺】</span>
          <span class="sname">{{ CustomerDetail.shop_name }}</span>
        </p>
        <el-table stripe :data="ChatRecord !== null ? ChatRecord.data : []" :border="true">
          <template #empty>
            <table-no-data :isvertical="false" :title="'还没有洽谈记录哦'"></table-no-data>
          </template>
          <el-table-column prop="conversation_date" label="洽谈时间" width="150"></el-table-column>
          <el-table-column prop="conversation_content" label="洽谈内容">
            <template #default="{ row }">
              <el-popover
                placement="top-start"
                width="300"
                trigger="hover"
                :disabled="row.conversation_content.length <= 12"
                :content="row.conversation_content"
              >
                <template slot="reference">
                  <span v-if="row.conversation_content.length > 12">{{
                    row.conversation_content.substring(0, 12) + '...'
                  }}</span>
                  <span v-else>{{ row.conversation_content }}</span>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="note" width="210" label="备 注">
            <template #default="{ row }">
              <el-popover
                placement="top-start"
                width="300"
                trigger="hover"
                :disabled="row.note.length <= 12"
                :content="row.note"
              >
                <template slot="reference">
                  <span v-if="row.note.length > 12">{{ row.note.substring(0, 12) + '...' }}</span>
                  <span v-else>{{ row.note }}</span>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="follower" label="跟进人" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template v-slot="{ row }">
              <div v-if="judgeCurrentPower(row.add_by_id)">
                <el-tooltip placement="left" effect="light" content="编辑">
                  <tg-icon
                    name="ico-edit"
                    v-show="UserRoles.includes(RIGHT_CODE.update_conversation)"
                    @click.native="editChatRecord(row)"
                  />
                </el-tooltip>
                <el-tooltip placement="right" effect="light" content="删除">
                  <tg-icon
                    name="ico-delete"
                    v-show="UserRoles.includes(RIGHT_CODE.del_conversation)"
                    class="mgl-10"
                    @click.native="delChatRecord(row)"
                  />
                </el-tooltip>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="contract-pagination mgt-10"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total,  prev, pager, next, sizes, jumper"
          :total="ChatRecord !== null ? ChatRecord.total : 0"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-dialog>
    <AddChatRecord ref="AddChatRecordDialog" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { deleteConversation } from '@/api/cooperative';
import AddChatRecord from './AddChatRecord';
import { RIGHT_CODE } from '@/const/roleCode';
import CurrentUserPower from '../mixin/CurrentUserPower';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default {
  name: 'ChatRecordList',
  components: {
    AddChatRecord,
  },
  mixins: [CurrentUserPower, CooperativeStore],
  data() {
    return {
      RIGHT_CODE,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
      },
      visible: false,
    };
  },
  computed: {
    ...mapGetters({
      ChatRecord: 'cooperative/ChatRecord',
    }),
  },
  methods: {
    ...mapActions({
      GetConversation: 'cooperative/GetConversation',
    }),
    // 显示
    show() {
      // this.$refs.ChatRecordListDialog.dialogOpen();
      this.visible = true;
      this.getConversationByPage();
      this.judgeCurrentPower(999);
    },
    // 获取分页数据
    getConversationByPage() {
      this.GetConversation({
        customer_id: this.CustomerDetail.id || 0,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
      });
    },
    // 翻页
    handleCurrentChange() {
      this.getConversationByPage();
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getConversationByPage();
    },
    // 关闭弹窗
    handledialogCancel() {
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
      };
      this.getConversationByPage();
    },
    // 编辑记录
    editChatRecord(row) {
      const page = JSON.parse(JSON.stringify(this.pagination));
      this.$refs.AddChatRecordDialog.show(row, page);
    },
    // 删除记录
    async delChatRecord(row) {
      const msg = '此操作将永久删除数据，是否继续？';
      const result = await AsyncConfirm({ root: this }, msg);

      if (result) {
        deleteConversation({ conversation_id: row.conversation_id }).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            this.getConversationByPage();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.chatrecordlist-container {
  .title {
    margin-bottom: 15px;
    .sname {
      color: $color-primary;
    }
  }
  // 去除更多洽谈记录表格border
  /deep/ .el-table td,
  .el-table th {
    border: none;
  }
  /deep/ .el-table {
    border-right-width: 0;
  }
  /deep/ .el-table--border th {
    border: none;
  }
  /deep/ .el-table--border {
    border: none;
    border-radius: 10px;
  }
  /deep/ .el-table__header-wrapper {
    border: none;
    border-radius: 10px;
  }
}
:focus {
  outline: 0;
}
</style>
