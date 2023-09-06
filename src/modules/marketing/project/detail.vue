<template>
  <div class="tg-page-container tg-marketing-project-detail">
    <tg-card class="project-steps" :padding="[0, 18, 0, 18]">
      <tg-steps :steps="steps" :active="stepActiveNumber" />
    </tg-card>
    <tg-card class="project-detail mgt-12" :padding="[6, 0, 0, 0]" overflowInBody>
      <tg-tabs class="flex-none" :tabs="tabs" v-model="checkedTab" @change="onTabChange" bottom />
      <component :is="checkedTab" class="component-container" />
    </tg-card>
    <AeDialogModal
      :visible="AeDialogVisible"
      :ProjectAeList="ProjectAeList"
      @dialog:close="onAeDialogModalClose"
    />
    <ProjectExecuteFinishModal
      :visible="ProjectExecuteFinishVisible"
      @dialog:close="onProjectExecuteDialogModalClose"
    />
    <roll-back-project
      :visible.sync="rollBackProjectVisible"
      :projectInfo="rollBackProjectInfo"
      @save="onProjectRollBackSave"
    ></roll-back-project>
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
