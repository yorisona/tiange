<template>
  <div class="achievementindex-container">
    <AchievementCondition class="flex-none" @search="handleSearchAchievement" />
    <AchievementTable
      class="flex-none"
      v-loading="loading"
      :page="pagination"
      :dataSource="dataSource"
      @change-page="changePageHandle"
      @upload-handle="handleSearchAchievement"
      @exort="exortAchievement"
    />
  </div>
</template>

<script>
import AchievementCondition from './components/AchievementCondition';
import AchievementTable from './components/AchievementTable';
import { getAchievementList, exportAchievement } from '@/api/cooperative';

export default {
  name: 'AchievementIndex',
  components: {
    AchievementCondition,
    AchievementTable,
  },
  data() {
    return {
      pagination: {
        page_num: 1,
        num: 10,
        pageSizes: [10, 20, 30],
      },
      dataSource: {
        total: 0,
        data: [],
      },
      loading: false,
      search: null,
    };
  },
  created() {
    const { source, achievement } = this.$router.currentRoute.query;
    if (source !== undefined) {
      this.handleSearchAchievement({
        achievement_uid: achievement,
      });
    } else {
      this.handleSearchAchievement();
    }
  },
  methods: {
    // 改变页
    changePageHandle(data) {
      if (data.type === 'index') {
        this.pagination.page_num = data.data;
      }
      if (data.type === 'size') {
        this.pagination.num = data.data;
      }
      this.handleSearchAchievement(JSON.parse(JSON.stringify(this.search)), 'page');
    },
    resetPage() {
      this.pagination = {
        page_num: 1,
        num: 10,
        pageSizes: [10, 20, 30],
      };
    },
    // 查询业绩
    handleSearchAchievement(form, _type) {
      this.loading = true;
      if (_type !== 'page') this.resetPage();
      const page = JSON.parse(JSON.stringify(this.pagination));
      let params = { ...page };
      if (form) {
        params = Object.assign(params, form);
        this.search = form;
      } else {
        if (this.search !== null) {
          params = Object.assign(params, JSON.parse(JSON.stringify(this.search)));
        }
      }
      getAchievementList(params)
        .then(res => {
          if (res && res.data && res.data.success) {
            this.dataSource = res.data.data;
            this.loading = false;
          } else {
            this.dataSource = {
              total: 0,
              data: [],
            };
            this.$message.error(res.data.message ?? '数据获取失败');
            this.loading = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.dataSource = {
            total: 0,
            data: [],
          };
          this.$message.error('数据获取失败');
          this.loading = false;
        });
    },
    // 导出业绩
    exortAchievement(achievement_ids) {
      if (achievement_ids.length > 0) {
        achievement_ids = JSON.stringify(achievement_ids);
        exportAchievement({ achievement_ids });
      } else {
        const form = JSON.parse(JSON.stringify(this.search));
        exportAchievement(form);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.achievementindex-container {
  background-color: #f5f5f5;
}
</style>
