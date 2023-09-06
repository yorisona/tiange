<template>
  <common-dialog
    ref="addGatherDateDialog"
    :isAppendToBody="true"
    title="登记收款时间"
    :width="460"
    :isfooter="true"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
  >
    <div class="gather-date">
      <el-form ref="add_achievement_from" label-width="90px">
        <el-form-item label="收款时间:" prop="gather_date">
          <el-date-picker
            :clearable="false"
            size="small"
            placeholder="请选择收款时间"
            style="width: 100%"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model="gather_date"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </common-dialog>
</template>

<script>
import { saveAhievementGatherDate } from '@/api/cooperative';

export default {
  name: 'addGatherDate',
  props: ['id'],
  data() {
    return {
      isDisable: false,
      name: '',
      gather_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 收款时间
    };
  },
  methods: {
    // 显示
    show(row, edit) {
      this.$refs.addGatherDateDialog.dialogOpen();
      if (edit) {
        this.gather_date = row.gather_date;
      } else {
        this.gather_date = new Date().toLocaleDateString().replace('/', '-').replace('/', '-');
      }
    },
    // 弹窗确认操作
    handledialogSubmit() {
      saveAhievementGatherDate({
        gather_date: this.gather_date
          ? this.gather_date
          : new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
        achievement_id: this.id,
      }).then(res => {
        if (res.data.success) {
          this.$message.success('保存成功');
          this.$emit('upload-close2');
          this.$refs.addGatherDateDialog.dialogClose();
        } else {
          this.$message.error('保存失败');
        }
      });
    },
    // 关闭弹窗
    handledialogCancel() {
      /* do nth */
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 0;
}
.gather-date {
  padding: 30px 40px;
}
/deep/ .el-form-item__label:before {
  content: '*';
  color: var(--error-color);
  margin-right: 4px;
}
</style>
