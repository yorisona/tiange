<template>
  <div style="padding-bottom: 10px">
    <div class="yxkh-container">
      <div class="note-dis">
        <sub-panel :title="'其他需求'" :iserect="true">
          <p class="note" v-if="CooperationDetail.note">{{ CooperationDetail.note }}</p>
          <table-no-data v-else :isvertical="false" :title="'还没有需求描述哦~'"></table-no-data>
        </sub-panel>
      </div>
    </div>
    <div class="yxkh-container">
      <div class="note-dis" style="padding-bottom: 30px">
        <sub-panel :title="'方案'" :iserect="true">
          <p class="note" v-if="CooperationDetail.plan">
            <el-table
              :data="bindPlans(CooperationDetail.plan)"
              border
              stripe
              style="width: 100%; margin-top: 12px"
              :header-cell-style="{
                background: 'var(--table-thead-th-bg-color)',
                height: '42px',
                color: 'var(--text-second-color)',
                fontWeight: '600',
              }"
            >
              <template #empty>
                <table-no-data :isvertical="false" :title="'还没有上传方案~'"></table-no-data>
              </template>
              <el-table-column prop="name" label="附件名称">
                <template #default="{ row }">
                  <a class="download1" :href="row.src" download
                    ><i class="iconfont iconfujian"></i> {{ row.name }}</a
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template #default="{ row }">
                  <a class="download" :href="row.src" download>下载</a>
                </template>
              </el-table-column>
            </el-table>
          </p>
          <table-no-data v-else :isvertical="false" :title="'还没有上传方案~'"></table-no-data>
        </sub-panel>
      </div>
    </div>
  </div>
</template>

<script>
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'CooperationDetail',
  mixins: [CooperativeStore],
  data() {
    return {};
  },
  methods: {
    bindPlans(plans) {
      const _newplans = [];
      if (plans.length > 0) {
        plans.map(p => {
          const _obj = {
            src: p,
          };
          const _temp = p.split('/');
          _obj.name = _temp[_temp.length - 1];
          _newplans.push(_obj);
        });
      }
      return _newplans;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.yxkh-container {
  width: 100%;
  background-color: #f2f6f9;
  padding: 10px;
  margin-bottom: 10px;
  .note-dis {
    background-color: #fff;
    padding: 10px 56px 10px 24px;
    border-radius: 4px;
    .note {
      margin-top: 5px;
      margin-left: 35px;
      font-size: 14px;
      line-height: 25px;
    }
    .download {
      color: $color-primary;
    }
    .download1 {
      color: $color-primary;
      text-decoration: none;
    }
  }
  /deep/ .el-table {
    border-right-width: 0;
    border-radius: 10px;
  }
  /deep/ .el-table th.is-leaf {
    border-bottom: 1px solid var(--table-border-color);
  }
}
.iconfujian {
  color: var(--text-des-color);
}
</style>
