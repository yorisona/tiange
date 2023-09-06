<template>
  <div
    class="cutomer-detail-container"
    style="margin-top: 12px; padding-top: 5px"
    v-if="ChatRecord !== null"
  >
    <div class="detail-content">
      <sub-panel :title="'客户洽谈记录'" :iserect="true">
        <div class="qt-container">
          <el-button
            v-show="UserRoles.includes(RIGHT_CODE.add_conversation)"
            size="small"
            class="btn-blue"
            type="primary"
            @click="addRecord"
            >新增洽谈</el-button
          >
          <span class="qt-text" style="margin-left: 10px">总洽谈次数：</span>
          <span class="qt-num">{{ ChatRecord.total }}</span>
          <span class="qt-text">&nbsp;次</span>
          <a
            v-show="ChatRecord.total > 0"
            href="javascript:;"
            class="qt-more"
            @click="getMoreRecord"
            >查看更多记录<i class="iconfont iconxiangyou" style="font-size: 14px !important"></i
          ></a>
          <el-table
            stripe
            :data="
              ChatRecord !== null && ChatRecord.data !== null ? ChatRecord.data.slice(0, 1) : []
            "
            border
            style="width: 100%; margin-top: 12px"
            :header-cell-style="{
              background: 'var(--table-thead-th-bg-color)',
              height: '42px',
              color: 'var(--text-second-color)',
              fontWeight: 'bold',
            }"
          >
            <template #empty>
              <table-no-data :isvertical="false" :title="'还没有洽谈记录哦 ~'"></table-no-data>
            </template>
            <el-table-column prop="conversation_date" label="洽谈时间" width="150">
            </el-table-column>
            <el-table-column prop="conversation_content" label="洽谈内容">
              <template #default="{ row }">
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  :disabled="row.conversation_content.length <= 20"
                  :content="row.conversation_content"
                >
                  <template slot="reference">
                    <span v-if="row.conversation_content.length > 20">{{
                      row.conversation_content.substring(0, 20) + '...'
                    }}</span>
                    <span v-else>{{ row.conversation_content }}</span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备 注">
              <template #default="{ row }">
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  :disabled="row.note.length <= 20"
                  :content="row.note"
                >
                  <template slot="reference">
                    <span v-if="row.note.length > 20">{{ row.note.substring(0, 20) + '...' }}</span>
                    <span v-else>{{ row.note }}</span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="follower" label="跟进人" width="200"> </el-table-column>
          </el-table>
        </div>
      </sub-panel>
    </div>
    <!-- 新增洽谈 -->
    <AddChatRecord ref="AddChatRecord" />
    <!-- 更多洽谈记录 -->
    <ChatRecordList ref="ChatRecordList" />
  </div>
</template>

<script>
// 预备废弃
import AddChatRecord from '../../chat_record/AddChatRecord';
import ChatRecordList from '../../chat_record/ChatRecordList';
import { mapGetters, mapActions } from 'vuex';
import { RIGHT_CODE } from '@/const/roleCode';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'CustomerChatRecord',
  components: {
    AddChatRecord,
    ChatRecordList,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      RIGHT_CODE,
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
    // 新增洽谈
    addRecord() {
      this.$refs.AddChatRecord.show();
    },
    // 查看更多洽谈记录
    getMoreRecord() {
      this.$refs.ChatRecordList.show();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
/deep/ .el-table__header-wrapper {
  border-bottom: 1px solid var(--table-border-color);
}
.detail-content {
  // padding: 0 26px 30px;
  padding: 0 26px 30px 0;
  .qt-container {
    margin-top: 10px;
    margin-left: 43px;
  }
  .qt-text {
    color: #666666;
    font-size: 14px;
  }
  .qt-num {
    color: #396fff;
    font-weight: 600;
    font-size: 16px;
  }
  .qt-more {
    margin-left: 10px;
    color: #396fff;
    font-size: 14px;
  }
  /deep/ .el-table {
    border-right-width: 0;
    border-radius: 10px;
  }
}
.btn-blue {
  width: 100px;
  height: 36px;
}
// 客户洽谈记录表格
.detail-content[data-v-740fec68] .el-table {
  border-radius: 10px;
  font-size: 14px !important;
}
// 客户洽谈记录表格字体
/deep/ .el-table th > .cell {
  font-size: 14px;
  color: #666666;
}
</style>
